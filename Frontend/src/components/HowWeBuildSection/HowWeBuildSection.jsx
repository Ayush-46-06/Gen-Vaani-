import React from 'react';
import './HowWeBuildSection.css';

const steps = [
  {
    id: '01',
    tag: 'DISCOVERY',
    title: 'Understand',
    desc: 'We understand your business, users, workflow, data, and the problem worth solving.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    )
  },
  {
    id: '02',
    tag: 'PLANNING',
    title: 'Design',
    desc: 'We define the product experience, architecture, AI approach, and implementation plan.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
      </svg>
    )
  },
  {
    id: '03',
    tag: 'DEVELOPMENT',
    title: 'Build',
    desc: 'We develop the application, AI system, integrations, and automation workflows.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    )
  },
  {
    id: '04',
    tag: 'INTEGRATION',
    title: 'Integrate',
    desc: 'We connect the solution with your existing tools, systems, data, and workflows.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 8v8M16 8v8M4 12h16"></path>
      </svg>
    )
  },
  {
    id: '05',
    tag: 'DEPLOYMENT',
    title: 'Launch',
    desc: 'We test, deploy, monitor, and move the solution into production.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5a5.4 5.4 0 0 0 1-1.5 7.98 7.98 0 0 0 6.6-6.6l.5-.5s1.5-3.5-1-6-6-1-6-1l-.5.5a7.98 7.98 0 0 0-6.6 6.6 5.4 5.4 0 0 0-1.5 1l-.5.5Z"></path>
        <path d="m12 15-3-3a22 22 0 0 1-3 3l3 3a22 22 0 0 1 3-3Z"></path>
        <path d="M9 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
      </svg>
    )
  },
  {
    id: '06',
    tag: 'ONGOING',
    title: 'Improve',
    desc: 'We continuously improve performance, reliability, usability, and intelligence.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    )
  }
];

const HowWeBuildSection = () => {
  return (
    <section className="hwb-section">
      <div className="hwb-container">
        <h2 className="hwb-main-title">How We Build</h2>

        <div className="hwb-timeline">
          <div className="hwb-line"></div>

          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div key={step.id} className={`hwb-item ${isLeft ? 'left' : 'right'}`}>
                {/* Center Icon */}
                <div className="hwb-icon-container">
                  <div className="hwb-icon-ring-1"></div>
                  <div className="hwb-icon-ring-2"></div>
                  <div className="hwb-icon-wrapper">
                    {step.icon}
                  </div>
                </div>

                {/* Content Card */}
                <div className="hwb-card-container">
                  <div className="hwb-card">
                    <span className="hwb-watermark">{step.id}</span>
                    <div className="hwb-card-content">
                      <span className="hwb-tag">{step.tag}</span>
                      <h3 className="hwb-title">{step.title}</h3>
                      <p className="hwb-desc">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default HowWeBuildSection;
