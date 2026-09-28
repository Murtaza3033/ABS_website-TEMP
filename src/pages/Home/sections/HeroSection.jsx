import { useRef, useState, useLayoutEffect, useEffect, lazy, Suspense } from 'react';
import { useHome, useScrollRegionProps } from '../HomeContext';
import { useLanguage } from '../../../context/LanguageContext';
import BizMockup from './hero/BizMockup';
import PeopleNestMockup from './hero/PeopleNestMockup';
import FieldForceMockup from './hero/FieldForceMockup';
import { useProducts } from '../../../hooks/useCms';
import { locT } from '../../../lib/loc';

/* Hero copy per product. Editable in Sanity (product → "Home page hero");
   these strings are the fallback while the CMS loads or when a field is empty. */
const HERO = {
  biz: { slug: 'businessflo', cond: 'isBiz', title: 'Go 100% paperless.', highlight: 'Transform your operations.', text: 'Businessflo moves approvals, workflows, finance, inventory and daily reporting off paper and into one connected ERP — every request routed, every action audited, every number live.' },
  pn: { slug: 'peoplenest', cond: 'isPn', title: 'One platform for', highlight: 'all your workspace operations.', text: 'PeopleNest manages employees, attendance, leave, payroll, performance, documents and every HR workflow from one modern platform — with a self-service view for every employee.' },
  pff: { slug: 'pharmafieldflo', cond: 'isPff', title: 'Track every call.', highlight: 'Empower your field force.', text: 'Field Force plans field visits, tracks calls, manages doctors and pharmacies, and turns territory activity into live field performance analytics — visible the moment it happens.' },
  hms: { slug: 'hmsflo', cond: 'isHms', title: 'Run your hospital', highlight: 'from one connected system.', text: 'HMSflo brings OPD, admissions, beds, pharmacy, lab and billing into one hospital management system — every patient tracked, every bed visible, every invoice accurate.' },
};
const HERO_KEYS = Object.keys(HERO);

/* The HMSflo demo is the largest mockup (~47 KB), so it is its own chunk:
   fetched right after first paint (see the effect below, which also
   re-measures the reserved hero height once it has arrived) instead of
   delaying the entry bundle. Businessflo is shown first, so it is always
   loaded long before HMSflo comes round. */
const loadHms = () => import('./hero/HmsMockup');
const HmsMockup = lazy(loadHms);
const HMS_FALLBACK = <div style={{height: '580px'}} />;

