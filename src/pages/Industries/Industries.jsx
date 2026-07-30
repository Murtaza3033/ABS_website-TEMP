import { Fragment, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/industries.css';
import BaseReveal from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import CountUp from '../../components/CountUp';
import IndustryPanel from './IndustryPanel';
import Convergence from './Convergence';
import { useIndustries, usePage } from '../../hooks/useCms';
import { loc } from '../../lib/loc';
import { getSanityImageUrl } from '../../lib/sanity';
import SEO, { resolveSeo } from '../../components/SEO';
import { IND } from './industriesData';

function Reveal({ children, ...props }) {
  return <BaseReveal data-reveal="" baseClass="" shownClass="in" {...props}>{children}</BaseReveal>;
}

const HEAD = ['The', 'industries', 'we', 'help', 'move', 'forward.'];
const AUTO = 4600;

/* Static IND reshaped to look like a Sanity `industry` document list — same
   purpose as the OurClients/OurTeam fallbacks: instant placeholderData and
   the safe fallback if the CMS is unreachable or empty. */
const FALLBACK_INDUSTRIES = IND.map((ind, i) => ({
  _id: `fallback-${i}`,
  name: ind.name,
  description: `${ind.head} ${ind.para}`,
  illustrationPath: `/assets/images/industries/${ind.img}.png`,
  order: i + 1,
}));

/* Adapter: a Sanity industry doc (or FALLBACK_INDUSTRIES entry) only covers
   name/description/illustration/order — the showcase panel, tabs and
   convergence diagram also need short/ico/insight/focus/modules/members,
   which have no CMS equivalent yet. So this merges the CMS name + image onto
   the matching static IND entry (by position — Sanity was seeded in the same
   order) rather than replacing it, keeping IndustryPanel/Convergence untouched.
   `description` isn't used here: it was seeded as one combined string and
   can't be safely split back into the separate head/para the panel renders. */
function mergeIndustry(doc, i, lang) {
  const base = IND[i] || IND[0];
  const img = doc.illustrationPath
    ? doc.illustrationPath.replace(/^.*\//, '').replace(/\.[a-z0-9]+$/i, '')
    : base.img;
  return {
    ...base,
    name: loc(doc.name, lang) || base.name,
    img,
    imgUrl: getSanityImageUrl(doc.illustration, { width: 1200 }) || `/assets/images/industries/${img}.png`,
  };
}

export default function Industries() {
  const { t, lang } = useLanguage();
  const { data: cmsPage } = usePage('industries');
  const seo = resolveSeo(cmsPage?.seo, lang);
  const { data: cmsIndustries } = useIndustries({ fallbackData: FALLBACK_INDUSTRIES });
  const industries = (cmsIndustries && cmsIndustries.length > 0 ? cmsIndustries : FALLBACK_INDUSTRIES)
    .map((doc, i) => mergeIndustry(doc, i, lang));
  const [cur, setCur] = useState(0);
  const [play, setPlay] = useState(false);
  const autoRef = useRef(true);
  const baseRef = useRef(0);
  const fillRef = useRef(null);
  const parallaxRef = useRef(null);
  const showcaseRef = useRef(null);
  const curRef = useRef(0);
  curRef.current = cur;

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

  // autoplay + progress fill
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    baseRef.current = performance.now();
    const tick = (t) => {
      if (autoRef.current) {
        const e = (t - baseRef.current) / AUTO;
        if (e >= 1) { baseRef.current = t; setCur((c) => (c + 1) % industries.length); }
        else if (fillRef.current) fillRef.current.style.width = `${Math.min(e, 1) * 100}%`;
      } else if (fillRef.current) {
        fillRef.current.style.width = '0%';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // panel image parallax on scroll
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const onScroll = () => {
      const pw = parallaxRef.current;
      if (!pw || !pw.parentElement) return;
      const r = pw.parentElement.getBoundingClientRect();
      const off = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      pw.style.transform = `translateY(${off * -24}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [cur]);

  const select = (i, manual) => {
    setCur((i + industries.length) % industries.length);
    if (manual) { autoRef.current = false; baseRef.current = performance.now(); if (fillRef.current) fillRef.current.style.width = '0%'; }
  };
  const jumpFromNode = (i) => { select(i, true); showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  const hw = `hw${play ? ' play' : ''}`;
  const d = industries[cur];

  return (
    <main>
      <SEO
        {...seo}
        title={seo.title || t('Our Presence')}
        description={seo.description || t('Across manufacturing floors, pharmacies, storefronts and solar rooftops, we build the systems that keep operations running. Different sectors, the same discipline.')}
      />
      {/* HERO */}
      <section className="sec" style={{ position: 'relative', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', padding: '80px 32px 40px', overflow: 'hidden', isolation: 'isolate' }}>
        <div className="indMontage">
          {industries.map((ind, i) => (
            <span key={ind.short} className={i === cur ? 'on' : ''} style={{ backgroundImage: `url('${ind.imgUrl}')` }} />
          ))}
        </div>
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: '920px', height: '520px', background: 'radial-gradient(ellipse at center,rgba(26,86,219,.08),transparent 62%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal as={SmartLink} href="/about-us.html" className="backlink">{t("← About Align")}</Reveal>
          <h1 className="h1" data-headline>
            {HEAD.map((w, i) => (
              <Fragment key={i}>
                <span className={hw} style={{ animationDelay: `${i * 85}ms` }}>
                  {w === 'forward.' ? <><span className="cave" style={{ fontSize: '1.2em' }}>{t("forward")}</span>.</> : t(w)}
                </span>
                {i < HEAD.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </h1>
          <Reveal as="p" className="lede" style={{ margin: '22px auto 0', maxWidth: '600px' }}>{t("Across manufacturing floors, pharmacies, storefronts and solar rooftops, we build the systems that keep operations running. Different sectors, the same discipline.")}</Reveal>
          <Reveal className="trustline">
            <span><b><CountUp end={6} duration={1300} /></b> {t("industries")}</span>
            <span className="tdot" />
            <span><b><CountUp end={20} duration={1300} /></b>{t("+ businesses")}</span>
            <span className="tdot" />
            <span><b>1</b> {t("platform")}</span>
          </Reveal>
          <Reveal className="scrollcue">{t("Explore")}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></Reveal>
        </div>
      </section>

      {/* TABBED SHOWCASE */}
      <section ref={showcaseRef} className="sec" style={{ background: '#fff', padding: '36px 32px 90px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); select(curRef.current + 1, true); } else if (e.key === 'ArrowLeft') { e.preventDefault(); select(curRef.current - 1, true); } }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', padding: '8px', background: 'var(--tint)', border: '1px solid #eef1f6', borderRadius: '999px', width: 'fit-content', margin: '0 auto', maxWidth: '100%', overflowX: 'auto' }}
          >
            {industries.map((ind, i) => {
              const on = i === cur;
              return (
                <button key={ind.short} className="iTab" onClick={() => select(i, true)}
                  style={{ background: on ? '#1a56db' : 'transparent', color: on ? '#fff' : '#0f1729', boxShadow: on ? '0 12px 24px -10px rgba(26,86,219,.55)' : 'none' }}>{t(ind.short)}</button>
              );
            })}
          </Reveal>
          <Reveal className="iProg"><i ref={fillRef} style={{ width: '0%' }} /></Reveal>
          <div className="panel" style={{ marginTop: '34px' }}>
            <IndustryPanel key={cur} d={d} parallaxRef={parallaxRef} />
          </div>
        </div>
      </section>

      {/* CONVERGENCE */}
      <section className="sec" style={{ background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', borderTop: '1px solid #eef1f6', padding: '90px 32px 100px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <Reveal as="span" className="eyebrow">{t("One platform, every sector")}</Reveal>
            <Reveal as="h2" className="h2">{t("Six industries.")} <span className="cave" style={{ fontSize: '1.28em' }}>{t("One")}</span> {t("Align.")}</Reveal>
            <Reveal as="p" style={{ fontSize: '16px', lineHeight: 1.6, color: '#5b6472', margin: '14px auto 0', maxWidth: '600px' }}>{t("Every sector runs on the same platform — finance, people, inventory, field ops and reporting flowing into one source of truth.")}</Reveal>
          </div>
          <Convergence onJump={jumpFromNode} />
        </div>
      </section>

      {/* CTA */}
      <section className="sec" style={{ background: '#fff', padding: '70px 32px 110px' }}>
        <Reveal style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg,#1a56db,#123f9e)', borderRadius: '28px', padding: '66px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <div style={{ position: 'relative', fontFamily: 'var(--font-hand)', fontSize: '26px', fontWeight: 700, color: '#9fc0ff' }}>{t("Don't see your industry? Let's talk about what we can build for you.")}</div>
          <h2 style={{ position: 'relative', fontSize: 'clamp(24px,3.4vw,33px)', lineHeight: 1.22, letterSpacing: '-.8px', fontWeight: 800, color: '#fff', margin: '10px auto 0', maxWidth: '820px' }}>{t("Let's talk about innovative solutions, business automation and how we can help you achieve your business goals.")}</h2>
          <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: '#fff', color: '#1a56db', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px' }}>{t("Let's talk")}</SmartLink>
            <SmartLink href="/contact-us.html" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,.4)' }}>{t("Get Info")}</SmartLink>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
