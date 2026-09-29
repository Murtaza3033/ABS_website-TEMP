import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import { Icon, NODE_DURS, NODE_DELS } from './industriesData';

const LINES = [
  ['M16.7,20 C16.7,38 50,40 50,50', '3s', '0s'],
  ['M50,18 L50,50', '3.3s', '.4s'],
  ['M83.3,20 C83.3,38 50,40 50,50', '3.1s', '.8s'],
  ['M16.7,80 C16.7,62 50,60 50,50', '3.5s', '.2s'],
  ['M50,82 L50,50', '3.2s', '.6s'],
  ['M83.3,80 C83.3,62 50,60 50,50', '3.4s', '1s'],
];

function ConvNode({ n, i, onJump, onHover }) {
  const { t } = useLanguage();
  return (
    <DataReveal
      className="convNode" title={`${t('Explore')} ${n.title}`}
      onMouseEnter={() => onHover(i)} onMouseLeave={() => onHover(null)} onClick={() => onJump(i)}
      style={{ background: '#fff', border: '1px solid #e9edf4', borderRadius: '18px', padding: '18px 20px', boxShadow: '0 20px 46px -26px rgba(15,23,41,.32)', cursor: 'pointer', animation: `floatY ${NODE_DURS[i % 6]} ease-in-out ${NODE_DELS[i % 6]} infinite` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="convIco" style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#eef4ff', color: '#1a56db', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={n.icon} /></span>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f1729', lineHeight: 1.15 }}>{n.title}</div>
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1a56db', marginTop: '2px' }}>{n.metric}</div>
        </div>
      </div>
      <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: '#5b6472', marginTop: '12px' }}>{n.text}</div>
    </DataReveal>
  );
}

/* Industry convergence — hovering a node lights its connector + scales the hub;
   clicking jumps to that industry (onJump) and scrolls to the showcase.
   `nodes` ({ title, metric, text, icon }) and `hub` are already localized. */
export default function Convergence({ nodes, hub, onJump }) {
  const [hov, setHov] = useState(null);
  return (
    <DataReveal style={{ position: 'relative', marginTop: '56px' }}>
      <svg className="conv-svg" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', zIndex: 0 }}>
        {LINES.map((l, i) => <path key={`g${i}`} d={l[0]} stroke="#d0ddf5" strokeWidth="0.3" fill="none" vectorEffect="non-scaling-stroke" />)}
        {LINES.map((l, i) => (
          <path key={`b${i}`} data-line={i} d={l[0]} stroke={hov === i ? '#1a56db' : '#4b8bff'} strokeWidth={hov === i ? 1.6 : 0.6} fill="none" strokeLinecap="round" strokeDasharray="6 120" vectorEffect="non-scaling-stroke" style={{ animation: `iFlow ${l[1]} linear ${l[2]} infinite` }} />
        ))}
      </svg>
      <div className="conv-grid">
        {nodes.slice(0, 3).map((n, i) => <ConvNode key={i} n={n} i={i} onJump={onJump} onHover={setHov} />)}
        <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', padding: '26px 0' }}>
          <div data-hub style={{ position: 'relative', background: 'linear-gradient(135deg,#1a56db,#123f9e)', color: '#fff', borderRadius: '22px', padding: '26px 40px', textAlign: 'center', overflow: 'hidden', minWidth: '300px', animation: 'nodePulse 2.8s ease-in-out infinite', transition: 'transform .3s cubic-bezier(.2,.7,.3,1)', ...(hov != null ? { transform: 'scale(1.03)' } : null) }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.14, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '26px 26px' }} />
            <div style={{ position: 'relative', fontSize: '22px', fontWeight: 800, letterSpacing: '.2px' }}>{hub.title}</div>
            <div style={{ position: 'relative', fontSize: '12.5px', color: '#cfdcff', marginTop: '6px' }}>{hub.text}</div>
            <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '7px', marginTop: '16px' }}>
              {hub.pills.map((p, i) => (
                <span key={i} style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '.5px', color: '#dbe6ff', background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.22)', borderRadius: '999px', padding: '5px 11px', textTransform: 'uppercase' }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
        {nodes.slice(3, 6).map((n, i) => <ConvNode key={i + 3} n={n} i={i + 3} onJump={onJump} onHover={setHov} />)}
      </div>
    </DataReveal>
  );
}
