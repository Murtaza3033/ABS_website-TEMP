import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import { useClients } from '../../hooks/useCms';
import { getSanityImageUrl } from '../../lib/sanity';
import { CLIENTS, SHORT, INDOF, DURS, DELS } from './clientsData';

/* Logo → name-wordmark fallback via state (was the runtime's onerror swap).
   Tries the real Sanity image asset first, then the static public path, then
   the text wordmark — advancing one step each time the current src 404s. */
function ClientLogo({ name, logo, file }) {
  const sanitySrc = getSanityImageUrl(logo, { width: 400 });
  const pathSrc = file ? `/assets/images/clients/${file}.webp` : null;
  const sources = [sanitySrc, pathSrc].filter(Boolean);
  const [srcIndex, setSrcIndex] = useState(0);
  const wordmark = { fontSize: '22px', fontWeight: 800, letterSpacing: '-.5px', color: '#0f1729', textAlign: 'center' };
  if (srcIndex >= sources.length) return <span style={wordmark}>{name}</span>;
  return <img className="clLogo" src={sources[srcIndex]} loading="lazy" decoding="async" alt={name} onError={() => setSrcIndex((i) => i + 1)} style={{ width: '100%', height: '82px', objectFit: 'contain' }} />;
}

/* Static CLIENTS reshaped to look like a Sanity `client` document list, so it
   can serve as both React Query's placeholderData (shown instantly, no
   loading gap) and the safe fallback if the CMS is unreachable or empty. */
const FALLBACK_CLIENTS = CLIENTS.map(([name, file], i) => ({
  _id: `fallback-${i}`,
  name,
  logoPath: file ? `/assets/images/clients/${file}.webp` : undefined,
  order: i + 1,
}));

/* Adapter: Sanity `client` doc (or a FALLBACK_CLIENTS entry, same shape) ->
   the { name, file } pair ClientLogo / the wall markup already expect.
   `file` stays a bare stem (no path/extension) so ClientLogo is untouched. */
function normalizeClient(doc) {
  const file = doc.logoPath
    ? doc.logoPath.replace(/^.*\//, '').replace(/\.[a-z0-9]+$/i, '')
    : null;
  return { name: doc.name, file, logo: doc.logo };
}

/* Client wall + industry-highlight filter. Filter is state; each card gets
   .match / .ghost from the active filter vs its industry (was classList toggles). */
export default function ClientWall() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState(-1); // -1 = all
  const labels = ['All Clients', ...SHORT];

  // CMS clients first; static CLIENTS as placeholder (no loading gap) and as
  // the fallback if the CMS call errors or comes back empty.
  const { data: cmsClients } = useClients({ fallbackData: FALLBACK_CLIENTS });
  const clients = (cmsClients && cmsClients.length > 0 ? cmsClients : FALLBACK_CLIENTS).map(normalizeClient);

  return (
    <>
      <DataReveal className="filtbar">
        {labels.map((l, i) => (
          <button key={l} className={`filt${filter === i - 1 ? ' on' : ''}`} onClick={() => setFilter(i - 1)}>
            <span className="fdot" />{t(l)}
          </button>
        ))}
      </DataReveal>

      <div className="wall">
        {clients.map(({ name, file, logo }, i) => {
          const ind = name in INDOF ? INDOF[name] : -1;
          const state = filter < 0 ? '' : (ind === filter ? ' match' : ' ghost');
          return (
            <DataReveal
              key={name} className={`clCard${state}`}
              style={{ background: '#fff', border: '1px solid #eef2f8', borderRadius: '20px', boxShadow: '0 16px 40px -28px rgba(15,23,41,.28)', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '26px', animation: `floatY ${DURS[i % DURS.length]} ease-in-out ${DELS[i % DELS.length]} infinite` }}
            >
              <ClientLogo name={name} file={file} logo={logo} />
              <div className="clCap">{name}</div>
            </DataReveal>
          );
        })}
      </div>

      <DataReveal as="p" style={{ textAlign: 'center', fontSize: '11.5px', color: '#aeb8c8', margin: '30px 0 0' }}>{t("Filter by industry, or hover a logo to bring it to life")}</DataReveal>
    </>
  );
}
