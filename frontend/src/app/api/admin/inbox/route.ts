import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { startImapScheduler } from '@/lib/imapScheduler';
import { syncReplies } from '@/lib/imap';

export const dynamic = 'force-dynamic';

// GET /api/admin/inbox: Retrieve list of conversations with search and filter
export async function GET(req: Request) {
  try {
    startImapScheduler();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    // Opportunistically sync incoming replies from Gmail (throttled to at most once per 6s)
    await syncReplies().catch(err => console.error('[Inbox Auto-Sync Error]', err));

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();
    const filter = searchParams.get('filter') || 'all';

    await dbConnect();

    // Query builder
    const query: any = {};

    // Filter handling
    if (filter === 'unread') {
      query.$or = [{ status: 'unread' }, { unreadCount: { $gt: 0 } }];
    } else if (filter === 'replied') {
      query.status = 'replied';
    } else if (filter === 'archived') {
      query.status = 'archived';
    } else {
      // 'all' excludes archived unless explicitly requested
      query.status = { $ne: 'archived' };
    }

    // Search query on name, email, subject, or message preview
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { lastMessagePreview: searchRegex },
      ];
    }

    // Sort by newest message first
    const conversations = await Conversation.find(query).sort({ lastMessageAt: -1 }).lean();

    return NextResponse.json(conversations);
  } catch (error: any) {
    console.error('Inbox List API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
