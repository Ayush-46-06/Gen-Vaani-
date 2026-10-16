import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiKey, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiArrowLeft,
  FiInfo
} from 'react-icons/fi';
import navbarLogo from '../../assets/PNG/6.icon + Name Logo Transparent.png';
import brandIcon from '../../assets/PNG/8.icon Transparent.png';
import { registerAdminApi } from '../../services/adminApi';
import './AdminAuth.css';

const VALID_SECRET_KEYS = [
  'GENVAANI_ADMIN_2026',
  'GENVAANI_SECRET_KEY',
  'GENVAANI@2026',
  'ADMIN_SUPER_KEY'
];

export default function AdminRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    secretKey: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleFillDemoKey = () => {
    setFormData((prev) => ({ ...prev, secretKey: 'GENVAANI_ADMIN_2026' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, phone, password, secretKey } = formData;

    // Validations
    if (!name.trim()) {
      setError('Please provide your full legal name.');
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid administrative email address.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please provide a valid phone number (at least 10 digits).');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (!secretKey.trim()) {
      setError('A valid Admin Secret Key is required to authorize account creation.');
      return;
    }

    // Verify secret key
    const normalizedKey = secretKey.trim().toUpperCase();
    const isValidKey = VALID_SECRET_KEYS.includes(normalizedKey);

    if (!isValidKey) {
      setError('Invalid Admin Secret Key. Access denied for unauthorized personnel.');
      return;
    }

    setLoading(true);

    // Call backend API
    registerAdminApi({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      secretKey: secretKey.trim(),
    }).then((response) => {
      if (response && response.success) {
        // Also save to localStorage for client-side persistence
        try {
          const raw = localStorage.getItem('genvaani_admin_users');
          const existingUsers = raw ? JSON.parse(raw) : [];
          existingUsers.push({
            id: response.admin?.id || 'admin_' + Date.now(),
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password: password,
            role: 'Administrator',
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem('genvaani_admin_users', JSON.stringify(existingUsers));
        } catch (e) {
          console.warn('LocalStorage save skipped', e);
        }

        setSuccess(response.message || 'Administrator verified and registered! Redirecting to login...');
        setLoading(false);

        setTimeout(() => {
          navigate('/admin/login', {
            state: { registeredEmail: email.trim() },
            replace: true,
          });
        }, 1200);
      } else {
        setLoading(false);
        setError(response?.message || 'Admin registration failed. Please verify secret key and details.');
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

      <div className="admin-auth-container container-register">
        <div className="admin-auth-card">
          {/* Header */}
          <div className="admin-card-header">
            <Link to="/" className="admin-brand-header-logo" title="Back to Homepage">
              <img src={navbarLogo} alt="Gen-Vaani" className="admin-logo-image" />
            </Link>
            <div className="admin-brand-badge">
              <span className="admin-status-dot" />
              <span>Staff Verification Portal</span>
            </div>
            <h1>Create Admin Profile</h1>
            <p>Join the Gen-Vaani internal team workspace using your designated staff authorization key.</p>
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

          {/* Registration Form */}
          <form className="admin-form" onSubmit={handleSubmit} noValidate>
            {/* Name Field */}
            <div className="admin-field">
              <label className="admin-label" htmlFor="register-name">
                Full Name <i>*</i>
              </label>
              <div className="admin-input-wrap">
                <FiUser className="admin-input-icon" />
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  className="admin-input no-toggle"
                  placeholder="e.g. Vikram Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email and Phone Grid */}
            <div className="admin-form-row">
              {/* Email */}
              <div className="admin-field">
                <label className="admin-label" htmlFor="register-email">
                  Admin Email <i>*</i>
                </label>
                <div className="admin-input-wrap">
                  <FiMail className="admin-input-icon" />
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    className="admin-input no-toggle"
                    placeholder="name@genvaani.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="admin-field">
                <label className="admin-label" htmlFor="register-phone">
                  Phone Number <i>*</i>
                </label>
                <div className="admin-input-wrap">
                  <FiPhone className="admin-input-icon" />
                  <input
                    id="register-phone"
                    name="phone"
                    type="tel"
                    className="admin-input no-toggle"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="admin-field">
              <div className="admin-field-header">
                <label className="admin-label" htmlFor="register-password">
                  Password <i>*</i>
                </label>
              </div>
              <div className="admin-input-wrap">
                <FiLock className="admin-input-icon" />
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
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

            {/* Secret Key Field */}
            <div className="admin-field">
              <div className="admin-field-header">
                <label className="admin-label" htmlFor="register-secret-key">
                  Admin Secret Key <i>*</i>
                </label>
                <span className="admin-key-hint">Security Required</span>
              </div>
              <div className="admin-input-wrap">
                <FiKey className="admin-input-icon" />
                <input
                  id="register-secret-key"
                  name="secretKey"
                  type={showSecretKey ? 'text' : 'password'}
                  className="admin-input"
                  placeholder="Enter organization secret authorization key"
                  value={formData.secretKey}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="admin-toggle-pwd"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  aria-label={showSecretKey ? 'Hide secret key' : 'Show secret key'}
                >
                  {showSecretKey ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Secret Key Hint Chip */}
              
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
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Create Admin Account</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="admin-card-footer">
            <p className="admin-footer-text">
              Already registered as an administrator?
              <Link to="/admin/login" className="admin-switch-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Security Meta */}
        <div className="admin-security-meta">
          <span className="admin-status-dot" />
          <span>Role-Based Access Control</span>
          <span>·</span>
          <span>Gen-Vaani Authorized Only</span>
        </div>
      </div>
    </div>
  );
}
