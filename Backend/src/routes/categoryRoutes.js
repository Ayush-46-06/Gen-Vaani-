import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for website & navbar
router.get('/', getAllCategories);

// Protected routes for Admin Dashboard
router.post('/', protectAdmin, createCategory);
router.put('/:id', protectAdmin, updateCategory);
router.delete('/:id', protectAdmin, deleteCategory);

export default router;

