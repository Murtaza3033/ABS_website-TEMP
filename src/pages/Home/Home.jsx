import { useEffect } from 'react';
import { HomeProvider } from './HomeContext';
import HeroSection from './sections/HeroSection';
import ClientsSection from './sections/ClientsSection';
import HowWeThinkSection from './sections/HowWeThinkSection';
import ProblemsSection from './sections/ProblemsSection';
import ProductsSection from './sections/ProductsSection';
import ServicesSection from './sections/ServicesSection';
import IndustriesSection from './sections/IndustriesSection';
import CtaSection from './sections/CtaSection';
import { useLanguage } from '../../context/LanguageContext';
import { usePage } from '../../hooks/useCms';
import SEO, { resolveSeo } from '../../components/SEO';
import '../../styles/home.css';

/* Idiomatic Home — real JSX sections driven by HomeProvider's reducer.
   Replaces the fidelity port (index.body.html + index.runtime.js).
   The animated hero itself (HeroSection) is untouched — SEO only adds <head>
   metadata above it. */
export default function Home() {
  const { lang } = useLanguage();
  const { data: cmsPage } = usePage('home');
  const seo = resolveSeo(cmsPage?.seo, lang);

  // Adds .js-revealed the first time each [data-reveal]/.hm-stagger element
  // scrolls into view — same one-shot IntersectionObserver approach
  // Reveal.jsx uses elsewhere on the site, so entrance timing is identical
  // across every browser instead of depending on scroll-timeline support.
  // Runs under reduced-motion too: the stylesheet swaps the slide for a
  // plain cross-fade there rather than dropping the entrance entirely, so
  // the class still needs to land.
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal], .hm-stagger');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('js-revealed'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <HomeProvider>
      <main className="home-rtl">
        <SEO {...seo} />
        <HeroSection />
        <ClientsSection />
        <HowWeThinkSection />
        <ProblemsSection />
        <ProductsSection />
        <ServicesSection />
        <IndustriesSection />
        <CtaSection />
      </main>
    </HomeProvider>
  );
}
