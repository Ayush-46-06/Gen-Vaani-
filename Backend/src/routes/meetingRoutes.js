import express from 'express';
import {
  createMeeting,
  getBookedSlots,
  getMeetings,
  updateMeetingStatus,
  deleteMeeting,
  exportMeetingsExcel,
} from '../controllers/meetingController.js';

const router = express.Router();

// Public routes for booking consultation and checking available/booked slots
router.post('/', createMeeting);
router.get('/booked-slots', getBookedSlots);

// Export endpoint: Export all scheduled meetings to Excel (.xlsx) format
router.get('/export/excel', exportMeetingsExcel);

// Admin & consultation routes
router.get('/', getMeetings);
router.patch('/:id', updateMeetingStatus);
router.delete('/:id', deleteMeeting);

export default router;
