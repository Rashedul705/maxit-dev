# MaxIT Solution Monorepo

Welcome to the **MaxIT Solution** official repository. This project is structured as a **Monorepo** with a separated **Express.js backend** and **Next.js frontend**.

---

## 🏗️ Architecture Overview

```
maxit-dev/
├── backend/                  # Express.js REST API & Services (Port 5001)
│   ├── src/
│   │   ├── config/           # Database & server configuration
│   │   ├── middleware/       # JWT auth & cron security middleware
│   │   ├── models/           # Mongoose schemas (18 models)
│   │   ├── routes/           # Express route controllers (auth, contact, inbox, admin, upload)
│   │   ├── services/         # Mailer (SMTP) & IMAP automated sync scheduler
│   │   ├── db.ts             # MongoDB Atlas connection
│   │   └── server.ts         # Express server entry point
│   ├── .env                  # Backend credentials & config
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Next.js 16 Web Application (Port 3000)
│   ├── src/
│   │   ├── app/              # Public pages, dynamic routes, and Admin Panel UI
│   │   ├── components/       # UI & layout components
│   │   └── middleware.ts     # Edge authentication guard for /admin
│   ├── next.config.mjs       # Transparent API rewrites (/api/* -> http://localhost:5001/api/*)
│   ├── tailwind.config.ts    # Styling system
│   ├── .env.local            # Frontend config
│   ├── package.json
│   └── tsconfig.json
│
├── package.json              # Monorepo root orchestration scripts
└── README.md
```

---

## 🚀 Quick Start

### 1. Install Dependencies
Run from the root directory:
```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 2. Run Both Services Concurrently
From the project root:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5001`
- **Frontend App**: `http://localhost:3000`

### 3. Run Individual Services
- **Backend only**: `npm run dev:backend`
- **Frontend only**: `npm run dev:frontend`

### 4. Build for Production
```bash
npm run build
```

---

## 📬 Two-Way Email System & Automated IMAP Reply Sync

1. **Website Inquiry (Outgoing)**:
   - When visitors submit the contact form, a conversation is created with a unique RFC `Message-ID`.
   - The visitor gets a confirmation email with `Reply-To: m4xit.raj+{conversationId}@gmail.com`.
   - The admin receives a notification with a direct thread link.

2. **Customer Replies (Automatic IMAP Sync)**:
   - When the customer replies in Gmail/Outlook/Apple Mail, Gmail routes `+conversationId` into the inbox.
   - The Express backend background worker inspects emails every 15s via IMAP (`imapflow`).
   - The sync matches the `+{conversationId}` tag and threading headers (`In-Reply-To`, `References`).
   - The cleaned reply appears live in the Admin Inbox without needing to press "Sync Now".

3. **Admin Reply**:
   - Admin replies directly from `/admin/inbox`.
   - The reply is dispatched via SMTP with proper threading headers so the thread remains grouped in the customer's email client.

---

## 🔒 Authentication & API Proxying

- The backend provides clean JWT authentication with HTTP-only cookies (`admin_token`).
- All frontend fetch calls to `/api/*` are automatically forwarded to `http://localhost:5001/api/*` via Next.js rewrites in `frontend/next.config.mjs`.
