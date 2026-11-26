import { Meeting } from '../models/Meeting.js';
import { Lead } from '../models/Lead.js';
import { Availability } from '../models/Availability.js';
import { sendAppointmentEmails } from '../services/emailService.js';
import {
  dispatchReminderForMeeting,
  processDueMeetingReminders,
} from '../services/meetingReminderService.js';
import { computeMeetingScheduledAt } from '../utils/meetingTime.js';
import XLSX from 'xlsx';

export const GOOGLE_MEET_URLS = [
  'https://meet.google.com/mjk-yknw-mvz',
  'https://meet.google.com/geb-oycw-gcq',
];

export const TEAMS_URLS = [
  'https://teams.live.com/meet/93318275504734?p=xK5khRzzuLiFVq30LM',
  'https://teams.live.com/meet/93608937335627?p=yjLmlQpPbBwL3JPtvn',
];

export const GENVAANI_MEET_URL = GOOGLE_MEET_URLS[0];
export const GENVAANI_TEAMS_URL = TEAMS_URLS[0];

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
 * @desc    Get agency availability settings (AEST time slots, working days, URLs)
 * @route   GET /api/meetings/availability
 * @access  Public
 */
export const getAvailability = async (req, res) => {
  try {
    let availability = await Availability.findOne();
    if (!availability) {
      availability = await Availability.create({
        timezone: 'Australia/Sydney',
        timeSlots: [
          '09:30 AM',
          '11:00 AM',
          '12:30 PM',
          '02:00 PM',
          '03:30 PM',
          '04:15 PM',
        ],
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        googleMeetUrl: GOOGLE_MEET_URLS[0],
        googleMeetUrls: GOOGLE_MEET_URLS,
        teamsUrl: TEAMS_URLS[0],
        teamsUrls: TEAMS_URLS,
        slotDurationMinutes: 30,
      });
    } else {
      let modified = false;
      if (!Array.isArray(availability.googleMeetUrls) || availability.googleMeetUrls.length < 2) {
        availability.googleMeetUrls = GOOGLE_MEET_URLS;
        modified = true;
      }
      if (!Array.isArray(availability.teamsUrls) || availability.teamsUrls.length < 2) {
        availability.teamsUrls = TEAMS_URLS;
        modified = true;
      }
      if (modified) {
        await availability.save();
      }
    }

    return res.status(200).json({
      success: true,
      availability,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve availability settings.',
    });
  }
};

/**
 * @desc    Update agency availability settings from Admin Portal (AEST slots, days, links)
 * @route   PUT /api/meetings/availability
 * @access  Admin
 */
