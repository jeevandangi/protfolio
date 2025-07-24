import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '15m'; // Access token expires in 15 minutes
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d'; // Refresh token expires in 7 days

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload
 * @returns {String} JWT token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
    issuer: 'portfolio-admin',
    audience: 'portfolio-app'
  });
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - Token payload
 * @returns {String} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  const refreshSecret = JWT_SECRET + '-refresh';
  return jwt.sign(payload, refreshSecret, {
    expiresIn: JWT_REFRESH_EXPIRE,
    issuer: 'portfolio-admin',
    audience: 'portfolio-app'
  });
};

/**
 * Verify JWT access token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'portfolio-admin',
      audience: 'portfolio-app'
    });
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

/**
 * Verify JWT refresh token
 * @param {String} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  try {
    const refreshSecret = JWT_SECRET + '-refresh';
    return jwt.verify(token, refreshSecret, {
      issuer: 'portfolio-admin',
      audience: 'portfolio-app'
    });
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Generate secure random token
 * @param {Number} length - Token length
 * @returns {String} Random token
 */
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate token pair (access + refresh)
 * @param {Object} payload - Token payload
 * @returns {Object} Token pair
 */
const generateTokenPair = (payload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRE
  };
};

/**
 * Extract token from Authorization header
 * @param {String} authHeader - Authorization header value
 * @returns {String|null} Extracted token
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

/**
 * Get token expiration time
 * @param {String} token - JWT token
 * @returns {Number} Expiration timestamp
 */
const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 * @param {String} token - JWT token
 * @returns {Boolean} True if expired
 */
const isTokenExpired = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  return Date.now() >= expiration;
};

/**
 * Cookie configuration for JWT tokens
 */
const getCookieConfig = (isProduction = false) => {
  return {
    httpOnly: true, // Prevent XSS attacks
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'strict' : 'lax', // CSRF protection
    maxAge: 15 * 60 * 1000, // 15 minutes for access token
    path: '/'
  };
};

/**
 * Refresh cookie configuration
 */
const getRefreshCookieConfig = (isProduction = false) => {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
    path: '/api/auth'
  };
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateSecureToken,
  generateTokenPair,
  extractTokenFromHeader,
  getTokenExpiration,
  isTokenExpired,
  getCookieConfig,
  getRefreshCookieConfig,
  JWT_SECRET,
  JWT_EXPIRE,
  JWT_REFRESH_EXPIRE
};
