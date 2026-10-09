import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendContactEmail = async (name: string, email: string, message: string, phone?: string) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.MAIL_TO || process.env.SMTP_USER, // The admin email
    replyTo: email,
    subject: `New Contact Form Submission from ${name}`,
    text: `You have received a new message from your website contact form.

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}
`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <br />
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br />')}</p>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

export const sendReplyEmail = async (toEmail: string, replyMessage: string) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    replyTo: process.env.MAIL_TO || process.env.SMTP_USER, // Replies go to admin
    subject: `Re: Your inquiry to Max iT Solution`,
    text: replyMessage,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h3>Hello,</h3>
        <p>${replyMessage.replace(/\n/g, '<br />')}</p>
        <br />
        <p>Best regards,<br/><strong>Max iT Solution Team</strong></p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};
