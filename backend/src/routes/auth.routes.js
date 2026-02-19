import express from 'express';
import {
  register,
  login,
  guestLogin,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * Public Routes (No authentication required)
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/guest
 * @desc    Login as guest user (demo access)
 * @access  Public
 */
router.post('/guest', guestLogin);

/**
 * Protected Routes (Authentication required)
 */

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, updateProfile);

/**
 * @route   PUT /api/auth/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/password', authenticate, changePassword);

export default router;