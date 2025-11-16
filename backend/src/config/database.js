


import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database using the URI 
 * stored in environment variables. Once connected, it attempts to 
 * create necessary text indexes for optimized search functionality.
 */
export const connectDatabase = async () => {
  try {
    // Connect to MongoDB using Mongoose
    const conn = await mongoose.connect(process.env.MONGODB_URI, {});

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Initialize text indexes after successful connection
    await createIndexes();
  } catch (error) {
    // Log connection failure and rethrow for handling at higher level
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
};

/**
 * Creates text indexes on the Document collection to support
 * optimized full-text search across title, extracted text,
 * category, and tags. If the model is not yet registered, 
 * the operation is safely skipped.
 */
const createIndexes = async () => {
  try {
    // Retrieve existing registered 'Document' model
    const Document = mongoose.model('Document');

    // Create compound text index for full-text search
    await Document.collection.createIndex({
      title: 'text',
      extractedText: 'text',
      category: 'text',
      tags: 'text'
    });

    console.log('Text indexes created');
  } catch (error) {
    // If model isn't registered yet or DB not ready, skip silently
    console.log('Index creation skipped (will be created with first document)');
  }
};
