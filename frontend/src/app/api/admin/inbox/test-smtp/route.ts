import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { verifySmtpConnection, sendTestSmtpEmail, getMailConfig } from '@/lib/mail';

// GET /api/admin/inbox/test-smtp: Check SMTP connection without sending
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = getMailConfig();
    const verification = await verifySmtpConnection();

    return NextResponse.json({
      success: verification.success,
      message: verification.message,
      config: {
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: config.user,
        adminEmail: config.adminEmail,
        hasPassword: Boolean(config.pass),
      },
    });
  } catch (error: any) {
    console.error('SMTP Check Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'SMTP check failed' }, { status: 500 });
  }
}

// POST /api/admin/inbox/test-smtp: Send a test email to admin email
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let targetEmail: string | undefined;
    try {
      const body = await req.json();
      targetEmail = body.targetEmail;
    } catch {
      // Body is optional
    }

    const config = getMailConfig();
    const recipient = targetEmail || config.adminEmail;

    const result = await sendTestSmtpEmail(recipient);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email successfully sent to ${recipient}!`,
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to send test email.',
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('SMTP Test Send Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Server error during test send' }, { status: 500 });
  }
}
