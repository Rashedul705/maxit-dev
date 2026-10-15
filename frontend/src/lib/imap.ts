import { ImapFlow } from 'imapflow';
import { simpleParser, ParsedMail } from 'mailparser';
import EmailReplyParser from 'email-reply-parser';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';

// Concurrency and throttle guards
let isSyncInProgress = false;
let lastSyncTimestamp = 0;
const MIN_SYNC_INTERVAL_MS = 6000; // 6 seconds throttle between Gmail checks

export interface SyncResult {
  success: boolean;
  synced: number;
  skipped: number;
  unmatched: number;
  error?: string;
  alreadyRunning?: boolean;
}

/**
 * Strips HTML tags and decodes common entities to extract plain text
 */
function htmlToPlainText(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Fallback cleaner for email replies if parser misses headers
 */
function cleanQuotedFallback(text: string): string {
  if (!text) return '';
  const lines = text.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      /^On\s+.+wrote:$/i.test(trimmed) ||
      /^-+\s*Original Message\s*-+/i.test(trimmed) ||
      /^From:\s+/i.test(trimmed) ||
      /^_{10,}/.test(trimmed) ||
      /^-{5,}/.test(trimmed)
    ) {
      break;
    }
    if (trimmed.startsWith('>')) {
      continue;
    }
    result.push(line);
  }
  return result.join('\n').trim();
}

/**
 * Clean body by removing quoted older email and signature
 */
function cleanEmailBody(parsed: ParsedMail): string {
  let bodyText = (parsed.text || '').trim();
  if (!bodyText && parsed.html) {
    bodyText = htmlToPlainText(parsed.html);
  }

  if (!bodyText) return '';

  let cleaned = '';
  try {
    const ParserClass = (EmailReplyParser as any).default || EmailReplyParser;
    const parser = new ParserClass();
    cleaned = parser.parseReply(bodyText);
  } catch {
    cleaned = '';
  }

  if (!cleaned || !cleaned.trim()) {
    cleaned = cleanQuotedFallback(bodyText);
  }

  cleaned = cleaned.trim();
  if (!cleaned) {
    cleaned = bodyText.trim();
  }

  // Trim and limit to a sensible length (5000 characters)
  if (cleaned.length > 5000) {
    cleaned = cleaned.substring(0, 5000) + '... [truncated]';
  }

  return cleaned;
}

/**
 * Checks if the email is an auto-reply or delivery bounce
 */
function isAutoReplyOrBounce(parsed: ParsedMail): boolean {
  // 1. Auto-Submitted header
  const autoSubmitted = parsed.headers.get('auto-submitted');
  if (autoSubmitted && String(autoSubmitted).toLowerCase() !== 'no') {
    return true;
  }

  // 2. Precedence header
  const precedence = parsed.headers.get('precedence');
  if (precedence && /bulk|list|junk|auto_reply/i.test(String(precedence))) {
    return true;
  }

  // 3. Sender address
  const fromAddress = parsed.from?.value?.[0]?.address?.toLowerCase() || '';
  if (/mailer-daemon|postmaster|noreply|no-reply|daemon/i.test(fromAddress)) {
    return true;
  }

  // 4. Subject patterns
  const subject = (parsed.subject || '').toLowerCase();
  if (
    subject.includes('out of office') ||
    subject.includes('delivery status notification') ||
    subject.includes('undelivered mail') ||
    subject.includes('failure notice') ||
    subject.includes('automatic reply') ||
    subject.includes('auto-reply')
  ) {
    return true;
  }

  return false;
}

/**
 * Collects all recipient email addresses from headers
 */
function extractRecipientAddresses(parsed: ParsedMail): string[] {
  const addresses: string[] = [];

  const add = (val: any) => {
    if (!val) return;
    if (typeof val === 'string') {
      addresses.push(val);
      return;
    }
    if (Array.isArray(val)) {
      val.forEach(add);
      return;
    }
    if (val.value && Array.isArray(val.value)) {
      val.value.forEach((v: any) => {
        if (v.address) addresses.push(v.address);
      });
      return;
    }
    if (val.address) addresses.push(val.address);
    if (val.text) addresses.push(val.text);
  };

  add(parsed.to);
  add(parsed.headers.get('delivered-to'));
  add(parsed.headers.get('x-original-to'));
  add(parsed.cc);

  return addresses;
}

