import React from 'react';
import './MissionSection.css';

const MissionSection = () => {
  return (
    <section className="mission-section">
      {/* Top Wave transition from AboutHero (white) to MissionSection (dark) */}
      <div className="wave-divider wave-top">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#020B2D" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="mission-left">
        <div className="mission-left-content">
          <span className="mission-label">OUR PURPOSE</span>
          <h2 className="mission-heading">
            About Our <br />
            <span className="text-accent">Mission</span>
          </h2>
          <p className="mission-description">
            At GenVaani, our mission is to empower businesses through innovative digital solutions. We strive to bridge the gap between complex technology and user-friendly design, ensuring that every product we build not only looks stunning but delivers exceptional performance and tangible business growth.
          </p>
          <p className="mission-description">
            We are committed to excellence, continuous innovation, and delivering scalable solutions that stand the test of time.
          </p>
        </div>
      </div>

      <div className="mission-right">
        <div className="mission-cards-container">
          {/* Card 1 */}
          <div className="mission-card">
            <div className="mission-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="mission-card-text">
              <h4>Transparent Communication</h4>
              <p>We believe in keeping our clients informed at every step, ensuring clear expectations and seamless collaboration.</p>
            </div>
          </div>

          {/* Card 2 (Highlighted) */}
          <div className="mission-card highlighted-card">
            <div className="mission-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <div className="mission-card-text">
              <h4>Uncompromising Quality</h4>
              <p>Every line of code and every pixel is meticulously crafted to meet the highest industry standards of quality.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="mission-card">
            <div className="mission-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
              </svg>
            </div>
            <div className="mission-card-text">
              <h4>Data-Driven Strategy</h4>
              <p>Our decisions are backed by deep analytics, ensuring that our solutions drive real, measurable ROI for your business.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Center Target Graphic */}
      <div className="mission-target-graphic">
        <div className="target-outer-circle">
          <div className="target-inner-circle">
            <svg viewBox="0 0 100 100" width="80" height="80">
              <circle cx="50" cy="50" r="45" fill="#f8f9fa" stroke="#1a202c" strokeWidth="6" />
              <circle cx="50" cy="50" r="30" fill="#00cbf0" stroke="#1a202c" strokeWidth="6" />
              <circle cx="50" cy="50" r="15" fill="#f8f9fa" stroke="#1a202c" strokeWidth="6" />
              <circle cx="50" cy="50" r="5" fill="#1a202c" />
              {/* Arrow */}
              <line x1="80" y1="20" x2="50" y2="50" stroke="#1a202c" strokeWidth="6" strokeLinecap="round" />
              <polygon points="85,15 75,25 80,30 90,20" fill="#1a202c" />
              <polygon points="75,15 65,25 70,30 80,20" fill="#1a202c" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
