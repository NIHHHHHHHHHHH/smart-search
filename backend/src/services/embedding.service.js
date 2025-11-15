import { generateEmbedding } from '../config/gemini.js';

/**
 * Generates an embedding vector for a full document.
 * Embeddings are used for similarity search and semantic indexing.
 *
 */
export const createDocumentEmbedding = async (title, extractedText) => {
  try {
    // Combine title + content and trim to model's max safe token length (approx 5000 chars)
    const textForEmbedding = `${title}\n\n${extractedText}`.substring(0, 5000);
    
    // Generate vector embedding using the Gemini API
    const embedding = await generateEmbedding(textForEmbedding);
    return embedding;
  } catch (error) {
    console.error('Embedding creation error:', error);
    return null; // Safe fallback to prevent pipeline failure
  }
};

/**
 * Generates an embedding vector for a search query.
 * Used to match user queries against stored document embeddings.
 *
 */
export const createQueryEmbedding = async (query) => {
  try {
    // Create embedding for short search queries
    const embedding = await generateEmbedding(query);
    return embedding;
  } catch (error) {
    console.error('Query embedding error:', error);
    return null;
  }
};

/**
 * Calculates cosine similarity between two embedding vectors.
 * Returns a value between -1 and 1, where:
 *  - 1 = perfectly similar
 *  - 0 = no similarity
 *  - -1 = opposite meaning (rare in embeddings)
 */
export const cosineSimilarity = (vecA, vecB) => {
  // Basic validation: vectors must exist and be equal length
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  // Compute dot product and vector magnitudes
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  // Calculate vector lengths
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  // Avoid division by zero (occurs if embedding output is all zeros)
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  // Return cosine similarity score
  return dotProduct / (normA * normB);
};
