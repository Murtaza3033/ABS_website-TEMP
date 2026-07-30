import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/products.css';
import BaseReveal from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import { useProducts } from '../../hooks/useCms';
import { loc } from '../../lib/loc';
import { getSanityImageUrl } from '../../lib/sanity';
import SEO from '../../components/SEO';
import { FALLBACK_PRODUCTS, withMeta, slugOf } from './productsData';

function Reveal({ children, ...props }) {
  return <BaseReveal data-reveal="" baseClass="" shownClass="in" {...props}>{children}</BaseReveal>;
}

export default function ProductsIndex() {
  const { t, lang } = useLanguage();
  const { data: cmsProducts } = useProducts({ fallbackData: FALLBACK_PRODUCTS });
  const products = (cmsProducts && cmsProducts.length > 0 ? cmsProducts : FALLBACK_PRODUCTS)
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((doc, i) => withMeta(doc, i));

  return (
    <main>
      <SEO
        title={t('Our Products')}
        description={t('BusinessFlo, PeopleNest and Field Force — designed, built and supported in-house, and built to work together.')}
      />
      {/* HERO */}
      <section className="sec" style={{ position: 'relative', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', padding: '80px 32px 56px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: '920px', height: '520px', background: 'radial-gradient(ellipse at center,rgba(26,86,219,.09),transparent 62%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal as="span" className="eyebrow">{t('Our Products')}</Reveal>
          <h1 className="h1">
            {t('One platform.')} <span className="cave" style={{ fontSize: '1.2em' }}>{t('Three products.')}</span>
          </h1>
          <Reveal as="p" className="lede" style={{ margin: '20px auto 0', maxWidth: '600px' }}>
            {t('BusinessFlo, PeopleNest and Field Force — designed, built and supported in-house, and built to work together.')}
          </Reveal>
        </div>
      </section>

      {/* GRID */}
      <section className="sec" style={{ background: '#fff', paddingTop: '20px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="prodGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {products.map((p) => {
              const name = loc(p.name, lang);
              const tagline = loc(p.tagline, lang);
              const slug = slugOf(p);
              const logoUrl = getSanityImageUrl(p.logo, { width: 96 });
              return (
                <Reveal
                  key={p._id}
                  as={Link}
                  to={`/products/${slug}`}
                  className="prodCard"
                  style={{ display: 'block', background: '#fff', border: '1px solid #eef2f8', borderRadius: '22px', padding: '28px', boxShadow: '0 20px 46px -30px rgba(15,23,41,.28)' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: p.meta.tint, color: p.meta.accent, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '18px', overflow: 'hidden' }}>
                    {logoUrl ? <img src={logoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '7px' }} /> : name.charAt(0)}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f1729', marginTop: '18px', letterSpacing: '-.4px' }}>{name}</div>
                  <p style={{ fontSize: '14.5px', lineHeight: 1.6, color: '#5b6472', margin: '10px 0 0', minHeight: '48px' }}>{tagline}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: '18px', fontSize: '13.5px', fontWeight: 700, color: p.meta.accent }}>
                    {t('Explore')} <span className="prodArrow">→</span>
                  </span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec" style={{ background: '#fff', padding: '20px 32px 110px' }}>
        <Reveal style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg,#1a56db,#123f9e)', borderRadius: '28px', padding: '66px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <h2 style={{ position: 'relative', fontSize: 'clamp(24px,3.4vw,33px)', lineHeight: 1.22, letterSpacing: '-.8px', fontWeight: 800, color: '#fff', margin: '0 auto', maxWidth: '820px' }}>
            {t("Let's talk about innovative solutions, business automation and how we can help you achieve your business goals.")}
          </h2>
          <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: '#fff', color: '#1a56db', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px' }}>{t("Let's talk")}</SmartLink>
            <SmartLink href="/contact-us.html" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,.4)' }}>{t('Get Info')}</SmartLink>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
