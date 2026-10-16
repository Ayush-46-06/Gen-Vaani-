import express from 'express';
import {
  getWebsites,
  getWebsiteById,
  createWebsite,
  updateWebsite,
  deleteWebsite,
  uploadToImageKit,
} from '../controllers/portfolioController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getWebsites);
router.get('/:id', getWebsiteById);

// Admin-only routes
router.post('/upload', protectAdmin, uploadToImageKit);
router.post('/', protectAdmin, createWebsite);
router.put('/:id', protectAdmin, updateWebsite);
router.delete('/:id', protectAdmin, deleteWebsite);

export default router;
