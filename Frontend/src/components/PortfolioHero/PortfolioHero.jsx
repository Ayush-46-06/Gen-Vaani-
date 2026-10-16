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
  const mockupStageRef = useRef(null);
  const [activeHoverCard, setActiveHoverCard] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);

  // Smooth mouse parallax effect on the floating mockup stage
  useEffect(() => {
    const stage = mockupStageRef.current;
    if (!stage) return;

    let rafId;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 22; // max degrees/pixels
      targetY = y * 22;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (stage) {
        stage.style.setProperty('--mouse-tilt-x', `${(-currentY * 0.4).toFixed(2)}deg`);
        stage.style.setProperty('--mouse-tilt-y', `${(currentX * 0.4).toFixed(2)}deg`);
        stage.style.setProperty('--mouse-shift-x', `${(currentX * 0.6).toFixed(2)}px`);
        stage.style.setProperty('--mouse-shift-y', `${(currentY * 0.6).toFixed(2)}px`);
      }

      rafId = requestAnimationFrame(animate);
    };

    const heroElem = heroRef.current;
    if (heroElem) {
      heroElem.addEventListener('mousemove', handleMouseMove);
      heroElem.addEventListener('mouseleave', handleMouseLeave);
      rafId = requestAnimationFrame(animate);
    }

    return () => {
      if (heroElem) {
        heroElem.removeEventListener('mousemove', handleMouseMove);
        heroElem.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToGrid = () => {
    const gridElem = document.getElementById('portfolio-grid');
    if (gridElem) {
      gridElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleIndustryClick = (item) => {
    if (setSelectedTag) {
      setSelectedTag(item.tag);
    }
    scrollToGrid();
  };

  return (
    <section className="portfolio-hero-refined" ref={heroRef}>
      {/* Background Ambient Glow Meshes matching reference */}
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
            <div className="eyebrow-divider" aria-hidden="true"></div>
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
                const isActive = selectedTag === ind.tag;
                return (
                  <React.Fragment key={ind.id}>
                    <button
                      type="button"
                      className={`industry-pill-btn ${isActive ? 'active' : ''} ${activeHoverCard === ind.cardKey ? 'hover-linked' : ''}`}
                      onClick={() => handleIndustryClick(ind)}
                      onMouseEnter={() => setActiveHoverCard(ind.cardKey)}
                      onMouseLeave={() => setActiveHoverCard(null)}
                      title={`Filter by ${ind.label}`}
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

        {/* RIGHT COLUMN: 3D Layered Floating Mockups Stage */}
        <div className="portfolio-hero-right">
          <div className="mockups-stage-wrapper" ref={mockupStageRef}>
            {/* Background ambient container glow */}
            <div className="stage-glow-ambient" aria-hidden="true"></div>

            {/* CARD 1: Ecommerce (Everyday Essentials, Elevated) */}
            <div 
              className={`mockup-floating-card card-ecommerce ${activeHoverCard === 'ecommerce' ? 'highlighted' : ''}`}
              onMouseEnter={() => setActiveHoverCard('ecommerce')}
              onMouseLeave={() => setActiveHoverCard(null)}
              onClick={() => setSelectedPreview(mockupsData[0])}
            >
              {/* Handwritten Note + Vector Arrow */}
              <div className="annotation-badge annotation-ecommerce" aria-hidden="true">
                <span className="handwritten-text">Ecommerce</span>
                <svg className="handwritten-arrow arrow-ecommerce" viewBox="0 0 65 45" fill="none">
                  <path d="M 12 34 C 20 12 40 8 54 26" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 45 28 L 54 26 L 52 16" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="mockup-frame browser-frame">
                <div className="browser-header">
                  <span className="traffic-dot dot-red"></span>
                  <span className="traffic-dot dot-yellow"></span>
                  <span className="traffic-dot dot-green"></span>
                  <div className="browser-address">soja-essentials.com</div>
                </div>
                <img
                  src="/mockup-ecommerce.png"
                  alt="Ecommerce Everyday Essentials, Elevated"
                  className="mockup-img"
                  loading="eager"
                />
              </div>
            </div>

            {/* CARD 2: SaaS Product (Good morning! Analytics Dashboard) */}
            <div 
              className={`mockup-floating-card card-saas ${activeHoverCard === 'saas' ? 'highlighted' : ''}`}
              onMouseEnter={() => setActiveHoverCard('saas')}
              onMouseLeave={() => setActiveHoverCard(null)}
              onClick={() => setSelectedPreview(mockupsData[1])}
            >
              {/* Handwritten Note + Vector Arrow */}
              <div className="annotation-badge annotation-saas" aria-hidden="true">
                <span className="handwritten-text">SaaS Product</span>
                <svg className="handwritten-arrow arrow-saas" viewBox="0 0 45 55" fill="none">
                  <path d="M 28 8 C 15 22 14 36 20 44" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 12 37 L 20 44 L 23 34" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="mockup-frame dashboard-frame">
                <img
                  src="/mockup-saas.png"
                  alt="SaaS Product Analytics Console"
                  className="mockup-img"
                  loading="eager"
                />
              </div>
            </div>

            {/* CARD 3: Healthcare App (Good Morning, Take care of your health) */}
            <div 
              className={`mockup-floating-card card-healthcare ${activeHoverCard === 'healthcare' ? 'highlighted' : ''}`}
              onMouseEnter={() => setActiveHoverCard('healthcare')}
              onMouseLeave={() => setActiveHoverCard(null)}
              onClick={() => setSelectedPreview(mockupsData[2])}
            >
              {/* Handwritten Note + Vector Arrow */}
              <div className="annotation-badge annotation-healthcare" aria-hidden="true">
                <span className="handwritten-text">Healthcare<br />App</span>
                <svg className="handwritten-arrow arrow-healthcare" viewBox="0 0 55 45" fill="none">
                  <path d="M 8 18 C 22 36 38 32 46 16" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 37 17 L 46 16 L 45 25" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="mockup-frame mobile-frame">
                <div className="phone-notch">
                  <span className="speaker-pill"></span>
                </div>
                <img
                  src="/mockup-healthcare.png"
                  alt="Healthcare Mobile App"
                  className="mockup-img"
                  loading="eager"
                />
              </div>
            </div>

            {/* CARD 4: Brand Identity (AURIA Skincare Packaging) */}
            <div 
              className={`mockup-floating-card card-brand ${activeHoverCard === 'brand' ? 'highlighted' : ''}`}
              onMouseEnter={() => setActiveHoverCard('brand')}
              onMouseLeave={() => setActiveHoverCard(null)}
              onClick={() => setSelectedPreview(mockupsData[3])}
            >
              {/* Handwritten Note + Vector Arrow */}
              <div className="annotation-badge annotation-brand" aria-hidden="true">
                <span className="handwritten-text">Brand<br />Identity</span>
                <svg className="handwritten-arrow arrow-brand" viewBox="0 0 50 55" fill="none">
                  <path d="M 38 12 C 22 28 16 38 12 46" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 12 36 L 12 46 L 22 45" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="mockup-frame package-frame">
                <img
                  src="/auria-brand.jpg"
                  alt="AURIA Brand Identity Packaging"
                  className="mockup-img"
                  loading="eager"
                />
              </div>
            </div>

            {/* CARD 5: Web Experiences / Real Estate (Villa Nero Modern Homes) */}
            <div 
              className={`mockup-floating-card card-realestate ${activeHoverCard === 'realestate' ? 'highlighted' : ''}`}
              onMouseEnter={() => setActiveHoverCard('realestate')}
              onMouseLeave={() => setActiveHoverCard(null)}
              onClick={() => setSelectedPreview(mockupsData[4])}
            >
              <div className="mockup-frame luxury-frame">
                <img
                  src="/mockup-realestate.png"
                  alt="Villa Nero Modern Architecture Web Experience"
                  className="mockup-img"
                  loading="eager"
                />
              </div>
            </div>

            {/* CARD 6: Logistics (Track Your Shipment) */}
            <div 
              className={`mockup-floating-card card-logistics ${activeHoverCard === 'logistics' ? 'highlighted' : ''}`}
              onMouseEnter={() => setActiveHoverCard('logistics')}
              onMouseLeave={() => setActiveHoverCard(null)}
              onClick={() => setSelectedPreview(mockupsData[5])}
            >
              {/* Handwritten Note + Vector Arrow */}
              <div className="annotation-badge annotation-logistics" aria-hidden="true">
                <span className="handwritten-text">Logistics</span>
                <svg className="handwritten-arrow arrow-logistics" viewBox="0 0 60 40" fill="none">
                  <path d="M 10 24 C 24 34 42 32 52 14" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 42 15 L 52 14 L 51 24" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="mockup-frame tracker-frame">
                <img
                  src="/mockup-logistics.png"
                  alt="Logistics Real-Time Shipment Tracker"
                  className="mockup-img"
                  loading="eager"
                />
              </div>
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
