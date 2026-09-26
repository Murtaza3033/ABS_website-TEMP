import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SalesBot from './components/SalesBot';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home/Home.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';

// All stylesheets load here, eagerly and in this fixed order, so the cascade
// never depends on which (lazy) page was visited first: every page sheet
// redefines :root / html,body, and shared + i18n must come last.
import './styles/home.css';
import './styles/contact-us.css';
import './styles/about-us.css';
import './styles/our-team.css';
import './styles/our-advisors.css';
import './styles/our-partners.css';
import './styles/our-clients.css';
import './styles/industries.css';
import './styles/events.css';
import './styles/careers.css';
import './styles/products.css';
import './styles/shared.css';
import './styles/i18n.css';

// Home (the landing page) and NotFound ship in the entry chunk; every other
// page is its own chunk, fetched on first visit.
const ContactUs = lazy(() => import('./pages/ContactUs/ContactUs.jsx'));
const AboutUs = lazy(() => import('./pages/AboutUs/AboutUs.jsx'));
const OurTeam = lazy(() => import('./pages/OurTeam/OurTeam.jsx'));
const OurAdvisors = lazy(() => import('./pages/OurAdvisors/OurAdvisors.jsx'));
const OurPartners = lazy(() => import('./pages/OurPartners/OurPartners.jsx'));
const OurClients = lazy(() => import('./pages/OurClients/OurClients.jsx'));
const Industries = lazy(() => import('./pages/Industries/Industries.jsx'));
const Events = lazy(() => import('./pages/Events/Events.jsx'));
const Careers = lazy(() => import('./pages/Careers/Careers.jsx'));
const ProductsIndex = lazy(() => import('./pages/Products/ProductsIndex.jsx'));
const ProductPage = lazy(() => import('./pages/Products/ProductPage.jsx'));

// React Router doesn't reset scroll position on navigation by default —
// without this, clicking a nav link mid-scroll on one page lands the new
// page at that same scroll depth instead of the top.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <LanguageProvider>
      <ScrollToTop />
      <Header />
      {/* The boundary sits inside the shell so Header/Footer survive a page
          crash or a failed chunk download; it resets on navigation. */}
      <ErrorBoundary resetKey={pathname}>
        {/* min-height keeps the Footer from jumping up while a page chunk loads */}
        <Suspense fallback={<main style={{ minHeight: '100vh' }} />}>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
      <SalesBot />
    </LanguageProvider>
  );
}
