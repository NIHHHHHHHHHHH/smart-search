import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Load Gemini API Key
 * If GEMINI_API_KEY is missing, the application will still run
 * but AI-powered features (categorization, embedding, summary)
 * will be disabled. A warning is logged for developers.
 */
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not found. AI features will be disabled.');
}

/**
 * Initialize Google Generative AI Client
 * If API key is missing, a dummy key is used to prevent
 * runtime crashes — though API calls will fail gracefully.
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');

/**
 * Gemini Model: Text Generation & Categorization
 * Used for tasks such as:
 * - Content categorization
 * - Summarization
 * - Generating meaningful tags
 * - Extracting context from documents
 */
export const geminiModel = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash' 
});

/**
 * Gemini Embedding Model
 * Used to convert document text → numerical vector embeddings.
 * These embeddings help with:
 * - Semantic search
 * - Similarity ranking
 * - AI-powered document lookup
 */
export const embeddingModel = genAI.getGenerativeModel({ 
  model: 'text-embedding-004' 
});

/**
 * generateText(prompt)
 * Sends a text prompt to Gemini and returns the generated text.
 *
 * @param {string} prompt – Natural language prompt or query.
 * @returns {Promise<string>} – Generated AI response.
 *
 * Error handling:
 * - Logs failure
 * - Re-throws error for controller-level handling
 */
export const generateText = async (prompt) => {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw error;
  }
};

/**
 * generateEmbedding(text)
 * Converts raw text into embedding array (vector of numbers).
 *
 * @param {string} text – Document content to embed.
 * @returns {Promise<number[]>} – Embedding values for DB storage.
 *
 * Used for:
 * - Semantic search
 * - Similarity scoring
 *
 * Error handling:
 * - Logs failure
 * - Re-throws error for controller-level handling
 */
export const generateEmbedding = async (text) => {
  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw error;
  }
};
