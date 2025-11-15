
import 'dotenv/config'; 

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
// NOTE:  keep connectDatabase imported, but it will be called once per Serverless Function invocation.
// In a true serverless environment,  might consider lazy loading the database connection
// inside a route handler or service function to optimize cold start. For now, we'll leave it here.
import { connectDatabase } from './src/config/database.js'; 
import uploadRoutes from './src/routes/upload.routes.js';
import searchRoutes from './src/routes/search.routes.js';
import { errorHandler } from './src/middleware/error.middleware.js';


const app = express();
// PORT definition is removed as Vercel manages the listener.

// Initialize database connection immediately upon function boot
// The connection can be cached across invocations in a serverless environment.
connectDatabase().catch(err => {
  console.error('Initial MongoDB Connection failed:', err);
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

/**
 * Global Middleware
 */
app.use(cors({
  // Vercel deployment will allow all origins by default when deployed to a domain, 
  // but setting the origin here is a good practice for development. 
  // Vercel also automatically handles CORS headers on its serverless functions.
  origin: process.env.FRONTEND_URL || '*', 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

/**
 * Health Check Endpoint
 * Vercel is configured to route /api/* to this file.
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Backend server is running (Vercel Serverless)',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);

// Error handling
app.use(errorHandler);

// IMPORTANT:  export the app instance instead of calling app.listen()
// Vercel will wrap this Express app into a serverless function handler.
export default app;
// Removed the startServer function












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
