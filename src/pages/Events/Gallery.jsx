import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BaseReveal from '../../components/Reveal';
import { useEvent } from '../../hooks/useCms';
import { loc } from '../../lib/loc';
import { getSanityImageUrl } from '../../lib/sanity';
import { Icon, FACTS, GALLERY } from './eventsData';

function Reveal({ children, ...props }) {
  return <BaseReveal data-reveal="" baseClass="" shownClass="in" {...props}>{children}</BaseReveal>;
}

/* Static event reshaped to look like a Sanity `event` document — same purpose
   as the other pages' fallbacks. Only `title` and the gallery paths have a
   clean 1:1 Sanity field; `location` renders in 2-3 differently formatted
   spots in this file with no single canonical string, so it's left static
   (see FACTS/WHY below — no CMS equivalent either). */
const FALLBACK_EVENT = {
  _id: 'fallback-event',
  title: 'ITCN Asia 2023',
  galleryPaths: GALLERY.map(([file, ext]) => `/assets/images/about/${file}.${ext}`),
};

/* Adapter: merges CMS gallery image paths (+ real Sanity image assets, when
   uploaded — Phase 6A) onto the static GALLERY tuples (by position — Sanity
   was seeded in the same order), keeping label/caption (GALLERY[i][2]/[3])
   from the static data since Sanity's event schema has no per-image
   label/caption fields yet. Appends the raw Sanity image object as a 5th
   tuple element so gsrc() below can prefer it over the reconstructed path. */
function mergeGallery(paths, sanityImages) {
  return GALLERY.map((base, i) => {
    const path = paths?.[i];
    const sanityImage = sanityImages?.[i];
    if (!path) return [...base, sanityImage];
    const m = path.match(/\/([^/]+)\.([a-zA-Z0-9]+)$/);
    return m ? [m[1], base[1], base[2], base[3], sanityImage] : [...base, sanityImage]; // ext from local data: CMS *Path strings may carry a stale .png/.jpg
  });
}

/* Featured-event gallery: main stage + thumbnails + lightbox. Current image is
   state (gi); the lightbox open/close, prev/next, keyboard nav and body-scroll
   lock are all state-driven (was the imperative setStage/openLb/closeLb). */
