import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SalesBot from './components/SalesBot';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import OurTeam from './pages/OurTeam';
import OurAdvisors from './pages/OurAdvisors';
import OurPartners from './pages/OurPartners';
import OurClients from './pages/OurClients';
import Industries from './pages/Industries';
import Events from './pages/Events';
import Careers from './pages/Careers';
import './styles/shared.css';

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

export default function App() {
  return (
    <LanguageProvider>
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
        <Route path="*" element={<Placeholder name="Not Found" />} />
      </Routes>
      <Footer />
      <SalesBot />
    </LanguageProvider>
  );
}
