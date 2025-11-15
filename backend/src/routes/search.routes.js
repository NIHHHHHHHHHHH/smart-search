import express from 'express';
import { 
  searchDocuments, 
  getFilters, 
  getStats 
} from '../controllers/search.controller.js';

const router = express.Router();

router.get('/', searchDocuments);
router.get('/filters', getFilters);
router.get('/stats', getStats);

export default router;