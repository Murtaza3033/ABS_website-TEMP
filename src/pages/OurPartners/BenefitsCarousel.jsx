import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Icon, BENEFITS } from './partnersData';

const AUTO = 4200;
const N = BENEFITS.length;
const pad = (v) => `0${v}`.slice(-2);

/* Partnership benefits carousel — index state + rAF autoplay with a progress
   fill that pauses on hover / interaction (was the initBen() closure). Centering
   reads live card offsets via refs; drag / keyboard / dots / arrows all supported. */
export default function BenefitsCarousel() {
  const { t } = useLanguage();
  const [idx, setIdx] = useState(0);
  const stripRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const cardRefs = useRef([]);
  const pausedRef = useRef(false);
  const baseRef = useRef(0);
  const resumeRef = useRef(null);
  const dragRef = useRef({ on: false, sx: 0 });

  // center the active card + reset the autoplay clock (on idx change / resize)
  useLayoutEffect(() => {
    const center = () => {
      const strip = stripRef.current; const track = trackRef.current; const card = cardRefs.current[idx];
      if (!strip || !track || !card) return;
      const off = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
      strip.style.transform = `translateX(${-off}px)`;
    };
    center();
    baseRef.current = performance.now();
    if (fillRef.current) fillRef.current.style.width = '0%';
    window.addEventListener('resize', center);
    return () => window.removeEventListener('resize', center);
  }, [idx]);

  // autoplay loop + progress fill
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    baseRef.current = performance.now();
    const tick = (t) => {
      if (!pausedRef.current) {
        const e = (t - baseRef.current) / AUTO;
        if (e >= 1) { baseRef.current = t; setIdx((i) => (i + 1) % N); }
        else if (fillRef.current) fillRef.current.style.width = `${Math.min(e, 1) * 100}%`;
      } else if (fillRef.current) {
        fillRef.current.style.width = '0%';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => () => clearTimeout(resumeRef.current), []);

  const pauseTemp = () => {
    pausedRef.current = true;
    clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => { pausedRef.current = false; baseRef.current = performance.now(); }, 6000);
  };
  const go = (i) => { setIdx(((i % N) + N) % N); pauseTemp(); };

  // window pointerup for drag release
  useEffect(() => {
    const onUp = (e) => {
      if (!dragRef.current.on) return;
      dragRef.current.on = false;
      const dx = e.clientX - dragRef.current.sx;
      if (dx < -40) go((idx + 1));
      else if (dx > 40) go((idx - 1));
    };
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, [idx]);

  return (
    <div data-reveal style={{ position: 'relative', marginTop: '48px' }}>
      <div
        ref={trackRef} data-ben-track tabIndex={0} aria-label="Partnership benefits carousel"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { clearTimeout(resumeRef.current); pausedRef.current = false; baseRef.current = performance.now(); }}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') go(idx + 1); else if (e.key === 'ArrowLeft') go(idx - 1); }}
        onPointerDown={(e) => { dragRef.current = { on: true, sx: e.clientX }; pauseTemp(); }}
        style={{ overflow: 'hidden', outline: 'none', WebkitMaskImage: 'linear-gradient(90deg,transparent 0,#000 16%,#000 84%,transparent 100%)', maskImage: 'linear-gradient(90deg,transparent 0,#000 16%,#000 84%,transparent 100%)', cursor: 'grab' }}
      >
        <div ref={stripRef} style={{ display: 'flex', gap: '24px', transition: 'transform .7s cubic-bezier(.4,0,.2,1)', willChange: 'transform' }}>
          {BENEFITS.map((b, i) => (
            <div
              key={b[0]} ref={(el) => { cardRefs.current[i] = el; }} className="pBen"
              style={{ flex: '0 0 46%', position: 'relative', overflow: 'hidden', background: '#fff', border: '1px solid #eaeef5', borderRadius: '22px', padding: '34px', boxShadow: '0 22px 52px -32px rgba(15,23,41,.3)', opacity: i === idx ? 1 : 0.5, transform: i === idx ? 'scale(1)' : 'scale(.95)', transition: 'opacity .5s ease, transform .5s ease' }}
            >
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,219,.09),transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: '5px', background: 'linear-gradient(90deg,#1a56db,#4b8bff)', opacity: 0.9 }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="pIco" style={{ width: '54px', height: '54px', flexShrink: 0, borderRadius: '15px', background: 'linear-gradient(135deg,#1a56db,#4b8bff)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 14px 26px -10px rgba(26,86,219,.55)' }}><Icon name={b[3]} /></div>
                <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', color: '#c3d0e6' }}>{b[0]}</div>
              </div>
              <div style={{ position: 'relative', fontSize: '21px', fontWeight: 700, marginTop: '20px', lineHeight: 1.2 }}>{t(b[1])}</div>
              <p style={{ position: 'relative', fontSize: '14.5px', lineHeight: 1.7, color: '#5b6472', margin: '12px 0 0' }}>{t(b[2])}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="benprog"><i ref={fillRef} style={{ width: '0%' }} /></div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '22px' }}>
        <button className="navbtn" onClick={() => go(idx - 1)} aria-label="Previous" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #dbe4f3', background: '#fff', color: '#1a56db', fontSize: '18px', cursor: 'pointer', boxShadow: '0 12px 26px -14px rgba(15,23,41,.35)', transition: 'all .2s ease' }}>←</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          {BENEFITS.map((b, i) => (
            <button key={b[0]} onClick={() => go(i)} aria-label={`Go to card ${i + 1}`}
              style={{ border: 'none', padding: 0, height: '8px', borderRadius: '999px', cursor: 'pointer', transition: 'all .35s ease', width: i === idx ? '26px' : '8px', background: i === idx ? '#1a56db' : '#d5deed' }} />
          ))}
        </div>
        <span className="benCount"><b>{pad(idx + 1)}</b> / {pad(N)}</span>
        <button className="navbtn" onClick={() => go(idx + 1)} aria-label="Next" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #dbe4f3', background: '#fff', color: '#1a56db', fontSize: '18px', cursor: 'pointer', boxShadow: '0 12px 26px -14px rgba(15,23,41,.35)', transition: 'all .2s ease' }}>→</button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11px', fontWeight: 700, letterSpacing: '.5px', color: '#8a94a6', textTransform: 'uppercase' }}>{t("Hover to pause · drag or use ← → to explore")}</div>
    </div>
  );
}
