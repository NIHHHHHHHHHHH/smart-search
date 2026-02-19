import { verifyToken } from '../config/jwt.js';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * 
 * Protects routes by verifying JWT tokens from Authorization header
 * Attaches authenticated user to req.user for use in controllers
 */
export const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Find user by ID from token payload
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Invalid token.'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated.'
      });
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid token.'
    });
  }
};

/**
 * Admin Authorization Middleware
 * 
 * Checks if authenticated user has admin role
 * Must be used after authenticate middleware
 */
export const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

/**
 * Optional Authentication Middleware
 * 
 * Attaches user if token is valid, but doesn't block request if no token
 * Useful for endpoints that work for both authenticated and guest users
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');

      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (error) {
    // Silently fail - optional auth doesn't block request
    console.log('Optional auth failed:', error.message);
  }

  next();
};