import fs from 'fs/promises';
import { createRequire } from 'module';
import mammoth from 'mammoth';

const require = createRequire(import.meta.url);
const PDFExtract = require('pdf.js-extract').PDFExtract;

/**
 * =========================================================
 * extractText()
 * ---------------------------------------------------------
 * Main text extraction handler.
 * Detects file type and routes the processing to the
 * appropriate extractor function.
 *
 * @param {string} filePath - Absolute path of the uploaded file
 * @param {string} fileType - File extension (pdf, docx, txt, etc.)
 * @returns {Promise<string>} Extracted plain text
 * =========================================================
 */
export const extractText = async (filePath, fileType) => {
  try {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return await extractFromPDF(filePath);

      case 'docx':
      case 'doc':
        return await extractFromDOCX(filePath);

      case 'txt':
      case 'md':
        return await extractFromText(filePath);

      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};

/**
 * =========================================================
 * extractFromPDF()
 * ---------------------------------------------------------
 * Extracts raw text from PDF files using pdf.js-extract.
 *
 * - Iterates through all pages
 * - Extracts text content blocks
 * - Joins them into a single formatted string
 *
 * @param {string} filePath
 * @returns {Promise<string>}
 * =========================================================
 */
const extractFromPDF = async (filePath) => {
  const pdfExtract = new PDFExtract();
  const data = await pdfExtract.extract(filePath, {});

  // Combine all text from all pages
  const text = data.pages
    .map(page => page.content.map(item => item.str).join(' '))
    .join('\n\n');

  return text.trim();
};

/**
 * =========================================================
 * extractFromDOCX()
 * ---------------------------------------------------------
 * Extracts text from DOCX or DOC files using Mammoth,
 * which focuses on preserving readable text content.
 *
 * @param {string} filePath
 * @returns {Promise<string>}
 * =========================================================
 */
const extractFromDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value.trim();
};

/**
 * =========================================================
 * extractFromText()
 * ---------------------------------------------------------
 * Handles extraction from plain text-based files (.txt, .md).
 *
 * Reads entire file content as UTF-8 string.
 *
 * @param {string} filePath
 * @returns {Promise<string>}
 * =========================================================
 */
const extractFromText = async (filePath) => {
  const text = await fs.readFile(filePath, 'utf-8');
  return text.trim();
};