export default function Gallery() {
  const { t, lang } = useLanguage();
  const { data: cmsEvent } = useEvent('itcn-asia-2023', { fallbackData: FALLBACK_EVENT });
  const ev = cmsEvent || FALLBACK_EVENT;
  const title = loc(ev.title, lang) || FALLBACK_EVENT.title;
  const gallery = mergeGallery(ev.galleryPaths, ev.gallery);
  const gsrcLocal = (i) => `/assets/images/about/${gallery[i][0]}.${gallery[i][1]}`;
  const gsrc = (i) => getSanityImageUrl(gallery[i][4], { width: 1200 }) || gsrcLocal(i);

  const [gi, setGi] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);

  const go = (d) => setGi((g) => (g + d + gallery.length) % gallery.length);

  useEffect(() => {
    if (!lbOpen) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setLbOpen(false);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [lbOpen]);

  return (
    <>
      <section className="sec" style={{ background: '#fff', padding: '40px 32px 90px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '26px' }}>
            <span className="eyebrow">{t("Featured Event")}</span>
            <span style={{ flex: 1, height: '1px', background: '#e4eaf3' }} />
            <span style={{ fontSize: '12px', color: '#8a94a6', fontWeight: 600 }}>2023</span>
          </Reveal>

          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: '1.08fr .92fr', gap: '44px', alignItems: 'stretch' }}>
            {/* stage */}
            <Reveal onClick={() => setLbOpen(true)} style={{ position: 'relative', borderRadius: '26px', overflow: 'hidden', minHeight: '460px', background: '#0f1729', boxShadow: '0 40px 90px -44px rgba(15,23,41,.55)', cursor: 'zoom-in' }}>
              <div key={gi} style={{ position: 'absolute', inset: 0, backgroundImage: `url('${gsrc(gi)}')`, backgroundSize: 'cover', backgroundPosition: 'center', animation: 'evFade .4s ease, kenBurns 14s ease-in-out infinite alternate' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg,rgba(15,23,41,.35),rgba(26,86,219,.34))', pointerEvents: 'none' }} />
              <button className="evStageBtn" aria-label="View full size" onClick={(e) => { e.stopPropagation(); setLbOpen(true); }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg></button>
              <span style={{ position: 'absolute', left: '20px', top: '18px', fontSize: '10.5px', fontWeight: 700, letterSpacing: '1.5px', color: '#fff', background: 'rgba(15,23,41,.5)', borderRadius: '999px', padding: '6px 13px', textTransform: 'uppercase', zIndex: 2 }}>{t(gallery[gi][2])}</span>
              <div style={{ position: 'absolute', left: '22px', bottom: '22px', background: '#fff', borderRadius: '16px', padding: '16px 18px', boxShadow: '0 26px 52px -22px rgba(15,23,41,.6)', animation: 'floatY 6.5s ease-in-out infinite', maxWidth: '230px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1a9d55', animation: 'evDot 1.8s ease-in-out infinite' }} /><span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#8a94a6', textTransform: 'uppercase' }}>{t("Exhibited")}</span></div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f1729', marginTop: '8px', lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontSize: '12.5px', color: '#5b6472', marginTop: '3px' }}>{t("Karachi Expo Centre")}</div>
              </div>
              <div style={{ position: 'absolute', right: '22px', top: '64px', background: '#0f1729', color: '#fff', borderRadius: '14px', padding: '12px 15px', boxShadow: '0 24px 48px -20px rgba(15,23,41,.65)', animation: 'floatY2 5.6s ease-in-out infinite' }}>
                <div style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '1px', color: '#8fb8ff', textTransform: 'uppercase' }}>{t("Find us at")}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '4px' }}>Hall 1 · Booth A-30</div>
              </div>
            </Reveal>

            {/* details */}
            <Reveal style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: '#1a56db', background: '#eef4ff', borderRadius: '999px', padding: '6px 13px', textTransform: 'uppercase' }}>{t("Karachi Expo Centre · Pakistan")}</div>
              <h2 className="h2" style={{ fontSize: '34px', margin: '16px 0 0' }}>{title}</h2>
              <p style={{ fontSize: '15.5px', lineHeight: 1.75, color: '#4b5565', margin: '16px 0 0' }}>{t("At Pakistan's leading IT & telecom exhibition, we set up at")} <strong style={{ color: '#0f1729', fontWeight: 600 }}>Hall #1, Booth #A-30</strong> {t("and spent the show doing what we like most — talking to businesses. Teams from real estate, manufacturing, trading and services stopped by to see how the right systems reshape day-to-day operations, and we walked through their challenges one conversation at a time.")}</p>
              <div className="facts" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px', marginTop: '26px' }}>
                {FACTS.map((f) => (
                  <div key={f[1]} className="evFact" style={{ background: 'var(--tint)', border: '1px solid #eef1f6', borderRadius: '14px', padding: '16px 18px' }}>
                    <div className="evIcoWrap" style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e8effc', color: '#1a56db', display: 'grid', placeItems: 'center' }}><Icon name={f[0]} /></div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f1729', marginTop: '12px', lineHeight: 1.25 }}>{t(f[1])}</div>
                    <div style={{ fontSize: '12.5px', color: '#5b6472', marginTop: '3px' }}>{t(f[2])}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* thumbnails */}
          <Reveal className="thumbs" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginTop: '20px' }}>
            {gallery.map((g, i) => (
              <div key={g[0]} className={`evVisual evGThumb${i === gi ? ' active' : ''}`} onClick={() => setGi(i)} style={{ background: '#0f1729', boxShadow: '0 20px 44px -30px rgba(15,23,41,.4)' }}>
                <div className="evShot" style={{ position: 'absolute', inset: 0, backgroundImage: `url('${gsrc(i)}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(15,23,41,.5),transparent 55%)' }} />
                <span style={{ position: 'absolute', left: '14px', bottom: '12px', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#fff', textTransform: 'uppercase' }}>{t(g[2])}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Lightbox */}
      <div className={`lbox${lbOpen ? ' open' : ''}`} aria-hidden={!lbOpen} onClick={(e) => { if (e.target === e.currentTarget) setLbOpen(false); }}>
        <div className="lboxInner" onClick={(e) => { if (e.target === e.currentTarget) setLbOpen(false); }}>
          <button className="lboxClose" aria-label="Close" onClick={() => setLbOpen(false)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg></button>
          <button className="lboxNav lboxPrev" aria-label="Previous" onClick={() => go(-1)}>‹</button>
          <img className="lboxImg" src={gsrc(gi)} alt="Event photo" />
          <button className="lboxNav lboxNext" aria-label="Next" onClick={() => go(1)}>›</button>
          <div className="lboxCap"><b>{t(gallery[gi][2])}</b> — {t(gallery[gi][3])}</div>
        </div>
      </div>
    </>
  );
}
