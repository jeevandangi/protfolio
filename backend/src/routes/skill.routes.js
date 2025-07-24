import express from 'express';
import {
  getSkills,
  getSkillsGrouped,
  getSkillsByCategory,
  getTopSkills,
  getAdminSkills,
  createSkill,
  getSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  toggleSkillStatus
} from '../controllers/skillController.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Admin routes (protected with authentication)
router.get('/admin', authenticateAdmin, getAdminSkills);
router.put('/admin/reorder', authenticateAdmin, reorderSkills);
router.post('/admin', authenticateAdmin, createSkill);
router.get('/admin/:id', authenticateAdmin, getSkill);
router.put('/admin/:id', authenticateAdmin, updateSkill);
router.delete('/admin/:id', authenticateAdmin, deleteSkill);
router.patch('/admin/:id/toggle', authenticateAdmin, toggleSkillStatus);

// Public routes
router.get('/', getSkills);
router.get('/grouped', getSkillsGrouped);
router.get('/top', getTopSkills);
router.get('/category/:category', getSkillsByCategory);

export default router;
