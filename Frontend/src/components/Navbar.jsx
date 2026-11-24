import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getServicesApi } from '../services/serviceApi';
import {
  getCategoriesApi,
  DEFAULT_CATEGORIES,
} from '../services/categoryApi';

import './Navbar.css';
import logo from '../assets/PNG/genvaani-navbar-logo-clean.webp';

const DEFAULT_SERVICES = [
  {
    slug: 'ui-ux-design',
    title: 'UI and UX Design',
    category: 'Design & Creative',
    description: 'Beautiful and engaging interfaces that solve real user problems.',
  },
  {
    slug: 'branding-identity',
    title: 'Branding & Identity',
    category: 'Design & Creative',
    description: 'Logo systems, brand books, typography and visual identity.',
  },
  {
    slug: 'creative-design',
    title: 'Creative Design & Media',
    category: 'Design & Creative',
    description: 'Creative graphics, illustrations and marketing visuals.',
  },
  {
    slug: 'website-development',
    title: 'Website Development',
    category: 'Development & Products',
    description: 'High-performance websites built to grow your business.',
  },
  {
    slug: 'application-development',
    title: 'Application Development',
    category: 'Development & Products',
    description: 'Modern web and mobile applications for your customers.',
  },
  {
    slug: 'custom-software',
    title: 'Custom Software & APIs',
    category: 'Development & Products',
    description: 'Scalable software, APIs and intelligent integrations.',
  },
  {
    slug: 'google-ads-meta-ads',
    title: 'Google Ads & Meta Ads',
    category: 'Marketing & Growth',
    description: 'Performance campaigns designed to maximize your ROI.',
  },
  {
    slug: 'local-seo',
    title: 'Local SEO & Business Profile',
    category: 'Marketing & Growth',
    description: 'Improve your search rankings and local visibility.',
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    category: 'Marketing & Growth',
    description: 'Content, social media and growth strategies for your brand.',
  },
];

const ArrowIcon = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path d="M5 12H19M12 5L19 12L12 19" />
  </svg>
);

const ChevronIcon = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path d="M6 9L12 15L18 9" />
  </svg>
);

const getCategoryMeta = (column) => {
  const name = String(column?.name || '').toLowerCase();

  if (
    name.includes('design') ||
    name.includes('creative') ||
    name.includes('brand')
  ) {
    return {
      tagline: column.tagline || 'Build memorable brand experiences',
      badgeClass: 'badge-purple',
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      ),
    };
  }

  if (
    name.includes('dev') ||
    name.includes('product') ||
    name.includes('software') ||
    name.includes('web') ||
    name.includes('app')
  ) {
    return {
      tagline: column.tagline || 'Build scalable and reliable products',
      badgeClass: 'badge-blue',
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    };
  }

  if (
    name.includes('marketing') ||
    name.includes('growth') ||
    name.includes('ads') ||
    name.includes('seo')
  ) {
    return {
      tagline: column.tagline || 'Drive visibility, traffic and business growth',
      badgeClass: 'badge-green',
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    };
  }

  return {
    tagline: column.tagline || 'Custom solutions and expertise',
    badgeClass: 'badge-violet',
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  };
};

