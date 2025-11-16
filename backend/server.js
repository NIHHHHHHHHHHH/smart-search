import 'dotenv/config'; 

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { connectDatabase } from './src/config/database.js'; 
import uploadRoutes from './src/routes/upload.routes.js';
import searchRoutes from './src/routes/search.routes.js';
import { errorHandler } from './src/middleware/error.middleware.js';

const app = express();

// Initialize database on cold start (connection will be cached)
connectDatabase().catch(err => {
  console.error('❌ Initial MongoDB Connection failed:', err);
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Global Middleware
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', 
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

/**
 * API Root Endpoint
 */
app.get('/api', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Smart Search Tool API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      upload: '/api/upload',
      search: '/api/search',
      filters: '/api/search/filters',
      stats: '/api/search/stats'
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * Health Check Endpoint
 */
app.get('/api/health', (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][
    mongoose.connection.readyState
  ] || 'unknown';

  res.json({ 
    status: 'success',
    message: 'Backend server is running (Vercel Serverless)',
    database: dbState,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'API endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Export the Express app for Vercel
export default app;





// import 'dotenv/config'; 

// import express from 'express';
// import cors from 'cors';
// import rateLimit from 'express-rate-limit';
// import { connectDatabase } from './src/config/database.js';
// import uploadRoutes from './src/routes/upload.routes.js';
// import searchRoutes from './src/routes/search.routes.js';
// import { errorHandler } from './src/middleware/error.middleware.js';


// const app = express();
// const PORT = process.env.PORT || 5000;

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100
// });

// /**
//  * Global Middleware
//  * 
//  * - CORS: Allows frontend to communicate with backend
//  * - JSON Parser: Parses incoming JSON request bodies
//  * - URL-Encoded Parser: Supports form submissions
//  */
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend domain
//   credentials: true                                           // Allow cookies/auth headers
// }));
// app.use(express.json());                                       // Parse JSON bodies
// app.use(express.urlencoded({ extended: true }));               // Parse form data
// app.use(limiter);

// /**
//  * Health Check Endpoint
//  * 
//  * Used by monitoring tools or deployment services (e.g., Render, Railway, Docker)
//  * to verify that the backend is alive and functioning.
//  */
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK',
//     message: 'Backend server is running',
//     timestamp: new Date().toISOString()
//   });
// });

// // Routes
// app.use('/api/upload', uploadRoutes);
// app.use('/api/search', searchRoutes);

// // Error handling
// app.use(errorHandler);

// /**
//  * Start Server
//  * 
//  * - Establishes MongoDB connection
//  * - Starts Express server only after DB connection is successful
//  * - Handles startup failures gracefully
//  */
// const startServer = async () => {
//   try {
//     // Connect to MongoDB before starting the server
//     await connectDatabase();

//     // Start Express server
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//       console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
//     });
//   } catch (error) {
//     // Log fatal startup errors and exit process
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };

// // Initialize server startup
// startServer();

// export default app;
