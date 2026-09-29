import { Fragment, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import CountUp from '../../components/CountUp';
import IndustryPanel from './IndustryPanel';
import Convergence from './Convergence';
import { useIndustries, useIndustriesPage, usePage } from '../../hooks/useCms';
import { locT } from '../../lib/loc';
import { cmsPic, cssUrl } from '../../lib/cmsImage';
import { headWords, splitHighlight } from '../../lib/headWords';
import SEO, { resolveSeo } from '../../components/SEO';
import { IND, NODES } from './industriesData';

const HEAD = ['The', 'industries', 'we', 'help', 'move', 'forward.'];
const AUTO = 4600;

/* Static IND reshaped like the Sanity `industry` documents (same fields):
   instant placeholderData and the safe fallback if the CMS is unreachable
   or empty. */
const FALLBACK_INDUSTRIES = IND.map((ind, i) => ({
  _id: `fallback-${i}`,
  name: { en: ind.name },
  short: { en: ind.short },
  icon: ind.ico,
  insight: { en: ind.insight },
  focus: { en: ind.focus },
  headline: { en: ind.head },
  description: { en: ind.para },
  modules: ind.modules.map((m) => ({ en: m })),
  members: ind.members.map(([name, file]) => ({ _id: name, name, logoPath: file ? `/assets/images/clients/${file}.webp` : null })),
  illustrationPath: `/assets/images/industries/${ind.img}.webp`,
  order: i + 1,
}));

/* Sanity industry doc (or FALLBACK_INDUSTRIES entry) -> what the tabs, panel
   and hero montage render. Images are undefined while the CMS list is
   pending (lib/cmsImage.js), so nothing downloads twice. */
function toIndustry(doc, { lang, t, pic }) {
  const L = (v) => locT(v, lang, t);
  return {
    key: doc._id,
    name: L(doc.name),
    short: L(doc.short) || L(doc.name),
    ico: doc.icon || 'chip',
    insight: L(doc.insight),
    focus: L(doc.focus),
    head: L(doc.headline),
    para: L(doc.description),
    modules: (doc.modules || []).map(L).filter(Boolean),
    // member logo box is 82x34: 164w covers 2x screens
    members: (doc.members || []).filter(Boolean).map((m) => ({
      key: m._id || m.name,
      name: m.name || '',
      hasLogo: Boolean(m.logo?.asset || m.logoPath),
      logo: pic(m.logo, { width: 164 }, m.logoPath),
    })),
    imgUrl: pic(doc.illustration, { width: 1200 }, doc.illustrationPath),
  };
}

export default function Industries() {
  const { t, lang } = useLanguage();
  const { data: cmsPage } = usePage('industries');
  const seo = resolveSeo(cmsPage?.seo, lang);
  /* Page texts: "Industries page" singleton. Tabs + panels: the Industry
     documents (sorted by order). Built-in copy while loading / if the CMS is
     empty or unreachable. */
  const { data: cms } = useIndustriesPage();
  const tx = (k, fallback) => locT(cms?.[k], lang, t) || t(fallback);
  const industriesQuery = useIndustries({ fallbackData: FALLBACK_INDUSTRIES });
  const cmsIndustries = industriesQuery.data;
  const pic = cmsPic(industriesQuery);
  const industries = (cmsIndustries && cmsIndustries.length > 0 ? cmsIndustries : FALLBACK_INDUSTRIES)
    .map((doc) => toIndustry(doc, { lang, t, pic }));
  const count = industries.length;
  // one source for "50+ businesses": Our Clients page -> Trust line
  const businesses = Number.isFinite(cms?.businessesCount) ? cms.businessesCount : 50;
  const heading = locT(cms?.heroHeading, lang, t);
  const heroWords = heading
    ? headWords(heading, locT(cms?.heroHighlight, lang, t))
    : HEAD.map((w) => (w === 'forward.' ? { w: t('forward'), hl: true, pre: '', post: '.' } : { w: t(w) }));
  const convHeading = locT(cms?.convHeading, lang, t);
  const [convA, convHl, convB] = convHeading
    ? splitHighlight(convHeading, locT(cms?.convHighlight, lang, t))
    : [`${t('Six industries.')} `, t('One'), ` ${t('Align.')}`];
  const nodes = cms?.nodes?.length
    ? cms.nodes.map((n, i) => ({ title: locT(n?.title, lang, t), metric: locT(n?.metric, lang, t), text: locT(n?.text, lang, t), icon: n?.icon || NODES[i % NODES.length][3] }))
    : NODES.map((n) => ({ title: t(n[0]), metric: t(n[1]), text: t(n[2]), icon: n[3] }));
  const hub = {
    title: cms?.hubTitle || 'Align Business Systems',
    text: tx('hubText', 'One platform · one login · one source of truth'),
    pills: cms?.hubPills?.length ? cms.hubPills.map((p) => locT(p, lang, t)).filter(Boolean) : ['Finance', 'People', 'Inventory', 'Field Ops', 'Reporting'].map((p) => t(p)),
  };
  const labels = {
    focus: tx('focusLabel', 'Focus'),
    modules: tx('modulesLabel', 'Runs on Align'),
    members: tx('membersLabel', 'Trusted here by'),
    one: tx('clientSingular', 'client on Align'),
    many: tx('clientPlural', 'clients on Align'),
  };
  // `cur` only counts up (autoplay / selection); the tab shown is cur % count,
  // so the rotation keeps working whatever the number of industries.
  const [cur, setCur] = useState(0);
  const idx = cur % count;
  const [play, setPlay] = useState(false);
  const autoRef = useRef(true);
  const baseRef = useRef(0);
  const fillRef = useRef(null);
  const parallaxRef = useRef(null);
  const showcaseRef = useRef(null);
  const curRef = useRef(0);
  curRef.current = idx;

  /* Stable showcase height: industries differ in copy/chips/client count, so
     the auto-rotating panel used to resize (and shove the page) every few
     seconds. A probe renders every industry's panel off-screen for one
     synchronous layout pass (never painted), and the tallest becomes the
     panel's min-height. Re-measured on font load, width and language change. */
  const panelWrapRef = useRef(null);
  const [panelMin, setPanelMin] = useState(0);
  const [probing, setProbing] = useState(false);
  const [measureKey, setMeasureKey] = useState(0);
  useLayoutEffect(() => { setProbing(true); }, [measureKey, lang, count]);
  useLayoutEffect(() => {
    if (!probing) return;
    const hs = Array.from(panelWrapRef.current?.querySelectorAll('[data-panel-probe] > .panel') || [], (el) => el.getBoundingClientRect().height);
    setPanelMin(Math.ceil(Math.max(0, ...hs)));
    setProbing(false);
  }, [probing]);
  useEffect(() => {
    let alive = true;
    document.fonts?.ready?.then(() => { if (alive) setMeasureKey((k) => k + 1); });
    let w = window.innerWidth;
    let id = 0;
    const onResize = () => {
      if (window.innerWidth === w) return;
      w = window.innerWidth;
      clearTimeout(id);
      id = setTimeout(() => setMeasureKey((k) => k + 1), 150);
    };
    window.addEventListener('resize', onResize);
    return () => { alive = false; clearTimeout(id); window.removeEventListener('resize', onResize); };
  }, []);

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
        if (e >= 1) { baseRef.current = t; setCur((c) => c + 1); }
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
  }, [idx]);

  const select = (i, manual) => {
    setCur(((i % count) + count) % count);
    if (manual) { autoRef.current = false; baseRef.current = performance.now(); if (fillRef.current) fillRef.current.style.width = '0%'; }
  };
  const jumpFromNode = (i) => { select(i, true); showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  const hw = `hw${play ? ' play' : ''}`;
  const d = industries[idx];

  return (
    <main>
      <SEO
        {...seo}
        title={seo.title || t('Our Presence')}
        description={seo.description || tx('heroText', 'Across manufacturing floors, pharmacies, storefronts and solar rooftops, we build the systems that keep operations running. Different sectors, the same discipline.')}
      />
      {/* HERO */}
      <section className="sec" style={{ position: 'relative', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', padding: '80px 32px 40px', overflow: 'hidden', isolation: 'isolate' }}>
        <div className="indMontage">
          {industries.map((ind, i) => (
            <span key={ind.key} className={i === idx ? 'on' : ''} style={{ backgroundImage: cssUrl(ind.imgUrl) }} />
          ))}
        </div>
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: '920px', height: '520px', background: 'radial-gradient(ellipse at center,rgba(26,86,219,.08),transparent 62%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 className="h1" data-headline>
            {heroWords.map((x, i) => (
              <Fragment key={i}>
                <span className={hw} style={{ animationDelay: `${i * 85}ms` }}>
                  {x.hl ? <>{x.pre}<span className="cave cave-end" style={{ fontSize: '1.2em' }}>{x.w}</span>{x.post}</> : x.w}
                </span>
                {i < heroWords.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </h1>
          <DataReveal as="p" className="lede" style={{ margin: '22px auto 0', maxWidth: '600px' }}>{tx('heroText', 'Across manufacturing floors, pharmacies, storefronts and solar rooftops, we build the systems that keep operations running. Different sectors, the same discipline.')}</DataReveal>
          <DataReveal className="ind-trustline">
            <span><b><CountUp end={count} duration={1300} /></b> {tx('industriesAfter', 'industries')}</span>
            <span className="tdot" />
            <span><b><CountUp end={businesses} duration={1300} /></b>{tx('businessesAfter', '+ businesses')}</span>
            <span className="tdot" />
            <span><b>{cms?.platformValue || '1'}</b> {tx('platformAfter', 'platform')}</span>
          </DataReveal>
          <DataReveal className="ind-scrollcue">{tx('heroScrollCue', 'Explore')}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></DataReveal>
        </div>
      </section>

      {/* TABBED SHOWCASE */}
      <section ref={showcaseRef} className="sec" style={{ background: '#fff', padding: '36px 32px 90px' }}>
        <div ref={panelWrapRef} style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <DataReveal
            className="iTabs"
            role="tablist"
            aria-label={t('Industries')}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); select(curRef.current + 1, true); } else if (e.key === 'ArrowLeft') { e.preventDefault(); select(curRef.current - 1, true); } }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', padding: '8px', background: 'var(--tint)', border: '1px solid #eef1f6', borderRadius: '999px', width: 'fit-content', margin: '0 auto', maxWidth: '100%', overflowX: 'auto' }}
          >
            {industries.map((ind, i) => {
              const on = i === idx;
              return (
                <button key={ind.key} id={`iTab-${i}`} className="iTab" role="tab" aria-selected={on} aria-controls="iPanel" onClick={() => select(i, true)}
                  style={{ background: on ? '#1a56db' : 'transparent', color: on ? '#fff' : '#0f1729', boxShadow: on ? '0 12px 24px -10px rgba(26,86,219,.55)' : 'none' }}>{ind.short}</button>
              );
            })}
          </DataReveal>
          <DataReveal className="iProg"><i ref={fillRef} style={{ width: '0%' }} /></DataReveal>
          <div className="panel" id="iPanel" role="tabpanel" aria-labelledby={`iTab-${idx}`} style={{ marginTop: '34px', minHeight: panelMin && !probing ? `${panelMin}px` : undefined }}>
            <IndustryPanel key={idx} d={d} labels={labels} parallaxRef={parallaxRef} />
          </div>
          {probing && (
            <div data-panel-probe aria-hidden="true" inert style={{ position: 'absolute', left: 0, right: 0, top: 0, visibility: 'hidden', pointerEvents: 'none' }}>
              {industries.map((x) => (
                <div key={x.key} className="panel"><IndustryPanel d={x} labels={labels} probe /></div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONVERGENCE */}
      <section className="sec" style={{ background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', borderTop: '1px solid #eef1f6', padding: '90px 32px 100px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <DataReveal as="span" className="eyebrow">{tx('convEyebrow', 'One platform, every sector')}</DataReveal>
            <DataReveal as="h2" className="h2">{convA}{convHl ? <span className="cave cave-sp" style={{ fontSize: '1.28em' }}>{convHl}</span> : null}{convB}</DataReveal>
            <DataReveal as="p" style={{ fontSize: '16px', lineHeight: 1.6, color: '#5b6472', margin: '14px auto 0', maxWidth: '600px' }}>{tx('convText', 'Every sector runs on the same platform — finance, people, inventory, field ops and reporting flowing into one source of truth.')}</DataReveal>
          </div>
          <Convergence nodes={nodes} hub={hub} onJump={jumpFromNode} />
        </div>
      </section>

      {/* CTA */}
      <section className="sec" style={{ background: '#fff', padding: '70px 32px 110px' }}>
        <DataReveal style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg,#1a56db,#123f9e)', borderRadius: '28px', padding: '66px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <div style={{ position: 'relative', fontFamily: 'var(--font-hand)', fontSize: '26px', fontWeight: 700, color: '#9fc0ff' }}>{tx('ctaKicker', "Don't see your industry? Let's talk about what we can build for you.")}</div>
          <h2 style={{ position: 'relative', fontSize: 'clamp(24px,3.4vw,33px)', lineHeight: 1.22, letterSpacing: '-.8px', fontWeight: 800, color: '#fff', margin: '10px auto 0', maxWidth: '820px' }}>{tx('ctaHeading', "Let's talk about innovative solutions, business automation and how we can help you achieve your business goals.")}</h2>
          <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: '#fff', color: '#1a56db', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px' }}>{tx('ctaPrimary', "Let's talk")}</SmartLink>
            <SmartLink href="/contact-us.html" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,.4)' }}>{tx('ctaSecondary', 'Get Info')}</SmartLink>
          </div>
        </DataReveal>
      </section>
    </main>
  );
}
