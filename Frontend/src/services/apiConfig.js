/**
 * Gen-Vaani Unified API Endpoint Configuration
 *
 * 1. Unified Vercel Deployment (Default):
 *    Frontend & Backend live on the same domain, so BASE_API defaults to '/api'.
 * 
 * 2. Local Development:
 *    Vite proxy in vite.config.js forwards '/api' requests to 'http://localhost:5000'.
 *
 * 3. Separate Deployment (Optional):
 *    If Frontend and Backend are hosted on separate domains/Vercel projects,
 *    set VITE_API_URL in your Vercel Environment Variables (e.g. https://your-backend.vercel.app).
 */

const customApiUrl = import.meta.env.VITE_API_URL;

export const BASE_API = customApiUrl
  ? `${customApiUrl.replace(/\/$/, '')}/api`
  : '/api';
