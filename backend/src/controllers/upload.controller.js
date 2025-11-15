import Document from '../models/Document.js';
import { extractText } from '../services/textExtraction.service.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Controller: uploadDocument
 * 
 * Handles the core upload workflow:
 * 1. Validate uploaded file
 * 2. Extract text content from file
 * 3. Save parsed document metadata to database
 * 4. Cleanup temporary files on failure
 */
export const uploadDocument = async (req, res, next) => {
  try {
    // Ensure file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { originalname, mimetype, path: filePath, size } = req.file;
    const fileExtension = originalname.split('.').pop().toLowerCase();

    // Generate clean title from filename (remove extension)
    const title = path.basename(originalname, path.extname(originalname));

    console.log(`📄 Processing: ${originalname}`);

    // ---------------------------------------------
    // Step 1: Extract text from file
    // ---------------------------------------------
    console.log('  → Extracting text...');
    const extractedText = await extractText(filePath, fileExtension);

    // Validate extraction result
    if (!extractedText || extractedText.length < 10) {
      // Remove file if unusable
      await fs.unlink(filePath);
      return res.status(400).json({
        success: false,
        message: 'Could not extract meaningful text from document'
      });
    }

    // ---------------------------------------------
    // Step 2: Save document metadata to database
    // ---------------------------------------------
    console.log('  → Saving to database...');
    const document = await Document.create({
      title,
      filename: originalname,
      filePath,
      fileType: fileExtension,
      fileSize: size,
      extractedText,
      category: 'Other',   // Default basic category
      uploadedBy: 'System',
      tags: [],
      embedding: []        // Placeholder for future AI embeddings
    });

    console.log(`✅ Document processed successfully: ${document._id}`);

    // Send response
    res.status(201).json({
      success: true,
      message: 'Document uploaded and processed successfully',
      data: {
        id: document._id,
        title: document.title,
        filename: document.filename,
        category: document.category,
        fileSize: document.fileSize,
        uploadedAt: document.uploadedAt
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Ensure uploaded file is deleted on error
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    next(error);
  }
};

/**
 * Controller: getDocuments
 * 
 * Fetches all stored documents, excluding heavy fields like:
 * - extractedText
 * - embedding
 */
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find()
      .select('-extractedText -embedding')
      .sort({ uploadedAt: -1 }); // Latest documents first

    res.json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: getDocument
 * 
 * Retrieves a single document by ID.
 * Automatically records access metrics (count + timestamp).
 */
export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Update access analytics
    await document.recordAccess();

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: deleteDocument
 * 
 * Deletes a document both from:
 * 1. The filesystem (actual file)
 * 2. The database (metadata)
 */
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Attempt to delete the actual file from disk
    try {
      await fs.unlink(document.filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    // Remove DB record
    await document.deleteOne();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
