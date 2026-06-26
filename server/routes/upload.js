import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import sharp from 'sharp';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Use memory storage to process image with sharp before saving
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Convert to webp for better compression
    const filename = uniqueSuffix + '.webp';
    const filepath = path.join(uploadDir, filename);

    await sharp(req.file.buffer)
      .resize({ width: 1280, withoutEnlargement: true }) // Resize if larger than 1280px width
      .webp({ quality: 80 }) // Compress to webp with 80% quality
      .toFile(filepath);

    res.json({ url: `/api/uploads/${filename}` });
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

export default router;
