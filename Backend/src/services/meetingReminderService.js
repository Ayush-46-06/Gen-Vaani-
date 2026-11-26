import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Meeting } from '../models/Meeting.js';
import { sendMeetingReminderEmails } from './emailService.js';
import { computeMeetingScheduledAt } from '../utils/meetingTime.js';

export const REMINDER_LEAD_MINUTES = Math.max(
  1,
  Number(process.env.MEETING_REMINDER_MINUTES || 30)
);
const REMINDER_LEAD_MS = REMINDER_LEAD_MINUTES * 60 * 1000;
const REMINDER_EARLY_TOLERANCE_MS = 30 * 1000; // 30s tolerance so :00 meetings fire on the T-30m tick
const REMINDER_CHECK_INTERVAL_MS = Math.max(
  15_000,
  Number(process.env.REMINDER_CHECK_INTERVAL_MS || 60_000)
);
const STALE_PROCESSING_MS = 5 * 60 * 1000;

let schedulerTimer = null;
let isProcessingRun = false;

/**
 * Ensure all confirmed meetings (including older records created before this feature)
 * have a canonical UTC scheduledAt timestamp and reminderStatus initialized.
 */
export async function backfillMissingMeetingScheduleFields() {
  const missingMeetings = await Meeting.find({
    status: 'confirmed',
    $or: [
      { scheduledAt: null },
      { scheduledAt: { $exists: false } },
      { reminderStatus: { $exists: false } },
    ],
  });

  if (missingMeetings.length === 0) return 0;

  const bulkOps = [];
  for (const m of missingMeetings) {
    const computedAt = m.scheduledAt || computeMeetingScheduledAt(m);
    const updateFields = {};

    if (!m.scheduledAt && computedAt) {
      updateFields.scheduledAt = computedAt;
    }
    if (!m.reminderStatus) {
      updateFields.reminderStatus = m.reminderSent ? 'sent' : 'pending';
    }

    if (Object.keys(updateFields).length > 0) {
      bulkOps.push({
        updateOne: {
          filter: { _id: m._id },
          update: { $set: updateFields },
        },
      });
    }
  }

  if (bulkOps.length > 0) {
    await Meeting.bulkWrite(bulkOps);
  }

  return bulkOps.length;
}

/**
 * Dispatch reminder emails for a single meeting (both client and admin)
 * and persist delivery state atomically.
 */
export async function dispatchReminderForMeeting(meeting, { force = false } = {}) {
  const scheduledAt = meeting.scheduledAt || computeMeetingScheduledAt(meeting);
  const nowMs = Date.now();
  const minutesUntilStart = scheduledAt
    ? Math.max(1, Math.round((scheduledAt.getTime() - nowMs) / 60000))
    : REMINDER_LEAD_MINUTES;

  const sendClient = force ? true : !meeting.clientReminderSent;
  const sendAdmin = force ? true : !meeting.adminReminderSent;

  const dispatchResult = await sendMeetingReminderEmails(meeting, minutesUntilStart, {
    sendClient,
    sendAdmin,
  });

  const clientOk = sendClient ? Boolean(dispatchResult.clientEmail?.success) : true;
  const adminOk = sendAdmin ? Boolean(dispatchResult.adminEmail?.success) : true;

  const clientReminderSent = Boolean(meeting.clientReminderSent || (sendClient && clientOk));
  const adminReminderSent = Boolean(meeting.adminReminderSent || (sendAdmin && adminOk));
  const allSent = clientReminderSent && adminReminderSent;

  const errors = [];
  if (sendClient && !clientOk) {
    errors.push(`Client email failed: ${dispatchResult.clientEmail?.error || 'Unknown error'}`);
  }
  if (sendAdmin && !adminOk) {
    errors.push(`Admin email failed: ${dispatchResult.adminEmail?.error || 'Unknown error'}`);
  }

  const updateDoc = {
    clientReminderSent,
    adminReminderSent,
    reminderSent: allSent,
    reminderStatus: allSent ? 'sent' : 'failed',
    reminderError: errors.join(' | '),
  };

  if (allSent) {
    updateDoc.reminderSentAt = new Date();
  }
  if (!meeting.scheduledAt && scheduledAt) {
    updateDoc.scheduledAt = scheduledAt;
  }

  const updatedMeeting = await Meeting.findByIdAndUpdate(
    meeting._id,
    { $set: updateDoc },
    { new: true }
  );

  return {
    meetingId: String(meeting._id),
    clientName: meeting.clientName,
    clientEmail: meeting.email,
    allSent,
    clientOk,
    adminOk,
    dispatchResult,
    meeting: updatedMeeting,
  };
}

/**
 * Scan MongoDB for all confirmed meetings starting within the next 30 minutes
 * that have not yet received reminders, and dispatch both client & admin emails.
 */
