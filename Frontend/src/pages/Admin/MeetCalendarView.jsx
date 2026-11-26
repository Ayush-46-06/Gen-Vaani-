import React, { useState, useMemo } from 'react';
import { 
  FiCalendar, 
  FiClock, 
  FiVideo, 
  FiPhone, 
  FiChevronLeft, 
  FiChevronRight, 
  FiCopy, 
  FiCheck, 
  FiFilter, 
  FiExternalLink,
  FiUser,
  FiMail,
  FiMapPin
} from 'react-icons/fi';
import { GENVAANI_MEET_URL, GENVAANI_TEAMS_URL } from '../../services/meetingApi';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Extract standardized 'YYYY-MM-DD' from meeting object
export const getMeetingDateKey = (meet) => {
  if (meet.dateKey && /^\d{4}-\d{2}-\d{2}$/.test(meet.dateKey)) {
    return meet.dateKey;
  }
  if (meet.aestDateKey && /^\d{4}-\d{2}-\d{2}$/.test(meet.aestDateKey)) {
    return meet.aestDateKey;
  }
  if (meet.date) {
    const cleaned = meet.date.replace(/^Today\s*·\s*/i, '').trim();
    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
  }
  if (meet.createdAt) {
    const d = new Date(meet.createdAt);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  }
  return null;
};

