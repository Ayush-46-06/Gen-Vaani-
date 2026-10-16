import { Meeting } from '../models/Meeting.js';
import { Lead } from '../models/Lead.js';
import { sendAppointmentEmails } from '../services/emailService.js';
import XLSX from 'xlsx';

export const GENVAANI_MEET_URL = 'https://meet.google.com/mjk-yknw-mvz';

// Demonstration meetings to seed if database is empty
const SEED_MEETINGS = [
  {
    clientName: 'Ananya Deshmukh',
    company: 'Apex Healthcare Labs',
    email: 'ananya@apexlabs.in',
    phone: '+91 98201 44521',
    service: 'Custom Web Application Scoping',
    date: 'Wednesday, October 14, 2026',
    dateKey: '2026-10-14',
    time: '11:00 AM',
    timezone: 'Asia/Kolkata',
    attendees: ['Ayush (Lead Architect)', 'Ananya Deshmukh (CTO)'],
    meetUrl: GENVAANI_MEET_URL,
    status: 'confirmed',
    notes: 'Review system architecture, database schema & HIPAA compliance timeline.',
  },
  {
    clientName: 'Rohan Mehra',
    company: 'Mehra Fine Jewels',
    email: 'rohan@mehrajewels.com',
    phone: '+91 97112 88902',
    service: 'UI/UX Interactive Prototype Review',
    date: 'Wednesday, October 14, 2026',
    dateKey: '2026-10-14',
    time: '02:00 PM',
    timezone: 'Asia/Kolkata',
    attendees: ['Ayush (Design Lead)', 'Rohan Mehra (Founder)'],
    meetUrl: GENVAANI_MEET_URL,
    status: 'confirmed',
    notes: 'Walkthrough Figma wireframes, luxury brand typography & checkout funnel.',
  },
  {
    clientName: 'Elena Rostova',
    company: 'Nordic SaaS Labs',
    email: 'elena@nordicsaas.se',
    phone: '+46 8 123 4567',
    service: 'Enterprise Mobile Architecture',
    date: 'Thursday, October 15, 2026',
    dateKey: '2026-10-15',
    time: '09:30 AM',
    timezone: 'Asia/Kolkata',
    attendees: ['Ayush (Lead Architect)', 'Elena Rostova (Head of Product)'],
    meetUrl: GENVAANI_MEET_URL,
    status: 'confirmed',
    notes: 'Discuss offline caching, push notifications and biometric security.',
  },
  {
    clientName: 'Devendra Patel',
    company: 'KisanConnect Logistics',
    email: 'devendra@kisanconnect.org',
    phone: '+91 94250 77189',
    service: 'Kickoff & Sprint Planning',
    date: 'Friday, October 16, 2026',
    dateKey: '2026-10-16',
    time: '04:15 PM',
    timezone: 'Asia/Kolkata',
    attendees: ['Full Tech Squad', 'Devendra Patel (Director)'],
    meetUrl: GENVAANI_MEET_URL,
    status: 'confirmed',
    notes: 'Final sprint milestone sign-off, staging deployment schedule & API keys.',
  },
];

/**
 * @desc    Book a new consultation meeting from public calendar
 * @route   POST /api/meetings
 * @access  Public
 */
export const createMeeting = async (req, res) => {
  try {
    const {
      clientName,
      name,
      email,
      phone,
      service,
      date,
      dateKey,
      time,
      timezone,
      notes,
    } = req.body;

    const finalName = clientName || name;

    // 1. Validate required fields
    if (!finalName || !email || !service || !date || !dateKey || !time) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, Service, Date, and Time slot are all required to book a consultation.',
      });
    }

    // 2. Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // 3. Check for slot collision: is this slot already confirmed for this date?
    const existingBooking = await Meeting.findOne({
      dateKey: dateKey.trim(),
      time: time.trim(),
      status: 'confirmed',
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: `The ${time} slot on ${date} is already reserved by another client. Please select another available time.`,
      });
    }

    // 4. Derive company name if possible
    let company = 'Direct Client';
    const domain = email.split('@')[1];
    if (domain && !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'].includes(domain.toLowerCase())) {
      company = domain.split('.')[0].toUpperCase();
    }

    // 5. Create new meeting with the requested Google Meet link
    const meeting = await Meeting.create({
      clientName: finalName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      company,
      service: service.trim(),
      date: date.trim(),
      dateKey: dateKey.trim(),
      time: time.trim(),
      timezone: timezone || 'Asia/Kolkata',
      notes: notes ? notes.trim() : 'Scheduled 30-minute discovery consultation.',
      meetUrl: GENVAANI_MEET_URL,
      status: 'confirmed',
    });

    // 6. Also sync to Leads collection so lead tracking is complete
    try {
      await Lead.create({
        name: finalName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : '',
        company,
        service: service.trim(),
        message: `Scheduled consultation for ${date} at ${time}. ${notes ? `Notes: ${notes}` : ''}`,
        budget: 'Discovery Consultation',
        status: 'new',
        source: 'Consultation Calendar',
      });
    } catch (leadSyncErr) {
      console.warn('Lead sync skipped during meeting creation', leadSyncErr);
    }

    console.log(`📅 [Meeting Booked]: ${meeting.clientName} on ${meeting.dateKey} at ${meeting.time} -> Google Meet: ${GENVAANI_MEET_URL}`);

    // 7. Dispatch Brevo Email Confirmation to Visitor & Notification to Admin
    let emailStatus = null;
    try {
      emailStatus = await sendAppointmentEmails(meeting);
    } catch (emailErr) {
      console.error('⚠️ [Email Dispatch Warning]: Failed to dispatch Brevo emails:', emailErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Consultation confirmed successfully! Your Google Meet link is ready.',
      meeting,
      meetUrl: GENVAANI_MEET_URL,
      emailStatus,
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred while booking consultation.',
    });
  }
};

