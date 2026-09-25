import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import { useJobs } from '../../hooks/useCms';
import { loc, blockLines, blocksToText } from '../../lib/loc';
import { Icon, ROLES } from './careersData';

/* Static ROLES reshaped to look like a Sanity `job` document list — same
   purpose as the other pages' fallbacks: instant placeholderData and the
   safe fallback if the CMS is unreachable or empty. desc/reqs stay plain
   string/array here (matching ROLES) rather than Portable Text, since the
   resolvers below already handle both shapes. */
const FALLBACK_JOBS = ROLES.map((r, i) => ({
  _id: `fallback-${i}`,
  title: r.title,
  department: r.dept,
  location: r.loc,
  employmentType: r.type,
  description: r.desc,
  requirements: r.reqs,
  isActive: true,
  order: i + 1,
}));

function resolveDescription(doc, lang, base) {
  const value = doc.description;
  if (!value) return base.desc;
  if (typeof value === 'string') return value; // FALLBACK_JOBS shape
  return blocksToText(value, lang) || base.desc;
}

function resolveRequirements(doc, lang, base) {
  const value = doc.requirements;
  if (!value) return base.reqs;
  if (Array.isArray(value)) return value; // FALLBACK_JOBS shape (plain string array)
  const flat = blockLines(value, lang);
  return flat.length ? flat : base.reqs;
}

/* Adapter: a Sanity job doc (or FALLBACK_JOBS entry) -> the ROLES shape this
   component already renders. `type` (employment type) is left from the
   static base — Sanity stores it slugified ("full-time"), which doesn't
   match the display casing ("Full-time") the chip already shows, so
   overriding it would visibly change that text. Everything else maps
   cleanly by position (Sanity was seeded in the same order as ROLES). */
function mergeRole(doc, i, lang) {
  const base = ROLES[i] || ROLES[0];
  return {
    ...base,
    title: loc(doc.title, lang) || base.title,
    dept: doc.department || base.dept,
    loc: loc(doc.location, lang) || base.loc,
    desc: resolveDescription(doc, lang, base),
    reqs: resolveRequirements(doc, lang, base),
  };
}

/* Job docs to render: the CMS list whenever the request succeeded — even an
   empty one (then the empty state shows) — and the static FALLBACK_JOBS only
   while it's still loading (placeholder) or if it failed / returned no list. */
export function useRoleDocs() {
  const { data, isError } = useJobs({ fallbackData: FALLBACK_JOBS });
  return !isError && Array.isArray(data) ? data : FALLBACK_JOBS;
}

/* Open-roles accordion + department filter. Open state is a Set of indices;
   the filter is a dept string that toggles `.hide` on non-matching cards
   (was the classList open/hide toggles in the runtime). */
export default function RolesAccordion() {
  const { t, lang } = useLanguage();
  const roles = useRoleDocs().map((doc, i) => mergeRole(doc, i, lang));
  const depts = [...new Set(roles.map((r) => r.dept))];
  const cats = [['All', roles.length], ...depts.map((d) => [d, roles.filter((r) => r.dept === d).length])];

  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(() => new Set());

  const toggle = (i) => setOpen((prev) => {
    const n = new Set(prev);
    if (n.has(i)) n.delete(i); else n.add(i);
    return n;
  });

  if (roles.length === 0) {
    return (
      <>
        <DataReveal className="crRole crEmpty" style={{ marginTop: '36px', padding: '34px 28px', textAlign: 'center' }}>
          <div className="r-icon" style={{ margin: '0 auto' }}><Icon name="briefcase" /></div>
          <div className="r-title" style={{ marginTop: '16px' }}>{t("No open roles right now")}</div>
          <p className="r-desc" style={{ fontSize: '14.5px', lineHeight: 1.7, margin: '8px auto 0', maxWidth: '460px' }}>{t("We're not actively hiring for a specific position at the moment — but we're always happy to hear from great people.")}</p>
          <SmartLink href="/contact-us.html" className="r-apply">{t("Get in touch →")}</SmartLink>
        </DataReveal>
      </>
    );
  }

  return (
    <>
      <DataReveal className="jfiltbar" style={{ marginTop: '36px' }}>
        {cats.map(([d, n]) => (
          <button key={d} className={`jfilt${filter === d ? ' on' : ''}`} onClick={() => setFilter(d)}>{d} <span className="n">{n}</span></button>
        ))}
      </DataReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {roles.map((r, i) => {
          const hidden = filter !== 'All' && r.dept !== filter;
          return (
            <DataReveal key={r.title} className={`crRole${open.has(i) ? ' open' : ''}${hidden ? ' hide' : ''}`}>
              <div className="r-head" role="button" tabIndex={0} aria-expanded={open.has(i)} aria-controls={`role-panel-${i}`}
                onClick={() => toggle(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i); } }}>
                <div className="r-icon"><Icon name="briefcase" /></div>
                <div style={{ flex: 1 }}>
                  <div className="r-title">{t(r.title)}</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <span className="rchip"><Icon name="pin" size={12} sw={2} />{t(r.loc)}</span>
                    <span className="rchip"><Icon name="clock" size={12} sw={2} />{t(r.type)}</span>
                    <span className="rchip"><Icon name="code" size={12} sw={2} />{t(r.dept)}</span>
                  </div>
                </div>
                <span className="r-chev">⌄</span>
              </div>
              <div className="r-panel" id={`role-panel-${i}`} inert={!open.has(i)}>
                <div className="r-body">
                  <p className="r-desc" style={{ fontSize: '14.5px', lineHeight: 1.7, margin: '0 0 14px' }}>{t(r.desc)}</p>
                  <div className="r-label">{t("What we're looking for")}</div>
                  <ul style={{ margin: '10px 0 0', paddingLeft: '18px' }}>
                    {r.reqs.map((q) => <li key={q} className="r-req" style={{ fontSize: '13.5px', lineHeight: 1.7 }}>{t(q)}</li>)}
                  </ul>
                  <a className="r-apply" href={`mailto:talent@alignbsystems.com?subject=${encodeURIComponent(`Application: ${r.title}`)}`}>{t("Apply for this role →")}</a>
                </div>
              </div>
            </DataReveal>
          );
        })}
      </div>

      <DataReveal as="p" style={{ textAlign: 'center', fontSize: '12px', color: '#9aa4b6', margin: '28px 0 0' }}>{t("Don't see your role listed? We're always open to a conversation — email us anyway.")}</DataReveal>
    </>
  );
}
