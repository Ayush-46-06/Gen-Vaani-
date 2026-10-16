import React, { useState, useEffect } from 'react';
import { FiEye, FiExternalLink, FiX, FiGlobe, FiLoader } from 'react-icons/fi';
import { getPortfolioWebsitesApi } from '../../services/portfolioApi';
import './PortfolioGrid.css';

const PortfolioGrid = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch live websites from backend database on mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getPortfolioWebsitesApi(false)
      .then((res) => {
        if (isMounted) {
          if (res && res.success && Array.isArray(res.websites)) {
            setWebsites(res.websites);
          } else {
            setWebsites([]);
          }
        }
      })
      .catch((err) => {
        console.warn('Error fetching portfolio websites:', err);
        if (isMounted) setWebsites([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="portfolio-grid-section" id="portfolio-grid">
      <div className="portfolio-grid-container">
        {/* Loading State */}
        {loading && (
          <div className="portfolio-loading-state">
            <FiLoader className="spin-icon" />
            <p>Loading digital experiences & client works...</p>
          </div>
        )}

        {/* Empty State when no websites have been added from admin yet */}
        {!loading && websites.length === 0 && (
          <div className="portfolio-empty-showcase">
            <div className="empty-icon-halo">
              <FiGlobe />
            </div>
            <h3 className="empty-showcase-title">Showcase Being Curated</h3>
            <p className="empty-showcase-desc">
              New client digital products and websites are currently being curated. Check back soon or visit the Admin Panel to publish new websites.
            </p>
          </div>
        )}

        {/* 3-Column Athenura-Style Showcase Grid */}
        {!loading && websites.length > 0 && (
          <div className="portfolio-showcase-grid">
            {websites.map((project) => (
              <div className="portfolio-card-item" key={project._id || project.id}>
                {/* Card Header: Website Title */}
                <div className="portfolio-card-header">
                  <h3 className="card-project-title" title={project.title}>
                    {project.title}
                  </h3>
                  {project.category && (
                    <span className="card-category-badge">
                      {project.category}
                    </span>
                  )}
                </div>

                {/* Card Body: Animated Webpage Viewport */}
                <div className="portfolio-card-viewport">
                  <div className="portfolio-img-scroll-track">
                    <img
                      src={project.tallImage || project.image}
                      alt={project.title}
                      className="portfolio-scroll-image"
                      loading="lazy"
                    />
                  </div>

                  {/* Hover Glassmorphism Overlay */}
                  <div className="portfolio-hover-overlay">
                    {/* Floating Action Buttons */}
                    <div className="overlay-center-actions">
                      <button
                        type="button"
                        className="overlay-circle-btn btn-preview"
                        title="Quick Preview Project"
                        onClick={() => setSelectedProject(project)}
                      >
                        <FiEye />
                      </button>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="overlay-circle-btn btn-demo"
                          title="Visit Live Application"
                        >
                          <FiExternalLink />
                        </a>
                      )}
                    </div>

                    {/* Bottom Info on Hover */}
                    <div className="overlay-bottom-info">
                      <h4 className="overlay-project-name">{project.title}</h4>
                      {project.category && (
                        <span className="overlay-category-chip">
                          {project.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Athenura Scrollable Website Preview Modal (Matching Reference Exactly) */}
      {selectedProject && (
        <div className="portfolio-modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="site-preview-modal-window" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header Bar: ONLY Website Name on left, External link + Close on right */}
            <div className="site-modal-header-bar">
              <h2 className="site-modal-title">{selectedProject.title}</h2>
              <div className="site-modal-controls">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-modal-control-btn ext-link"
                    title="Open live website in new tab"
                  >
                    <FiExternalLink />
                  </a>
                )}
                <button
                  type="button"
                  className="site-modal-control-btn close-btn"
                  onClick={() => setSelectedProject(null)}
                  title="Close preview"
                  aria-label="Close"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {/* Modal Body: Only the Website Screenshot in Scrollable Format */}
            <div className="site-modal-scrollable-body">
              <img
                src={selectedProject.tallImage || selectedProject.image}
                alt={selectedProject.title}
                className="site-modal-scroll-img"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioGrid;
