import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Reveal from '../../components/Reveal';

/* Presence map — zoom/pan + hover pins. State-driven (zoom/origin/active pin).
   Wheel zoom only with Ctrl/⌘ held (also what trackpad pinch sends), so a
   plain wheel/trackpad scroll over the map keeps scrolling the page; the
   +/− buttons zoom too. Non-passive listener (needs preventDefault) attached
   via ref in a cleaned-up useEffect. */
const ANCHOR = { c: 'translate(-50%,-50%)', t: 'translate(-50%,0)', br: 'translate(-100%,-100%)', bl: 'translate(0,-100%)' };
// Effective map width (px x zoom) below which grouped pins are clustered.
const CLUSTER_BELOW = 500;
const groupPins = (pins) => pins.reduce((acc, p) => {
  if (p.group) (acc[p.group] = acc[p.group] || []).push(p);
  return acc;
}, {});
const centroid = (ps) => ({ x: ps.reduce((a, p) => a + p.x, 0) / ps.length, y: ps.reduce((a, p) => a + p.y, 0) / ps.length });
/* `pins`: [{ city, tag, label, x, y, hit, anchor, group }] with texts
   already localized (Contact page: CMS pins, else the built-in PINS).
   `src`: the map image URL, or undefined while the CMS is still answering
   (the box keeps its size; see lib/cmsImage.js). */
export default function PresenceMap({ pins, src, alt }) {
  const { t } = useLanguage();
  const GROUPS = groupPins(pins);
  const vpRef = useRef(null);
  const [map, setMap] = useState({ zoom: 1, ox: 50, oy: 50 });
  const [active, setActive] = useState(null); // hovered/selected pin or null
  const [vpW, setVpW] = useState(1180);

  useEffect(() => {
    const vp = vpRef.current;
    if (!vp || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => setVpW(e.contentRect.width));
    ro.observe(vp);
    return () => ro.disconnect();
  }, []);
  const clustered = vpW * map.zoom < CLUSTER_BELOW;
  // Very narrow maps: the Pakistan and Gulf clusters themselves collide, so
  // they merge into a single cluster.
  const groups = vpW * map.zoom < 420 ? { all: Object.values(GROUPS).flat() } : GROUPS;
  const zoomToGroup = (ps) => {
    const c = centroid(ps);
    setMap({ zoom: Math.min(3.2, Math.max(2.4, (CLUSTER_BELOW + 20) / vpW)), ox: c.x, oy: c.y });
    setActive(null);
  };

  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return undefined;
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
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
  const focusPin = (p) => { setMap({ zoom: Math.min(3.2, Math.max(2.4, (CLUSTER_BELOW + 20) / vpW)), ox: p.x, oy: p.y }); setActive(p); };

  const btn = {
    width: '38px', height: '38px', borderRadius: '10px', border: '1px solid #e3e9f3',
    background: '#fff', color: 'var(--blue)', fontSize: '20px', cursor: 'pointer',
    boxShadow: '0 8px 20px -12px rgba(15,23,41,.4)',
  };

  return (
    <Reveal style={{ position: 'relative', marginTop: '36px', border: '1px solid #e3e9f3', borderRadius: '22px', background: '#fbfdff', overflow: 'hidden', boxShadow: '0 30px 70px -40px rgba(15,23,41,.28)' }}>
      <div ref={vpRef} style={{ position: 'relative', aspectRatio: '1672 / 941', maxHeight: '560px', overflow: 'hidden', background: '#fbfdff' }}>
        <div style={{ position: 'absolute', inset: 0, transformOrigin: `${map.ox}% ${map.oy}%`, transform: `scale(${map.zoom})`, transition: 'transform .3s cubic-bezier(.2,.7,.3,1)', touchAction: 'none' }}>
          {src && <img
            src={src}
            alt={alt}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }}
          />}
          {/* Tap targets keep a constant on-screen size (hit / zoom inside the
              scaled layer) while the distances between cities grow with zoom. */}
          {clustered && Object.entries(groups).map(([g, ps]) => {
            const c = centroid(ps);
            return (
              <button
                type="button"
                key={g}
                className="presence-pin"
                aria-label={`${ps.map((p) => p.city).join(', ')} — ${t('Zoom in')}`}
                onClick={() => zoomToGroup(ps)}
                style={{ position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, width: `${36 / map.zoom}px`, height: `${36 / map.zoom}px`, transform: 'translate(-50%,-50%)', borderRadius: '50%', zIndex: 3, cursor: 'zoom-in' }}
              />
            );
          })}
          {pins.filter((p) => !(clustered && p.group)).map((p) => (
            <button
              type="button"
              key={p.city}
              className="presence-pin"
              aria-label={`${p.city} — ${p.tag}`}
              onMouseEnter={() => setActive(p)}
              onMouseLeave={() => setActive((cur) => (cur?.city === p.city ? null : cur))}
              onFocus={() => setActive(p)}
              onBlur={() => setActive((cur) => (cur?.city === p.city ? null : cur))}
              onClick={() => focusPin(p)}
              style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: `${p.hit / map.zoom}px`, height: `${p.hit / map.zoom}px`, transform: ANCHOR[p.anchor || 'c'], borderRadius: '50%', zIndex: 3, cursor: 'pointer' }}
            />
          ))}
        </div>

        {active && (
          <div className="presence-tooltip" style={{ position: 'absolute', left: '24px', bottom: '24px', zIndex: 6, background: '#fff', border: '1px solid #e3e9f3', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 26px 54px -20px rgba(15,23,41,.45)', maxWidth: '270px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--blue)', boxShadow: '0 0 0 4px rgba(26,86,219,.18)' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>{active.city}</span>
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: 'var(--blue)', textTransform: 'uppercase', marginTop: '8px' }}>{active.tag}</div>
            <div style={{ fontSize: '12.5px', lineHeight: 1.55, color: '#5b6472', marginTop: '6px' }}>{active.label}</div>
          </div>
        )}

      </div>
      {/* Outside the map viewport: absolutely placed over its top-right corner
          on wide screens, a toolbar row under the map on phones (contact-us.css)
          so the buttons never sit on a pin. */}
      <div className="presence-ctrls" style={{ position: 'absolute', right: '18px', top: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={zoomIn} aria-label={t("Zoom in")} style={btn}>+</button>
          <button onClick={zoomOut} aria-label={t("Zoom out")} style={btn}>−</button>
          <button onClick={resetView} aria-label={t("Reset view")} title={t("Reset view")} style={{ ...btn, display: 'grid', placeItems: 'center', fontSize: '17px' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.4 2.6L3 8" /><path d="M3 4v4h4" /></svg>
          </button>
        </div>
    </Reveal>
  );
}
