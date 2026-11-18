import React, { useMemo, useState, useEffect, useRef } from 'react';
import brandIcon from '../assets/PNG/8.icon Transparent.webp';
import { submitLeadApi } from '../services/leadApi';
import {
  bookMeetingApi,
  getBookedSlotsApi,
  getAvailabilityApi,
  GENVAANI_MEET_URL,
  GENVAANI_TEAMS_URL,
} from '../services/meetingApi';
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
  { label: 'Australian Eastern Time (AEST / Sydney)', value: 'Australia/Sydney', abbr: 'AEST' },
  { label: 'India Standard Time (IST)', value: 'Asia/Kolkata', abbr: 'IST' },
  { label: 'Coordinated Universal Time (UTC)', value: 'UTC', abbr: 'UTC' },
  { label: 'Greenwich Mean Time (London / GMT)', value: 'Europe/London', abbr: 'GMT' },
  { label: 'Eastern Time (US & Canada / New York)', value: 'America/New_York', abbr: 'EST' },
  { label: 'Central Time (US & Canada / Chicago)', value: 'America/Chicago', abbr: 'CST' },
  { label: 'Mountain Time (US & Canada / Denver)', value: 'America/Denver', abbr: 'MST' },
  { label: 'Pacific Time (US & Canada / Los Angeles)', value: 'America/Los_Angeles', abbr: 'PST' },
  { label: 'Gulf Standard Time (Dubai / GST)', value: 'Asia/Dubai', abbr: 'GST' },
  { label: 'Singapore Time (SGT)', value: 'Asia/Singapore', abbr: 'SGT' },
  { label: 'Japan Standard Time (Tokyo / JST)', value: 'Asia/Tokyo', abbr: 'JST' },
  { label: 'New Zealand Daylight Time (Auckland)', value: 'Pacific/Auckland', abbr: 'NZDT' },
  { label: 'Central European Time (Paris / Berlin)', value: 'Europe/Paris', abbr: 'CET' },
];

const LOCATION_OPTIONS = [
  {
    id: 'Google Meet',
    label: 'Google Meet',
    desc: 'HD Video Conference',
    icon: (
      <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
        <path d="M42 14.5L34 20.5V11C34 9.343 32.657 8 31 8H7C5.343 8 4 9.343 4 11V37C4 38.657 5.343 40 7 40H31C32.657 40 34 38.657 34 37V27.5L42 33.5C43.105 34.328 44 33.82 44 32.5V15.5C44 14.18 43.105 13.672 42 14.5Z" fill="#00832d"/>
        <path d="M34 20.5L42 14.5C43.105 13.672 44 14.18 44 15.5V24H34V20.5Z" fill="#0066da"/>
        <path d="M34 27.5V37C34 38.657 32.657 40 31 40H7C5.343 40 4 38.657 4 37V33L34 27.5Z" fill="#2684fc"/>
        <path d="M4 11C4 9.343 5.343 8 7 8H31C32.657 8 34 9.343 34 11V20.5L4 16V11Z" fill="#00ac47"/>
        <path d="M34 24H44V32.5C44 33.82 43.105 34.328 42 33.5L34 27.5V24Z" fill="#00832d"/>
        <path d="M34 20.5L44 24H34V20.5Z" fill="#ffba00"/>
        <path d="M34 24H44V27.5L34 24Z" fill="#ea4335"/>
      </svg>
    ),
  },
  {
    id: 'Microsoft Teams',
    label: 'Microsoft Teams',
    desc: 'Video & Audio Call',
    icon: (
      <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="8" fill="#464EB8"/>
        <circle cx="34" cy="18" r="5" fill="#7B83EB"/>
        <path d="M39 25H29C27.9 25 27 25.9 27 27V33H41V27C41 25.9 40.1 25 39 25Z" fill="#7B83EB"/>
        <rect x="7" y="11" width="22" height="26" rx="4" fill="#505AC9"/>
        <circle cx="18" cy="20" r="5" fill="#FFFFFF"/>
        <path d="M23.5 28H12.5C11.12 28 10 29.12 10 30.5V35H26V30.5C26 29.12 24.88 28 23.5 28Z" fill="#FFFFFF"/>
      </svg>
    ),
  },
  {
    id: 'Phone call',
    label: 'Phone call',
    desc: 'Direct Voice Call',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
  },
];

