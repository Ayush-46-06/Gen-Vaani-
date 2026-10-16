import { BASE_API } from './apiConfig.js';

const API_BASE_URL = `${BASE_API}/leads`;

/**
 * Submit inquiry from Get In Touch form to MongoDB
 */
export async function submitLeadApi({ name, email, service, comments, message, phone }) {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        service,
        message: message || comments,
        phone: phone || '',
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting lead:', error);
    return {
      success: false,
      message: 'Failed to connect to backend server. Please verify backend is running on port 5000.',
    };
  }
}

/**
 * Fetch all leads for Admin Dashboard
 */
export async function getLeadsApi() {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    return {
      success: false,
      leads: [],
      message: 'Failed to fetch leads from backend server.',
    };
  }
}

/**
 * Update lead status in MongoDB (new -> in_progress -> converted)
 */
export async function updateLeadStatusApi(id, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating lead status:', error);
    return {
      success: false,
      message: 'Failed to update lead status.',
    };
  }
}

/**
 * Delete a lead by ID
 */
export async function deleteLeadApi(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting lead:', error);
    return {
      success: false,
      message: 'Failed to delete lead.',
    };
  }
}

/**
 * Send email reply to a lead (Brevo transactional dispatch)
 */
export async function replyLeadApi(id, { subject, message, recipientEmail, clientName, adminName }) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject,
        message,
        recipientEmail,
        clientName,
        adminName,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending reply to lead:', error);
    return {
      success: false,
      message: error.message || 'Failed to dispatch reply email.',
    };
  }
}

