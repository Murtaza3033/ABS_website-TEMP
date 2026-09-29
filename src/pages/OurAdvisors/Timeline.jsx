import { useRef, useState, useEffect } from 'react';
import { DataReveal } from '../../components/Reveal';
import { Icon } from './advisorsData';

/* Background timeline — scroll-draw line fill + node activation (was
   timelineDraw() in the runtime). Fill height is written to a ref's style
   (continuous scroll value); node activation is state (discrete).
   `items`: [{ year, title, text, icon, color }], already localized. */
export default function Timeline({ items, compact }) {
  const wrapRef = useRef(null);
  const fillRef = useRef(null);
  const nodeRefs = useRef([]);
  const [active, setActive] = useState(() => items.map(() => false));
  const count = items.length;

  useEffect(() => {
    const onScroll = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const span = r.height - 12;
      const prog = Math.max(0, Math.min(1, (window.innerHeight * 0.58 - r.top) / (r.height * 0.8)));
      if (fillRef.current) fillRef.current.style.height = `${prog * span}px`;
      const next = nodeRefs.current.slice(0, count).map((n) => {
        if (!n) return false;
        const nr = n.getBoundingClientRect();
        return nr.top < window.innerHeight * 0.7 && nr.bottom > 60;
      });
      setActive((prev) => (next.length !== prev.length || next.some((v, i) => v !== prev[i]) ? next : prev));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [count]);

  return (
    <div ref={wrapRef} style={{ position: 'relative', marginTop: compact ? '24px' : '52px', paddingLeft: '12px' }}>
      <div style={{ position: 'absolute', left: '22px', top: '6px', bottom: '6px', width: '2px', background: '#e4eaf3' }} />
      <div ref={fillRef} style={{ position: 'absolute', left: '22px', top: '6px', width: '2px', height: 0, background: 'linear-gradient(#1a56db,#4b8bff)', boxShadow: '0 0 9px rgba(26,86,219,.55)' }} />
      <div>
        {items.map((tl, i) => {
          const on = active[i];
          const ring = tl.color;
          return (
            <DataReveal key={i} className="tlItem" style={{ position: 'relative', display: 'flex', gap: '26px', alignItems: 'flex-start', padding: '0 0 30px 0' }}>
              <div
                ref={(el) => { nodeRefs.current[i] = el; }}
                className="tlNode"
                style={{ position: 'relative', zIndex: 1, width: '44px', height: '44px', flexShrink: 0, borderRadius: '50%', background: '#fff', border: `2px solid ${on ? ring : '#d9e2f0'}`, display: 'grid', placeItems: 'center', color: on ? ring : '#b3bccb', transform: on ? 'scale(1.08)' : 'scale(1)', boxShadow: on ? `0 12px 26px -8px ${ring}66` : '0 10px 22px -10px rgba(15,23,41,.3)' }}
              >
                <Icon name={tl.icon} />
              </div>
              <div style={{ flex: 1, background: 'var(--tint)', border: '1px solid #eaeef5', borderRadius: '16px', padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: '#1a56db', background: '#eef4ff', borderRadius: '999px', padding: '4px 11px' }}>{tl.year}</span>
                  <span style={{ fontSize: '17px', fontWeight: 700, color: '#0f1729' }}>{tl.title}</span>
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#5b6472', margin: '9px 0 0' }}>{tl.text}</p>
              </div>
            </DataReveal>
          );
        })}
      </div>
    </div>
  );
}