export const updateAvailability = async (req, res) => {
  try {
    const {
      timeSlots,
      workingDays,
      googleMeetUrl,
      googleMeetUrls,
      teamsUrl,
      teamsUrls,
      slotDurationMinutes,
    } = req.body;

    const updatePayload = {};
    if (Array.isArray(timeSlots)) updatePayload.timeSlots = timeSlots;
    if (Array.isArray(workingDays)) updatePayload.workingDays = workingDays;
    if (googleMeetUrl) updatePayload.googleMeetUrl = googleMeetUrl.trim();
    if (Array.isArray(googleMeetUrls) && googleMeetUrls.length > 0) {
      updatePayload.googleMeetUrls = googleMeetUrls.map((u) => u.trim()).filter(Boolean);
      updatePayload.googleMeetUrl = updatePayload.googleMeetUrls[0];
    }
    if (teamsUrl) updatePayload.teamsUrl = teamsUrl.trim();
    if (Array.isArray(teamsUrls) && teamsUrls.length > 0) {
      updatePayload.teamsUrls = teamsUrls.map((u) => u.trim()).filter(Boolean);
      updatePayload.teamsUrl = updatePayload.teamsUrls[0];
    }
    if (slotDurationMinutes) updatePayload.slotDurationMinutes = Number(slotDurationMinutes);

    const availability = await Availability.findOneAndUpdate(
      {},
      { $set: updatePayload },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'AEST Availability and consultation settings updated successfully.',
      availability,
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update availability settings.',
    });
  }
};

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
      location,
      aestTime,
      aestDateKey,
    } = req.body;

    const finalName = clientName || name;
    const finalLocation = ['Google Meet', 'Microsoft Teams', 'Phone call'].includes(location)
      ? location
      : 'Google Meet';

    // 1. Validate required fields
    if (!finalName || !email || !service || !date || !dateKey || !time) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, Service, Date, and Time slot are all required to book a consultation.',
      });
    }

    // Phone is required if location is 'Phone call'
    if (finalLocation === 'Phone call' && (!phone || !phone.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required when selecting Phone call consultation so our team can reach you.',
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

    // 3. Check for slot collision: check both client local slot and canonical AEST slot
    const collisionOr = [
      { dateKey: dateKey.trim(), time: time.trim() },
    ];
    if (aestDateKey && aestTime) {
      collisionOr.push({ aestDateKey: aestDateKey.trim(), aestTime: aestTime.trim() });
    }
    if (aestTime) {
      collisionOr.push({ dateKey: (aestDateKey || dateKey).trim(), time: aestTime.trim() });
    }

    const existingBooking = await Meeting.findOne({
      status: 'confirmed',
      $or: collisionOr,
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: `The ${time} slot (${aestTime ? `${aestTime} AEST` : ''}) on ${date} is already reserved by another client. Please select another available time.`,
      });
    }

    // 4. Derive company name if possible
    let company = 'Direct Client';
    const domain = email.split('@')[1];
    if (domain && !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'].includes(domain.toLowerCase())) {
      company = domain.split('.')[0].toUpperCase();
    }

    // Fetch availability configuration
    const currentAvail = await Availability.findOne();

    // 5. Alternating Meeting Link Assignment:
    // Alternate links for odd vs even users based on existing booking count
    let finalMeetUrl = GENVAANI_MEET_URL;
    let finalTeamsUrl = GENVAANI_TEAMS_URL;

    if (finalLocation === 'Google Meet') {
      const meetPool = (Array.isArray(currentAvail?.googleMeetUrls) && currentAvail.googleMeetUrls.filter(Boolean).length > 0)
        ? currentAvail.googleMeetUrls.filter(Boolean)
        : GOOGLE_MEET_URLS;

      const existingMeetCount = await Meeting.countDocuments({ location: 'Google Meet' });
      // 1st user (count 0) -> meetPool[0] (odd user)
      // 2nd user (count 1) -> meetPool[1] (even user)
      finalMeetUrl = meetPool[existingMeetCount % meetPool.length] || GENVAANI_MEET_URL;
      console.log(`🎥 Assigned Google Meet link #${(existingMeetCount % meetPool.length) + 1} (${(existingMeetCount % 2 === 0) ? 'Odd user' : 'Even user'}): ${finalMeetUrl}`);
    } else if (finalLocation === 'Microsoft Teams') {
      const teamsPool = (Array.isArray(currentAvail?.teamsUrls) && currentAvail.teamsUrls.filter(Boolean).length > 0)
        ? currentAvail.teamsUrls.filter(Boolean)
        : TEAMS_URLS;

      const existingTeamsCount = await Meeting.countDocuments({ location: 'Microsoft Teams' });
      // 1st user (count 0) -> teamsPool[0] (odd user)
      // 2nd user (count 1) -> teamsPool[1] (even user)
      finalTeamsUrl = teamsPool[existingTeamsCount % teamsPool.length] || GENVAANI_TEAMS_URL;
      console.log(`💼 Assigned Microsoft Teams link #${(existingTeamsCount % teamsPool.length) + 1} (${(existingTeamsCount % 2 === 0) ? 'Odd user' : 'Even user'}): ${finalTeamsUrl}`);
    }

    // 6. Create new meeting
    const meeting = await Meeting.create({
      clientName: finalName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      company,
      service: service.trim(),
      date: date.trim(),
      dateKey: dateKey.trim(),
      time: time.trim(),
      timezone: timezone || 'Australia/Sydney',
      aestTime: aestTime ? aestTime.trim() : time.trim(),
      aestDateKey: aestDateKey ? aestDateKey.trim() : dateKey.trim(),
      location: finalLocation,
      notes: notes ? notes.trim() : 'Scheduled 30-minute discovery consultation.',
      meetUrl: finalMeetUrl,
      teamsUrl: finalTeamsUrl,
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
        message: `Scheduled ${finalLocation} consultation for ${date} at ${time} (${meeting.aestTime} AEST). ${notes ? `Notes: ${notes}` : ''}`,
        budget: 'Discovery Consultation',
        status: 'new',
        source: 'Consultation Calendar',
      });
    } catch (leadSyncErr) {
      console.warn('Lead sync skipped during meeting creation', leadSyncErr);
    }

    console.log(`📅 [Meeting Booked]: ${meeting.clientName} (${finalLocation}) on ${meeting.dateKey} at ${meeting.time} [${meeting.aestTime} AEST]`);

    // 7. Dispatch Brevo Email Confirmation to Visitor & Notification to Admin
    let emailStatus = null;
    try {
      emailStatus = await sendAppointmentEmails(meeting);
    } catch (emailErr) {
      console.error('⚠️ [Email Dispatch Warning]: Failed to dispatch Brevo emails:', emailErr);
    }

    let successMessage = 'Consultation confirmed successfully! Your Google Meet link is ready.';
    if (finalLocation === 'Microsoft Teams') {
      successMessage = 'Consultation confirmed successfully! Your Microsoft Teams link is ready.';
    } else if (finalLocation === 'Phone call') {
      successMessage = `Consultation confirmed successfully! We will call you at ${meeting.phone} at your scheduled time.`;
    }

    return res.status(201).json({
      success: true,
      message: successMessage,
      meeting,
      meetUrl: finalMeetUrl,
      teamsUrl: finalTeamsUrl,
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
    const { dateKey, aestDateKey } = req.query;

    if (dateKey || aestDateKey) {
      const targetDate = (dateKey || aestDateKey).trim();
      // Find all confirmed meetings matching dateKey or aestDateKey
      const meetings = await Meeting.find({
        status: 'confirmed',
        $or: [
          { dateKey: targetDate },
          { aestDateKey: targetDate },
        ],
      }).select('time aestTime dateKey aestDateKey');

      const bookedSlots = meetings.map((m) => m.time);
      const bookedAestSlots = meetings.map((m) => m.aestTime || m.time);

      return res.status(200).json({
        success: true,
        dateKey: targetDate,
        bookedSlots,
        bookedAestSlots,
      });
    }

    // Return all confirmed bookings grouped by dateKey & aestDateKey
    const allConfirmed = await Meeting.find({ status: 'confirmed' }).select('dateKey aestDateKey time aestTime');
    const scheduleMap = {};
    const aestScheduleMap = {};

    allConfirmed.forEach((m) => {
      const dKey = m.dateKey;
      const aKey = m.aestDateKey || m.dateKey;

      if (!scheduleMap[dKey]) scheduleMap[dKey] = [];
      if (!scheduleMap[dKey].includes(m.time)) scheduleMap[dKey].push(m.time);

      if (!aestScheduleMap[aKey]) aestScheduleMap[aKey] = [];
      const aSlot = m.aestTime || m.time;
      if (!aestScheduleMap[aKey].includes(aSlot)) aestScheduleMap[aKey].push(aSlot);
    });

    return res.status(200).json({
      success: true,
      scheduleMap,
      aestScheduleMap,
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
      const seeded = SEED_MEETINGS.map((m) => ({
        ...m,
        scheduledAt: computeMeetingScheduledAt(m),
      }));
      await Meeting.insertMany(seeded);
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
        'Location / Platform': meet.location || 'Google Meet',
        'Service Requested': meet.service || 'Consultation',
        'Consultation Date': meet.date || meet.dateKey || 'N/A',
        'Date Key (YYYY-MM-DD)': meet.dateKey || 'N/A',
        'Client Time Slot': meet.time || 'N/A',
        'Client Timezone': meet.timezone || 'Australia/Sydney',
        'AEST Time': meet.aestTime || meet.time || 'N/A',
        'Meeting Status': statusLabel,
        'Meeting Link / Details': meet.location === 'Microsoft Teams'
          ? (meet.teamsUrl || GENVAANI_TEAMS_URL)
          : meet.location === 'Phone call'
          ? `Phone Call to ${meet.phone || 'N/A'}`
          : (meet.meetUrl || GENVAANI_MEET_URL),
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

/**
 * @desc    Process all due 30-minute meeting reminders (both Client and Admin)
 * @route   GET/POST /api/meetings/reminders/run
 * @access  Cron / Internal (optional CRON_SECRET)
 */
export const runMeetingReminders = async (req, res) => {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = req.headers.authorization || '';
      const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      const headerSecret = req.headers['x-cron-secret'] || '';
      const querySecret = req.query.secret || '';

      if (
        bearerToken !== cronSecret &&
        headerSecret !== cronSecret &&
        querySecret !== cronSecret
      ) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized reminder runner invocation.',
        });
      }
    }

    const summary = await processDueMeetingReminders();
    return res.status(200).json({
      success: true,
      ...summary,
    });
  } catch (error) {
    console.error('Error processing meeting reminders:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process meeting reminders.',
    });
  }
};

/**
 * @desc    Manually send a 30-minute reminder email for a specific meeting (Client & Admin)
 * @route   POST /api/meetings/:id/send-reminder
 * @access  Admin
 */
export const sendSingleMeetingReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const force = Boolean(req.body?.force);

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found.',
      });
    }

    if (meeting.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: `Cannot send reminder for a meeting with status "${meeting.status}".`,
      });
    }

    const result = await dispatchReminderForMeeting(meeting, { force });
    return res.status(200).json({
      success: result.allSent,
      message: result.allSent
        ? `Reminder emails dispatched to client (${meeting.email}) and admin.`
        : 'Reminder dispatch partially failed. Check emailStatus details.',
      ...result,
    });
  } catch (error) {
    console.error('Error sending single meeting reminder:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send meeting reminder.',
    });
  }
};
