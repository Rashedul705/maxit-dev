import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Count unread conversations
    const count = await Conversation.countDocuments({
      status: { $ne: 'archived' },
      $or: [{ status: 'unread' }, { unreadCount: { $gt: 0 } }],
    });

    return NextResponse.json({ unreadCount: count });
  } catch (error: any) {
    console.error('Unread Count API Error:', error);
    return NextResponse.json({ unreadCount: 0 }, { status: 500 });
  }
}
