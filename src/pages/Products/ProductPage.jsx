import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/products.css';
import BaseReveal from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import { useProduct } from '../../hooks/useCms';
import { loc } from '../../lib/loc';
import { getSanityImageUrl } from '../../lib/sanity';
import SEO, { resolveSeo } from '../../components/SEO';
import { FALLBACK_PRODUCTS, resolveDescription, withMeta, findFallbackIndex } from './productsData';

function Reveal({ children, ...props }) {
  return <BaseReveal data-reveal="" baseClass="" shownClass="in" {...props}>{children}</BaseReveal>;
}

export default function ProductPage() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();

  const isKnownSlug = FALLBACK_PRODUCTS.some((p) => p.slug === slug);
  const fallbackIndex = findFallbackIndex(slug);
  const fallbackDoc = FALLBACK_PRODUCTS[fallbackIndex];

  const { data: cmsProduct, isLoading } = useProduct(slug, {
    fallbackData: isKnownSlug ? fallbackDoc : undefined,
  });

  const doc = cmsProduct || (isKnownSlug ? fallbackDoc : null);

  if (!doc && !isLoading) {
    return (
      <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '140px 32px', textAlign: 'center' }}>
        <SEO title={t('Product not found')} noIndex />
        <div>
          <div style={{ fontFamily: 'var(--font-hand)', fontSize: 40, color: 'var(--blue)' }}>{t('Product not found')}</div>
          <p style={{ color: 'var(--muted)', marginTop: 12 }}>
            <Link to="/products" style={{ color: 'var(--blue)', fontWeight: 600 }}>{t('← All Products')}</Link>
          </p>
        </div>
      </main>
    );
  }

  if (!doc) return null; // still resolving an unknown slug — avoid a "not found" flash

  const meta = withMeta(doc, fallbackIndex).meta;
  const name = loc(doc.name, lang) || fallbackDoc.name;
  const tagline = loc(doc.tagline, lang) || fallbackDoc.tagline;
  const description = resolveDescription(doc, lang) || fallbackDoc.description;
  const features = doc.features || [];
  const seo = resolveSeo(doc.seo, lang);

  return (
    <main>
      <SEO
        {...seo}
        title={seo.title || name}
        description={seo.description || tagline || description}
        ogImage={seo.ogImage || getSanityImageUrl(doc.logo, { width: 1200 })}
      />
      {/* HERO */}
      <section className="sec" style={{ position: 'relative', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', padding: '80px 32px 56px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: '920px', height: '520px', background: `radial-gradient(ellipse at center,${meta.tint},transparent 62%)`, pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal as={Link} to="/products" className="backlink" style={{ display: 'inline-block' }}>{t('← All Products')}</Reveal>
          <h1 className="h1">{name}</h1>
          <Reveal as="p" className="lede" style={{ margin: '20px auto 0', maxWidth: '620px' }}>{tagline}</Reveal>
          <Reveal style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: meta.accent, color: '#fff', fontSize: '15px', fontWeight: 600, padding: '14px 30px', borderRadius: '999px', boxShadow: '0 16px 34px -12px rgba(26,86,219,.5)' }}>{t('Book a Demo')}</SmartLink>
            {meta.url ? (
              <a href={`https://${meta.url}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#0f1729', fontSize: '15px', fontWeight: 600, padding: '14px 30px', borderRadius: '999px', border: '1px solid #e3e9f3' }}>
                {t('Visit')} {meta.url} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="sec" style={{ background: '#fff', paddingTop: '10px', paddingBottom: '20px' }}>
        <Reveal as="p" style={{ maxWidth: '780px', margin: '0 auto', fontSize: '16.5px', lineHeight: 1.75, color: '#4b5565', textAlign: 'center' }}>{description}</Reveal>
      </section>

      {/* SHOWCASE — reuses the per-product dashboard-mock demo data already in
          aboutData.jsx (PRODMETA), same visual chrome as ProductCarousel, for
          reference only per the phase's explicit allowance. */}
      <section className="sec" style={{ background: 'linear-gradient(180deg,#fff 0%,#f4f8ff 100%)', borderTop: '1px solid #eef1f6' }}>
        <Reveal style={{ position: 'relative', maxWidth: '940px', margin: '0 auto' }}>
          <div style={{ background: '#0f1729', borderRadius: '24px', padding: '14px', boxShadow: '0 46px 100px -48px rgba(15,23,41,.72)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '2px 8px 12px' }}>
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f57' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#febc2e' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28c840' }} />
              <div style={{ flex: 1, marginLeft: '10px', background: 'rgba(255,255,255,.1)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', color: '#9fb3d4' }}>{meta.url}</div>
            </div>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '56%', background: '#eef2f8', borderRadius: '12px', overflow: 'hidden' }}>
              <img
                src={`/assets/images/about/${meta.img}.webp`}
                alt={`${name} dashboard`}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left' }}
              />
            </div>
          </div>

          <div className="prodShowcaseGrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
            <div style={{ background: '#fff', border: '1px solid #eaeef5', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 20px 44px -30px rgba(15,23,41,.3)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.5px', color: '#8a94a6', textTransform: 'uppercase' }}>{t(meta.topSub)}</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f1729', marginTop: '6px' }}>{t(meta.topTitle)}</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #eaeef5', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 20px 44px -30px rgba(15,23,41,.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.5px', color: '#8a94a6', textTransform: 'uppercase' }}>{t(meta.botLabel)}</span>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#1a9d55' }} />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f1729', marginTop: '6px' }}>{meta.botValue}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: meta.accent, marginTop: '3px' }}>{t(meta.botDelta)}</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FEATURES — only renders if the CMS product actually has entries (none
          seeded yet for any of the 3 products, so this section is currently
          hidden rather than showing empty/fabricated content). */}
      {features.length > 0 ? (
        <section className="sec" style={{ background: '#fff' }}>
          <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
              <Reveal as="span" className="eyebrow">{t('Features')}</Reveal>
              <Reveal as="h2" className="h2">{name}</Reveal>
            </div>
            <div className="prodFeatGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '18px', marginTop: '44px' }}>
              {features.map((f) => (
                <div key={f._key || loc(f.title, lang)} className="prodFeatCard" style={{ background: 'var(--tint)', border: '1px solid #eaeef5', borderRadius: '20px', padding: '26px 22px' }}>
                  <div style={{ fontSize: '16.5px', fontWeight: 700 }}>{loc(f.title, lang)}</div>
                  <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#5b6472', margin: '9px 0 0' }}>{loc(f.description, lang)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="sec" style={{ background: '#fff', padding: '20px 32px 110px' }}>
        <Reveal style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg,#1a56db,#123f9e)', borderRadius: '28px', padding: '66px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <h2 style={{ position: 'relative', fontSize: 'clamp(24px,3.4vw,33px)', lineHeight: 1.22, letterSpacing: '-.8px', fontWeight: 800, color: '#fff', margin: '0 auto', maxWidth: '820px' }}>
            {t('See')} {name} {t('in action.')}
          </h2>
          <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: '#fff', color: '#1a56db', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px' }}>{t('Book a Demo')}</SmartLink>
            <Link to="/products" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,.4)' }}>{t('See other products')}</Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
