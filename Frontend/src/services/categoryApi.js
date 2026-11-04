/**
 * Gen-Vaani Service Categories API Client
 * Manages full CRUD operations for Navbar Columns / Categories
 */

import { BASE_API } from './apiConfig.js';

const API_BASE_URL = `${BASE_API}/categories`;

export const DEFAULT_CATEGORIES = [
  {
    _id: 'cat-design-creative',
    name: 'Design & Creative',
    slug: 'design-creative',
    tagline: 'UI/UX, branding and creative design.',
    icon: 'design',
    order: 0,
    isActive: true,
  },
  {
    _id: 'cat-development-digital',
    name: 'Development & Digital Products',
    slug: 'development-digital',
    tagline: 'Websites, applications and software.',
    icon: 'code',
    order: 1,
    isActive: true,
  },
  {
    _id: 'cat-marketing-growth',
    name: 'Marketing & Growth',
    slug: 'marketing-growth',
    tagline: 'Google Ads, Meta Ads, SEO and digital marketing.',
    icon: 'growth',
    order: 2,
    isActive: true,
  },
];

/**
 * Fetch all categories (Public / Admin)
 * @param {boolean} all - if true, includes inactive
 */
export async function getCategoriesApi(all = false) {
  try {
    const res = await fetch(`${API_BASE_URL}${all ? '?all=true' : ''}`, {
      method: 'GET',
    });

    if (!res.ok) {
      console.warn(`Categories API returned status ${res.status}, using default categories.`);
      return {
        success: true,
        count: DEFAULT_CATEGORIES.length,
        categories: DEFAULT_CATEGORIES,
      };
    }

    const data = await res.json();
    if (data && data.success && Array.isArray(data.categories) && data.categories.length > 0) {
      return data;
    }

    return {
      success: true,
      count: DEFAULT_CATEGORIES.length,
      categories: DEFAULT_CATEGORIES,
    };
  } catch (err) {
    console.warn('API error in getCategoriesApi, using default categories:', err);
    return {
      success: true,
      count: DEFAULT_CATEGORIES.length,
      categories: DEFAULT_CATEGORIES,
    };
  }
}

/**
 * Create a new Category (Admin protected)
 */
export async function createCategoryApi(categoryData, token) {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    return await res.json();
  } catch (err) {
    console.error('API error in createCategoryApi:', err);
    return {
      success: false,
      message: 'Failed to connect to categories API.',
    };
  }
}

/**
 * Update an existing Category (Admin protected)
 */
export async function updateCategoryApi(id, categoryData, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    return await res.json();
  } catch (err) {
    console.error('API error in updateCategoryApi:', err);
    return {
      success: false,
      message: 'Failed to update category.',
    };
  }
}

/**
 * Delete a Category (Admin protected)
 */
export async function deleteCategoryApi(id, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.error('API error in deleteCategoryApi:', err);
    return {
      success: false,
      message: 'Failed to delete category.',
    };
  }
}

