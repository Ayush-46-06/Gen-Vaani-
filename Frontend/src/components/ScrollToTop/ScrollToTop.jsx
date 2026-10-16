import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ScrollToTop.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // 1. Auto-scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  // 2. Track scroll distance and progress percentage for floating button
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

          // Show floating button once user scrolls past 300px
          setIsVisible(scrollY > 300);

          if (totalHeight > 0) {
            const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
            setScrollProgress(progress);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  // Circular progress calculations (Radius = 20, Circumference ≈ 125.66)
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`scroll-to-top-wrapper ${isVisible ? 'visible' : ''}`}
      aria-hidden={!isVisible}
    >
      <button
        type="button"
        className="scroll-to-top-btn"
        onClick={handleScrollToTop}
        aria-label="Scroll to top of page"
        title="Scroll to top"
      >
        {/* Circular Progress SVG */}
        <svg className="scroll-progress-ring" width="50" height="50" viewBox="0 0 50 50">
          <circle
            className="progress-ring-track"
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            strokeWidth="2.5"
          />
          <circle
            className="progress-ring-fill"
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Up Arrow Icon */}
        <span className="scroll-arrow-icon" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default ScrollToTop;
