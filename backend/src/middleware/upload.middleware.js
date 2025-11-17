import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import path from 'path';

/**
 * Cloudinary Storage Configuration
 * Files are uploaded directly to Cloudinary cloud storage
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    
    return {
      folder: 'smart-search-documents',
      resource_type: 'raw', // For non-image files
      public_id: `${name}-${uniqueSuffix}`,
      // CRITICAL: Don't use allowed_formats with resource_type: 'raw'
      // Cloudinary's allowed_formats is stricter for raw files
      // We'll handle validation in fileFilter instead
    };
  }
});

/**
 * File Filter (Whitelist)
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.docx', '.doc', '.txt', '.md'];
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/markdown'
  ];
  
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  // Check both extension and MIME type
  if (allowedTypes.includes(ext) || allowedMimeTypes.includes(mimeType)) {
    cb(null, true);
  } else {
    cb(
      new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`),
      false
    );
  }
};

/**
 * Multer Instance with Cloudinary Storage
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});


// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from '../config/cloudinary.js';
// import path from 'path';

// /**
//  * Cloudinary Storage Configuration
//  * Files are uploaded directly to Cloudinary cloud storage
//  */
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'smart-search-documents', // Cloudinary folder name
//     allowed_formats: ['pdf', 'docx', 'doc', 'txt', 'md'],
//     resource_type: 'raw', // Important: 'raw' for non-image files
//     public_id: (req, file) => {
//       // Generate unique filename
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       const ext = path.extname(file.originalname);
//       const name = path.basename(file.originalname, ext);
//       return `${name}-${uniqueSuffix}`;
//     }
//   }
// });

// /**
//  * File Filter (Whitelist)
//  */
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['.pdf', '.docx', '.doc', '.txt', '.md'];
//   const ext = path.extname(file.originalname).toLowerCase();

//   if (allowedTypes.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`),
//       false
//     );
//   }
// };

// /**
//  * Multer Instance with Cloudinary Storage
//  */
// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB
//   }
// });


