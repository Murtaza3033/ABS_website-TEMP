import { useState } from 'react';
import { cssUrl } from '../../lib/cmsImage';
import { Icon } from './industriesData';

const MCHK = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;

/* A member client: its logo (CMS, or the built-in file), else its name.
   `logo` is undefined while the CMS answer is pending: an empty box of the
   same size, so the static file is never loaded only to be swapped. */
function Member({ m, probe }) {
  const [broken, setBroken] = useState(false);
  return (
    <div style={{ height: '52px', minWidth: '96px', padding: '0 16px', background: '#fff', border: '1px solid #eef2f8', borderRadius: '12px', boxShadow: '0 12px 28px -22px rgba(15,23,41,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {(probe || !m.logo) && m.hasLogo && !broken
        ? <span style={{ width: '82px', height: '34px' }} />
        : m.hasLogo && !broken
        ? <img src={m.logo} alt={m.name} loading="lazy" decoding="async" onError={() => setBroken(true)} style={{ width: '82px', height: '34px', objectFit: 'contain' }} />
        : <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f1729' }}>{m.name}</span>}
    </div>
  );
}

/* The active-industry showcase panel (image + copy). Re-keyed by the parent on
   industry change so the slide-in animations replay. */
/* `probe`: height-measuring copy (see Industries.jsx) — same layout, but no
   images are requested. `d` and `labels` are already localized. */
export default function IndustryPanel({ d, labels, parallaxRef, probe }) {
  return (
    <>
      <div style={{ position: 'relative', borderRadius: '26px', overflow: 'hidden', height: '460px', boxShadow: '0 40px 90px -44px rgba(15,23,41,.5)', background: '#0f1729', animation: 'slideInR .5s cubic-bezier(.2,.7,.3,1) both' }}>
        <div ref={parallaxRef} style={{ position: 'absolute', left: 0, right: 0, top: '-8%', height: '116%', willChange: 'transform' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: probe ? 'none' : cssUrl(d.imgUrl), backgroundSize: 'cover', backgroundPosition: 'center', animation: 'kenBurns 12s ease-in-out infinite alternate' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(150deg,rgba(15,23,41,.30),rgba(26,86,219,.30))' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.10, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <span style={{ position: 'absolute', left: '20px', top: '18px', fontSize: '10.5px', fontWeight: 700, letterSpacing: '1.5px', color: '#fff', background: 'rgba(15,23,41,.5)', borderRadius: '999px', padding: '6px 13px', textTransform: 'uppercase' }}>{d.name}</span>
        <div style={{ position: 'absolute', right: '22px', top: '20px', width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,.16)', display: 'grid', placeItems: 'center', color: '#fff' }}><Icon name={d.ico} /></div>
        <div style={{ position: 'absolute', left: '22px', bottom: '22px', background: '#fff', borderRadius: '16px', padding: '16px 18px', boxShadow: '0 26px 52px -22px rgba(15,23,41,.55)', animation: 'floatY 6.5s ease-in-out infinite', maxWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1a9d55', animation: 'iDot 1.8s ease-in-out infinite' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#657085', textTransform: 'uppercase' }}>Align × {d.short}</span>
          </div>
          <div style={{ fontSize: '17px', fontWeight: 700, color: '#0f1729', marginTop: '9px', lineHeight: 1.25 }}>{d.insight}</div>
        </div>
      </div>

      <div style={{ animation: 'slideInR .55s cubic-bezier(.2,.7,.3,1) both' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', color: '#1a56db', textTransform: 'uppercase' }}>{d.name}</div>
        <h2 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-.8px', margin: '10px 0 0', lineHeight: 1.14 }}>{d.head}</h2>
        <p style={{ fontSize: '15px', lineHeight: 1.72, color: '#4b5565', margin: '14px 0 0' }}>{d.para}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '18px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f1729', letterSpacing: '-.5px' }}>{d.members.length}</span>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#657085' }}>{d.members.length > 1 ? labels.many : labels.one}</span>
          </div>
          <span style={{ width: '1px', height: '28px', background: '#e4eaf3' }} />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.5px', color: '#657085', textTransform: 'uppercase' }}>{labels.focus}</div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1a56db', marginTop: '2px' }}>{d.focus}</div>
          </div>
        </div>
        <div style={{ marginTop: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: '#657085', textTransform: 'uppercase' }}>{labels.modules}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          {d.modules.map((x, i) => <span key={i} className="modChip">{MCHK}{x}</span>)}
        </div>
        <div style={{ marginTop: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: '#657085', textTransform: 'uppercase' }}>{labels.members}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
          {d.members.map((m) => <Member key={m.key} m={m} probe={probe} />)}
        </div>
      </div>
    </>
  );
}
