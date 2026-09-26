import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Reveal from '../../components/Reveal';
import { PRODMETA } from '../Products/productsData';

/* "What We Build" product preview carousel — index state + 5s autoplay that
   pauses for 9s after any interaction (was pb/pbPaused/pbResume in the runtime). */
export default function ProductCarousel() {
  const { t } = useLanguage();
  const [pb, setPb] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeRef = useRef(null);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setPb((p) => (p + 1) % PRODMETA.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => () => clearTimeout(resumeRef.current), []);

  const pause = () => {
    setPaused(true);
    clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setPaused(false), 9000);
  };
  const goto = (i) => { setPb(((i % PRODMETA.length) + PRODMETA.length) % PRODMETA.length); pause(); };

  const m = PRODMETA[pb];

  return (
    <>
      <Reveal data-reveal="" baseClass="" shownClass="in" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '32px', flexWrap: 'wrap' }}>
        {PRODMETA.map((x, i) => (
          <button key={x.name} onClick={() => goto(i)}
            style={{ cursor: 'pointer', fontSize: '14px', fontWeight: 600, padding: '10px 20px', borderRadius: '999px', border: `1.5px solid ${i === pb ? x.accent : '#e3e9f3'}`, background: i === pb ? x.accent : '#fff', color: i === pb ? '#fff' : '#5b6472', whiteSpace: 'nowrap', transition: 'all .3s ease' }}>
            {t(x.name)}
          </button>
        ))}
      </Reveal>

      <Reveal data-reveal="" baseClass="" shownClass="in" style={{ position: 'relative', maxWidth: '940px', margin: '36px auto 0' }}>
        <button className="carousel-arrow" onClick={() => goto(pb - 1)} aria-label={t("Previous product")} style={{ position: 'absolute', left: '-20px', top: '46%', transform: 'translateY(-50%)', zIndex: 8, width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #e3e9f3', background: '#fff', color: '#1a56db', fontSize: '19px', cursor: 'pointer', boxShadow: '0 14px 32px -14px rgba(15,23,41,.35)' }}>←</button>
        <button className="carousel-arrow" onClick={() => goto(pb + 1)} aria-label={t("Next product")} style={{ position: 'absolute', right: '-20px', top: '46%', transform: 'translateY(-50%)', zIndex: 8, width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #e3e9f3', background: '#fff', color: '#1a56db', fontSize: '19px', cursor: 'pointer', boxShadow: '0 14px 32px -14px rgba(15,23,41,.35)' }}>→</button>

        <div style={{ background: '#0f1729', borderRadius: '24px', padding: '14px', boxShadow: '0 46px 100px -48px rgba(15,23,41,.72)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '2px 8px 12px' }}>
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f57' }} />
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#febc2e' }} />
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28c840' }} />
            <div style={{ flex: 1, marginLeft: '10px', background: 'rgba(255,255,255,.1)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', color: '#9fb3d4' }}>{m.url}</div>
          </div>
          <div style={{ overflow: 'hidden', borderRadius: '12px' }}>
            <div style={{ display: 'flex', transition: 'transform .6s cubic-bezier(.4,0,.2,1)', transform: `translateX(-${pb * 100}%)` }}>
              {PRODMETA.map((x) => (
                <div key={x.name} style={{ flex: '0 0 100%' }}>
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '62%', background: '#eef2f8', overflow: 'hidden' }}>
                    <img src={`/assets/images/about/${x.img}.webp`} loading="lazy" decoding="async" alt={`${x.name} ${t('dashboard')}`} onError={(e) => { e.currentTarget.style.opacity = 0; }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* floating top card */}
        <div className="mobile-hide-float" style={{ position: 'absolute', top: '74px', right: '26px', zIndex: 9, width: '34%', maxWidth: '322px', background: '#fff', border: '1px solid #eaeef5', borderRadius: '16px', padding: '15px 17px', boxShadow: '0 30px 66px -26px rgba(15,23,41,.6)', animation: 'abFloat2 5.6s ease-in-out infinite' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: m.tint, color: m.accent, display: 'grid', placeItems: 'center', flexShrink: 0 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg></div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f1729', lineHeight: 1.15 }}>{t(m.topTitle)}</div>
              <div style={{ fontSize: '10.5px', color: '#657085', marginTop: '2px' }}>{t(m.topSub)}</div>
            </div>
            <span style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: m.accent, animation: 'abDot 1.6s ease-in-out infinite', flexShrink: 0 }} />
          </div>
        </div>

        {/* floating bottom card */}
        <div className="mobile-hide-float" style={{ position: 'absolute', bottom: '80px', left: '26px', zIndex: 9, width: '34%', maxWidth: '322px', background: '#fff', border: '1px solid #eaeef5', borderRadius: '16px', padding: '15px 17px', boxShadow: '0 30px 66px -26px rgba(15,23,41,.6)', animation: 'abFloat 6.2s ease-in-out infinite' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '9.5px', letterSpacing: '.5px', color: '#657085', textTransform: 'uppercase' }}>{t(m.botLabel)}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '9.5px', fontWeight: 700, color: '#157d44' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1a9d55', animation: 'abDot 1.6s ease-in-out infinite' }} />{t('LIVE')}</span>
          </div>
          <div style={{ fontSize: '23px', fontWeight: 800, color: '#0f1729', marginTop: '6px', letterSpacing: '-.5px' }}>{m.botValue}</div>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: m.accent, marginTop: '3px' }}>{t(m.botDelta)}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          {PRODMETA.map((x, i) => (
            <button key={x.name} className="dot-tap" onClick={() => goto(i)} aria-label={x.name}
              style={{ cursor: 'pointer', border: 'none', padding: 0, width: i === pb ? '26px' : '8px', height: '8px', borderRadius: '999px', background: i === pb ? x.accent : '#d5deed', transition: 'all .35s ease' }} />
          ))}
        </div>
      </Reveal>
    </>
  );
}