/**
 * @desc    Get booked slots to exclude them from the public calendar
 * @route   GET /api/meetings/booked-slots
 * @access  Public
 */
export const getBookedSlots = async (req, res) => {
  try {
    const { dateKey } = req.query;

    if (dateKey) {
      // Find all confirmed meetings for this specific date
      const meetings = await Meeting.find({
        dateKey: dateKey.trim(),
        status: 'confirmed',
      }).select('time');

      const bookedSlots = meetings.map((m) => m.time);

      return res.status(200).json({
        success: true,
        dateKey,
        bookedSlots,
      });
    }

    // Return all confirmed bookings grouped by dateKey
    const allConfirmed = await Meeting.find({ status: 'confirmed' }).select('dateKey time');
    const scheduleMap = {};

    allConfirmed.forEach((m) => {
      if (!scheduleMap[m.dateKey]) {
        scheduleMap[m.dateKey] = [];
      }
      if (!scheduleMap[m.dateKey].includes(m.time)) {
        scheduleMap[m.dateKey].push(m.time);
      }
    });

    return res.status(200).json({
      success: true,
      scheduleMap,
    });
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve booked schedule slots.',
    });
  }
};

/**
 * @desc    Get all meetings for Admin Dashboard
 * @route   GET /api/meetings
 * @access  Public / Admin
 */
export const getMeetings = async (req, res) => {
  try {
    let count = await Meeting.countDocuments();

    // Auto-seed demo meetings if database is fresh
    if (count === 0) {
      console.log('🌱 Seeding initial discovery meetings into MongoDB with Meet URL: ' + GENVAANI_MEET_URL);
      await Meeting.insertMany(SEED_MEETINGS);
    }

    const meetings = await Meeting.find().sort({ dateKey: 1, time: 1 });

    return res.status(200).json({
      success: true,
      count: meetings.length,
      meetings,
      meetUrl: GENVAANI_MEET_URL,
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve meetings from database.',
    });
  }
};

/**
 * @desc    Update meeting status
 * @route   PATCH /api/meetings/:id
 * @access  Admin
 */
export const updateMeetingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meeting status. Must be confirmed, completed, or cancelled.',
      });
    }

    const meeting = await Meeting.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Meeting status updated successfully.',
      meeting,
    });
  } catch (error) {
    console.error('Error updating meeting status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update meeting status.',
    });
  }
};

/**
 * @desc    Delete a meeting
 * @route   DELETE /api/meetings/:id
 * @access  Admin
 */
export const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findByIdAndDelete(id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Meeting removed successfully.',
    });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete meeting.',
    });
  }
};

/**
 * @desc    Export all scheduled meetings to Excel (.xlsx) spreadsheet
 * @route   GET /api/meetings/export/excel
 * @access  Public / Admin
 */
export const exportMeetingsExcel = async (req, res) => {
  try {
    let meetings = await Meeting.find().sort({ dateKey: -1, createdAt: -1 });
    if (!meetings || meetings.length === 0) {
      meetings = SEED_MEETINGS;
    }

    const rows = meetings.map((meet, index) => {
      let statusLabel = 'Confirmed';
      if (meet.status === 'completed') statusLabel = 'Completed';
      else if (meet.status === 'cancelled') statusLabel = 'Cancelled';

      const bookedOn = meet.createdAt
        ? new Date(meet.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Recent';

      return {
        'S.No': index + 1,
        'Meeting ID': meet._id ? String(meet._id) : `MT-${500 + index}`,
        'Client Name': meet.clientName || meet.name || 'N/A',
        'Company / Organization': meet.company || 'Direct Client',
        'Client Email': meet.email || 'N/A',
        'Phone Number': meet.phone || 'Not Provided',
        'Service Requested': meet.service || 'Consultation',
        'Consultation Date': meet.date || meet.dateKey || 'N/A',
        'Date Key (YYYY-MM-DD)': meet.dateKey || 'N/A',
        'Time Slot': meet.time || 'N/A',
        'Timezone': meet.timezone || 'Asia/Kolkata',
        'Meeting Status': statusLabel,
        'Google Meet URL': meet.meetUrl || GENVAANI_MEET_URL,
        'Agenda / Scoping Notes': meet.notes || 'Initial consultation and tech scoping.',
        'Booked On': bookedOn,
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto-fit column widths
    if (rows.length > 0) {
      const keys = Object.keys(rows[0]);
      ws['!cols'] = keys.map((key) => {
        let maxLen = key.length;
        rows.forEach((r) => {
          const val = r[key] !== undefined && r[key] !== null ? String(r[key]) : '';
          if (val.length > maxLen) maxLen = val.length;
        });
        return { wch: Math.min(Math.max(maxLen + 4, 14), 60) };
      });
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Scheduled Meets');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const today = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="Gen-Vaani_Scheduled_Meets_${today}.xlsx"`);
    return res.send(buffer);
  } catch (error) {
    console.error('Error exporting meetings to Excel:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to export meetings to Excel spreadsheet.',
    });
  }
};
