import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesData } from '../data/servicesData';
import { getServiceBySlugApi } from '../services/serviceApi';
import ServiceHero from '../components/ServiceHero/ServiceHero';
import ServiceWorkflow from '../components/ServiceWorkflow/ServiceWorkflow';
import ServicePricing from '../components/ServicePricing/ServicePricing';
import './ServiceDetail.css';

const getFeatureIcon = (feature) => {
  const t = ((feature.title || '') + ' ' + (feature.icon || '')).toLowerCase();
  
  if (t.includes('speed') || t.includes('fast') || t.includes('⚡')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    );
  }
  if (t.includes('mobile') || t.includes('cross-platform') || t.includes('📱') || t.includes('adaptive')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </svg>
    );
  }
  if (t.includes('security') || t.includes('ssl') || t.includes('🔒')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="M9 12l2 2 4-4"></path>
      </svg>
    );
  }
  if (t.includes('conversion') || t.includes('ux') || t.includes('targeting') || t.includes('🎯')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    );
  }
  if (t.includes('cloud') || t.includes('api') || t.includes('☁️')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
      </svg>
    );
  }
  if (t.includes('sync') || t.includes('real-time') || t.includes('🔄')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
      </svg>
    );
  }
  if (t.includes('test') || t.includes('ci/cd') || t.includes('🧪')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
    );
  }
  if (t.includes('design') || t.includes('creative') || t.includes('system') || t.includes('🎨') || t.includes('✨')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"></path>
      </svg>
    );
  }
  if (t.includes('attribution') || t.includes('analytics') || t.includes('📊') || t.includes('kpi') || t.includes('📈')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    );
  }
  if (t.includes('local') || t.includes('profile') || t.includes('map') || t.includes('📍') || t.includes('🗺️')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    );
  }
  if (t.includes('review') || t.includes('star') || t.includes('⭐')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    );
  }
  if (t.includes('growth') || t.includes('omnichannel') || t.includes('📢')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    );
  }
  if (t.includes('content') || t.includes('writing') || t.includes('✍️')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
    );
  }
  if (t.includes('email') || t.includes('funnel') || t.includes('📧')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
    );
  }

  // Modern Enterprise Hexagon Default
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cbf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    </svg>
  );
};

const getFeatureMetric = (feature, index) => {
  const t = (feature.title || '').toLowerCase();
  if (t.includes('speed') || t.includes('fast')) return '< 0.6s LCP';
  if (t.includes('mobile') || t.includes('adaptive')) return '100% Fluid';
  if (t.includes('security')) return 'Grade A+ SSL';
  if (t.includes('conversion') || t.includes('ux')) return '+42% Funnel CVR';
  if (t.includes('cross-platform')) return '60fps Native';
  if (t.includes('cloud') || t.includes('serverless')) return '99.99% SLA';
  if (t.includes('sync') || t.includes('real-time')) return '< 15ms Socket';
  if (t.includes('testing') || t.includes('ci/cd')) return 'Zero-Regression';
  if (t.includes('targeting')) return 'High-Intent Signals';
  if (t.includes('creative')) return 'Scroll-Stopping';
  if (t.includes('attribution')) return 'Server CAPI';
  if (t.includes('bid') || t.includes('optimization')) return 'Target ROAS 4.5x';
  if (t.includes('research')) return 'Zero Drop-Off';
  if (t.includes('wireframe')) return 'Figma Ready';
  if (t.includes('design system')) return '100% Tokenized';
  if (t.includes('micro-interaction')) return '60fps Physics';
  if (t.includes('profile')) return 'Top 3 Map Pack';
  if (t.includes('citation')) return '100% Synced NAP';
  if (t.includes('review')) return '5.0★ Velocity';
  if (t.includes('grid')) return 'Multi-Mile Grid';
  if (t.includes('omnichannel')) return 'Omni-Touch';
  if (t.includes('authority') || t.includes('content')) return 'Industry Lead';
  if (t.includes('email')) return 'Zero Churn';
  if (t.includes('growth') || t.includes('analytics')) return 'Real-Time ROI';
  return `Level 0${index + 1}`;
};

