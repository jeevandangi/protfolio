import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'super_admin']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800 // 7 days
    }
  }]
}, {
  timestamps: true
});

// Virtual for account lock status
adminSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
adminSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
adminSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Instance method to increment login attempts
adminSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: {
        lockUntil: 1,
      },
      $set: {
        loginAttempts: 1,
      }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
    };
  }

  return this.updateOne(updates);
};

// Instance method to reset login attempts
adminSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    },
    $set: {
      lastLogin: new Date()
    }
  });
};

// Static method to get reasons for authentication failure
adminSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2,
  ACCOUNT_LOCKED: 3,
  ACCOUNT_INACTIVE: 4
};

// Static method for authentication
adminSchema.statics.getAuthenticated = async function (email, password) {
  const admin = await this.findOne({ email });

  // Check if admin exists
  if (!admin) {
    return { success: false, reason: this.failedLogin.NOT_FOUND };
  }

  // Check if account is active
  if (!admin.isActive) {
    return { success: false, reason: this.failedLogin.ACCOUNT_INACTIVE };
  }

  // Check if account is locked
  if (admin.isLocked) {
    return { success: false, reason: this.failedLogin.ACCOUNT_LOCKED };
  }

  // Test for a matching password
  const isMatch = await admin.comparePassword(password);

  if (isMatch) {
    // If there's no lock or failed attempts, just return the admin
    if (!admin.loginAttempts && !admin.lockUntil) {
      await admin.resetLoginAttempts();
      return { success: true, admin };
    }

    // Reset attempts and return admin
    await admin.resetLoginAttempts();
    return { success: true, admin };
  }

  // Password is incorrect, so increment login attempts
  await admin.incLoginAttempts();
  return { success: false, reason: this.failedLogin.PASSWORD_INCORRECT };
};

// Add refresh token
adminSchema.methods.addRefreshToken = function (token) {
  this.refreshTokens.push({ token });
  return this.save();
};

// Remove refresh token
adminSchema.methods.removeRefreshToken = function (token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
  return this.save();
};

// Clean expired refresh tokens
adminSchema.methods.cleanExpiredTokens = function () {
  this.refreshTokens = this.refreshTokens.filter(t =>
    t.createdAt.getTime() + (7 * 24 * 60 * 60 * 1000) > Date.now()
  );
  return this.save();
};

export default mongoose.model('Admin', adminSchema);
