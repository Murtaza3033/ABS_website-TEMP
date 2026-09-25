import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import ConstellationCanvas from './ConstellationCanvas';
import BenefitsCarousel from './BenefitsCarousel';
import SEO, { resolveSeo } from '../../components/SEO';
import { usePage } from '../../hooks/useCms';

export default function OurPartners() {
  const { t, lang } = useLanguage();
  const { data: cmsPage } = usePage('our-partners');
  const seo = resolveSeo(cmsPage?.seo, lang);
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const featRef = useRef(null);
  const ghostRefs = useRef([]);
  const [play, setPlay] = useState(false);

  useLayoutEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = 'var(--white)';
    return () => { document.body.style.background = prev; };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPlay(true); return undefined; }
    const id = setTimeout(() => setPlay(true), 120);
    return () => clearTimeout(id);
  }, []);

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onHeroMove = (e) => {
    if (reduced() || !heroRef.current || !cardRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    const tx = (e.clientX - r.left) / r.width - 0.5;
    const ty = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transform = `rotateY(${tx * 7}deg) rotateX(${-ty * 6}deg)`;
  };
  const onHeroLeave = () => { if (cardRef.current) cardRef.current.style.transform = ''; };
  const onFeatMove = (e) => {
    if (reduced() || !featRef.current) return;
    const r = featRef.current.getBoundingClientRect();
    const tx = (e.clientX - r.left) / r.width - 0.5;
    const ty = (e.clientY - r.top) / r.height - 0.5;
    ghostRefs.current.forEach((g, i) => {
      if (!g) return;
      const depth = (i + 1) * 11;
      g.style.transition = 'transform .4s cubic-bezier(.2,.7,.3,1)';
      g.style.transform = `translate(${-tx * depth}px,${-ty * depth}px)`;
    });
  };
  const onFeatLeave = () => { ghostRefs.current.forEach((g) => { if (g) g.style.transform = 'translate(0,0)'; }); };

  const hw = `hw${play ? ' play' : ''}`;

  return (
    <main>
      <SEO
        {...seo}
        title={seo.title || t('Our Partners')}
        description={seo.description || t('Strong partnerships are the foundation of success. At Align Business Systems, we build collaborative relationships that empower growth, innovation, and mutual success.')}
      />
      {/* HERO */}
      <section ref={heroRef} className="sec" onPointerMove={onHeroMove} onPointerLeave={onHeroLeave} style={{ position: 'relative', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', padding: '80px 32px 66px', overflow: 'hidden', isolation: 'isolate' }}>
        <ConstellationCanvas hostRef={heroRef} />
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: '920px', height: '520px', background: 'radial-gradient(ellipse at center,rgba(26,86,219,.09),transparent 62%)', pointerEvents: 'none', zIndex: 0 }} />
        <div className="hero-grid" style={{ maxWidth: '1180px', margin: '0 auto', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: '52px', alignItems: 'center' }}>
          <div>
            <DataReveal className="eyebrow" style={{ display: 'block' }}>{t("Partners")}</DataReveal>
            <h1 className="h1" data-headline>
              <span className={hw} style={{ animationDelay: '0ms' }}>{t("Growth")}</span>{' '}
              <span className={hw} style={{ animationDelay: '90ms' }}>{t("is")}</span>{' '}
              <span className={hw} style={{ animationDelay: '180ms' }}>{t("better")}</span><br />
              <span className={hw} style={{ animationDelay: '270ms' }}>{t("built")}</span>{' '}
              <span className={hw} style={{ animationDelay: '360ms' }}><span className="cave" style={{ fontSize: '1.18em' }}>{t("together")}</span>.</span>
            </h1>
            <DataReveal as="p" className="lede" style={{ margin: '20px 0 0', maxWidth: '520px' }}>{t("Strong partnerships are the foundation of success. At Align Business Systems, we build collaborative relationships that empower growth, innovation, and mutual success. Together, we can create")} <span className="cave" style={{ fontSize: '1.35em' }}>{t("limitless possibilities")}</span> {t("and achieve extraordinary results.")}</DataReveal>
          </div>
          {/* two-way value concept */}
          <DataReveal style={{ position: 'relative', height: '340px', perspective: '1100px' }}>
            <div ref={cardRef} className="tilt3d" style={{ position: 'absolute', inset: 0, borderRadius: '26px', overflow: 'hidden', background: '#0f1729', boxShadow: '0 40px 90px -40px rgba(15,23,41,.6)', transformStyle: 'preserve-3d' }}>
              <img src="/assets/images/about/brochure.webp" alt="" onError={(e) => e.currentTarget.remove()} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.05)', opacity: 0.5 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(150deg,rgba(26,86,219,.72),rgba(15,23,41,.62))', mixBlendMode: 'multiply' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(150deg,rgba(26,86,219,.4),transparent 60%)' }} />
              <svg viewBox="0 0 400 340" fill="none" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
                <path d="M70,110 C170,110 230,150 330,150" stroke="rgba(255,255,255,.5)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="24 496" style={{ animation: 'pFlow 2.8s linear infinite' }} />
                <path d="M330,210 C230,210 170,180 70,180" stroke="rgba(143,184,255,.75)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="24 496" style={{ animation: 'pFlowR 2.8s linear .6s infinite' }} />
              </svg>
              <div style={{ position: 'absolute', left: '26px', top: '50%', transform: 'translateY(-50%)', width: '78px', height: '78px', borderRadius: '20px', background: 'rgba(255,255,255,.95)', display: 'grid', placeItems: 'center', color: '#1a56db', fontWeight: 800, fontSize: '26px', boxShadow: '0 16px 30px -12px rgba(0,0,0,.5)', animation: 'floatY 6s ease-in-out infinite' }}>A</div>
              <div style={{ position: 'absolute', right: '26px', top: '50%', transform: 'translateY(-50%)', width: '78px', height: '78px', borderRadius: '20px', background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.35)', display: 'grid', placeItems: 'center', color: '#fff', animation: 'floatY 6.6s ease-in-out .5s infinite' }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 17l2 2 4-4" /><path d="M2 12l4-4 4 4-4 4-4-4z" /><path d="M14 12l4-4 4 4-4 4" /></svg>
              </div>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: '18px', textAlign: 'center', fontSize: '10.5px', letterSpacing: '1.5px', color: 'rgba(255,255,255,.8)', textTransform: 'uppercase', fontWeight: 700 }}>{t("Value flowing both ways")}</div>
            </div>
          </DataReveal>
        </div>
        <DataReveal className="op-scrollcue">{t("Explore")}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></DataReveal>
      </section>

      {/* DISCOVER NETWORK */}
      <section className="sec" style={{ background: '#fff', padding: '80px 32px 90px' }}>
        <div className="net-grid" style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: '.92fr 1.08fr', gap: '56px', alignItems: 'center' }}>
          <div style={{ order: 2 }}>
            <DataReveal as="span" className="eyebrow">{t("Our Network")}</DataReveal>
            <DataReveal as="h2" className="h2" style={{ fontSize: 'clamp(28px,3.6vw,38px)' }}>{t("Discover Our Partners Network")}</DataReveal>
            <DataReveal as="p" style={{ fontSize: '15.5px', lineHeight: 1.75, color: '#4b5565', margin: '18px 0 0' }}>{t("Explore our Partners Network — a diverse ecosystem of trusted companies that collaborate with Align Business Systems. Our partners span a range of industries and specialties, bringing unique expertise and innovative solutions to the table. Together, we create a dynamic network that fosters collaboration, drives innovation, and unlocks new opportunities for growth and success.")}</DataReveal>
            <DataReveal style={{ display: 'flex', gap: '14px', marginTop: '26px', flexWrap: 'wrap', alignItems: 'center' }}>
              <SmartLink href="/contact-us.html" style={{ background: '#1a56db', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '14px 28px', borderRadius: '999px', boxShadow: '0 12px 28px -10px rgba(26,86,219,.5)' }}>{t("Contact Us")}</SmartLink>
              <a href="#featured" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: '#1a56db', fontSize: '15px', fontWeight: 600, padding: '14px 6px' }}>{t("Learn More →")}</a>
            </DataReveal>
          </div>
          {/* featured partner stage */}
          <DataReveal ref={featRef} id="featured" onPointerMove={onFeatMove} onPointerLeave={onFeatLeave} style={{ order: 1, position: 'relative', minHeight: '470px', perspective: '1200px' }}>
            <div ref={(el) => { ghostRefs.current[0] = el; }} style={{ position: 'absolute', top: '8px', left: '-14px', width: '74%', background: '#fff', border: '1px solid #eef2f8', borderRadius: '18px', boxShadow: '0 24px 50px -34px rgba(15,23,41,.3)', padding: '18px', opacity: 0.5, zIndex: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ width: '30px', height: '30px', borderRadius: '9px', background: '#e8effc' }} /><div style={{ height: '9px', width: '44%', borderRadius: '5px', background: '#e4ebf5' }} /></div>
              <div style={{ height: '8px', width: '80%', borderRadius: '5px', background: '#eef2f8', marginTop: '16px' }} />
              <div style={{ height: '8px', width: '66%', borderRadius: '5px', background: '#eef2f8', marginTop: '9px' }} />
              <div style={{ height: '8px', width: '72%', borderRadius: '5px', background: '#eef2f8', marginTop: '9px' }} />
            </div>
            <div ref={(el) => { ghostRefs.current[1] = el; }} style={{ position: 'absolute', top: '112px', left: '6px', width: '58%', background: '#fff', border: '1px solid #eef2f8', borderRadius: '16px', boxShadow: '0 22px 46px -34px rgba(15,23,41,.28)', padding: '16px', opacity: 0.4, zIndex: 0 }}>
              <div style={{ fontSize: '9px', letterSpacing: '.5px', color: '#aeb8c8', textTransform: 'uppercase', fontWeight: 700 }}>{t("Network activity")}</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '40px', marginTop: '10px' }}>
                {['50%', '74%', '60%', '88%', '68%'].map((h, i) => <div key={i} style={{ flex: 1, height: h, background: ['#dbe6ff', '#c3d6fb', '#dbe6ff', '#9dbcf3', '#dbe6ff'][i], borderRadius: '3px 3px 0 0' }} />)}
              </div>
            </div>
            <div className="pPartner" style={{ position: 'absolute', right: 0, bottom: 0, width: '82%', background: '#fff', border: '1px solid #eef2f8', borderRadius: '24px', padding: '28px', boxShadow: '0 40px 84px -34px rgba(15,23,41,.5)', zIndex: 2 }}>
              <div style={{ position: 'absolute', left: '-8px', top: '-70px', zIndex: 3, background: '#0f1729', color: '#fff', borderRadius: '14px', padding: '13px 15px', maxWidth: '172px', boxShadow: '0 26px 50px -20px rgba(15,23,41,.6)', animation: 'floatY 5.5s ease-in-out infinite' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{ width: '24px', height: '24px', flexShrink: 0, borderRadius: '8px', background: 'rgba(75,139,255,.22)', display: 'grid', placeItems: 'center', color: '#8fb8ff' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l7 16 2-6 6-2z" /></svg></div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, lineHeight: 1.3 }}>{t("Meet a partner in our network")}</div>
                </div>
                <div style={{ position: 'absolute', left: '34px', bottom: '-7px', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '8px solid #0f1729' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '1.5px', color: '#1a56db', background: '#eef4ff', borderRadius: '999px', padding: '6px 12px', textTransform: 'uppercase' }}>{t("Featured Partner")}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#1a9d55' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#1a9d55', animation: 'pDot 1.8s ease-in-out infinite' }} />{t("Active")}</span>
              </div>
              <div style={{ height: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0 6px' }}>
                <img src="/assets/images/clients/xpedite-logo.webp" loading="lazy" decoding="async" alt="Xpedite Technology Solutions" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'grid'; }} style={{ maxHeight: '76px', maxWidth: '100%', objectFit: 'contain' }} />
                <div style={{ display: 'none', width: '100%', height: '76px', placeItems: 'center', background: 'linear-gradient(135deg,#1a56db,#4b8bff)', color: '#fff', borderRadius: '12px', fontSize: '22px', fontWeight: 800, letterSpacing: '.5px' }}>Xpedite</div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, textAlign: 'center' }}>Xpedite Technology Solutions</div>
              <p style={{ fontSize: '13px', lineHeight: 1.65, color: '#5b6472', margin: '12px 0 0' }}>{t("At Xpedite Technology Solutions, we're a team of experts delivering fast, satisfactory solutions to resolve clients' issues. We solve complex business problems with the most relevant technology — expertise across Microsoft Dynamics, Power Platform, 365, BI, Data Warehousing and custom mobile & web app development, plus infrastructure and security solutions.")}</p>
            </div>
          </DataReveal>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="sec" style={{ background: 'linear-gradient(180deg,var(--tint) 0%,#eef4ff 100%)', borderTop: '1px solid #eef1f6', padding: '96px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '660px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{t("Partnership Benefits")}</DataReveal>
            <DataReveal as="h2" className="h2">{t("Unlock the")} <span className="cave" style={{ fontSize: '1.3em' }}>{t("Power")}</span> {t("of Partnership")}</DataReveal>
          </div>
          <BenefitsCarousel />
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="sec" style={{ background: '#fff', padding: '90px 32px 110px' }}>
        <DataReveal style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg,#1a56db,#123f9e)', borderRadius: '28px', padding: '66px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <div style={{ position: 'relative', fontFamily: 'var(--font-hand)', fontSize: '26px', fontWeight: 700, color: '#9fc0ff' }}>{t("Become part of the Align partner network.")}</div>
          <h2 style={{ position: 'relative', fontSize: 'clamp(24px,3.4vw,33px)', lineHeight: 1.22, letterSpacing: '-.8px', fontWeight: 800, color: '#fff', margin: '10px auto 0', maxWidth: '820px' }}>{t("Let's talk about innovative solutions, business automation and how we can help you achieve your business goals.")}</h2>
          <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: '#fff', color: '#1a56db', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px' }}>{t("Let's talk")}</SmartLink>
            <SmartLink href="/contact-us.html" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,.4)' }}>{t("Get Info")}</SmartLink>
          </div>
        </DataReveal>
      </section>
    </main>
  );
}
