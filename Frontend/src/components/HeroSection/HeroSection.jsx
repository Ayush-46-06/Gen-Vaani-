
import React, { useEffect, useRef } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const heroVideo =
    'https://ik.imagekit.io/apjql4rch/genvanni(_).mp4';

  const heroRef = useRef(null);

  // Scroll-triggered fade and upward movement
  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    if (motionPreference.matches) return;

    let frameId = null;

    const updateScrollEffect = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const scrollDistance = Math.max(hero.offsetHeight * 0.75, 1);

        const progress = Math.min(
          1,
          Math.max(0, -rect.top / scrollDistance)
        );

        const opacity = 1 - progress;
        const translateY = -progress * 48;

        hero.style.setProperty(
          '--hero-scroll-opacity',
          opacity.toFixed(3)
        );

        hero.style.setProperty(
          '--hero-scroll-y',
          `${translateY.toFixed(1)}px`
        );

        frameId = null;
      });
    };

    updateScrollEffect();

    window.addEventListener('scroll', updateScrollEffect, {
      passive: true,
    });

    window.addEventListener('resize', updateScrollEffect);

    return () => {
      window.removeEventListener('scroll', updateScrollEffect);
      window.removeEventListener('resize', updateScrollEffect);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <section className="hero-section" ref={heroRef}>
      {/* Background Video */}
      <video
        className="hero-video-bg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Background Overlays */}
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />

      {/* Main Hero Content */}
      <div className="hero-content">
        {/* Eyebrow matching studio typography */}
        {/* <div className="hero-eyebrow">
          <span>DIGITAL PRODUCT STUDIO</span>
          <div className="hero-eyebrow-divider" aria-hidden="true" />
        </div> */}

        {/* Word-by-word animated headline with Dual Typography */}
        <h1
          className="hero-heading"
          aria-label="We Build Digital Products That Drive Results."
        >
          <span className="hero-heading-line">
            <span className="hero-word word-1" aria-hidden="true">
              We
            </span>
            <span className="hero-word word-2" aria-hidden="true">
              Build
            </span>
            <span className="hero-word word-3" aria-hidden="true">
              Digital
            </span>
          </span>

          <span className="hero-heading-line">
            <span className="hero-word word-4" aria-hidden="true">
              Products
            </span>
            <span className="hero-word word-5" aria-hidden="true">
              That
            </span>
          </span>

          <span className="hero-heading-line headline-line-serif">
            <span className="hero-word word-6" aria-hidden="true">
              Drive
            </span>
            <span
              className="hero-word hero-heading-accent word-7"
              aria-hidden="true"
            >
              Results.
            </span>
          </span>
        </h1>

        {/* Supporting Description */}
        <div className="hero-description-wrapper">
          <p className="hero-description">
            From custom software and web applications to AI-powered
            solutions, we help businesses turn ambitious ideas into
            scalable digital products.
          </p>
        </div>

        {/* CTA */}
        <div className="hero-actions">
          <a
            href="#services"
            className="hero-cta"
            onClick={(e) => {
              e.preventDefault();
              const servicesElem = document.getElementById('services');
              if (servicesElem) {
                servicesElem.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/portfolio';
              }
            }}
          >
            <span>Explore Our Work</span>

            <span className="hero-cta-arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>

          <span className="hero-supporting-text">
            Built for what comes next.
          </span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll-indicator" aria-hidden="true">
        <span className="hero-scroll-line" />
        <span>SCROLL TO EXPLORE</span>
      </div>

      {/* Bottom Curly Wave Transition into About Section */}
      <div className="hero-wave-bottom" aria-hidden="true">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle cyan accent glow wave */}
          <path
            d="M0,45 C280,0 520,80 720,35 C940,0 1180,80 1440,35 L1440,100 L0,100 Z"
            fill="rgba(0, 203, 240, 0.22)"
          />
          {/* Main seamless pure white wave flowing into About section */}
          <path
            d="M0,55 C280,10 520,90 720,45 C940,10 1180,90 1440,45 L1440,100 L0,100 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
