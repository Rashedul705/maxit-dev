import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { syncReplies } from '@/lib/imap';
import { startImapScheduler } from '@/lib/imapScheduler';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    startImapScheduler();
    const result = await syncReplies();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Admin Inbox Sync API Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Admin sync failed' }, { status: 500 });
  }
}
