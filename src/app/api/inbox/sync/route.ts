import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { syncReplies } from '@/lib/imap';
import { startImapScheduler } from '@/lib/imapScheduler';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    startImapScheduler();

    const cronSecretHeader = req.headers.get('x-cron-secret');
    const expectedSecret = process.env.CRON_SECRET;

    const isSecretValid = Boolean(expectedSecret && cronSecretHeader && cronSecretHeader === expectedSecret);

    if (!isSecretValid) {
      // Check for authenticated admin session as fallback
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized. Valid x-cron-secret header or admin session required.' },
          { status: 401 }
        );
      }
    }

    const result = await syncReplies();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Cron/Manual Inbox Sync API Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Sync failed' }, { status: 500 });
  }
}
