import { Router, Request, Response } from 'express';
import dbConnect from '../db.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { 
  sendAdminNewMessageEmail, 
  sendVisitorConfirmationEmail, 
  generateMessageId 
} from '../services/mail.service.js';

const router = Router();

// POST /api/contact
router.post('/', async (req: Request, res: Response) => {
  try {

    // 2. Parse request body
    const { name, email, phone, subject, message: messageText, honeypot } = req.body;

    // Honeypot spam protection
    if (honeypot) {
      console.warn(`[Spam Blocked] Submission with honeypot detected from IP: ${req.ip}`);
      return res.json({ success: true, message: 'Message received.' });
    }

    // 3. Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    if (!messageText || typeof messageText !== 'string' || messageText.trim().length === 0) {
      return res.status(400).json({ error: 'Message content cannot be empty.' });
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
    const threadMessageId = generateMessageId();

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

    return res.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      conversationId: conversation._id,
    });
  } catch (error: any) {
    console.error('Contact Form Submission Error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while sending your message. Please try again.',
    });
  }
});

export default router;
