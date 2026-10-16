import React, { useState, useEffect } from 'react';
import {
  FiX,
  FiSave,
  FiCheck,
  FiPlus,
  FiTrash2,
  FiLayers,
  FiDollarSign,
  FiActivity,
  FiHelpCircle,
  FiCpu,
  FiImage,
  FiInfo
} from 'react-icons/fi';
import { createServiceApi, updateServiceApi } from '../../services/serviceApi';

const DEFAULT_EMPTY_SERVICE = {
  title: '',
  slug: '',
  titleLine1: '',
  titleLine2: '',
  subtitle: '',
  description: '',
  icon: '⚡',
  ctaText: 'BOOK NOW',
  badgeTitle: 'Performance Score',
  badgeValue: '99/100 Core Vitals',
  statCount: '100k+',
  statLabel: 'Users impacted',
  heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop',
  pricing: {
    headline: 'Pricing & Packages',
    subheadline: 'Select the package that fits your ambition — from MVP releases to bespoke enterprise platforms.',
    packages: [
      {
        id: 'basic',
        name: 'Basic Package',
        badge: '',
        price: '$999',
        period: 'one-time',
        desc: 'Essential foundation to establish credibility and capture qualified leads.',
        btnText: 'Start Basic',
        btnStyle: 'outline',
      },
      {
        id: 'advanced',
        name: 'Advanced Package',
        badge: 'Essential',
        price: '$2,499',
        period: 'one-time',
        desc: 'High-performance solution with custom integrations and advanced architecture.',
        btnText: 'Choose Advanced',
        btnStyle: 'gradient',
      },
      {
        id: 'custom',
        name: 'Custom Package',
        badge: 'Most Popular',
        price: 'Custom',
        period: 'tailored scope',
        desc: 'Full-scale enterprise digital platform with custom database architectures and API integrations.',
        btnText: 'Go Custom',
        btnStyle: 'solid',
      },
    ],
    featureCategories: [],
  },
  workflow: {
    tag: 'WORKFLOW',
    titlePrefix: 'From Concept to',
    titleHighlight: 'Deployment',
    subtitle: 'A transparent, agile methodology designed to mitigate risk and deliver value at every stage.',
    steps: [
      { step: 1, title: 'Discovery & Scoping', desc: 'Requirements analysis and defining technical KPIs.', icon: 'search' },
      { step: 2, title: 'Architecture & Design', desc: 'Wireframing, prototypes, and system blueprints.', icon: 'design' },
      { step: 3, title: 'Agile Development', desc: 'Modular sprints with clean code and modern frameworks.', icon: 'code' },
      { step: 4, title: 'QA & Stress Testing', desc: 'Unit testing, cross-browser audits, and security checks.', icon: 'testing' },
      { step: 5, title: 'Global Deployment', desc: 'Zero-downtime deployment with 24/7 monitoring.', icon: 'rocket' },
    ],
  },
  features: [
    { icon: '⚡', title: 'High Performance', desc: 'Sub-second load times engineered with modern frameworks.' },
    { icon: '🔒', title: 'Enterprise Security', desc: 'Built with SSL, automated backups, and defense-in-depth.' },
    { icon: '🎯', title: 'Conversion-Focused', desc: 'Strategic CTA placements and frictionless user funnels.' },
    { icon: '📱', title: 'Adaptive Mobile Design', desc: 'Responsive across smartphones, tablets, and desktops.' },
  ],
  techStack: ['React', 'Node.js', 'Next.js', 'PostgreSQL', 'Tailwind CSS'],
  faqs: [
    { q: 'What is the turnaround timeline?', a: 'Standard projects typically take 2-4 weeks, while complex platforms take 4-8 weeks.' },
    { q: 'Who owns the final source code and designs?', a: 'You own 100% of all intellectual property, source code, and design files.' },
    { q: 'Do you provide ongoing support after launch?', a: 'Yes, we provide ongoing maintenance, security updates, and performance monitoring.' },
  ],
  activeProjects: 4,
  order: 10,
  isActive: true,
};

