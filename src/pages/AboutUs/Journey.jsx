import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MILES } from './aboutData';

/* Our Journey — scroll-driven line fill + milestone activation (was journey()
   in the runtime). A scroll listener updates a progress state that drives the
   line width and each milestone's active styling; no DOM mutation. */
export default function Journey() {
  const { t } = useLanguage();
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
      <div className="journey-row" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '20px' }}>
        {MILES.map((m, i) => {
          const on = prog >= i / (MILES.length - 0.6);
          return (
            <div key={m[1]} style={{ opacity: on ? 1 : 0.32, transform: on ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity .4s ease,transform .4s ease', textAlign: 'center' }}>
              <div className="abMile" style={{ width: '76px', height: '76px', margin: '0 auto', borderRadius: '50%', padding: '3px', background: m[2], boxShadow: '0 14px 28px -12px rgba(15,23,41,.4)', transition: 'transform .3s ease', transform: on ? 'scale(1.08)' : 'scale(.9)' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#fff', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(/assets/images/about/${m[3]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                </div>
              </div>
              <div style={{ fontSize: '11px', letterSpacing: '1px', color: '#8a94a6', marginTop: '16px', textTransform: 'uppercase', fontWeight: 700 }}>{t(m[0])}</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f1729', marginTop: '6px', lineHeight: 1.3 }}>{t(m[1])}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
