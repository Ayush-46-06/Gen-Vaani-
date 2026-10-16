/**
 * Gen-Vaani Administrator API Client
 * Connects frontend auth and admin console to Node.js / Express backend
 */

import { BASE_API } from './apiConfig.js';

const API_BASE_URL = `${BASE_API}/admin`;

/**
 * Register a new administrator
 * @param {Object} data - { name, email, phone, password, secretKey }
 */
export async function registerAdminApi(data) {
  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.error('API Error in registerAdminApi:', err);
    return {
      success: false,
      message: 'Unable to reach backend server. Please ensure backend is running on port 5000.',
    };
  }
}

/**
 * Login administrator
 * @param {Object} credentials - { email, password }
 */
export async function loginAdminApi(credentials) {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.error('API Error in loginAdminApi:', err);
    return {
      success: false,
      message: 'Unable to reach backend server. Please ensure backend is running on port 5000.',
    };
  }
}

/**
 * Get current admin profile
 * @param {string} token - JWT bearer token
 */
export async function getAdminProfileApi(token) {
  try {
    const res = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.error('API Error in getAdminProfileApi:', err);
    return {
      success: false,
      message: 'Failed to fetch admin profile from server.',
    };
  }
}

/**
 * Get admin stats
 * @param {string} token - JWT bearer token
 */
export async function getAdminStatsApi(token) {
  try {
    const res = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.error('API Error in getAdminStatsApi:', err);
    return {
      success: false,
      message: 'Failed to fetch admin stats from server.',
    };
  }
}

/**
 * Change administrator password
 * @param {Object} data - { currentPassword, newPassword }
 * @param {string} token - JWT bearer token
 */
export async function changeAdminPasswordApi(data, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error('API Error in changeAdminPasswordApi:', err);
    return {
      success: false,
      message: 'Failed to connect to backend server. Please verify backend is running.',
    };
  }
}
