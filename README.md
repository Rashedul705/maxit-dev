# MaxIT Solution Website

Welcome to the official website repository of **MaxIT Solution** — a creative design and IT service company based in Bangladesh.

## 🌐 About MaxIT Solution

MaxIT Solution provides smart, design-led technology support to small businesses and offices. Our services include UI/UX design, branding, computer and networking solutions, smart home setup, CCTV installation, and more.

This static website is built to showcase our services, team, and contact information in a clean and professional manner.

---

## 📁 Project Structure

```bash
/
├── index.html          # Main landing page
├── about.html          # About us page
├── services.html       # List of services
├── portfolio.html      # Project gallery
├── team.html           # Meet our team
├── contact.html        # Contact form and info
├── assets/
│   ├── css/            # Stylesheets
│   ├── js/             # Scripts
│   └── images/         # Logos, photos, icons

---

## 📬 Email System & Automatic Reply Sync

This project features a two-way email synchronization system connecting the website's contact form, Gmail inbox, and the Next.js Admin Inbox.

### How It Works

1. **Website Inquiry (Outgoing)**:
   - When a visitor submits the contact form, a new Conversation and Message are created with a unique RFC-compliant `Message-ID`.
   - The visitor receives an automated confirmation email. Its `Reply-To` header is set to `m4xit.raj+{conversationId}@gmail.com`.
   - The admin receives a notification email with direct links to the thread in Admin Inbox.

2. **Customer Replies (Incoming IMAP Sync)**:
   - When the customer replies from their email client (Gmail, Outlook, Apple Mail), their reply goes to `m4xit.raj+{conversationId}@gmail.com`.
   - Gmail routes `+tag` emails into the main mailbox (`m4xit.raj@gmail.com`).
   - A background sync runner connects via IMAP (port 993) every `SYNC_INTERVAL_SECONDS` (default: 45s), inspecting unseen emails from the last 7 days.
   - The sync identifies matching conversations via:
     1. Recipient addresses (`To`, `Delivered-To`) containing the `+{conversationId}` pattern.
     2. Email threading headers (`In-Reply-To` and `References`) matching saved `Message-ID`s in MongoDB.
   - Non-matching emails are untouched and skipped for privacy. Auto-replies, bounces, and self-sent emails are ignored.
   - The plain text body is parsed to strip quoted history and signatures, and is saved as a new customer message.
   - The conversation status changes back to `unread`, moving it to the top of the Admin Inbox.
   - The synced email in Gmail is marked as `Seen`.

3. **Admin Reply from Inbox**:
   - The admin replies directly from the Admin Inbox chat UI.
   - The reply is saved and emailed via SMTP with `In-Reply-To` and `References` containing all preceding message IDs in the conversation.
   - This keeps the conversation grouped in a single thread in the customer's email client.

### Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `SMTP_HOST` | Outgoing SMTP server | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port (587 STARTTLS or 465 SSL) | `587` |
| `SMTP_USER` | Gmail address | `m4xit.raj@gmail.com` |
| `SMTP_PASS` | Gmail App Password (16 characters) | `xxxx xxxx xxxx xxxx` |
| `IMAP_HOST` | Incoming IMAP server | `imap.gmail.com` |
| `IMAP_PORT` | IMAP secure port | `993` |
| `SYNC_INTERVAL_SECONDS` | Background IMAP sync interval in seconds | `45` |
| `CRON_SECRET` | Secret key protecting the `/api/inbox/sync` endpoint | `48-character hex string` |
| `SITE_URL` | Base public URL of website | `https://m4xit.com` |

### Triggering Sync Manually / Scheduled Task

You can trigger the sync manually or through an external scheduler (like Coolify cron) by sending a POST request:

```bash
curl -X POST https://yourdomain.com/api/inbox/sync \
  -H "x-cron-secret: YOUR_CRON_SECRET"
```

