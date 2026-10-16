import { BASE_API } from './apiConfig.js';

const API_BASE_URL = `${BASE_API}/meetings`;
export const GENVAANI_MEET_URL = 'https://meet.google.com/mjk-yknw-mvz';

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
