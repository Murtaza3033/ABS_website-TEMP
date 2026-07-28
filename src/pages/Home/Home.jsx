import { HomeProvider } from './HomeContext';
import HeroSection from './sections/HeroSection';
import ClientsSection from './sections/ClientsSection';
import HowWeThinkSection from './sections/HowWeThinkSection';
import ProblemsSection from './sections/ProblemsSection';
import ProductsSection from './sections/ProductsSection';
import ServicesSection from './sections/ServicesSection';
import IndustriesSection from './sections/IndustriesSection';
import CtaSection from './sections/CtaSection';
import '../../styles/home.css';

/* Idiomatic Home — real JSX sections driven by HomeProvider's reducer.
   Replaces the fidelity port (index.body.html + index.runtime.js). */
export default function Home() {
  return (
    <HomeProvider>
      <main className="home-rtl">
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
