import { BASE_API } from './apiConfig.js';

const API_BASE_URL = `${BASE_API}/meetings`;
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

/**
 * Get agency availability settings (AEST time slots, working days, URLs)
 */
export async function getAvailabilityApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/availability`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await res.json();
  } catch (error) {
    console.error('Error fetching availability:', error);
    return {
      success: false,
      availability: null,
    };
  }
}

/**
 * Update agency availability settings (AEST slots, working days, URLs) from Admin
 */
export async function updateAvailabilityApi(availabilityData) {
  try {
    const res = await fetch(`${API_BASE_URL}/availability`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(availabilityData),
    });

    return await res.json();
  } catch (error) {
    console.error('Error updating availability:', error);
    return {
      success: false,
      message: 'Failed to update availability settings.',
    };
  }
}

/**
 * Book a new consultation meeting
 */
export async function bookMeetingApi(bookingData) {
  try {
    const res = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    return await res.json();
  } catch (error) {
    console.error('Error booking meeting:', error);
    return {
      success: false,
      message: 'Failed to connect to consultation server. Please check backend is running.',
    };
  }
}

/**
 * Fetch booked slots for a specific dateKey (YYYY-MM-DD) or all booked dates
 */
export async function getBookedSlotsApi(dateKey) {
  try {
    const url = dateKey 
      ? `${API_BASE_URL}/booked-slots?dateKey=${encodeURIComponent(dateKey)}`
      : `${API_BASE_URL}/booked-slots`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await res.json();
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return {
      success: false,
      bookedSlots: [],
      scheduleMap: {},
    };
  }
}

/**
 * Fetch all meetings for Admin Dashboard
 */
export async function getMeetingsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await res.json();
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return {
      success: false,
      meetings: [],
      meetUrl: GENVAANI_MEET_URL,
    };
  }
}

/**
 * Update meeting status (confirmed -> completed or cancelled)
 */
export async function updateMeetingStatusApi(id, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    return await res.json();
  } catch (error) {
    console.error('Error updating meeting status:', error);
    return {
      success: false,
      message: 'Failed to update meeting status.',
    };
  }
}

/**
 * Delete a meeting
 */
export async function deleteMeetingApi(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    return await res.json();
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return {
      success: false,
      message: 'Failed to delete meeting.',
    };
  }
}
