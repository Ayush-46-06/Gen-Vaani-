import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiShield, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLogOut, 
  FiExternalLink, 
  FiCalendar, 
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiArrowUpRight,
  FiServer,
  FiGrid,
  FiVideo,
  FiFilter,
  FiSearch,
  FiCheck,
  FiCopy,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiRefreshCw,
  FiDollarSign,
  FiEye,
  FiCpu,
  FiHelpCircle,
  FiGlobe,
  FiSmartphone,
  FiTrendingUp,
  FiMapPin,
  FiSend,
  FiDownload,
  FiFileText,
  FiLock,
  FiEyeOff,
  FiKey
} from 'react-icons/fi';
import navbarLogo from '../../assets/PNG/6.icon + Name Logo Transparent.png';
import { getAdminStatsApi, changeAdminPasswordApi } from '../../services/adminApi';
import { getLeadsApi, updateLeadStatusApi } from '../../services/leadApi';
import { getMeetingsApi, updateMeetingStatusApi, GENVAANI_MEET_URL } from '../../services/meetingApi';
import { getServicesApi, deleteServiceApi, seedServicesApi } from '../../services/serviceApi';
import { getPortfolioWebsitesApi, deletePortfolioWebsiteApi } from '../../services/portfolioApi';
import { exportLeadsToExcel, exportMeetingsToExcel, exportMasterReportToExcel } from '../../utils/excelExport';
import ServiceEditorModal from './ServiceEditorModal';
import WebsiteEditorModal from './WebsiteEditorModal';
import GmailReplyModal from './GmailReplyModal';
import './AdminAuth.css';

const INITIAL_LEADS = [
  {
    id: 'LD-101',
    name: 'Ananya Deshmukh',
    company: 'Apex Healthcare Labs',
    email: 'ananya@apexlabs.in',
    phone: '+91 98201 44521',
    service: 'Custom Web Application',
    budget: '₹2,50,000 - ₹5,00,000',
    date: 'Oct 14, 2026',
    status: 'new',
    message: 'Looking for a HIPAA-compliant patient management portal with real-time reporting.'
  },
  {
    id: 'LD-102',
    name: 'Rohan Mehra',
    company: 'Mehra Fine Jewels',
    email: 'rohan@mehrajewels.com',
    phone: '+91 97112 88902',
    service: 'UI/UX Product Architecture',
    budget: '₹1,50,000 - ₹3,00,000',
    date: 'Oct 14, 2026',
    status: 'in_progress',
    message: 'Need high-converting luxury e-commerce experience redesign with 3D product previews.'
  },
  {
    id: 'LD-103',
    name: 'Vikramaditya Rao',
    company: 'Stellar Fintech',
    email: 'v.rao@stellarfin.io',
    phone: '+91 98334 11200',
    service: 'Enterprise Mobile App',
    budget: '₹6,00,000 - ₹10,00,000',
    date: 'Oct 13, 2026',
    status: 'in_progress',
    message: 'Cross-platform React Native investment wallet with bank SDK integrations.'
  },
  {
    id: 'LD-104',
    name: 'Sarah Jenkins',
    company: 'HyperGrowth Retail UK',
    email: 'sarah.j@hypergrowth.co.uk',
    phone: '+44 7911 123456',
    service: 'Performance Ads & Meta',
    budget: '£3,000/mo Retainer',
    date: 'Oct 12, 2026',
    status: 'new',
    message: 'Want to scale our D2C apparel brand into European markets with ROAS > 3.8x.'
  },
  {
    id: 'LD-105',
    name: 'Devendra Patel',
    company: 'KisanConnect Logistics',
    email: 'devendra@kisanconnect.org',
    phone: '+91 94250 77189',
    service: 'Full Agency Retainer',
    budget: '₹8,00,000+',
    date: 'Oct 10, 2026',
    status: 'converted',
    message: 'End-to-end web platform, driver mobile apps, and national brand launch campaign.'
  }
];

const SCHEDULED_MEETS = [
  {
    id: 'MT-501',
    clientName: 'Ananya Deshmukh',
    company: 'Apex Healthcare Labs',
    service: 'Custom Web Application Scoping',
    date: 'Today · Oct 14, 2026',
    time: '11:00 AM - 11:45 AM IST',
    attendees: ['Ayush (Lead Architect)', 'Ananya Deshmukh (CTO)'],
    meetUrl: GENVAANI_MEET_URL,
    status: 'confirmed',
    notes: 'Review system requirements, database schema & HIPAA certification timeline.'
  },
  {
    id: 'MT-502',
    clientName: 'Rohan Mehra',
    company: 'Mehra Fine Jewels',
    service: 'UI/UX Interactive Prototype Review',
    date: 'Today · Oct 14, 2026',
    time: '02:00 PM - 02:30 PM IST',
    attendees: ['Ayush (Design Lead)', 'Rohan Mehra (Founder)'],
    meetUrl: GENVAANI_MEET_URL,
    status: 'confirmed',
    notes: 'Walkthrough Figma wireframes, luxury typography & checkout funnel.'
  },
  {
    id: 'MT-503',
    clientName: 'Elena Rostova',
    company: 'Nordic SaaS Labs',
    service: 'Enterprise Mobile Architecture',
    date: 'Tomorrow · Oct 15, 2026',
    time: '09:30 AM - 10:15 AM IST',
    attendees: ['Ayush (Lead Architect)', 'Elena Rostova (Head of Product)'],
    meetUrl: GENVAANI_MEET_URL,
    status: 'confirmed',
    notes: 'Discuss offline caching, push notifications and biometric security.'
  },
  {
    id: 'MT-504',
    clientName: 'Devendra Patel',
    company: 'KisanConnect Logistics',
    service: 'Kickoff & Sprint Planning',
    date: 'Friday · Oct 16, 2026',
    time: '04:15 PM - 05:00 PM IST',
    attendees: ['Full Tech Squad', 'Devendra Patel (Director)'],
    meetUrl: GENVAANI_MEET_URL,
    status: 'confirmed',
    notes: 'Final sprint milestone sign-off, staging deployment schedule & API keys.'
  }
];

