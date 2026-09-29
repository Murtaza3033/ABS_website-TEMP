import { useRef, useState, useEffect } from 'react';

/* Our Journey — scroll-driven line fill + milestone activation (was journey()
   in the runtime). A scroll listener updates a progress state that drives the
   line width and each milestone's active styling; no DOM mutation.
   `miles` are ready to render: [{ year, title, text, color, src }]. */
export default function Journey({ miles }) {
  const ref = useRef(null);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const j = ref.current;
      if (!j) return;
      const r = j.getBoundingClientRect();
      const vh = window.innerHeight;
      setProg(Math.max(0, Math.min(1, (vh * 0.72 - r.top) / (r.height + vh * 0.34))));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', marginTop: '72px' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: '34px', height: '3px', background: '#eef1f6', borderRadius: '2px' }} />
      <div style={{ position: 'absolute', left: 0, top: '34px', height: '3px', width: `${prog * 100}%`, background: 'linear-gradient(90deg,#1a56db,#4b8bff)', borderRadius: '2px', transition: 'width .12s linear' }} />
      <div className="journey-row" style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${miles.length},1fr)`, gap: '20px' }}>
        {miles.map((m, i) => {
          const on = prog >= i / (miles.length - 0.6);
          return (
            <div key={i} style={{ transform: on ? 'translateY(0)' : 'translateY(10px)', transition: 'transform .4s ease', textAlign: 'center' }}>
              {/* Not-yet-reached milestones dim only their photo; the year and
                  title stay at full contrast (they were at 32% opacity ≈ 1.4:1). */}
              <div className="abMile" style={{ width: '76px', height: '76px', margin: '0 auto', borderRadius: '50%', padding: '3px', background: m.color, boxShadow: '0 14px 28px -12px rgba(15,23,41,.4)', transition: 'transform .3s ease,opacity .4s ease', transform: on ? 'scale(1.08)' : 'scale(.9)', opacity: on ? 1 : 0.32 }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#fff', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: m.src ? `url(${m.src})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                </div>
              </div>
              <div style={{ fontSize: '11px', letterSpacing: '1px', color: '#657085', marginTop: '16px', textTransform: 'uppercase', fontWeight: 700 }}>{m.year}</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f1729', marginTop: '6px', lineHeight: 1.3 }}>{m.title}</div>
              {m.text && <p style={{ fontSize: '12.5px', lineHeight: 1.5, color: '#5b6472', margin: '6px 0 0' }}>{m.text}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
