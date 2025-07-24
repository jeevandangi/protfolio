import express from 'express';
import { createInitialAdmin, checkSetupStatus } from '../controllers/setupController.js';

const router = express.Router();

/**
 * @route   GET /api/setup/status
 * @desc    Check if initial setup is needed
 * @access  Public
 */
router.get('/status', checkSetupStatus);

/**
 * @route   POST /api/setup/admin
 * @desc    Create initial admin user (only works if no admin exists)
 * @access  Public
 */
router.post('/admin', createInitialAdmin);

export default router;
