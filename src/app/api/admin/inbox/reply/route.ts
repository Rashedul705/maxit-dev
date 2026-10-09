import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { sendReplyEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, body } = await req.json();

    if (!conversationId || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // 1. Create the message record
    const newMessage = new Message({
      conversationId: conversation._id,
      direction: 'outgoing',
      body,
      emailStatus: 'sent', // Will update to failed if email fails
    });
    await newMessage.save();

    // 2. Update conversation
    conversation.status = 'replied';
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // 3. Send the email
    try {
      await sendReplyEmail(conversation.email, body);
    } catch (emailError) {
      console.error('Failed to send reply email:', emailError);
      newMessage.emailStatus = 'failed';
      await newMessage.save();
      return NextResponse.json({ success: true, warning: 'Message saved but email failed to send.' });
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Inbox Reply API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
