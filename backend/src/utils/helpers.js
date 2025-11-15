/**
 * =========================================================
 * sanitizeFilename()
 * ---------------------------------------------------------
 * Removes unsafe characters from filenames.
 * Only allows: A–Z, a–z, 0–9, dot (.), underscore (_), and hyphen (-).
 * Everything else is replaced with "_".
 *
 * Helps prevent:
 * - File path traversal issues
 * - Invalid/unsafe filesystem names
 *
 * @param {string} filename
 * @returns {string} sanitized filename
 * =========================================================
 */
export const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
};

/**
 * =========================================================
 * getFileExtension()
 * ---------------------------------------------------------
 * Extracts the extension of a file and returns it in lowercase.
 * Useful for validating or routing files to correct processors.
 *
 * @param {string} filename
 * @returns {string} file extension
 * =========================================================
 */
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

/**
 * =========================================================
 * formatFileSize()
 * ---------------------------------------------------------
 * Converts a file size in bytes into a human-readable format:
 * Example:
 * - 1024 → "1 KB"
 * - 1500000 → "1.43 MB"
 *
 * @param {number} bytes
 * @returns {string} formatted size
 * =========================================================
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * =========================================================
 * truncateText()
 * ---------------------------------------------------------
 * Shortens long text while keeping readability.
 * Used for previewing extracted text or summaries.
 *
 * Example:
 * truncateText("Hello World", 5) → "Hello..."
 *
 * @param {string} text
 * @param {number} maxLength
 * @returns {string} truncated text
 * =========================================================
 */
export const truncateText = (text, maxLength = 200) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
