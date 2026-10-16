
import React from 'react';
import { Link } from 'react-router-dom';
import aboutHeroImage from '../../assets/image copy.png';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section-grid" id="about">
      <div className="about-container">
        {/* Main About Layout */}
        <div className="about-main-grid">

          {/* Left Content */}
          <div className="about-content">

            <div className="about-eyebrow">
              {/* <span className="about-eyebrow-line" /> */}
              <span>WHO WE ARE</span>
              <span className="about-eyebrow-number">01 / ABOUT</span>
            </div>

            <h2 className="about-heading">
              We turn bold ideas
              <br />
              into <span>digital impact.</span>
            </h2>

            <p className="about-intro">
              Technology should do more than work. It should move
              businesses forward, create meaningful experiences, and
              open doors to new possibilities.
            </p>

            <p className="about-description">
              GenVaani brings together technology, creativity, and
              strategic thinking to build digital products that solve
              real problems. From websites and applications to
              intelligent digital solutions, we help businesses
              transform ideas into experiences people value.
            </p>

            <p className="about-description">
              We work alongside ambitious startups and established
              businesses, combining thoughtful design with reliable
              engineering to create solutions built for today and
              ready for tomorrow.
            </p>

            <div className="about-actions">
              <Link to="/about" className="about-primary-btn">
                Discover our story
                <span className="about-btn-arrow">↗</span>
              </Link>

              <span className="about-actions-note">
                Built around your vision.
              </span>
            </div>

            {/* Mini highlights */}
            <div className="about-highlights">
              <div className="about-highlight">
                <span className="about-highlight-dot" />
                <span>Strategy-led thinking</span>
              </div>

              <div className="about-highlight">
                <span className="about-highlight-dot" />
                <span>Design meets technology</span>
              </div>

              <div className="about-highlight">
                <span className="about-highlight-dot" />
                <span>Built for growth</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="about-visual">

            <div className="about-visual-glow" />

            <div className="about-image-frame">
              <img
                src={aboutHeroImage}
                alt="GenVaani bringing technology, creativity and innovation together"
                className="about-image-img"
                loading="lazy"
              />

              <div className="about-image-shade" />

              <div className="about-image-top-label">
                <span className="about-live-dot" />
                INNOVATION IN MOTION
              </div>

              <div className="about-image-caption">
                <span className="about-caption-label">
                  OUR APPROACH
                </span>

                <h3>
                  Think beyond.
                  <br />
                  Build what matters.
                </h3>

                <p>
                  Purposeful ideas. Thoughtful design. Real-world impact.
                </p>
              </div>
            </div>

            {/* Floating decorative element */}
            <div className="about-floating-card">
              <div className="about-floating-icon">✳</div>

              <div>
                <span className="about-floating-title">
                  Ideas into reality
                </span>
                <span className="about-floating-subtitle">
                  Powered by innovation
                </span>
              </div>

              <span className="about-floating-arrow">↗</span>
            </div>

            <div className="about-visual-index">
              {/* <span>GV.</span> */}
              <span>CREATING WHAT'S NEXT</span>
            </div>
          </div>
        </div>

        {/* Bottom Statement */}
        <div className="about-bottom">
          <div className="about-bottom-index">
            <span className="about-bottom-index-line" />
            <span>OUR PHILOSOPHY</span>
          </div>

          <div className="about-bottom-content">
            <h3>
              The right blend of{' '}
              <span>engineering</span>,{' '}
              <span>creativity</span> and{' '}
              <span>purpose.</span>
            </h3>

            <p>
              Because the best digital experiences don't just look
              different. They make a difference.
            </p>
          </div>

          <div className="about-bottom-symbol" aria-hidden="true">
            ↗
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
