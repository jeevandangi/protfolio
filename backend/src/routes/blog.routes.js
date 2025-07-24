import { Router } from 'express';
import {
  getBlogs,
  getBlogBySlug,
  getFeaturedBlogs,
  getBlogsByCategory,
  searchBlogs,
  likeBlog,
  getAdminBlogs,
  createBlog,
  getAdminBlog,
  updateBlog,
  deleteBlog,
  toggleBlogPublish,
  toggleBlogFeatured
} from '../controllers/blogController.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = Router();

// Admin routes (protected with authentication) - MUST BE BEFORE /:slug route
router.get('/admin', authenticateAdmin, getAdminBlogs);
router.post('/admin', authenticateAdmin, createBlog);
router.get('/admin/:id', authenticateAdmin, getAdminBlog);
router.put('/admin/:id', authenticateAdmin, updateBlog);
router.delete('/admin/:id', authenticateAdmin, deleteBlog);
router.patch('/admin/:id/publish', authenticateAdmin, toggleBlogPublish);
router.patch('/admin/:id/featured', authenticateAdmin, toggleBlogFeatured);

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/search', searchBlogs);
router.get('/category/:category', getBlogsByCategory);
router.patch('/:slug/like', likeBlog);
router.get('/:slug', getBlogBySlug); // This must be last as it catches everything

export default router;
