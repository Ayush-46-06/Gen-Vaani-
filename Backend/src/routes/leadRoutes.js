import express from 'express';
import {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
  exportLeadsExcel,
  replyToLead,
} from '../controllers/leadController.js';

const router = express.Router();

// Public endpoint: Anyone submitting the Get In Touch form creates a lead
router.post('/', createLead);

// Export endpoint: Export all leads to Excel (.xlsx) format
router.get('/export/excel', exportLeadsExcel);

// Admin endpoints: Fetch all leads, update status, delete lead, and reply via email
router.get('/', getLeads);
router.patch('/:id', updateLeadStatus);
router.post('/:id/reply', replyToLead);
router.delete('/:id', deleteLead);

export default router;
