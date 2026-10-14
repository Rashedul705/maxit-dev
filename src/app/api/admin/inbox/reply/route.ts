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

    // 1. Create and save the outgoing reply message
    const newMessage = new Message({
      conversationId: conversation._id,
      direction: 'outgoing',
      senderName: 'Max iT Solution Support',
      senderEmail: (session.user as any)?.email || process.env.ADMIN_EMAIL || 'm4xit.raj@gmail.com',
      subject: cleanSubject,
      body: cleanReplyText,
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
        visitorName: conversation.name,
        visitorEmail: conversation.email,
        originalSubject: conversation.subject || 'Website Inquiry',
        replyText: cleanReplyText,
        threadMessageId: conversation.threadMessageId,
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
