import { Fragment, useState, useEffect, useLayoutEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import CountUp from '../../components/CountUp';
import ClientWall from './ClientWall';
import Sectors from './Sectors';
import { NUMBERS } from './clientsData';
import SEO, { resolveSeo } from '../../components/SEO';
import { usePage } from '../../hooks/useCms';

const HEAD = ['The', 'businesses', "we're", 'proud', 'to', 'work', 'with.'];

export default function OurClients() {
  const { t, lang } = useLanguage();
  const { data: cmsPage } = usePage('our-clients');
  const seo = resolveSeo(cmsPage?.seo, lang);
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

  const hw = `hw${play ? ' play' : ''}`;

  return (
    <main>
      <SEO
        {...seo}
        title={seo.title || t('Our Clients')}
        description={seo.description || t("Every name here chose to trust us with the systems their business runs on. Their growth is the story we're proudest of — and the reason we keep building.")}
      />
      {/* HERO */}
      <section className="sec" style={{ position: 'relative', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', padding: '80px 32px 46px', overflow: 'hidden' }}>
        <div className="dotfield" />
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: '920px', height: '520px', background: 'radial-gradient(ellipse at center,rgba(26,86,219,.09),transparent 62%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 className="h1" data-headline>
            {HEAD.map((w, i) => (
              <Fragment key={i}>
                <span className={hw} style={{ animationDelay: `${i * 85}ms` }}>
                  {w === 'proud' ? <span className="cave" style={{ fontSize: '1.22em' }}>{t("proud")}</span> : t(w)}
                </span>
                {i < HEAD.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </h1>
          <DataReveal as="p" className="lede" style={{ margin: '20px auto 0', maxWidth: '600px' }}>{t("Every name here chose to trust us with the systems their business runs on. Their growth is the story we're proudest of — and the reason we keep building.")}</DataReveal>
          <DataReveal className="oc-trustline">
            <span>{t("Trusted by")} <b><CountUp end={35} duration={1400} /></b>{t("+ businesses")}</span>
            <span className="tdot" />
            <span>{t("across")} <b>6</b> {t("industries")}</span>
            <span className="tdot" />
            <span><b>100%</b> {t("in-house")}</span>
          </DataReveal>
        </div>
      </section>

      {/* CLIENT WALL */}
      <section className="sec" style={{ background: '#fff', padding: '40px 32px 90px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ClientWall />
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="sec" style={{ background: 'linear-gradient(180deg,#fff 0%,#f4f8ff 100%)', borderTop: '1px solid #eef1f6', padding: '96px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '660px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{t("Across every sector")}</DataReveal>
            <DataReveal as="h2" className="h2">{t("One system.")} <span className="cave" style={{ fontSize: '1.3em' }}>{t("Six")}</span> {t("industries.")}</DataReveal>
            <DataReveal as="p" style={{ fontSize: '16px', lineHeight: 1.65, color: '#4b5565', margin: '16px 0 0' }}>{t("From factory floors to pharmacies to solar rooftops — the businesses that trust us span the breadth of how the country actually works. Every one of them connects back to a single place.")}</DataReveal>
          </div>
          <Sectors />
        </div>
      </section>

      {/* BY THE NUMBERS */}
      <section className="sec" style={{ background: '#0f1729', position: 'relative', overflow: 'hidden', padding: '90px 32px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%,rgba(26,86,219,.26),transparent 58%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow light">{t("The track record")}</DataReveal>
            <DataReveal as="h2" className="h2" style={{ color: '#fff' }}>{t("Trust, by the numbers.")}</DataReveal>
          </div>
          <div className="num-grid">
            {NUMBERS.map((n) => (
              <DataReveal key={n[2]} style={{ background: '#131c2e', border: '1px solid rgba(255,255,255,.08)', borderRadius: '20px', padding: '34px 28px', textAlign: 'center' }}>
                <div style={{ fontSize: '52px', fontWeight: 800, letterSpacing: '-1.5px', color: '#fff', lineHeight: 1 }}><CountUp end={n[0]} suffix={n[1]} /></div>
                <div style={{ fontSize: '14.5px', color: '#96a2ba', marginTop: '12px' }}>{t(n[2])}</div>
              </DataReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="sec" style={{ background: '#fff', padding: '90px 32px 110px' }}>
        <DataReveal style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg,#1a56db,#123f9e)', borderRadius: '28px', padding: '66px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <div style={{ position: 'relative', fontFamily: 'var(--font-hand)', fontSize: '26px', fontWeight: 700, color: '#9fc0ff' }}>{t("Join the businesses that grow with Align.")}</div>
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
