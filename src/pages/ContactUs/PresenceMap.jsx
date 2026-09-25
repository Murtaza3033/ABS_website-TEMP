import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Reveal from '../../components/Reveal';
import { PINS } from './contactData';

/* Presence map — zoom/pan + hover pins. State-driven (zoom/origin/active pin);
   the wheel-zoom needs preventDefault, so it's a non-passive listener attached
   via ref in a cleaned-up useEffect (a genuinely imperative concern). */
export default function PresenceMap() {
  const { t } = useLanguage();
  const vpRef = useRef(null);
  const [map, setMap] = useState({ zoom: 1, ox: 50, oy: 50 });
  const [active, setActive] = useState(null); // hovered/selected pin or null

  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const r = vp.getBoundingClientRect();
      setMap((m) => ({
        ox: Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)),
        oy: Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)),
        zoom: Math.min(3.2, Math.max(1, m.zoom + (e.deltaY < 0 ? 0.25 : -0.25))),
      }));
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, []);

  const zoomIn = () => setMap((m) => ({ ...m, zoom: Math.min(3.2, m.zoom + 0.4) }));
  const zoomOut = () => setMap((m) => {
    const zoom = Math.max(1, m.zoom - 0.4);
    return zoom <= 1 ? { zoom, ox: 50, oy: 50 } : { ...m, zoom };
  });
  const resetView = () => { setMap({ zoom: 1, ox: 50, oy: 50 }); setActive(null); };
  const focusPin = (p) => { setMap({ zoom: 2.4, ox: p.x, oy: p.y }); setActive(p); };

  const btn = {
    width: '38px', height: '38px', borderRadius: '10px', border: '1px solid #e3e9f3',
    background: '#fff', color: 'var(--blue)', fontSize: '20px', cursor: 'pointer',
    boxShadow: '0 8px 20px -12px rgba(15,23,41,.4)',
  };

  return (
    <Reveal style={{ position: 'relative', marginTop: '36px', border: '1px solid #e3e9f3', borderRadius: '22px', background: '#fbfdff', overflow: 'hidden', boxShadow: '0 30px 70px -40px rgba(15,23,41,.28)' }}>
      <div ref={vpRef} style={{ position: 'relative', aspectRatio: '1672 / 941', maxHeight: '560px', overflow: 'hidden', background: '#fbfdff' }}>
        <div style={{ position: 'absolute', inset: 0, transformOrigin: `${map.ox}% ${map.oy}%`, transform: `scale(${map.zoom})`, transition: 'transform .3s cubic-bezier(.2,.7,.3,1)', touchAction: 'none' }}>
          <img
            src="/assets/images/contact/worldmap-labeled.webp"
            alt="Align global presence map"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }}
          />
          {PINS.map((p) => (
            <div
              key={p.city}
              onMouseEnter={() => setActive(p)}
              onMouseLeave={() => setActive((cur) => (cur === p ? null : cur))}
              onClick={() => focusPin(p)}
              style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: `${p.hit}px`, height: `${p.hit}px`, transform: 'translate(-50%,-50%)', borderRadius: '50%', zIndex: 3, cursor: 'pointer' }}
            />
          ))}
        </div>

        {active && (
          <div className="presence-tooltip" style={{ position: 'absolute', left: '24px', bottom: '24px', zIndex: 6, background: '#fff', border: '1px solid #e3e9f3', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 26px 54px -20px rgba(15,23,41,.45)', maxWidth: '270px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--blue)', boxShadow: '0 0 0 4px rgba(26,86,219,.18)' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>{t(active.city)}</span>
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: 'var(--blue)', textTransform: 'uppercase', marginTop: '8px' }}>{t(active.tag)}</div>
            <div style={{ fontSize: '12.5px', lineHeight: 1.55, color: '#5b6472', marginTop: '6px' }}>{t(active.label)}</div>
          </div>
        )}

        <div style={{ position: 'absolute', right: '18px', top: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={zoomIn} aria-label="Zoom in" style={btn}>+</button>
          <button onClick={zoomOut} aria-label="Zoom out" style={btn}>−</button>
          <button onClick={resetView} aria-label="Reset view" title="Reset view" style={{ ...btn, display: 'grid', placeItems: 'center', fontSize: '17px' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.4 2.6L3 8" /><path d="M3 4v4h4" /></svg>
          </button>
        </div>
      </div>
    </Reveal>
  );
}
