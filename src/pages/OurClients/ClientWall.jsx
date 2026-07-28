import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BaseReveal from '../../components/Reveal';
import { CLIENTS, SHORT, INDOF, DURS, DELS } from './clientsData';

/* Logo → name-wordmark fallback via state (was the runtime's onerror swap). */
function ClientLogo({ name, file }) {
  const [broken, setBroken] = useState(false);
  const wordmark = { fontSize: '22px', fontWeight: 800, letterSpacing: '-.5px', color: '#0f1729', textAlign: 'center' };
  if (!file || broken) return <span style={wordmark}>{name}</span>;
  return <img className="clLogo" src={`/assets/images/clients/${file}.png`} alt={name} onError={() => setBroken(true)} style={{ width: '100%', height: '82px', objectFit: 'contain' }} />;
}

/* Client wall + industry-highlight filter. Filter is state; each card gets
   .match / .ghost from the active filter vs its industry (was classList toggles). */
export default function ClientWall() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState(-1); // -1 = all
  const labels = ['All Clients', ...SHORT];

  return (
    <>
      <BaseReveal className="filtbar" data-reveal="" baseClass="" shownClass="in">
        {labels.map((l, i) => (
          <button key={l} className={`filt${filter === i - 1 ? ' on' : ''}`} onClick={() => setFilter(i - 1)}>
            <span className="fdot" />{t(l)}
          </button>
        ))}
      </BaseReveal>

      <div className="wall">
        {CLIENTS.map((c, i) => {
          const [name, file] = c;
          const ind = name in INDOF ? INDOF[name] : -1;
          const state = filter < 0 ? '' : (ind === filter ? ' match' : ' ghost');
          return (
            <BaseReveal
              key={name} data-reveal="" baseClass="" shownClass="in" className={`clCard${state}`} data-ind={ind}
              style={{ background: '#fff', border: '1px solid #eef2f8', borderRadius: '20px', boxShadow: '0 16px 40px -28px rgba(15,23,41,.28)', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '26px', animation: `floatY ${DURS[i % DURS.length]} ease-in-out ${DELS[i % DELS.length]} infinite` }}
            >
              <ClientLogo name={name} file={file} />
              <div className="clCap">{name}</div>
            </BaseReveal>
          );
        })}
      </div>

      <BaseReveal as="p" data-reveal="" baseClass="" shownClass="in" style={{ textAlign: 'center', fontSize: '11.5px', color: '#aeb8c8', margin: '30px 0 0' }}>{t("Filter by industry, or hover a logo to bring it to life")}</BaseReveal>
    </>
  );
}
