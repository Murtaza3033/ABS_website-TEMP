import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import { Icon, TL } from './advisorsData';

/* Background timeline — scroll-draw line fill + node activation (was
   timelineDraw() in the runtime). Fill height is written to a ref's style
   (continuous scroll value); node activation is state (discrete). */
export default function Timeline() {
  const { t } = useLanguage();
  const wrapRef = useRef(null);
  const fillRef = useRef(null);
  const nodeRefs = useRef([]);
  const [active, setActive] = useState(() => TL.map(() => false));

  useEffect(() => {
    const onScroll = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const span = r.height - 12;
      const prog = Math.max(0, Math.min(1, (window.innerHeight * 0.58 - r.top) / (r.height * 0.8)));
      if (fillRef.current) fillRef.current.style.height = `${prog * span}px`;
      const next = nodeRefs.current.map((n) => {
        if (!n) return false;
        const nr = n.getBoundingClientRect();
        return nr.top < window.innerHeight * 0.7 && nr.bottom > 60;
      });
      setActive((prev) => (next.some((v, i) => v !== prev[i]) ? next : prev));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  return (
    <div ref={wrapRef} style={{ position: 'relative', marginTop: '52px', paddingLeft: '12px' }}>
      <div style={{ position: 'absolute', left: '22px', top: '6px', bottom: '6px', width: '2px', background: '#e4eaf3' }} />
      <div ref={fillRef} style={{ position: 'absolute', left: '22px', top: '6px', width: '2px', height: 0, background: 'linear-gradient(#1a56db,#4b8bff)', boxShadow: '0 0 9px rgba(26,86,219,.55)' }} />
      <div>
        {TL.map((tl, i) => {
          const on = active[i];
          const ring = tl[3];
          return (
            <DataReveal key={tl[1]} className="tlItem" style={{ position: 'relative', display: 'flex', gap: '26px', alignItems: 'flex-start', padding: '0 0 30px 0' }}>
              <div
                ref={(el) => { nodeRefs.current[i] = el; }}
                className="tlNode"
                style={{ position: 'relative', zIndex: 1, width: '44px', height: '44px', flexShrink: 0, borderRadius: '50%', background: '#fff', border: `2px solid ${on ? ring : '#d9e2f0'}`, display: 'grid', placeItems: 'center', color: on ? ring : '#b3bccb', transform: on ? 'scale(1.08)' : 'scale(1)', boxShadow: on ? `0 12px 26px -8px ${ring}66` : '0 10px 22px -10px rgba(15,23,41,.3)' }}
              >
                <Icon name={tl[4]} />
              </div>
              <div style={{ flex: 1, background: 'var(--tint)', border: '1px solid #eaeef5', borderRadius: '16px', padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: '#1a56db', background: '#eef4ff', borderRadius: '999px', padding: '4px 11px' }}>{t(tl[0])}</span>
                  <span style={{ fontSize: '17px', fontWeight: 700, color: '#0f1729' }}>{t(tl[1])}</span>
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#5b6472', margin: '9px 0 0' }}>{t(tl[2])}</p>
              </div>
            </DataReveal>
          );
        })}
      </div>
    </div>
  );
}
