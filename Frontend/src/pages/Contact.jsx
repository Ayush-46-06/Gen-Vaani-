import React, { useMemo, useState, useEffect } from 'react';
import brandIcon from '../assets/PNG/8.icon Transparent.png';
import { submitLeadApi } from '../services/leadApi';
import { bookMeetingApi, getBookedSlotsApi, GENVAANI_MEET_URL } from '../services/meetingApi';
import './Contact.css';

const SERVICES = [
  'Website Development',
  'Application Development',
  'Google Ads & Meta Ads',
  'UI & UX Design',
  'Local SEO',
  'Digital Marketing',
  'Custom Enterprise Architecture',
];

const TIMEZONES = [
  { label: 'India Standard Time (IST)', value: 'Asia/Kolkata' },
  { label: 'Australian Eastern Time', value: 'Australia/Sydney' },
  { label: 'Eastern Time (US)', value: 'America/New_York' },
  { label: 'Pacific Time (US)', value: 'America/Los_Angeles' },
  { label: 'United Kingdom', value: 'Europe/London' },
];

const TIME_SLOTS = ['09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '04:15 PM'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const pad = (value) => String(value).padStart(2, '0');

function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDate(date, options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) {
  return new Intl.DateTimeFormat('en', options).format(date);
}

export default function Contact() {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to today
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedTime, setSelectedTime] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('idle'); // idle | loading | confirmed
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: SERVICES[0], notes: '' });
  
  // Real-time booked slots tracking
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [confirmedMeeting, setConfirmedMeeting] = useState(null);
  const [copiedMeet, setCopiedMeet] = useState(false);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const calendarCells = [...Array(firstDayOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  // Fetch booked slots whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate) {
      setBookedSlots([]);
      return;
    }

    const dateKey = toDateKey(selectedDate);
    setLoadingSlots(true);

    getBookedSlotsApi(dateKey)
      .then((res) => {
        if (res && res.success && Array.isArray(res.bookedSlots)) {
          setBookedSlots(res.bookedSlots);
        } else {
          setBookedSlots([]);
        }
      })
      .catch((err) => {
        console.warn('Failed to load booked slots', err);
        setBookedSlots([]);
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }, [selectedDate]);

  // Dynamic Available Slots: Remove any slot that someone has already booked for this particular date
  const availableTimeSlots = useMemo(() => {
    return TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));
  }, [bookedSlots]);

  // Clear selectedTime if it becomes unavailable
  useEffect(() => {
    if (selectedTime && bookedSlots.includes(selectedTime)) {
      setSelectedTime('');
    }
  }, [bookedSlots, selectedTime]);

  const isPast = (day) => {
    if (!day) return false;
    const date = new Date(year, month, day);
    return date < today;
  };

  const changeMonth = (amount) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const selectDate = (day) => {
    if (!day || isPast(day)) return;
    const next = new Date(year, month, day);
    setSelectedDate(next);
    setSelectedTime('');
    setError('');
    setStatus('idle');
    setStep(1);
  };

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const continueToDetails = () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select an available date and time slot to continue.');
      return;
    }
    setError('');
    setStep(2);
    document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submitBookingRequest = async (event) => {
    event.preventDefault();
    setError('');

    if (!selectedDate || !selectedTime) {
      setError('Please select an appointment date and time.');
      return;
    }

    if (!form.name.trim() || !form.email.trim()) {
      setError('Please fill in your name and email address.');
      return;
    }

    setStatus('loading');

    try {
      const dateKey = toDateKey(selectedDate);
      const formattedDate = formatDate(selectedDate);

      // Book the meeting with backend
      const res = await bookMeetingApi({
        clientName: form.name.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: form.service,
        date: formattedDate,
        dateKey: dateKey,
        time: selectedTime,
        timezone: timezone,
        notes: form.notes,
      });

      if (res && res.success) {
        setConfirmedMeeting(res.meeting || {
          clientName: form.name,
          email: form.email,
          service: form.service,
          date: formattedDate,
          time: selectedTime,
          meetUrl: res.meetUrl || GENVAANI_MEET_URL,
        });

        // Immediately update local bookedSlots so this slot is removed for this date
        setBookedSlots((prev) => [...prev, selectedTime]);
        setStatus('confirmed');
      } else {
        setStatus('idle');
        setError(res?.message || 'This time slot was just booked by another client. Please pick another available time.');
        // Refresh latest booked slots
        const latest = await getBookedSlotsApi(dateKey);
        if (latest && latest.bookedSlots) {
          setBookedSlots(latest.bookedSlots);
        }
      }
    } catch (err) {
      console.error(err);
      setStatus('idle');
      setError('Network error while scheduling appointment. Please check your connection and try again.');
    }
  };

  const resetBooking = () => {
    setStep(1);
    setStatus('idle');
    setSelectedTime('');
    setError('');
    setForm({ name: '', email: '', phone: '', service: SERVICES[0], notes: '' });
  };

  const copyMeetLink = () => {
    navigator.clipboard.writeText(GENVAANI_MEET_URL);
    setCopiedMeet(true);
    setTimeout(() => setCopiedMeet(false), 2200);
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-glow contact-hero-glow-one" aria-hidden="true" />
        <div className="contact-hero-glow contact-hero-glow-two" aria-hidden="true" />
        <div className="contact-hero-inner">
          <h1>Let's Talk About <span>What You Want to Build.</span></h1>
          <p className="contact-hero-copy">
            Have a project in mind or looking to improve your digital presence? Schedule a consultation
            with our team to discuss your goals, explore solutions, and identify the right next steps.
          </p>
          <a className="contact-primary-button" href="#booking-widget">
            Schedule a Call <span aria-hidden="true">↗</span>
          </a>
          <div className="contact-trust-row" aria-label="Consultation details">
            <span><b>✓</b> Free initial consultation</span>
            <span><b>✓</b> 30-minute discovery call</span>
            <span><b>✓</b> No obligation to proceed</span>
          </div>
        </div>
        <div className="hero-orbit orbit-one" aria-hidden="true"><span /></div>
        <div className="hero-orbit orbit-two" aria-hidden="true"><span /></div>
        <div className="hero-calendar-art" aria-hidden="true">
          <div className="art-calendar-top"><span /><span /><span /></div>
          <div className="art-calendar-title"><i /> <i /> <i /></div>
          <div className="art-calendar-grid">
            {Array.from({ length: 21 }, (_, i) => <i key={i} className={i === 11 ? 'art-day-active' : ''}>{i + 1}</i>)}
          </div>
          <div className="art-confirm-chip"><span>✓</span><div><b>Time reserved</b><small>Let's make it happen</small></div></div>
        </div>
      </section>

      <section className="booking-section" id="booking-widget">
        <div className="booking-section-heading">
          <span className="section-kicker">YOUR NEXT STEP</span>
          <h2>Book your consultation</h2>
          <p>Choose a time that works for you. We’ll take it from there.</p>
        </div>

        <div className="booking-card">
          <aside className="booking-sidebar">
            <div className="booking-brand-mark">
              <div className="booking-brand-logo-wrap">
                <img src={brandIcon} alt="Genvaani" className="booking-brand-logo-img" />
              </div>
              <div><b>Genvaani</b><small>Discovery consultation</small></div>
            </div>
            <div className="sidebar-rule" />
            <p className="sidebar-label">LET'S CONNECT</p>
            <h3>Good things start with a conversation.</h3>
            <p className="sidebar-copy">Tell us what you’re working on. We’ll discuss your goals, answer your questions, and explore how we can help.</p>
            <div className="sidebar-detail"><span className="sidebar-icon">◷</span><div><b>30 minutes</b><small>A focused first conversation</small></div></div>
            <div className="sidebar-detail"><span className="sidebar-icon">⌁</span><div><b>Google Meet Video Room</b><small>{GENVAANI_MEET_URL}</small></div></div>
            <div className="sidebar-note"><span>✦</span> Slots that are booked for a particular date are automatically removed from available times.</div>
          </aside>

          <div className="booking-main">
            {status === 'confirmed' ? (
              <div className="booking-result" role="status">
                <div className="result-icon">✓</div>
                <h2>Thanks, {form.name.split(' ')[0]}.</h2>
                <p>Your discovery consultation has been confirmed in our agency schedule. A full calendar confirmation with your Google Meet link has also been emailed to <strong>{form.email}</strong>.</p>
                
                <div className="result-summary">
                  <div><small>Selected date</small><b>{selectedDate ? formatDate(selectedDate) : 'Confirmed'}</b></div>
                  <div><small>Selected time</small><b>{selectedTime} · {TIMEZONES.find((item) => item.value === timezone)?.label}</b></div>
                  <div><small>Service</small><b>{form.service}</b></div>
                  <div><small>Email</small><b>{form.email}</b></div>
                </div>

                {/* Direct Google Meet Link Card */}
                <div style={{
                  margin: '22px 0',
                  padding: '18px 22px',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #e0faff 100%)',
                  border: '1px solid #bbf7d0',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 6px 18px rgba(0, 203, 240, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#00278a', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      🎥 Google Meet Video Conference Room
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 700, background: '#dcfce7', padding: '3px 10px', borderRadius: '50px' }}>
                      ✓ Confirmed & Active
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <a 
                      href={GENVAANI_MEET_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="contact-primary-button"
                      style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '0.88rem' }}
                    >
                      Join Google Meet ↗
                    </a>
                    <button 
                      type="button" 
                      onClick={copyMeetLink}
                      style={{
                        background: '#ffffff',
                        border: '1px solid rgba(0, 39, 138, 0.15)',
                        padding: '11px 20px',
                        borderRadius: '50px',
                        color: '#00278a',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '0.84rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {copiedMeet ? '✓ Meet Link Copied' : 'Copy Meet Link'}
                    </button>
                  </div>

                  <span style={{ fontSize: '0.78rem', color: '#475569', wordBreak: 'break-all' }}>
                    Google Meet URL: <a href={GENVAANI_MEET_URL} target="_blank" rel="noreferrer" style={{ color: '#0084c7', fontWeight: 700 }}>{GENVAANI_MEET_URL}</a>
                  </span>
                </div>

                <button type="button" className="text-button" onClick={resetBooking}>
                  Book another consultation
                </button>
              </div>
            ) : (
              <>
                <div className="booking-main-heading">
                  <div>
                    <span className="section-kicker">STEP {step} OF 2</span>
                    <h2>{step === 1 ? 'Choose a date & time' : 'A little about you'}</h2>
                  </div>
                  <span className="duration-pill"><span>◷</span> 30 min</span>
                </div>
                <div className="step-progress" aria-label={`Step ${step} of 2`}>
                  <span className={step >= 1 ? 'progress-active' : ''} />
                  <span className={step >= 2 ? 'progress-active' : ''} />
                </div>

                {step === 1 ? (
                  <>
                    <div className="booking-controls-row">
                      <label className="timezone-control">
                        <span>Time zone</span>
                        <select value={timezone} onChange={(event) => setTimezone(event.target.value)}>
                          {TIMEZONES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                        </select>
                      </label>
                    </div>

                    <div className="date-time-layout">
                      <div className="calendar-panel">
                        <div className="calendar-heading">
                          <h3>{formatDate(viewDate, { month: 'long', year: 'numeric' })}</h3>
                          <div className="calendar-nav">
                            <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">‹</button>
                            <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">›</button>
                          </div>
                        </div>
                        <div className="calendar-grid calendar-weekdays">
                          {WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
                        </div>
                        <div className="calendar-grid calendar-days">
                          {calendarCells.map((day, index) => {
                            const date = day ? new Date(year, month, day) : null;
                            const selected = date && selectedDate && toDateKey(date) === toDateKey(selectedDate);
                            const todayCell = date && toDateKey(date) === toDateKey(today);
                            return day ? (
                              <button
                                key={`${year}-${month}-${day}`}
                                type="button"
                                disabled={isPast(day)}
                                onClick={() => selectDate(day)}
                                className={`calendar-day ${selected ? 'day-selected' : ''} ${todayCell ? 'day-today' : ''}`}
                                aria-pressed={Boolean(selected)}
                              >
                                {day}
                              </button>
                            ) : (
                              <span key={`empty-${index}`} className="calendar-day-empty" />
                            );
                          })}
                        </div>
                        <div className="calendar-legend">
                          <span><i className="legend-today" /> Today</span>
                          <span><i className="legend-selected" /> Selected</span>
                        </div>
                      </div>

                      <div className="time-panel">
                        <div className="time-panel-heading">
                          <h3>{selectedDate ? formatDate(selectedDate, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Available times'}</h3>
                          <span>
                            {loadingSlots ? 'Checking...' : `${availableTimeSlots.length} available`}
                          </span>
                        </div>
                        <p className="time-panel-copy">
                          Booked slots for this date are removed automatically.
                        </p>

                        {availableTimeSlots.length === 0 ? (
                          <div style={{
                            padding: '24px 16px',
                            background: '#f8fafc',
                            borderRadius: '14px',
                            border: '1px dashed #cbd5e1',
                            color: '#64748b',
                            fontSize: '0.84rem',
                            textAlign: 'center',
                            lineHeight: 1.5
                          }}>
                            <b>No slots remaining for this date.</b>
                            <p style={{ margin: '6px 0 0', fontSize: '0.78rem' }}>
                              All consultations on this day are reserved. Please select another date on the calendar.
                            </p>
                          </div>
                        ) : (
                          <div className="time-slots">
                            {availableTimeSlots.map((time) => (
                              <button
                                type="button"
                                key={time}
                                onClick={() => { setSelectedTime(time); setError(''); }}
                                className={`time-slot ${selectedTime === time ? 'time-selected' : ''}`}
                                aria-pressed={selectedTime === time}
                              >
                                <span>{time}</span>
                                <span className="time-slot-mark">{selectedTime === time ? '✓' : '→'}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="selected-summary">
                          <span className="summary-check">✓</span>
                          <div>
                            <small>Your selection</small>
                            <b>{selectedDate && selectedTime ? `${formatDate(selectedDate, { month: 'short', day: 'numeric' })} · ${selectedTime}` : 'Select an available time slot'}</b>
                          </div>
                        </div>
                      </div>
                    </div>

                    {error && <p className="booking-error" role="alert">{error}</p>}

                    <div className="booking-actions">
                      <span className="secure-note"><span>⌑</span> Direct Google Meet link provided.</span>
                      <button
                        className="contact-primary-button continue-button"
                        type="button"
                        disabled={!selectedDate || !selectedTime}
                        onClick={continueToDetails}
                      >
                        Continue to your details <span>→</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <form className="attendee-form" onSubmit={submitBookingRequest}>
                    <div className="selected-appointment-banner">
                      <span className="appointment-banner-icon">✓</span>
                      <div>
                        <small>YOUR SELECTED APPOINTMENT</small>
                        <b>{selectedDate && formatDate(selectedDate)} · {selectedTime}</b>
                        <span>{TIMEZONES.find((item) => item.value === timezone)?.label} · 30 minutes</span>
                      </div>
                      <button type="button" onClick={() => setStep(1)}>Edit</button>
                    </div>

                    <div className="form-fields-grid">
                      <label className="form-field">
                        <span>Full name <i>*</i></span>
                        <input name="name" value={form.name} onChange={updateForm} placeholder="Your name" autoComplete="name" required />
                      </label>
                      <label className="form-field">
                        <span>Email address <i>*</i></span>
                        <input name="email" type="email" value={form.email} onChange={updateForm} placeholder="you@company.com" autoComplete="email" required />
                      </label>
                      <label className="form-field">
                        <span>Phone / WhatsApp <small>Optional</small></span>
                        <input name="phone" type="tel" value={form.phone} onChange={updateForm} placeholder="Your phone number" autoComplete="tel" />
                      </label>
                      <label className="form-field">
                        <span>What can we help with?</span>
                        <select name="service" value={form.service} onChange={updateForm}>
                          {SERVICES.map((service) => <option key={service}>{service}</option>)}
                        </select>
                      </label>
                      <label className="form-field field-full">
                        <span>Tell us about your project <small>Optional</small></span>
                        <textarea name="notes" value={form.notes} onChange={updateForm} rows="3" placeholder="A few details about your goals, tech stack, or challenges..." />
                      </label>
                    </div>

                    {error && <p className="booking-error" role="alert">{error}</p>}

                    <div className="booking-actions form-actions">
                      <button className="back-button" type="button" onClick={() => setStep(1)} disabled={status === 'loading'}>
                        ← Back to calendar
                      </button>
                      <button className="contact-primary-button continue-button" type="submit" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Confirming appointment...' : 'Confirm Appointment Request →'}
                      </button>
                    </div>
                    <p className="form-disclaimer">
                      Upon confirmation, this time slot will be reserved for you and removed from public availability.
                    </p>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="contact-bottom-cta">
        <div className="bottom-cta-mark">
          <img src={brandIcon} alt="Genvaani" className="bottom-cta-logo-img" />
        </div>
        <div>
          <h2>Have an idea? Let's talk.</h2>
          <p>The first step toward a better digital product can be a simple conversation.</p>
        </div>
        <a href="#booking-widget">Pick a time <span>↗</span></a>
      </section>
    </main>
  );
}
