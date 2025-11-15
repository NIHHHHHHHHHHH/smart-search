import mongoose from 'mongoose';

/**
 * Document Schema
 * 
 * Represents any uploaded document or asset in the system.
 * Stores metadata, extracted text, category, tags, and search-related fields.
 * Includes indexing for fast search and analytics support.
 */
const documentSchema = new mongoose.Schema({
  // Display name/title of the document
  title: {
    type: String,
    required: true,
    index: true
  },

  // Original filename of the uploaded file
  filename: {
    type: String,
    required: true
  },

  // Server path where the file is stored
  filePath: {
    type: String,
    required: true
  },

  // File format/type for validation
  fileType: {
    type: String,
    enum: ['pdf', 'docx', 'txt', 'md', 'doc'],
    required: true
  },

  // File size in bytes
  fileSize: {
    type: Number,
    required: true
  },

  // Extracted text content from the file for full-text search
  extractedText: {
    type: String,
    required: true
  },

  // High-level classification of the document
  category: {
    type: String,
    enum: ['Strategy', 'Campaign', 'Research', 'Creative', 'Analytics', 'Other'],
    default: 'Other',
    index: true
  },

  // Optional team name for filtering/grouping
  team: {
    type: String,
    index: true
  },

  // Optional project name for filtering/grouping
  project: {
    type: String,
    index: true
  },

  // Tags for better search relevance and filtering
  tags: [{
    type: String,
    index: true
  }],

  // Vector embeddings for semantic search (AI search)
  embedding: {
    type: [Number],
    required: false
  },

  // Auto-generated summary (if implemented)
  summary: {
    type: String
  },

  // Uploaded by which user/system
  uploadedBy: {
    type: String,
    default: 'System'
  },

  // Timestamp when document was uploaded
  uploadedAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  // Last access time for analytics
  lastAccessed: {
    type: Date,
    default: Date.now
  },

  // Total number of times the document has been viewed/accessed
  accessCount: {
    type: Number,
    default: 0
  }

}, {
  // Automatically add createdAt & updatedAt timestamps
  timestamps: true
});

/**
 * Compound Text Index
 * 
 * Enables MongoDB full-text search across title, extracted text, and tags.
 */
documentSchema.index({ 
  title: 'text', 
  extractedText: 'text',
  tags: 'text'
});

/**
 * Method: recordAccess
 * 
 * Tracks user interaction with a document by updating:
 * - accessCount: increments each time the document is viewed
 * - lastAccessed: updates to the current timestamp
 */
documentSchema.methods.recordAccess = async function() {
  this.accessCount += 1;
  this.lastAccessed = new Date();
  return this.save();
};

// Register model
const Document = mongoose.model('Document', documentSchema);

export default Document;