/* "Show tips" / "Hide tips" pill (toggles the hand-drawn tour annotations). */
const TIP_PILL = {position: 'absolute', top: '120px', insetInlineEnd: '40px', zIndex: '60', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', background: '#ffffff', border: '1px solid #c9d8f5', color: '#1a56db', fontFamily: 'Outfit,sans-serif', fontSize: '13px', fontWeight: '600', borderRadius: '99px', padding: '9px 16px', boxShadow: '0 8px 20px -10px rgba(15,23,41,.2)'};

/* The mockup's demo menu links are href="#" placeholders — swallow the click
   so they never push "#" into the URL/history or jump the page to the top. */
const swallowDemoLink = (e) => { if (e.target.closest('a[href="#"]')) e.preventDefault(); };

export default function HeroSection() {
  const { c, b, act, state, probe, setProbe, heroHold } = useHome();
  const { t, lang } = useLanguage();
  const scrollRegion = useScrollRegionProps(t('Product preview'));
  const { data: cmsProducts } = useProducts();
  const cmsDoc = (k) => (Array.isArray(cmsProducts) ? cmsProducts.find((p) => p?.slug?.current === HERO[k].slug) : null);
  const copy = (k) => {
    const doc = cmsDoc(k);
    const f = HERO[k];
    return {
      title: locT(doc?.heroTitle, lang, t) || t(f.title),
      highlight: locT(doc?.heroHighlight, lang, t) || t(f.highlight),
      text: locT(doc?.heroText, lang, t) || t(f.text),
    };
  };

  /* Stable hero height. Each product’s headline, mockup collage and
     mobile paragraph differ in height (by up to ~230px on phones, where the
     floating cards stack in-flow), so every auto-rotation used to move the
     whole page below the hero. We reserve the tallest variant instead: a
     probe renders every product at once inside one synchronous layout
     pass (useLayoutEffect → setState → re-render before paint, so it is never
     visible and the active product's block stays mounted — no animation
     replay), measures each block, and reserves the tallest variant: the
     headline block (so the mockup never moves) and the whole section (any
     slack lands at the hero's bottom edge, not between mockup and copy).
     Re-measured on font load, width change and language change. */
  const secRef = useRef(null);
  const [mins, setMins] = useState(null);
  const [measureKey, setMeasureKey] = useState(0);
  useLayoutEffect(() => { setProbe('all'); }, [measureKey, lang, setProbe, cmsProducts]);
  useLayoutEffect(() => {
    if (probe !== 'all') return;
    const sec = secRef.current;
    if (sec) {
      // Every product is stacked in each slot (headline, mockup,
      // mobile paragraph; children in product order). Measure each product
      // alone by briefly display:none-ing the others (synchronous layout
      // reads — nothing is painted), then restore.
      const slots = ['.hero-headpara', '.rtl-mock', '.hero-p-mobile-wrap'].map((q) => Array.from(sec.querySelector(q)?.children || []));
      // total = tallest (section - headline) + the reserved (tallest) headline
      let hp = 0; let rest = 0;
      const n = slots[0].length;
      for (let i = 0; i < n; i++) {
        const hidden = slots.flatMap((kids) => kids.filter((_, k) => k !== i && kids.length === n));
        hidden.forEach((el) => { el.dataset.probeDisplay = el.style.display; el.style.display = 'none'; });
        const h = sec.querySelector('.hero-headpara')?.getBoundingClientRect().height || 0;
        hp = Math.max(hp, h);
        rest = Math.max(rest, sec.getBoundingClientRect().height - h);
        hidden.forEach((el) => { el.style.display = el.dataset.probeDisplay; delete el.dataset.probeDisplay; });
      }
      setMins({ hp: Math.ceil(hp), sec: Math.ceil(rest + Math.ceil(hp)) });
    }
    setProbe(null);
  }, [probe, setProbe]);
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
    // Late-loading mockup images (inside any product's blocks) change heights.
    const sec = secRef.current;
    let imgT = 0;
    const onImg = (e) => { if (e.target.tagName !== 'IMG') return; clearTimeout(imgT); imgT = setTimeout(() => setMeasureKey((k) => k + 1), 120); };
    sec?.addEventListener('load', onImg, true);
    // Lazy HMSflo demo: preload now, re-measure once it can render for real.
    loadHms().then(() => { if (alive) setMeasureKey((k) => k + 1); }, () => {});
    return () => { alive = false; clearTimeout(id); clearTimeout(imgT); window.removeEventListener('resize', onResize); sec?.removeEventListener('load', onImg, true); };
  }, []);
  const hold = probe !== 'all' && mins;
  return (
    <>
      <section ref={secRef} onFocus={(e) => { if (e.target.matches(':focus-visible')) heroHold.current = true; }} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) heroHold.current = false; }} data-screen-label="Hero" data-product={state.product} data-aitab={state.aiTab} data-pnview={state.pnView} data-pnmenu={state.pnMenu || 'none'} onClick={swallowDemoLink} style={{position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,#ffffff 0%,#f7faff 100%)', minHeight: hold ? `${mins.sec}px` : undefined}}>
          {c('tourOn') && (<>
            <div className="hm-annotate" style={{position: 'absolute', inset: '0', zIndex: '60', pointerEvents: 'none', fontFamily: 'Outfit,sans-serif'}}>
              
              
              <div style={{position: 'absolute', top: '918px', insetInlineStart: '50%', marginInlineStart: '-70px', width: '300px', textAlign: 'center', pointerEvents: 'none'}}>
                <svg className="anno-arrow anno-approve" width="110" height="96" viewBox="0 0 110 96" fill="none" style={{display: 'block', margin: '0 auto 2px'}}><path d="M90 90 C 84 44, 52 20, 14 12" stroke="#1a56db" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{strokeDasharray: '240', animation: 'drawCurve 2.6s ease-in-out infinite'}}></path><path d="M14 12 L 34 14 M14 12 L 20 32" stroke="#1a56db" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" style={{animation: 'drawHead 2.6s ease-in-out infinite'}}></path></svg>
                <div style={{fontFamily: 'Caveat,cursive', fontWeight: '700', fontSize: '30px', letterSpacing: '.3px', color: '#1a56db', lineHeight: '1'}}>{t("Approve on the go")}</div>
                <div style={{fontFamily: 'Outfit,sans-serif', fontSize: '12px', fontWeight: '500', color: '#1a56db', lineHeight: '1.4', marginTop: '3px'}}>{t("Approve, hold or reject documents in one tap")}</div>
              </div>
              
            </div>
          </>)}
          {c('tourHidden') && (<>
            <button type="button" onClick={() => act('showTour')} className="hm-annotate" style={TIP_PILL}>{t("💡 Show tips")}</button>
          </>)}
          {c('tourOn') && (
            <button type="button" onClick={() => act('hideTour')} className="hm-annotate" style={TIP_PILL}>{t("✕ Hide tips")}</button>
          )}
          <div style={{position: 'absolute', top: '-220px', insetInlineStart: '50%', marginInlineStart: '-320px', width: '640px', height: '640px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,219,.08) 0%,rgba(26,86,219,0) 65%)'}}></div>
          <div style={{maxWidth: '900px', margin: '0 auto', padding: '70px 32px 0', textAlign: 'center'}}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '4px', position: 'relative', zIndex: '40'}}>
              <div className="hero-switch" style={{display: 'inline-flex', background: '#ffffff', border: '1px solid #e4eaf5', borderRadius: '999px', padding: '4px', boxShadow: '0 2px 10px rgba(15,23,41,.05)'}}>
                <button data-act="goBiz" onClick={() => act('goBiz')} style={{fontFamily: 'Outfit,sans-serif', fontSize: '12.5px', fontWeight: '600', padding: '8px 18px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: '#1a56db', color: '#ffffff', whiteSpace: 'nowrap', transition: 'background .25s cubic-bezier(.2,.7,.3,1),color .2s ease'}}>{t("Businessflo")}</button>
                <button data-act="goPn" onClick={() => act('goPn')} style={{fontFamily: 'Outfit,sans-serif', fontSize: '12.5px', fontWeight: '600', padding: '8px 18px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: 'transparent', color: '#5b6472', whiteSpace: 'nowrap', transition: 'background .25s cubic-bezier(.2,.7,.3,1),color .2s ease'}}>{t("PeopleNest")}</button>
                <button data-act="goPff" onClick={() => act('goPff')} style={{fontFamily: 'Outfit,sans-serif', fontSize: '12.5px', fontWeight: '600', padding: '8px 18px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: 'transparent', color: '#5b6472', whiteSpace: 'nowrap', transition: 'background .25s cubic-bezier(.2,.7,.3,1),color .2s ease'}}>{t("Field Force")}</button>
                <button data-act="goHms" onClick={() => act('goHms')} style={{fontFamily: 'Outfit,sans-serif', fontSize: '12.5px', fontWeight: '600', padding: '8px 18px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: 'transparent', color: '#5b6472', whiteSpace: 'nowrap', transition: 'background .25s cubic-bezier(.2,.7,.3,1),color .2s ease'}}>HMSflo</button>
              </div>
              <button onClick={() => act('togglePause')} title={t('Pause / play auto-switch')} aria-label={t('Pause / play auto-switch')} style={{flexShrink: 0, width: '34px', height: '34px', borderRadius: '50%', border: '1px solid #e4eaf5', background: '#ffffff', color: '#1a56db', cursor: 'pointer', display: 'grid', placeItems: 'center', boxShadow: '0 2px 10px rgba(15,23,41,.05)', fontSize: '10px', fontWeight: '700', transition: 'background .2s'}} data-hv="hv-0"><span>{b('pauseIcon')}</span></button>
            </div>
            <div className="hero-headpara" style={{'--hp-min': hold ? `${mins.hp}px` : undefined, marginTop: '10px'}}>
              {HERO_KEYS.filter((k) => c(HERO[k].cond)).map((k) => {
                const h = copy(k);
                return (
                  <div key={k} style={{animation: 'slideInR .5s cubic-bezier(.2,.7,.3,1) both'}}>
                    <h1 className="hero-h1" style={{fontFamily: '\'Outfit\',sans-serif', fontSize: '50px', lineHeight: '1.1', fontWeight: '700', letterSpacing: '-1.2px', margin: '20px 0 0', color: '#0f1729', textWrap: 'pretty'}}>{h.title} <span style={{color: '#1a56db'}}>{h.highlight}</span></h1>
                    <p className="hero-p-orig" style={{fontSize: '18px', lineHeight: '1.6', color: '#4b5565', margin: '18px auto 0', maxWidth: '600px', textWrap: 'pretty'}}>{h.text}</p>
                  </div>
                );
              })}
            </div>
            
          </div>
      
          
          <div className="rtl-mock" style={{maxWidth: '1120px', margin: '132px auto 0', padding: '0 40px 92px', position: 'relative'}}>
            {c('isBiz') && <BizMockup scrollRegion={scrollRegion} />}
            {c('isPn') && <PeopleNestMockup scrollRegion={scrollRegion} />}
            {c('isPff') && <FieldForceMockup scrollRegion={scrollRegion} />}
            {c('isHms') && <Suspense fallback={HMS_FALLBACK}><HmsMockup scrollRegion={scrollRegion} /></Suspense>}
          </div>
          <div className="hero-p-mobile-wrap">
            {HERO_KEYS.filter((k) => c(HERO[k].cond)).map((k) => (<p key={k} className="hero-p-mobile">{copy(k).text}</p>))}
          </div>
        </section>
    </>
  );
}
