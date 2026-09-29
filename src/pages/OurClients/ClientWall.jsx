import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import { useClients } from '../../hooks/useCms';
import { getSanityImageUrl } from '../../lib/sanity';
import { cmsWaiting } from '../../lib/cmsImage';
import { locT } from '../../lib/loc';
import { FALLBACK_CLIENTS, FALLBACK_FILTERS, DURS, DELS } from './clientsData';

/* Logo → name-wordmark fallback via state (was the runtime's onerror swap).
   Tries the real Sanity image asset first, then the static public path, then
   the text wordmark — advancing one step each time the current src 404s.
   `waiting`: the CMS list hasn't answered yet — render an empty tile of the
   same height instead of loading the static logo only to swap it. */
function ClientLogo({ name, logo, file, waiting }) {
  const sanitySrc = getSanityImageUrl(logo, { width: 240 });
  // Tiles render ~228px wide: 240w for 1x screens, 480w for 2x (was a single
  // 400w file, upscaled on retina and oversized on standard screens).
  const sanitySrc2x = getSanityImageUrl(logo, { width: 480 });
  const pathSrc = file ? `/assets/images/clients/${file}.webp` : null;
  const sources = [sanitySrc, pathSrc].filter(Boolean);
  const [srcIndex, setSrcIndex] = useState(0);
  if (waiting && !sanitySrc) return <span className="clLogo" aria-hidden="true" style={{ display: 'block', width: '100%', height: '82px' }} />;
  const wordmark = { fontSize: '22px', fontWeight: 800, letterSpacing: '-.5px', color: '#0f1729', textAlign: 'center' };
  if (srcIndex >= sources.length) return <span style={wordmark}>{name}</span>;
  return <img className="clLogo" src={sources[srcIndex]} srcSet={srcIndex === 0 && sanitySrc && sanitySrc2x ? `${sanitySrc} 1x, ${sanitySrc2x} 2x` : undefined} loading="lazy" decoding="async" alt={name} onError={() => setSrcIndex((i) => i + 1)} style={{ width: '100%', height: '82px', objectFit: 'contain' }} />;
}

/* Adapter: Sanity `client` doc (or a FALLBACK_CLIENTS entry, same shape) ->
   the { name, file } pair ClientLogo / the wall markup already expect.
   `file` stays a bare stem (no path/extension) so ClientLogo is untouched. */
function normalizeClient(doc) {
  const file = doc.logoPath
    ? doc.logoPath.replace(/^.*\//, '').replace(/\.[a-z0-9]+$/i, '')
    : null;
  return { name: doc.name, file, logo: doc.logo, industry: doc.industry?._id || null };
}

/* Client wall + industry-highlight filter. Filter is state (an Industry
   document id, null = all); each card gets .match / .ghost from the active
   filter vs the client's own Industry reference (was classList toggles).
   `cms`: the "Our Clients page" document (button labels, hint). */
export default function ClientWall({ cms }) {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState(null);
  const filterDocs = cms?.filters?.filter((f) => f?.industry?._id).length ? cms.filters.filter((f) => f?.industry?._id) : FALLBACK_FILTERS;
  const buttons = [
    { id: null, label: locT(cms?.filterAll, lang, t) || t('All Clients') },
    ...filterDocs.map((f) => ({ id: f.industry._id, label: locT(f.label, lang, t) || locT(f.industry.short, lang, t) || locT(f.industry.name, lang, t) })),
  ];

  // CMS clients first; static CLIENTS as placeholder (no loading gap) and as
  // the fallback if the CMS call errors or comes back empty.
  const clientsQuery = useClients({ fallbackData: FALLBACK_CLIENTS });
  const cmsClients = clientsQuery.data;
  const waiting = cmsWaiting(clientsQuery);
  const clients = (cmsClients && cmsClients.length > 0 ? cmsClients : FALLBACK_CLIENTS).map(normalizeClient);

  return (
    <>
      <DataReveal className="filtbar">
        {buttons.map((b) => (
          <button key={b.id || 'all'} className={`filt${filter === b.id ? ' on' : ''}`} onClick={() => setFilter(b.id)}>
            <span className="fdot" />{b.label}
          </button>
        ))}
      </DataReveal>

      <div className="wall">
        {clients.map(({ name, file, logo, industry }, i) => {
          const state = filter === null ? '' : (industry === filter ? ' match' : ' ghost');
          return (
            <DataReveal
              key={name} className={`clCard${state}`}
              style={{ background: '#fff', border: '1px solid #eef2f8', borderRadius: '20px', boxShadow: '0 16px 40px -28px rgba(15,23,41,.28)', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '26px', animation: `floatY ${DURS[i % DURS.length]} ease-in-out ${DELS[i % DELS.length]} infinite` }}
            >
              <ClientLogo name={name} file={file} logo={logo} waiting={waiting} />
              <div className="clCap">{name}</div>
            </DataReveal>
          );
        })}
      </div>

      <DataReveal as="p" style={{ textAlign: 'center', fontSize: '11.5px', color: '#657085', margin: '30px 0 0' }}>{locT(cms?.wallHint, lang, t) || t('Filter by industry, or hover a logo to bring it to life')}</DataReveal>
    </>
  );
}