export default function ServiceEditorModal({ isOpen, onClose, service, onSaved, token }) {
  const isEditing = Boolean(service && (service._id || service.id));
  const [formData, setFormData] = useState(DEFAULT_EMPTY_SERVICE);
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        ...DEFAULT_EMPTY_SERVICE,
        ...service,
        pricing: {
          ...DEFAULT_EMPTY_SERVICE.pricing,
          ...(service.pricing || {}),
          packages: service.pricing?.packages?.length
            ? service.pricing.packages
            : DEFAULT_EMPTY_SERVICE.pricing.packages,
        },
        workflow: {
          ...DEFAULT_EMPTY_SERVICE.workflow,
          ...(service.workflow || {}),
          steps: service.workflow?.steps?.length
            ? service.workflow.steps
            : DEFAULT_EMPTY_SERVICE.workflow.steps,
        },
        features: service.features?.length ? service.features : DEFAULT_EMPTY_SERVICE.features,
        techStack: service.techStack?.length ? service.techStack : DEFAULT_EMPTY_SERVICE.techStack,
        faqs: service.faqs?.length ? service.faqs : DEFAULT_EMPTY_SERVICE.faqs,
      });
      setTechInput('');
    } else {
      setFormData(DEFAULT_EMPTY_SERVICE);
      setTechInput('');
    }
    setActiveTab('basic');
    setErrorMsg('');
  }, [service, isOpen]);

  if (!isOpen) return null;

  const handleBasicChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-suggest slug & title lines if creating and modifying title
      if (field === 'title' && !isEditing) {
        if (!prev.slug || prev.slug === '') {
          updated.slug = value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
        }
        const parts = value.trim().split(' ');
        if (parts.length > 1) {
          updated.titleLine1 = parts[0] + ' &';
          updated.titleLine2 = parts.slice(1).join(' ');
        } else {
          updated.titleLine1 = value;
          updated.titleLine2 = '';
        }
      }
      return updated;
    });
  };

  const handlePricingChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value,
      },
    }));
  };

  const handlePackageChange = (index, field, value) => {
    setFormData((prev) => {
      const nextPkgs = [...(prev.pricing?.packages || [])];
      nextPkgs[index] = { ...nextPkgs[index], [field]: value };
      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          packages: nextPkgs,
        },
      };
    });
  };

  const handleWorkflowChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      workflow: {
        ...prev.workflow,
        [field]: value,
      },
    }));
  };

  const handleWorkflowStepChange = (index, field, value) => {
    setFormData((prev) => {
      const nextSteps = [...(prev.workflow?.steps || [])];
      nextSteps[index] = { ...nextSteps[index], [field]: value };
      return {
        ...prev,
        workflow: {
          ...prev.workflow,
          steps: nextSteps,
        },
      };
    });
  };

  const handleFeatureChange = (index, field, value) => {
    setFormData((prev) => {
      const nextFeatures = [...(prev.features || [])];
      nextFeatures[index] = { ...nextFeatures[index], [field]: value };
      return { ...prev, features: nextFeatures };
    });
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [
        ...(prev.features || []),
        { icon: '⭐', title: 'New Capability', desc: 'Describe the key value or technical deliverable.' },
      ],
    }));
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleAddTech = (e) => {
    e.preventDefault();
    if (!techInput.trim()) return;
    if (!formData.techStack.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()],
      }));
    }
    setTechInput('');
  };

  const handleRemoveTech = (index) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index),
    }));
  };

  const handleFaqChange = (index, field, value) => {
    setFormData((prev) => {
      const nextFaqs = [...(prev.faqs || [])];
      nextFaqs[index] = { ...nextFaqs[index], [field]: value };
      return { ...prev, faqs: nextFaqs };
    });
  };

  const handleAddFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...(prev.faqs || []),
        { q: 'New question here?', a: 'Provide a clear, reassuring answer for prospective clients.' },
      ],
    }));
  };

  const handleRemoveFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title?.trim()) {
      setErrorMsg('Service Title is required.');
      setActiveTab('basic');
      return;
    }

    if (!formData.description?.trim()) {
      setErrorMsg('Service short description is required.');
      setActiveTab('basic');
      return;
    }

    setLoading(true);

    try {
      let res;
      if (isEditing) {
        const id = service._id || service.id;
        res = await updateServiceApi(id, formData, token);
      } else {
        res = await createServiceApi(formData, token);
      }

      if (res && res.success) {
        if (onSaved) {
          onSaved(res.service || formData);
        }
        onClose();
      } else {
        setErrorMsg(res?.message || 'Failed to save service.');
      }
    } catch (err) {
      console.error('Error saving service:', err);
      setErrorMsg('An unexpected error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-overlay animate-fade-in">
      <div className="admin-modal-card service-editor-modal">
        {/* Header */}
        <div className="admin-modal-header">
          <div className="modal-title-wrap">
            <span className="modal-badge-icon"><FiLayers /></span>
            <div>
              <h3>{isEditing ? `Edit Service: ${formData.title || 'Service'}` : 'Create New Agency Service'}</h3>
              <p>Configure complete service specifications, workflow, deliverables, and live pricing tiers.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn" title="Close editor">
            <FiX />
          </button>
        </div>

        {errorMsg && (
          <div className="admin-modal-error">
            <FiInfo /> {errorMsg}
          </div>
        )}

        {/* Modal Tab Navigation */}
        <div className="modal-tabs-bar">
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            <FiInfo /> Basic Info & Cards
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <FiImage /> Hero & Metrics
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            <FiDollarSign /> Pricing & Packages
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'workflow' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflow')}
          >
            <FiActivity /> Workflow (5 Steps)
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'capabilities' ? 'active' : ''}`}
            onClick={() => setActiveTab('capabilities')}
          >
            <FiCpu /> Features & Tech
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            <FiHelpCircle /> FAQs ({formData.faqs?.length || 0})
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form-scroll-body">
          {/* ========================================================
              TAB 1: BASIC INFO
              ======================================================== */}
          {activeTab === 'basic' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Service Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleBasicChange('title', e.target.value)}
                    placeholder="e.g. AI Automation & Agents"
                    required
                  />
                  <small>Displayed as main name on cards, lists and navigation.</small>
                </div>

                <div className="form-field-group">
                  <label>URL Slug (Path)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleBasicChange('slug', e.target.value)}
                    placeholder="e.g. ai-automation"
                  />
                  <small>Page URL: <code>/services/{formData.slug || 'slug'}</code></small>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Service Category & Vector Icon</label>
                  <select
                    value={formData.icon || 'globe'}
                    onChange={(e) => handleBasicChange('icon', e.target.value)}
                  >
                    <option value="globe">Web Engineering (Globe Icon)</option>
                    <option value="mobile">Mobile & Cloud Apps (Smartphone Icon)</option>
                    <option value="growth">Performance Ads & ROAS (Trending Icon)</option>
                    <option value="design">UI/UX & Product Design (Layers Icon)</option>
                    <option value="local">Local Search & Maps (Map Pin Icon)</option>
                    <option value="marketing">Growth & Omnichannel (Send Icon)</option>
                    <option value="cloud">Enterprise Core & AI (Cpu Icon)</option>
                  </select>
                  <small>Determines the high-resolution vector icon & category badge on the website.</small>
                </div>

                <div className="form-field-group">
                  <label>Publication Status & Order</label>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleBasicChange('isActive', e.target.checked)}
                      />
                      <span>Active on Website</span>
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Order:</span>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => handleBasicChange('order', Number(e.target.value))}
                        style={{ width: '70px', padding: '6px 10px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-field-group">
                <label>Card Short Description *</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleBasicChange('description', e.target.value)}
                  placeholder="Concise 1-2 sentence description shown on homepage services grid."
                  required
                />
              </div>

              <div className="form-field-group">
                <label>Hero Subtitle / Tagline</label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => handleBasicChange('subtitle', e.target.value)}
                  placeholder="Detailed subtitle shown on the service detail hero banner."
                />
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: HERO & METRICS
              ======================================================== */}
          {activeTab === 'hero' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Hero Title Line 1</label>
                  <input
                    type="text"
                    value={formData.titleLine1}
                    onChange={(e) => handleBasicChange('titleLine1', e.target.value)}
                    placeholder="e.g. Website &"
                  />
                  <small>First part of hero typography headline.</small>
                </div>

                <div className="form-field-group">
                  <label>Hero Title Line 2 (Highlighted)</label>
                  <input
                    type="text"
                    value={formData.titleLine2}
                    onChange={(e) => handleBasicChange('titleLine2', e.target.value)}
                    placeholder="e.g. Development"
                  />
                  <small>Second line with bold/cyan gradient accent.</small>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>CTA Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => handleBasicChange('ctaText', e.target.value)}
                    placeholder="BOOK NOW"
                  />
                </div>

                <div className="form-field-group">
                  <label>Hero Image URL</label>
                  <input
                    type="text"
                    value={formData.heroImage}
                    onChange={(e) => handleBasicChange('heroImage', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="form-section-divider">
                <span>Proof Badges & Social Metrics</span>
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Performance Badge Title</label>
                  <input
                    type="text"
                    value={formData.badgeTitle}
                    onChange={(e) => handleBasicChange('badgeTitle', e.target.value)}
                    placeholder="e.g. Performance Score"
                  />
                </div>

                <div className="form-field-group">
                  <label>Performance Badge Value</label>
                  <input
                    type="text"
                    value={formData.badgeValue}
                    onChange={(e) => handleBasicChange('badgeValue', e.target.value)}
                    placeholder="e.g. 99/100 Core Vitals"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Metric Count Highlight</label>
                  <input
                    type="text"
                    value={formData.statCount}
                    onChange={(e) => handleBasicChange('statCount', e.target.value)}
                    placeholder="e.g. 250k"
                  />
                </div>

                <div className="form-field-group">
                  <label>Metric Label</label>
                  <input
                    type="text"
                    value={formData.statLabel}
                    onChange={(e) => handleBasicChange('statLabel', e.target.value)}
                    placeholder="e.g. Users have explored"
                  />
                </div>
              </div>

              {formData.heroImage && (
                <div className="hero-preview-box">
                  <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '6px' }}>Hero Image Preview:</span>
                  <img src={formData.heroImage} alt="Hero Preview" className="hero-preview-thumb" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 3: PRICING & PACKAGES
              ======================================================== */}
          {activeTab === 'pricing' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="form-grid-2">
                <div className="form-field-group">
                  <label>Pricing Section Headline</label>
                  <input
                    type="text"
                    value={formData.pricing?.headline || ''}
                    onChange={(e) => handlePricingChange('headline', e.target.value)}
                    placeholder="e.g. Website Development Pricing"
                  />
                </div>

                <div className="form-field-group">
                  <label>Pricing Subheadline</label>
                  <input
                    type="text"
                    value={formData.pricing?.subheadline || ''}
                    onChange={(e) => handlePricingChange('subheadline', e.target.value)}
                    placeholder="Select the package that fits your ambition..."
                  />
                </div>
              </div>

              <div className="form-section-divider">
                <span>The 3 Package Tiers (Basic, Advanced, Custom)</span>
              </div>

              <div className="pricing-packages-editor-grid">
                {(formData.pricing?.packages || []).map((pkg, idx) => (
                  <div key={pkg.id || idx} className="package-edit-card">
                    <div className="pkg-edit-header">
                      <span className="pkg-tier-chip">{pkg.id.toUpperCase()} TIER</span>
                      <input
                        type="text"
                        value={pkg.badge || ''}
                        onChange={(e) => handlePackageChange(idx, 'badge', e.target.value)}
                        placeholder="Badge (e.g. Essential)"
                        className="pkg-badge-input"
                      />
                    </div>

                    <div className="form-field-group">
                      <label>Package Name</label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => handlePackageChange(idx, 'name', e.target.value)}
                        placeholder="e.g. Basic Package"
                        required
                      />
                    </div>

                    <div className="form-grid-2" style={{ gap: '8px' }}>
                      <div className="form-field-group">
                        <label>Price</label>
                        <input
                          type="text"
                          value={pkg.price}
                          onChange={(e) => handlePackageChange(idx, 'price', e.target.value)}
                          placeholder="e.g. $999 or Custom"
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Billing Period</label>
                        <input
                          type="text"
                          value={pkg.period}
                          onChange={(e) => handlePackageChange(idx, 'period', e.target.value)}
                          placeholder="one-time or /mo"
                        />
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label>Package Description</label>
                      <textarea
                        rows={2}
                        value={pkg.desc}
                        onChange={(e) => handlePackageChange(idx, 'desc', e.target.value)}
                        placeholder="Target client and deliverables overview."
                      />
                    </div>

                    <div className="form-grid-2" style={{ gap: '8px' }}>
                      <div className="form-field-group">
                        <label>CTA Button Text</label>
                        <input
                          type="text"
                          value={pkg.btnText}
                          onChange={(e) => handlePackageChange(idx, 'btnText', e.target.value)}
                          placeholder="Start Basic"
                        />
                      </div>

                      <div className="form-field-group">
                        <label>Button Style</label>
                        <select
                          value={pkg.btnStyle}
                          onChange={(e) => handlePackageChange(idx, 'btnStyle', e.target.value)}
                        >
                          <option value="outline">Outline</option>
                          <option value="gradient">Gradient Glow</option>
                          <option value="solid">Solid Navy</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: WORKFLOW
              ======================================================== */}
          {activeTab === 'workflow' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="form-grid-3">
                <div className="form-field-group">
                  <label>Section Tag</label>
                  <input
                    type="text"
                    value={formData.workflow?.tag || 'WORKFLOW'}
                    onChange={(e) => handleWorkflowChange('tag', e.target.value)}
                  />
                </div>
                <div className="form-field-group">
                  <label>Title Prefix</label>
                  <input
                    type="text"
                    value={formData.workflow?.titlePrefix || 'From Concept to'}
                    onChange={(e) => handleWorkflowChange('titlePrefix', e.target.value)}
                  />
                </div>
                <div className="form-field-group">
                  <label>Title Highlight</label>
                  <input
                    type="text"
                    value={formData.workflow?.titleHighlight || 'Deployment'}
                    onChange={(e) => handleWorkflowChange('titleHighlight', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Workflow Subtitle</label>
                <input
                  type="text"
                  value={formData.workflow?.subtitle || ''}
                  onChange={(e) => handleWorkflowChange('subtitle', e.target.value)}
                  placeholder="A transparent, agile methodology designed to mitigate risk..."
                />
              </div>

              <div className="form-section-divider">
                <span>The 5 Workflow Methodology Steps</span>
              </div>

              <div className="workflow-steps-list">
                {(formData.workflow?.steps || []).map((step, idx) => (
                  <div key={idx} className="workflow-step-edit-card">
                    <div className="step-num-badge">0{idx + 1}</div>
                    <div className="step-inputs-col">
                      <div className="form-grid-2">
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => handleWorkflowStepChange(idx, 'title', e.target.value)}
                          placeholder="Step Title (e.g. Discovery)"
                          required
                        />
                        <select
                          value={step.icon}
                          onChange={(e) => handleWorkflowStepChange(idx, 'icon', e.target.value)}
                        >
                          <option value="search">Search / Discovery Icon</option>
                          <option value="design">UI/UX Design Icon</option>
                          <option value="code">Code / Development Icon</option>
                          <option value="testing">QA & Testing Icon</option>
                          <option value="rocket">Rocket / Deploy Icon</option>
                        </select>
                      </div>
                      <textarea
                        rows={2}
                        value={step.desc}
                        onChange={(e) => handleWorkflowStepChange(idx, 'desc', e.target.value)}
                        placeholder="Explain what occurs during this milestone."
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: CAPABILITIES & TECH
              ======================================================== */}
          {activeTab === 'capabilities' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="features-top-row">
                <div>
                  <h4 style={{ margin: '0 0 4px', color: '#00278a' }}>Service Capabilities (Feature Cards)</h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                    Visual cards highlighting speed, security, architecture and user experience.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="table-btn table-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiPlus /> Add Capability Card
                </button>
              </div>

              <div className="features-edit-grid">
                {(formData.features || []).map((feat, idx) => (
                  <div key={idx} className="feature-edit-card">
                    <div className="feat-edit-top">
                      <input
                        type="text"
                        value={feat.icon}
                        onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                        placeholder="⚡"
                        style={{ width: '48px', textAlign: 'center', fontSize: '1.2rem' }}
                      />
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                        placeholder="Feature Title"
                        style={{ flex: 1, fontWeight: 700 }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="icon-del-btn"
                        title="Remove capability"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={feat.desc}
                      onChange={(e) => handleFeatureChange(idx, 'desc', e.target.value)}
                      placeholder="Detailed explanation of this capability..."
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="form-section-divider">
                <span>Enterprise Tech Stack & Tooling</span>
              </div>

              <div className="tech-stack-manager">
                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Add technology (e.g. Next.js, Node.js, Stripe, Docker)"
                    style={{ flex: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech(e);
                      }
                    }}
                  />
                  <button type="button" onClick={handleAddTech} className="table-btn table-btn-primary">
                    <FiPlus /> Add Tag
                  </button>
                </div>

                <div className="tech-chips-list">
                  {(formData.techStack || []).map((tech, i) => (
                    <span key={i} className="tech-pill-badge">
                      <span>{tech}</span>
                      <button type="button" onClick={() => handleRemoveTech(i)} title="Remove tag">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 6: FAQS
              ======================================================== */}
          {activeTab === 'faqs' && (
            <div className="tab-pane-content animate-fade-in">
              <div className="features-top-row">
                <div>
                  <h4 style={{ margin: '0 0 4px', color: '#00278a' }}>Frequently Asked Questions</h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                    Answers to common client inquiries displayed on this service's landing page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="table-btn table-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiPlus /> Add New FAQ
                </button>
              </div>

              <div className="faqs-edit-list">
                {(formData.faqs || []).map((faq, idx) => (
                  <div key={idx} className="faq-edit-card">
                    <div className="faq-edit-header">
                      <span className="faq-num-pill">Q{idx + 1}</span>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                        placeholder="Enter the question (e.g. How long does development take?)"
                        required
                        style={{ flex: 1, fontWeight: 700 }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(idx)}
                        className="icon-del-btn"
                        title="Delete question"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={faq.a}
                      onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                      placeholder="Write the comprehensive, reassuring answer..."
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Bar */}
          <div className="admin-modal-footer">
            <div className="modal-footer-meta">
              <span>* Changes sync immediately to MongoDB and live website pages</span>
            </div>
            <div className="modal-footer-actions">
              <button type="button" onClick={onClose} className="table-btn" disabled={loading}>
                Cancel
              </button>
              <button
                type="submit"
                className="admin-submit-button"
                style={{ width: 'auto', padding: '0 24px', margin: 0 }}
                disabled={loading}
              >
                {loading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <FiSave /> {isEditing ? 'Save Changes' : 'Create Service'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
