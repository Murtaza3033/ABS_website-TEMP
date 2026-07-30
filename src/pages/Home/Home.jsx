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
