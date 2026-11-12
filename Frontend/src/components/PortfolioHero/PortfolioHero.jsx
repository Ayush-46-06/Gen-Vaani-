import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PortfolioHero.css';

const industries = [
  {
    id: 'digital-products',
    label: 'DIGITAL PRODUCTS',
    tag: 'Project Management',
    cardKey: 'saas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    )
  },
  {
    id: 'branding',
    label: 'BRANDING',
    tag: 'Sports Management',
    cardKey: 'brand',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
      </svg>
    )
  },
  {
    id: 'web-experiences',
    label: 'WEB EXPERIENCES',
    tag: 'Web Application',
    cardKey: 'realestate',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    )
  },
  {
    id: 'mobile-apps',
    label: 'MOBILE APPS',
    tag: 'Education Management',
    cardKey: 'healthcare',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </svg>
    )
  }
];

const mockupsData = [
  {
    key: 'ecommerce',
    title: 'Everyday Essentials, Elevated',
    category: 'Ecommerce & Headless Commerce',
    label: 'Ecommerce',
    img: '/mockup-ecommerce.png',
    arrowPos: 'top',
    description: 'Minimalist organic wellness and skincare storefront with sub-second page transitions and fluid cart checkout.'
  },
  {
    key: 'saas',
    title: 'DATAVA Analytics Dashboard',
    category: 'SaaS Product & Metrics',
    label: 'SaaS Product',
    img: '/mockup-saas.png',
    arrowPos: 'top-right',
    description: 'Enterprise revenue attribution and user growth metrics console with live event stream processing.'
  },
  {
    key: 'healthcare',
    title: 'Pulse Healthcare Telemedicine',
    category: 'Healthcare Mobile App',
    label: 'Healthcare App',
    img: '/mockup-healthcare.png',
    arrowPos: 'left',
    description: 'Patient appointment scheduling, instant doctor consultations, and health record vaults.'
  },
  {
    key: 'brand',
    title: 'AURIA Natural Skincare',
    category: 'Brand Identity & Packaging',
    label: 'Brand Identity',
    img: '/auria-brand.jpg',
    arrowPos: 'right',
    description: 'Comprehensive luxury packaging identity, tactile box typography, and sustainable material palette.'
  },
  {
    key: 'realestate',
    title: 'Villa Nero Architecture',
    category: 'Web Experience & Real Estate',
    label: null,
    img: '/mockup-realestate.png',
    arrowPos: null,
    description: 'Editorial property presentation showcasing high-end architectural villas with interactive viewing tours.'
  },
  {
    key: 'logistics',
    title: 'SwiftFleet Shipment Tracker',
    category: 'Logistics & Supply Chain',
    label: 'Logistics',
    img: '/mockup-logistics.png',
    arrowPos: 'bottom-left',
    description: 'Real-time vehicle tracking radar with route optimization and predictive milestone notifications.'
  }
];

