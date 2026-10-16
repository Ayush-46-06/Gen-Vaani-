import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';
import iconLogo from '../../assets/PNG/8.icon Transparent.png';

const LETTERS = ['G', 'e', 'n', '-', 'V', 'a', 'a', 'n', 'i'];

const Preloader = ({ onComplete }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Type one letter after another
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev < LETTERS.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 110);

    return () => clearInterval(interval);
  }, []);

  // When all letters typed, pause briefly and slide up curtain
  useEffect(() => {
    if (visibleCount === LETTERS.length) {
      const holdTimer = setTimeout(() => {
        setIsDone(true);
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      }, 350);

      return () => clearTimeout(holdTimer);
    }
  }, [visibleCount, onComplete]);

  // Prevent background scroll while preloader is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            pointerEvents: 'none',
            transition: {
              duration: 0.5,
              ease: 'easeInOut',
            },
          }}
        >
          {/* Ambient Glows */}
          <div className="preloader-glow-cyan" />
          <div className="preloader-glow-purple" />

          <div className="preloader-content">
            {/* Pulsing Brand Icon */}
            <motion.div
              className="preloader-icon-wrapper"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <img src={iconLogo} alt="GenVaani" className="preloader-icon" />
            </motion.div>

            {/* Letter-by-letter brand name */}
            <div className="preloader-text-row">
              {LETTERS.map((char, index) => {
                const isVisible = index < visibleCount;
                const isVaani = index >= 3; // '-Vaani'
                return (
                  <motion.span
                    key={index}
                    className={`preloader-char ${isVaani ? 'char-vaani' : 'char-gen'}`}
                    initial={{ opacity: 0, y: 14, scale: 0.7 }}
                    animate={
                      isVisible
                        ? { opacity: 1, y: 0, scale: 1 }
                        : { opacity: 0, y: 14, scale: 0.7 }
                    }
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {char}
                  </motion.span>
                );
              })}

              {/* Glowing blinking cursor */}
              <span
                className={`preloader-cursor ${
                  visibleCount === LETTERS.length ? 'cursor-hide' : ''
                }`}
              >
                |
              </span>
            </div>

            {/* Progress Bar */}
            <div className="preloader-progress-track">
              <motion.div
                className="preloader-progress-bar"
                initial={{ width: '0%' }}
                animate={{
                  width: `${(visibleCount / LETTERS.length) * 100}%`,
                }}
                transition={{ duration: 0.12, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
