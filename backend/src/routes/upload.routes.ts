import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export function getUploadsDirectory(): string {
  const dir = process.env.UPLOAD_DIR || './uploads';
  return path.resolve(process.cwd(), dir);
}

/**
 * Validates real file content using magic bytes.
 * Restricts strictly to PNG, JPEG, GIF, and WEBP.
 * Explicitly rejects SVG, XML, HTML, scripts, and executables.
 */
function validateImageMagicBytes(buffer: Buffer): { ext: string; mime: string } | null {
  if (!buffer || buffer.length < 12) return null;

  // 1. Explicitly reject SVG, XML, HTML, or executable scripts
  const headerPreview = buffer.slice(0, 1024).toString('utf8').toLowerCase();
  if (
    headerPreview.includes('<svg') ||
    headerPreview.includes('<?xml') ||
    headerPreview.includes('<script') ||
    headerPreview.includes('<!doctype svg') ||
    headerPreview.includes('<html')
  ) {
    return null;
  }

  // Check MZ executable signature (DOS/Windows PE)
  if (buffer[0] === 0x4D && buffer[1] === 0x5A) {
    return null;
  }

  // Check ELF executable signature (Linux)
  if (buffer[0] === 0x7F && buffer[1] === 0x45 && buffer[2] === 0x4C && buffer[3] === 0x46) {
    return null;
  }

  // 2. Validate real image magic signatures
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return { ext: '.png', mime: 'image/png' };
  }

  // JPEG / JPG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return { ext: '.jpg', mime: 'image/jpeg' };
  }

  // GIF: GIF87a or GIF89a
  if (
    buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) && buffer[5] === 0x61
  ) {
    return { ext: '.gif', mime: 'image/gif' };
  }

  // WEBP: RIFF .... WEBP
  if (
    buffer.slice(0, 4).toString('ascii') === 'RIFF' &&
    buffer.slice(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { ext: '.webp', mime: 'image/webp' };
  }

  return null;
}

function saveLocalUpload(file: Express.Multer.File, ext: string): string {
  const uploadsDir = getUploadsDirectory();
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Generate completely random filename: timestamp + 16 random hex bytes + safe ext
  const randomId = crypto.randomBytes(16).toString('hex');
  const filename = `${Date.now()}-${randomId}${ext}`;
  // Prevent any path traversal
  const safeFilename = path.basename(filename);
  const targetPath = path.join(uploadsDir, safeFilename);

  fs.writeFileSync(targetPath, file.buffer);
  return `/uploads/${safeFilename}`;
}

// Multer error handling wrapper middleware
function handleMulterUpload(req: Request, res: Response, next: NextFunction) {
  const single = upload.single('image');
  single(req, res, (err: any) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
      }
      return res.status(400).json({ error: err.message || 'File upload failed.' });
    }
    next();
  });
}

// POST /api/upload
router.post('/', requireAuth, handleMulterUpload, async (req: Request, res: Response) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Check file size again
    if (req.file.buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
    }

    // Verify real mime type and extension using magic bytes
    const verified = validateImageMagicBytes(req.file.buffer);
    if (!verified) {
      return res.status(400).json({
        error: 'Invalid file type. Only PNG, JPG, JPEG, WEBP, and GIF images (up to 5MB) are allowed. SVG and executable files are rejected.',
      });
    }

    // Save to local uploads directory by default (persistent & fast).
    // Use ImgBB only if explicitly enabled via USE_IMGBB=true
    const apiKey = process.env.IMGBB_API_KEY;
    if (process.env.USE_IMGBB === 'true' && apiKey) {
      try {
        const base64Image = req.file.buffer.toString('base64');
        const imgbbFormData = new URLSearchParams();
        imgbbFormData.append('image', base64Image);

        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: imgbbFormData,
          signal: AbortSignal.timeout(4000),
        });

        const data = await imgbbResponse.json();
        if (data.success && data.data?.url) {
          return res.json({ url: data.data.url });
        } else {
          console.warn('[Upload Warning] ImgBB rejected upload, falling back to local storage:', data?.error?.message || data);
        }
      } catch (imgbbErr: any) {
        console.warn('[Upload Warning] ImgBB network request failed, falling back to local storage:', imgbbErr?.message);
      }
    }

    // Fallback: save to local uploads directory (mounted persistent volume)
    const localUrl = saveLocalUpload(req.file, verified.ext);
    return res.json({ url: localUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error during upload.' });
  }
});

export default router;
