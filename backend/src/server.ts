import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Enforce JWT_SECRET requirement
if (!process.env.JWT_SECRET) {
  console.error('[FATAL] JWT_SECRET environment variable is missing. Refusing to start.');
  process.exit(1);
}

import dbConnect, { getDbState } from './db.js';
import { startImapScheduler, stopImapScheduler } from './services/imapScheduler.service.js';

// Route modules
import authRoutes from './routes/auth.routes.js';
import contactRoutes from './routes/contact.routes.js';
import inboxRoutes from './routes/inbox.routes.js';
import adminRoutes from './routes/admin.routes.js';
import uploadRoutes from './routes/upload.routes.js';

import fs from 'fs';
import { getUploadsDirectory } from './routes/upload.routes.js';
import { renderStatusPage } from './views/statusPage.js';
import Media from './models/Media.js';

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// 1. Trust proxy for Coolify (Traefik -> Next.js -> Express)
// Configurable via TRUST_PROXY_HOPS (default 2)
const trustProxyHops = parseInt(process.env.TRUST_PROXY_HOPS || '2', 10);
app.set('trust proxy', isNaN(trustProxyHops) ? 2 : trustProxyHops);

// 2. Helmet for HTTP security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// 3. CORS: Allow FRONTEND_URL with credentials (supports www and apex domain)
const configuredFrontend = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
const allowedOrigins = [
  configuredFrontend,
  configuredFrontend.replace('://www.', '://'),
  configuredFrontend.replace('://', '://www.'),
  'https://www.m4xit.com',
  'https://m4xit.com',
];

app.use(cors({
  origin: (origin, callback) => {
    const isAllowed = 
      !origin || 
      allowedOrigins.includes(origin) || 
      (process.env.NODE_ENV !== 'production' && (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000'));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-cron-secret'],
}));

// 4. Body parsers & cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 5. Rate limiters (per-client IP via req.ip with trust proxy)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 submissions per 15 minutes per IP
  message: { error: 'Too many inquiries submitted from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

// Health check endpoints (reports server uptime & database connection status)
const healthHandler = (req: express.Request, res: express.Response) => {
  const dbState = getDbState();
  const isHealthy = dbState === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    db: dbState,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Root endpoint for API status (renders sleek infrastructure dashboard or JSON)
app.get('/', (req, res) => {
  const dbState = getDbState();
  const acceptsHtml = req.accepts('html', 'json') === 'html';

  if (acceptsHtml && !req.xhr && !req.headers['x-requested-with']) {
    return res.status(200).send(renderStatusPage({
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'production',
      port: PORT,
      dbStatus: dbState,
      dbSystem: 'MongoDB Atlas',
      emailSyncStatus: 'Active',
      syncIntervalSeconds: Number(process.env.SYNC_INTERVAL_SECONDS || 15),
    }));
  }

  res.status(200).json({
    name: 'MaxIT Backend API',
    status: 'running',
    db: dbState,
    health: '/health',
    timestamp: new Date().toISOString(),
  });
});

// Configure upload directory on startup (mount point for Coolify volume)
const uploadsDir = getUploadsDirectory();
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// API Routes with rate limits
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/setup-admin', authRoutes); // Compatibility for /api/setup-admin

app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api', inboxRoutes); // Mounts /api/admin/inbox and /api/inbox/sync
app.use('/api/admin', adminRoutes); // Mounts /api/admin/* (services, projects, team, etc.)
app.use('/api/upload', uploadRoutes);

// Media retrieval by ID or filename directly from MongoDB Atlas Media collection
app.get('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let media = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      media = await Media.findById(id);
    }
    if (!media) {
      media = await Media.findOne({ filename: id });
    }

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.setHeader('Content-Type', media.contentType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('ETag', `"${media._id}"`);

    if (req.headers['if-none-match'] === `"${media._id}"`) {
      return res.status(304).end();
    }

    return res.send(media.data);
  } catch (err) {
    console.error('Media retrieval error:', err);
    return res.status(500).json({ error: 'Failed to retrieve media' });
  }
});

// Static uploads serving with fallback to MongoDB Media collection if not on local disk
app.get('/uploads/:filename', async (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(uploadsDir, safeFilename);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  try {
    const media = await Media.findOne({ filename: safeFilename });
    if (media) {
      res.setHeader('Content-Type', media.contentType || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('ETag', `"${media._id}"`);

      if (req.headers['if-none-match'] === `"${media._id}"`) {
        return res.status(304).end();
      }

      return res.send(media.data);
    }
  } catch (err) {
    console.warn('[Uploads Fallback Error]:', err);
  }

  next();
});

// Static uploads serving with X-Content-Type-Options: nosniff
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  },
  express.static(uploadsDir, {
    dotfiles: 'ignore',
    index: false,
  })
);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.baseUrl} not found` });
});

// Start server
async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`[MaxIT Backend] Server running on http://localhost:${PORT}`);
      console.log(`[Uploads] Serving uploads from: ${uploadsDir}`);
    });

    // Connect to database
    dbConnect().catch((err: any) => {
      console.error('[MongoDB] Initial connection error (will retry):', err?.message || err);
    });
    
    // Start background IMAP reply listener (respects IMAP_SYNC_ENABLED)
    startImapScheduler();
  } catch (error) {
    console.error('[MaxIT Backend] Fatal startup error:', error);
    process.exit(1);
  }
}

// Global process error handlers for third-party socket/network resilience
process.on('unhandledRejection', (reason) => {
  console.warn('[MaxIT Backend Warning] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[MaxIT Backend Warning] Uncaught Exception:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('[MaxIT Backend] Shutting down gracefully...');
  stopImapScheduler();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('[MaxIT Backend] Received termination signal...');
  stopImapScheduler();
  process.exit(0);
});

start();
