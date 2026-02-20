import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { 
  searchDocuments,
  getAllDocuments, // NEW: Explicit route for browse mode
  getFilters, 
  getStats 
} from '../controllers/search.controller.js';

const router = express.Router();

// Main search endpoint (now handles both search and browse)
router.get('/',authenticate, searchDocuments);

// Explicit browse endpoint (optional - searchDocuments handles this too)
router.get('/all',authenticate, getAllDocuments);

// Filter and stats endpoints
router.get('/filters',authenticate, getFilters);
router.get('/stats',authenticate, getStats);

export default router;


