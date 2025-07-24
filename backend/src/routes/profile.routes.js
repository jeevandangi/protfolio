import express from 'express';
import {
  getProfile,
  getAdminProfile,
  updateProfile,
  createProfile,
  getProfileAnalytics,
  updateTerminalCommands,
  updateSocialLinks,
  updateSEO,
  uploadProfileImage,
  uploadResume
} from '../controllers/profileController.js';
import { authenticateAdmin } from '../middlewares/auth.js';
import { uploadProfileImage as uploadImageMiddleware, uploadResume as uploadResumeMiddleware, handleUploadError } from '../middlewares/upload.js';

const router = express.Router();

// Admin routes (protected with authentication)
router.get('/admin', authenticateAdmin, getAdminProfile);
router.get('/admin/analytics', authenticateAdmin, getProfileAnalytics);
router.post('/admin', authenticateAdmin, createProfile);
router.put('/admin', authenticateAdmin, updateProfile);
router.put('/admin/terminal', authenticateAdmin, updateTerminalCommands);
router.put('/admin/social', authenticateAdmin, updateSocialLinks);
router.put('/admin/seo', authenticateAdmin, updateSEO);

// File upload routes
router.post('/admin/upload-image', authenticateAdmin, uploadImageMiddleware, handleUploadError, uploadProfileImage);
router.post('/admin/upload-resume', authenticateAdmin, uploadResumeMiddleware, handleUploadError, uploadResume);

// Public routes
router.get('/', getProfile);

export default router;
