import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import ServiceDetail from './pages/ServiceDetail';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import LegalPage from './pages/LegalPage';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminRegister from './pages/Admin/AdminRegister';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Preloader from './components/Preloader/Preloader';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import './App.css';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`app-wrapper ${isAdminRoute ? 'admin-layout-wrapper' : ''}`}>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
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
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <>
      {showPreloader && (
        <Preloader onComplete={() => setShowPreloader(false)} />
      )}
      <Router>
        <AppLayout />
      </Router>
    </>
  );
}

export default App;
