import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const conversation = await Conversation.findById(params.id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Mark as read if there are unread messages
    if (conversation.unreadCount > 0) {
      conversation.unreadCount = 0;
      if (conversation.status === 'new') {
        conversation.status = 'open';
      }
      await conversation.save();
    }

    // Fetch messages
    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 }).lean();
    
    return NextResponse.json({ conversation, messages });
  } catch (error) {
    console.error('Inbox Detail API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, unreadCount } = await req.json();

    await dbConnect();
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (typeof unreadCount === 'number') updateData.unreadCount = unreadCount;

    const conversation = await Conversation.findByIdAndUpdate(params.id, updateData, { new: true });
    
    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Inbox Update API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