const AGENCY_SERVICES = [
  {
    id: 'SRV-01',
    name: 'Custom Web Applications',
    tagline: 'Modern, high-velocity web experiences',
    description: 'React, Next.js, Node.js and full-stack cloud web apps built with ultra-clean code and 99+ Lighthouse performance.',
    activeProjects: 8,
    tier: 'Enterprise & Scaling Startups',
    status: 'Accepting Clients',
    icon: <FiLayers />
  },
  {
    id: 'SRV-02',
    name: 'Mobile App Development',
    tagline: 'Native performance for iOS & Android',
    description: 'High-performance React Native and cross-platform applications engineered for seamless UX and secure offline sync.',
    activeProjects: 5,
    tier: 'Full Cycle Development',
    status: 'Accepting Clients',
    icon: <FiPhone />
  },
  {
    id: 'SRV-03',
    name: 'UI/UX Product Architecture',
    tagline: 'Human-centric digital product design',
    description: 'Figma design systems, interactive micro-animations, clickable high-fidelity prototypes and conversion-first flows.',
    activeProjects: 7,
    tier: 'Design Sprints & Retainers',
    status: 'Accepting Clients',
    icon: <FiActivity />
  },
  {
    id: 'SRV-04',
    name: 'Performance Advertising & Media',
    tagline: 'Data-driven paid customer acquisition',
    description: 'High ROI Meta and Google Ads campaigns with custom creative production, dynamic retargeting, and funnel CRO.',
    activeProjects: 6,
    tier: 'Monthly Growth Retainer',
    status: 'Accepting Clients',
    icon: <FiArrowUpRight />
  },
  {
    id: 'SRV-05',
    name: 'Search Engine Optimization (SEO)',
    tagline: 'Dominant organic rankings & visibility',
    description: 'Technical audits, programmatic SEO, Core Web Vitals optimization, and high-authority link equity building.',
    activeProjects: 9,
    tier: 'Quarterly Growth Sprints',
    status: 'Accepting Clients',
    icon: <FiCheckCircle />
  },
  {
    id: 'SRV-06',
    name: 'Social Media & Brand Growth',
    tagline: 'Viral organic storytelling & brand identity',
    description: 'Visual brand guidelines, viral short-form video creation, brand positioning, and omnichannel community growth.',
    activeProjects: 5,
    tier: 'Creative Retainer',
    status: 'Accepting Clients',
    icon: <FiUser />
  },
  {
    id: 'SRV-07',
    name: 'Enterprise Cloud & DevOps',
    tagline: 'Resilient AWS & Docker infrastructure',
    description: 'Automated CI/CD pipelines, container orchestration, microservices migration, and 24/7 reliability monitoring.',
    activeProjects: 4,
    tier: 'Infrastructure SLA',
    status: 'Accepting Clients',
    icon: <FiServer />
  }
];

