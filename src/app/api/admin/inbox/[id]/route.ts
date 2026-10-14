import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';

// GET /api/admin/inbox/[id]: Fetch conversation details and messages, marking as read
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    await dbConnect();

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    // Mark as read when opened
    if (conversation.unreadCount > 0 || conversation.status === 'unread' || conversation.status === 'new') {
      conversation.unreadCount = 0;
      if (conversation.status === 'unread' || conversation.status === 'new') {
        conversation.status = 'open';
      }
      await conversation.save();
    }

    // Fetch message history sorted chronologically
    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ conversation, messages });
  } catch (error: any) {
    console.error('Inbox Detail API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/admin/inbox/[id]: Update status (e.g. archive, unarchive, mark unread)
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { status, unreadCount } = await req.json();

    await dbConnect();

    const updateFields: any = {};
    if (status) {
      updateFields.status = status;
    }
    if (typeof unreadCount === 'number') {
      updateFields.unreadCount = unreadCount;
    }

    const updated = await Conversation.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Inbox Update API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/admin/inbox/[id]: Delete conversation and all its messages
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    await dbConnect();

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    // Delete all messages in the thread
    await Message.deleteMany({ conversationId: conversation._id });
    
    // Delete the conversation document
    await Conversation.findByIdAndDelete(conversation._id);

    return NextResponse.json({ success: true, message: 'Conversation and message history deleted successfully.' });
  } catch (error: any) {
    console.error('Inbox Delete API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
