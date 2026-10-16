import express from 'express';
import {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  seedServices,
} from '../controllers/serviceController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for website visitors
router.get('/', getAllServices);
router.get('/:slug', getServiceBySlug);

// Protected routes for Admin Dashboard
router.post('/', protectAdmin, createService);
router.put('/:id', protectAdmin, updateService);
router.delete('/:id', protectAdmin, deleteService);
router.post('/seed', protectAdmin, seedServices);

export default router;
