import Document from '../models/Document.js';
import { createQueryEmbedding, cosineSimilarity } from '../services/embedding.service.js';

// NEW: Get all documents (Browse mode)
export const getAllDocuments = async (req, res, next) => {
  try {
    const { 
      category, 
      team, 
      project, 
      fileType,
      limit = 50,
      sortBy = 'uploadedAt',
      sortOrder = 'desc'
    } = req.query;

    console.log('📚 Fetching all documents...');

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (team) filter.team = team;
    if (project) filter.project = project;
    if (fileType) filter.fileType = fileType;

    // Get all documents with optional filters
    const documents = await Document
      .find(filter)
      .select('-extractedText -embedding')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .lean();

    console.log(`✅ Retrieved ${documents.length} documents`);

    res.json({
      success: true,
      count: documents.length,
      data: documents
    });

  } catch (error) {
    console.error('Get all documents error:', error);
    next(error);
  }
};

// MODIFIED: Made query optional for hybrid search/browse
export const searchDocuments = async (req, res, next) => {
  try {
    const { 
      q: query, 
      category, 
      team, 
      project, 
      fileType,
      limit = 20 
    } = req.query;

    // If no query, return all documents (Browse mode)
    if (!query || query.trim().length === 0) {
      return getAllDocuments(req, res, next);
    }

    console.log(`🔍 Searching for: "${query}"`);

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (team) filter.team = team;
    if (project) filter.project = project;
    if (fileType) filter.fileType = fileType;

    // Step 1: Text-based search
    const textSearchResults = await Document
      .find({
        ...filter,
        $text: { $search: query }
      })
      .select('-extractedText')
      .limit(parseInt(limit) * 2)
      .lean();

    // Step 2: Generate query embedding
    const queryEmbedding = await createQueryEmbedding(query);

    // Step 3: Get documents with embeddings
    const allDocs = await Document
      .find({ ...filter, embedding: { $exists: true, $ne: null } })
      .select('-extractedText')
      .lean();

    // Step 4: Calculate semantic scores
    const semanticResults = allDocs.map(doc => ({
      ...doc,
      semanticScore: queryEmbedding ? cosineSimilarity(queryEmbedding, doc.embedding) : 0
    })).filter(doc => doc.semanticScore > 0.3);

    // Step 5: Hybrid ranking
    const docMap = new Map();

    textSearchResults.forEach(doc => {
      docMap.set(doc._id.toString(), {
        ...doc,
        textScore: 1,
        semanticScore: 0
      });
    });

    semanticResults.forEach(doc => {
      const docId = doc._id.toString();
      if (docMap.has(docId)) {
        const existing = docMap.get(docId);
        existing.semanticScore = doc.semanticScore;
      } else {
        docMap.set(docId, {
          ...doc,
          textScore: 0,
          semanticScore: doc.semanticScore
        });
      }
    });

    // Calculate final scores
    let results = Array.from(docMap.values())
      .map(doc => {
        const hybridScore = (doc.textScore * 0.6) + (doc.semanticScore * 0.4);
        return {
          ...doc,
          relevanceScore: Math.round(hybridScore * 100),
          embedding: undefined
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, parseInt(limit));

    console.log(`✅ Found ${results.length} results`);

    res.json({
      success: true,
      query,
      count: results.length,
      data: results
    });

  } catch (error) {
    console.error('Search error:', error);
    next(error);
  }
};

export const getFilters = async (req, res, next) => {
  try {
    const [categories, teams, projects, fileTypes] = await Promise.all([
      Document.distinct('category'),
      Document.distinct('team'),
      Document.distinct('project'),
      Document.distinct('fileType')
    ]);

    res.json({
      success: true,
      data: {
        categories: categories.filter(Boolean),
        teams: teams.filter(Boolean),
        projects: projects.filter(Boolean),
        fileTypes: fileTypes.filter(Boolean)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const [totalDocs, categoryStats, recentDocs] = await Promise.all([
      Document.countDocuments(),
      Document.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Document.find()
        .select('title uploadedAt')
        .sort({ uploadedAt: -1 })
        .limit(5)
    ]);

    res.json({
      success: true,
      data: {
        totalDocuments: totalDocs,
        categoryBreakdown: categoryStats,
        recentUploads: recentDocs
      }
    });
  } catch (error) {
    next(error);
  }
};






