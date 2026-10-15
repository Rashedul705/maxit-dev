import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { sendAdminNewMessageEmail, sendVisitorConfirmationEmail } from '@/lib/mail';

// In-memory rate limiting map: IP -> { count, timestamp }
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Periodically prune stale rate limit entries
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.timestamp > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(ip);
    }
  }
}

export async function POST(req: Request) {
  try {
    // 1. IP extraction & Rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const now = Date.now();

    cleanupRateLimitMap();

    const rateData = rateLimitMap.get(ip) || { count: 0, timestamp: now };
    if (now - rateData.timestamp > RATE_LIMIT_WINDOW) {
      rateData.count = 1;
      rateData.timestamp = now;
    } else {
      rateData.count += 1;
      if (rateData.count > MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a minute and try again.' },
          { status: 429 }
        );
      }
    }
    rateLimitMap.set(ip, rateData);

    // 2. Parse request body
    const bodyJson = await req.json();
    const { name, email, phone, subject, message: messageText, honeypot } = bodyJson;

    // Honeypot spam protection: bots fill invisible fields
    if (honeypot) {
      console.warn(`[Spam Blocked] Submission with honeypot detected from IP: ${ip}`);
      return NextResponse.json({ success: true, message: 'Message received.' });
    }

    // 3. Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!messageText || typeof messageText !== 'string' || messageText.trim().length === 0) {
      return NextResponse.json({ error: 'Message content cannot be empty.' }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone && typeof phone === 'string' ? phone.trim() : undefined;
    const cleanSubject = subject && typeof subject === 'string' && subject.trim().length > 0 
      ? subject.trim() 
      : 'Website Inquiry';
    const cleanBody = messageText.trim();

    await dbConnect();

    // 4. Create unique Message-ID for email thread referencing in Gmail
    const domain = (process.env.SITE_URL || 'https://m4xit.com').replace(/^https?:\/\//, '').replace(/\/.*$/, '') || 'm4xit.com';
    const threadMessageId = `<msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@${domain}>`;

    // 5. Save to database as a new conversation with status "unread"
    const conversation = new Conversation({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      status: 'unread',
      unreadCount: 1,
      lastMessagePreview: cleanBody.substring(0, 160),
      threadMessageId,
      emailStatus: 'pending',
      lastMessageAt: new Date(),
    });
    await conversation.save();

    const newMessage = new Message({
      conversationId: conversation._id,
      direction: 'incoming',
      senderName: cleanName,
      senderEmail: cleanEmail,
      subject: cleanSubject,
      body: cleanBody,
      messageId: threadMessageId,
      emailStatus: 'pending',
    });
    await newMessage.save();

    // 6. Send notification emails asynchronously (Admin + Visitor)
    // If email sending fails, we STILL return success to the visitor and log the error.
    let overallEmailStatus: 'sent' | 'failed' = 'sent';
    let emailErrorMsg: string | undefined;

    try {
      const [adminResult, visitorResult] = await Promise.allSettled([
        sendAdminNewMessageEmail({
          conversationId: conversation._id.toString(),
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          subject: cleanSubject,
          message: cleanBody,
          threadMessageId,
        }),
        sendVisitorConfirmationEmail({
          conversationId: conversation._id.toString(),
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          subject: cleanSubject,
          message: cleanBody,
          threadMessageId,
          inReplyTo: threadMessageId,
          references: [threadMessageId],
        }),
      ]);

      const adminFailed = adminResult.status === 'rejected' || (adminResult.status === 'fulfilled' && !adminResult.value.success);
      const visitorFailed = visitorResult.status === 'rejected' || (visitorResult.status === 'fulfilled' && !visitorResult.value.success);

      if (adminFailed || visitorFailed) {
        overallEmailStatus = 'failed';
        emailErrorMsg = [
          adminFailed ? `Admin email error: ${adminResult.status === 'rejected' ? adminResult.reason : (adminResult as any).value?.error}` : null,
          visitorFailed ? `Visitor email error: ${visitorResult.status === 'rejected' ? visitorResult.reason : (visitorResult as any).value?.error}` : null,
        ].filter(Boolean).join('; ');

        console.error('[Contact Email Warning]', emailErrorMsg);
      }
    } catch (sendErr: any) {
      overallEmailStatus = 'failed';
      emailErrorMsg = sendErr?.message || 'Unexpected email sending failure';
      console.error('[Contact Email Exception]', sendErr);
    }

    // Update emailStatus on conversation and message records
    conversation.emailStatus = overallEmailStatus;
    await conversation.save();

    newMessage.emailStatus = overallEmailStatus;
    if (emailErrorMsg) {
      newMessage.errorDetails = emailErrorMsg;
    }
    await newMessage.save();

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      conversationId: conversation._id,
    });

  } catch (error: any) {
    console.error('Contact Form Submission Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while sending your message. Please try again.' },
      { status: 500 }
    );
  }
}
