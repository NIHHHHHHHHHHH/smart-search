import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CRITICAL: Use /tmp for Vercel serverless, local uploads for development
const uploadsDir = process.env.VERCEL 
  ? '/tmp/uploads' 
  : path.join(__dirname, '../../uploads');

/**
 * Ensure that the uploads directory exists.
 * If not present, create it recursively.
 * This prevents Multer from failing due to missing directories.
 * Wrapped in try-catch for serverless safety.
 */
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`✅ Upload directory created: ${uploadsDir}`);
  }
} catch (error) {
  console.error('⚠️ Could not create upload directory:', error.message);
  // Don't throw - let it fail gracefully when upload is attempted
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

/**
 * Middleware to handle multer errors gracefully
 */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File size exceeds 10MB limit'
      });
    }
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  next();
};






// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import fs from 'fs';

// // Resolve __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Path for storing uploaded files
// const uploadsDir = path.join(__dirname, '../../uploads');

// /**
//  * Ensure that the uploads directory exists.
//  * If not present, create it recursively.
//  * This prevents Multer from failing due to missing directories.
//  */
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// /**
//  * ---------------------------------------------------------
//  * Multer Storage Engine Configuration
//  * - Saves files to disk
//  * - Generates unique filenames to avoid overwriting
//  * ---------------------------------------------------------
//  */
// const storage = multer.diskStorage({
//   // Directory where uploaded files will be stored
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir);
//   },

//   // Custom filename generator: originalName + timestamp + random number
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

//     // Extract extension and base name
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);

//     cb(null, `${name}-${uniqueSuffix}${ext}`);
//   }
// });

// /**
//  * ---------------------------------------------------------
//  * File Filter (Whitelist)
//  * Restricts upload to allowed file types only
//  * ---------------------------------------------------------
//  */
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['.pdf', '.docx', '.doc', '.txt', '.md'];
//   const ext = path.extname(file.originalname).toLowerCase();

//   // Validate extension
//   if (allowedTypes.includes(ext)) {
//     cb(null, true); // Accept file
//   } else {
//     cb(
//       new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`),
//       false
//     ); // Reject file
//   }
// };

// /**
//  * ---------------------------------------------------------
//  * Multer Instance Configuration
//  * Includes:
//  * - Storage engine
//  * - File filtering
//  * - Maximum file size (10MB)
//  * ---------------------------------------------------------
//  */
// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB max size
//   }
// });
