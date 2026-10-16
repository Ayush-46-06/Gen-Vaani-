import React from 'react';
import './MeetFounders.css';
import { FiMail, FiGlobe, FiPhone, FiArrowUpRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MeetFounders = () => {
  const founders = [
    {
      id: 1,
      name: 'Aarav Sharma',
      role: 'Co-Founder & CEO',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      bio: 'Visionary strategist leading GenVaani’s growth, brand direction, and digital innovation.',
      cardClass: 'badge-card-one'
    },
    {
      id: 2,
      name: 'Rohan Mehta',
      role: 'Co-Founder & CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      bio: 'Tech architect heading engineering, scalable web architectures, and AI solutions.',
      cardClass: 'badge-card-two'
    }
  ];

  return (
    <section className="meet-founders-section">
      {/* Top Wave transition from Mission Section (dark) to Meet Founders (white) */}
      <div className="wave-divider wave-top">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>
      {/* Decorative Crosshatch Sketch - Top Right */}
      <svg className="doodle-crosshatch doodle-top-right" viewBox="0 0 120 120" fill="none">
        <line x1="20" y1="10" x2="110" y2="100" stroke="#6842c2" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 1" />
        <line x1="45" y1="5" x2="115" y2="75" stroke="#6842c2" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="10" y1="40" x2="80" y2="110" stroke="#6842c2" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="90" y1="10" x2="10" y2="90" stroke="#6842c2" strokeWidth="3" strokeLinecap="round" />
        <line x1="110" y1="35" x2="35" y2="110" stroke="#6842c2" strokeWidth="3.5" strokeLinecap="round" />
      </svg>

      {/* Decorative Crosshatch Sketch - Bottom Left */}
      <svg className="doodle-crosshatch doodle-bottom-left" viewBox="0 0 140 140" fill="none">
        <line x1="10" y1="30" x2="110" y2="130" stroke="#6842c2" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="30" y1="10" x2="130" y2="110" stroke="#6842c2" strokeWidth="3" strokeLinecap="round" />
        <line x1="100" y1="15" x2="15" y2="100" stroke="#6842c2" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="125" y1="40" x2="40" y2="125" stroke="#6842c2" strokeWidth="3" strokeLinecap="round" />
        <line x1="80" y1="5" x2="5" y2="80" stroke="#6842c2" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      {/* Decorative Hanging Earphones Sketch / Graphic */}
      <div className="doodle-earphones">
        <svg viewBox="0 0 160 220" fill="none" className="earphones-svg">
          {/* Left Wire */}
          <path d="M 40 10 Q 30 70 55 120 Q 75 160 45 200" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
          {/* Right Wire */}
          <path d="M 120 10 Q 135 60 100 110 Q 75 150 95 190" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
          {/* Left Earbud */}
          <ellipse cx="40" cy="20" rx="9" ry="14" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
          <path d="M 36 28 L 40 46" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
          {/* Right Earbud */}
          <ellipse cx="120" cy="18" rx="9" ry="14" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
          <path d="M 124 26 L 120 44" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="meet-founders-container">
        {/* Left Column: Two Hanging Founder Lanyard ID Badges */}
        <div className="founders-badges-wrapper">
          {founders.map((founder) => (
            <div key={founder.id} className={`lanyard-badge-unit ${founder.cardClass}`}>
              {/* Lanyard Top Strap & Clip */}
              <div className="badge-lanyard-strap">
                <div className="lanyard-ribbon"></div>
                <div className="lanyard-black-clip">
                  <div className="clip-slot"></div>
                </div>
              </div>

              {/* ID Badge Plastic Holder */}
              <div className="id-badge-holder">
                {/* Punch eyelet holes at the top of clear plastic holder */}
                <div className="badge-punches">
                  <span className="punch-hole"></span>
                  <span className="punch-oval-slot"></span>
                  <span className="punch-hole"></span>
                </div>

                {/* Inner ID Card Body */}
                <div className="badge-inner-card">
                  {/* Founder Photo */}
                  <div className="badge-photo-wrapper">
                    <img 
                      src={founder.image} 
                      alt={founder.name} 
                      className="badge-founder-photo"
                      loading="lazy"
                    />
                  </div>

                  {/* Name Tag (Purple Ribbon Banner) */}
                  <div className="badge-name-banner">
                    <span className="badge-founder-name">{founder.name}</span>
                  </div>

                  {/* Title / Role Bar (White strip with purple text) */}
                  <div className="badge-role-strip">
                    <span className="badge-founder-role">{founder.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Hand-Drawn Smiley Doodle */}
          <div className="doodle-smiley-wrapper">
            <svg viewBox="0 0 100 100" className="smiley-svg">
              <path 
                d="M 25,50 C 22,25 78,22 75,50 C 72,78 28,75 25,50 Z" 
                fill="none" 
                stroke="#6842c2" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeLinejoin="round" 
              />
              {/* Eyes */}
              <circle cx="40" cy="42" r="3.5" fill="#6842c2" />
              <circle cx="62" cy="42" r="3.5" fill="#6842c2" />
              {/* Smile */}
              <path 
                d="M 38,58 Q 50,70 64,57" 
                fill="none" 
                stroke="#6842c2" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />
            </svg>
          </div>
        </div>

        {/* Right Column: Heading, Bio & Contact Details */}
        <div className="founders-content-wrapper">
          {/* Pill Badge */}
          <div className="leadership-pill">
            <span>Dynamic Leadership</span>
          </div>

          {/* Bold Rounded Main Heading */}
          <h2 className="founders-title">
            <span className="title-line">Meet</span>
            <span className="title-line">Our</span>
            <span className="title-line highlight-text">Founders</span>
          </h2>

          {/* Narrative text */}
          <p className="founders-description">
            Behind every great idea is a team that believes in creativity, collaboration, and endless possibilities. 
            Get to know the visionary minds behind GenVaani, each bringing their own unique skills, 
            energy, and imagination to transform ambitious ideas into powerful digital realities.
          </p>

          {/* CTA Button */}
          <div className="founders-cta-wrapper">
            <Link to="/contact" className="founders-contact-btn">
              <span>CONTACT US</span>
              <FiArrowUpRight className="btn-icon" />
            </Link>
          </div>

          {/* Contact Details Card */}
          <div className="founders-contact-box">
            <a href="mailto:hello@genvaani.com" className="contact-line">
              <span className="contact-icon-bubble">
                <FiMail />
              </span>
              <span className="contact-text">hello@genvaani.com</span>
            </a>

            <a href="https://genvaani.com" target="_blank" rel="noopener noreferrer" className="contact-line">
              <span className="contact-icon-bubble">
                <FiGlobe />
              </span>
              <span className="contact-text">www.genvaani.com</span>
            </a>

            <a href="tel:+919876543210" className="contact-line">
              <span className="contact-icon-bubble">
                <FiPhone />
              </span>
              <span className="contact-text">+91 98765 43210</span>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Vintage Camera Graphic - Bottom Right Corner */}
      <div className="doodle-camera">
        <svg viewBox="0 0 160 120" fill="none" className="camera-svg">
          {/* Camera Body */}
          <rect x="15" y="32" width="130" height="78" rx="10" fill="#e2e8f0" stroke="#475569" strokeWidth="4" />
          <rect x="25" y="44" width="110" height="56" rx="4" fill="#1e293b" />
          {/* Top Panel & Flash */}
          <path d="M 40 32 L 50 18 L 110 18 L 120 32 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="3" />
          <circle cx="35" cy="22" r="7" fill="#64748b" />
          <rect x="75" y="22" width="18" height="8" rx="2" fill="#94a3b8" />
          {/* Lens */}
          <circle cx="80" cy="72" r="26" fill="#0f172a" stroke="#cbd5e1" strokeWidth="5" />
          <circle cx="80" cy="72" r="17" fill="#1e293b" stroke="#6842c2" strokeWidth="3" />
          <circle cx="80" cy="72" r="9" fill="#020617" />
          <circle cx="75" cy="67" r="3" fill="#ffffff" opacity="0.8" />
        </svg>
      </div>
    </section>
  );
};

export default MeetFounders;
