import { Router, Request, Response } from 'express';
import dbConnect from '../db.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { requireAuth, cronOrAuth, AuthRequest } from '../middleware/auth.middleware.js';
import { syncReplies } from '../services/imap.service.js';
import { startImapScheduler } from '../services/imapScheduler.service.js';
import { 
  sendAdminReplyEmail, 
  generateMessageId, 
  verifySmtpConnection, 
  sendTestSmtpEmail, 
  getMailConfig 
} from '../services/mail.service.js';

const router = Router();

// GET /api/admin/inbox - List conversations
router.get('/admin/inbox', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    startImapScheduler();

    // Opportunistically sync incoming replies from Gmail
    await syncReplies().catch(err => console.error('[Inbox Auto-Sync Error]', err));

    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const filter = typeof req.query.filter === 'string' ? req.query.filter : 'all';

    await dbConnect();

    const query: any = {};
    if (filter === 'unread') {
      query.$or = [{ status: 'unread' }, { unreadCount: { $gt: 0 } }];
    } else if (filter === 'replied') {
      query.status = 'replied';
    } else if (filter === 'archived') {
      query.status = 'archived';
    } else {
      query.status = { $ne: 'archived' };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { lastMessagePreview: searchRegex },
      ];
    }

    const conversations = await Conversation.find(query).sort({ lastMessageAt: -1 }).lean();
    return res.json(conversations);
  } catch (error: any) {
    console.error('Inbox List API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/inbox/unread-count
router.get('/admin/inbox/unread-count', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await dbConnect();
    const count = await Conversation.countDocuments({
      status: { $ne: 'archived' },
      $or: [{ status: 'unread' }, { unreadCount: { $gt: 0 } }],
    });
    return res.json({ unreadCount: count });
  } catch (error: any) {
    console.error('Unread Count API Error:', error);
    return res.status(500).json({ unreadCount: 0 });
  }
});

// GET /api/admin/inbox/test-smtp
router.get('/admin/inbox/test-smtp', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const config = getMailConfig();
    const verification = await verifySmtpConnection();

    return res.json({
      success: verification.success,
      message: verification.message,
      config: {
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: config.user,
        adminEmail: config.adminEmail,
        hasPassword: Boolean(config.pass),
      },
    });
  } catch (error: any) {
    console.error('SMTP Check Error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'SMTP check failed' });
  }
});

// POST /api/admin/inbox/test-smtp
router.post('/admin/inbox/test-smtp', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const targetEmail = req.body?.targetEmail;
    const config = getMailConfig();
    const recipient = targetEmail || config.adminEmail;

    const result = await sendTestSmtpEmail(recipient);

    if (result.success) {
      return res.json({
        success: true,
        message: `Test email successfully sent to ${recipient}!`,
        messageId: result.messageId,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error || 'Failed to send test email.',
      });
    }
  } catch (error: any) {
    console.error('SMTP Test Send Error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Server error during test send' });
  }
});

