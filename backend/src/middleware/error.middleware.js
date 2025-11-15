export const errorHandler = (err, req, res, next) => {
  // Log full error details for debugging (not sent to client)
  console.error('Error:', err);

  /**
   * -----------------------------------------------------
   * Handle Multer (file upload) specific errors
   * Multer sets `err.name = 'MulterError'`
   * -----------------------------------------------------
   */
  if (err.name === 'MulterError') {

    // Specific check for file-size limit exceeded
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 10MB limit'
      });
    }

    // Any other Multer-related error
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  /**
   * -----------------------------------------------------
   * Custom application errors
   * Useful when throwing errors manually with `throw new Error('msg')`
   * or attaching a custom `statusCode`
   * -----------------------------------------------------
   */
  if (err.message) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  }

  /**
   * -----------------------------------------------------
   * Fallback / Unknown Error
   * Covers unexpected server errors
   * -----------------------------------------------------
   */
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
