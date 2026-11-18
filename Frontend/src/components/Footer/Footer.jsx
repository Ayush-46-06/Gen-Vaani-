import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiMail, FiPhone, FiArrowRight } from 'react-icons/fi';
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa6';
import { getServicesApi } from '../../services/serviceApi';
import './Footer.css';
import logo from '../../assets/PNG/genvaani-footer-logo-white.png';

const DEFAULT_FOOTER_SERVICES = [
  { slug: 'website-development', title: 'Website Development' },
  { slug: 'application-development', title: 'Application Development' },
  { slug: 'google-ads-meta-ads', title: 'Google Ads & Meta Ads' },
  { slug: 'custom-software', title: 'Custom Software & APIs' },
  { slug: 'ui-ux-design', title: 'UI and UX Design' },
  { slug: 'branding-identity', title: 'Branding & Identity' },
  { slug: 'local-seo', title: 'Local SEO & Business Profile' },
  { slug: 'creative-design', title: 'Creative Design & Media' },
  { slug: 'digital-marketing', title: 'Digital Marketing' },
];

const QUICK_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Pricing Packages', path: '/pricing' },
  // { name: 'Contact Us', path: '/contact' },
  { name: 'Book a Call', path: '/contact?tab=calendar' },
  // { name: 'Admin Console', path: '/admin/login' },
];

const Footer = () => {
  const [services, setServices] = useState(DEFAULT_FOOTER_SERVICES);

  useEffect(() => {
    let isMounted = true;
    getServicesApi().then((res) => {
      if (isMounted && res && res.success && Array.isArray(res.services) && res.services.length > 0) {
        setServices(res.services);
      }
    }).catch((err) => console.warn('Footer services fetch error:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Split services into columns of at most 5 items each
  const serviceChunks = useMemo(() => {
    const list = services && services.length > 0 ? services : DEFAULT_FOOTER_SERVICES;
    const chunkSize = 5;
    const chunks = [];
    for (let i = 0; i < list.length; i += chunkSize) {
      chunks.push(list.slice(i, i + chunkSize));
    }
    return chunks.length > 0 ? chunks : [[]];
  }, [services]);

  return (
    <footer className="footer-wrapper">
      {/* Top Wave Divider */}
      <div className="wave-divider wave-top">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#020B2D" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="footer-container">
        <div className="footer-top">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo-link">
              <img src={logo} alt="GenVaani Logo" className="footer-logo" />
              <span className="footer-tagline">YOUR VOICE, Always Heard</span>
            </Link>
            <p className="footer-description">
              Transforming businesses with innovative solutions since 2026. We help companies scale efficiently and sustainably with high-performance digital products.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter / X" aria-label="Twitter / X">
                <FaXTwitter />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* All Webpages Made (Quick Links) */}
          <div className="footer-col links-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              {QUICK_LINKS.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="footer-link">
                    <FiArrowRight className="link-bullet-arrow" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Services Dynamic List: Chunked into columns of at most 5 items each */}
          <div className={`footer-col services-col ${serviceChunks.length > 1 ? 'services-col-multi' : ''}`}>
            <h4 className="footer-heading">Our Services</h4>
            <div className="footer-services-grid">
              {serviceChunks.map((chunk, chunkIdx) => (
                <ul key={chunkIdx} className="footer-links-list">
                  {chunk.map((svc) => (
                    <li key={svc._id || svc.id || svc.slug}>
                      <Link to={`/services/${svc.slug}`} className="footer-link">
                        <FiArrowRight className="link-bullet-arrow" />
                        <span>{svc.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Get In Touch</h4>
            <a
              href="https://maps.google.com/?q=123+Business+Avenue,+New+York,+NY+10001"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item contact-item-link"
              title="Open office in Google Maps"
              aria-label="Open our location at 123 Business Avenue, New York on Google Maps"
            >
              <span className="contact-icon-box" aria-hidden="true">
                <FiMapPin />
              </span>
              <p>123 Business Avenue<br />New York, NY 10001</p>
            </a>
            <a
              href="mailto:info@genvaani.com"
              className="contact-item contact-item-link"
              title="Send email to info@genvaani.com"
              aria-label="Send email to info@genvaani.com"
            >
              <span className="contact-icon-box" aria-hidden="true">
                <FiMail />
              </span>
              <p>info@genvaani.com</p>
            </a>
            <a
              href="tel:+12125551234"
              className="contact-item contact-item-link"
              title="Call +1 (212) 555-1234"
              aria-label="Call +1 (212) 555-1234"
            >
              <span className="contact-icon-box" aria-hidden="true">
                <FiPhone />
              </span>
              <p>+1 (212) 555-1234</p>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; 2026 GenVaani. All rights reserved.</p>
          <div className="legal-links">
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
