import React, { useState, useEffect } from 'react';
import {
  FiX,
  FiClock,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiGlobe,
  FiVideo,
  FiAlertCircle,
  FiSave,
} from 'react-icons/fi';
import {
  getAvailabilityApi,
  updateAvailabilityApi,
  GENVAANI_MEET_URL,
  GENVAANI_TEAMS_URL,
  GOOGLE_MEET_URLS,
  TEAMS_URLS,
} from '../../services/meetingApi';

const ALL_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const STANDARD_PRESET = [
  '09:30 AM',
  '11:00 AM',
  '12:30 PM',
  '02:00 PM',
  '03:30 PM',
  '04:15 PM',
];

const EXTENDED_PRESET = [
  '09:00 AM',
  '10:30 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:15 PM',
];

export default function AvailabilityModal({ isOpen, onClose, onSaved, showToast }) {
  const [timeSlots, setTimeSlots] = useState(STANDARD_PRESET);
  const [workingDays, setWorkingDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [googleMeetUrl1, setGoogleMeetUrl1] = useState(GOOGLE_MEET_URLS[0]);
  const [googleMeetUrl2, setGoogleMeetUrl2] = useState(GOOGLE_MEET_URLS[1]);
  const [teamsUrl1, setTeamsUrl1] = useState(TEAMS_URLS[0]);
  const [teamsUrl2, setTeamsUrl2] = useState(TEAMS_URLS[1]);
  const [newSlotInput, setNewSlotInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load existing availability settings whenever modal opens
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setErrorMsg('');

    getAvailabilityApi()
      .then((res) => {
        if (res && res.success && res.availability) {
          const avail = res.availability;
          if (Array.isArray(avail.timeSlots) && avail.timeSlots.length > 0) {
            setTimeSlots(avail.timeSlots);
          }
          if (Array.isArray(avail.workingDays) && avail.workingDays.length > 0) {
            setWorkingDays(avail.workingDays);
          }
          if (Array.isArray(avail.googleMeetUrls) && avail.googleMeetUrls.length >= 2) {
            setGoogleMeetUrl1(avail.googleMeetUrls[0]);
            setGoogleMeetUrl2(avail.googleMeetUrls[1]);
          } else if (avail.googleMeetUrl) {
            setGoogleMeetUrl1(avail.googleMeetUrl);
          }
          if (Array.isArray(avail.teamsUrls) && avail.teamsUrls.length >= 2) {
            setTeamsUrl1(avail.teamsUrls[0]);
            setTeamsUrl2(avail.teamsUrls[1]);
          } else if (avail.teamsUrl) {
            setTeamsUrl1(avail.teamsUrl);
          }
        }
      })
      .catch((err) => {
        console.warn('Error fetching availability:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleDay = (day) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddSlot = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    const trimmed = newSlotInput.trim().toUpperCase();
    if (!trimmed) return;

    // Validate time format (e.g., 09:30 AM or 9:30 AM or 2:00 PM)
    const match = trimmed.match(/^(0?[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM)$/i);
    if (!match) {
      setErrorMsg('Please enter a valid 12-hour time format, e.g. "09:30 AM" or "02:00 PM".');
      return;
    }

    const formatted = `${match[1].padStart(2, '0')}:${match[2]} ${match[3].toUpperCase()}`;

    if (timeSlots.includes(formatted)) {
      setErrorMsg(`Slot ${formatted} is already in the list.`);
      return;
    }

    // Add and sort timeslots chronologically
    const updated = [...timeSlots, formatted].sort((a, b) => {
      const toMinutes = (timeStr) => {
        const m = timeStr.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/);
        if (!m) return 0;
        let h = parseInt(m[1], 10);
        const min = parseInt(m[2], 10);
        if (m[3] === 'PM' && h < 12) h += 12;
        if (m[3] === 'AM' && h === 12) h = 0;
        return h * 60 + min;
      };
      return toMinutes(a) - toMinutes(b);
    });

    setTimeSlots(updated);
    setNewSlotInput('');
  };

  const handleRemoveSlot = (slotToRemove) => {
    setTimeSlots((prev) => prev.filter((s) => s !== slotToRemove));
  };

  const handleSave = async () => {
    if (timeSlots.length === 0) {
      setErrorMsg('Please specify at least one available timeslot.');
      return;
    }

    if (workingDays.length === 0) {
      setErrorMsg('Please select at least one working day.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const res = await updateAvailabilityApi({
        timeSlots,
        workingDays,
        googleMeetUrl: googleMeetUrl1.trim() || GOOGLE_MEET_URLS[0],
        googleMeetUrls: [
          googleMeetUrl1.trim() || GOOGLE_MEET_URLS[0],
          googleMeetUrl2.trim() || GOOGLE_MEET_URLS[1],
        ],
        teamsUrl: teamsUrl1.trim() || TEAMS_URLS[0],
        teamsUrls: [
          teamsUrl1.trim() || TEAMS_URLS[0],
          teamsUrl2.trim() || TEAMS_URLS[1],
        ],
      });

      if (res && res.success) {
        if (showToast) {
          showToast(`✓ Availability updated! Alternating links & ${timeSlots.length} AEST slots synced.`);
        }
        if (onSaved) onSaved(res.availability);
        onClose();
      } else {
        setErrorMsg(res?.message || 'Failed to update availability settings.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error saving availability to server.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop-custom animate-fade-in" style={{ zIndex: 1200 }}>
      <div
        className="modal-container-custom"
        style={{ maxWidth: '780px', width: '92%', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="modal-header-custom" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0, 39, 138, 0.12), rgba(0, 203, 240, 0.22))',
                color: '#00278a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
              }}
            >
              <FiClock />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.22rem', color: '#00278a', fontWeight: 800 }}>
                  AEST Availability & Consultation Timeslots
                </h3>
                <span
                  style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '50px',
                  }}
                >
                  Australia/Sydney (AEST)
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Set canonical timeslots in AEST. Prospective clients booking from India, the US, or Europe will see these slots automatically converted to their local time.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px' }}
          >
            <FiX style={{ fontSize: '1.4rem', color: '#64748b' }} />
          </button>
        </div>

        {/* Informative Banner */}
        <div
          style={{
            margin: '0 24px 14px',
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1px solid #bae6fd',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.78rem',
            color: '#0369a1',
          }}
        >
          <FiGlobe style={{ fontSize: '1.2rem', flexShrink: 0 }} />
          <span>
            <strong>Global Timezone Conversion:</strong> All slots here are stored in <strong>Sydney (AEST)</strong>.
            When a client views the calendar, an AEST slot of <code>09:30 AM</code> automatically renders as <code>04:00 AM IST</code> in India, <code>05:30 PM EST</code> in New York, and <code>10:30 PM GMT</code> in London.
          </span>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div
            style={{
              margin: '0 24px 14px',
              padding: '10px 16px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#b91c1c',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FiAlertCircle />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Section 1: Working Days */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
              Working Days for Consultations
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ALL_WEEKDAYS.map((day) => {
                const isActive = workingDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '50px',
                      border: isActive ? '1.5px solid #00278a' : '1px solid #cbd5e1',
                      background: isActive ? '#00278a' : '#f8fafc',
                      color: isActive ? '#ffffff' : '#475569',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isActive && <FiCheck style={{ fontSize: '0.9rem' }} />}
                    <span>{day}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Configured AEST Time Slots */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                Available Timeslots in Sydney AEST ({timeSlots.length} slots)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setTimeSlots(STANDARD_PRESET)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0284c7',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Standard Preset
                </button>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <button
                  type="button"
                  onClick={() => setTimeSlots(EXTENDED_PRESET)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0284c7',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Extended Preset
                </button>
              </div>
            </div>

            {/* Slots display */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '14px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                minHeight: '60px',
                alignItems: 'center',
              }}
            >
              {timeSlots.length === 0 ? (
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  No slots currently set. Add a time slot below.
                </span>
              ) : (
                timeSlots.map((slot) => (
                  <span
                    key={slot}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '50px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#00278a',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <span>{slot}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(slot)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.9rem',
                      }}
                      title={`Remove slot ${slot}`}
                    >
                      <FiX />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Add new slot form */}
            <form onSubmit={handleAddSlot} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Add AEST slot, e.g. 10:00 AM or 05:00 PM"
                value={newSlotInput}
                onChange={(e) => setNewSlotInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="admin-submit-button"
                style={{
                  width: 'auto',
                  padding: '0 18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#0284c7',
                  fontSize: '0.84rem',
                }}
              >
                <FiPlus /> Add Slot
              </button>
            </form>
          </div>

          {/* Section 3: Alternating Meeting Links (Odd & Even Users) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                Alternating Meeting Links (Odd & Even Users)
              </label>
              <span style={{ fontSize: '0.72rem', color: '#0369a1', background: '#e0f2fe', padding: '2px 8px', borderRadius: '50px', fontWeight: 600 }}>
                Automatic Alternation
              </span>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '0.76rem', color: '#64748b', lineHeight: 1.5 }}>
              Consecutive clients automatically alternate between Link 1 (odd users) and Link 2 (even users) so back-to-back meetings never overlap in the same room.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Google Meet Alternating URLs */}
              <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  🎥 Google Meet Alternating Rooms
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Meet Link #1 (Odd Users: 1st, 3rd, 5th...)
                    </span>
                    <input
                      type="url"
                      value={googleMeetUrl1}
                      onChange={(e) => setGoogleMeetUrl1(e.target.value)}
                      placeholder="https://meet.google.com/..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0',
                        fontSize: '0.78rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        background: '#ffffff',
                      }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Meet Link #2 (Even Users: 2nd, 4th, 6th...)
                    </span>
                    <input
                      type="url"
                      value={googleMeetUrl2}
                      onChange={(e) => setGoogleMeetUrl2(e.target.value)}
                      placeholder="https://meet.google.com/..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0',
                        fontSize: '0.78rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        background: '#ffffff',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Microsoft Teams Alternating URLs */}
              <div style={{ background: '#f5f3ff', padding: '14px', borderRadius: '12px', border: '1px solid #ddd6fe' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#5b21b6', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  💼 Microsoft Teams Alternating Rooms
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#5b21b6', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Teams Link #1 (Odd Users: 1st, 3rd, 5th...)
                    </span>
                    <input
                      type="url"
                      value={teamsUrl1}
                      onChange={(e) => setTeamsUrl1(e.target.value)}
                      placeholder="https://teams.live.com/meet/..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #c4b5fd',
                        fontSize: '0.78rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        background: '#ffffff',
                      }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#5b21b6', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Teams Link #2 (Even Users: 2nd, 4th, 6th...)
                    </span>
                    <input
                      type="url"
                      value={teamsUrl2}
                      onChange={(e) => setTeamsUrl2(e.target.value)}
                      placeholder="https://teams.live.com/meet/..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #c4b5fd',
                        fontSize: '0.78rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        background: '#ffffff',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            background: '#f8fafc',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="table-btn"
            style={{ padding: '8px 18px', cursor: 'pointer' }}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="admin-submit-button"
            style={{
              width: 'auto',
              padding: '0 24px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #00278a 0%, #0084c7 100%)',
              cursor: saving ? 'wait' : 'pointer',
              fontSize: '0.86rem',
            }}
            disabled={saving}
          >
            <FiSave /> {saving ? 'Saving...' : 'Save Availability (AEST)'}
          </button>
        </div>
      </div>
    </div>
  );
}

