import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import CountUp from '../../components/CountUp';
import { useClients } from '../../hooks/useCms';
import { locT } from '../../lib/loc';
import { cmsPic } from '../../lib/cmsImage';
import { FALLBACK_CLIENTS, SECTORS, NUMBERS, Icon } from './clientsData';

/* "Trust, by the numbers." — three stat cards, each with a small decorative
   visual (aria-hidden; the number + label carry the meaning), a cursor-follow
   spotlight, and a slow logo marquee underneath. Pure CSS/SVG motion, keyed
   off the card's reveal `.in` class so it plays when scrolled into view; the
   base styles are the end state, so reduced motion shows everything static. */

const STACK_N = 4;
const RING_R = 42; // orbit radius (px) for the six industry icons
const PROG_C = 2 * Math.PI * 40; // progress-ring circumference

/* Spotlight position as percentages — independent of the desktop html zoom. */
function track(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
}

/* `logos`: [{ key, src, src2x }] — every client with a logo (CMS Client
   documents, else the built-in list); src is undefined while the CMS list is
   pending, so the chip / tile stays empty instead of loading a file twice. */
function LogoStack({ total, logos }) {
  const stack = logos.slice(0, STACK_N);
  const more = `+${Math.max(0, total - stack.length)}`; // 4 chips + "+46" = the 50+ headline
  const mid = stack.length / 2; // 5 chips incl. the "+N" one → offsets -2 … 2
  return (
    <div className="trStack">
      {stack.map((l, k) => (
        <span key={l.key} className="trChip" style={{ '--k': k, '--o': k - mid, zIndex: stack.length - k + 1 }}>
          {l.chip ? <img src={l.chip} alt="" loading="lazy" decoding="async" /> : null}
        </span>
      ))}
      <span className="trChip trMore" style={{ '--k': stack.length, '--o': mid, zIndex: 1 }}>{more}</span>
    </div>
  );
}

function IndustryRing() {
  return (
    <div className="trRing">
      <svg className="trOrbitLine" viewBox="0 0 112 112"><circle cx="56" cy="56" r={RING_R} /></svg>
      <span className="trHub" />
      {SECTORS.map((s, k) => {
        const a = (k / SECTORS.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <span key={s[0]} className="trOrb" style={{ '--k': k, left: `calc(50% + ${(Math.cos(a) * RING_R).toFixed(2)}px)`, top: `calc(50% + ${(Math.sin(a) * RING_R).toFixed(2)}px)` }}>
            <Icon name={s[1]} size={15} />
          </span>
        );
      })}
    </div>
  );
}

function ProgressRing() {
  return (
    <div className="trProgWrap">
      <svg viewBox="0 0 96 96" className="trProgSvg">
        <defs>
          <linearGradient id="trProgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4b8bff" />
            <stop offset="1" stopColor="#8fb6ff" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="48" r="40" className="trProgTrack" />
        <circle cx="48" cy="48" r="40" className="trProg" style={{ '--c': PROG_C }} strokeDasharray={PROG_C} />
        <circle cx="48" cy="48" r="40" className="trComet" strokeDasharray={`18 ${PROG_C}`} />
      </svg>
      <span className="trCheck">
        <svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      </span>
    </div>
  );
}

const VISUALS = [LogoStack, IndustryRing, ProgressRing];

/* Stats come from Sanity ("Our Clients page" → Stats) when set, else NUMBERS.
   Each card's visual stays tied to its position. Logos (stack + marquee):
   the Client documents that have a logo, in sort order. */
export default function TrackRecord({ cms, caption }) {
  const { t, lang } = useLanguage();
  const clientsQuery = useClients({ fallbackData: FALLBACK_CLIENTS });
  const pic = cmsPic(clientsQuery);
  const docs = clientsQuery.data?.length ? clientsQuery.data : FALLBACK_CLIENTS;
  const logos = docs.filter((d) => d.logo?.asset || d.logoPath).map((d) => ({
    key: d._id || d.name,
    // chip image box ~44px, marquee ~96px wide: 2x for retina
    chip: pic(d.logo, { width: 96 }, d.logoPath),
    src: pic(d.logo, { width: 192 }, d.logoPath),
  }));
  const stats = Array.isArray(cms) && cms.length
    ? cms.slice(0, VISUALS.length).map((s, i) => [
      Number.isFinite(s?.value) ? s.value : (NUMBERS[i]?.[0] ?? 0),
      s?.suffix ?? '',
      locT(s?.label, lang, t) || t(NUMBERS[i]?.[2] ?? ''),
    ])
    : NUMBERS.map(([v, suf, l]) => [v, suf, t(l)]);
  return (
    <>
      <div className="num-grid">
        {stats.map((n, i) => {
          const Visual = VISUALS[i];
          return (
            <DataReveal key={i} className="trCard" style={{ transitionDelay: `${i * 90}ms` }} onPointerMove={track}>
              <span className="trSpot" aria-hidden="true" />
              <div className="trVis" aria-hidden="true"><Visual total={n[0]} logos={logos} /></div>
              <div className="trNum"><CountUp end={n[0]} suffix={n[1]} duration={1500} /></div>
              <div className="trLbl">{n[2]}</div>
            </DataReveal>
          );
        })}
      </div>

      <DataReveal className="trMarqueeWrap" aria-hidden="true">
        <div className="trMarqueeCap">{caption || t('A few of the names behind the number')}</div>
        <div className="trMarquee">
          <div className="trTrack">
            {[...logos, ...logos].map((l, k) => (
              <span key={`${l.key}-${k}`} className="trLogo">
                {l.src ? <img src={l.src} alt="" loading="lazy" decoding="async" /> : null}
              </span>
            ))}
          </div>
        </div>
      </DataReveal>
    </>
  );
}
