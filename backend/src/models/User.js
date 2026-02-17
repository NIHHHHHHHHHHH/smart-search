import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema
 * 
 * Represents authenticated users in the system.
 * Includes password hashing, token management, and role-based access.
 */
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },

  // Email address (unique identifier)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },

  // Hashed password
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default in queries
  },

  // User role for access control
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  // Profile picture URL (optional)
  avatar: {
    type: String,
    default: null
  },

  // Account status
  isActive: {
    type: Boolean,
    default: true
  },

  // Last login tracking
  lastLogin: {
    type: Date,
    default: null
  },

  // Password reset token (for future forgot password feature)
  resetPasswordToken: String,
  resetPasswordExpire: Date

}, {
  timestamps: true // Adds createdAt & updatedAt
});

/**
 * Pre-save Hook: Hash Password
 * 
 * Automatically hashes the password before saving to database
 * Only runs if password field is modified
 */
userSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method: comparePassword
 * 
 * Compares plain text password with hashed password
 * Returns true if passwords match
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Method: updateLastLogin
 * 
 * Updates the lastLogin timestamp
 */
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  return this.save();
};

// Register model
const User = mongoose.model('User', userSchema);

export default User;