const renderFeatureMicroWidget = (feature) => {
  const t = (feature.title || '').toLowerCase();
  if (t.includes('speed') || t.includes('fast')) {
    return (
      <div className="feature-micro-widget">
        <div className="micro-widget-label">
          <span>Latency Efficiency</span>
          <span className="text-cyan">99/100 Core Vitals</span>
        </div>
        <div className="feature-micro-bar">
          <div className="feature-micro-bar-fill" style={{ width: '96%' }}></div>
        </div>
      </div>
    );
  }
  if (t.includes('mobile') || t.includes('adaptive') || t.includes('cross-platform')) {
    return (
      <div className="feature-micro-widget">
        <div className="micro-widget-chips">
          <span className="micro-chip active">Desktop</span>
          <span className="micro-chip active">Tablet</span>
          <span className="micro-chip active">Mobile</span>
        </div>
      </div>
    );
  }
  if (t.includes('security')) {
    return (
      <div className="feature-micro-widget">
        <div className="micro-status-live">
          <span className="live-dot-green"></span>
          <span>AES-256 Bit Encryption • Active</span>
        </div>
      </div>
    );
  }
  if (t.includes('conversion') || t.includes('ux') || t.includes('growth') || t.includes('bid')) {
    return (
      <div className="feature-micro-widget">
        <div className="micro-stat-trend">
          <span className="trend-arrow-up">▲</span>
          <span className="trend-value">+42% Funnel Uplift</span>
        </div>
      </div>
    );
  }
  return (
    <div className="feature-micro-widget">
      <div className="micro-status-live">
        <span className="live-dot-cyan"></span>
        <span>Enterprise Architecture • Verified</span>
      </div>
    </div>
  );
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const fallback = servicesData[slug] || servicesData['website-development'];
  const [service, setService] = useState(fallback);
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    const currentFallback = servicesData[slug] || servicesData['website-development'];
    setService(currentFallback);
    setActiveFaq(0);

    let isMounted = true;
    getServiceBySlugApi(slug).then((res) => {
      if (isMounted && res && res.success && res.service) {
        setService(res.service);
      }
    }).catch((err) => console.warn('Service detail fetch error:', err));

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? -1 : index);
  };

  return (
    <div className="service-detail-page">
      {/* 1. Custom Bento Organic Hero Section */}
      <ServiceHero service={service} />

      {/* 2. Deep Dive Capabilities Section */}
      <section className="service-features-section">
        <div className="service-features-container">
          <div className="features-header">
            {/* <div className="features-badge-pill">
              <span className="features-pulse-dot"></span>
              <span className="features-badge-label">CORE CAPABILITIES & ARCHITECTURE</span>
            </div> */}
            <h2 className="features-title">
              Engineered for <span className="gradient-text-cyan">Maximum Impact</span>
            </h2>
            <p className="features-desc">
              Every solution we deliver is tailor-made with precision architecture, military-grade security, and obsessive performance optimization.
            </p>
          </div>

          <div className="features-grid">
            {service.features.map((feature, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-card-top-row">
                  <div className="feature-icon-badge">
                    {getFeatureIcon(feature)}
                  </div>
                  <div className="feature-top-meta">
                    <span className="feature-metric-pill">
                      {getFeatureMetric(feature, i)}
                    </span>
                    <span className="feature-card-index">0{i + 1}</span>
                  </div>
                </div>

                <div className="feature-card-body">
                  <h3 className="feature-card-title">{feature.title}</h3>
                  <p className="feature-card-desc">{feature.desc}</p>
                </div>

                <div className="feature-card-bottom">
                  {renderFeatureMicroWidget(feature)}
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack Pills */}
          <div className="service-tech-wrapper">
            <h4 className="tech-heading"> POWERED BY ENTERPRISE-GRADE STACK & TOOLING </h4>
            <div className="tech-tags">
              {service.techStack.map((tech, i) => (
                <span className="tech-tag-pill" key={i}>
                  <span className="tech-tag-dot"></span>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Package & Pricing Comparison Section with Wave Divider */}
      <ServicePricing service={service} showWave={true} />

      {/* 4. Service Workflow Section with Top & Bottom Wave Curves */}
      <ServiceWorkflow service={service} />

      {/* 5. Service FAQs & CTA Section */}
      <section className="service-faq-section" id="contact-service">
        <div className="service-faq-container">
          <div className="faq-left">
            <span className="faq-tag">— GOT QUESTIONS?</span>
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <p className="faq-sub">
              Everything you need to know about our {service.titleLine1} {service.titleLine2} process and deliverables.
            </p>

            <div className="faq-cta-box">
              <h3>Ready to start your project?</h3>
              <p>Schedule a discovery consultation with our strategy and engineering team.</p>
              <Link to="/contact?tab=calendar" className="faq-cta-btn">Book an Appointment &rarr;</Link>
            </div>
          </div>

          <div className="faq-right">
            <div className="faq-accordion-list">
              {service.faqs.map((faq, idx) => (
                <div 
                  className={`faq-item-card ${activeFaq === idx ? 'faq-item-open' : ''}`} 
                  key={idx}
                  onClick={() => toggleFaq(idx)}
                >
                  <div className="faq-question-row">
                    <span className="faq-q-text">{faq.q}</span>
                    <span className="faq-icon-toggle">{activeFaq === idx ? '−' : '+'}</span>
                  </div>
                  {activeFaq === idx && (
                    <div className="faq-answer-block">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