const PortfolioHero = ({ searchQuery = '', setSearchQuery, selectedTag = 'All', setSelectedTag }) => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isHoveringStage, setIsHoveringStage] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);

  // Auto-cycle through the carousel projects when user is not hovering the stage
  useEffect(() => {
    if (isHoveringStage) return;

    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % mockupsData.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [isHoveringStage]);

  const scrollToGrid = () => {
    const gridElem = document.getElementById('portfolio-grid');
    if (gridElem) {
      gridElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleIndustryClick = (item) => {
    const targetIdx = mockupsData.findIndex(m => m.key === item.cardKey);
    if (targetIdx !== -1) setCarouselIndex(targetIdx);
    if (setSelectedTag) {
      setSelectedTag(item.tag);
    }
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % mockupsData.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + mockupsData.length) % mockupsData.length);
  };

  const currentProject = mockupsData[carouselIndex];

  return (
    <section className="portfolio-hero-refined" ref={heroRef}>
      {/* Background Ambient Glow Meshes */}
      <div className="portfolio-hero-aura aura-peach" aria-hidden="true"></div>
      <div className="portfolio-hero-aura aura-lavender" aria-hidden="true"></div>
      <div className="portfolio-hero-aura aura-apricot" aria-hidden="true"></div>
      <div className="portfolio-hero-aura aura-cyan" aria-hidden="true"></div>

      <div className="portfolio-hero-inner">
        {/* LEFT COLUMN: Editorial Typography & CTAs */}
        <div className="portfolio-hero-left">
          {/* Eyebrow */}
          <div className="portfolio-hero-eyebrow">
            <span>OUR WORK</span>
            {/* <div className="eyebrow-divider" aria-hidden="true"></div> */}
          </div>

          {/* Main Headline with dual typography: Sans Bold + Serif Italic */}
          <h1 className="portfolio-hero-headline">
            <span className="headline-line-bold">Ideas into impact.</span>
            <span className="headline-line-serif">Work across every world.</span>
          </h1>

          {/* Subtitle */}
          <p className="portfolio-hero-description">
            A selection of digital experiences, brands, and products we've built to move businesses forward.
          </p>

          {/* Action CTAs */}
          <div className="portfolio-hero-actions">
            <button
              type="button"
              className="portfolio-btn-primary"
              onClick={scrollToGrid}
            >
              <span>Explore our work</span>
              <span className="btn-arrow-icon" aria-hidden="true">↗</span>
            </button>

            <button
              type="button"
              className="portfolio-btn-secondary"
              onClick={() => navigate('/contact')}
            >
              Start a project
            </button>
          </div>

          {/* Industry Selection Strip */}
          <div className="portfolio-industry-strip">
            <div className="industry-strip-label">
              SELECTED WORK ACROSS INDUSTRIES
            </div>

            <div className="industry-pills-row">
              {industries.map((ind, index) => {
                const isSpotlight = currentProject?.key === ind.cardKey;
                const isFilterActive = selectedTag === ind.tag;
                return (
                  <React.Fragment key={ind.id}>
                    <button
                      type="button"
                      className={`industry-pill-btn ${isSpotlight ? 'active-spotlight' : ''} ${isFilterActive ? 'active' : ''}`}
                      onClick={() => handleIndustryClick(ind)}
                      onMouseEnter={() => {
                        setIsHoveringStage(true);
                        const idx = mockupsData.findIndex(m => m.key === ind.cardKey);
                        if (idx !== -1) setCarouselIndex(idx);
                      }}
                      onMouseLeave={() => setIsHoveringStage(false)}
                      title={`Focus ${ind.label}`}
                    >
                      <span className="pill-icon">{ind.icon}</span>
                      <span className="pill-text">{ind.label}</span>
                    </button>
                    {index < industries.length - 1 && (
                      <span className="industry-separator" aria-hidden="true">•</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Perspective Carousel */}
        <div 
          className="portfolio-hero-right"
          onMouseEnter={() => setIsHoveringStage(true)}
          onMouseLeave={() => setIsHoveringStage(false)}
        >
          <div className="carousel-stage-wrapper">
            <div className="carousel-3d-track">
              {mockupsData.map((item, idx) => {
                let offset = idx - carouselIndex;
                const total = mockupsData.length;
                if (offset < -Math.floor(total / 2)) offset += total;
                if (offset > Math.floor(total / 2)) offset -= total;

                const isCurrent = offset === 0;
                const isPrev = offset === -1;
                const isNext = offset === 1;
                const isVisible = Math.abs(offset) <= 2;

                if (!isVisible) return null;

                return (
                  <div
                    key={item.key}
                    className={`carousel-card-item ${isCurrent ? 'current' : ''} ${isPrev ? 'prev' : ''} ${isNext ? 'next' : ''}`}
                    onClick={() => {
                      if (isCurrent) {
                        setSelectedPreview(item);
                      } else {
                        setCarouselIndex(idx);
                      }
                    }}
                  >
                    <div className="carousel-card-inner">
                      <div className="carousel-card-header">
                        <span className="carousel-tag">{item.category}</span>
                        <span className="carousel-expand-hint">Preview ↗</span>
                      </div>
                      <div className="carousel-img-wrap">
                        <img src={item.img} alt={item.title} />
                      </div>
                      <div className="carousel-card-footer">
                        <h4 className="carousel-project-title">{item.title}</h4>
                        <p className="carousel-project-desc">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows & Indicators */}
            <div className="carousel-controls-bar">
              <button
                type="button"
                className="carousel-nav-btn prev"
                onClick={prevSlide}
                aria-label="Previous project"
              >
                ←
              </button>
              <div className="carousel-indicators">
                {mockupsData.map((m, idx) => (
                  <button
                    key={m.key}
                    type="button"
                    className={`carousel-dot ${idx === carouselIndex ? 'active' : ''}`}
                    onClick={() => setCarouselIndex(idx)}
                    aria-label={`Go to project ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="carousel-nav-btn next"
                onClick={nextSlide}
                aria-label="Next project"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal / Lightbox when a user clicks any mockup */}
      {selectedPreview && (
        <div className="portfolio-preview-modal-backdrop" onClick={() => setSelectedPreview(null)}>
          <div className="portfolio-preview-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="modal-close-btn" 
              onClick={() => setSelectedPreview(null)}
              aria-label="Close preview"
            >
              ✕
            </button>
            <div className="modal-img-container">
              <img src={selectedPreview.img} alt={selectedPreview.title} />
            </div>
            <div className="modal-content">
              <span className="modal-category-badge">{selectedPreview.category}</span>
              <h3 className="modal-title">{selectedPreview.title}</h3>
              <p className="modal-description">{selectedPreview.description}</p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-action-btn primary"
                  onClick={() => {
                    setSelectedPreview(null);
                    scrollToGrid();
                  }}
                >
                  Explore More Projects ↓
                </button>
                <button
                  type="button"
                  className="modal-action-btn secondary"
                  onClick={() => {
                    setSelectedPreview(null);
                    navigate('/contact');
                  }}
                >
                  Start Project Like This ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioHero;
