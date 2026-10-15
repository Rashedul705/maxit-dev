import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }
  return secret;
}

/**
 * Middleware that strictly requires a valid admin JWT
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const cookieToken = (req as any).cookies?.admin_token;
    const token = bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, getJwtSecret()) as AuthenticatedUser;
    req.user = decoded;
    return next();
  } catch (error: any) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

/**
 * Middleware that optionally attaches user if valid token exists
 */
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const cookieToken = (req as any).cookies?.admin_token;
    const token = bearerToken || cookieToken;

    if (token) {
      const decoded = jwt.verify(token, getJwtSecret()) as AuthenticatedUser;
      req.user = decoded;
    }
  } catch {
    // Ignore invalid optional tokens
  }
  return next();
}

/**
 * Middleware to allow either a valid x-cron-secret or admin JWT
 */
export function cronOrAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const cronSecretHeader = req.headers['x-cron-secret'];
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && cronSecretHeader === expectedSecret) {
    return next();
  }

  // Fallback to standard admin authentication
  return requireAuth(req, res, next);
}
