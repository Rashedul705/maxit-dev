import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../db.js';
import Admin from '../models/Admin.js';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware.js';

const router = Router();

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }
  return secret;
}

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    await dbConnect();
    const cleanEmail = String(email).toLowerCase().trim();
    let admin = await (Admin.findOne as any)({ email: cleanEmail });

    // Auto-seed admin if database is empty or doesn't have the configured env admin
    if (!admin) {
      if (
        process.env.ADMIN_EMAIL &&
        process.env.ADMIN_PASSWORD &&
        cleanEmail === process.env.ADMIN_EMAIL.toLowerCase().trim() &&
        password === process.env.ADMIN_PASSWORD
      ) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        admin = await Admin.create({
          email: process.env.ADMIN_EMAIL.toLowerCase().trim(),
          password: hashedPassword,
        });
      } else {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    }

    let isValid = await bcrypt.compare(password, admin.password);

    // Auto-sync password if changed in environment variables
    if (
      !isValid &&
      process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_EMAIL &&
      cleanEmail === process.env.ADMIN_EMAIL.toLowerCase().trim() &&
      password === process.env.ADMIN_PASSWORD
    ) {
      admin.password = await bcrypt.hash(password, 10);
      await admin.save();
      isValid = true;
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const payload = { id: admin._id.toString(), email: admin.email };
    const token = jwt.sign(payload, getJwtSecret(), { expiresIn: '30d' });

    // Set HTTP-only cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    return res.json({
      success: true,
      token,
      user: payload,
    });
  } catch (error: any) {
    console.error('[Auth Login Error]', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('admin_token', { path: '/' });
  res.clearCookie('next-auth.session-token', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  return res.json({ user: req.user });
});

// POST /api/auth/setup (and /api/setup-admin)
router.post('/setup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    await dbConnect();
    const count = await Admin.countDocuments();
    if (count > 0) {
      return res.status(403).json({ error: 'Admins already exist. Setup route is disabled for security.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      email: String(email).toLowerCase().trim(),
      password: hashedPassword,
    });

    return res.json({ message: 'Admin created successfully', email: admin.email });
  } catch (error: any) {
    console.error('[Setup Admin Error]', error);
    return res.status(500).json({ error: 'Failed to create admin' });
  }
});

export default router;
