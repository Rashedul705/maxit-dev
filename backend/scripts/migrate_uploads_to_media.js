import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

const MediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, index: true },
    contentType: { type: String, required: true, default: 'image/jpeg' },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

const Media = mongoose.models.Media || mongoose.model('Media', MediaSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const uploadsDir = path.resolve(__dirname, '../uploads');
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir).filter(f => !f.startsWith('.'));
    console.log(`Found ${files.length} files in ${uploadsDir}`);

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        let mime = 'image/jpeg';
        if (ext === '.png') mime = 'image/png';
        if (ext === '.webp') mime = 'image/webp';
        if (ext === '.gif') mime = 'image/gif';

        const buffer = fs.readFileSync(filePath);

        const existing = await Media.findOne({ filename: file });
        if (!existing) {
          const doc = await Media.create({
            filename: file,
            contentType: mime,
            size: buffer.length,
            data: buffer,
          });
          console.log(`Migrated ${file} -> Media ID ${doc._id}`);
        } else {
          console.log(`Already in Media: ${file}`);
        }
      }
    }
  }

  const count = await Media.countDocuments();
  console.log(`Total Media documents in DB: ${count}`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

