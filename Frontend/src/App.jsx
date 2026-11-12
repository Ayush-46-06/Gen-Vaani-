import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Preloader from './components/Preloader/Preloader';
import { PreloaderProvider, usePreloader } from './context/PreloaderContext';
import './App.css';

// Eagerly load primary landing page for instant initial render
import Home from './pages/Home';

// Code-split all other secondary pages & heavy admin consoles
const Portfolio = lazy(() => import('./pages/Portfolio'));
const About = lazy(() => import('./pages/About'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Contact = lazy(() => import('./pages/Contact'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const AdminRegister = lazy(() => import('./pages/Admin/AdminRegister'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminProtectedRoute = lazy(() => import('./components/AdminProtectedRoute'));

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`app-wrapper ${isAdminRoute ? 'admin-layout-wrapper' : ''}`}>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <Suspense fallback={<div className="route-loading-fallback"><div className="route-spinner" /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/service/:slug" element={<ServiceDetail />} />

          {/* Legal & Compliance Routes */}
          <Route path="/terms" element={<LegalPage initialTab="terms" />} />
          <Route path="/terms-of-service" element={<LegalPage initialTab="terms" />} />
          <Route path="/privacy" element={<LegalPage initialTab="privacy" />} />
          <Route path="/privacy-policy" element={<LegalPage initialTab="privacy" />} />
          <Route path="/cookies" element={<LegalPage initialTab="cookies" />} />
          <Route path="/cookie-policy" element={<LegalPage initialTab="cookies" />} />
          <Route path="/legal" element={<LegalPage initialTab="terms" />} />
          
          {/* Admin Authentication & Console Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />
          <Route path="/admin" element={<AdminLogin />} />
        </Routes>
      </Suspense>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function AppContent() {
  const [showPreloader, setShowPreloader] = useState(() => {
    try {
      return !sessionStorage.getItem('genvaani_preloader_seen');
    } catch {
      return true;
    }
  });
  const { isPreloaderDone, setIsPreloaderDone } = usePreloader();

  useEffect(() => {
    try {
      if (sessionStorage.getItem('genvaani_preloader_seen')) {
        setIsPreloaderDone(true);
      }
    } catch {}
  }, [setIsPreloaderDone]);

  const handlePreloaderComplete = () => {
    try {
      sessionStorage.setItem('genvaani_preloader_seen', 'true');
    } catch {}
    setIsPreloaderDone(true);
    setShowPreloader(false);
  };

  return (
    <>
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}
      <Router>
        <AppLayout />
      </Router>
    </>
  );
}

function App() {
  return (
    <PreloaderProvider>
      <AppContent />
    </PreloaderProvider>
  );
}

export default App;
