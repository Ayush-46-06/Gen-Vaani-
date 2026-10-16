import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  FiFileText, 
  FiShield, 
  FiLock, 
  FiCheckCircle, 
  FiPrinter, 
  FiMail, 
  FiChevronRight, 
  FiInfo,
  FiExternalLink
} from 'react-icons/fi';
import './LegalPage.css';

const TABS = [
  { id: 'terms', label: 'Terms of Service', icon: FiFileText, path: '/terms-of-service' },
  { id: 'privacy', label: 'Privacy Policy', icon: FiShield, path: '/privacy-policy' },
  { id: 'cookies', label: 'Cookie Policy', icon: FiLock, path: '/cookie-policy' },
];

const LegalPage = ({ initialTab = 'terms' }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab with URL path
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('privacy')) {
      setActiveTab('privacy');
    } else if (path.includes('cookie')) {
      setActiveTab('cookies');
    } else {
      setActiveTab('terms');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="legal-page-wrapper">
      {/* Hero Header */}
      <section className="legal-hero">
        <div className="legal-hero-glow"></div>
        <div className="legal-hero-content">
          {/* <div className="legal-badge-pill">
            <span className="legal-pulse-dot"></span>
            <span>TRUST & TRANSPARENCY • LEGAL FRAMEWORK</span>
          </div> */}
          <h1 className="legal-hero-title">
            Legal & Compliance <span className="gradient-cyan-text">Center</span>
          </h1>
          <p className="legal-hero-subtitle">
            Our commitment to clear standards, ironclad data protection, and transparent client partnerships.
          </p>

          <div className="legal-meta-bar">
            <span className="meta-item">
              <strong>Effective Date:</strong> October 15, 2026
            </span>
            <span className="meta-divider">•</span>
            {/* <span className="meta-item">
              <strong>Version:</strong> 2.4 (Enterprise Ready)
            </span> */}
            <span className="meta-divider">•</span>
            <button type="button" className="print-btn" onClick={handlePrint} title="Print this document">
              <FiPrinter /> Print Document
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="legal-body-section">
        {/* Wave Divider into Content */}
        <div className="wave-divider wave-top">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f8fafc" d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z"></path>
          </svg>
        </div>

        <div className="legal-container">
          {/* Top Tab Switcher */}
          <div className="legal-tabs-bar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`legal-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon className="tab-icon" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="legal-layout-grid">
            {/* Left Sticky Sidebar: Table of Contents */}
            <aside className="legal-sidebar">
              <div className="sidebar-sticky-card">
                <h4 className="toc-heading">Quick Navigation</h4>
                <ul className="toc-list">
                  {activeTab === 'terms' && (
                    <>
                      <li><a href="#terms-1">1. Acceptance of Terms</a></li>
                      <li><a href="#terms-2">2. Services & Scope</a></li>
                      <li><a href="#terms-3">3. Intellectual Property Rights</a></li>
                      <li><a href="#terms-4">4. Client Obligations</a></li>
                      <li><a href="#terms-5">5. Payment & Billing Terms</a></li>
                      <li><a href="#terms-6">6. Warranties & SLA</a></li>
                      <li><a href="#terms-7">7. Limitation of Liability</a></li>
                      <li><a href="#terms-8">8. Termination</a></li>
                    </>
                  )}

                  {activeTab === 'privacy' && (
                    <>
                      <li><a href="#priv-1">1. Overview & Scope</a></li>
                      <li><a href="#priv-2">2. Information We Collect</a></li>
                      <li><a href="#priv-3">3. How We Use Information</a></li>
                      <li><a href="#priv-4">4. Data Sharing & Processors</a></li>
                      <li><a href="#priv-5">5. Security & Encryption</a></li>
                      <li><a href="#priv-6">6. GDPR & CCPA Rights</a></li>
                      <li><a href="#priv-7">7. Data Retention</a></li>
                      <li><a href="#priv-8">8. Policy Updates</a></li>
                    </>
                  )}

                  {activeTab === 'cookies' && (
                    <>
                      <li><a href="#cook-1">1. What Are Cookies?</a></li>
                      <li><a href="#cook-2">2. Categories of Cookies</a></li>
                      <li><a href="#cook-3">3. Specific Cookies We Use</a></li>
                      <li><a href="#cook-4">4. Third-Party Analytics</a></li>
                      <li><a href="#cook-5">5. Managing Preferences</a></li>
                      <li><a href="#cook-6">6. Browser Settings Guide</a></li>
                    </>
                  )}
                </ul>

                <div className="sidebar-help-box">
                  <div className="help-icon-circle">
                    <FiMail />
                  </div>
                  <h5>Need Legal Clarification?</h5>
                  <p>Our compliance team is available to discuss custom enterprise SLAs or DPAs.</p>
                  <Link to="/contact" className="help-link">
                    Contact Legal Team &rarr;
                  </Link>
                </div>
              </div>
            </aside>

            {/* Right Main Column: Policy Clauses */}
            <main className="legal-content-card">
              {/* ========================================================
                  TAB 1: TERMS OF SERVICE
                  ======================================================== */}
              {activeTab === 'terms' && (
                <div className="policy-block animate-fade">
                  <div className="policy-header-row">
                    <div>
                      <span className="policy-tag">LEGAL AGREEMENT</span>
                      <h2 className="policy-title">Terms of Service</h2>
                    </div>
                    <span className="policy-badge-verified">
                      <FiCheckCircle /> Legally Verified
                    </span>
                  </div>

                  <div className="policy-highlight-banner">
                    <FiInfo className="banner-icon" />
                    <div>
                      <strong>Summary in Plain English:</strong> We build world-class digital products with clear timelines, transparent pricing, and 100% intellectual property ownership transferred to you upon full payment.
                    </div>
                  </div>

                  <div className="clause-section" id="terms-1">
                    <h3>1. Acceptance of Terms</h3>
                    <p>
                      By accessing, browsing, or utilizing the web applications, software engineering, digital consulting, or hosting services provided by <strong>GenVaani Innovations Inc.</strong> (“GenVaani”, “we”, “our”, or “us”), you (“Client”, “User”, or “You”) agree to be legally bound by these Terms of Service. If you are entering into this agreement on behalf of a corporation or entity, you represent that you possess the authority to bind such entity.
                    </p>
                  </div>

                  <div className="clause-section" id="terms-2">
                    <h3>2. Services & Project Scope</h3>
                    <p>
                      GenVaani provides bespoke web engineering, full-stack application development, cloud infrastructure architecture, digital marketing, and UI/UX design. Each project shall be defined by a formal Statement of Work (SOW), proposal, or signed service agreement detailing milestones, deliverables, and turnaround schedules.
                    </p>
                    <ul className="clause-bullets">
                      <li><strong>Scope Modifications:</strong> Requests outside the approved SOW will be evaluated as separate change orders with documented cost adjustments.</li>
                      <li><strong>Agile Milestones:</strong> Deliverables are submitted for iterative client review at predetermined sprint phases.</li>
                    </ul>
                  </div>

                  <div className="clause-section" id="terms-3">
                    <h3>3. Intellectual Property Rights & Ownership</h3>
                    <p>
                      We believe clients should genuinely own what they pay for. Upon receipt of full and final payment for all deliverables outlined in the applicable contract:
                    </p>
                    <div className="policy-callout-card">
                      <h4>Client Ownership Guarantee</h4>
                      <p>
                        You receive 100% full, unrestricted ownership of all custom source code, Figma design files, graphic assets, database schemas, and tailored software written explicitly for your project. GenVaani retains no proprietary claim over your business logic or branding.
                      </p>
                    </div>
                    <p>
                      Pre-existing open-source frameworks (e.g. React, Node.js, Next.js, standard libraries) remain licensed under their respective MIT/Apache licenses.
                    </p>
                  </div>

                  <div className="clause-section" id="terms-4">
                    <h3>4. Client Obligations & Collaboration</h3>
                    <p>
                      Timely project delivery requires cooperative effort. Clients agree to provide requisite assets (logos, content, access tokens, API credentials) and constructive feedback within agreed sprint review windows (typically 3–5 business days).
                    </p>
                  </div>

                  <div className="clause-section" id="terms-5">
                    <h3>5. Payment & Billing Terms</h3>
                    <p>
                      Invoices are issued according to milestone completions or monthly retainer terms. Payment is due within 14 days of invoice dispatch unless otherwise stipulated in the SOW. We accept wire transfer, ACH, Stripe, and approved credit facilities.
                    </p>
                  </div>

                  <div className="clause-section" id="terms-6">
                    <h3>6. Warranties & 30-Day Post-Launch SLA</h3>
                    <p>
                      All custom software delivered by GenVaani is backed by a <strong>30-day bug-free warranty</strong> following production launch. During this period, our engineering team will rectify any regressions or defects inconsistent with the SOW specifications at no additional expense.
                    </p>
                  </div>

                  <div className="clause-section" id="terms-7">
                    <h3>7. Limitation of Liability</h3>
                    <p>
                      To the maximum extent permitted under applicable law, neither party shall be held liable for indirect, incidental, or consequential damages resulting from third-party server downtimes (e.g. AWS, Cloudflare) or unauthorized breach events outside GenVaani's direct control. GenVaani's aggregate liability under any project shall not exceed the total fees paid under the specific SOW.
                    </p>
                  </div>

                  <div className="clause-section" id="terms-8">
                    <h3>8. Termination & Exit Assistance</h3>
                    <p>
                      Either party may terminate an ongoing engagement with thirty (30) days written notice. In the event of early termination, all completed milestones and work-in-progress code shall be packaged, documented, and transferred to the client.
                    </p>
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 2: PRIVACY POLICY
                  ======================================================== */}
              {activeTab === 'privacy' && (
                <div className="policy-block animate-fade">
                  <div className="policy-header-row">
                    <div>
                      <span className="policy-tag">PRIVACY & DATA PROTECTION</span>
                      <h2 className="policy-title">Privacy Policy</h2>
                    </div>
                    <span className="policy-badge-verified">
                      <FiShield /> GDPR & CCPA Compliant
                    </span>
                  </div>

                  <div className="policy-highlight-banner">
                    <FiLock className="banner-icon" />
                    <div>
                      <strong>Your Privacy Matters:</strong> GenVaani does not sell, lease, or monetize your personal or client data. We collect only what is strictly required to deliver, secure, and improve our digital solutions.
                    </div>
                  </div>

                  <div className="clause-section" id="priv-1">
                    <h3>1. Overview & Scope</h3>
                    <p>
                      This Privacy Policy governs the collection, processing, and storage of personal information across GenVaani’s website (genvaani.com), customer portals, booking calendars, and client staging environments.
                    </p>
                  </div>

                  <div className="clause-section" id="priv-2">
                    <h3>2. Information We Collect</h3>
                    <p>We collect information strictly when provided directly by you or via verified technological interactions:</p>
                    <ul className="clause-bullets">
                      <li><strong>Contact Information:</strong> Name, work email address, phone number, company name, and appointment notes submitted via our inquiry forms.</li>
                      <li><strong>Project Specifications:</strong> Technical briefs, infrastructure requirements, and repository references shared during scoping consultations.</li>
                      <li><strong>Technical Telemetry:</strong> Anonymized browser type, operating system, IP address, and session interaction metrics used solely for performance monitoring and DDoS prevention.</li>
                    </ul>
                  </div>

                  <div className="clause-section" id="priv-3">
                    <h3>3. How We Use Your Information</h3>
                    <p>Your data is processed strictly for the following legitimate business purposes:</p>
                    <ul className="clause-bullets">
                      <li>To prepare accurate technical proposals, sprint timelines, and software architectures.</li>
                      <li>To execute development contracts, project communications, and secure billing.</li>
                      <li>To maintain 99.99% system availability, optimize Core Web Vitals, and prevent cyber threats.</li>
                    </ul>
                  </div>

                  <div className="clause-section" id="priv-4">
                    <h3>4. Data Sharing & Sub-Processors</h3>
                    <p>
                      We never sell data to advertising brokers. We only partner with enterprise-grade sub-processors that maintain ISO 27001 or SOC2 Type II compliance:
                    </p>
                    <div className="table-responsive">
                      <table className="legal-data-table">
                        <thead>
                          <tr>
                            <th>Partner / Processor</th>
                            <th>Purpose</th>
                            <th>Data Shared</th>
                            <th>Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>MongoDB Atlas</strong></td>
                            <td>Encrypted Database Hosting</td>
                            <td>Project briefs & service logs</td>
                            <td>USA / EU (Encrypted)</td>
                          </tr>
                          <tr>
                            <td><strong>Stripe Payments</strong></td>
                            <td>PCI-DSS Level 1 Invoicing</td>
                            <td>Payment tokens & receipts</td>
                            <td>Global</td>
                          </tr>
                          <tr>
                            <td><strong>Cloudflare CDN</strong></td>
                            <td>Edge Security & SSL</td>
                            <td>IP & telemetry (Anonymized)</td>
                            <td>Global Edge</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="clause-section" id="priv-5">
                    <h3>5. Security & Encryption Standards</h3>
                    <p>
                      GenVaani applies military-grade security defense-in-depth across all digital touchpoints. Data in transit is protected using <strong>TLS 1.3 / AES-256 bit encryption</strong>, and sensitive operational databases are isolated behind strict role-based access controls (RBAC) and VPN firewalls.
                    </p>
                  </div>

                  <div className="clause-section" id="priv-6">
                    <h3>6. GDPR (EU) & CCPA (California) Rights</h3>
                    <p>
                      Regardless of your geographical jurisdiction, GenVaani guarantees you full transparency and sovereignty over your data:
                    </p>
                    <ul className="clause-bullets">
                      <li><strong>Right of Access:</strong> Request a full machine-readable copy of any personal data we hold.</li>
                      <li><strong>Right to Rectification:</strong> Request prompt correction of outdated or inaccurate records.</li>
                      <li><strong>Right to Erasure ("To Be Forgotten"):</strong> Request complete deletion of your records from our databases.</li>
                      <li><strong>Right to Non-Discrimination:</strong> Equal service quality regardless of exercising your privacy rights.</li>
                    </ul>
                    <p>
                      To exercise any of these rights, email our Data Protection Officer at <a href="mailto:privacy@genvaani.com" className="legal-inline-link">privacy@genvaani.com</a>.
                    </p>
                  </div>

                  <div className="clause-section" id="priv-7">
                    <h3>7. Data Retention Schedule</h3>
                    <p>
                      Inquiry logs and client communication histories are retained for the duration of the active contractual relationship, plus a statutory period of 2 years for tax and legal compliance, after which they are permanently shredded.
                    </p>
                  </div>

                  <div className="clause-section" id="priv-8">
                    <h3>8. Updates to this Policy</h3>
                    <p>
                      Any material revisions will be published on this URL with an updated effective date timestamp. For significant adjustments, registered clients will receive notification via email.
                    </p>
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 3: COOKIE POLICY
                  ======================================================== */}
              {activeTab === 'cookies' && (
                <div className="policy-block animate-fade">
                  <div className="policy-header-row">
                    <div>
                      <span className="policy-tag">BROWSER PREFERENCES</span>
                      <h2 className="policy-title">Cookie Policy</h2>
                    </div>
                    <span className="policy-badge-verified">
                      <FiLock /> Fully Transparent
                    </span>
                  </div>

                  <div className="policy-highlight-banner">
                    <FiCheckCircle className="banner-icon" />
                    <div>
                      <strong>Cookie Transparency:</strong> We use cookies responsibly to preserve your navigation preferences, load pages faster, and understand how visitors explore our solutions.
                    </div>
                  </div>

                  <div className="clause-section" id="cook-1">
                    <h3>1. What Are Cookies?</h3>
                    <p>
                      Cookies are tiny text files stored on your computer or mobile device when you browse websites. They enable digital platforms to recognize your browser, preserve login sessions, remember language choices, and ensure smooth micro-interactions.
                    </p>
                  </div>

                  <div className="clause-section" id="cook-2">
                    <h3>2. Categories of Cookies We Deploy</h3>
                    <p>Our website utilizes four distinct classifications of cookies:</p>
                    
                    <div className="cookie-category-cards">
                      <div className="cookie-card">
                        <div className="cookie-card-top">
                          <span className="cookie-status essential">Strictly Necessary</span>
                          <span className="cookie-duration">Always Active</span>
                        </div>
                        <h4>Essential Core Cookies</h4>
                        <p>Essential for basic website functionality, CSRF protection, secure admin authentication, and routing.</p>
                      </div>

                      <div className="cookie-card">
                        <div className="cookie-card-top">
                          <span className="cookie-status analytics">Performance</span>
                          <span className="cookie-duration">12 Months</span>
                        </div>
                        <h4>Analytics & Vitals</h4>
                        <p>Measures page load speeds, Core Web Vitals, and aggregate traffic patterns without tracking personal identities.</p>
                      </div>

                      <div className="cookie-card">
                        <div className="cookie-card-top">
                          <span className="cookie-status functional">Functional</span>
                          <span className="cookie-duration">6 Months</span>
                        </div>
                        <h4>Preference Memory</h4>
                        <p>Remembers custom filters, selected portfolio tags, and UI theme states across multiple page views.</p>
                      </div>
                    </div>
                  </div>

                  <div className="clause-section" id="cook-3">
                    <h3>3. Specific Cookies We Use</h3>
                    <div className="table-responsive">
                      <table className="legal-data-table">
                        <thead>
                          <tr>
                            <th>Cookie Name</th>
                            <th>Type</th>
                            <th>Function</th>
                            <th>Lifespan</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><code>__gv_session</code></td>
                            <td>Essential</td>
                            <td>Maintains secure user state & token validation</td>
                            <td>Session</td>
                          </tr>
                          <tr>
                            <td><code>__gv_theme</code></td>
                            <td>Functional</td>
                            <td>Remembers visual preferences & layout settings</td>
                            <td>6 Months</td>
                          </tr>
                          <tr>
                            <td><code>_ga, _ga_*</code></td>
                            <td>Analytics</td>
                            <td>Anonymized Google Analytics page interaction telemetry</td>
                            <td>13 Months</td>
                          </tr>
                          <tr>
                            <td><code>cf_clearance</code></td>
                            <td>Security</td>
                            <td>Cloudflare bot mitigation and DDoS prevention token</td>
                            <td>12 Months</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="clause-section" id="cook-4">
                    <h3>4. Third-Party Analytics & Tracking</h3>
                    <p>
                      We do not permit third-party advertising networks to plant tracking beacons or cross-site tracking cookies on GenVaani. Any analytics utilized is aggregated, anonymized, and stripped of personally identifiable identifiers.
                    </p>
                  </div>

                  <div className="clause-section" id="cook-5">
                    <h3>5. Managing Your Cookie Preferences</h3>
                    <p>
                      You hold complete control over your browser's cookie storage. You can configure your browser to reject all non-essential cookies, clear existing cookies, or notify you whenever a cookie is set.
                    </p>
                  </div>

                  <div className="clause-section" id="cook-6">
                    <h3>6. How to Disable Cookies in Major Browsers</h3>
                    <ul className="clause-bullets">
                      <li><strong>Google Chrome:</strong> Settings &rarr; Privacy and security &rarr; Third-party cookies.</li>
                      <li><strong>Mozilla Firefox:</strong> Settings &rarr; Privacy & Security &rarr; Enhanced Tracking Protection.</li>
                      <li><strong>Apple Safari:</strong> Preferences &rarr; Privacy &rarr; Block all cookies.</li>
                      <li><strong>Microsoft Edge:</strong> Settings &rarr; Cookies and site permissions &rarr; Manage and delete cookies.</li>
                    </ul>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalPage;
