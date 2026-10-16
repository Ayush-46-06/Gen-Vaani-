import React from 'react';
import aboutImg from '../../assets/about.png';
import './AboutHero.css';

const AboutHero = () => {
  return (
    <section className="about-hero-section">
      <div className="about-hero-container">
        <div className="about-hero-content">
          <div className="about-hero-eyebrow">
            <span>ABOUT GENVAANI</span>
            <div className="eyebrow-divider" aria-hidden="true"></div>
          </div>
          
          <h1 className="about-hero-headline">
            <span className="headline-line-bold">We Build</span>
            <span className="headline-line-bold">Digital Products</span>
            <span className="headline-line-serif">That Drive Results.</span>
          </h1>
          
          <p className="about-hero-description">
            At GenVaani, we combine strategy, design, and technology to create digital solutions that solve real problems, improve experiences, and help businesses grow.
          </p>
          
          <div className="about-hero-features">
            <div className="feature-item">
              <div className="feature-icon-wrapper icon-strategy">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.66 18H14.34M12 21V18M12 3C8.68629 3 6 5.68629 6 9C6 11.2386 7.23419 13.187 9 14.2239V17C9 17.5523 9.44772 18 10 18H14C14.5523 18 15 17.5523 15 17V14.2239C16.7658 13.187 18 11.2386 18 9C18 5.68629 15.3137 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-title">Strategy</h3>
              <p className="feature-desc">Purpose-driven<br/>solutions</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon-wrapper icon-design">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-title">Design</h3>
              <p className="feature-desc">User-centric<br/>experiences</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon-wrapper icon-development">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.325 4.317C10.751 2.56 13.249 2.56 13.675 4.317C13.8055 4.8553 14.2831 5.23075 14.8394 5.23277C15.3956 5.23479 15.8906 4.8966 16.048 4.37C16.5293 2.76016 18.8286 2.39999 19.982 3.753C20.3347 4.16672 20.893 4.30825 21.4057 4.11413C21.9185 3.92002 22.2536 3.44026 22.26 2.891C22.28 1.134 20.592 -0.198 18.995 0.315C18.4984 0.474661 17.9622 0.35414 17.5791 0.00392931C17.1959 -0.346281 17.0252 -0.879796 17.128 -1.405C17.447 -3.013 15.719 -4.269 14.167 -3.556C13.6874 -3.33649 13.136 -3.33649 12.656 -3.556C11.103 -4.268 9.375 -3.013 9.694 -1.405C9.79679 -0.879796 9.62612 -0.346281 9.24294 0.00392931C8.85976 0.35414 8.32356 0.474661 7.827 0.315C6.23 -0.198 4.542 1.134 4.562 2.891C4.56843 3.44026 4.90348 3.92002 5.41625 4.11413C5.92902 4.30825 6.48729 4.16672 6.84 3.753C7.99342 2.39999 10.2927 2.76016 10.774 4.37C10.9314 4.8966 11.4264 5.23479 11.9826 5.23277C12.5389 5.23075 13.0165 4.8553 13.147 4.317H10.325Z" transform="translate(0 6)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-title">Development</h3>
              <p className="feature-desc">Scalable & reliable<br/>products</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon-wrapper icon-impact">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-title">Real Impact</h3>
              <p className="feature-desc">Measurable<br/>business results</p>
            </div>
          </div>
        </div>
        
        <div className="about-hero-image-wrapper">
          <img src={aboutImg} alt="About GenVaani" className="about-hero-image" />
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
