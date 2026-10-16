import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAdminStats,
  exportMasterExcel,
  changeAdminPassword,
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/export/excel', exportMasterExcel);

// Protected routes (require Bearer JWT token)
router.get('/me', protectAdmin, getAdminProfile);
router.get('/stats', protectAdmin, getAdminStats);
router.put('/change-password', protectAdmin, changeAdminPassword);

export default router;
