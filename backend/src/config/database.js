import mongoose from 'mongoose';

/**
 * Cache for MongoDB connection in serverless environment
 * This prevents creating new connections on every function invocation
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes a connection to the MongoDB database using the URI 
 * stored in environment variables. Implements connection caching
 * for serverless environments (Vercel).
 */
export const connectDatabase = async () => {
  // Return cached connection if available
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering in serverless
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    };

    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Creating new MongoDB connection...');

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(async (mongoose) => {
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        
        // Initialize text indexes after successful connection
        await createIndexes();
        
        return mongoose;
      })
      .catch((error) => {
        // Clear the promise cache on error so next attempt creates fresh connection
        cached.promise = null;
        console.error('❌ MongoDB Connection Error:', error.message);
        throw error;
      });
  }

  try {
    // Wait for the connection promise to resolve
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Clear cache on error
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
};

/**
 * Creates text indexes on the Document collection to support
 * optimized full-text search across title, extracted text,
 * category, and tags. Safe for serverless environments.
 */
const createIndexes = async () => {
  try {
    // Check if Document model is registered
    if (!mongoose.modelNames().includes('Document')) {
      console.log('⏭️  Document model not registered yet, skipping index creation');
      return;
    }

    // Retrieve existing registered 'Document' model
    const Document = mongoose.model('Document');

    // Check if indexes already exist
    const existingIndexes = await Document.collection.getIndexes();
    const hasTextIndex = Object.keys(existingIndexes).some(key => 
      existingIndexes[key].some(index => index[0] === '_fts')
    );

    if (hasTextIndex) {
      console.log('✅ Text indexes already exist');
      return;
    }

    // Create compound text index for full-text search
    await Document.collection.createIndex({
      title: 'text',
      extractedText: 'text',
      category: 'text',
      tags: 'text'
    });

    console.log('✅ Text indexes created successfully');
  } catch (error) {
    // Non-critical error - log but don't throw
    console.log('⚠️  Index creation skipped:', error.message);
  }
};

/**
 * Gracefully closes the database connection
 * Useful for cleanup in traditional server environments
 * (Not typically called in serverless)
 */
export const disconnectDatabase = async () => {
  if (cached.conn) {
    await mongoose.connection.close();
    cached.conn = null;
    cached.promise = null;
    console.log('🔌 MongoDB disconnected');
  }
};






// import mongoose from 'mongoose';

// /**
//  * Establishes a connection to the MongoDB database using the URI 
//  * stored in environment variables. Once connected, it attempts to 
//  * create necessary text indexes for optimized search functionality.
//  */
// export const connectDatabase = async () => {
//   try {
//     // Connect to MongoDB using Mongoose
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {});

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
    
//     // Initialize text indexes after successful connection
//     await createIndexes();
//   } catch (error) {
//     // Log connection failure and rethrow for handling at higher level
//     console.error('MongoDB Connection Error:', error.message);
//     throw error;
//   }
// };

// /**
//  * Creates text indexes on the Document collection to support
//  * optimized full-text search across title, extracted text,
//  * category, and tags. If the model is not yet registered, 
//  * the operation is safely skipped.
//  */
// const createIndexes = async () => {
//   try {
//     // Retrieve existing registered 'Document' model
//     const Document = mongoose.model('Document');

//     // Create compound text index for full-text search
//     await Document.collection.createIndex({
//       title: 'text',
//       extractedText: 'text',
//       category: 'text',
//       tags: 'text'
//     });

//     console.log('Text indexes created');
//   } catch (error) {
//     // If model isn't registered yet or DB not ready, skip silently
//     console.log('Index creation skipped (will be created with first document)');
//   }
// };
