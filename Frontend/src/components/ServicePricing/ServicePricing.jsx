import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiZap } from 'react-icons/fi';
import './ServicePricing.css';

const ServicePricing = ({ service, showWave = false, hideHeader = false }) => {
  if (!service || !service.pricing) return null;

  const { headline, subheadline, packages, featureCategories } = service.pricing;

  const renderFeatureValue = (val) => {
    if (typeof val === 'boolean') {
      if (val) {
        return (
          <span className="pricing-check-icon" title="Included">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        );
      }
      return (
        <span className="pricing-cross-icon" title="Not Included">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
      );
    }
    return <span className="pricing-text-val">{val}</span>;
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
          <span className="pricing-section-badge">— PACKAGES & PRICING</span>
          <h2 className="pricing-section-headline">{headline}</h2>
          <p className="pricing-section-subheadline">{subheadline}</p>
        </div>
      )}

      <div className="pricing-table-card">
        <div className="pricing-table-inner">
          {/* Top Badges Row */}
        <div className="pricing-table-badges-row">
          <div className="table-col-label"></div>
          {packages.map((pkg, idx) => (
            <div className="table-col-badge-cell" key={pkg.id}>
              {pkg.badge && (
                <div className={`pkg-top-badge ${pkg.badge.toLowerCase().includes('popular') ? 'badge-popular' : 'badge-essential'}`}>
                  <span className="badge-icon">
                    {pkg.badge.toLowerCase().includes('popular') ? <FiStar /> : <FiZap />}
                  </span>
                  <span>{pkg.badge}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Package Header Cards Row */}
        <div className="pricing-table-headers-row">
          <div className="table-col-label">
            <div className="table-legend-title">Features & Scope</div>
          </div>

          {packages.map((pkg) => (
            <div className="table-header-card-cell" key={pkg.id}>
              <div className="pkg-header-card">
                <h3 className="pkg-title">{pkg.name}</h3>
                <div className="pkg-price-row">
                  <span className="pkg-price">{pkg.price}</span>
                  {pkg.period && <span className="pkg-period">/{pkg.period}</span>}
                </div>
                <p className="pkg-desc">{pkg.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Categories & Rows */}
        <div className="pricing-table-body">
          {featureCategories.map((cat, catIdx) => (
            <div className="pricing-category-block" key={catIdx}>
              {/* Category Header Row */}
              <div className="pricing-category-header-row">
                <div className="table-col-label category-title-cell">
                  <h4>{cat.category}</h4>
                </div>
                <div className="table-col-cell"></div>
                <div className="table-col-cell"></div>
                <div className="table-col-cell"></div>
              </div>

              {/* Individual Feature Rows */}
              {cat.features.map((feature, fIdx) => (
                <div className="pricing-feature-row" key={fIdx}>
                  <div className="table-col-label feature-name-cell">
                    <span className="feature-name">{feature.name}</span>
                  </div>

                  <div className="table-col-cell feature-val-cell">
                    {renderFeatureValue(feature.basic)}
                  </div>

                  <div className="table-col-cell feature-val-cell feature-val-highlight">
                    {renderFeatureValue(feature.advanced)}
                  </div>

                  <div className="table-col-cell feature-val-cell">
                    {renderFeatureValue(feature.custom)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom CTA Action Row */}
        <div className="pricing-table-footer-row">
          <div className="table-col-label"></div>

          {packages.map((pkg) => (
            <div className="table-footer-cell" key={pkg.id}>
              <a 
                href="#contact-service"
                className={`pkg-cta-btn btn-${pkg.btnStyle}`}
              >
                {pkg.btnText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
  );
};

export default ServicePricing;
