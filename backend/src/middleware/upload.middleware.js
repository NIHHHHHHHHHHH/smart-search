import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path for storing uploaded files
const uploadsDir = path.join(__dirname, '../../uploads');

/**
 * Ensure that the uploads directory exists.
 * If not present, create it recursively.
 * This prevents Multer from failing due to missing directories.
 */
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * ---------------------------------------------------------
 * Multer Storage Engine Configuration
 * - Saves files to disk
 * - Generates unique filenames to avoid overwriting
 * ---------------------------------------------------------
 */
const storage = multer.diskStorage({
  // Directory where uploaded files will be stored
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },

  // Custom filename generator: originalName + timestamp + random number
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    // Extract extension and base name
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

/**
 * ---------------------------------------------------------
 * File Filter (Whitelist)
 * Restricts upload to allowed file types only
 * ---------------------------------------------------------
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.docx', '.doc', '.txt', '.md'];
  const ext = path.extname(file.originalname).toLowerCase();

  // Validate extension
  if (allowedTypes.includes(ext)) {
    cb(null, true); // Accept file
  } else {
    cb(
      new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`),
      false
    ); // Reject file
  }
};

/**
 * ---------------------------------------------------------
 * Multer Instance Configuration
 * Includes:
 * - Storage engine
 * - File filtering
 * - Maximum file size (10MB)
 * ---------------------------------------------------------
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max size
  }
});
