import React from 'react';
import './ServiceWorkflow.css';

const getWorkflowIcon = (iconType) => {
  switch (iconType) {
    case 'search':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      );
    case 'design':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
          <path d="M2 2l7.586 7.586"></path>
          <circle cx="11" cy="11" r="2"></circle>
        </svg>
      );
    case 'code':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5"></polyline>
          <line x1="12" y1="19" x2="20" y2="19"></line>
        </svg>
      );
    case 'testing':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      );
    case 'rocket':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5a5.4 5.4 0 0 0 1-1.5 7.98 7.98 0 0 0 6.6-6.6l.5-.5s1.5-3.5-1-6-6-1-6-1l-.5.5a7.98 7.98 0 0 0-6.6 6.6 5.4 5.4 0 0 0-1.5 1l-.5.5Z"></path>
          <path d="m12 15-3-3a22 22 0 0 1-3 3l3 3a22 22 0 0 1 3-3Z"></path>
          <path d="M9 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
        </svg>
      );
    case 'layers':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      );
    case 'chart':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      );
    case 'map':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      );
    default:
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      );
  }
};

const defaultWorkflow = {
  tag: 'WORKFLOW',
  titlePrefix: 'From Concept to',
  titleHighlight: 'Deployment',
  subtitle: 'A transparent, agile methodology designed to mitigate risk and deliver value at every stage.',
  steps: [
    {
      step: 1,
      title: 'Discovery',
      desc: 'We analyze requirements, user personas, and define technical KPIs.',
      icon: 'search'
    },
    {
      step: 2,
      title: 'UI/UX Design',
      desc: 'Wireframing and prototyping for intuitive user journeys.',
      icon: 'design'
    },
    {
      step: 3,
      title: 'Development',
      desc: 'Agile sprints where scalable architecture meets clean code.',
      icon: 'code'
    },
    {
      step: 4,
      title: 'QA & Testing',
      desc: 'Rigorous unit testing, cross-browser audits, and performance stress-tests.',
      icon: 'testing'
    },
    {
      step: 5,
      title: 'Deployment',
      desc: 'Live launch on secure global CDN servers with 24/7 monitoring.',
      icon: 'rocket'
    }
  ]
};

const ServiceWorkflow = ({ service }) => {
  const workflow = (service && service.workflow) ? service.workflow : defaultWorkflow;
  const steps = workflow.steps || defaultWorkflow.steps;

  return (
    <section className="service-workflow-section" id="service-workflow">
      {/* Top Wave Divider: Organic curve transitioning from previous section into #020B2D */}
      <div className="wave-divider wave-top">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#020B2D" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="workflow-container">
        {/* Header Block */}
        <div className="workflow-header">
          <div className="workflow-badge-pill">
            <span className="workflow-pulse-dot"></span>
            <span className="workflow-badge-label">{workflow.tag || 'WORKFLOW'}</span>
          </div>

          <h2 className="workflow-title">
            {workflow.titlePrefix}{' '}
            <span className="workflow-title-highlight">{workflow.titleHighlight}</span>
          </h2>

          <p className="workflow-subtitle">
            {workflow.subtitle}
          </p>
        </div>

        {/* Interactive Stepper Track & Flow */}
        <div className="workflow-timeline-wrapper">
          {/* Continuous Connecting Line for Desktop */}
          <div className="workflow-line-track">
            <div className="workflow-line-glow"></div>
          </div>

          <div className="workflow-steps-grid">
            {steps.map((item, idx) => (
              <div className="workflow-step-card" key={idx}>
                {/* Center Node with Number Badge */}
                <div className="workflow-step-node-wrapper">
                  <div className="workflow-step-node">
                    {getWorkflowIcon(item.icon)}
                    <span className="workflow-step-badge">{item.step || idx + 1}</span>
                  </div>
                </div>

                {/* Content Block */}
                <div className="workflow-step-content">
                  <h3 className="workflow-step-title">{item.title}</h3>
                  <p className="workflow-step-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave Divider: Organic curve transitioning from #020B2D into next section */}
      <div className="wave-divider wave-bottom">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#020B2D" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default ServiceWorkflow;