export async function processDueMeetingReminders() {
  if (isProcessingRun) {
    return {
      skipped: true,
      reason: 'already_running',
      processed: 0,
      sent: 0,
      failed: 0,
      details: [],
    };
  }

  isProcessingRun = true;
  try {
    const conn = await connectDB();
    if (!conn || mongoose.connection.readyState !== 1) {
      return {
        skipped: true,
        reason: 'db_not_connected',
        processed: 0,
        sent: 0,
        failed: 0,
        details: [],
      };
    }

    await backfillMissingMeetingScheduleFields();

    const now = new Date();
    const windowEnd = new Date(now.getTime() + REMINDER_LEAD_MS + REMINDER_EARLY_TOLERANCE_MS);
    const staleCutoff = new Date(now.getTime() - STALE_PROCESSING_MS);

    const dueMeetings = await Meeting.find({
      status: 'confirmed',
      scheduledAt: { $gt: now, $lte: windowEnd },
      $or: [
        { reminderStatus: { $in: ['pending', 'failed'] } },
        { reminderStatus: 'processing', updatedAt: { $lte: staleCutoff } },
      ],
    }).sort({ scheduledAt: 1 });

    if (dueMeetings.length === 0) {
      return {
        skipped: false,
        processed: 0,
        sent: 0,
        failed: 0,
        checkedAt: now.toISOString(),
        windowEnd: windowEnd.toISOString(),
        details: [],
      };
    }

    const details = [];
    let sentCount = 0;
    let failedCount = 0;

    for (const candidate of dueMeetings) {
      // Atomic claim prevents duplicate emails across overlapping ticks or workers
      const claimed = await Meeting.findOneAndUpdate(
        {
          _id: candidate._id,
          status: 'confirmed',
          $or: [
            { reminderStatus: { $in: ['pending', 'failed'] } },
            { reminderStatus: 'processing', updatedAt: { $lte: staleCutoff } },
          ],
        },
        { $set: { reminderStatus: 'processing' } },
        { new: true }
      );

      if (!claimed) continue;

      try {
        const result = await dispatchReminderForMeeting(claimed);
        details.push({
          meetingId: result.meetingId,
          clientName: result.clientName,
          clientEmail: result.clientEmail,
          allSent: result.allSent,
          clientOk: result.clientOk,
          adminOk: result.adminOk,
        });

        if (result.allSent) {
          sentCount += 1;
          console.log(
            `⏰ [30m Reminder Sent] -> Client (${claimed.email}) & Admin notified for ${claimed.clientName} at ${claimed.aestTime || claimed.time}`
          );
        } else {
          failedCount += 1;
          console.warn(
            `⚠️ [30m Reminder Partial/Failed] -> Meeting ${claimed._id}: clientOk=${result.clientOk}, adminOk=${result.adminOk}`
          );
        }
      } catch (err) {
        failedCount += 1;
        await Meeting.findByIdAndUpdate(claimed._id, {
          $set: {
            reminderStatus: 'failed',
            reminderError: err.message || 'Reminder dispatch error',
          },
        });
        console.error(`❌ [30m Reminder Error] -> Meeting ${claimed._id}:`, err);
      }
    }

    return {
      skipped: false,
      processed: details.length,
      sent: sentCount,
      failed: failedCount,
      checkedAt: now.toISOString(),
      windowEnd: windowEnd.toISOString(),
      details,
    };
  } finally {
    isProcessingRun = false;
  }
}

/**
 * Start the background interval scheduler (for standalone Node server execution).
 */
export function startMeetingReminderScheduler() {
  if (schedulerTimer) return schedulerTimer;

  console.log(
    `⏰ Meeting 30-min reminder scheduler active (checking every ${Math.round(
      REMINDER_CHECK_INTERVAL_MS / 1000
    )}s, lead=${REMINDER_LEAD_MINUTES}m)`
  );

  // Run an initial check shortly after startup to catch any imminent meetings
  const initialTimeout = setTimeout(() => {
    processDueMeetingReminders().catch((err) => {
      console.error('⚠️ [Reminder Scheduler Initial Run Error]:', err.message);
    });
  }, 5000);
  if (typeof initialTimeout.unref === 'function') {
    initialTimeout.unref();
  }

  schedulerTimer = setInterval(() => {
    processDueMeetingReminders().catch((err) => {
      console.error('⚠️ [Reminder Scheduler Tick Error]:', err.message);
    });
  }, REMINDER_CHECK_INTERVAL_MS);

  if (typeof schedulerTimer.unref === 'function') {
    schedulerTimer.unref();
  }

  return schedulerTimer;
}

export function stopMeetingReminderScheduler() {
  if (schedulerTimer) {
    clearInterval(schedulerTimer);
    schedulerTimer = null;
  }
}
