import React, { useState, useEffect } from 'react';
import {
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiFolder,
  FiMonitor,
  FiLayers,
  FiHeadphones,
  FiTrendingUp,
  FiBox,
  FiZap,
  FiSliders
} from 'react-icons/fi';
import './ServicePricing.css';

const getCategoryIcon = (categoryName = '') => {
  const n = categoryName.toLowerCase();
  if (n.includes('scope') || n.includes('deliverable') || n.includes('overview') || n.includes('platform')) {
    return <FiFolder className="category-section-icon" />;
  }
  if (
    n.includes('engineer') ||
    n.includes('ui') ||
    n.includes('ux') ||
    n.includes('experience') ||
    n.includes('design') ||
    n.includes('frontend') ||
    n.includes('web')
  ) {
    return <FiMonitor className="category-section-icon" />;
  }
  if (
    n.includes('integration') ||
    n.includes('function') ||
    n.includes('feature') ||
    n.includes('backend') ||
    n.includes('architecture') ||
    n.includes('devops')
  ) {
    return <FiLayers className="category-section-icon" />;
  }
  if (
    n.includes('support') ||
    n.includes('maintenance') ||
    n.includes('warranty') ||
    n.includes('guarantee')
  ) {
    return <FiHeadphones className="category-section-icon" />;
  }
  if (n.includes('seo') || n.includes('marketing') || n.includes('campaign') || n.includes('ad')) {
    return <FiTrendingUp className="category-section-icon" />;
  }
  return <FiLayers className="category-section-icon" />;
};

const getPackageMobileIcon = (pkg, index) => {
  const id = (pkg.id || '').toLowerCase();
  const name = (pkg.name || '').toLowerCase();
  if (id.includes('basic') || name.includes('basic') || index === 0) {
    return <FiBox />;
  }
  if (id.includes('advanced') || id.includes('standard') || name.includes('standard') || index === 1) {
    return <FiZap />;
  }
  return <FiSliders />;
};

// In the reference design, the middle package (index 1: Standard/Advanced) is the highlighted popular package
const isPopularPackage = (pkg, index) => {
  return index === 1;
};

const getPackageFeatureValue = (feature, pkg, index) => {
  if (feature[pkg.id] !== undefined) return feature[pkg.id];
  if (pkg.id === 'basic' || index === 0) {
    if (feature.basic !== undefined) return feature.basic;
  }
  if (pkg.id === 'advanced' || pkg.id === 'standard' || index === 1) {
    if (feature.advanced !== undefined) return feature.advanced;
    if (feature.standard !== undefined) return feature.standard;
  }
  if (pkg.id === 'custom' || index === 2) {
    if (feature.custom !== undefined) return feature.custom;
  }
  return '—';
};

