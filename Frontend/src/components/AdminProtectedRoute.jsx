import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminProfileApi } from '../services/adminApi';
import navbarLogo from '../assets/PNG/6.icon + Name Logo Transparent.png';

/**
 * AdminProtectedRoute
 * Ensures only authenticated administrators with a valid session can view the dashboard.
 * Unauthenticated users are immediately redirected to /admin/login.
 */
export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem('genvaani_admin_token') || sessionStorage.getItem('genvaani_admin_token');
    let rawAdmin = localStorage.getItem('genvaani_active_admin') || sessionStorage.getItem('genvaani_active_admin');

    // If no token or no admin session exists in storage, reject immediately
    if (!token || !rawAdmin) {
      setIsAuthenticated(false);
      setChecking(false);
      return;
    }

    // Parse the local admin session
    let parsedAdmin = null;
    try {
      parsedAdmin = JSON.parse(rawAdmin);
    } catch (e) {
      localStorage.removeItem('genvaani_admin_token');
      localStorage.removeItem('genvaani_active_admin');
      sessionStorage.removeItem('genvaani_admin_token');
      sessionStorage.removeItem('genvaani_active_admin');
      setIsAuthenticated(false);
      setChecking(false);
      return;
    }

    // Verify token with backend
    getAdminProfileApi(token)
      .then((res) => {
        if (res && res.success && res.admin) {
          setIsAuthenticated(true);
        } else if (res && res.message && (res.message.includes('expired') || res.message.includes('Invalid') || res.message.includes('Not authorized'))) {
          // Token is explicitly expired or invalid according to backend
          localStorage.removeItem('genvaani_admin_token');
          localStorage.removeItem('genvaani_active_admin');
          sessionStorage.removeItem('genvaani_admin_token');
          sessionStorage.removeItem('genvaani_active_admin');
          setIsAuthenticated(false);
        } else {
          // If backend offline or network glitch, honor existing valid local token
          setIsAuthenticated(Boolean(parsedAdmin && token));
        }
      })
      .catch(() => {
        // Fallback for offline dev
        setIsAuthenticated(Boolean(parsedAdmin && token));
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 10% 12%, rgba(0, 203, 240, 0.1) 0%, transparent 40%), linear-gradient(135deg, #f0f7fd 0%, #ffffff 50%, #f4fafd 100%)',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}>
        <img src={navbarLogo} alt="Gen-Vaani" style={{ height: 46, marginBottom: 22, objectFit: 'contain' }} />
        <div style={{
          width: 36,
          height: 36,
          border: '3px solid rgba(0, 39, 138, 0.12)',
          borderTopColor: '#00cbf0',
          borderRadius: '50%',
          animation: 'protectedSpin 0.75s linear infinite',
          marginBottom: 16
        }} />
        <p style={{ color: '#00278a', fontSize: '0.88rem', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
          Verifying Authorized Administrator Session...
        </p>
        <style>{`
          @keyframes protectedSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/admin/login" 
        state={{ 
          from: location.pathname, 
          error: 'Access restricted: Please log in with administrator credentials.' 
        }} 
        replace 
      />
    );
  }

  return children;
}
