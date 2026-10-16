import React from 'react';
import './ServiceHero.css';

const ServiceHero = ({ service }) => {
  if (!service) return null;

  return (
    <section className="service-hero-section">
      {/* Decorative Sparkle Stars */}
      <div className="sparkle-star sparkle-top-center">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#0f172a">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
        </svg>
      </div>
      <div className="sparkle-star sparkle-far-right">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="#94a3b8">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
        </svg>
      </div>
      <div className="sparkle-star sparkle-bottom-left">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="#94a3b8">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
        </svg>
      </div>
      <div className="sparkle-star sparkle-bottom-center">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="#0f172a">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
        </svg>
      </div>

      <div className="service-hero-container">
        {/* Left Side: Typography & CTA */}
        <div className="service-hero-left">
          <h1 className="service-hero-title">
            <span className="title-row-1">{service.titleLine1}</span>
            <span className="title-row-2">{service.titleLine2}</span>
          </h1>

          <p className="service-hero-subtitle">
            {service.subtitle}
          </p>

          <div className="service-hero-cta-wrapper">
            <a href="#contact-service" className="service-hero-btn">
              <span className="btn-text">{service.ctaText}</span>
              <span className="btn-circle-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </span>
            </a>
          </div>
        </div>

        {/* Right Side: The Organic Curved Bento Card Container */}
        <div className="service-hero-right">
          <div className="bento-card-wrapper">
            
            {/* The SVG Mask and Graphic Composition */}
            <svg 
              className="bento-svg" 
              viewBox="0 0 650 420" 
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Organic Custom Silhouette Clip Path */}
                <clipPath id={`bento-clip-${service.slug}`}>
                  <path d="
                    M 0,110 
                    C 0,110 30,110 60,110 
                    C 100,110 115,15 155,15 
                    L 610,15 
                    C 635,15 650,30 650,55 
                    L 650,285 
                    C 650,305 635,315 615,315 
                    L 505,315 
                    C 485,315 470,330 470,350 
                    L 470,385 
                    C 470,405 455,420 435,420 
                    L 35,420 
                    C 15,420 0,405 0,385 
                    Z
                  " />
                </clipPath>

                {/* Subtle soft gradient over the image */}
                <linearGradient id="imageOverlayGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000000" stopOpacity="0.15" />
                  <stop offset="60%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
                </linearGradient>
              </defs>

              {/* Clipped Photography Image */}
              <g clipPath={`url(#bento-clip-${service.slug})`}>
                <image 
                  href={service.heroImage} 
                  x="0" 
                  y="0" 
                  width="650" 
                  height="420" 
                  preserveAspectRatio="xMidYMid slice" 
                />
                
                {/* Overlay gradient */}
                <rect width="650" height="420" fill="url(#imageOverlayGrad)" />

                {/* Milestone Dotted Route Trail */}
                <path 
                  d="M 30,350 Q 180,310 260,220 T 500,110" 
                  stroke="#ffffff" 
                  strokeWidth="2.5" 
                  strokeDasharray="6 6" 
                  fill="none" 
                  opacity="0.9"
                />

                {/* Dotted Trail Checkpoint Pins */}
                {/* Pin 1 - Bottom Left */}
                <circle cx="30" cy="350" r="7" fill="#00cbf0" />
                <circle cx="30" cy="350" r="3" fill="#ffffff" />

                {/* Pin 2 - Center Mid */}
                <circle cx="260" cy="220" r="7" fill="#ffffff" />
                <circle cx="260" cy="220" r="3" fill="#00278a" />

                {/* Pin 3 - Top Right Destination */}
                <circle cx="500" cy="110" r="8" fill="#00cbf0" />
                <circle cx="500" cy="110" r="3.5" fill="#ffffff" />
              </g>
            </svg>

            {/* Floating Milestone / Performance Badge (Top Right) */}
            <div className="floating-metric-badge">
              <img 
                src={service.badgeAvatar} 
                alt="Badge Avatar" 
                className="metric-badge-avatar" 
              />
              <div className="metric-badge-info">
                <span className="metric-badge-title">{service.badgeTitle}</span>
                <span className="metric-badge-value">{service.badgeValue}</span>
              </div>
            </div>

            {/* 3D Fluffy Clouds (Overlapping the boundaries for depth) */}
            <div className="cloud-cluster cloud-left">
              <svg viewBox="0 0 200 120" className="cloud-svg">
                <path 
                  d="M 40 90 A 30 30 0 0 1 70 40 A 45 45 0 0 1 140 45 A 35 35 0 0 1 180 85 A 25 25 0 0 1 160 110 L 40 110 A 20 20 0 0 1 40 90 Z" 
                  fill="#ffffff" 
                  opacity="0.92"
                />
              </svg>
            </div>

            <div className="cloud-cluster cloud-right">
              <svg viewBox="0 0 220 130" className="cloud-svg">
                <path 
                  d="M 50 100 A 35 35 0 0 1 85 45 A 50 50 0 0 1 165 50 A 40 40 0 0 1 205 95 A 30 30 0 0 1 180 125 L 45 125 A 25 25 0 0 1 50 100 Z" 
                  fill="#ffffff" 
                  opacity="0.88"
                />
              </svg>
            </div>

            {/* Social Proof Stats Badge (Tucked into the bottom-right cutout notch) */}
            <div className="notch-social-proof">
              <div className="notch-avatars-group">
                {service.avatars.map((av, idx) => (
                  <img 
                    key={idx} 
                    src={av} 
                    alt={`User avatar ${idx + 1}`} 
                    className="notch-avatar" 
                    style={{ zIndex: 10 - idx }}
                  />
                ))}
              </div>
              <div className="notch-stat-info">
                <span className="notch-stat-count">{service.statCount}</span>
                <span className="notch-stat-label">{service.statLabel}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="hero-wave-bottom">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#020B2D" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default ServiceHero;
