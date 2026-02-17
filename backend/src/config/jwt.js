import jwt from 'jsonwebtoken';

/**
 * JWT Configuration
 * 
 * Centralized JWT token generation and verification utilities
 */

// Get JWT secret from environment (fallback for development only)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d'; // Token expiration time

/**
 * Generate JWT Token
 * 
 * @param {Object} payload - Data to encode in token (typically user id)
 * @returns {String} - Signed JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

/**
 * Verify JWT Token
 * 
 * @param {String} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate Auth Response
 * 
 * Creates a standardized response object with token and user data
 * 
 * @param {Object} user - Mongoose user document
 * @returns {Object} - Response object with token and user info
 */
export const generateAuthResponse = (user) => {
  const token = generateToken({ id: user._id });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt
    }
  };
};