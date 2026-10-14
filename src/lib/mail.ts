import nodemailer from 'nodemailer';

/**
 * Mail configuration helper reading strictly from process.env
 */
export function getMailConfig() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER || 'm4xit.raj@gmail.com';
  const pass = process.env.SMTP_PASS || '';
  const adminEmail = process.env.ADMIN_EMAIL || 'm4xit.raj@gmail.com';
  const mailFrom = process.env.MAIL_FROM || `Max iT Solution <${user}>`;
  const siteUrl = (process.env.SITE_URL || 'https://m4xit.com').replace(/\/+$/, '');

  return {
    host,
    port,
    secure,
    user,
    pass,
    adminEmail,
    mailFrom,
    siteUrl,
  };
}

/**
 * Creates and returns a Nodemailer transporter instance
 */
export function createMailTransporter() {
  const config = getMailConfig();

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    // Useful for development/self-signed certs
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Verifies SMTP connection and logs the result
 */
export async function verifySmtpConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  const config = getMailConfig();

  if (!config.pass) {
    const msg = 'SMTP_PASS is not set in environment variables. Mail sending will fail until configured.';
    console.warn(`[SMTP Warning] ${msg}`);
    return { success: false, message: msg };
  }

  try {
    const transporter = createMailTransporter();
    await transporter.verify();
    const successMsg = `SMTP connection to ${config.host}:${config.port} verified successfully for ${config.user}.`;
    console.log(`[SMTP Success] ${successMsg}`);
    return { success: true, message: successMsg };
  } catch (error: any) {
    const errorMsg = error?.message || 'Unknown SMTP verification error';
    console.error(`[SMTP Error] Verification failed for ${config.host}:${config.port}:`, errorMsg);
    return { success: false, message: errorMsg, details: error };
  }
}

/**
 * Escape HTML to prevent injection in email templates
 */
function escapeHtml(str: string = ''): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Standard table-based HTML email template with MaxIT brand styling
 */