const ServicePricing = ({ service, showWave = false, hideHeader = false }) => {
  if (!service || !service.pricing) return null;

  const { headline, subheadline, packages, featureCategories } = service.pricing;

  const [expandedPkgId, setExpandedPkgId] = useState(
    packages && packages.length > 0 ? packages[0].id : null
  );

  useEffect(() => {
    if (packages && packages.length > 0) {
      setExpandedPkgId(packages[0].id);
    }
  }, [service]);

  const renderFeatureValue = (val) => {
    if (typeof val === 'boolean') {
      if (val) {
        return (
          <span className="pricing-check-circle" title="Included">
            <FiCheck />
          </span>
        );
      }
      return <span className="pricing-dash" title="Not Included">—</span>;
    }
    if (val === null || val === undefined || val === '' || val === '-' || val === '—' || val === 'N/A') {
      return <span className="pricing-dash">—</span>;
    }
    return <span className="pricing-text-val">{val}</span>;
  };

  const getButtonLabel = (pkg, index, isPopular) => {
    if (pkg.btnText) {
      const cleaned = pkg.btnText.replace(/→|&rarr;/, '').trim();
      return cleaned;
    }
    if (index === 0) return 'Choose Basic';
    if (isPopular) return 'Choose Standard';
    return 'Contact Us';
  };

  return (
    <section className={`service-pricing-section ${hideHeader ? 'pricing-no-header' : ''}`} id="pricing-matrix">
      {showWave && (
        <div className="wave-divider wave-top">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f8fafc" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
          </svg>
        </div>
      )}

      {!hideHeader && (
        <div className="pricing-header-wrapper">
          <span className="pricing-section-badge">PRICING</span>
          <h2 className="pricing-section-headline">{headline}</h2>
          <p className="pricing-section-subheadline">{subheadline}</p>
        </div>
      )}

      {/* =========================================================
          DESKTOP TABLE VIEW (Screens > 860px)
          ========================================================= */}
      <div className="pricing-desktop-view">
        <div className="pricing-table-card">
          {/* Table Header Row */}
          <div className="desktop-table-header-row">
            {/* Col 1 */}
            <div className="desktop-header-cell col-features-scope">
              <span className="col-legend-title">Features & Scope</span>
            </div>

            {/* Package Columns */}
            {packages.map((pkg, idx) => {
              const isPopular = isPopularPackage(pkg, idx);
              const isCustom = (pkg.price || '').toLowerCase().includes('custom');

              return (
                <div
                  key={pkg.id}
                  className={`desktop-header-cell col-pkg-header ${
                    isPopular ? 'col-pkg-popular' : ''
                  }`}
                >
                  {/* Only the middle/popular column gets the floating badge */}
                  {isPopular && (
                    <div className="pkg-header-floating-badge">
                      <span className="badge-crown">👑</span>
                      <span>Most Popular</span>
                    </div>
                  )}

                  <div className="pkg-header-top-title">{pkg.name}</div>

                  <div className="pkg-header-price-row">
                    <span
                      className={`pkg-header-price ${
                        isCustom ? 'price-custom-quote' : ''
                      }`}
                    >
                      {pkg.price}
                    </span>
                    {pkg.period && !isCustom && (
                      <span className="pkg-header-period">/{pkg.period}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Body */}
          <div className="desktop-table-body">
            {featureCategories.map((cat, catIdx) => (
              <div className="desktop-cat-section" key={catIdx}>
                {/* Category Header Row */}
                <div className="desktop-cat-header-row">
                  <div className="desktop-cell cat-title-cell">
                    <span className="cat-header-icon-wrap">
                      {getCategoryIcon(cat.category)}
                    </span>
                    <span className="cat-header-text">{cat.category}</span>
                  </div>
                  {packages.map((pkg, idx) => {
                    const isPopular = isPopularPackage(pkg, idx);
                    return (
                      <div
                        key={pkg.id}
                        className={`desktop-cell cat-empty-cell ${
                          isPopular ? 'col-popular-bg' : ''
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Individual Feature Rows */}
                {cat.features.map((feature, fIdx) => (
                  <div className="desktop-feature-row" key={fIdx}>
                    <div className="desktop-cell feature-label-cell">
                      <span className="feature-title-text">{feature.name}</span>
                    </div>

                    {packages.map((pkg, idx) => {
                      const isPopular = isPopularPackage(pkg, idx);
                      const val = getPackageFeatureValue(feature, pkg, idx);
                      return (
                        <div
                          key={pkg.id}
                          className={`desktop-cell feature-val-cell ${
                            isPopular ? 'col-popular-bg' : ''
                          }`}
                        >
                          {renderFeatureValue(val)}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Table Footer CTA Row */}
          <div className="desktop-table-footer-row">
            <div className="desktop-cell footer-title-cell">
              <span className="footer-choose-title">Choose Your Package</span>
            </div>

            {packages.map((pkg, idx) => {
              const isPopular = isPopularPackage(pkg, idx);
              const isOutline = !isPopular;
              const label = getButtonLabel(pkg, idx, isPopular);

              return (
                <div
                  key={pkg.id}
                  className={`desktop-cell footer-cta-cell ${
                    isPopular ? 'col-popular-bg footer-popular-bottom' : ''
                  }`}
                >
                  <a
                    href="#contact-service"
                    className={`table-action-btn ${
                      isOutline ? 'btn-outline-blue' : 'btn-gradient-blue'
                    }`}
                  >
                    <span>{label}</span>
                    <span className="btn-arrow">&rarr;</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
          MOBILE ACCORDION VIEW (Screens <= 860px)
          ========================================================= */}
      <div className="pricing-mobile-accordion-view">
        {packages.map((pkg, idx) => {
          const isExpanded = expandedPkgId === pkg.id;
          const isPopular = isPopularPackage(pkg, idx);
          const isCustom = (pkg.price || '').toLowerCase().includes('custom');
          const btnLabel = getButtonLabel(pkg, idx, isPopular);

          return (
            <div
              key={pkg.id}
              className={`mobile-pkg-card ${
                isExpanded ? 'mobile-pkg-card-expanded' : ''
              } ${isPopular ? 'mobile-pkg-card-popular' : ''}`}
            >
              {/* Accordion Card Header */}
              <div
                className="mobile-pkg-header"
                onClick={() => setExpandedPkgId(isExpanded ? null : pkg.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
              >
                <div className="mobile-pkg-header-left">
                  <div className={`mobile-pkg-icon-wrap icon-theme-${idx % 3}`}>
                    {getPackageMobileIcon(pkg, idx)}
                  </div>
                  <div className="mobile-pkg-title-area">
                    <span className="mobile-pkg-name">{pkg.name}</span>
                    {isPopular && (
                      <span className="mobile-mini-badge">
                        👑 Most Popular
                      </span>
                    )}
                  </div>
                </div>

                <div className="mobile-pkg-header-right">
                  <div className="mobile-pkg-price-col">
                    <span
                      className={`mobile-pkg-price ${
                        isCustom ? 'mobile-price-custom' : ''
                      }`}
                    >
                      {pkg.price}
                    </span>
                    {pkg.period && !isCustom && (
                      <span className="mobile-pkg-period">/{pkg.period}</span>
                    )}
                  </div>
                  <div className="mobile-accordion-chevron">
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                </div>
              </div>

              {/* Accordion Card Body (When Expanded) */}
              {isExpanded && (
                <div className="mobile-pkg-body">
                  {featureCategories.map((cat, catIdx) => (
                    <div className="mobile-cat-group" key={catIdx}>
                      <div className="mobile-cat-title">
                        <span className="mobile-cat-icon">
                          {getCategoryIcon(cat.category)}
                        </span>
                        <span className="mobile-cat-name">{cat.category}</span>
                      </div>

                      <div className="mobile-features-list">
                        {cat.features.map((feature, fIdx) => (
                          <div className="mobile-feature-item" key={fIdx}>
                            <span className="mobile-feature-name">
                              {feature.name}
                            </span>
                            <div className="mobile-feature-value">
                              {renderFeatureValue(
                                getPackageFeatureValue(feature, pkg, idx)
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Card Bottom CTA Button */}
                  <div className="mobile-pkg-footer">
                    <a
                      href="#contact-service"
                      className="mobile-pkg-cta-btn"
                    >
                      <span>Choose {pkg.name}</span>
                      <span className="btn-arrow">&rarr;</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicePricing;