// POST /api/admin/inbox/reply
router.post('/admin/inbox/reply', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId, body } = req.body;

    if (!conversationId || typeof conversationId !== 'string') {
      return res.status(400).json({ error: 'Conversation ID is required.' });
    }

    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      return res.status(400).json({ error: 'Reply text cannot be empty.' });
    }

    await dbConnect();

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    const cleanReplyText = body.trim();
    const cleanSubject = `Re: ${(conversation.subject || 'Website Inquiry').replace(/^Re:\s*/i, '')}`;

    // Gather previous message IDs in the conversation for Gmail threading
    const previousMessages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .select('messageId')
      .lean();

    const previousMessageIds: string[] = [];
    if (conversation.threadMessageId) {
      previousMessageIds.push(conversation.threadMessageId);
    }
    for (const m of previousMessages) {
      if (m.messageId && !previousMessageIds.includes(m.messageId)) {
        previousMessageIds.push(m.messageId);
      }
    }

    const lastMessageId = previousMessageIds.length > 0 
      ? previousMessageIds[previousMessageIds.length - 1] 
      : conversation.threadMessageId;

    const replyMessageId = generateMessageId();

    // 1. Create and save the outgoing reply message
    const newMessage = new Message({
      conversationId: conversation._id,
      direction: 'outgoing',
      senderName: 'Max iT Solution Support',
      senderEmail: req.user?.email || process.env.ADMIN_EMAIL || 'm4xit.raj@gmail.com',
      subject: cleanSubject,
      body: cleanReplyText,
      messageId: replyMessageId,
      emailStatus: 'pending',
    });
    await newMessage.save();

    // 2. Update the conversation status to 'replied'
    conversation.status = 'replied';
    conversation.unreadCount = 0;
    conversation.lastMessagePreview = cleanReplyText.substring(0, 160);
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // 3. Dispatch the email with Gmail threading headers
    try {
      const emailResult = await sendAdminReplyEmail({
        conversationId: conversation._id.toString(),
        visitorName: conversation.name,
        visitorEmail: conversation.email,
        originalSubject: conversation.subject || 'Website Inquiry',
        replyText: cleanReplyText,
        messageId: replyMessageId,
        inReplyTo: lastMessageId,
        references: previousMessageIds,
      });

      if (emailResult.success) {
        newMessage.emailStatus = 'sent';
        if (emailResult.messageId) {
          newMessage.messageId = emailResult.messageId;
        }
        await newMessage.save();

        return res.json({
          success: true,
          message: newMessage,
          emailStatus: 'sent',
        });
      } else {
        newMessage.emailStatus = 'failed';
        newMessage.errorDetails = emailResult.error || 'SMTP delivery failed';
        await newMessage.save();

        return res.json({
          success: true,
          warning: `Reply recorded in system, but SMTP email delivery failed: ${emailResult.error}`,
          message: newMessage,
          emailStatus: 'failed',
        });
      }
    } catch (emailErr: any) {
      console.error('[Reply API] Error during email dispatch:', emailErr);
      newMessage.emailStatus = 'failed';
      newMessage.errorDetails = emailErr?.message || 'SMTP exception';
      await newMessage.save();

      return res.json({
        success: true,
        warning: `Reply recorded, but an exception occurred during email send: ${emailErr?.message}`,
        message: newMessage,
        emailStatus: 'failed',
      });
    }
  } catch (error: any) {
    console.error('Inbox Reply API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/admin/inbox/sync - Manual sync triggered from Admin Inbox UI
router.post('/admin/inbox/sync', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    startImapScheduler();
    const result = await syncReplies({ force: true });
    return res.json(result);
  } catch (error: any) {
    console.error('Admin Inbox Sync API Error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Admin sync failed' });
  }
});

// POST /api/inbox/sync - Automated cron sync endpoint
router.post('/inbox/sync', cronOrAuth, async (req: Request, res: Response) => {
  try {
    startImapScheduler();
    const result = await syncReplies();
    return res.json(result);
  } catch (error: any) {
    console.error('Cron/Manual Inbox Sync API Error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Sync failed' });
  }
});

// GET /api/admin/inbox/:id - Get conversation detail & messages
router.get('/admin/inbox/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Opportunistically sync incoming replies from Gmail
    await syncReplies().catch(err => console.error('[Inbox Detail Auto-Sync Error]', err));

    await dbConnect();

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    // Mark as read when opened
    if (conversation.unreadCount > 0 || conversation.status === 'unread' || conversation.status === 'new') {
      conversation.unreadCount = 0;
      if (conversation.status === 'unread' || conversation.status === 'new') {
        conversation.status = 'open';
      }
      await conversation.save();
    }

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .lean();

    return res.json({ conversation, messages });
  } catch (error: any) {
    console.error('Inbox Detail API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH /api/admin/inbox/:id - Update status / unread count
router.patch('/admin/inbox/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, unreadCount } = req.body;

    await dbConnect();

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (typeof unreadCount === 'number') updateFields.unreadCount = unreadCount;

    const updated = await Conversation.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    return res.json(updated);
  } catch (error: any) {
    console.error('Inbox Update API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/admin/inbox/:id - Delete conversation and its messages
router.delete('/admin/inbox/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await dbConnect();

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    await Message.deleteMany({ conversationId: conversation._id });
    await Conversation.findByIdAndDelete(conversation._id);

    return res.json({
      success: true,
      message: 'Conversation and message history deleted successfully.',
    });
  } catch (error: any) {
    console.error('Inbox Delete API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