const DEFAULT_AEST_SLOTS = [
  '09:30 AM',
  '11:00 AM',
  '12:30 PM',
  '02:00 PM',
  '03:30 PM',
  '04:15 PM',
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const pad = (value) => String(value).padStart(2, '0');

function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDate(date, options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) {
  return new Intl.DateTimeFormat('en', options).format(date);
}

/**
 * Converts Sydney (AEST/AEDT) wall-clock time on dateKey to the client's chosen target timezone
 */
function convertAestToTz(dateKey, timeStr, targetTz) {
  if (!timeStr || !dateKey) return timeStr;
  if (targetTz === 'Australia/Sydney') return timeStr;

  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return timeStr;
  let [_, h, m, period] = match;
  let hours = parseInt(h, 10);
  const minutes = parseInt(m, 10);
  if (period.toUpperCase() === 'PM' && hours < 12) hours += 12;
  if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;

  const [year, month, day] = dateKey.split('-').map(Number);
  const baseUtc = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  // Determine Sydney offset at this instant
  const sydneyFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Australia/Sydney',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  const parts = sydneyFmt.formatToParts(baseUtc);
  const pMap = {};
  parts.forEach(p => pMap[p.type] = p.value);
  const sydAsUtc = Date.UTC(+pMap.year, +pMap.month - 1, +pMap.day, +pMap.hour, +pMap.minute, +pMap.second);
  const sydneyOffsetMs = sydAsUtc - baseUtc.getTime();

  // True instant in UTC
  const trueInstant = new Date(baseUtc.getTime() - sydneyOffsetMs);

  const targetFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: targetTz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return targetFmt.format(trueInstant);
}

export default function Contact() {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Client time and Sydney canonical AEST time
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedAestTime, setSelectedAestTime] = useState('');

  // Location option ('Google Meet' | 'Microsoft Teams' | 'Phone call')
  const [selectedLocation, setSelectedLocation] = useState('Google Meet');

  // Client timezone: attempt auto-detection from browser, fallback to Sydney
  const [timezone, setTimezone] = useState(() => {
    try {
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const found = TIMEZONES.find((item) => item.value === userTz);
      return found ? found.value : 'Australia/Sydney';
    } catch {
      return 'Australia/Sydney';
    }
  });

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('idle'); // idle | loading | confirmed
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: SERVICES[0], notes: '' });

  // Availability settings fetched from admin portal
  const [aestSlots, setAestSlots] = useState(DEFAULT_AEST_SLOTS);
  const [availabilityConfig, setAvailabilityConfig] = useState(null);

  // Real-time booked slots tracking
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookedAestSlots, setBookedAestSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [confirmedMeeting, setConfirmedMeeting] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const calendarCells = [...Array(firstDayOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  // Load Admin availability settings on mount
  useEffect(() => {
    getAvailabilityApi()
      .then((res) => {
        if (res && res.success && res.availability) {
          setAvailabilityConfig(res.availability);
          if (Array.isArray(res.availability.timeSlots) && res.availability.timeSlots.length > 0) {
            setAestSlots(res.availability.timeSlots);
          }
          if (Array.isArray(res.availability.workingDays) && res.availability.workingDays.length > 0) {
            setSelectedDate((curr) => {
              if (!curr) return curr;
              const dayIndex = (curr.getDay() + 6) % 7;
              const dayName = WEEKDAYS[dayIndex];
              if (!res.availability.workingDays.includes(dayName)) {
                let nextDay = new Date(curr);
                for (let i = 1; i <= 7; i++) {
                  nextDay.setDate(nextDay.getDate() + 1);
                  const nextIdx = (nextDay.getDay() + 6) % 7;
                  if (res.availability.workingDays.includes(WEEKDAYS[nextIdx])) {
                    return nextDay;
                  }
                }
              }
              return curr;
            });
          }
        }
      })
      .catch((err) => {
        console.warn('Could not load availability settings from server, using defaults.', err);
      });
  }, []);

  // Fetch booked slots whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate) {
      setBookedSlots([]);
      setBookedAestSlots([]);
      return;
    }

    const dateKey = toDateKey(selectedDate);
    setLoadingSlots(true);

    getBookedSlotsApi(dateKey)
      .then((res) => {
        if (res && res.success) {
          setBookedSlots(Array.isArray(res.bookedSlots) ? res.bookedSlots : []);
          setBookedAestSlots(Array.isArray(res.bookedAestSlots) ? res.bookedAestSlots : []);
        } else {
          setBookedSlots([]);
          setBookedAestSlots([]);
        }
      })
      .catch((err) => {
        console.warn('Failed to load booked slots', err);
        setBookedSlots([]);
        setBookedAestSlots([]);
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }, [selectedDate]);

  // Compute converted slots for the current selected dateKey & timezone
  const dateKey = selectedDate ? toDateKey(selectedDate) : '';

  const slotItems = useMemo(() => {
    if (!dateKey) return [];
    return aestSlots.map((aestSlot) => {
      const clientSlot = convertAestToTz(dateKey, aestSlot, timezone);
      const isBooked =
        bookedSlots.includes(clientSlot) ||
        bookedSlots.includes(aestSlot) ||
        bookedAestSlots.includes(aestSlot);
      return {
        aestSlot,
        clientSlot,
        isBooked,
      };
    });
  }, [dateKey, aestSlots, timezone, bookedSlots, bookedAestSlots]);

  const availableSlotItems = useMemo(() => {
    return slotItems.filter((item) => !item.isBooked);
  }, [slotItems]);

  // Clear selection if the chosen slot is no longer available
  useEffect(() => {
    if (selectedAestTime && !availableSlotItems.some((item) => item.aestSlot === selectedAestTime)) {
      setSelectedTime('');
      setSelectedAestTime('');
    }
  }, [availableSlotItems, selectedAestTime]);

  const isDayDisabled = (day) => {
    if (!day) return true;
    const date = new Date(year, month, day);
    if (date < today) return true;
    if (Array.isArray(availabilityConfig?.workingDays) && availabilityConfig.workingDays.length > 0) {
      const dayIndex = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6
      const dayName = WEEKDAYS[dayIndex];
      return !availabilityConfig.workingDays.includes(dayName);
    }
    return false;
  };

  const isPast = (day) => isDayDisabled(day);

  const changeMonth = (amount) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const selectDate = (day) => {
    if (!day || isDayDisabled(day)) return;
    const next = new Date(year, month, day);
    setSelectedDate(next);
    setSelectedTime('');
    setSelectedAestTime('');
    setError('');
    setStatus('idle');
    setStep(1);
  };

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const slotTransitionTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (slotTransitionTimerRef.current) {
        clearTimeout(slotTransitionTimerRef.current);
      }
    };
  }, []);

  const handleSlotSelect = (slot) => {
    setSelectedTime(slot.clientSlot);
    setSelectedAestTime(slot.aestSlot);
    setError('');

    if (slotTransitionTimerRef.current) {
      clearTimeout(slotTransitionTimerRef.current);
    }

    // Direct progression to Step 2 upon selecting a time slot
    slotTransitionTimerRef.current = setTimeout(() => {
      setStep(2);
      document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
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

    if (selectedLocation === 'Phone call' && !form.phone.trim()) {
      setError('Please enter your phone number with country code so our senior consultant can call you at your scheduled time.');
      return;
    }

    setStatus('loading');

    try {
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
        aestTime: selectedAestTime || selectedTime,
        aestDateKey: dateKey,
        location: selectedLocation,
        notes: form.notes,
      });

      if (res && res.success) {
        setConfirmedMeeting(
          res.meeting || {
            clientName: form.name,
            email: form.email,
            phone: form.phone,
            service: form.service,
            date: formattedDate,
            time: selectedTime,
            timezone: timezone,
            aestTime: selectedAestTime || selectedTime,
            location: selectedLocation,
            meetUrl: res.meetUrl || availabilityConfig?.googleMeetUrl || GENVAANI_MEET_URL,
            teamsUrl: res.teamsUrl || availabilityConfig?.teamsUrl || GENVAANI_TEAMS_URL,
          }
        );

        // Immediately update local booked slots
        setBookedSlots((prev) => [...prev, selectedTime]);
        if (selectedAestTime) {
          setBookedAestSlots((prev) => [...prev, selectedAestTime]);
        }
        setStatus('confirmed');
      } else {
        setStatus('idle');
        setError(res?.message || 'This time slot was just booked by another client. Please select another available time.');
        // Refresh latest booked slots
        const latest = await getBookedSlotsApi(dateKey);
        if (latest && latest.bookedSlots) {
          setBookedSlots(latest.bookedSlots);
          setBookedAestSlots(latest.bookedAestSlots || []);
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
    setSelectedAestTime('');
    setError('');
    setForm({ name: '', email: '', phone: '', service: SERVICES[0], notes: '' });
  };

  const activeMeetUrl = confirmedMeeting?.meetUrl || availabilityConfig?.googleMeetUrl || GENVAANI_MEET_URL;
  const activeTeamsUrl = confirmedMeeting?.teamsUrl || availabilityConfig?.teamsUrl || GENVAANI_TEAMS_URL;

  const copySessionLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const currentTzObj = TIMEZONES.find((item) => item.value === timezone) || { label: timezone, abbr: 'TZ' };

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

            <div className="sidebar-detail">
              <span className="sidebar-icon">◷</span>
              <div>
                <b>30 minutes</b>
                <small>A focused technical consultation</small>
              </div>
            </div>

            <div className="sidebar-detail">
              <span className="sidebar-icon">⌁</span>
              <div>
                <b>
                  {selectedLocation === 'Microsoft Teams'
                    ? 'Microsoft Teams Room'
                    : selectedLocation === 'Phone call'
                    ? 'Direct Phone Consultation'
                    : 'Google Meet Video Room'}
                </b>
                <small>
                  {selectedLocation === 'Phone call'
                    ? 'We will call your phone directly'
                    : selectedLocation === 'Microsoft Teams'
                    ? 'HD Video & Audio session'
                    : 'Direct link provided upon booking'}
                </small>
              </div>
            </div>

            <div className="sidebar-note">
              <span>✦</span> Available times are set in Australian Eastern Time (AEST) and automatically converted into your local timezone.
            </div>

            <div className="sidebar-direct-section">
              <div className="sidebar-rule" />
              <p className="sidebar-label">DIRECT REACH OUT</p>
              <div className="sidebar-direct-list">
                <a
                  href="mailto:info@genvaani.com"
                  className="sidebar-direct-card"
                  title="Send email to info@genvaani.com"
                >
                  <span className="sidebar-direct-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <div className="sidebar-direct-text">
                    <small>Email</small>
                    <b>info@genvaani.com</b>
                  </div>
                </a>

                <a
                  href="tel:+12125551234"
                  className="sidebar-direct-card"
                  title="Call +1 (212) 555-1234"
                >
                  <span className="sidebar-direct-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </span>
                  <div className="sidebar-direct-text">
                    <small>Phone</small>
                    <b>+1 (212) 555-1234</b>
                  </div>
                </a>

                <a
                  href="https://maps.google.com/?q=123+Business+Avenue,+New+York,+NY+10001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-direct-card"
                  title="Open headquarters in Google Maps"
                >
                  <span className="sidebar-direct-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <div className="sidebar-direct-text">
                    <small>Headquarters</small>
                    <b>New York, NY 10001 ↗</b>
                  </div>
                </a>
              </div>
            </div>
          </aside>

          <div className="booking-main">
            {status === 'confirmed' ? (
              <div className="booking-result" role="status">
                <div className="result-icon">✓</div>
                <h2>Thanks, {form.name.split(' ')[0]}.</h2>
                <p>
                  Your discovery consultation has been confirmed. A calendar invitation with your session details has also been emailed to <strong>{form.email}</strong>.
                </p>

                <div className="result-summary">
                  <div>
                    <small>Selected date</small>
                    <b>{selectedDate ? formatDate(selectedDate) : 'Confirmed'}</b>
                  </div>
                  <div>
                    <small>Selected time</small>
                    <b>
                      {selectedTime} {currentTzObj.abbr}
                      {selectedAestTime && selectedAestTime !== selectedTime && (
                        <span style={{ color: '#0284c7', marginLeft: '6px', fontSize: '0.74rem' }}>
                          ({selectedAestTime} AEST)
                        </span>
                      )}
                    </b>
                  </div>
                  <div>
                    <small>Location / Channel</small>
                    <b style={{ color: '#00278a' }}>{selectedLocation}</b>
                  </div>
                  <div>
                    <small>Service Requested</small>
                    <b>{form.service}</b>
                  </div>
                  <div>
                    <small>Attendee Name</small>
                    <b>{form.name}</b>
                  </div>
                  <div>
                    <small>Email</small>
                    <b>{form.email}</b>
                  </div>
                  {form.phone && (
                    <div>
                      <small>Phone Number</small>
                      <b>{form.phone}</b>
                    </div>
                  )}
                </div>

                {/* Direct Meeting Platform Card */}
                {selectedLocation === 'Google Meet' && (
                  <div
                    style={{
                      margin: '22px 0',
                      padding: '18px 22px',
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #e0faff 100%)',
                      border: '1px solid #bbf7d0',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: '0 6px 18px rgba(0, 203, 240, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#00278a', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🎥 Google Meet Video Conference Room
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 700, background: '#dcfce7', padding: '3px 10px', borderRadius: '50px' }}>
                        ✓ Confirmed & Active
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <a
                        href={activeMeetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="contact-primary-button"
                        style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '0.88rem' }}
                      >
                        Join Google Meet ↗
                      </a>
                      <button
                        type="button"
                        onClick={() => copySessionLink(activeMeetUrl)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid rgba(0, 39, 138, 0.15)',
                          padding: '11px 20px',
                          borderRadius: '50px',
                          color: '#00278a',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '0.84rem',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {copiedLink ? '✓ Meet Link Copied' : 'Copy Meet Link'}
                      </button>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: '#475569', wordBreak: 'break-all' }}>
                      Meeting URL: <a href={activeMeetUrl} target="_blank" rel="noreferrer" style={{ color: '#0084c7', fontWeight: 700 }}>{activeMeetUrl}</a>
                    </span>
                  </div>
                )}

                {selectedLocation === 'Microsoft Teams' && (
                  <div
                    style={{
                      margin: '22px 0',
                      padding: '18px 22px',
                      background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                      border: '1px solid #ddd6fe',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: '0 6px 18px rgba(70, 78, 184, 0.12)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#464EB8', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        💼 Microsoft Teams Video Conference
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#6d28d9', fontWeight: 700, background: '#ede9fe', padding: '3px 10px', borderRadius: '50px' }}>
                        ✓ Room Reserved
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <a
                        href={activeTeamsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="contact-primary-button"
                        style={{
                          textDecoration: 'none',
                          padding: '12px 24px',
                          fontSize: '0.88rem',
                          background: 'linear-gradient(110deg, #464EB8 0%, #505AC9 100%)',
                        }}
                      >
                        Join Microsoft Teams ↗
                      </a>
                      <button
                        type="button"
                        onClick={() => copySessionLink(activeTeamsUrl)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid rgba(70, 78, 184, 0.25)',
                          padding: '11px 20px',
                          borderRadius: '50px',
                          color: '#464EB8',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '0.84rem',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {copiedLink ? '✓ Teams Link Copied' : 'Copy Teams Link'}
                      </button>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: '#475569', wordBreak: 'break-all' }}>
                      Teams URL: <a href={activeTeamsUrl} target="_blank" rel="noreferrer" style={{ color: '#464EB8', fontWeight: 700 }}>{activeTeamsUrl}</a>
                    </span>
                  </div>
                )}

                {selectedLocation === 'Phone call' && (
                  <div
                    style={{
                      margin: '22px 0',
                      padding: '18px 22px',
                      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                      border: '1px solid #fde68a',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b45309', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        📞 Direct Phone Consultation
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#92400e', fontWeight: 700, background: '#fef3c7', padding: '3px 10px', borderRadius: '50px' }}>
                        ✓ Scheduled Call
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.86rem', color: '#78350f', lineHeight: 1.6 }}>
                      Our senior technical architect will call you directly at <strong>{form.phone}</strong> at the scheduled time. Please ensure your phone is reachable.
                    </p>
                  </div>
                )}

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
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ color: '#0284c7' }}>🌐</span> Time zone
                        </span>
                        <select
                          value={timezone}
                          onChange={(event) => {
                            setTimezone(event.target.value);
                            setSelectedTime('');
                          }}
                        >
                          {TIMEZONES.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
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
                            {loadingSlots ? 'Checking...' : `${availableSlotItems.length} available`}
                          </span>
                        </div>
                        <p className="time-panel-copy">
                          Slots set in AEST (Sydney) converted to your timezone ({currentTzObj.abbr}). Booked slots removed automatically.
                        </p>

                        {availableSlotItems.length === 0 ? (
                          <div
                            style={{
                              padding: '24px 16px',
                              background: '#f8fafc',
                              borderRadius: '14px',
                              border: '1px dashed #cbd5e1',
                              color: '#64748b',
                              fontSize: '0.84rem',
                              textAlign: 'center',
                              lineHeight: 1.5,
                            }}
                          >
                            <b>No slots remaining for this date.</b>
                            <p style={{ margin: '6px 0 0', fontSize: '0.78rem' }}>
                              All consultations on this day are reserved. Please select another date on the calendar.
                            </p>
                          </div>
                        ) : (
                          <div className="time-slots">
                            {availableSlotItems.map((slot) => {
                              const isSelected = selectedAestTime === slot.aestSlot;
                              return (
                                <button
                                  type="button"
                                  key={slot.aestSlot}
                                  onClick={() => handleSlotSelect(slot)}
                                  className={`time-slot ${isSelected ? 'time-selected' : ''}`}
                                  aria-pressed={isSelected}
                                >
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                    <span>{slot.clientSlot}</span>
                                    {timezone !== 'Australia/Sydney' && (
                                      <span
                                        style={{
                                          fontSize: '0.68rem',
                                          fontWeight: 600,
                                          opacity: isSelected ? 0.9 : 0.65,
                                        }}
                                      >
                                        ({slot.aestSlot} AEST)
                                      </span>
                                    )}
                                  </div>
                                  <span className="time-slot-mark">{isSelected ? '✓' : '→'}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <div className="selected-summary">
                          <span className="summary-check">✓</span>
                          <div>
                            <small>Your selection ({currentTzObj.abbr})</small>
                            <b>
                              {selectedDate && selectedTime
                                ? `${formatDate(selectedDate, { month: 'short', day: 'numeric' })} · ${selectedTime}${
                                    selectedAestTime && selectedAestTime !== selectedTime ? ` (${selectedAestTime} AEST)` : ''
                                  }`
                                : 'Select an available time slot'}
                            </b>
                          </div>
                        </div>
                      </div>
                    </div>

                    {error && <p className="booking-error" role="alert">{error}</p>}

                    <div className="booking-actions">
                      {/* <span className="secure-note">
                        <span>⌑</span> Direct link / confirmation provided instantly.
                      </span> */}
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
                        <span>
                          {currentTzObj.label} · 30 minutes
                          {selectedAestTime && selectedAestTime !== selectedTime ? ` · ${selectedAestTime} Sydney Time` : ''}
                        </span>
                      </div>
                      <button type="button" onClick={() => setStep(1)}>Edit</button>
                    </div>

                    <div className="form-fields-grid">
                      {/* Calendly-style Location Field */}
                      <div className="location-selection-field">
                        <span className="location-field-label">
                          Location <i>*</i>
                        </span>
                        <div className="location-options-grid">
                          {LOCATION_OPTIONS.map((loc) => {
                            const isSelected = selectedLocation === loc.id;
                            return (
                              <label
                                key={loc.id}
                                className={`location-option-card ${isSelected ? 'location-selected' : ''}`}
                                onClick={() => setSelectedLocation(loc.id)}
                              >
                                <div className="location-radio-circle">
                                  {isSelected && <span className="location-radio-dot" />}
                                </div>
                                <div className="location-icon-wrap">
                                  {loc.icon}
                                </div>
                                <span className="location-name">{loc.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <label className="form-field">
                        <span>Full name <i>*</i></span>
                        <input
                          name="name"
                          value={form.name}
                          onChange={updateForm}
                          placeholder="Your name"
                          autoComplete="name"
                          required
                        />
                      </label>

                      <label className="form-field">
                        <span>Email address <i>*</i></span>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={updateForm}
                          placeholder="you@company.com"
                          autoComplete="email"
                          required
                        />
                      </label>

                      <label className="form-field">
                        <span>
                          Phone Number {selectedLocation === 'Phone call' ? <i>*</i> : <small>Optional</small>}
                        </span>
                        <input
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={updateForm}
                          placeholder={selectedLocation === 'Phone call' ? '+1 / +91 phone number for call' : 'Your phone number'}
                          autoComplete="tel"
                          required={selectedLocation === 'Phone call'}
                        />
                      </label>

                      <label className="form-field">
                        <span>What can we help with?</span>
                        <select name="service" value={form.service} onChange={updateForm}>
                          {SERVICES.map((service) => (
                            <option key={service}>{service}</option>
                          ))}
                        </select>
                      </label>

                      <label className="form-field field-full">
                        <span>Tell us about your project <small>Optional</small></span>
                        <textarea
                          name="notes"
                          value={form.notes}
                          onChange={updateForm}
                          rows="3"
                          placeholder="Please share anything that will help prepare for our meeting..."
                        />
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
                      By proceeding, you confirm that your selected time slot ({selectedTime} {currentTzObj.abbr}) will be reserved for you and synchronized with our team.
                    </p>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
