import Document from '../models/Document.js';
import { extractText } from '../services/textExtraction.service.js';
import { categorizeDocument } from '../services/categorization.service.js';
import { createDocumentEmbedding } from '../services/embedding.service.js';
import { getFileExtension, formatFileSize } from '../utils/helpers.js';
import cloudinary from '../config/cloudinary.js';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

/**
 * Download file from Cloudinary to temp directory for processing
 */
const downloadFileToTemp = async (url, originalFilename) => {
  const tempDir = os.tmpdir();
  // Create a unique temp filename to avoid conflicts
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(originalFilename);
  const tempFilename = `temp-${uniqueSuffix}${ext}`;
  const tempPath = path.join(tempDir, tempFilename);
  
  console.log(`  → Temp file path: ${tempPath}`);
  
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'arraybuffer'
  });
  
  await fs.writeFile(tempPath, response.data);
  return tempPath;
};

export const uploadDocument = async (req, res, next) => {
  let tempFilePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { originalname, size } = req.file;
    const cloudinaryUrl = req.file.path; // Cloudinary URL
    const cloudinaryFilename = req.file.filename; // Cloudinary public_id
    const fileType = getFileExtension(originalname);

    console.log(`📄 Processing: ${originalname}`);
    console.log(`☁️ Cloudinary URL: ${cloudinaryUrl}`);
    console.log(`☁️ Cloudinary Filename: ${cloudinaryFilename}`);

    // Download file to temp directory for text extraction
    console.log('  → Downloading from Cloudinary...');
    tempFilePath = await downloadFileToTemp(cloudinaryUrl, originalname);

    // Extract text from temporary file
    console.log('  → Extracting text...');
    const extractedText = await extractText(tempFilePath, fileType);

    if (!extractedText || extractedText.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract meaningful text from document'
      });
    }

    // Categorize with AI
    console.log('  → Categorizing with Gemini AI...');
    const categorization = await categorizeDocument(originalname, extractedText);

    // Generate embeddings
    console.log('  → Generating embeddings...');
    const embedding = await createDocumentEmbedding(originalname, extractedText);

    // Save to database with Cloudinary URL
    console.log('  → Saving to database...');
    const document = new Document({
      title: originalname,
      filename: cloudinaryFilename,
      filePath: cloudinaryUrl, // Store Cloudinary URL instead of local path
      fileType,
      fileSize: size,
      extractedText,
      category: categorization.category,
      team: categorization.team,
      project: categorization.project,
      tags: categorization.tags,
      summary: categorization.summary,
      embedding,
      uploadedBy: req.body.uploadedBy || 'System'
    });

    await document.save();

    // Clean up temp file
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(err => 
        console.warn('Failed to delete temp file:', err)
      );
    }

    console.log(`✅ Completed: ${originalname}`);

    res.status(201).json({
      success: true,
      message: 'Document uploaded and processed successfully',
      data: {
        id: document._id,
        title: document.title,
        fileType: document.fileType,
        fileSize: formatFileSize(document.fileSize),
        category: document.category,
        team: document.team,
        project: document.project,
        tags: document.tags,
        summary: document.summary,
        uploadedAt: document.uploadedAt
      }
    });

  } catch (error) {
    // Clean up temp file on error
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(() => {});
    }
    
    console.error('Upload error:', error);
    next(error);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const { limit = 50, category, team, project } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (team) filter.team = team;
    if (project) filter.project = project;

    const documents = await Document
      .find(filter)
      .select('-extractedText -embedding')
      .sort({ uploadedAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};

export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    await document.recordAccess();

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete from Cloudinary
    try {
      // Extract public_id from filename (without extension)
      const publicId = `smart-search-documents/${document.filename}`;
      console.log(`Deleting from Cloudinary: ${publicId}`);
      
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw'
      });
      console.log('✅ File deleted from Cloudinary');
    } catch (cloudinaryError) {
      console.warn('⚠️ Failed to delete from Cloudinary:', cloudinaryError);
    }

    // Delete from database
    await Document.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};





// import Document from '../models/Document.js';
// import { extractText } from '../services/textExtraction.service.js';
// import { categorizeDocument } from '../services/categorization.service.js';
// import { createDocumentEmbedding } from '../services/embedding.service.js';
// import { getFileExtension, formatFileSize } from '../utils/helpers.js';