const Navbar = () => {
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const navbarRef = useRef(null);
  const servicesButtonRef = useRef(null);
  const megaMenuRef = useRef(null);
  const [notchLeft, setNotchLeft] = useState(null);

  const [categories, setCategories] = useState(
    DEFAULT_CATEGORIES || []
  );

  const [services, setServices] = useState(DEFAULT_SERVICES);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Dynamically align pointer notch under Services button
  useEffect(() => {
    const updateNotch = () => {
      if (servicesButtonRef.current && megaMenuRef.current) {
        const btnRect = servicesButtonRef.current.getBoundingClientRect();
        const menuRect = megaMenuRef.current.getBoundingClientRect();
        const btnCenter = btnRect.left + btnRect.width / 2;
        const calculatedNotch = btnCenter - menuRect.left;
        if (calculatedNotch > 20 && calculatedNotch < menuRect.width - 20) {
          setNotchLeft(calculatedNotch);
        }
      }
    };

    if (servicesOpen) {
      updateNotch();
      const timer = setTimeout(updateNotch, 50);
      window.addEventListener('resize', updateNotch);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateNotch);
      };
    }
  }, [servicesOpen]);

  // Fetch categories and services
  useEffect(() => {
    let mounted = true;

    Promise.all([
      getCategoriesApi(),
      getServicesApi(),
    ])
      .then(([categoryRes, serviceRes]) => {
        if (!mounted) return;

        if (
          categoryRes?.success &&
          Array.isArray(categoryRes.categories) &&
          categoryRes.categories.length
        ) {
          setCategories(
            categoryRes.categories.filter(
              (category) => category.isActive !== false
            )
          );
        }

        if (
          serviceRes?.success &&
          Array.isArray(serviceRes.services) &&
          serviceRes.services.length
        ) {
          setServices(serviceRes.services);
        }
      })
      .catch((error) => {
        console.warn('Navbar data loading error:', error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setServicesOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  // Close menus when clicking outside the navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setServicesOpen(false);
        setMobileOpen(false);
        setMobileServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Prevent background scrolling on mobile
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        setMobileOpen(false);
        setMobileServicesOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Organize services into categories
  const serviceColumns = useMemo(() => {
    const activeCategories = (categories || []).filter(
      (category) => category?.isActive !== false
    );

    const columns = activeCategories.map((category) => {
      const categoryName = (category.name || '')
        .trim()
        .toLowerCase();

      return {
        id:
          category._id ||
          category.id ||
          category.slug ||
          category.name,

        name: category.name,
        tagline: category.tagline,
        icon: category.icon || category.name,

        services: services.filter(
          (service) =>
            service.isActive !== false &&
            (service.category || '').trim().toLowerCase() ===
            categoryName
        ),
      };
    });

    // Put unmatched services into a suitable category
    const assignedSlugs = new Set(
      columns.flatMap((column) =>
        column.services.map((service) => service.slug)
      )
    );

    const unmatched = services.filter(
      (service) =>
        service.isActive !== false &&
        !assignedSlugs.has(service.slug)
    );

    unmatched.forEach((service) => {
      const value = `${service.slug || ''} ${service.title || ''
        }`.toLowerCase();

      const target =
        columns.find((column) => {
          const categoryName = column.name.toLowerCase();

          if (
            (value.includes('design') ||
              value.includes('brand') ||
              value.includes('creative')) &&
            categoryName.includes('design')
          ) {
            return true;
          }

          if (
            (value.includes('web') ||
              value.includes('app') ||
              value.includes('software')) &&
            categoryName.includes('development')
          ) {
            return true;
          }

          if (
            (value.includes('seo') ||
              value.includes('market') ||
              value.includes('ads')) &&
            categoryName.includes('marketing')
          ) {
            return true;
          }

          return false;
        }) || columns[0];

      if (target) {
        target.services.push(service);
      }
    });

    return columns;
  }, [categories, services]);

  const closeAllMenus = () => {
    setServicesOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  const closeMobileMenu = closeAllMenus;

  const handleNavClick = (path, e) => {
    if (e) {
      e.preventDefault();
    }
    closeAllMenus();

    try {
      const targetUrl = new URL(path, window.location.origin);
      const isCurrentPath = window.location.pathname === targetUrl.pathname;

      if (isCurrentPath && !targetUrl.hash) {
        window.location.reload();
      } else if (isCurrentPath && targetUrl.hash) {
        window.location.href = path;
        window.location.reload();
      } else {
        window.location.href = path;
      }
    } catch {
      window.location.href = path;
    }
  };

  const isActive = (path) => location.pathname === path;

  const isServicesActive =
    location.pathname.startsWith('/services');

  return (
    <>
      {/* =====================================
          MAIN NAVBAR
      ===================================== */}

      <nav
        ref={navbarRef}
        className={`gvn-navbar ${scrolled ? 'gvn-navbar-scrolled' : ''
          }`}
        aria-label="Main navigation"
      >
        {/* LOGO */}

        <div className="gvn-logo">
          <a
            href="/"
            onClick={(e) => handleNavClick('/', e)}
            className="gvn-logo-link"
          >
            <img src={logo} alt="GenVaani" className="gvn-logo-img" />
            <span className="gvn-tagline">Your Voice, Always Heard</span>
          </a>
        </div>

        {/* DESKTOP NAVIGATION */}

        <ul className="gvn-nav-links">

          <li>
            <a
              href="/"
              className={`gvn-nav-link ${isActive('/') ? 'active' : ''
                }`}
              onClick={(e) => handleNavClick('/', e)}
            >
              Home
            </a>
          </li>

          {/* SERVICES */}

          <li
            className={`gvn-services-wrapper ${servicesOpen ? 'open' : ''
              }`}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              ref={servicesButtonRef}
              type="button"
              className={`gvn-nav-link gvn-services-button ${isServicesActive ? 'active' : ''
                } ${servicesOpen ? 'menu-open' : ''}`}
              aria-expanded={servicesOpen}
              onClick={() =>
                setServicesOpen((previous) => !previous)
              }
            >
              Services

              <ChevronIcon
                className={`gvn-chevron ${servicesOpen ? 'rotated' : ''
                  }`}
              />
            </button>

            {/* MEGA MENU */}
            <div
              ref={megaMenuRef}
              className="gvn-mega-menu"
              style={{
                width:
                  serviceColumns.length >= 4
                    ? 'min(1240px, calc(100vw - 32px))'
                    : 'min(1080px, calc(100vw - 32px))',
              }}
            >
              {/* TOP ARROW NOTCH: Points directly up to Services link */}
              <div
                className="gvn-mega-menu-notch"
                style={notchLeft ? { left: `${notchLeft}px` } : undefined}
                aria-hidden="true"
              />

              {/* LEFT FEATURE BANNER CARD */}
              <div className="gvn-mega-banner">
                <div className="gvn-banner-content">
                  <div className="gvn-banner-eyebrow">
                    <span>OUR SERVICES</span>
                    {/* <span className="gvn-eyebrow-dash">—</span> */}
                  </div>
                  <h3 className="gvn-banner-title">
                    End-to-End Digital Solutions
                  </h3>
                  <p className="gvn-banner-desc">
                    From design to development and growth everything your business needs to scale.
                  </p>
                </div>

                {/* Bottom decorative wave / aura graphic */}
                <div className="gvn-banner-art" aria-hidden="true">
                  <svg
                    viewBox="0 0 280 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="gvn-banner-wave-svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 60C45 20 95 90 155 55C215 20 245 80 280 40V120H0V60Z"
                      fill="url(#gvnWaveGrad1)"
                      opacity="0.65"
                    />
                    <path
                      d="M0 78C55 45 105 105 165 68C225 32 255 92 280 62V120H0V78Z"
                      fill="url(#gvnWaveGrad2)"
                      opacity="0.88"
                    />
                    <defs>
                      <linearGradient id="gvnWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.45" />
                        <stop offset="50%" stopColor="#818cf8" stopOpacity="0.65" />
                        <stop offset="100%" stopColor="#c084fc" stopOpacity="0.35" />
                      </linearGradient>
                      <linearGradient id="gvnWaveGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.75" />
                        <stop offset="60%" stopColor="#818cf8" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#e879f9" stopOpacity="0.55" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* RIGHT CATEGORY COLUMNS */}
              <div className="gvn-mega-categories">
                {serviceColumns.map((column) => {
                  const meta = getCategoryMeta(column);
                  return (
                    <div
                      className="gvn-category-col"
                      key={column.id}
                    >
                      {/* CATEGORY HEADER WITH ICON BADGE, TITLE & TAGLINE */}
                      <div className="gvn-col-header">
                        <div className={`gvn-col-badge ${meta.badgeClass}`}>
                          {meta.icon}
                        </div>
                        <h4 className="gvn-col-title">
                          {column.name}
                        </h4>
                        <p className="gvn-col-tagline">
                          {meta.tagline}
                        </p>
                      </div>

                      {/* SERVICES LIST WITH CHEVRON ON EACH ROW */}
                      <div className="gvn-service-items">
                        {column.services.length > 0 ? (
                          column.services.map((service, serviceIndex) => (
                            <a
                              key={
                                service.slug ||
                                service._id ||
                                serviceIndex
                              }
                              href={`/services/${service.slug}`}
                              className="gvn-service-row"
                              onClick={(e) =>
                                handleNavClick(`/services/${service.slug}`, e)
                              }
                            >
                              <span className="gvn-service-name">
                                {service.title}
                              </span>
                              <span className="gvn-service-arrow" aria-hidden="true">
                                ›
                              </span>
                            </a>
                          ))
                        ) : (
                          <span className="gvn-empty-service">
                            Coming soon
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </li>

          <li>
            <a
              href="/portfolio"
              className={`gvn-nav-link ${isActive('/portfolio') ? 'active' : ''
                }`}
              onClick={(e) => handleNavClick('/portfolio', e)}
            >
              Portfolio
            </a>
          </li>

          <li>
            <a
              href="/pricing"
              className={`gvn-nav-link ${isActive('/pricing') ? 'active' : ''
                }`}
              onClick={(e) => handleNavClick('/pricing', e)}
            >
              Pricing
            </a>
          </li>

          <li>
            <a
              href="/about"
              className={`gvn-nav-link ${isActive('/about') ? 'active' : ''
                }`}
              onClick={(e) => handleNavClick('/about', e)}
            >
              About Us
            </a>
          </li>

        </ul>

        {/* DESKTOP CTA */}

        <div className="gvn-desktop-cta">

          <a
            href="/contact#booking-widget"
            className="gvn-book-button"
            onClick={(e) => handleNavClick('/contact#booking-widget', e)}
          >
            <span>Book a Call</span>
            <ArrowIcon />
          </a>

        </div>

        {/* MOBILE HAMBURGER */}

        <button
          type="button"
          className={`gvn-hamburger ${mobileOpen ? 'active' : ''
            }`}
          onClick={() => setMobileOpen((previous) => !previous)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>

      </nav>

      {/* =====================================
          MOBILE MENU BACKDROP
      ===================================== */}

      <button
        type="button"
        className={`gvn-mobile-backdrop ${mobileOpen ? 'visible' : ''
          }`}
        onClick={closeMobileMenu}
        aria-label="Close menu"
        tabIndex={mobileOpen ? 0 : -1}
      />

      {/* =====================================
          MOBILE MENU
      ===================================== */}

      <div
        className={`gvn-mobile-menu ${mobileOpen ? 'visible' : ''
          }`}
        aria-hidden={!mobileOpen}
      >

        <div className="gvn-mobile-header">
          <span>EXPLORE GENV AANI</span>
          <span className="gvn-mobile-status" />
        </div>

        <div className="gvn-mobile-links">

          <a
            href="/"
            className={`gvn-mobile-link ${isActive('/') ? 'active' : ''
              }`}
            onClick={(e) => handleNavClick('/', e)}
          >
            Home
          </a>

          {/* MOBILE SERVICES */}

          <div className="gvn-mobile-services">

            <button
              type="button"
              className={`gvn-mobile-link ${isServicesActive ? 'active' : ''
                }`}
              onClick={() =>
                setMobileServicesOpen((previous) => !previous)
              }
              aria-expanded={mobileServicesOpen}
            >
              <span>Services</span>

              <ChevronIcon
                className={`gvn-chevron ${mobileServicesOpen ? 'rotated' : ''
                  }`}
              />
            </button>

            <div
              className={`gvn-mobile-service-content ${mobileServicesOpen ? 'expanded' : ''
                }`}
            >

              <div className="gvn-mobile-service-inner">

                {serviceColumns.map((column) => {
                  const meta = getCategoryMeta(column);
                  return (
                    <div
                      className="gvn-mobile-category"
                      key={column.id}
                    >

                      <div className="gvn-mobile-category-title">
                        <div className={`gvn-category-icon ${meta.badgeClass}`}>
                          {meta.icon}
                        </div>

                        <span>{column.name}</span>
                      </div>

                      {column.services.map((service, index) => (
                        <a
                          key={service.slug || index}
                          href={`/services/${service.slug}`}
                          className="gvn-mobile-service-link"
                          onClick={(e) =>
                            handleNavClick(`/services/${service.slug}`, e)
                          }
                        >
                          <span>{service.title}</span>
                          <span className="gvn-mobile-arrow" aria-hidden="true">›</span>
                        </a>
                      ))}

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

          <a
            href="/portfolio"
            className={`gvn-mobile-link ${isActive('/portfolio') ? 'active' : ''
              }`}
            onClick={(e) => handleNavClick('/portfolio', e)}
          >
            Portfolio
          </a>

          <a
            href="/pricing"
            className={`gvn-mobile-link ${isActive('/pricing') ? 'active' : ''
              }`}
            onClick={(e) => handleNavClick('/pricing', e)}
          >
            Pricing
          </a>

          <a
            href="/about"
            className={`gvn-mobile-link ${isActive('/about') ? 'active' : ''
              }`}
            onClick={(e) => handleNavClick('/about', e)}
          >
            About Us
          </a>

        </div>

        {/* MOBILE CTA */}

        <div className="gvn-mobile-cta">

          <a
            href="/contact#booking-widget"
            className="gvn-book-button"
            onClick={(e) => handleNavClick('/contact#booking-widget', e)}
          >
            <span>Book a Call</span>
            <ArrowIcon />
          </a>

          <p>
            Ready to build something extraordinary?
          </p>

        </div>

      </div>
    </>
  );
};

export default Navbar;