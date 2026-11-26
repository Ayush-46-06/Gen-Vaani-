import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';
import iconLogo from '../../assets/PNG/8.icon Transparent.webp';

const PHRASE = 'Your Voice, Always Heard';
const TOTAL_LETTERS = PHRASE.length;
const ACCENT_START_INDEX = PHRASE.indexOf('Always Heard');

// Group characters into words so mobile wrapping never splits a word mid-letter
const WORD_GROUPS = (() => {
  const groups = [];
  let cursor = 0;
  const parts = PHRASE.split(' ');
  parts.forEach((word, wordIdx) => {
    const chars = [];
    for (let i = 0; i < word.length; i += 1) {
      chars.push({ char: word[i], globalIndex: cursor });
      cursor += 1;
    }
    groups.push({ word, chars });
    if (wordIdx < parts.length - 1) {
      groups.push({ word: ' ', isSpace: true, chars: [{ char: ' ', globalIndex: cursor }] });
      cursor += 1;
    }
  });
  return groups;
})();

const Preloader = ({ onComplete }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Type one letter after another with fast, snappy cadence
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev < TOTAL_LETTERS) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // When all letters typed, brief pause and smoothly dismiss curtain
  useEffect(() => {
    if (visibleCount === TOTAL_LETTERS) {
      const holdTimer = setTimeout(() => {
        setIsDone(true);
        if (onComplete) {
          setTimeout(onComplete, 300);
        }
      }, 280);

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

            {/* Letter-by-letter tagline */}
            <div className="preloader-text-row" aria-label={PHRASE}>
              {WORD_GROUPS.map((group, groupIdx) => {
                if (group.isSpace) {
                  const spaceVisible = group.chars[0].globalIndex < visibleCount;
                  return (
                    <span
                      key={`space-${groupIdx}`}
                      className={`preloader-space ${spaceVisible ? 'is-visible' : ''}`}
                      aria-hidden="true"
                    >
                      {' '}
                    </span>
                  );
                }

                return (
                  <span key={`word-${groupIdx}`} className="preloader-word">
                    {group.chars.map(({ char, globalIndex }) => {
                      const isVisible = globalIndex < visibleCount;
                      const isAccent = globalIndex >= ACCENT_START_INDEX;
                      return (
                        <motion.span
                          key={globalIndex}
                          className={`preloader-char ${isAccent ? 'char-vaani' : 'char-gen'}`}
                          initial={{ opacity: 0, y: 14, scale: 0.7 }}
                          animate={
                            isVisible
                              ? { opacity: 1, y: 0, scale: 1 }
                              : { opacity: 0, y: 14, scale: 0.7 }
                          }
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                  </span>
                );
              })}

              {/* Glowing blinking cursor */}
              <span
                className={`preloader-cursor ${
                  visibleCount === TOTAL_LETTERS ? 'cursor-hide' : ''
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
                  width: `${(visibleCount / TOTAL_LETTERS) * 100}%`,
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
