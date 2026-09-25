import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getSanityImageUrl } from '../../lib/sanity';
import CountUp from '../../components/CountUp';
import { DESC } from './teamData';

const fcardBase = {
  pointerEvents: 'auto', position: 'absolute', background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,.12)', borderRadius: '16px', boxShadow: '0 30px 60px -30px rgba(0,0,0,.6)',
};

function Bars({ arr }) {
  return arr.map((h, i) => (
    <div key={i} className="mBar" style={{ flex: 1, '--h': h, background: 'linear-gradient(#4b8bff,#1a56db)', borderRadius: '2px 2px 0 0' }} />
  ));
}

function NameWords({ full }) {
  const parts = full.split(' ');
  return parts.map((t, i) => (
    <span key={i} style={{ display: 'inline-block', marginRight: '12px', color: i === parts.length - 1 ? '#4b8bff' : '#fff' }}>{t}</span>
  ));
}

export default function LeaderScene({ L, i, even, revealed, refCb }) {
  const { t } = useLanguage();
  const [glow, setGlow] = useState({ x: 0, y: 0, on: false });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setGlow({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  };

  const portraitSrc = getSanityImageUrl(L.sanityPhoto, { width: 600 }) || `/assets/images/team/${L.photo}.webp`;

  const c1pos = even ? { top: '3%', right: '2%' } : { top: '3%', left: '2%' };
  const c2pos = even ? { bottom: '5%', right: '2%' } : { bottom: '5%', left: '2%' };
  const c3pos = even ? { top: '33%', left: '2%' } : { top: '33%', right: '2%' };

  return (
    <section
      ref={refCb} id={`leader-${i}`} className={`tsec tScene${revealed ? ' tin' : ''}`}
      onMouseMove={onMove} onMouseLeave={() => setGlow((g) => ({ ...g, on: false }))}
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '90px 32px', position: 'relative', overflow: 'hidden' }}
    >
      <div className="tGlow" style={{ left: `${glow.x}px`, top: `${glow.y}px`, opacity: glow.on ? 1 : 0 }} />
      <div className="sceneGrid" style={{ position: 'relative', zIndex: 1, maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', width: '100%' }}>
        {/* portrait column (grid child 0 — CSS view() parallax) */}
        <div data-parallax="portrait" style={{ order: even ? 1 : 2, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', minHeight: '440px' }}>
          <div style={{ position: 'absolute', bottom: '6%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,219,.4),transparent 68%)', filter: 'blur(6px)' }} />
          <div style={{ position: 'relative', animation: 'tmPortraitFloat 8s ease-in-out infinite' }}>
            <div className="tPortrait" style={{ backgroundImage: `url(${portraitSrc})` }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '26%', background: 'linear-gradient(to top,#0f1729,transparent)' }} />
          </div>
          <span style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '64px', fontWeight: 800, color: 'rgba(75,139,255,.16)', letterSpacing: '-2px' }}>{L.num}</span>
        </div>

        {/* content column */}
        <div style={{ order: even ? 2 : 1, position: 'relative' }}>
          <div className="anim" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: '#7aa7ff', textTransform: 'uppercase' }}>{t(L.role)}</div>
          <h2 className="anim" style={{ fontSize: 'clamp(30px,4.5vw,44px)', lineHeight: 1.06, letterSpacing: '-1.2px', fontWeight: 800, margin: '12px 0 0', color: '#fff' }}><NameWords full={t(L.name)} /></h2>
          <p className="anim" style={{ fontSize: '16px', lineHeight: 1.7, color: '#b7c2d6', margin: '18px 0 0', maxWidth: '440px' }}>{t(L.caption)}</p>
          <blockquote className="mQuote" style={{ margin: '20px 0 0', paddingLeft: '16px', borderLeft: '3px solid rgba(75,139,255,.55)', fontFamily: 'var(--font-hand)', fontSize: '23px', lineHeight: 1.4, color: '#8fb8ff', maxWidth: '440px' }}>“{t(L.quote)}”</blockquote>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', marginTop: '22px' }}>
            {L.tags.map((tg) => (
              <span key={tg} className="tagPop anim" style={{ fontSize: '12.5px', fontWeight: 600, color: '#cfe0ff', background: 'rgba(26,86,219,.16)', border: '1px solid rgba(75,139,255,.3)', borderRadius: '999px', padding: '7px 14px' }}>
                {t(tg)}<span className="tagCard">{t(DESC[tg] || 'A core strength on the team.')}</span>
              </span>
            ))}
          </div>
        </div>

        {/* floating cards (CSS view() parallax via .cardWrap) */}
        <div className="cardWrap" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div className="fcard" style={{ ...fcardBase, ...c1pos, width: '210px', padding: '16px', animation: 'tmFloat1 7s ease-in-out infinite' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'linear-gradient(135deg,#1a56db,#4b8bff)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: '11px' }}>A</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{t(L.c1[0])}</span>
            </div>
            <div style={{ fontSize: '10px', color: '#7d8db3', textTransform: 'uppercase', letterSpacing: '.5px', marginTop: '12px' }}>{t(L.c1[1])}</div>
            <CountUp end={L.c1[2]} style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginTop: '3px', display: 'block' }} />
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '34px', marginTop: '10px' }}><Bars arr={L.c1[3]} /></div>
          </div>

          <div className="fcard" style={{ ...fcardBase, ...c2pos, width: '196px', padding: '16px', animation: 'tmFloat2 8.4s ease-in-out .6s infinite' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#fff' }}>{t(L.c2[0])}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '9px', fontWeight: 800, color: '#4bd07f' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4bd07f', animation: 'tmDotPulse 1.8s ease-in-out infinite' }} />{t(L.c2[1])}</span>
            </div>
            <div style={{ fontSize: '10px', color: '#7d8db3', textTransform: 'uppercase', letterSpacing: '.5px', marginTop: '12px' }}>{t(L.c2[2])}</div>
            <CountUp end={L.c2[3]} style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginTop: '3px', display: 'block' }} />
            <div style={{ height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,.1)', marginTop: '10px', overflow: 'hidden' }}><div className="mBar" style={{ '--h': '100%', width: '100%', height: '100%', background: 'linear-gradient(90deg,#1a56db,#4b8bff)' }} /></div>
          </div>

          <div className="fcard" style={{ ...fcardBase, ...c3pos, width: '180px', padding: '15px', animation: 'tmFloat3 7.6s ease-in-out 1s infinite' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>{t(L.c3[0])}</div>
            <svg viewBox="0 0 120 40" style={{ width: '100%', height: '38px', marginTop: '8px', overflow: 'visible' }}><path className="mLine" d="M2,34 L24,24 L46,28 L68,14 L90,18 L118,4" fill="none" stroke="#4b8bff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{ fontSize: '10px', color: '#4bd07f', fontWeight: 700, marginTop: '4px' }}>{t(L.c3[1])}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
