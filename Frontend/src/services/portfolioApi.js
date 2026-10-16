/**
 * Gen-Vaani Portfolio & Websites API Client
 * Manages full CRUD operations for showcase websites and ImageKit uploads
 */

import { BASE_API } from './apiConfig.js';

const API_BASE_URL = `${BASE_API}/portfolio`;

/**
 * Fetch all portfolio websites
 * @param {boolean} all - if true, includes inactive websites (for admin)
 * @param {string} search - optional keyword filter
 */
export async function getPortfolioWebsitesApi(all = false, search = '') {
  try {
    const params = new URLSearchParams();
    if (all) params.append('all', 'true');
    if (search) params.append('search', search);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}${qs}`, {
      method: 'GET',
    });

    return await res.json();
  } catch (err) {
    console.warn('API error in getPortfolioWebsitesApi:', err);
    return {
      success: false,
      count: 0,
      websites: [],
      message: 'Failed to connect to portfolio API.',
    };
  }
}

/**
 * Fetch single website by ID
 * @param {string} id
 */
export async function getPortfolioWebsiteByIdApi(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
    });

    return await res.json();
  } catch (err) {
    console.warn(`API error in getPortfolioWebsiteByIdApi (${id}):`, err);
    return {
      success: false,
      message: 'Failed to fetch website details.',
    };
  }
}

/**
 * Upload image to ImageKit via Backend API
 * @param {string} file - Base64 Data URI or image URL
 * @param {string} fileName - File name to store in ImageKit
 * @param {string} token - Admin JWT token
 */
export async function uploadToImageKitApi(file, fileName, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        file,
        fileName: fileName || `portfolio_${Date.now()}.png`,
        folder: '/portfolio',
      }),
    });

    return await res.json();
  } catch (err) {
    console.error('ImageKit upload API error:', err);
    return {
      success: false,
      message: 'Failed to upload image to ImageKit.',
    };
  }
}

/**
 * Create a new portfolio website (Admin Protected)
 * @param {Object} data - Website details
 * @param {string} token - Admin JWT token
 */
export async function createPortfolioWebsiteApi(data, token) {
  try {
    const res = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error('API error in createPortfolioWebsiteApi:', err);
    return {
      success: false,
      message: 'Network error creating website.',
    };
  }
}

/**
 * Update an existing website (Admin Protected)
 * @param {string} id - Website MongoDB ID
 * @param {Object} data - Updated fields
 * @param {string} token - Admin JWT token
 */
export async function updatePortfolioWebsiteApi(id, data, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error(`API error in updatePortfolioWebsiteApi (${id}):`, err);
    return {
      success: false,
      message: 'Network error updating website.',
    };
  }
}

/**
 * Delete a website (Admin Protected)
 * @param {string} id - Website MongoDB ID
 * @param {string} token - Admin JWT token
 */
export async function deletePortfolioWebsiteApi(id, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.error(`API error in deletePortfolioWebsiteApi (${id}):`, err);
    return {
      success: false,
      message: 'Network error deleting website.',
    };
  }
}
