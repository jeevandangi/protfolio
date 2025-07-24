import express from 'express';
import {
    login,
    logout,
    refreshToken,
    verifyToken,
    getProfile
} from '../controllers/authController.js';
import {
    authenticateAdmin,
    authRateLimit,
    validateSession
} from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login with email and password
 * @access  Public
 */
router.post('/admin/login', authRateLimit, login);

/**
 * @route   POST /api/auth/logout
 * @desc    Admin logout - clears cookies and refresh tokens
 * @access  Private
 */
router.post('/logout', authenticateAdmin, logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token from cookies
 * @access  Public (requires refresh token in cookies)
 */
router.post('/refresh', refreshToken);

/**
 * @route   POST /api/auth/verify
 * @desc    Verify access token validity
 * @access  Private
 */
router.post('/verify', authenticateAdmin, verifyToken);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current admin profile information
 * @access  Private
 */
router.get('/profile', authenticateAdmin, validateSession, getProfile);

/**
 * @route   GET /api/auth/check
 * @desc    Check authentication status
 * @access  Private
 */
router.get('/check', authenticateAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Authenticated',
        data: {
            isAuthenticated: true,
            admin: {
                id: req.admin._id,
                name: req.admin.name,
                email: req.admin.email,
                role: req.admin.role,
                lastLogin: req.admin.lastLogin
            }
        }
    });
});

export default router;