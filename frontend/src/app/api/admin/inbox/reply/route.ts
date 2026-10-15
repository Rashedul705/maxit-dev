import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { sendAdminReplyEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access. Please log in.' }, { status: 401 });
    }

    const { conversationId, body } = await req.json();

    if (!conversationId || typeof conversationId !== 'string') {
      return NextResponse.json({ error: 'Conversation ID is required.' }, { status: 400 });
    }

    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      return NextResponse.json({ error: 'Reply text cannot be empty.' }, { status: 400 });
    }

    await dbConnect();

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
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

    const domain = (process.env.SITE_URL || 'https://m4xit.com').replace(/^https?:\/\//, '').replace(/\/.*$/, '') || 'm4xit.com';
    const replyMessageId = `<msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@${domain}>`;

    // 1. Create and save the outgoing reply message with generated messageId
    const newMessage = new Message({
      conversationId: conversation._id,
      direction: 'outgoing',
      senderName: 'Max iT Solution Support',
      senderEmail: (session.user as any)?.email || process.env.ADMIN_EMAIL || 'm4xit.raj@gmail.com',
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

    // 3. Dispatch the email with Gmail threading headers (In-Reply-To & References)
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

        return NextResponse.json({
          success: true,
          message: newMessage,
          emailStatus: 'sent',
        });
      } else {
        newMessage.emailStatus = 'failed';
        newMessage.errorDetails = emailResult.error || 'SMTP delivery failed';
        await newMessage.save();

        return NextResponse.json({
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

      return NextResponse.json({
        success: true,
        warning: `Reply recorded, but an exception occurred during email send: ${emailErr?.message}`,
        message: newMessage,
        emailStatus: 'failed',
      });
    }

  } catch (error: any) {
    console.error('Inbox Reply API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
