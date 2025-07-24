import Admin from '../models/Admin.js';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt.js';

/**
 * Authentication middleware for admin routes
 * Checks for JWT token in cookies or Authorization header
 */
const authenticateAdmin = async (req, res, next) => {
  try {
    let token = null;

    // First, try to get token from cookies
    if (req.cookies && req.cookies.adminToken) {
      token = req.cookies.adminToken;
    }

    // If no cookie token, try Authorization header
    if (!token && req.headers.authorization) {
      token = extractTokenFromHeader(req.headers.authorization);
    }

    // If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
        code: 'NO_TOKEN'
      });
    }

    // Verify the token
    const decoded = verifyAccessToken(token);

    // Find the admin user
    const admin = await Admin.findById(decoded.adminId).select('-password -refreshTokens');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Admin user not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if admin account is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Account is deactivated.',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    // Check if admin account is locked
    if (admin.isLocked) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Account is temporarily locked.',
        code: 'ACCOUNT_LOCKED'
      });
    }

    // Add admin info to request object
    req.admin = admin;
    req.adminId = admin._id;

    next();
  } catch (error) {
    console.error('Authentication error:', error);

    // Handle specific JWT errors
    if (error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token has expired.',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.message.includes('invalid') || error.message.includes('malformed')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication failed.',
      code: 'AUTH_FAILED'
    });
  }
};

/**
 * Optional authentication middleware
 * Adds admin info to request if token is valid, but doesn't block access
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = null;

    // Try to get token from cookies or header
    if (req.cookies && req.cookies.adminToken) {
      token = req.cookies.adminToken;
    } else if (req.headers.authorization) {
      token = extractTokenFromHeader(req.headers.authorization);
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      const admin = await Admin.findById(decoded.adminId).select('-password -refreshTokens');

      if (admin && admin.isActive && !admin.isLocked) {
        req.admin = admin;
        req.adminId = admin._id;
      }
    }

    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};

/**
 * Role-based authorization middleware
 * @param {Array} roles - Array of allowed roles
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    if (roles.length && !roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

/**
 * Rate limiting middleware for authentication attempts
 */
const authRateLimit = (req, res, next) => {
  // This is a simple in-memory rate limiter
  // In production, use Redis or a proper rate limiting solution
  const ip = req.ip || req.connection.remoteAddress;
  const key = `auth_attempts_${ip}`;

  if (!global.authAttempts) {
    global.authAttempts = new Map();
  }

  const now = Date.now();
  const attempts = global.authAttempts.get(key) || { count: 0, resetTime: now + 15 * 60 * 1000 };

  // Reset counter if time window has passed
  if (now > attempts.resetTime) {
    attempts.count = 0;
    attempts.resetTime = now + 15 * 60 * 1000; // 15 minutes
  }

  // Check if limit exceeded (10 attempts per 15 minutes)
  if (attempts.count >= 10) {
    return res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil((attempts.resetTime - now) / 1000)
    });
  }

  // Increment counter
  attempts.count++;
  global.authAttempts.set(key, attempts);

  next();
};

/**
 * Middleware to validate admin session
 */
const validateSession = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. Please login again.',
        code: 'INVALID_SESSION'
      });
    }

    // Update last activity
    await Admin.findByIdAndUpdate(req.adminId, {
      lastLogin: new Date()
    });

    next();
  } catch (error) {
    console.error('Session validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Session validation failed.',
      code: 'SESSION_ERROR'
    });
  }
};

export {
  authenticateAdmin,
  optionalAuth,
  authorize,
  authRateLimit,
  validateSession
};
