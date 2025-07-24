import express from 'express';
import {
  createMessage,
  getAdminMessages,
  getMessage,
  updateMessageStatus,
  replyToMessage,
  toggleStar,
  toggleFlag,
  addNote,
  deleteMessage,
  bulkUpdateMessages,
  getMessageAnalytics
} from '../controllers/messageController.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Admin routes (protected with authentication)
router.get('/admin', authenticateAdmin, getAdminMessages);
router.get('/admin/analytics', authenticateAdmin, getMessageAnalytics);
router.patch('/admin/bulk', authenticateAdmin, bulkUpdateMessages);
router.get('/admin/:id', authenticateAdmin, getMessage);
router.patch('/admin/:id/status', authenticateAdmin, updateMessageStatus);
router.post('/admin/:id/reply', authenticateAdmin, replyToMessage);
router.patch('/admin/:id/star', authenticateAdmin, toggleStar);
router.patch('/admin/:id/flag', authenticateAdmin, toggleFlag);
router.post('/admin/:id/notes', authenticateAdmin, addNote);
router.delete('/admin/:id', authenticateAdmin, deleteMessage);

// Public routes
router.post('/', createMessage);

export default router;
