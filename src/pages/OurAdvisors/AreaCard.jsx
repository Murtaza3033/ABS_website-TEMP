import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import { Icon } from './advisorsData';

/* Area-of-guidance card with 3D tilt-toward-cursor (was the runtime's mousemove
   transform). Tilt is local state; the card also reveals on scroll via
   [data-reveal] + `.in`. */
export default function AreaCard({ a, i }) {
  const { t } = useLanguage();
  const [tilt, setTilt] = useState('');
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt(`perspective(900px) rotateX(${-py * 7}deg) rotateY(${px * 9}deg) translateY(-6px)`);
  };
  return (
    <DataReveal
      className="adCard"
      onMouseMove={onMove} onMouseLeave={() => setTilt('')}
      style={{ position: 'relative', background: '#fff', border: '1px solid #eaeef5', borderRadius: '20px', padding: '28px', boxShadow: '0 16px 42px -30px rgba(15,23,41,.24)', transitionDelay: `${(i % 3) * 70}ms`, ...(tilt ? { transform: tilt } : null) }}
    >
      <span className="adIdx">{`0${i + 1}`}</span>
      <div className="adIco" style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg,#1a56db,#4b8bff)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 14px 26px -10px rgba(26,86,219,.55)' }}><Icon name={a[2]} /></div>
      <div style={{ fontSize: '17.5px', fontWeight: 700, marginTop: '18px', lineHeight: 1.25 }}>{t(a[0])}</div>
      <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#5b6472', margin: '9px 0 0' }}>{t(a[1])}</p>
    </DataReveal>
  );
}