// Format 'YYYY-MM-DD' to 'Saturday, November 14, 2026'
export const formatDateKeyToLong = (dateKey) => {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const MeetCalendarView = ({ 
  meetings = [], 
  toggleMeetingStatus, 
  showToast = () => {} 
}) => {
  // Always default calendar view to the current month
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Always default selected day to today's date (YYYY-MM-DD)
  const [selectedDateKey, setSelectedDateKey] = useState(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  const [platformFilter, setPlatformFilter] = useState('all'); // 'all' | 'Google Meet' | 'Microsoft Teams' | 'Phone call'
  const [copiedId, setCopiedId] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    setSelectedDateKey(`${y}-${m}-${d}`);
  };

  // Filter meetings by platform if set
  const filteredMeetings = useMemo(() => {
    if (platformFilter === 'all') return meetings;
    return meetings.filter(m => (m.location || 'Google Meet') === platformFilter);
  }, [meetings, platformFilter]);

  // Group meetings by dateKey
  const meetingsByDate = useMemo(() => {
    const map = {};
    filteredMeetings.forEach((meet) => {
      const key = getMeetingDateKey(meet);
      if (!key) return;
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(meet);
    });
    return map;
  }, [filteredMeetings]);

  // Generate calendar grid days (including prev/next month overflow)
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDay.getDay(); // 0 is Sunday
    const daysInMonth = lastDay.getDate();

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const days = [];

    // Previous month overflow days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const d = new Date(year, month - 1, dayNum);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dStr = String(dayNum).padStart(2, '0');
      days.push({
        date: d,
        dayNumber: dayNum,
        dateKey: `${y}-${m}-${dStr}`,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const d = new Date(year, month, dayNum);
      const m = String(month + 1).padStart(2, '0');
      const dStr = String(dayNum).padStart(2, '0');
      days.push({
        date: d,
        dayNumber: dayNum,
        dateKey: `${year}-${m}-${dStr}`,
        isCurrentMonth: true,
      });
    }

    // Next month overflow days (fill grid to 35 or 42 cells)
    const totalSoFar = days.length;
    const totalTarget = totalSoFar <= 35 ? 35 : 42;
    const remaining = totalTarget - totalSoFar;

    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const d = new Date(year, month + 1, dayNum);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dStr = String(dayNum).padStart(2, '0');
      days.push({
        date: d,
        dayNumber: dayNum,
        dateKey: `${y}-${m}-${dStr}`,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  // Today key
  const todayKey = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  // Meetings for currently selected day (or all upcoming if selectedDateKey is null)
  const selectedDayMeetings = useMemo(() => {
    if (!selectedDateKey) return filteredMeetings;
    return meetingsByDate[selectedDateKey] || [];
  }, [selectedDateKey, meetingsByDate, filteredMeetings]);

  const handleCopyLink = (meetId, url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(meetId);
    showToast('✓ Meeting link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Platform count stats
  const meetCount = meetings.filter(m => (m.location || 'Google Meet') === 'Google Meet').length;
  const teamsCount = meetings.filter(m => m.location === 'Microsoft Teams').length;
  const phoneCount = meetings.filter(m => m.location === 'Phone call').length;

  return (
    <div className="cal-view-wrapper">
      {/* Calendar View Control Bar */}
      <div className="cal-control-bar">
        {/* Month Navigation */}
        <div className="cal-month-nav">
          <div className="cal-month-title-wrap">
            <h3 className="cal-month-title">
              {MONTH_NAMES[month]} <span>{year}</span>
            </h3>
            <span className="cal-total-badge">
              {filteredMeetings.length} {filteredMeetings.length === 1 ? 'Meet' : 'Meets'} Scheduled
            </span>
          </div>

          <div className="cal-nav-buttons">
            <button
              type="button"
              className="cal-nav-btn"
              onClick={goToPrevMonth}
              title="Previous Month"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              className="cal-today-btn"
              onClick={goToToday}
            >
              Today
            </button>
            <button
              type="button"
              className="cal-nav-btn"
              onClick={goToNextMonth}
              title="Next Month"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* Platform Filter Buttons */}
        <div className="cal-filter-group">
          <button
            type="button"
            className={`cal-filter-pill ${platformFilter === 'all' ? 'active' : ''}`}
            onClick={() => setPlatformFilter('all')}
          >
            All ({meetings.length})
          </button>
          <button
            type="button"
            className={`cal-filter-pill filter-meet ${platformFilter === 'Google Meet' ? 'active' : ''}`}
            onClick={() => setPlatformFilter('Google Meet')}
          >
            🎥 Google Meet ({meetCount})
          </button>
          <button
            type="button"
            className={`cal-filter-pill filter-teams ${platformFilter === 'Microsoft Teams' ? 'active' : ''}`}
            onClick={() => setPlatformFilter('Microsoft Teams')}
          >
            💼 Teams ({teamsCount})
          </button>
          <button
            type="button"
            className={`cal-filter-pill filter-phone ${platformFilter === 'Phone call' ? 'active' : ''}`}
            onClick={() => setPlatformFilter('Phone call')}
          >
            📞 Phone ({phoneCount})
          </button>
        </div>
      </div>

      {/* Main Interactive Calendar Grid */}
      <div className="cal-grid-container">
        {/* Weekday Header */}
        <div className="cal-weekday-row">
          {WEEKDAY_NAMES.map((name) => (
            <div key={name} className="cal-weekday-cell">
              {name}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="cal-days-grid">
          {calendarDays.map((cell) => {
            const isToday = cell.dateKey === todayKey;
            const isSelected = cell.dateKey === selectedDateKey;
            const dayMeets = meetingsByDate[cell.dateKey] || [];
            const hasMeets = dayMeets.length > 0;

            return (
              <div
                key={cell.dateKey}
                className={`cal-day-cell ${
                  !cell.isCurrentMonth ? 'cal-day-overflow' : ''
                } ${isToday ? 'cal-day-today' : ''} ${
                  isSelected ? 'cal-day-selected' : ''
                } ${hasMeets ? 'cal-day-has-meets' : ''}`}
                onClick={() => setSelectedDateKey(cell.dateKey)}
              >
                {/* Cell Header: Day number + count badge */}
                <div className="cal-cell-header">
                  <span className={`cal-day-num ${isToday ? 'num-today' : ''}`}>
                    {cell.dayNumber}
                  </span>
                  {hasMeets && (
                    <span className="cal-cell-badge">
                      {dayMeets.length} {dayMeets.length === 1 ? 'Meet' : 'Meets'}
                    </span>
                  )}
                </div>

                {/* Event Chips */}
                <div className="cal-cell-events">
                  {dayMeets.slice(0, 2).map((m, idx) => {
                    const loc = m.location || 'Google Meet';
                    const isTeams = loc === 'Microsoft Teams';
                    const isPhone = loc === 'Phone call';
                    const chipClass = isPhone ? 'chip-phone' : isTeams ? 'chip-teams' : 'chip-meet';
                    const icon = isPhone ? '📞' : isTeams ? '💼' : '🎥';

                    return (
                      <div
                        key={m._id || m.id || idx}
                        className={`cal-event-chip ${chipClass}`}
                        title={`${m.clientName} - ${m.time} (${loc})`}
                      >
                        <span className="cal-chip-icon">{icon}</span>
                        <span className="cal-chip-time">{m.time}</span>
                        <span className="cal-chip-name">{m.clientName}</span>
                      </div>
                    );
                  })}

                  {dayMeets.length > 2 && (
                    <span className="cal-cell-more">
                      +{dayMeets.length - 2}<span className="cal-more-word"> more</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector / Appointments List */}
      <div className="cal-inspector-panel">
        <div className="cal-inspector-header">
          <div>
            <h4 className="cal-inspector-title">
              <FiCalendar />{' '}
              {selectedDateKey
                ? formatDateKeyToLong(selectedDateKey)
                : 'All Scheduled Appointments'}
            </h4>
            <p className="cal-inspector-subtitle">
              {selectedDayMeetings.length === 0
                ? 'No consultations booked for this date.'
                : `${selectedDayMeetings.length} client consultation${
                    selectedDayMeetings.length > 1 ? 's' : ''
                  } scheduled.`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {selectedDateKey && (
              <button
                type="button"
                className="cal-clear-selection-btn"
                onClick={() => setSelectedDateKey(null)}
              >
                View All Scheduled ({filteredMeetings.length})
              </button>
            )}
          </div>
        </div>

        {selectedDayMeetings.length === 0 ? (
          <div className="cal-empty-day-box">
            <div className="cal-empty-icon">📅</div>
            <h5>No Consultations on This Date</h5>
            <p>
              There are no meetings booked on{' '}
              <b>{selectedDateKey ? formatDateKeyToLong(selectedDateKey) : 'this day'}</b>.
              Click any highlighted date above with a badge to view client bookings.
            </p>
          </div>
        ) : (
          <div className="meeting-cards-grid">
            {selectedDayMeetings.map((meet) => {
              const meetKey = meet._id || meet.id;
              const meetLocation = meet.location || 'Google Meet';
              const meetLink =
                meetLocation === 'Microsoft Teams'
                  ? meet.teamsUrl || GENVAANI_TEAMS_URL
                  : meet.meetUrl || GENVAANI_MEET_URL;

              return (
                <div key={meetKey} className="meeting-card">
                  <div className="meeting-card-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="meeting-time-badge">
                        <FiClock /> {meet.date}
                      </span>
                      {meetLocation === 'Google Meet' && (
                        <span style={{ padding: '3px 10px', borderRadius: '50px', background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 700 }}>
                          🎥 Google Meet
                        </span>
                      )}
                      {meetLocation === 'Microsoft Teams' && (
                        <span style={{ padding: '3px 10px', borderRadius: '50px', background: '#ede9fe', color: '#6d28d9', fontSize: '0.72rem', fontWeight: 700 }}>
                          💼 Teams
                        </span>
                      )}
                      {meetLocation === 'Phone call' && (
                        <span style={{ padding: '3px 10px', borderRadius: '50px', background: '#fef3c7', color: '#b45309', fontSize: '0.72rem', fontWeight: 700 }}>
                          📞 Phone Call
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleMeetingStatus && toggleMeetingStatus(meet)}
                      className={`status-pill ${meet.status}`}
                      style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                      title="Click to toggle status (Confirmed → Completed → Cancelled)"
                    >
                      ✓ {meet.status}
                    </button>
                  </div>

                  <div>
                    <h4 className="meeting-client-name">{meet.clientName}</h4>
                    <p className="meeting-client-service">
                      <b>{meet.company || 'Direct Client'}</b> · {meet.service}
                    </p>
                  </div>

                  {/* Contact detail row */}
                  {(meet.email || meet.phone) && (
                    <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: '#64748b', flexWrap: 'wrap' }}>
                      {meet.email && (
                        <a href={`mailto:${meet.email}`} style={{ color: '#0084c7', textDecoration: 'none', fontWeight: 600 }}>
                          <FiMail style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                          {meet.email}
                        </a>
                      )}
                      {meet.phone && (
                        <a 
                          href={`tel:${meet.phone}`} 
                          style={{ 
                            color: meetLocation === 'Phone call' ? '#b45309' : '#64748b', 
                            fontWeight: meetLocation === 'Phone call' ? 700 : 500, 
                            textDecoration: 'none' 
                          }}
                        >
                          <FiPhone style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                          {meet.phone}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Session Window & Join Action */}
                  <div className="meeting-room-box">
                    <div>
                      <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Session Window</span>
                      <strong style={{ fontSize: '0.88rem', color: '#00278a' }}>
                        {meet.time} ({meet.timezone === 'Australia/Sydney' ? 'AEST' : (meet.timezone || 'Local')})
                      </strong>
                      {meet.aestTime && meet.timezone !== 'Australia/Sydney' && (
                        <span style={{ display: 'block', fontSize: '0.74rem', color: '#0284c7', fontWeight: 600, marginTop: '2px' }}>
                          Sydney Time: {meet.aestTime} AEST
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {meetLocation === 'Phone call' ? (
                        <a 
                          href={`tel:${meet.phone}`}
                          className="table-btn"
                          style={{
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#f59e0b',
                            color: '#ffffff',
                            borderColor: '#f59e0b',
                            fontWeight: 750,
                          }}
                          title={`Call phone: ${meet.phone}`}
                        >
                          <FiPhone /> Call Client
                        </a>
                      ) : (
                        <a 
                          href={meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="table-btn table-btn-primary"
                          style={{
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: meetLocation === 'Microsoft Teams' ? '#464EB8' : undefined,
                            borderColor: meetLocation === 'Microsoft Teams' ? '#464EB8' : undefined,
                          }}
                          title={`Join room: ${meetLink}`}
                        >
                          <FiVideo /> {meetLocation === 'Microsoft Teams' ? 'Join Teams' : 'Join Meet'}
                        </a>
                      )}

                      {meetLocation !== 'Phone call' && (
                        <button
                          type="button"
                          className="table-btn"
                          onClick={() => handleCopyLink(meetKey, meetLink)}
                          title="Copy meeting link to clipboard"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          {copiedId === meetKey ? <FiCheck color="#16a34a" /> : <FiCopy />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Meeting link bar */}
                  {meetLocation !== 'Phone call' && (
                    <div style={{ 
                      padding: '8px 12px', 
                      background: meetLocation === 'Microsoft Teams' ? '#f5f3ff' : '#f0fdf4', 
                      borderRadius: '10px', 
                      border: meetLocation === 'Microsoft Teams' ? '1px solid #ddd6fe' : '1px solid #dcfce7',
                      fontSize: '0.74rem', 
                      color: meetLocation === 'Microsoft Teams' ? '#6d28d9' : '#15803d',
                      wordBreak: 'break-all'
                    }}>
                      <b>{meetLocation === 'Microsoft Teams' ? 'Teams Link: ' : 'Google Meet Link: '}</b>
                      <a href={meetLink} target="_blank" rel="noreferrer" style={{ color: meetLocation === 'Microsoft Teams' ? '#464EB8' : '#0084c7', fontWeight: 700 }}>
                        {meetLink}
                      </a>
                    </div>
                  )}

                  {meetLocation === 'Phone call' && (
                    <div style={{ 
                      padding: '8px 12px', 
                      background: '#fffbeb', 
                      borderRadius: '10px', 
                      border: '1px solid #fde68a',
                      fontSize: '0.74rem', 
                      color: '#92400e',
                    }}>
                      <b>Phone Consultation: </b>
                      <span>Call client directly at <strong>{meet.phone || 'Number not provided'}</strong> at scheduled time.</span>
                    </div>
                  )}

                  {/* Notes / Agenda */}
                  <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', color: '#475569' }}>
                    <span style={{ fontWeight: 700, color: '#00278a' }}>Agenda / Notes: </span>
                    {meet.notes || 'No agenda notes provided.'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetCalendarView;

