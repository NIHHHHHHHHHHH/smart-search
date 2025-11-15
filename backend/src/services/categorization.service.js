import { generateText } from '../config/gemini.js';

/**
 * Categorizes a marketing document using AI-generated analysis.
 */
export const categorizeDocument = async (title, extractedText) => {
  // Take the first 2000 characters to keep prompt concise and within model limits
  const textSample = extractedText.substring(0, 2000);
  
  // Prompt instructing the AI to return ONLY a JSON object, no additional text
  const prompt = `Analyze this marketing document and provide categorization in JSON format.

  Title: ${title}
  Content: ${textSample}
  
  Return ONLY a JSON object with this exact structure (no markdown, no explanation):
  {
    "category": "one of: Strategy, Campaign, Research, Creative, Analytics, Other",
    "team": "inferred team name or 'General'",
    "project": "inferred project name or 'Uncategorized'",
    "tags": ["3-5 relevant keywords"],
    "summary": "2-3 sentence summary"
  }`;

  try {
    // Request document analysis from the AI model
    const response = await generateText(prompt);
    
    // Clean model response to ensure valid JSON parsing
    let cleanResponse = response.trim();
    cleanResponse = cleanResponse.replace(/```json\n?/g, '');  // Remove JSON code block start
    cleanResponse = cleanResponse.replace(/```\n?/g, '');      // Remove code block end
    cleanResponse = cleanResponse.trim();

    // Parse AI output into a JS object
    const result = JSON.parse(cleanResponse);
    
    // Validate category to avoid unexpected/unrecognized categories from the model
    const validCategories = ['Strategy', 'Campaign', 'Research', 'Creative', 'Analytics', 'Other'];
    if (!validCategories.includes(result.category)) {
      result.category = 'Other';  // Fallback for invalid/unexpected categories
    }
    
    return result;
  } catch (error) {
    console.error('Categorization error:', error);

    // Return safe fallback metadata if AI or parsing fails
    return {
      category: 'Other',
      team: 'General',
      project: 'Uncategorized',
      tags: ['document', 'marketing'],
      summary: 'Document uploaded to the system.'
    };
  }
};
