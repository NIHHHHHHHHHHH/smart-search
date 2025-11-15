import express from 'express';
import { upload } from '../middleware/upload.middleware.js';
import { 
  uploadDocument, 
  getDocuments, 
  getDocument,
  deleteDocument 
} from '../controllers/upload.controller.js';

const router = express.Router();

/**
 * ---------------------------------------------------------
 * @route   POST /api/upload
 * @desc    Upload a new document
 * @access  Public (modify later if authentication is added)
 * 
 * Uses:
 * - Multer middleware → upload.single('file')
 * - Controller → uploadDocument
 * ---------------------------------------------------------
 */
router.post('/', upload.single('file'), uploadDocument);

/**
 * ---------------------------------------------------------
 * @route   GET /api/upload
 * @desc    Fetch all uploaded documents
 * @access  Public
 * ---------------------------------------------------------
 */
router.get('/', getDocuments);

/**
 * ---------------------------------------------------------
 * @route   GET /api/upload/:id
 * @desc    Fetch a single document by ID
 * @access  Public
 * ---------------------------------------------------------
 */
router.get('/:id', getDocument);

/**
 * ---------------------------------------------------------
 * @route   DELETE /api/upload/:id
 * @desc    Delete a document and its stored file
 * @access  Public (should be protected in final production)
 * ---------------------------------------------------------
 */
router.delete('/:id', deleteDocument);

export default router;
