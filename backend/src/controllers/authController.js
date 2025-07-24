import Admin from '../models/Admin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {
  generateTokenPair,
  verifyRefreshToken,
  getCookieConfig,
  getRefreshCookieConfig
} from '../utils/jwt.js';

/**
 * @desc    Admin login with email and password
 * @route   POST /api/auth/admin/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required', [], 'MISSING_CREDENTIALS');
  }

  // Authenticate admin
  const authResult = await Admin.getAuthenticated(email, password);

  if (!authResult || !authResult.success) {
    let message = 'Authentication failed.';
    let statusCode = 401;

    if (authResult && authResult.reason) {
      switch (authResult.reason) {
        case Admin.failedLogin.NOT_FOUND:
        case Admin.failedLogin.PASSWORD_INCORRECT:
          message = 'Invalid email or password.';
          break;
        case Admin.failedLogin.MAX_ATTEMPTS:
        case Admin.failedLogin.ACCOUNT_LOCKED:
          message = 'Account temporarily locked due to too many failed login attempts.';
          break;
        case Admin.failedLogin.ACCOUNT_INACTIVE:
          message = 'Account is deactivated. Please contact administrator.';
          break;
      }
    }

    throw new ApiError(statusCode, message);
  }

  const admin = authResult.admin;

  if (!admin) {
    throw new ApiError(500, 'Authentication succeeded but admin data is missing');
  }

  // Generate JWT tokens
  const tokenPayload = {
    adminId: admin._id,
    email: admin.email,
    role: admin.role
  };

  const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

  // Save refresh token to database
  await admin.addRefreshToken(refreshToken);

  // Set cookies
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieConfig = getCookieConfig(isProduction);
  const refreshCookieConfig = getRefreshCookieConfig(isProduction);

  res.cookie('adminToken', accessToken, cookieConfig);
  res.cookie('adminRefreshToken', refreshToken, refreshCookieConfig);

  // Return success response
  res.status(200).json(
    new ApiResponse(200, {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      },
      token: accessToken,
      expiresIn: '15m'
    }, 'Login successful')
  );
});

/**
 * @desc    Admin logout - clears cookies and refresh tokens
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.adminRefreshToken;

  // Remove refresh token from database if it exists
  if (refreshToken && req.admin) {
    await req.admin.removeRefreshToken(refreshToken);
  }

  // Clear cookies
  res.clearCookie('adminToken');
  res.clearCookie('adminRefreshToken');

  res.status(200).json(
    new ApiResponse(200, null, 'Logout successful')
  );
});

/**
 * @desc    Refresh access token using refresh token from cookies
 * @route   POST /api/auth/refresh
 * @access  Public (requires refresh token in cookies)
 */
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.adminRefreshToken;

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token not provided', [], 'NO_REFRESH_TOKEN');
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Find admin and check if refresh token exists
  const admin = await Admin.findById(decoded.adminId);

  if (!admin || !admin.refreshTokens.some(t => t.token === refreshToken)) {
    throw new ApiError(401, 'Invalid refresh token', [], 'INVALID_REFRESH_TOKEN');
  }

  // Check if admin is still active
  if (!admin.isActive || admin.isLocked) {
    throw new ApiError(401, 'Account is no longer active', [], 'ACCOUNT_INACTIVE');
  }

  // Generate new token pair
  const tokenPayload = {
    adminId: admin._id,
    email: admin.email,
    role: admin.role
  };

  const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(tokenPayload);

  // Replace old refresh token with new one
  await admin.removeRefreshToken(refreshToken);
  await admin.addRefreshToken(newRefreshToken);

  // Set new cookies
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieConfig = getCookieConfig(isProduction);
  const refreshCookieConfig = getRefreshCookieConfig(isProduction);

  res.cookie('adminToken', accessToken, cookieConfig);
  res.cookie('adminRefreshToken', newRefreshToken, refreshCookieConfig);

  res.status(200).json(
    new ApiResponse(200, {
      token: accessToken,
      expiresIn: '15m'
    }, 'Token refreshed successfully')
  );
});

/**
 * @desc    Verify access token validity
 * @route   POST /api/auth/verify
 * @access  Private
 */
const verifyToken = asyncHandler(async (req, res) => {
  // If we reach here, the authenticateAdmin middleware has already verified the token
  res.status(200).json(
    new ApiResponse(200, {
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
        lastLogin: req.admin.lastLogin
      }
    }, 'Token is valid')
  );
});

/**
 * @desc    Get current admin profile information
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, {
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
        lastLogin: req.admin.lastLogin,
        createdAt: req.admin.createdAt
      }
    }, 'Profile retrieved successfully')
  );
});

export {
  login,
  logout,
  refreshToken,
  verifyToken,
  getProfile
};
