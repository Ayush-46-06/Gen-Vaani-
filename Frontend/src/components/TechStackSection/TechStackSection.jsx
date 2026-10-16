import React, { useEffect, useState } from 'react';
import './TechStackSection.css';
import {
  FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs,
  FaGithub, FaPython, FaJava
} from 'react-icons/fa';
import {
  SiTypescript, SiPostgresql, SiNextdotjs, SiTailwindcss,
  SiRedis, SiMongodb, SiGit
} from 'react-icons/si';

const techStack = [
  { name: 'HTML', icon: <FaHtml5 color="#E34F26" /> },
  { name: 'CSS', icon: <FaCss3Alt color="#1572B6" /> },
  { name: 'JavaScript', icon: <FaJs color="#F7DF1E" /> },
  { name: 'React', icon: <FaReact color="#61DAFB" /> },
  { name: 'TypeScript', icon: <SiTypescript color="#3178C6" /> },
  { name: 'Node.js', icon: <FaNodeJs color="#339933" /> },
  { name: 'PostgreSQL', icon: <SiPostgresql color="#4169E1" /> },
  { name: 'Next.js', icon: <SiNextdotjs color="#ffffff" /> },
  { name: 'Tailwind', icon: <SiTailwindcss color="#06B6D4" /> },
  { name: 'Git', icon: <SiGit color="#F05032" /> },
  { name: 'GitHub', icon: <FaGithub color="#ffffff" /> },
  { name: 'Redis', icon: <SiRedis color="#DC382D" /> },
  { name: 'Python', icon: <FaPython color="#3776AB" /> },
  { name: 'Java', icon: <FaJava color="#007396" /> },
  { name: 'MongoDB', icon: <SiMongodb color="#47A248" /> }
];

const TechStackSection = () => {
  return (
    <section className="tech-stack-section">
      {/* Wave transition from About Us (white) to Tech Stack (dark) */}
      <div className="wave-divider wave-top">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#020B2D" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="tech-stack-container">

        {/* Centered Text Content */}
        <div className="tech-text-content">
          {/* <div className="tech-badge">✨ Technology Stack</div> */}
          <h2 className="tech-title">Packed with <span className="text-accent">Innovation</span></h2>
          <p className="tech-description">
            We leverage industry-leading technologies to build scalable, secure, and lightning-fast solutions for your business.
          </p>
          <button className="tech-cta">Book an appointment</button>
        </div>

        {/* Orbiting Circular Arch Wrapper (Static, holds the mask) */}
        <div className="tech-orbit-wrapper">
          <div className="tech-orbit-circle">
            {techStack.map((tech, index) => {
              return (
                <div
                  className="tech-orbit-node"
                  key={index}
                  style={{ '--index': index }}
                  title={tech.name}
                >
                  {/* This wrapper counter-spins continuously so icons don't flip upside down */}
                  <div className="tech-orbit-counter-spin">
                    {/* This inner div counters the static initial placement rotation */}
                    <div
                      className="tech-icon-inner"
                      style={{ transform: `rotate(calc(var(--index) * -24deg))` }}
                    >
                      {tech.icon}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
