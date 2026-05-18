import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not found. AI features will be disabled.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');
// genai SDK needed for embeddings - generateAI doesn't support embedContent
const genAINew = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy-key', httpOptions: { apiVersion: 'v1' } });

export const geminiModel = genAI.getGenerativeModel({ 
  // 2.5-flash has better reasoning for search relevance scoring
  model: 'gemini-2.5-flash' 
});

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

export const generateEmbedding = async (text) => {
  try {
    const result = await genAINew.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text,
    });
    return result.embeddings[0].values;
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw error;
  }
};