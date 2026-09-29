import { Fragment, useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import { cssUrl } from '../../lib/cmsImage';
import { Icon } from './eventsData';

/* Featured-event gallery: main stage + thumbnails + lightbox. Current image is
   state (gi); the lightbox open/close, prev/next, keyboard nav and body-scroll
   lock are all state-driven (was the imperative setStage/openLb/closeLb).
   `ev` is a page-ready event (eventsData.toEvent); `labels` the page texts
   around it (eventsPage singleton). Re-keyed by the parent per event. */
export default function Gallery({ ev, labels, sectionRef }) {
  const { t } = useLanguage();
  const gallery = ev.gallery;
  const n = Math.max(1, gallery.length);
  const shot = (i) => gallery[i] || { src: undefined, label: '', caption: '', alt: '' };

  const [gi, setGi] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);
  const lboxRef = useRef(null);
  const closeRef = useRef(null);

  const go = (d) => setGi((g) => (g + d + n) % n);

  /* Lightbox = modal dialog: focus moves to its close button on open, Tab is
     trapped inside, Esc closes, and focus returns to whatever opened it. */
  useEffect(() => {
    if (!lbOpen) return undefined;
    const opener = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setLbOpen(false);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab' && lboxRef.current) {
        const f = [...lboxRef.current.querySelectorAll('button')];
        if (!f.length) return;
        const first = f[0]; const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (!lboxRef.current.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      if (opener && typeof opener.focus === 'function' && document.contains(opener)) opener.focus();
    };
  }, [lbOpen]);

  const onThumbKey = (i) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setGi(i); }
  };

  return (
    <>
      <section ref={sectionRef} className="sec" style={{ background: '#fff', padding: '40px 32px 90px', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <DataReveal style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '26px' }}>
            <span className="eyebrow">{labels.eyebrow}</span>
            <span style={{ flex: 1, height: '1px', background: '#e4eaf3' }} />
            {ev.dateText && <span style={{ fontSize: '12px', color: '#657085', fontWeight: 600 }}>{ev.dateText}</span>}
          </DataReveal>

          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: '1.08fr .92fr', gap: '44px', alignItems: 'stretch' }}>
            {/* stage */}
            <DataReveal onClick={() => setLbOpen(true)} style={{ position: 'relative', borderRadius: '26px', overflow: 'hidden', minHeight: '460px', background: '#0f1729', boxShadow: '0 40px 90px -44px rgba(15,23,41,.55)', cursor: 'zoom-in' }}>
              <div key={gi} style={{ position: 'absolute', inset: 0, backgroundImage: cssUrl(shot(gi).src), backgroundSize: 'cover', backgroundPosition: 'center', animation: 'evFade .4s ease, kenBurns 14s ease-in-out infinite alternate' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg,rgba(15,23,41,.35),rgba(26,86,219,.34))', pointerEvents: 'none' }} />
              <button className="evStageBtn" aria-label={t("View full size")} onClick={(e) => { e.stopPropagation(); setLbOpen(true); }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg></button>
              {shot(gi).label && <span style={{ position: 'absolute', left: '20px', top: '18px', fontSize: '10.5px', fontWeight: 700, letterSpacing: '1.5px', color: '#fff', background: 'rgba(15,23,41,.5)', borderRadius: '999px', padding: '6px 13px', textTransform: 'uppercase', zIndex: 2 }}>{shot(gi).label}</span>}
              <div style={{ position: 'absolute', left: '22px', bottom: '22px', background: '#fff', borderRadius: '16px', padding: '16px 18px', boxShadow: '0 26px 52px -22px rgba(15,23,41,.6)', animation: 'floatY 6.5s ease-in-out infinite', maxWidth: '230px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1a9d55', animation: 'evDot 1.8s ease-in-out infinite' }} /><span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#657085', textTransform: 'uppercase' }}>{ev.upcoming ? labels.upcoming : labels.past}</span></div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f1729', marginTop: '8px', lineHeight: 1.2 }}>{ev.title}</div>
                {ev.venue && <div style={{ fontSize: '12.5px', color: '#5b6472', marginTop: '3px' }}>{ev.venue}</div>}
              </div>
              {ev.booth && <div style={{ position: 'absolute', right: '22px', top: '64px', background: '#0f1729', color: '#fff', borderRadius: '14px', padding: '12px 15px', boxShadow: '0 24px 48px -20px rgba(15,23,41,.65)', animation: 'floatY2 5.6s ease-in-out infinite' }}>
                <div style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '1px', color: '#8fb8ff', textTransform: 'uppercase' }}>{labels.booth}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '4px' }}>{ev.booth}</div>
              </div>}
            </DataReveal>

            {/* details */}
            <DataReveal style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {ev.location && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: '#1a56db', background: '#eef4ff', borderRadius: '999px', padding: '6px 13px', textTransform: 'uppercase' }}>{ev.location}</div>}
              <h2 className="h2" style={{ fontSize: '34px', margin: '16px 0 0' }}>{ev.title}</h2>
              {ev.paragraphs.map((runs, pi) => (
                <p key={pi} style={{ fontSize: '15.5px', lineHeight: 1.75, color: '#4b5565', margin: '16px 0 0' }}>
                  {runs.map((r, ri) => (r.bold ? <strong key={ri} style={{ color: '#0f1729', fontWeight: 600 }}>{r.text}</strong> : <Fragment key={ri}>{r.text}</Fragment>))}
                </p>
              ))}
              {ev.facts.length > 0 && <div className="facts" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px', marginTop: '26px' }}>
                {ev.facts.map((f) => (
                  <div key={f.title} className="evFact" style={{ background: 'var(--tint)', border: '1px solid #eef1f6', borderRadius: '14px', padding: '16px 18px' }}>
                    <div className="evIcoWrap" style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e8effc', color: '#1a56db', display: 'grid', placeItems: 'center' }}><Icon name={f.icon} /></div>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f1729', marginTop: '12px', lineHeight: 1.25 }}>{f.title}</div>
                    {f.subtitle && <div style={{ fontSize: '12.5px', color: '#5b6472', marginTop: '3px' }}>{f.subtitle}</div>}
                  </div>
                ))}
              </div>}
            </DataReveal>
          </div>

          {/* thumbnails */}
          {gallery.length > 1 && <DataReveal className="thumbs" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginTop: '20px' }}>
            {gallery.map((g, i) => (
              <div key={g.key} className={`evVisual evGThumb${i === gi ? ' active' : ''}`} role="button" tabIndex={0} aria-pressed={i === gi} aria-label={`${g.label || ev.title} — ${t('Show photo')} ${i + 1}`} onClick={() => setGi(i)} onKeyDown={onThumbKey(i)} style={{ background: '#0f1729', boxShadow: '0 20px 44px -30px rgba(15,23,41,.4)' }}>
                <div className="evShot" style={{ position: 'absolute', inset: 0, backgroundImage: cssUrl(g.src), backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(15,23,41,.5),transparent 55%)' }} />
                <span style={{ position: 'absolute', left: '14px', bottom: '12px', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#fff', textTransform: 'uppercase' }}>{g.label}</span>
              </div>
            ))}
          </DataReveal>}
        </div>
      </section>

      {/* Lightbox */}
      <div ref={lboxRef} className={`lbox${lbOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label={t('Event photo')} aria-hidden={!lbOpen} onClick={(e) => { if (e.target === e.currentTarget) setLbOpen(false); }}>
        <div className="lboxInner" onClick={(e) => { if (e.target === e.currentTarget) setLbOpen(false); }}>
          <button ref={closeRef} className="lboxClose" aria-label={t('Close')} onClick={() => setLbOpen(false)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg></button>
          <button className="lboxNav lboxPrev" aria-label={t("Previous")} onClick={() => go(-1)}>‹</button>
          {shot(gi).src && <img className="lboxImg" src={shot(gi).src} alt={shot(gi).alt || t("Event photo")} />}
          <button className="lboxNav lboxNext" aria-label={t("Next")} onClick={() => go(1)}>›</button>
          {(shot(gi).label || shot(gi).caption) && <div className="lboxCap">{shot(gi).label && <b>{shot(gi).label}</b>}{shot(gi).label && shot(gi).caption ? ' — ' : ''}{shot(gi).caption}</div>}
        </div>
      </div>
    </>
  );
}
