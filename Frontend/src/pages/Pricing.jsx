import React, { useState, useEffect } from 'react';
import { servicesData } from '../data/servicesData';
import { getServicesApi } from '../services/serviceApi';
import ServicePricing from '../components/ServicePricing/ServicePricing';
import { Link } from 'react-router-dom';
import {
  FiGlobe,
  FiSmartphone,
  FiTrendingUp,
  FiLayers,
  FiMapPin,
  FiSend,
  FiCpu
} from 'react-icons/fi';
import './Pricing.css';

const getPricingTabIcon = (slug = '') => {
  const s = slug.toLowerCase();
  if (s.includes('web')) return <FiGlobe />;
  if (s.includes('app') || s.includes('mobile')) return <FiSmartphone />;
  if (s.includes('ad') || s.includes('google') || s.includes('meta')) return <FiTrendingUp />;
  if (s.includes('design') || s.includes('ui') || s.includes('ux')) return <FiLayers />;
  if (s.includes('seo') || s.includes('local')) return <FiMapPin />;
  if (s.includes('marketing')) return <FiSend />;
  return <FiCpu />;
};

const DEFAULT_SERVICES_LIST = [
  { slug: 'website-development', name: 'Website Development' },
  { slug: 'application-development', name: 'App Development' },
  { slug: 'google-ads-meta-ads', name: 'Google & Meta Ads' },
  { slug: 'ui-ux-design', name: 'UI & UX Design' },
  { slug: 'local-seo', name: 'Local SEO' },
  { slug: 'digital-marketing', name: 'Digital Marketing' },
];

const Pricing = () => {
  const [selectedSlug, setSelectedSlug] = useState('website-development');
  const [servicesList, setServicesList] = useState(DEFAULT_SERVICES_LIST);
  const [dynamicServicesMap, setDynamicServicesMap] = useState({});
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    let isMounted = true;
    getServicesApi().then((res) => {
      if (isMounted && res && res.success && Array.isArray(res.services) && res.services.length > 0) {
        const list = res.services.map((s) => ({
          slug: s.slug,
          name: s.title,
          icon: s.icon || '⚡',
        }));
        setServicesList(list);

        const map = {};
        res.services.forEach((s) => {
          map[s.slug] = s;
        });
        setDynamicServicesMap(map);
      }
    }).catch((err) => console.warn('Pricing services fetch error:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const currentService = dynamicServicesMap[selectedSlug] || servicesData[selectedSlug] || servicesData['website-development'];

  const globalFaqs = [
    {
      q: 'Can I customize a package to fit my specific requirements?',
      a: 'Yes, absolutely! While our Basic and Advanced packages cover the vast majority of needs, our Custom Package is built entirely around your business goals, timelines, and specialized workflows.'
    },
    {
      q: 'Are there any hidden fees or recurring commitments?',
      a: 'None whatsoever. All one-time deliverables and monthly retainers are clearly stated upfront with transparent agreements. You have full ownership of all source code, assets, and design files.'
    },
    {
      q: 'What is the payment schedule for projects?',
      a: 'For one-time projects, we generally operate on a 50% deposit and 50% upon final launch and sign-off. For monthly marketing and SEO retainers, invoices are processed at the beginning of each billing cycle.'
    },
    {
      q: 'What happens after my project launches?',
      a: 'All packages include our post-launch warranty period where any bugs or edge cases are resolved free of charge. We also offer continuous maintenance, cloud hosting, and growth optimization retainers.'
    }
  ];

  return (
    <div className="pricing-page">
      {/* Top Hero Section */}
      <section className="pricing-hero-header">
        <div className="pricing-hero-content">
          <span className="pricing-tag">PRICING</span>
          <h1 className="pricing-main-title">
            Choose the Package That Fits <span className="text-highlight">Your Ambition</span>
          </h1>
          <p className="pricing-main-desc">
            From high-converting landing sites to bespoke enterprise platforms, we build solutions that drive real business results.
          </p>

          {/* Interactive Service Filter Tabs */}
          <div className="pricing-service-tabs-wrapper">
            <div className="pricing-service-tabs">
              {servicesList.map((svc) => (
                <button
                  key={svc.slug}
                  className={`service-tab-pill ${selectedSlug === svc.slug ? 'tab-pill-active' : ''}`}
                  onClick={() => setSelectedSlug(svc.slug)}
                >
                  <span className="tab-pill-icon">{getPricingTabIcon(svc.slug)}</span>
                  <span className="tab-pill-name">{svc.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Dynamic Service Pricing Table */}
      <div className="pricing-matrix-container">
        <ServicePricing service={currentService} hideHeader={true} />
      </div>

      {/* Global FAQ & Booking Banner */}
      <section className="pricing-faq-banner" id="contact-service">
        <div className="pricing-faq-container">
          <div className="faq-banner-left">
            <span className="faq-badge">— COMMON QUESTIONS</span>
            <h2 className="faq-heading">Frequently Asked Questions</h2>
            <p className="faq-summary">
              Have questions about our pricing structure, deliverables, or ongoing support? We are here to help.
            </p>

            <div className="consult-box">
              <h3>Need a tailored estimate?</h3>
              <p>Book a discovery call with our technical leadership to get an exact quote for your project.</p>
              <Link to="/about" className="consult-btn">Book an Appointment &rarr;</Link>
            </div>
          </div>

          <div className="faq-banner-right">
            <div className="faq-cards-list">
              {globalFaqs.map((faq, i) => (
                <div 
                  className={`faq-card ${activeFaq === i ? 'faq-card-active' : ''}`}
                  key={i}
                  onClick={() => setActiveFaq(activeFaq === i ? -1 : i)}
                >
                  <div className="faq-card-header">
                    <h4>{faq.q}</h4>
                    <span className="faq-toggle-icon">{activeFaq === i ? '−' : '+'}</span>
                  </div>
                  {activeFaq === i && (
                    <div className="faq-card-body">
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

export default Pricing;
