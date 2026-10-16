/**
 * Gen-Vaani Services API Client
 * Manages full CRUD operations for Agency Services and Pricing
 */

import { BASE_API } from './apiConfig.js';

const API_BASE_URL = `${BASE_API}/services`;

/**
 * Fetch all services
 * @param {boolean} all - if true, includes inactive services (for admin)
 */
export async function getServicesApi(all = false) {
  try {
    const res = await fetch(`${API_BASE_URL}${all ? '?all=true' : ''}`, {
      method: 'GET',
    });

    return await res.json();
  } catch (err) {
    console.warn('API error in getServicesApi, fallback may be used:', err);
    return {
      success: false,
      message: 'Failed to connect to services API.',
    };
  }
}

/**
 * Fetch single service by slug
 * @param {string} slug
 */
export async function getServiceBySlugApi(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/${slug}`, {
      method: 'GET',
    });

    return await res.json();
  } catch (err) {
    console.warn(`API error in getServiceBySlugApi (${slug}):`, err);
    return {
      success: false,
      message: `Failed to fetch service "${slug}".`,
    };
  }
}

/**
 * Create a new service (Admin Protected)
 * @param {Object} data - Service details
 * @param {string} token - Admin JWT token
 */
export async function createServiceApi(data, token) {
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
    console.error('API error in createServiceApi:', err);
    return {
      success: false,
      message: 'Failed to create service.',
    };
  }
}

/**
 * Update existing service (Admin Protected)
 * @param {string} id - Service MongoDB ID
 * @param {Object} data - Updated service details
 * @param {string} token - Admin JWT token
 */
export async function updateServiceApi(id, data, token) {
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
    console.error(`API error in updateServiceApi (${id}):`, err);
    return {
      success: false,
      message: 'Failed to update service.',
    };
  }
}

/**
 * Delete a service (Admin Protected)
 * @param {string} id - Service MongoDB ID
 * @param {string} token - Admin JWT token
 */
export async function deleteServiceApi(id, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.error(`API error in deleteServiceApi (${id}):`, err);
    return {
      success: false,
      message: 'Failed to delete service.',
    };
  }
}

/**
 * Seed or reset services to default catalog (Admin Protected)
 * @param {string} token - Admin JWT token
 * @param {boolean} force - Overwrite existing services
 */
export async function seedServicesApi(token, force = false) {
  try {
    const res = await fetch(`${API_BASE_URL}/seed?force=${force}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ force }),
    });

    return await res.json();
  } catch (err) {
    console.error('API error in seedServicesApi:', err);
    return {
      success: false,
      message: 'Failed to seed services.',
    };
  }
}
