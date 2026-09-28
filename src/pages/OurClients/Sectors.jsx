import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import { Icon, SECTORS, SECTOR_AREAS } from './clientsData';

/* the six convergence connectors (shared d for the static + animated pair) */
const LINES = [
  ['M600,-12 C400,0 200,40 200,120', '3s', '0s'],
  ['M600,-12 L600,120', '3.3s', '.4s'],
  ['M600,-12 C800,0 1000,40 1000,120', '3.1s', '.8s'],
  ['M600,-12 C320,0 200,220 200,400', '3.6s', '.2s'],
  ['M600,-12 C600,180 600,320 600,400', '3.4s', '.6s'],
  ['M600,-12 C880,0 1000,220 1000,400', '3.2s', '1s'],
];

/* Industry convergence — hovering a sector lights its connector + scales the
   hub node (was the mouseenter/leave DOM style writes). Driven by hover state. */
export default function Sectors() {
  const { t } = useLanguage();
  const [hov, setHov] = useState(null);

  return (
    <DataReveal style={{ position: 'relative', marginTop: '34px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 3 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', background: '#1a56db', color: '#fff', fontWeight: 800, fontSize: '14px', letterSpacing: '.3px', padding: '11px 22px', borderRadius: '999px', whiteSpace: 'nowrap', boxShadow: '0 18px 36px -14px rgba(26,86,219,.6)', animation: 'nodePulse 2.6s ease-in-out infinite', transition: 'transform .3s cubic-bezier(.2,.7,.3,1)', ...(hov != null ? { transform: 'scale(1.05)' } : null) }}>Align Business Systems</div>
      </div>
      <svg className="converge-svg" viewBox="0 0 1200 560" fill="none" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: '52px', width: '100%', height: 'calc(100% - 52px)', overflow: 'visible', zIndex: 0, pointerEvents: 'none' }}>
        {LINES.map((l, i) => <path key={`g${i}`} d={l[0]} stroke="#d0ddf5" strokeWidth="1.5" fill="none" />)}
        {LINES.map((l, i) => (
          <path key={`b${i}`} data-line={i} d={l[0]} stroke={hov === i ? '#1a56db' : '#4b8bff'} strokeWidth={hov === i ? 4 : 2.4} fill="none" strokeLinecap="round" strokeDasharray="20 900" style={{ animation: `flowLine ${l[1]} linear ${l[2]} infinite` }} />
        ))}
        <circle cx="600" cy="-12" r="7" fill="#1a56db" />
      </svg>
      <div className="sector-grid">
        {SECTORS.map((s, i) => (
          <DataReveal
            key={s[0]} className="clGrp"
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            style={{ background: '#fff', border: '1px solid #eaeef5', borderRadius: '20px', padding: '26px', boxShadow: '0 16px 42px -30px rgba(15,23,41,.24)' }}
          >
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,219,.1),transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            <div className="clBar" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg,#1a56db,#4b8bff)', zIndex: 2 }} />
            <div className="secBody" style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="clIco" style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e8effc', color: '#1a56db', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={s[1]} /></span>
                <span style={{ flex: 1, fontSize: '16.5px', fontWeight: 700, lineHeight: 1.2, color: '#0f1729' }}>{t(s[0])}</span>
              </div>
              <ul className="secAreas">
                {SECTOR_AREAS[i].map(([cap, ico], k) => (
                  <li key={cap} className="secTile" style={{ '--k': k }}>
                    <span className="secTileIco"><Icon name={ico} size={20} /></span>
                    <span className="secTileCap">{t(cap)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </DataReveal>
        ))}
      </div>
    </DataReveal>
  );
}
