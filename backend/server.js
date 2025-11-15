import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './src/config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Global Middleware
 * 
 * - CORS: Allows frontend to communicate with backend
 * - JSON Parser: Parses incoming JSON request bodies
 * - URL-Encoded Parser: Supports form submissions
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend domain
  credentials: true                                           // Allow cookies/auth headers
}));
app.use(express.json());                                       // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));               // Parse form data

/**
 * Health Check Endpoint
 * 
 * Used by monitoring tools or deployment services (e.g., Render, Railway, Docker)
 * to verify that the backend is alive and functioning.
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Start Server
 * 
 * - Establishes MongoDB connection
 * - Starts Express server only after DB connection is successful
 * - Handles startup failures gracefully
 */
const startServer = async () => {
  try {
    // Connect to MongoDB before starting the server
    await connectDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    // Log fatal startup errors and exit process
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize server startup
startServer();

export default app;
