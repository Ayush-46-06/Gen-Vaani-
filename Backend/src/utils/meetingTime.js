/**
 * Utilities for converting meeting date/time strings and IANA timezones
 * into canonical UTC Date instants for accurate 30-minute reminder scheduling.
 */

const DEFAULT_TIMEZONE = 'Australia/Sydney';

/**
 * Parse a 12-hour ("09:30 AM") or 24-hour ("14:30") time string into { hours, minutes }.
 * Returns null if the format is unrecognized.
 */
export function parseTimeString(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const trimmed = timeStr.trim();

  // 12-hour format: e.g. "09:30 AM", "2:05 pm"
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const period = match12[3].toUpperCase();

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  }

  // 24-hour format: e.g. "09:30", "14:15"
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return { hours, minutes };
  }

  return null;
}

/**
 * Compute timezone offset in milliseconds (localWallClockAsUtc - actualUtc) for an instant.
 */
function getTimeZoneOffsetMs(utcDate, timeZone) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const parts = fmt.formatToParts(utcDate);
  const map = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      map[part.type] = part.value;
    }
  }

  const localAsUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour) % 24,
    Number(map.minute),
    Number(map.second)
  );

  return localAsUtc - utcDate.getTime();
}

/**
 * Convert a wall-clock dateKey ("YYYY-MM-DD") and timeStr ("09:30 AM")
 * in a given IANA timeZone into an exact UTC Date.
 */
export function zonedWallClockToUtcDate(dateKey, timeStr, timeZone = DEFAULT_TIMEZONE) {
  if (!dateKey || typeof dateKey !== 'string') return null;
  const dateMatch = dateKey.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateMatch) return null;

  const parsedTime = parseTimeString(timeStr);
  if (!parsedTime) return null;

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);

  const utcGuessMs = Date.UTC(year, month - 1, day, parsedTime.hours, parsedTime.minutes, 0, 0);

  let targetTz = (timeZone && String(timeZone).trim()) || DEFAULT_TIMEZONE;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: targetTz });
  } catch {
    targetTz = DEFAULT_TIMEZONE;
  }

  // Two-pass offset resolution ensures exactness around DST transitions
  const offset1 = getTimeZoneOffsetMs(new Date(utcGuessMs), targetTz);
  const firstCandidateMs = utcGuessMs - offset1;
  const offset2 = getTimeZoneOffsetMs(new Date(firstCandidateMs), targetTz);

  return new Date(utcGuessMs - offset2);
}

/**
 * Determine the canonical UTC start Date of a meeting document.
 * Prefers canonical Sydney/AEST fields (aestDateKey + aestTime in Australia/Sydney)
 * when present, falling back to dateKey + time in the meeting's timezone.
 */
export function computeMeetingScheduledAt(meeting) {
  if (!meeting) return null;

  const aestDate = meeting.aestDateKey ? String(meeting.aestDateKey).trim() : '';
  const aestTime = meeting.aestTime ? String(meeting.aestTime).trim() : '';

  if (aestDate && aestTime) {
    const dt = zonedWallClockToUtcDate(aestDate, aestTime, DEFAULT_TIMEZONE);
    if (dt && !Number.isNaN(dt.getTime())) return dt;
  }

  const dateKey = meeting.dateKey ? String(meeting.dateKey).trim() : '';
  const time = meeting.time ? String(meeting.time).trim() : '';
  const timezone = meeting.timezone ? String(meeting.timezone).trim() : DEFAULT_TIMEZONE;

  if (dateKey && time) {
    const dt = zonedWallClockToUtcDate(dateKey, time, timezone);
    if (dt && !Number.isNaN(dt.getTime())) return dt;
  }

  return null;
}