// /**
//  * uploadDocument()
//  * Handles full document upload workflow:
//  * 1. Validate uploaded file
//  * 2. Extract text using file-type specific parser
//  * 3. Use Gemini AI for categorization, tagging, and summary
//  * 4. Generate semantic embeddings for AI search
//  * 5. Save enriched document metadata to MongoDB
//  */
// export const uploadDocument = async (req, res, next) => {
//   try {
//     // Ensure file is received from multer
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: 'No file uploaded'
//       });
//     }

//     const { originalname, filename, path: filePath, size } = req.file;
//     const fileType = getFileExtension(originalname);

//     console.log(`📄 Processing: ${originalname}`);

   
//     // 1. Extract text from file
//     console.log('  → Extracting text...');
//     const extractedText = await extractText(filePath, fileType);

//     // If extracted text is too small or empty, stop and return error
//     if (!extractedText || extractedText.length < 10) {
//       return res.status(400).json({
//         success: false,
//         message: 'Could not extract meaningful text from document'
//       });
//     }

   
//     // 2. Categorize document using AI
   
//     console.log('  → Categorizing with Gemini AI...');
//     const categorization = await categorizeDocument(originalname, extractedText);

   
//     // 3. Generate embeddings for semantic search
   
//     console.log('  → Generating embeddings...');
//     const embedding = await createDocumentEmbedding(originalname, extractedText);

   
//     // 4. Save final enriched document record in database
   
//     console.log('  → Saving to database...');
//     const document = new Document({
//       title: originalname,
//       filename,
//       filePath,
//       fileType,
//       fileSize: size,
//       extractedText,
//       category: categorization.category,
//       team: categorization.team,
//       project: categorization.project,
//       tags: categorization.tags,
//       summary: categorization.summary,
//       embedding,
//       uploadedBy: req.body.uploadedBy || 'System'
//     });

//     await document.save();

//     console.log(`✅ Completed: ${originalname}`);

   
//     // Response payload (sanitized)
   
//     res.status(201).json({
//       success: true,
//       message: 'Document uploaded and processed successfully',
//       data: {
//         id: document._id,
//         title: document.title,
//         fileType: document.fileType,
//         fileSize: formatFileSize(document.fileSize),
//         category: document.category,
//         team: document.team,
//         project: document.project,
//         tags: document.tags,
//         summary: document.summary,
//         uploadedAt: document.uploadedAt
//       }
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
//     next(error);
//   }
// };

// /**
 
//  * getDocuments()
//  * Fetches a list of documents with optional filters:
//  * - category
//  * - team
//  * - project
//  * 
//  * Embeddings and extracted text are excluded by default to:
//  * - reduce payload size
//  * - ensure faster queries
//  *
//  * Supports a `limit` query param for pagination control.
 
//  */
// export const getDocuments = async (req, res, next) => {
//   try {
//     const { limit = 50, category, team, project } = req.query;

//     // Build dynamic filter object
//     const filter = {};
//     if (category) filter.category = category;
//     if (team) filter.team = team;
//     if (project) filter.project = project;

//     const documents = await Document
//       .find(filter)
//       .select('-extractedText -embedding') // Exclude heavy fields
//       .sort({ uploadedAt: -1 }) // Newest first
//       .limit(parseInt(limit));

//     res.json({
//       success: true,
//       count: documents.length,
//       data: documents
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
 
//  * getDocument()
//  * Retrieves a single document by ID.
//  * Automatically increments:
//  * - accessCount
//  * - lastAccessed timestamp
//  * 
//  * These metrics help analyze user behavior and search relevance.
 
//  */
// export const getDocument = async (req, res, next) => {
//   try {
//     const document = await Document.findById(req.params.id);

//     if (!document) {
//       return res.status(404).json({
//         success: false,
//         message: 'Document not found'
//       });
//     }

//     // Track analytics for document usage
//     await document.recordAccess();

//     res.json({
//       success: true,
//       data: document
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
 
//  * deleteDocument()
//  * Deletes a document by ID.
//  * Note: file deletion from storage is handled elsewhere or by
//  * separate cleanup logic.
 
//  */
// export const deleteDocument = async (req, res, next) => {
//   try {
//     const document = await Document.findByIdAndDelete(req.params.id);

//     if (!document) {
//       return res.status(404).json({
//         success: false,
//         message: 'Document not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Document deleted successfully'
//     });
//   } catch (error) {
//     next(error);
//   }
// };
