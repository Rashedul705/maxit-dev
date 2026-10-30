import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.middleware.js';
import Media from '../models/Media.js';

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

function saveLocalUpload(file: Express.Multer.File, filename: string): void {
  try {
    const uploadsDir = getUploadsDirectory();
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const safeFilename = path.basename(filename);
    const targetPath = path.join(uploadsDir, safeFilename);
    fs.writeFileSync(targetPath, file.buffer);
  } catch (err: any) {
    console.warn('[Upload Cache] Could not write local cache file:', err?.message);
  }
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

    if (req.file.buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
    }

    const verified = validateImageMagicBytes(req.file.buffer);
    if (!verified) {
      return res.status(400).json({
        error: 'Invalid file type. Only PNG, JPG, JPEG, WEBP, and GIF images (up to 5MB) are allowed.',
      });
    }

    // Optional ImgBB upload only if explicitly enabled
    const apiKey = process.env.IMGBB_API_KEY;
    if (process.env.USE_IMGBB === 'true' && apiKey) {
      try {
        const base64Image = req.file.buffer.toString('base64');
        const imgbbFormData = new URLSearchParams();
        imgbbFormData.append('image', base64Image);

        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: imgbbFormData,
          signal: AbortSignal.timeout(3000),
        });

        const data = await imgbbResponse.json();
        if (data.success && data.data?.url) {
          return res.json({ url: data.data.url });
        }
      } catch (imgbbErr: any) {
        console.warn('[Upload Warning] ImgBB unavailable, persisting directly to MongoDB cloud storage:', imgbbErr?.message);
      }
    }

    // Generate unique filename
    const randomId = crypto.randomBytes(8).toString('hex');
    const filename = `${Date.now()}-${randomId}${verified.ext}`;

    // 1. Primary: Save permanently into MongoDB Atlas Media collection
    // This guarantees the image is preserved across all environments, Vercel, and container redeployments
    const mediaDoc = await Media.create({
      filename,
      contentType: verified.mime,
      size: req.file.buffer.length,
      data: req.file.buffer,
    });

    // 2. Secondary: Save local copy on disk as fast server cache
    saveLocalUpload(req.file, filename);

    // Return the universal cloud media URL
    return res.json({ 
      url: `/api/media/${mediaDoc._id}`,
      id: mediaDoc._id,
      filename: filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error during upload.' });
  }
});

// GET /api/upload/media/:id (and routed to /api/media/:id in server.ts)
router.get('/media/:id', async (req: Request, res: Response) => {
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

export default router;
