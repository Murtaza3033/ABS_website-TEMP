import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SalesBot from './components/SalesBot';
import Home from './pages/Home/Home.jsx';
import ContactUs from './pages/ContactUs/ContactUs.jsx';
import AboutUs from './pages/AboutUs/AboutUs.jsx';
import OurTeam from './pages/OurTeam/OurTeam.jsx';
import OurAdvisors from './pages/OurAdvisors/OurAdvisors.jsx';
import OurPartners from './pages/OurPartners/OurPartners.jsx';
import OurClients from './pages/OurClients/OurClients.jsx';
import Industries from './pages/Industries/Industries.jsx';
import Events from './pages/Events/Events.jsx';
import Careers from './pages/Careers/Careers.jsx';
import ProductsIndex from './pages/Products/ProductsIndex.jsx';
import ProductPage from './pages/Products/ProductPage.jsx';
import './styles/shared.css';
import './styles/i18n.css';

// Temporary placeholder until each page component is converted (Step 3, one at a time).
function Placeholder({ name }) {
  return (
    <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '140px 32px', textAlign: 'center' }}>
      <div>
        <div style={{ fontFamily: 'Caveat, cursive', fontSize: 40, color: '#1a56db' }}>{name}</div>
        <p style={{ color: '#5b6472', marginTop: 8 }}>Page component pending conversion.</p>
      </div>
    </main>
  );
}

// React Router doesn't reset scroll position on navigation by default —
// without this, clicking a nav link mid-scroll on one page lands the new
// page at that same scroll depth instead of the top.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/our-advisors" element={<OurAdvisors />} />
        <Route path="/our-partners" element={<OurPartners />} />
        <Route path="/our-clients" element={<OurClients />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/events" element={<Events />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/products" element={<ProductsIndex />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="*" element={<Placeholder name="Not Found" />} />
      </Routes>
      <Footer />
      <SalesBot />
    </LanguageProvider>
  );
}