/**
 * Extracts referenced Message-IDs from In-Reply-To and References headers
 */
function extractReferenceIds(parsed: ParsedMail): string[] {
  const refIds: string[] = [];

  if (parsed.inReplyTo) {
    const raw = String(parsed.inReplyTo).trim();
    if (raw) refIds.push(raw);
  }

  if (parsed.references) {
    if (Array.isArray(parsed.references)) {
      for (const r of parsed.references) {
        const raw = String(r).trim();
        if (raw) refIds.push(raw);
      }
    } else {
      const raw = String(parsed.references);
      const matches = raw.match(/<[^>]+>/g);
      if (matches && matches.length > 0) {
        refIds.push(...matches.map(m => m.trim()));
      } else if (raw.trim()) {
        refIds.push(raw.trim());
      }
    }
  }

  return refIds;
}

/**
 * Connects to Gmail over IMAP, searches unseen emails from past 7 days,
 * matches against active conversations, and syncs replies as incoming messages.
 */
export async function syncReplies(options?: { force?: boolean }): Promise<SyncResult> {
  const force = options?.force ?? false;
  const now = Date.now();

  if (isSyncInProgress) {
    return { success: true, synced: 0, skipped: 0, unmatched: 0, alreadyRunning: true };
  }

  if (!force && now - lastSyncTimestamp < MIN_SYNC_INTERVAL_MS) {
    return { success: true, synced: 0, skipped: 0, unmatched: 0 };
  }

  isSyncInProgress = true;
  lastSyncTimestamp = now;

  const host = process.env.IMAP_HOST || 'imap.gmail.com';
  const port = parseInt(process.env.IMAP_PORT || '993', 10);
  const user = process.env.SMTP_USER || 'm4xit.raj@gmail.com';
  const pass = process.env.SMTP_PASS || '';

  if (!pass) {
    isSyncInProgress = false;
    const msg = 'IMAP sync skipped: SMTP_PASS is not configured in environment.';
    console.warn(`[IMAP Warning] ${msg}`);
    return { success: false, synced: 0, skipped: 0, unmatched: 0, error: msg };
  }

  let syncedCount = 0;
  let skippedCount = 0;
  let unmatchedCount = 0;

  const client = new ImapFlow({
    host,
    port,
    secure: port === 993 || true,
    auth: {
      user,
      pass,
    },
    logger: false,
    emitLogs: false,
  });

  let lock: any = null;

  try {
    await dbConnect();
    await client.connect();

    lock = await client.getMailboxLock('INBOX');

    // 1. Search UNSEEN emails from the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const unseenUids = (await client.search(
      {
        seen: false,
        since: sevenDaysAgo,
      },
      { uid: true }
    )) || [];

    // 2. Also check the most recent 40 messages in INBOX to sync customer replies even if already opened in Gmail
    const mailbox = client.mailbox;
    const totalMessages = typeof mailbox === 'object' && mailbox?.exists ? mailbox.exists : 0;
    let recentUids: number[] = [];
    if (totalMessages > 0) {
      const startSeq = Math.max(1, totalMessages - 39);
      try {
        const recentList = await client.fetchAll(`${startSeq}:${totalMessages}`, { uid: true });
        recentUids = recentList.map(m => m.uid);
      } catch {}
    }

    // Combine UIDs without duplicates
    const uids = Array.from(new Set([...unseenUids, ...recentUids]));

    if (!uids || uids.length === 0) {
      return { success: true, synced: 0, skipped: 0, unmatched: 0 };
    }

    const [userBase] = user.toLowerCase().split('@');
    const plusPattern = new RegExp(`${userBase}\\+([a-fA-F0-9]{24}|[a-zA-Z0-9_-]+)@`, 'i');

    for (const uid of uids) {
      try {
        const messageData = await client.fetchOne(
          String(uid),
          { source: true, flags: true, uid: true },
          { uid: true }
        );

        if (!messageData || !messageData.source) {
          skippedCount++;
          continue;
        }

        const parsed = await simpleParser(messageData.source);

        // 3. Match against conversation:
        let matchedConversation: any = null;

        // Check To and Delivered-To headers for pattern m4xit.raj+{conversationId}@gmail.com
        const recipients = extractRecipientAddresses(parsed);
        for (const recipient of recipients) {
          const match = recipient.match(plusPattern);
          if (match && match[1]) {
            const candidateId = match[1];
            if (mongoose.Types.ObjectId.isValid(candidateId)) {
              matchedConversation = await Conversation.findById(candidateId);
              if (matchedConversation) break;
            }
          }
        }

        // If that fails, match In-Reply-To or References against Message-IDs saved in database
        if (!matchedConversation) {
          const refIds = extractReferenceIds(parsed);
          if (refIds.length > 0) {
            const matchedMessage = await Message.findOne({ messageId: { $in: refIds } }).select('conversationId');
            if (matchedMessage && matchedMessage.conversationId) {
              matchedConversation = await Conversation.findById(matchedMessage.conversationId);
            }

            if (!matchedConversation) {
              matchedConversation = await Conversation.findOne({ threadMessageId: { $in: refIds } });
            }
          }
        }

        // If there is still no match, SKIP the email completely.
        // Safety rule: never touch flags, never delete/move, never log content of unmatched emails.
        if (!matchedConversation) {
          unmatchedCount++;
          continue;
        }

        // For matched emails only:
        // Ignore auto replies and bounces
        if (isAutoReplyOrBounce(parsed)) {
          console.log(`[IMAP Sync] Ignored auto-reply/bounce for conversation ${matchedConversation._id}`);
          await client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true });
          skippedCount++;
          continue;
        }

        // Ignore emails sent from m4xit.raj@gmail.com itself
        const fromAddress = parsed.from?.value?.[0]?.address?.toLowerCase() || '';
        if (fromAddress === user.toLowerCase() || fromAddress.startsWith(`${userBase}+`)) {
          console.log(`[IMAP Sync] Ignored self-sent email from ${fromAddress}`);
          await client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true });
          skippedCount++;
          continue;
        }

        // Skip if incoming Message-ID already exists in database
        const incomingMessageId = parsed.messageId ? String(parsed.messageId).trim() : null;
        if (incomingMessageId) {
          const alreadyExists = await Message.exists({ messageId: incomingMessageId });
          if (alreadyExists) {
            await client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true });
            skippedCount++;
            continue;
          }
        }

        // Clean plain text body
        const cleanedBody = cleanEmailBody(parsed);
        if (!cleanedBody) {
          skippedCount++;
          continue;
        }

        const senderName = parsed.from?.value?.[0]?.name?.trim() || matchedConversation.name || 'Customer';
        const senderEmail = parsed.from?.value?.[0]?.address?.trim() || matchedConversation.email;

        // Save as new message in conversation
        const newMessage = new Message({
          conversationId: matchedConversation._id,
          direction: 'incoming',
          senderName,
          senderEmail,
          subject: parsed.subject || `Re: ${matchedConversation.subject || 'Website Inquiry'}`,
          body: cleanedBody,
          messageId: incomingMessageId || undefined,
          emailStatus: 'sent',
        });
        await newMessage.save();

        // Update conversation: set status to unread, update last message time
        matchedConversation.status = 'unread';
        matchedConversation.unreadCount = (matchedConversation.unreadCount || 0) + 1;
        matchedConversation.lastMessagePreview = cleanedBody.substring(0, 160);
        matchedConversation.lastMessageAt = new Date();
        await matchedConversation.save();

        // Mark only that email as Seen in Gmail after it is saved successfully
        await client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true });
        syncedCount++;
        console.log(`[IMAP Sync] Successfully synced reply from ${senderEmail} into conversation ${matchedConversation._id}`);

      } catch (msgErr: any) {
        console.error(`[IMAP Sync] Error processing message UID ${uid}:`, msgErr?.message || msgErr);
        skippedCount++;
      }
    }

    if (unmatchedCount > 0) {
      console.log(`[IMAP Sync] Left ${unmatchedCount} unmatched unseen emails untouched.`);
    }

    return {
      success: true,
      synced: syncedCount,
      skipped: skippedCount,
      unmatched: unmatchedCount,
    };

  } catch (error: any) {
    console.error('[IMAP Sync Error]', error?.message || error);
    return {
      success: false,
      synced: syncedCount,
      skipped: skippedCount,
      unmatched: unmatchedCount,
      error: error?.message || 'IMAP sync failed',
    };
  } finally {
    try {
      if (lock) {
        await lock.release();
      }
    } catch {}
    try {
      if (client.usable) {
        await client.logout();
      }
    } catch {}
    isSyncInProgress = false;
  }
}
