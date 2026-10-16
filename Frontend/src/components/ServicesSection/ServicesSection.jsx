import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiGlobe,
  FiSmartphone,
  FiTrendingUp,
  FiLayers,
  FiMapPin,
  FiSend,
  FiArrowUpRight,
  FiCpu
} from 'react-icons/fi';
import { getServicesApi } from '../../services/serviceApi';
import './ServicesSection.css';

const getServiceVectorIcon = (service) => {
  const slug = (service.slug || '').toLowerCase();
  const title = (service.title || '').toLowerCase();
  const iconStr = (service.icon || '').toLowerCase();

  if (slug.includes('web') || title.includes('website') || iconStr === '🌐') return <FiGlobe />;
  if (slug.includes('app') || title.includes('application') || title.includes('mobile') || iconStr === '📱') return <FiSmartphone />;
  if (slug.includes('ad') || title.includes('meta') || title.includes('google') || iconStr === '📈') return <FiTrendingUp />;
  if (slug.includes('design') || slug.includes('ui') || slug.includes('ux') || iconStr === '🎨') return <FiLayers />;
  if (slug.includes('seo') || slug.includes('local') || iconStr === '📍') return <FiMapPin />;
  if (slug.includes('marketing') || title.includes('digital') || iconStr === '🚀') return <FiSend />;
  return <FiCpu />;
};

const getServiceCategory = (service) => {
  const slug = (service.slug || '').toLowerCase();
  if (slug.includes('web')) return 'Web Engineering';
  if (slug.includes('app')) return 'Mobile Applications';
  if (slug.includes('ad')) return 'Performance Marketing';
  if (slug.includes('design') || slug.includes('ui') || slug.includes('ux')) return 'UI/UX & Product';
  if (slug.includes('seo') || slug.includes('local')) return 'Local Search & Maps';
  if (slug.includes('marketing')) return 'Growth & Strategy';
  return 'Enterprise Core';
};

const DEFAULT_SERVICES = [
  {
    id: 1,
    slug: 'website-development',
    title: 'Website Development',
    description: 'Custom, responsive, and high-performance websites built to scale and drive conversions for your business.',
    heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop',
    techStack: ['React', 'Next.js', 'PostgreSQL'],
  },
  {
    id: 2,
    slug: 'application-development',
    title: 'Application Development',
    description: 'Robust mobile and web applications designed with user-centric functionality and seamless digital experiences.',
    heroImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1400&auto=format&fit=crop',
    techStack: ['React Native', 'Flutter', 'Node.js'],
  },
  {
    id: 3,
    slug: 'google-ads-meta-ads',
    title: 'Google Ads & Meta Ads',
    description: 'Data-driven advertising campaigns that maximize your ROI and put your brand in front of the right audience.',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop',
    techStack: ['Google Ads', 'Meta CAPI', 'GA4'],
  },
  {
    id: 4,
    slug: 'ui-ux-design',
    title: 'UI and UX Design',
    description: 'Intuitive, beautiful, and engaging interfaces that solve real user problems and elevate your brand identity.',
    heroImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1400&auto=format&fit=crop',
    techStack: ['Figma', 'Design System', 'Prototypes'],
  },
  {
    id: 5,
    slug: 'local-seo',
    title: 'Local SEO & Business Profile',
    description: 'Dominate local search rankings and optimize your business profile to attract more high-intent customers.',
    heroImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1400&auto=format&fit=crop',
    techStack: ['GBP Audit', 'NAP Network', 'Geo-Grid'],
  },
  {
    id: 6,
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'Comprehensive marketing strategies combining content, social, and SEO to accelerate your digital growth.',
    heroImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1400&auto=format&fit=crop',
    techStack: ['SEO Retainer', 'Content Engine', 'Attribution'],
  },
];

const ServicesSection = () => {
  const [services, setServices] = useState(DEFAULT_SERVICES);

  useEffect(() => {
    let isMounted = true;
    getServicesApi().then((res) => {
      if (isMounted && res && res.success && Array.isArray(res.services) && res.services.length > 0) {
        setServices(res.services);
      }
    }).catch((err) => console.warn('ServicesSection fetch error:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="services-section" id="services">
      {/* Wave transition from Tech Stack (dark) to Services (light) */}
      <div className="wave-divider wave-top">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#f8fafc" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="services-container">
        <div className="services-header">
          <span className="services-subtitle">— PRODUCTION CAPABILITIES</span>
          <h2 className="services-title">
            Services That Fit<br />
            <span className="text-accent">Your Needs</span>
          </h2>
        </div>

        <div className="services-grid">
          {services.map((service) => {
            const serviceHeroImage =
              service.heroImage ||
              'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop';

            const displayTags =
              service.techStack && service.techStack.length > 0
                ? service.techStack.slice(0, 3)
                : ['High Performance', 'Enterprise SLA', 'Modern Stack'];

            return (
              <div className="service-card" key={service._id || service.id || service.slug}>
                {/* Image Banner Header */}
                <div className="service-image-wrapper">
                  <img
                    src={serviceHeroImage}
                    alt={service.title}
                    className="service-card-img"
                    loading="lazy"
                  />
                  <div className="service-image-overlay" />

                  {/* Sleek Floating Frosted Glass Category Chip with Vector Icon */}
                  <div className="service-card-glass-pill">
                    <span className="glass-pill-icon">
                      {getServiceVectorIcon(service)}
                    </span>
                    <span className="glass-pill-text">
                      {getServiceCategory(service)}
                    </span>
                  </div>

                  {/* Subtle live indicator badge */}
                  <div className="service-card-live-dot" title="Active Agency Capability">
                    <span className="live-dot-glow" />
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="service-content">
                  <h3 className="service-card-title">{service.title}</h3>
                  <p className="service-card-desc">{service.description}</p>

                  {/* Micro Tech Tags */}
                  <div className="service-card-pills-row">
                    {displayTags.map((tag, idx) => (
                      <span key={idx} className="service-mini-pill">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Interactive Action Footer */}
                  <div className="service-card-action-bar">
                    <Link to={`/services/${service.slug}`} className="service-card-action-btn">
                      <span>Explore Solution</span>
                      <span className="action-arrow-box">
                        <FiArrowUpRight />
                      </span>
                    </Link>
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

export default ServicesSection;
