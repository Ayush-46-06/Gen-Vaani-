import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getServicesApi } from '../services/serviceApi';
import './Navbar.css';
import logo from '../assets/PNG/6.icon + Name Logo Transparent.png';

const DEFAULT_NAV_SERVICES = [
  { slug: 'website-development', title: 'Website Development', description: 'Custom, responsive websites to drive conversions' },
  { slug: 'application-development', title: 'Application Development', description: 'Robust mobile and web applications' },
  { slug: 'google-ads-meta-ads', title: 'Google Ads & Meta Ads', description: 'Data-driven advertising campaigns' },
  { slug: 'ui-ux-design', title: 'UI and UX Design', description: 'Intuitive and beautiful user experiences' },
  { slug: 'local-seo', title: 'Local SEO', description: 'Dominate local search rankings' },
  { slug: 'digital-marketing', title: 'Digital Marketing', description: 'Comprehensive growth strategies' },
];

// Responsive floating navbar component with mobile hamburger drawer
const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [navServices, setNavServices] = useState(DEFAULT_NAV_SERVICES);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    getServicesApi().then((res) => {
      if (isMounted && res && res.success && Array.isArray(res.services) && res.services.length > 0) {
        setNavServices(res.services);
      }
    }).catch((err) => console.warn('Navbar services fetch error:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Automatically close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isServicesActive = location.pathname.startsWith('/service');

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <>
      <nav className={`navbar-container ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-logo-wrapper">
          <Link to="/" onClick={closeMobileMenu} aria-label="GenVaani Home">
            <img src={logo} alt="GenVaani Logo" className="navbar-logo" />
          </Link>
        </div>

        {/* Desktop Navigation List */}
        <ul className="navbar-list">
          <li className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
          </li>
          <li
            className={`navbar-item has-dropdown ${isServicesActive ? 'active' : ''}`}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <span>Services</span>
            <svg className={`dropdown-arrow ${dropdownOpen ? 'rotated' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>

            {/* Mega Menu Dropdown */}
            <div className="mega-menu">
              <div className="mega-menu-grid">
                {navServices.map((svc) => (
                  <Link
                    key={svc.slug || svc._id || svc.id}
                    to={`/services/${svc.slug}`}
                    className="mega-item"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <h4>{svc.title}</h4>
                    <p>{svc.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </li>
          <li className={`navbar-item ${location.pathname === '/portfolio' ? 'active' : ''}`}>
            <Link to="/portfolio" style={{ textDecoration: 'none', color: 'inherit' }}>Portfolio</Link>
          </li>
          <li className={`navbar-item ${location.pathname === '/pricing' ? 'active' : ''}`}>
            <Link to="/pricing" style={{ textDecoration: 'none', color: 'inherit' }}>Pricing</Link>
          </li>
          <li className={`navbar-item ${location.pathname === '/about' ? 'active' : ''}`}>
            <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About Us</Link>
          </li>
        </ul>

        {/* Desktop CTA */}
        <div className="navbar-cta-wrapper">
          <Link to="/contact" className="navbar-cta" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            Book a Call
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className={`navbar-hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          <span className="hamburger-bar bar-1"></span>
          <span className="hamburger-bar bar-2"></span>
          <span className="hamburger-bar bar-3"></span>
        </button>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        className={`navbar-mobile-backdrop ${mobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Dropdown Panel */}
      <div className={`navbar-mobile-panel ${mobileMenuOpen ? 'open' : ''}`} aria-hidden={!mobileMenuOpen}>
        <div className="navbar-mobile-inner">
          <ul className="navbar-mobile-list">
            <li className="navbar-mobile-item">
              <Link
                to="/"
                className={`navbar-mobile-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span>Home</span>
              </Link>
            </li>

            {/* Mobile Services Accordion */}
            <li className="navbar-mobile-item mobile-services-item">
              <button
                type="button"
                className={`navbar-mobile-link services-toggle-btn ${isServicesActive ? 'active' : ''}`}
                onClick={() => setMobileServicesOpen((prev) => !prev)}
                aria-expanded={mobileServicesOpen}
              >
                <span>Services</span>
                <svg
                  className={`mobile-chevron ${mobileServicesOpen ? 'rotated' : ''}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div className={`mobile-services-accordion ${mobileServicesOpen ? 'expanded' : ''}`}>
                <div className="mobile-services-list">
                  {navServices.map((svc) => (
                    <Link
                      key={svc.slug || svc._id || svc.id}
                      to={`/services/${svc.slug}`}
                      className="mobile-service-subitem"
                      onClick={closeMobileMenu}
                    >
                      <div className="mobile-service-dot"></div>
                      <div className="mobile-service-info">
                        <span className="mobile-service-title">{svc.title}</span>
                        {svc.description && (
                          <span className="mobile-service-desc">{svc.description}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            <li className="navbar-mobile-item">
              <Link
                to="/portfolio"
                className={`navbar-mobile-link ${location.pathname === '/portfolio' ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span>Portfolio</span>
              </Link>
            </li>

            <li className="navbar-mobile-item">
              <Link
                to="/pricing"
                className={`navbar-mobile-link ${location.pathname === '/pricing' ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span>Pricing</span>
              </Link>
            </li>

            <li className="navbar-mobile-item">
              <Link
                to="/about"
                className={`navbar-mobile-link ${location.pathname === '/about' ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span>About Us</span>
              </Link>
            </li>
          </ul>

          {/* Mobile Bottom CTA Section */}
          <div className="navbar-mobile-cta-section">
            <Link to="/contact" className="navbar-mobile-cta-btn" onClick={closeMobileMenu}>
              <span>Book a Call</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <div className="navbar-mobile-footer-tag">
              <p>Ready to build something extraordinary?</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