function renderBaseEmailTemplate({
  headline,
  contentHtml,
  callToAction,
}: {
  headline: string;
  contentHtml: string;
  callToAction?: { label: string; url: string };
}): string {
  const brandBlue = '#046bd2'; // Primary brand blue from admin panel

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(headline)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container (max 600px) -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
          
          <!-- Brand Header -->
          <tr>
            <td style="background-color: ${brandBlue}; padding: 32px 36px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; tracking: 1px; padding: 4px 10px; border-radius: 20px; margin-bottom: 8px;">
                      Max iT Solution
                    </span>
                    <h1 style="margin: 4px 0 0; color: #ffffff; font-size: 24px; font-weight: 800; line-height: 1.25;">
                      ${escapeHtml(headline)}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 36px; font-size: 15px; line-height: 1.65; color: #334155;">
              ${contentHtml}

              ${callToAction ? `
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 32px; margin-bottom: 12px;">
                  <tr>
                    <td align="center">
                      <a href="${callToAction.url}" target="_blank" style="display: inline-block; background-color: ${brandBlue}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 700; box-shadow: 0 4px 12px rgba(4, 107, 210, 0.35);">
                        ${escapeHtml(callToAction.label)} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              ` : ''}
            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 36px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.6; text-align: center;">
              <p style="margin: 0 0 4px 0; font-weight: 700; color: #334155; font-size: 13px;">Max iT Solution</p>
              <p style="margin: 0 0 4px 0;">2nd Floor, Afroza Tower, Uposhohor Newmarket, Rajshahi-6000</p>
              <p style="margin: 0;">
                Direct inquiries: <a href="mailto:sales@m4xit.com" style="color: ${brandBlue}; text-decoration: none; font-weight: 600;">sales@m4xit.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 1. Send notification email to Admin when a visitor submits the contact form
 */
export async function sendAdminNewMessageEmail(params: {
  conversationId: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  threadMessageId?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = getMailConfig();
  if (!config.pass) {
    const errorMsg = 'SMTP_PASS is not configured in environment variables.';
    console.warn(`[SMTP Warning] ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
  const transporter = createMailTransporter();

  const cleanSubject = params.subject?.trim() || 'Website Inquiry';
  const emailSubject = `New message from ${params.name}: ${cleanSubject}`;
  const inboxUrl = `${config.siteUrl}/admin/inbox?id=${params.conversationId}`;

  const messageHtml = `
    <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 20px;">
      You have received a new contact submission from your website:
    </p>

    <!-- Details Box -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
      <tr>
        <td style="padding: 16px 20px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0">
            <tr>
              <td width="110" style="color: #64748b; font-size: 13px; font-weight: 600;">Full Name:</td>
              <td style="color: #0f172a; font-size: 14px; font-weight: 700;">${escapeHtml(params.name)}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-size: 13px; font-weight: 600;">Email Address:</td>
              <td style="color: #0f172a; font-size: 14px;">
                <a href="mailto:${escapeHtml(params.email)}" style="color: #046bd2; text-decoration: none;">${escapeHtml(params.email)}</a>
              </td>
            </tr>
            <tr>
              <td style="color: #64748b; font-size: 13px; font-weight: 600;">Phone Number:</td>
              <td style="color: #0f172a; font-size: 14px;">${escapeHtml(params.phone || 'Not provided')}</td>
            </tr>
            <tr>
              <td style="color: #64748b; font-size: 13px; font-weight: 600;">Subject:</td>
              <td style="color: #0f172a; font-size: 14px; font-weight: 600;">${escapeHtml(cleanSubject)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px;">Message Content:</p>
    <div style="background-color: #ffffff; border-left: 4px solid #046bd2; padding: 16px 20px; border-radius: 4px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #1e293b;">
${escapeHtml(params.message)}
    </div>
  `;

  const plainText = `New contact form submission on Max iT Solution:

Name: ${params.name}
Email: ${params.email}
Phone: ${params.phone || 'Not provided'}
Subject: ${cleanSubject}

Message:
${params.message}

Open and reply in Admin Inbox: ${inboxUrl}

--
Max iT Solution
2nd Floor, Afroza Tower, Uposhohor Newmarket, Rajshahi-6000
sales@m4xit.com
`;

  try {
    const info = await transporter.sendMail({
      from: config.mailFrom,
      to: config.adminEmail,
      replyTo: `${params.name} <${params.email}>`,
      subject: emailSubject,
      text: plainText,
      html: renderBaseEmailTemplate({
        headline: 'New Contact Form Inquiry',
        contentHtml: messageHtml,
        callToAction: {
          label: 'Open in Inbox',
          url: inboxUrl,
        },
      }),
      messageId: params.threadMessageId,
      headers: params.threadMessageId ? {
        'X-Conversation-Id': params.conversationId,
      } : undefined,
    });

    console.log(`[SMTP] Admin notification sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[SMTP] Failed to send admin notification:', error?.message || error);
    return { success: false, error: error?.message || 'Failed to send admin email' };
  }
}

/**
 * 2. Send friendly confirmation email to Visitor
 */
export async function sendVisitorConfirmationEmail(params: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  threadMessageId?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = getMailConfig();
  if (!config.pass) {
    const errorMsg = 'SMTP_PASS is not configured in environment variables.';
    console.warn(`[SMTP Warning] ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
  const transporter = createMailTransporter();

  const cleanSubject = params.subject?.trim() || 'Your message';
  const emailSubject = `We received your message`;

  const visitorHtml = `
    <p style="font-size: 16px; color: #0f172a; margin-top: 0;">
      Dear <strong>${escapeHtml(params.name)}</strong>,
    </p>
    <p>
      Thank you for reaching out to <strong>Max iT Solution</strong>. We have received your inquiry and our engineering and technical support team will review it and get back to you shortly.
    </p>

    <div style="background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">
        Summary of what you sent:
      </p>
      <p style="margin: 0 0 8px 0; font-size: 14px;">
        <strong>Subject:</strong> ${escapeHtml(cleanSubject)}
      </p>
      ${params.phone ? `<p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Phone:</strong> ${escapeHtml(params.phone)}</p>` : ''}
      <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Message:</strong></p>
      <div style="font-size: 13px; color: #475569; white-space: pre-wrap; line-height: 1.6; background-color: #ffffff; padding: 12px 16px; border-radius: 6px; border: 1px solid #e2e8f0;">
${escapeHtml(params.message)}
      </div>
    </div>

    <p style="color: #64748b; font-size: 14px;">
      If you have additional details or urgent requirements, you can reply directly to this email or call our hotline at <strong>+8801733-272445</strong>.
    </p>
    <p style="margin-bottom: 0;">
      Warm regards,<br />
      <strong>Max iT Solution Team</strong>
    </p>
  `;

  const plainText = `Hello ${params.name},

Thank you for reaching out to Max iT Solution. We have received your message and will reply soon.

Here is a copy of what you sent:
Subject: ${cleanSubject}
${params.phone ? `Phone: ${params.phone}\n` : ''}Message:
${params.message}

If you have urgent requirements, call us at +8801733-272445.

Best regards,
Max iT Solution Team
2nd Floor, Afroza Tower, Uposhohor Newmarket, Rajshahi-6000
sales@m4xit.com
`;

  try {
    const info = await transporter.sendMail({
      from: config.mailFrom,
      to: `${params.name} <${params.email}>`,
      replyTo: config.adminEmail,
      subject: emailSubject,
      text: plainText,
      html: renderBaseEmailTemplate({
        headline: 'We Received Your Message',
        contentHtml: visitorHtml,
      }),
      inReplyTo: params.threadMessageId,
      references: params.threadMessageId ? [params.threadMessageId] : undefined,
    });

    console.log(`[SMTP] Visitor confirmation sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[SMTP] Failed to send visitor confirmation:', error?.message || error);
    return { success: false, error: error?.message || 'Failed to send visitor email' };
  }
}

/**
 * 3. Send Admin reply to Visitor with Gmail threading headers
 */
export async function sendAdminReplyEmail(params: {
  visitorName: string;
  visitorEmail: string;
  originalSubject?: string;
  replyText: string;
  threadMessageId?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = getMailConfig();
  if (!config.pass) {
    const errorMsg = 'SMTP_PASS is not configured in environment variables.';
    console.warn(`[SMTP Warning] ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
  const transporter = createMailTransporter();

  const baseSubject = (params.originalSubject || 'Your inquiry to Max iT Solution').replace(/^Re:\s*/i, '');
  const emailSubject = `Re: ${baseSubject}`;

  const replyHtml = `
    <p style="font-size: 16px; color: #0f172a; margin-top: 0;">
      Dear <strong>${escapeHtml(params.visitorName)}</strong>,
    </p>

    <!-- Reply Body -->
    <div style="font-size: 15px; line-height: 1.7; color: #1e293b; margin: 20px 0; white-space: pre-wrap;">
${escapeHtml(params.replyText)}
    </div>

    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 28px 0;" />

    <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
      Best regards,<br />
      <strong>Max iT Solution Support Team</strong><br />
      <span style="font-size: 12px; color: #94a3b8;">Sustainable Energy, Agro Tech & Intelligent Automation</span>
    </p>
  `;

  const plainText = `Hello ${params.visitorName},

${params.replyText}

--
Best regards,
Max iT Solution Support Team
2nd Floor, Afroza Tower, Uposhohor Newmarket, Rajshahi-6000
sales@m4xit.com
`;

  try {
    const info = await transporter.sendMail({
      from: config.mailFrom,
      to: `${params.visitorName} <${params.visitorEmail}>`,
      replyTo: config.adminEmail,
      subject: emailSubject,
      text: plainText,
      html: renderBaseEmailTemplate({
        headline: 'Update on Your Inquiry',
        contentHtml: replyHtml,
      }),
      inReplyTo: params.threadMessageId,
      references: params.threadMessageId ? [params.threadMessageId] : undefined,
    });

    console.log(`[SMTP] Reply sent to ${params.visitorEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[SMTP] Failed to send reply to ${params.visitorEmail}:`, error?.message || error);
    return { success: false, error: error?.message || 'Failed to send reply email' };
  }
}

/**
 * 4. Send a test email from the Admin panel
 */
export async function sendTestSmtpEmail(targetEmail?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = getMailConfig();
  if (!config.pass) {
    const errorMsg = 'SMTP_PASS is not configured in environment variables.';
    console.warn(`[SMTP Warning] ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
  const recipient = targetEmail || config.adminEmail;
  const transporter = createMailTransporter();

  const testHtml = `
    <p style="font-size: 16px; color: #0f172a; margin-top: 0;">
      <strong>SMTP Configuration is active!</strong>
    </p>
    <p>This is a test notification confirming that the Max iT Solution mailer has successfully established an authenticated connection to your SMTP server.</p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
      <tr>
        <td style="padding: 16px 20px;">
          <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Host:</strong> ${escapeHtml(config.host)}</p>
          <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Port:</strong> ${config.port}</p>
          <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Secure:</strong> ${config.secure ? 'Yes (SSL)' : 'No (STARTTLS)'}</p>
          <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>User:</strong> ${escapeHtml(config.user)}</p>
          <p style="margin: 0; font-size: 13px;"><strong>Sent at:</strong> ${new Date().toISOString()}</p>
        </td>
      </tr>
    </table>

    <p style="color: #64748b; font-size: 13px; margin: 0;">
      Everything is ready for production inquiries and admin replies.
    </p>
  `;

  try {
    const info = await transporter.sendMail({
      from: config.mailFrom,
      to: recipient,
      subject: `[SMTP Test] Max iT Solution Mailer Verification`,
      text: `SMTP configuration test successful on Max iT Solution.\nHost: ${config.host}:${config.port}\nUser: ${config.user}\nTime: ${new Date().toISOString()}`,
      html: renderBaseEmailTemplate({
        headline: 'SMTP Verification Test',
        contentHtml: testHtml,
      }),
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    return { success: false, error: error?.message || 'SMTP test send failed' };
  }
}
