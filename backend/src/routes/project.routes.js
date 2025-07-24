import express from 'express';
import {
  getProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  getProjectBySlug,
  searchProjects,
  getAdminProjects,
  createProject,
  getAdminProject,
  updateProject,
  deleteProject,
  toggleFeatured,
  likeProject,
  trackClick
} from '../controllers/projectController.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Admin routes (protected with authentication)
router.get('/admin/all', authenticateAdmin, getAdminProjects);
router.post('/admin', authenticateAdmin, createProject);
router.get('/admin/:id', authenticateAdmin, getAdminProject);
router.put('/admin/:id', authenticateAdmin, updateProject);
router.delete('/admin/:id', authenticateAdmin, deleteProject);
router.patch('/admin/:id/featured', authenticateAdmin, toggleFeatured);

// Public routes
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/search', searchProjects);
router.get('/category/:category', getProjectsByCategory);
router.get('/:slug', getProjectBySlug);
router.post('/:slug/like', likeProject);
router.post('/:slug/click/:type', trackClick);

export default router;
