import express from 'express';
import { 
  searchDocuments,
  getAllDocuments, // NEW: Explicit route for browse mode
  getFilters, 
  getStats 
} from '../controllers/search.controller.js';

const router = express.Router();

// Main search endpoint (now handles both search and browse)
router.get('/', searchDocuments);

// Explicit browse endpoint (optional - searchDocuments handles this too)
router.get('/all', getAllDocuments);

// Filter and stats endpoints
router.get('/filters', getFilters);
router.get('/stats', getStats);

export default router;





// import express from 'express';
// import { 
//   searchDocuments, 
//   getFilters, 
//   getStats 
// } from '../controllers/search.controller.js';

// const router = express.Router();

// router.get('/', searchDocuments);
// router.get('/filters', getFilters);
// router.get('/stats', getStats);

// export default router;