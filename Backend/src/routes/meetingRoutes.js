import express from 'express';
import {
  createMeeting,
  getBookedSlots,
  getMeetings,
  updateMeetingStatus,
  deleteMeeting,
  exportMeetingsExcel,
  getAvailability,
  updateAvailability,
  runMeetingReminders,
  sendSingleMeetingReminder,
} from '../controllers/meetingController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Availability configuration (AEST slots, working days, URLs)
router.get('/availability', getAvailability);
router.put('/availability', updateAvailability);

// Public routes for booking consultation and checking available/booked slots
router.post('/', createMeeting);
router.get('/booked-slots', getBookedSlots);

// 30-minute meeting reminder cron / manual trigger endpoints
router.get('/reminders/run', runMeetingReminders);
router.post('/reminders/run', runMeetingReminders);

// Export endpoint: Export all scheduled meetings to Excel (.xlsx) format
router.get('/export/excel', exportMeetingsExcel);

// Admin & consultation routes
router.get('/', getMeetings);
router.post('/:id/send-reminder', protectAdmin, sendSingleMeetingReminder);
router.patch('/:id', updateMeetingStatus);
router.delete('/:id', deleteMeeting);

export default router;
