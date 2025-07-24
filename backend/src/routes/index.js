import express from 'express';
import setupRoutes from './setup.routes.js';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import skillRoutes from './skill.routes.js';
import projectRoutes from './project.routes.js';
import messageRoutes from './message.routes.js';
import blogRoutes from './blog.routes.js';

const router = express.Router();

// API Routes
router.use('/setup', setupRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/skills', skillRoutes);
router.use('/projects', projectRoutes);
router.use('/messages', messageRoutes);
router.use('/blogs', blogRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API info route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Jeevan Dangi Portfolio API',
    version: '1.0.0',
    endpoints: {
      profile: '/api/profile',
      skills: '/api/skills',
      projects: '/api/projects',
      messages: '/api/messages',
      blogs: '/api/blogs',
      health: '/api/health'
    },
    documentation: 'https://api-docs.jeevan-portfolio.com'
  });
});

export default router;
