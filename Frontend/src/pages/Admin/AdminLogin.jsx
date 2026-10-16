import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight, 
  FiShield, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiArrowLeft 
} from 'react-icons/fi';
import navbarLogo from '../../assets/PNG/6.icon + Name Logo Transparent.png';
import brandIcon from '../../assets/PNG/8.icon Transparent.png';
import { loginAdminApi } from '../../services/adminApi';
import './AdminAuth.css';

const DEFAULT_ADMIN = {
  email: 'admin@genvaani.com',
  password: 'admin@genvaani',
  name: 'Master Admin'
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if already authenticated or if redirected with notice
  useEffect(() => {
    if (location.state?.registeredEmail) {
      setEmail(location.state.registeredEmail);
      setSuccess('Account registered successfully! You can now log in.');
    } else if (location.state?.error) {
      setError(location.state.error);
    }

    // If already logged in, redirect straight to dashboard
    const token = localStorage.getItem('genvaani_admin_token') || sessionStorage.getItem('genvaani_admin_token');
    const rawAdmin = localStorage.getItem('genvaani_active_admin') || sessionStorage.getItem('genvaani_active_admin');
    if (token && rawAdmin) {
      try {
        JSON.parse(rawAdmin);
        navigate('/admin/dashboard', { replace: true });
      } catch (e) {
        // ignore and let user re-login
      }
    }
  }, [location.state, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password) {
      setError('Please provide both your administrator email and password.');
      return;
    }

    setLoading(true);

    // Call backend API
    loginAdminApi({
      email: email.trim(),
      password,
    }).then((response) => {
      if (response && response.success) {
        const adminData = response.admin;
        const sessionData = {
          name: adminData.name,
          email: adminData.email,
          phone: adminData.phone || '+91 98765 43210',
          role: adminData.role || 'Administrator',
          token: response.token,
          loginTime: new Date().toISOString(),
        };

        if (rememberMe) {
          localStorage.setItem('genvaani_active_admin', JSON.stringify(sessionData));
          localStorage.setItem('genvaani_admin_token', response.token);
        } else {
          sessionStorage.setItem('genvaani_active_admin', JSON.stringify(sessionData));
          sessionStorage.setItem('genvaani_admin_token', response.token);
        }

        setSuccess(response.message || `Welcome back, ${adminData.name}! Access granted.`);
        setLoading(false);

        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 1200);
      } else {
        // Fallback: check localStorage if backend gave error or offline
        let fallbackMatched = null;
        try {
          const raw = localStorage.getItem('genvaani_admin_users');
          if (raw) {
            const stored = JSON.parse(raw);
            fallbackMatched = stored.find(
              (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
            );
          }
        } catch (e) {
          console.warn('Fallback check error', e);
        }

        if (fallbackMatched) {
          const sessionData = {
            name: fallbackMatched.name,
            email: fallbackMatched.email,
            phone: fallbackMatched.phone || '+91 98765 43210',
            role: 'Administrator',
            token: 'gv_client_jwt_' + Math.random().toString(36).substring(2),
            loginTime: new Date().toISOString(),
          };
          localStorage.setItem('genvaani_active_admin', JSON.stringify(sessionData));
          setSuccess(`Welcome back, ${fallbackMatched.name}! Access granted.`);
          setLoading(false);
          setTimeout(() => {
            navigate('/admin/dashboard', { replace: true });
          }, 1200);
          return;
        }

        setLoading(false);
        setError(response?.message || 'Invalid administrator email or password. Please verify credentials.');
      }
    }).catch((err) => {
      console.error(err);
      setLoading(false);
      setError('Network error connecting to backend API.');
    });
  };

  return (
    <div className="admin-auth-page">
      {/* Background Decor */}
      <div className="admin-bg-grid" />
      <div className="admin-glow-cyan" />
      <div className="admin-glow-purple" />

      {/* Back to Home Link */}
      <div className="admin-top-nav">
        <Link to="/" className="admin-back-link">
          <FiArrowLeft /> Back to Gen-Vaani
        </Link>
      </div>

      <div className="admin-auth-container">
        <div className="admin-auth-card">
          {/* Header */}
          <div className="admin-card-header">
            <Link to="/" className="admin-brand-header-logo" title="Back to Homepage">
              <img src={navbarLogo} alt="Gen-Vaani" className="admin-logo-image" />
            </Link>
            {/* <div className="admin-brand-badge">
              <span className="admin-status-dot" />
              <span>Admin Management Portal</span>
            </div> */}
            <h1>Welcome Back</h1>
            <p>Sign in with your administrator credentials to manage projects, consultations, and agency analytics.</p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="admin-alert admin-alert-error" role="alert">
              <FiAlertCircle className="admin-alert-icon" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="admin-alert admin-alert-success" role="status">
              <FiCheckCircle className="admin-alert-icon" />
              <span>{success}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="admin-form" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="admin-field">
              <label className="admin-label" htmlFor="admin-email">
                Admin Email <i>*</i>
              </label>
              <div className="admin-input-wrap">
                <FiMail className="admin-input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  className="admin-input no-toggle"
                  placeholder="admin@genvaani.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="admin-field">
              <div className="admin-field-header">
                <label className="admin-label" htmlFor="admin-password">
                  Password <i>*</i>
                </label>
              </div>
              <div className="admin-input-wrap">
                <FiLock className="admin-input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="admin-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="admin-form-options">
              <label className="admin-checkbox-label">
                <input
                  type="checkbox"
                  className="admin-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this device</span>
              </label>
              <button
                type="button"
                className="admin-forgot-link"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                onClick={() => setError('Password reset instructions are managed via the Secret Key on the registration page or system owner.')}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="admin-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="admin-btn-spinner" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="admin-card-footer">
            <p className="admin-footer-text">
              Authorized staff without an account?
              <Link to="/admin/register" className="admin-switch-link">
                Register with Secret Key
              </Link>
            </p>
          </div>
        </div>

        {/* Security Meta */}
        {/* <div className="admin-security-meta">
          <span className="admin-status-dot" />
          <span>256-Bit Encrypted Admin Gateway</span>
          <span>·</span>
          <span>Gen-Vaani Core Security</span>
        </div> */}
      </div>
    </div>
  );
}
