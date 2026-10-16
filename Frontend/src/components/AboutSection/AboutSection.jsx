import React from 'react';
import { Link } from 'react-router-dom';
import aboutHeroImage from '../../assets/image copy.png';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section-grid">
      {/* Top Wave Divider */}
      <div className="wave-divider wave-top">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="about-top-row">
        <div className="about-title-col">
          <h2 className="massive-title">
            <span className="title-about">ABOUT</span>
            <span className="title-us">
              <span className="title-u">U</span>
              <span className="title-s">s</span>
            </span>
          </h2>
        </div>

        <div className="about-text-col">
          <p>
            GenVaani is a trailblazer in the technology industry, founded with a vision to redefine how businesses operate. We are a dedicated talent of adventurers, approaching each new project with optimism and a can-do swagger, pushing boundaries and championing a clear vision for the establishment.
          </p>
          <p>
            We started this journey as adventurers, and we still rise to any challenge, recognizing that the one constant in business is change. Equipped for the challenges ahead, we continue to push ourselves and our clients forward, ready to embrace new opportunities and never afraid to ask what's over the horizon.
          </p>
          <p>
            We have grown to deliver an integrated and agile complete product development solution, working with both local and international clients, from large multinational organizations through to next-generation start-ups looking to commercialize novel ideas and discoveries.
          </p>
          <Link to="/about" className="read-more-btn" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
            READ MORE
          </Link>
        </div>

        <div className="about-image-col">
          <div className="about-image-wrapper">
            <img 
              src={aboutHeroImage} 
              alt="Gen-Vaani Global Innovation" 
              className="about-image-img"
              loading="lazy" 
            />
          </div>
        </div>
      </div>

      <div className="about-bottom-row">
        <div className="bottom-empty-col">
          <div className="number-box">
            <span className="section-number">01</span>
          </div>
        </div>
        <div className="bottom-text-col">
          <h3 className="bottom-statement">
            We bring together the perfect blend of deep technical <span className="text-accent">expertise</span>, beautiful <span className="text-accent">design</span> and optimised <span className="text-accent">usability</span>
          </h3>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
