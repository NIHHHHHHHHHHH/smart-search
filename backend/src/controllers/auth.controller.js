import User from '../models/User.js';
import { generateAuthResponse } from '../config/jwt.js';

/**
 * Register New User
 * 
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password // Will be hashed by pre-save hook
    });

    // Generate token and response
    const authResponse = generateAuthResponse(user);

    // Update last login
    await user.updateLastLogin();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: authResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

/**
 * Login User
 * 
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token and response
    const authResponse = generateAuthResponse(user);

    // Update last login
    await user.updateLastLogin();

    res.json({
      success: true,
      message: 'Login successful',
      data: authResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

/**
 * Get Current User Profile
 * 
 * @route   GET /api/auth/me
 * @access  Private (requires authentication)
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user is set by authenticate middleware
    const user = await User.findById(req.user.id).select('-password');

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    next(error);
  }
};

/**
 * Update User Profile
 * 
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    next(error);
  }
};

/**
 * Change Password
 * 
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save(); // Will trigger pre-save hook to hash

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    next(error);
  }
};

/**
 * Guest Login
 * 
 * @route   POST /api/auth/guest
 * @access  Public
 */
export const guestLogin = async (req, res, next) => {
  try {
    // Check if guest user already exists
    const guestEmail = 'guest@smartsearch.demo';
    let guestUser = await User.findOne({ email: guestEmail });

    // Create guest user if doesn't exist
    if (!guestUser) {
      guestUser = await User.create({
        name: 'Guest User',
        email: guestEmail,
        password: 'guest123456', // Will be hashed by pre-save hook
        role: 'user'
      });
      console.log('✅ Guest user created');
    }

    // Generate token and response
    const authResponse = generateAuthResponse(guestUser);

    // Update last login
    await guestUser.updateLastLogin();

    res.json({
      success: true,
      message: 'Guest login successful',
      data: authResponse
    });

  } catch (error) {
    console.error('Guest login error:', error);
    next(error);
  }
};