const getAdminServiceVectorIcon = (srv) => {
  const slug = (srv?.slug || '').toLowerCase();
  const title = (srv?.title || '').toLowerCase();
  if (slug.includes('web') || title.includes('website')) return <FiGlobe />;
  if (slug.includes('app') || title.includes('application') || title.includes('mobile')) return <FiSmartphone />;
  if (slug.includes('ad') || title.includes('meta') || title.includes('google')) return <FiTrendingUp />;
  if (slug.includes('design') || title.includes('ui') || title.includes('ux')) return <FiLayers />;
  if (slug.includes('seo') || title.includes('local')) return <FiMapPin />;
  if (slug.includes('marketing') || title.includes('digital')) return <FiSend />;
  return <FiCpu />;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [admin, setAdmin] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [leadsFilter, setLeadsFilter] = useState('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [liveStats, setLiveStats] = useState({
    activeBookings: 14,
    pendingInquiries: 28,
    systemStatus: '100% Operational',
    totalStaffAdmins: 1,
    securityProtocol: '256-Bit JWT + Bcrypt Salt 10'
  });

  // Services State for dynamic management
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [servicesSearch, setServicesSearch] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [leadsExportOpen, setLeadsExportOpen] = useState(false);
  const [meetsExportOpen, setMeetsExportOpen] = useState(false);

  // Portfolio Websites State (ImageKit CMS)
  const [websites, setWebsites] = useState([]);
  const [websitesLoading, setWebsitesLoading] = useState(false);
  const [websitesSearch, setWebsitesSearch] = useState('');
  const [editingWebsite, setEditingWebsite] = useState(null);
  const [isWebsiteEditorOpen, setIsWebsiteEditorOpen] = useState(false);
  const [previewWebsiteModal, setPreviewWebsiteModal] = useState(null);
  const [replyingLead, setReplyingLead] = useState(null);

  // Profile & Password States
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const getAdminToken = () => {
    return localStorage.getItem('genvaani_admin_token') || sessionStorage.getItem('genvaani_admin_token') || '';
  };

  const loadServices = () => {
    setServicesLoading(true);
    getServicesApi(true).then((res) => {
      if (res && res.success && Array.isArray(res.services)) {
        setServices(res.services);
      }
    }).catch((e) => console.warn('Services fetch error', e))
    .finally(() => setServicesLoading(false));
  };

  const loadWebsites = () => {
    setWebsitesLoading(true);
    getPortfolioWebsitesApi(true).then((res) => {
      if (res && res.success && Array.isArray(res.websites)) {
        setWebsites(res.websites);
      }
    }).catch((e) => console.warn('Websites fetch error', e))
    .finally(() => setWebsitesLoading(false));
  };

  useEffect(() => {
    let raw = localStorage.getItem('genvaani_active_admin');
    let token = localStorage.getItem('genvaani_admin_token');
    if (!raw) {
      raw = sessionStorage.getItem('genvaani_active_admin');
      token = sessionStorage.getItem('genvaani_admin_token');
    }

    if (!raw || !token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    try {
      setAdmin(JSON.parse(raw));
    } catch (err) {
      console.error('Failed to parse admin session', err);
      navigate('/admin/login', { replace: true });
      return;
    }

    // Fetch live leads from MongoDB
    const loadLeads = () => {
      getLeadsApi().then((res) => {
        if (res && res.success && Array.isArray(res.leads)) {
          setLeads(res.leads);
        }
      }).catch((e) => console.warn('Leads fetch error', e));
    };

    // Fetch live scheduled meetings from MongoDB
    const loadMeetings = () => {
      getMeetingsApi().then((res) => {
        if (res && res.success && Array.isArray(res.meetings)) {
          setMeetings(res.meetings);
        }
      }).catch((e) => console.warn('Meetings fetch error', e));
    };

    loadLeads();
    loadMeetings();
    loadServices();
    loadWebsites();

    if (token) {
      getAdminStatsApi(token).then((res) => {
        if (res && res.success && res.stats) {
          setLiveStats(res.stats);
        }
      }).catch((e) => console.warn('Stats fetch skipped', e));
    }
  }, []);

  // Refresh data whenever switching tabs
  useEffect(() => {
    if (activeTab === 'leads' || activeTab === 'dashboard') {
      getLeadsApi().then((res) => {
        if (res && res.success && Array.isArray(res.leads)) {
          setLeads(res.leads);
        }
      }).catch((e) => console.warn('Leads refresh error', e));
    }

    if (activeTab === 'meet_scheduled' || activeTab === 'dashboard') {
      getMeetingsApi().then((res) => {
        if (res && res.success && Array.isArray(res.meetings)) {
          setMeetings(res.meetings);
        }
      }).catch((e) => console.warn('Meetings refresh error', e));
    }

    if (activeTab === 'services' || activeTab === 'dashboard') {
      loadServices();
    }

    if (activeTab === 'websites' || activeTab === 'dashboard') {
      loadWebsites();
    }
  }, [activeTab]);

  const handleAddNewWebsite = () => {
    setEditingWebsite(null);
    setIsWebsiteEditorOpen(true);
  };

  const handleEditWebsite = (site) => {
    setEditingWebsite(site);
    setIsWebsiteEditorOpen(true);
  };

  const handleDeleteWebsite = async (site) => {
    const siteTitle = site.title || 'this website';
    if (!window.confirm(`Are you sure you want to delete "${siteTitle}"? This will remove it from the portfolio showcase.`)) {
      return;
    }
    const token = getAdminToken();
    const id = site._id || site.id;
    try {
      const res = await deletePortfolioWebsiteApi(id, token);
      if (res && res.success) {
        showToast(`Website "${siteTitle}" deleted successfully.`);
        loadWebsites();
      } else {
        alert(res?.message || 'Failed to delete website.');
      }
    } catch (err) {
      console.error('Delete website error', err);
      alert('Error deleting website.');
    }
  };

  const handleWebsiteSaved = (saved) => {
    showToast(`Website "${saved?.title || 'Website'}" saved successfully!`);
    loadWebsites();
  };

  const handleAddNewService = () => {
    setEditingService(null);
    setIsEditorOpen(true);
  };

  const handleEditService = (srv) => {
    setEditingService(srv);
    setIsEditorOpen(true);
  };

  const handleDeleteService = async (srv) => {
    const srvTitle = srv.title || 'this service';
    if (!window.confirm(`Are you sure you want to delete "${srvTitle}"? This will remove it from the website.`)) {
      return;
    }
    const token = getAdminToken();
    const id = srv._id || srv.id;
    try {
      const res = await deleteServiceApi(id, token);
      if (res && res.success) {
        showToast(`Service "${srvTitle}" deleted successfully.`);
        loadServices();
      } else {
        alert(res?.message || 'Failed to delete service.');
      }
    } catch (err) {
      console.error('Delete error', err);
      alert('Error deleting service.');
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm('Sync or restore the 6 standard agency services into MongoDB?')) {
      return;
    }
    const token = getAdminToken();
    try {
      const res = await seedServicesApi(token, false);
      if (res && res.success) {
        showToast(res.message || 'Services synced with MongoDB.');
        loadServices();
      } else {
        alert(res?.message || 'Failed to sync services.');
      }
    } catch (err) {
      console.error('Seed error', err);
    }
  };

  const handleServiceSaved = (saved) => {
    showToast(`Service "${saved.title || 'Service'}" saved successfully!`);
    loadServices();
  };

  const handleLogout = () => {
    localStorage.removeItem('genvaani_active_admin');
    localStorage.removeItem('genvaani_admin_token');
    sessionStorage.removeItem('genvaani_active_admin');
    sessionStorage.removeItem('genvaani_admin_token');
    navigate('/admin/login', { replace: true });
  };

  const toggleLeadStatus = async (lead) => {
    const leadId = lead._id || lead.id;
    const nextStatus = lead.status === 'new' ? 'in_progress' : lead.status === 'in_progress' ? 'converted' : 'new';
    
    // Optimistic UI update
    setLeads(prev => prev.map(l => {
      if ((l._id && l._id === leadId) || (l.id && l.id === leadId)) {
        return { ...l, status: nextStatus };
      }
      return l;
    }));

    // Persist to MongoDB if it's a database document
    if (lead._id) {
      try {
        await updateLeadStatusApi(lead._id, nextStatus);
      } catch (err) {
        console.error('Failed to update lead status in MongoDB:', err);
      }
    }
  };

  const displayedMeets = meetings.length > 0 ? meetings : SCHEDULED_MEETS;

  const toggleMeetingStatus = async (meet) => {
    const meetId = meet._id || meet.id;
    const nextStatus = meet.status === 'confirmed' ? 'completed' : meet.status === 'completed' ? 'cancelled' : 'confirmed';

    setMeetings(prev => prev.map(m => {
      if ((m._id && m._id === meetId) || (m.id && m.id === meetId)) {
        return { ...m, status: nextStatus };
      }
      return m;
    }));

    if (meet._id) {
      try {
        await updateMeetingStatusApi(meet._id, nextStatus);
      } catch (err) {
        console.error('Failed to update meeting status in MongoDB:', err);
      }
    }
  };

  const handleCopyPublicLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/contact');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const filteredLeads = leads.filter(l => {
    if (leadsFilter === 'all') return true;
    return l.status === leadsFilter;
  });

  const handleExportLeads = (scope = 'all') => {
    setLeadsExportOpen(false);
    const targetLeads = scope === 'filtered' ? filteredLeads : leads;
    if (!targetLeads || targetLeads.length === 0) {
      showToast('No leads available to export.');
      return;
    }
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const filename = scope === 'filtered' 
        ? `Gen-Vaani_Leads_${leadsFilter}_${todayStr}.xlsx` 
        : `Gen-Vaani_All_Leads_${todayStr}.xlsx`;
      exportLeadsToExcel(targetLeads, filename);
      showToast(`✓ Exported ${targetLeads.length} leads to Excel (${filename})`);
    } catch (err) {
      console.error('Export leads error:', err);
      showToast('Failed to export leads to Excel.');
    }
  };

  const handleExportMeetings = () => {
    setMeetsExportOpen(false);
    const targetMeets = displayedMeets;
    if (!targetMeets || targetMeets.length === 0) {
      showToast('No scheduled meetings available to export.');
      return;
    }
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const filename = `Gen-Vaani_Scheduled_Meets_${todayStr}.xlsx`;
      exportMeetingsToExcel(targetMeets, filename);
      showToast(`✓ Exported ${targetMeets.length} scheduled meetings to Excel (${filename})`);
    } catch (err) {
      console.error('Export meetings error:', err);
      showToast('Failed to export meetings to Excel.');
    }
  };

  const handleExportMaster = () => {
    setLeadsExportOpen(false);
    setMeetsExportOpen(false);
    try {
      const filename = exportMasterReportToExcel({
        leads,
        meetings: displayedMeets,
        adminName: admin?.name || 'Super Administrator'
      });
      showToast(`✓ Master Report (${leads.length} leads, ${displayedMeets.length} meets) exported as ${filename}`);
    } catch (err) {
      console.error('Export master report error:', err);
      showToast('Failed to export master report to Excel.');
    }
  };

  const handleUpdatePassword = async (e) => {
    if (e) e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!newPasswordInput || newPasswordInput.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordLoading(true);
    const token = getAdminToken();

    try {
      const res = await changeAdminPasswordApi(
        {
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput,
        },
        token
      );

      if (res && res.success) {
        setPasswordSuccess('Password successfully updated!');
        showToast('✓ Password updated successfully!');
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
        setTimeout(() => {
          setShowChangePassword(false);
          setPasswordSuccess('');
        }, 2200);
      } else {
        setPasswordError(res?.message || 'Failed to update password. Please check your current password.');
      }
    } catch (err) {
      console.error('Password change error', err);
      setPasswordError('Error connecting to backend server.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getAdminInitial = () => {
    if (!admin?.name) return 'A';
    return admin.name.trim().charAt(0).toUpperCase();
  };

  if (!admin) {
    return null;
  }

  return (
    <div className="admin-layout-container">
      {/* =========================================================================
          Dedicated Frosted Glass Sidebar with the 5 Requested Options
          1. Dashboard
          2. Leads
          3. Meet Scheduled
          4. Services
          5. Logout button
          ========================================================================= */}
      <aside className="admin-sidebar">
        {/* Brand section */}
        <div className="sidebar-brand-section">
          <Link to="/" title="Go to Gen-Vaani Homepage">
            <img src={navbarLogo} alt="Gen-Vaani" className="sidebar-logo" />
          </Link>
          {/* <div className="sidebar-brand-badge">
            <span className="admin-status-dot" />
            <span>Admin Hub</span>
          </div> */}
        </div>

        {/* Sidebar Navigation Menu */}
        <div className="sidebar-menu-list">
          <span className="sidebar-menu-label">Main Navigation</span>

          {/* Option 1: Dashboard */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            id="sidebar-nav-dashboard"
          >
            <span className="sidebar-nav-icon"><FiGrid /></span>
            <span>Dashboard</span>
          </button>

          {/* Option 2: Leads */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
            id="sidebar-nav-leads"
          >
            <span className="sidebar-nav-icon"><FiMail /></span>
            <span>Leads</span>
            <span className="sidebar-badge-count">{leads.length}</span>
          </button>

          {/* Option 3: Meet Scheduled */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'meet_scheduled' ? 'active' : ''}`}
            onClick={() => setActiveTab('meet_scheduled')}
            id="sidebar-nav-meet-scheduled"
          >
            <span className="sidebar-nav-icon"><FiCalendar /></span>
            <span>Meet Scheduled</span>
            <span className="sidebar-badge-count">{displayedMeets.length}</span>
          </button>

          {/* Option 4: Services */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
            id="sidebar-nav-services"
          >
            <span className="sidebar-nav-icon"><FiLayers /></span>
            <span>Services</span>
            <span className="sidebar-badge-count">{services.length}</span>
          </button>

          {/* Option 5: Portfolio Websites Showcase */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'websites' ? 'active' : ''}`}
            onClick={() => setActiveTab('websites')}
            id="sidebar-nav-websites"
            title="Manage showcase websites and upload screenshots to ImageKit"
          >
            <span className="sidebar-nav-icon"><FiGlobe /></span>
            <span>Websites</span>
            <span className="sidebar-badge-count">{websites.length}</span>
          </button>

          {/* Option 6: Profile & Password */}
          <button
            type="button"
            className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            id="sidebar-nav-profile"
            title="View personal profile and change password"
          >
            <span className="sidebar-nav-icon"><FiUser /></span>
            <span>Profile</span>
          </button>

          {/* Quick Action: Export All Excel Reports */}
          <button
            type="button"
            className="sidebar-nav-item"
            style={{ marginTop: '4px', color: '#047857', background: 'rgba(16, 185, 129, 0.08)' }}
            onClick={handleExportMaster}
            id="sidebar-export-excel-btn"
            title="Download complete operations report (Leads + Consultations) in Excel (.xlsx) format"
          >
            <span className="sidebar-nav-icon" style={{ color: '#10b981' }}><FiDownload /></span>
            <span>Export Data</span>
            <span className="export-excel-badge" style={{ marginLeft: 'auto' }}>XLSX</span>
          </button>
        </div>

        {/* Sidebar Footer with Logged in Admin & Option 5: Logout Button */}
        <div className="sidebar-footer-section">
          {/* Active Admin Profile Card - Clickable to open Profile */}
          <button
            type="button"
            className={`sidebar-user-info-card ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            title={`Logged in as ${admin?.email} · Click to view profile & change password`}
            id="sidebar-user-profile-btn"
          >
            <div className="sidebar-user-avatar">
              {getAdminInitial()}
            </div>
            <div className="sidebar-user-text">
              <span className="sidebar-user-name">{admin?.name || 'Ayush'}</span>
              <span className="sidebar-user-email">{admin?.email || 'admin@genvaani.com'}</span>
            </div>
          </button>

          {/* Public Website Link */}
          <Link to="/" className="sidebar-external-link" title="Visit Public Gen-Vaani Website">
            <FiExternalLink /> Visit Website
          </Link>

          {/* Option 5: Logout Button */}
          <button 
            type="button" 
            onClick={handleLogout} 
            className="sidebar-logout-button"
            id="sidebar-logout-btn"
            title="Terminate session and sign out"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* =========================================================================
          Main Content Viewport switching between the 4 tab views
          ========================================================================= */}
      <main className="admin-main-viewport">
        {/* Global Toast Notification Banner across all console views */}
        {toastMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #00278a 0%, #059669 100%)',
            color: '#ffffff',
            padding: '12px 22px',
            borderRadius: '16px',
            marginBottom: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(0, 39, 138, 0.16)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            animation: 'adminCardSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both'
          }}>
            <span style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem' }}>
              <FiCheck style={{ color: '#00cbf0', fontSize: '1.25rem' }} /> {toastMessage}
            </span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
              title="Dismiss notification"
            >
              ✕
            </button>
          </div>
        )}

        {/* =====================================================
            VIEW 1: DASHBOARD
            ===================================================== */}
        {activeTab === 'dashboard' && (
          <div className="tab-view-container animate-fade-in">
            {/* Viewport Header */}
            <div className="viewport-header-bar">
              <div className="viewport-title-group">
                <h2>Dashboard Overview</h2>
                <p>Welcome back, <b>{admin?.name || 'Ayush'}</b> · Real-time agency performance & booking operations</p>
              </div>
              <div className="viewport-actions-group">
                <button
                  type="button"
                  onClick={handleExportMaster}
                  className="export-excel-btn export-excel-btn-primary"
                  id="export-dashboard-master-btn"
                  title="Download complete operations report with all leads and scheduled meetings in Excel (.xlsx)"
                >
                  <FiDownload className="export-btn-icon" />
                  <span>Export All Data (.xlsx)</span>
                  <span className="export-excel-badge">MASTER</span>
                </button>
                <button 
                  type="button" 
                  onClick={handleCopyPublicLink}
                  className="table-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  {copiedLink ? <><FiCheck color="#16a34a" /> Copied Link</> : <><FiCopy /> Copy Booking Link</>}
                </button>
                <Link to="/contact" className="admin-submit-button" style={{ width: 'auto', padding: '0 22px', textDecoration: 'none' }}>
                  <FiCalendar /> View Calendar <FiArrowUpRight />
                </Link>
              </div>
            </div>

            {/* 4 Metric Cards */}
            <div className="dashboard-metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-title">Active Consultations</span>
                  <div className="metric-icon-wrap">
                    <FiCalendar />
                  </div>
                </div>
                <div className="metric-value">{displayedMeets.filter(m => m.status === 'confirmed').length || liveStats.activeBookings || 4}</div>
                {/* <span className="metric-caption">↑ Active confirmed consultations</span> */}
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-title">Leads & Inquiries</span>
                  <div className="metric-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                    <FiMail />
                  </div>
                </div>
                <div className="metric-value">{leads.length || liveStats.pendingInquiries || 5}</div>
                {/* <span className="metric-caption">98% response rate within 2h</span> */}
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-title">Registered Staff Admins</span>
                  <div className="metric-icon-wrap" style={{ background: '#faf5ff', color: '#9333ea' }}>
                    <FiUser />
                  </div>
                </div>
                <div className="metric-value">{liveStats.totalStaffAdmins || 3}</div>
                {/* <span className="metric-caption">MongoDB Synced & Active</span> */}
              </div>

              {/* <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-title">Backend API Status</span>
                  <div className="metric-icon-wrap" style={{ background: '#ecfeff', color: '#0891b2' }}>
                    <FiServer />
                  </div>
                </div>
                <div className="metric-value" style={{ fontSize: '1.45rem', marginTop: '10px' }}>
                  {liveStats.systemStatus || '100% Operational'}
                </div>
                <span className="metric-caption">Node.js Express + Mongoose</span>
              </div> */}
            </div>

            {/* Dashboard Main Grid: Upcoming Calls & Administrator Profile */}
            <div className="dashboard-main-grid">
              <div className="dashboard-panel-card">
                <div className="panel-header">
                  <h3>Upcoming Client Discovery Calls</h3>
                  <button 
                    type="button" 
                    className="table-btn" 
                    onClick={() => setActiveTab('meet_scheduled')}
                  >
                    View All Meets ({displayedMeets.length})
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Client Name</th>
                        <th>Requested Service</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedMeets.map((meet) => {
                        const meetKey = meet._id || meet.id;
                        const meetLink = meet.meetUrl || GENVAANI_MEET_URL;

                        return (
                          <tr key={meetKey}>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 800 }}>{meet.clientName}</span>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                                  {meet.company || 'Direct Client'}
                                </span>
                              </div>
                            </td>
                            <td>{meet.service}</td>
                            <td>{meet.date} · {meet.time}</td>
                            <td>
                              <span className={`status-pill ${meet.status}`}>
                                ✓ {meet.status === 'confirmed' ? 'Confirmed' : meet.status === 'completed' ? 'Completed' : 'Cancelled'}
                              </span>
                            </td>
                            <td>
                              <a 
                                href={meetLink} 
                                target="_blank" 
                                rel="noreferrer"
                                className="table-btn table-btn-primary"
                                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                title={`Join Google Meet: ${meetLink}`}
                              >
                                <FiVideo /> Join Call
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* <div className="dashboard-panel-card">
                <div className="panel-header">
                  <h3>Administrator Identity</h3>
                  <span style={{ color: '#00278a', fontSize: '1.2rem' }}><FiShield /></span>
                </div>

                <div className="profile-spec-list">
                  <div className="profile-spec-item">
                    <span>Account Name</span>
                    <b>{admin?.name || 'Ayush'}</b>
                  </div>
                  <div className="profile-spec-item">
                    <span>Official Email</span>
                    <b>{admin?.email || 'ak4606909@gmail.com'}</b>
                  </div>
                  <div className="profile-spec-item">
                    <span>Phone Contact</span>
                    <b>{admin?.phone || '+91 74280 31830'}</b>
                  </div>
                  <div className="profile-spec-item">
                    <span>Security Clearance</span>
                    <b style={{ color: '#00cbf0' }}>Super Administrator</b>
                  </div>
                  <div className="profile-spec-item">
                    <span>Session Protocol</span>
                    <b>256-Bit JWT + Salt</b>
                  </div>
                  <div className="profile-spec-item">
                    <span>Database</span>
                    <b>MongoDB Localhost:27017</b>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        )}

        {/* =====================================================
            VIEW 2: LEADS
            ===================================================== */}
        {activeTab === 'leads' && (
          <div className="tab-view-container animate-fade-in">
            <div className="viewport-header-bar">
              <div className="viewport-title-group">
                <h2>Leads & Client Inquiries</h2>
                <p>Manage prospect pipeline, budget estimates, and follow-up consultation inquiries</p>
              </div>
              <div className="viewport-actions-group">
                <span className="sidebar-brand-badge">
                  <span className="admin-status-dot" />
                  <span>{leads.length} Total Captured Leads</span>
                </span>

                <div className="export-dropdown-wrapper">
                  <button
                    type="button"
                    className="export-excel-btn"
                    id="export-leads-btn"
                    onClick={() => setLeadsExportOpen(prev => !prev)}
                    title="Export leads details to Excel spreadsheet (.xlsx)"
                  >
                    <FiDownload className="export-btn-icon" />
                    <span>Export Leads (.xlsx)</span>
                    <span className="export-excel-badge">XLSX</span>
                  </button>

                  {leadsExportOpen && (
                    <div className="export-dropdown-menu">
                      <button
                        type="button"
                        className="export-dropdown-item"
                        onClick={() => handleExportLeads('all')}
                        id="export-all-leads-option"
                      >
                        <div>
                          <b>All Leads ({leads.length})</b>
                          <span className="export-dropdown-item-desc">Export complete database of captured leads</span>
                        </div>
                        <FiDownload />
                      </button>

                      {leadsFilter !== 'all' && (
                        <button
                          type="button"
                          className="export-dropdown-item"
                          onClick={() => handleExportLeads('filtered')}
                          id="export-filtered-leads-option"
                        >
                          <div>
                            <b>Current Filter ({filteredLeads.length})</b>
                            <span className="export-dropdown-item-desc">Export only "{leadsFilter.replace('_', ' ')}"</span>
                          </div>
                          <FiDownload />
                        </button>
                      )}

                      <div className="export-dropdown-divider" />

                      <button
                        type="button"
                        className="export-dropdown-item"
                        onClick={handleExportMaster}
                        id="export-master-from-leads-option"
                      >
                        <div>
                          <b style={{ color: '#00278a' }}>Master Report (Leads + Meets)</b>
                          <span className="export-dropdown-item-desc">Comprehensive workbook with 2 sheets</span>
                        </div>
                        <FiFileText color="#0084c7" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs-row">
              <button
                type="button"
                className={`filter-tab-pill ${leadsFilter === 'all' ? 'active' : ''}`}
                onClick={() => setLeadsFilter('all')}
              >
                All Leads ({leads.length})
              </button>
              <button
                type="button"
                className={`filter-tab-pill ${leadsFilter === 'new' ? 'active' : ''}`}
                onClick={() => setLeadsFilter('new')}
              >
                New Inquiries ({leads.filter(l => l.status === 'new').length})
              </button>
              <button
                type="button"
                className={`filter-tab-pill ${leadsFilter === 'in_progress' ? 'active' : ''}`}
                onClick={() => setLeadsFilter('in_progress')}
              >
                In Discussion ({leads.filter(l => l.status === 'in_progress').length})
              </button>
              <button
                type="button"
                className={`filter-tab-pill ${leadsFilter === 'converted' ? 'active' : ''}`}
                onClick={() => setLeadsFilter('converted')}
              >
                Converted Clients ({leads.filter(l => l.status === 'converted').length})
              </button>
            </div>

            {/* Leads Table */}
            <div className="dashboard-panel-card">
              <div style={{ overflowX: 'auto' }}>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Prospect & Company</th>
                      <th>Direct Contact</th>
                      <th>Interested Service</th>
                      <th>Estimated Budget</th>
                      <th>Date Received</th>
                      <th>Pipeline Status</th>
                      <th>Quick Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => {
                      const leadKey = lead._id || lead.id;
                      const formattedDate = lead.createdAt 
                        ? new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : (lead.date || 'Recent');
                      const clientMessage = lead.message || lead.comments;

                      return (
                        <tr key={leadKey}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 800 }}>{lead.name}</span>
                              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                {lead.company || 'Website Lead'}
                              </span>
                              {lead.source && (
                                <span style={{ fontSize: '0.68rem', color: '#0084c7', marginTop: '2px', fontWeight: 600 }}>
                                  via {lead.source}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <a href={`mailto:${lead.email}`} style={{ color: '#0084c7', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
                                {lead.email}
                              </a>
                              {lead.phone ? (
                                <a href={`tel:${lead.phone}`} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.76rem' }}>
                                  {lead.phone}
                                </a>
                              ) : (
                                <span style={{ color: '#94a3b8', fontSize: '0.74rem' }}>No phone given</span>
                              )}
                            </div>
                          </td>
                          <td style={{ maxWidth: '280px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontWeight: 700, color: '#00278a' }}>{lead.service}</span>
                              {clientMessage && (
                                <span style={{ fontSize: '0.77rem', color: '#475569', lineHeight: 1.35, background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', borderLeft: '3px solid #00cbf0' }}>
                                  "{clientMessage}"
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, color: '#0f172a', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', whiteSpace: 'nowrap', display: 'inline-block' }}>
                              {lead.budget || 'Standard Scope'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 600 }}>
                              {formattedDate}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => toggleLeadStatus(lead)}
                              className={`status-pill ${lead.status}`}
                              style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                              title="Click to advance status (New → In Discussion → Converted)"
                            >
                              {lead.status === 'new' && '● New Lead'}
                              {lead.status === 'in_progress' && '⌛ In Discussion'}
                              {lead.status === 'converted' && '✓ Converted'}
                            </button>
                          </td>
                          <td>
                            <button 
                              type="button"
                              onClick={() => setReplyingLead(lead)}
                              className="table-btn table-btn-primary"
                              style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                              title={`Open Gmail Reply Composer for ${lead.email}`}
                            >
                              <FiMail /> Reply
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            VIEW 3: MEET SCHEDULED
            ===================================================== */}
        {activeTab === 'meet_scheduled' && (
          <div className="tab-view-container animate-fade-in">
            <div className="viewport-header-bar">
              <div className="viewport-title-group">
                <h2>Meet Scheduled</h2>
                <p>Upcoming Google Meet video consultations booked by prospective clients</p>
              </div>
              <div className="viewport-actions-group">
                <div className="export-dropdown-wrapper">
                  <button
                    type="button"
                    className="export-excel-btn"
                    id="export-meets-btn"
                    onClick={() => setMeetsExportOpen(prev => !prev)}
                    title="Export scheduled consultations to Excel spreadsheet (.xlsx)"
                  >
                    <FiDownload className="export-btn-icon" />
                    <span>Export Meets (.xlsx)</span>
                    <span className="export-excel-badge">XLSX</span>
                  </button>

                  {meetsExportOpen && (
                    <div className="export-dropdown-menu">
                      <button
                        type="button"
                        className="export-dropdown-item"
                        onClick={handleExportMeetings}
                        id="export-all-meets-option"
                      >
                        <div>
                          <b>All Scheduled Meets ({displayedMeets.length})</b>
                          <span className="export-dropdown-item-desc">Export all client consultations</span>
                        </div>
                        <FiDownload />
                      </button>

                      <div className="export-dropdown-divider" />

                      <button
                        type="button"
                        className="export-dropdown-item"
                        onClick={handleExportMaster}
                        id="export-master-from-meets-option"
                      >
                        <div>
                          <b style={{ color: '#00278a' }}>Master Report (Leads + Meets)</b>
                          <span className="export-dropdown-item-desc">Comprehensive workbook with 2 sheets</span>
                        </div>
                        <FiFileText color="#0084c7" />
                      </button>
                    </div>
                  )}
                </div>

                <Link to="/contact" className="admin-submit-button" style={{ width: 'auto', padding: '0 20px', textDecoration: 'none' }}>
                  <FiCalendar /> Open Public Calendar <FiArrowUpRight />
                </Link>
              </div>
            </div>

            {/* Scheduled Meetings Cards Grid */}
            <div className="meeting-cards-grid">
              {displayedMeets.map((meet) => {
                const meetKey = meet._id || meet.id;
                const meetLink = meet.meetUrl || GENVAANI_MEET_URL;

                return (
                  <div key={meetKey} className="meeting-card">
                    <div className="meeting-card-top">
                      <span className="meeting-time-badge">
                        <FiClock /> {meet.date}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleMeetingStatus(meet)}
                        className={`status-pill ${meet.status}`}
                        style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                        title="Click to toggle status (Confirmed → Completed → Cancelled)"
                      >
                        ✓ {meet.status}
                      </button>
                    </div>

                    <div>
                      <h4 className="meeting-client-name">{meet.clientName}</h4>
                      <p className="meeting-client-service">
                        <b>{meet.company || 'Direct Client'}</b> · {meet.service}
                      </p>
                    </div>

                    {/* Contact detail row if provided */}
                    {(meet.email || meet.phone) && (
                      <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: '#64748b', flexWrap: 'wrap' }}>
                        {meet.email && (
                          <a href={`mailto:${meet.email}`} style={{ color: '#0084c7', textDecoration: 'none', fontWeight: 600 }}>
                            {meet.email}
                          </a>
                        )}
                        {meet.phone && (
                          <a href={`tel:${meet.phone}`} style={{ color: '#64748b', textDecoration: 'none' }}>
                            {meet.phone}
                          </a>
                        )}
                      </div>
                    )}

                    <div className="meeting-room-box">
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Session Window</span>
                        <strong style={{ fontSize: '0.88rem', color: '#00278a' }}>{meet.time} ({meet.timezone || 'IST'})</strong>
                      </div>
                      <a 
                        href={meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="table-btn table-btn-primary"
                        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        title={`Join room: ${meetLink}`}
                      >
                        <FiVideo /> Join Meet
                      </a>
                    </div>

                    <div style={{ 
                      padding: '8px 12px', 
                      background: '#f0fdf4', 
                      borderRadius: '10px', 
                      border: '1px solid #dcfce7',
                      fontSize: '0.74rem', 
                      color: '#15803d',
                      wordBreak: 'break-all'
                    }}>
                      <b>Google Meet Link: </b>
                      <a href={meetLink} target="_blank" rel="noreferrer" style={{ color: '#0084c7', fontWeight: 700 }}>
                        {meetLink}
                      </a>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', color: '#475569' }}>
                      <span style={{ fontWeight: 700, color: '#00278a' }}>Agenda / Notes: </span>
                      {meet.notes || 'No agenda notes provided.'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================
            VIEW 4: SERVICES & DYNAMIC PRICING CMS
            ===================================================== */}
        {activeTab === 'services' && (
          <div className="tab-view-container animate-fade-in">
            <div className="viewport-header-bar">
              <div className="viewport-title-group">
                <h2>Agency Services & Dynamic Pricing</h2>
                <p>Create, customize, and manage agency services, pricing packages, capabilities, and deliverables in real-time.</p>
              </div>
              <div className="viewport-actions-group" style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  className="table-btn"
                  title="Sync default agency services into MongoDB"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiRefreshCw /> Sync Defaults
                </button>
                <button
                  type="button"
                  onClick={handleAddNewService}
                  className="admin-submit-button"
                  style={{ width: 'auto', padding: '0 20px', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiPlus /> Add New Service
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '22px',
              gap: '14px',
              flexWrap: 'wrap'
            }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search services by title, slug or description..."
                  value={servicesSearch}
                  onChange={(e) => setServicesSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="sidebar-brand-badge">
                  <span className="admin-status-dot" />
                  <span>{services.length} Services in Database</span>
                </span>
              </div>
            </div>

            {servicesLoading && services.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                <div className="admin-btn-spinner" style={{ margin: '0 auto 14px', borderColor: '#00278a', borderTopColor: '#00cbf0' }} />
                <span>Loading services from database...</span>
              </div>
            ) : services.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px dashed #cbd5e1'
              }}>
                <FiLayers style={{ fontSize: '3rem', color: '#94a3b8', marginBottom: '14px' }} />
                <h3 style={{ margin: '0 0 8px', color: '#00278a' }}>No Services Found in Database</h3>
                <p style={{ margin: '0 0 20px', color: '#64748b' }}>
                  Click "Sync Defaults" to populate MongoDB with the standard 6 agency services, or create a brand new one.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button type="button" onClick={handleSeedDefaults} className="table-btn table-btn-primary">
                    <FiRefreshCw /> Sync 6 Default Services
                  </button>
                  <button type="button" onClick={handleAddNewService} className="admin-submit-button" style={{ width: 'auto', padding: '0 20px', margin: 0 }}>
                    <FiPlus /> Create Custom Service
                  </button>
                </div>
              </div>
            ) : (
              /* Services Grid */
              <div className="services-admin-grid">
                {services
                  .filter((s) => {
                    if (!servicesSearch.trim()) return true;
                    const term = servicesSearch.toLowerCase();
                    return (
                      (s.title || '').toLowerCase().includes(term) ||
                      (s.slug || '').toLowerCase().includes(term) ||
                      (s.description || '').toLowerCase().includes(term)
                    );
                  })
                  .map((srv) => {
                    const srvKey = srv._id || srv.id || srv.slug;
                    const pkgs = srv.pricing?.packages || [];
                    const basicPrice = pkgs.find((p) => p.id === 'basic')?.price || '$999';
                    const advPrice = pkgs.find((p) => p.id === 'advanced')?.price || '$2,499';
                    const customPrice = pkgs.find((p) => p.id === 'custom')?.price || 'Custom';

                    return (
                      <div key={srvKey} className="service-admin-card">
                        <div className="service-card-header">
                          <div className="service-icon-box" style={{ fontSize: '1.25rem', color: '#00278a' }}>
                            {getAdminServiceVectorIcon(srv)}
                          </div>
                          <span
                            className={`status-pill ${srv.isActive !== false ? 'confirmed' : 'new'}`}
                            style={{ fontSize: '0.72rem' }}
                          >
                            {srv.isActive !== false ? '● Active on Site' : 'Draft'}
                          </span>
                        </div>

                        <h4>{srv.title}</h4>
                        <span className="service-slug-badge">
                          /services/{srv.slug}
                        </span>
                        <p>{srv.description}</p>

                        {/* Pricing Highlight Pill */}
                        <div className="pricing-preview-tag">
                          <span>
                            <FiDollarSign style={{ verticalAlign: '-1px' }} /> Packages:
                          </span>
                          <span>
                            {basicPrice} · {advPrice} · {customPrice}
                          </span>
                        </div>

                        {/* Specifications Meta */}
                        <div className="service-card-meta-row">
                          <span className="service-meta-chip">
                            <FiActivity /> {srv.workflow?.steps?.length || 5} Steps
                          </span>
                          <span className="service-meta-chip">
                            <FiLayers /> {srv.features?.length || 4} Features
                          </span>
                          <span className="service-meta-chip">
                            <FiCpu /> {srv.techStack?.length || 0} Tech Tags
                          </span>
                          <span className="service-meta-chip">
                            <FiHelpCircle /> {srv.faqs?.length || 0} FAQs
                          </span>
                        </div>

                        {/* Card Actions */}
                        <div className="service-card-actions">
                          <button
                            type="button"
                            onClick={() => handleEditService(srv)}
                            className="table-btn table-btn-primary"
                            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                          >
                            <FiEdit2 /> Edit & Pricing
                          </button>

                          <Link
                            to={`/services/${srv.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="table-btn"
                            title="Preview Public Service Page"
                            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px' }}
                          >
                            <FiEye />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteService(srv)}
                            className="table-btn"
                            title="Delete this service"
                            style={{ color: '#dc2626', borderColor: '#fca5a5', padding: '0 12px' }}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            VIEW 5: PORTFOLIO WEBSITES SHOWCASE CMS (IMAGEKIT)
            ===================================================== */}
        {activeTab === 'websites' && (
          <div className="tab-view-container animate-fade-in">
            <div className="viewport-header-bar">
              <div className="viewport-title-group">
                <h2>Portfolio Websites & Showcase</h2>
                <p>Upload website screenshots to ImageKit, link client URLs, and publish to the public portfolio page.</p>
              </div>
              <div className="viewport-actions-group" style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={loadWebsites}
                  className="table-btn"
                  title="Refresh websites list"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiRefreshCw /> Refresh
                </button>
                <button
                  type="button"
                  onClick={handleAddNewWebsite}
                  className="admin-submit-button"
                  id="admin-add-website-btn"
                  style={{ width: 'auto', padding: '0 20px', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiPlus /> Add New Website
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '22px',
              gap: '14px',
              flexWrap: 'wrap'
            }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search websites by title or category..."
                  value={websitesSearch}
                  onChange={(e) => setWebsitesSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="sidebar-brand-badge">
                  <span className="admin-status-dot" />
                  <span>{websites.length} Websites in Database</span>
                </span>
              </div>
            </div>

            {/* Loading state */}
            {websitesLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                <FiRefreshCw className="spin-icon" style={{ fontSize: '2rem', marginBottom: '12px' }} />
                <p>Loading portfolio websites from MongoDB...</p>
              </div>
            ) : websites.length === 0 ? (
              <div className="admin-empty-websites">
                <div className="empty-websites-icon">
                  <FiGlobe />
                </div>
                <h3>No Websites in Portfolio Yet</h3>
                <p>Click "Add New Website" above to upload your first website screenshot to ImageKit and publish it to the portfolio showcase.</p>
                <button
                  type="button"
                  onClick={handleAddNewWebsite}
                  className="table-btn table-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: '0 auto' }}
                >
                  <FiPlus /> Add Your First Website
                </button>
              </div>
            ) : (
              <div className="website-admin-grid">
                {websites
                  .filter((site) => {
                    if (!websitesSearch.trim()) return true;
                    const q = websitesSearch.toLowerCase();
                    return (
                      site.title?.toLowerCase().includes(q) ||
                      site.category?.toLowerCase().includes(q)
                    );
                  })
                  .map((site) => {
                    const siteKey = site._id || site.id;
                    const previewImg = site.image || site.tallImage || '';

                    return (
                      <div key={siteKey} className="website-admin-card">
                        {/* Thumbnail Viewport */}
                        <div className="website-admin-thumb-wrapper">
                          {previewImg ? (
                            <img
                              src={previewImg}
                              alt={site.title}
                              className="website-admin-thumb"
                              loading="lazy"
                            />
                          ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                              <FiGlobe style={{ fontSize: '2.5rem' }} />
                            </div>
                          )}
                          <div className="website-admin-thumb-overlay">
                            <button
                              type="button"
                              className="btn-thumb-preview"
                              onClick={() => setPreviewWebsiteModal(site)}
                              title="Preview Full Scrollable View"
                            >
                              <FiEye /> Scroll Preview
                            </button>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="website-admin-body">
                          <div className="website-admin-top-row">
                            <span className="website-admin-category-pill">
                              {site.category || 'Web Application'}
                            </span>
                            <span className={`website-admin-status-pill ${site.isActive ? 'active' : 'hidden'}`}>
                              {site.isActive ? '● Live' : '○ Hidden'}
                            </span>
                          </div>

                          <h3 className="website-admin-title">{site.title}</h3>

                          {site.liveUrl && (
                            <a
                              href={site.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="website-admin-url-link"
                              title={site.liveUrl}
                            >
                              <FiExternalLink /> {site.liveUrl}
                            </a>
                          )}

                          {/* Card Actions */}
                          <div className="website-admin-card-actions">
                            <button
                              type="button"
                              onClick={() => handleEditWebsite(site)}
                              className="table-btn table-btn-primary"
                              style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                              <FiEdit2 /> Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => setPreviewWebsiteModal(site)}
                              className="table-btn"
                              title="Scroll Preview"
                              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px' }}
                            >
                              <FiEye />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteWebsite(site)}
                              className="table-btn"
                              title="Delete this website"
                              style={{ color: '#dc2626', borderColor: '#fca5a5', padding: '0 12px' }}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            VIEW 6: ADMINISTRATOR PROFILE & CHANGE PASSWORD
            ===================================================== */}
        {activeTab === 'profile' && (
          <div className="tab-view-container animate-fade-in">
            {/* Viewport Header */}
            <div className="viewport-header-bar">
              <div className="viewport-title-group">
                <h2>Administrator Profile</h2>
                <p>Personal profile credentials, contact information, and security settings</p>
              </div>
              <div className="viewport-actions-group">
                <span className="sidebar-brand-badge">
                  <span className="admin-status-dot" />
                  <span>{admin?.role || 'Super Administrator'}</span>
                </span>
              </div>
            </div>

            {/* Profile Card showing Name, Email, Phone Number, Password, and Change Password */}
            <div className="profile-container-card">
              {/* Profile Hero Header */}
              <div className="profile-hero-section">
                <div className="profile-avatar-large">
                  {getAdminInitial()}
                </div>
                <div className="profile-hero-info">
                  <h3>{admin?.name || 'Administrator'}</h3>
                  <div className="profile-hero-badges">
                    <span className="profile-badge-pill role">
                      <FiShield /> {admin?.role || 'Super Administrator'}
                    </span>
                    <span className="profile-badge-pill status">
                      <FiCheckCircle /> Active Session
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Primary Profile Attributes: Name, Email, Phone, Password */}
              <div className="profile-specs-grid">
                {/* 1. Full Name */}
                <div className="profile-spec-row">
                  <div className="profile-spec-left">
                    <div className="profile-spec-icon-wrap">
                      <FiUser />
                    </div>
                    <div className="profile-spec-meta">
                      <span className="profile-spec-label">Administrator Name</span>
                      <span className="profile-spec-val">{admin?.name || 'Ayush'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Email Address */}
                <div className="profile-spec-row">
                  <div className="profile-spec-left">
                    <div className="profile-spec-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                      <FiMail />
                    </div>
                    <div className="profile-spec-meta">
                      <span className="profile-spec-label">Email Address</span>
                      <span className="profile-spec-val">{admin?.email || 'ak4606909@gmail.com'}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Phone Number */}
                <div className="profile-spec-row">
                  <div className="profile-spec-left">
                    <div className="profile-spec-icon-wrap" style={{ background: '#faf5ff', color: '#9333ea' }}>
                      <FiPhone />
                    </div>
                    <div className="profile-spec-meta">
                      <span className="profile-spec-label">Phone Number</span>
                      <span className="profile-spec-val">{admin?.phone || '+91 74280 31830'}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Password & Change Password Option */}
                <div className="profile-spec-row">
                  <div className="profile-spec-left">
                    <div className="profile-spec-icon-wrap" style={{ background: '#fef2f2', color: '#dc2626' }}>
                      <FiLock />
                    </div>
                    <div className="profile-spec-meta">
                      <span className="profile-spec-label">Password</span>
                      <span className="profile-pw-dots">••••••••••••</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-toggle-change-pw"
                    onClick={() => {
                      setShowChangePassword(prev => !prev);
                      setPasswordError('');
                      setPasswordSuccess('');
                    }}
                    id="btn-toggle-change-password"
                  >
                    <FiKey />
                    <span>{showChangePassword ? 'Close Form' : 'Change Password'}</span>
                  </button>
                </div>
              </div>

              {/* Change Password Form Drawer / Box */}
              {showChangePassword && (
                <form onSubmit={handleUpdatePassword} className="change-password-box">
                  <div className="change-password-header">
                    <h4>Change Account Password</h4>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Minimum 6 characters</span>
                  </div>

                  {passwordError && (
                    <div className="pw-alert-box error">
                      ⚠ {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="pw-alert-box success">
                      ✓ {passwordSuccess}
                    </div>
                  )}

                  <div className="change-password-form-grid">
                    {/* Current Password */}
                    <div className="pw-input-group">
                      <label htmlFor="current-pw-input">Current Password</label>
                      <div className="pw-input-relative">
                        <input
                          id="current-pw-input"
                          type={showCurrentPw ? 'text' : 'password'}
                          placeholder="Enter current password"
                          value={currentPasswordInput}
                          onChange={(e) => setCurrentPasswordInput(e.target.value)}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="pw-eye-btn"
                          onClick={() => setShowCurrentPw(p => !p)}
                          title={showCurrentPw ? 'Hide password' : 'Show password'}
                        >
                          {showCurrentPw ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="pw-input-group">
                      <label htmlFor="new-pw-input">New Password</label>
                      <div className="pw-input-relative">
                        <input
                          id="new-pw-input"
                          type={showNewPw ? 'text' : 'password'}
                          placeholder="At least 6 characters"
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="pw-eye-btn"
                          onClick={() => setShowNewPw(p => !p)}
                          title={showNewPw ? 'Hide password' : 'Show password'}
                        >
                          {showNewPw ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="pw-input-group">
                      <label htmlFor="confirm-pw-input">Confirm New Password</label>
                      <div className="pw-input-relative">
                        <input
                          id="confirm-pw-input"
                          type={showConfirmPw ? 'text' : 'password'}
                          placeholder="Re-enter new password"
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="pw-eye-btn"
                          onClick={() => setShowConfirmPw(p => !p)}
                          title={showConfirmPw ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPw ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="change-password-actions">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="btn-save-password"
                      id="btn-submit-change-password"
                    >
                      {passwordLoading ? (
                        <>Updating...</>
                      ) : (
                        <><FiCheck /> Save New Password</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordError('');
                        setPasswordSuccess('');
                      }}
                      className="btn-cancel-password"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Service Add/Edit Modal */}
      <ServiceEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        service={editingService}
        onSaved={handleServiceSaved}
        token={getAdminToken()}
      />

      {/* Website Showcase Add/Edit Modal (ImageKit CMS) */}
      <WebsiteEditorModal
        isOpen={isWebsiteEditorOpen}
        onClose={() => setIsWebsiteEditorOpen(false)}
        website={editingWebsite}
        onSaved={handleWebsiteSaved}
        adminToken={getAdminToken()}
      />

      {/* Gmail-Style Email Reply Composer Modal */}
      <GmailReplyModal
        isOpen={Boolean(replyingLead)}
        lead={replyingLead}
        onClose={() => setReplyingLead(null)}
        onSent={(leadId, updates) => {
          setLeads(prev => prev.map(l => {
            if ((l._id && l._id === leadId) || (l.id && l.id === leadId)) {
              return { ...l, ...updates };
            }
            return l;
          }));
          showToast(`✓ Reply sent! Pipeline status updated to ${updates.status === 'converted' ? 'Converted' : 'In Discussion'}.`);
        }}
        adminName={admin?.name || 'Ayush'}
        adminEmail={admin?.email || 'ak4606909@gmail.com'}
      />

      {/* Athenura Scrollable Website Preview Modal (Matching Reference) */}
      {previewWebsiteModal && (
        <div className="portfolio-modal-backdrop" onClick={() => setPreviewWebsiteModal(null)}>
          <div className="site-preview-modal-window" onClick={(e) => e.stopPropagation()}>
            {/* Header: Only Website Name on left, link + close on right */}
            <div className="site-modal-header-bar">
              <h2 className="site-modal-title">{previewWebsiteModal.title}</h2>
              <div className="site-modal-controls">
                {previewWebsiteModal.liveUrl && (
                  <a
                    href={previewWebsiteModal.liveUrl}
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
                  onClick={() => setPreviewWebsiteModal(null)}
                  title="Close preview"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {/* Body: Scrollable Website Screenshot Only */}
            <div className="site-modal-scrollable-body">
              <img
                src={previewWebsiteModal.tallImage || previewWebsiteModal.image}
                alt={previewWebsiteModal.title}
                className="site-modal-scroll-img"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
