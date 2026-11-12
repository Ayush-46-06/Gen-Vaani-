
import React, { useState, useEffect, useRef } from 'react';
import { usePreloader } from '../../context/PreloaderContext';
import './HeroSection.css';

const GENVAANI_LETTERS = ['G', 'E', 'N', 'V', 'A', 'A', 'N', 'I'];

const HeroSection = () => {
  const heroVideo =
    'https://ik.imagekit.io/apjql4rch/genvanni(_).mp4';

  const { isPreloaderDone } = usePreloader();
  const [phase, setPhase] = useState(isPreloaderDone ? 'typing' : 'waiting');
  const [letterCount, setLetterCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const heroRef = useRef(null);
  const videoRef = useRef(null);

  // When preloader finishes, begin typing sequence
  useEffect(() => {
    if (isPreloaderDone && phase === 'waiting') {
      setPhase('typing');
    }
  }, [isPreloaderDone, phase]);

  // Accessibility: support prefers-reduced-motion
  useEffect(() => {
    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );
    if (motionPreference.matches) {
      setPhase('revealed');
      setLetterCount(GENVAANI_LETTERS.length);
    }
  }, []);

  // Initially ensure background video is paused at start
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  // Step 1: Letter-by-letter typing of GENVAANI with measured, cinematic tempo
  useEffect(() => {
    if (phase !== 'typing') return;

    // Subtle initial pause before first letter strikes
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setLetterCount((prev) => {
          if (prev < GENVAANI_LETTERS.length) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 180); // Measured tempo for each letter to register clearly

      return () => clearInterval(interval);
    }, 220);

    return () => clearTimeout(startDelay);
  }, [phase]);

  // Step 2: Once whole GENVAANI is typed, hold gracefully so it can be appreciated, then transition out
  useEffect(() => {
    if (phase === 'typing' && letterCount === GENVAANI_LETTERS.length) {
      // Hold full brand name with glow for 750ms
      const holdTimer = setTimeout(() => {
        setIsExiting(true);

        // Smooth 650ms dissolve transition
        const revealTimer = setTimeout(() => {
          setPhase('revealed');
        }, 650);

        return () => clearTimeout(revealTimer);
      }, 750);

      return () => clearTimeout(holdTimer);
    }
  }, [phase, letterCount]);

  // Step 3: Once hero section appears, start playing the hero video
  useEffect(() => {
    if (phase === 'revealed' && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Hero video autoplay delayed or prevented:', err);
        });
      }
    }
  }, [phase]);

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

  // Preload video stream right before typing completes to prevent bandwidth bottleneck on page load
  useEffect(() => {
    if (phase === 'typing' && letterCount >= 3 && videoRef.current) {
      videoRef.current.load();
    }
  }, [phase, letterCount]);

  return (
    <section
      className={`hero-section ${phase === 'revealed' ? 'hero-revealed' : ''}`}
      ref={heroRef}
    >
      {/* Background Video (streams after initial paint, plays after GENVAANI typing completes) */}
      <video
        ref={videoRef}
        className="hero-video-bg"
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Background Overlays */}
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />

      {/* GENVAANI Letter-by-Letter Animated Intro */}
      {phase !== 'revealed' && (
        <div
          className={`hero-typing-overlay ${
            isExiting ? 'hero-typing-overlay--exiting' : ''
          }`}
          aria-live="polite"
          aria-label="GENVAANI animated intro"
        >
          <div className="hero-typing-glow" aria-hidden="true" />

          <div className="hero-typing-box">
            {/* <div className="hero-typing-badge">
              <span className="hero-typing-dot" />
              <span className="hero-typing-badge-text">
                DIGITAL PRODUCT STUDIO
              </span>
            </div> */}

            <div className="hero-typing-word-row">
              <span className="hero-typing-letters">
                {GENVAANI_LETTERS.slice(0, letterCount).map((char, index) => {
                  const isVaani = index >= 3; // 'G','E','N' (0,1,2) vs 'V','A','A','N','I' (3..7)
                  return (
                    <span
                      key={index}
                      className={`hero-typing-char ${
                        isVaani ? 'char-vaani' : 'char-gen'
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
              <span
                className={`hero-typing-cursor ${
                  letterCount === GENVAANI_LETTERS.length ? 'cursor-pulse' : ''
                }`}
                aria-hidden="true"
              >
                |
              </span>
            </div>

            <div className="hero-typing-sub">
              {letterCount === GENVAANI_LETTERS.length && (
                <span className="hero-typing-tagline">
                  Your Voice Always Heard
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Hero Content (Revealed after GENVAANI completes) */}
      <div className="hero-content">
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
