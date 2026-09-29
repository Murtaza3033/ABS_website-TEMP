import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import { useJobs } from '../../hooks/useCms';
import { loc, locT, blockLines, blocksToText } from '../../lib/loc';
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

/* Sanity stores the employment type as a list value ("full-time"); the chip
   shows its label ("Full-time"). */
const EMPLOYMENT = { 'full-time': 'Full-time', 'part-time': 'Part-time', contract: 'Contract', internship: 'Internship' };

/* Adapter: a Sanity job doc (or FALLBACK_JOBS entry) -> the ROLES shape this
   component already renders, plus how to apply: the job's Apply URL, else an
   email to its Apply email, else the careers email (Site Settings). Empty
   fields fall back to the built-in role at the same position (Sanity was
   seeded in the same order as ROLES). */
function mergeRole(doc, i, lang, email) {
  const base = ROLES[i] || ROLES[0];
  const type = doc.employmentType ? EMPLOYMENT[doc.employmentType] || doc.employmentType : base.type;
  const title = loc(doc.title, lang) || base.title;
  const titleEn = loc(doc.title, 'en') || base.title;
  const applyTo = doc.applyEmail || email;
  return {
    ...base,
    title,
    type,
    dept: doc.department || base.dept,
    loc: loc(doc.location, lang) || base.loc,
    desc: resolveDescription(doc, lang, base),
    reqs: resolveRequirements(doc, lang, base),
    applyHref: doc.applyUrl || `mailto:${applyTo}?subject=${encodeURIComponent(`Application: ${titleEn}`)}`,
    applyExternal: Boolean(doc.applyUrl),
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
   (was the classList open/hide toggles in the runtime).
   `page`: the Careers page singleton (labels / empty state), `email`: the
   careers address used when a job has no Apply email/URL. */
export default function RolesAccordion({ page, email }) {
  const { t, lang } = useLanguage();
  const tx = (k, fallback) => locT(page?.[k], lang, t) || t(fallback);
  const roles = useRoleDocs().map((doc, i) => mergeRole(doc, i, lang, email));
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
          <div className="r-title" style={{ marginTop: '16px' }}>{tx('emptyTitle', "No open roles right now")}</div>
          <p className="r-desc" style={{ fontSize: '14.5px', lineHeight: 1.7, margin: '8px auto 0', maxWidth: '460px' }}>{tx('emptyText', "We're not actively hiring for a specific position at the moment — but we're always happy to hear from great people.")}</p>
          <SmartLink href="/contact-us.html" className="r-apply">{tx('emptyButton', "Get in touch →")}</SmartLink>
        </DataReveal>
      </>
    );
  }

  return (
    <>
      <DataReveal className="jfiltbar" style={{ marginTop: '36px' }}>
        {cats.map(([d, n]) => (
          <button key={d} className={`jfilt${filter === d ? ' on' : ''}`} onClick={() => setFilter(d)}>{t(d)} <span className="n">{n}</span></button>
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
                  <div className="r-label">{tx('rolesRequirementsLabel', "What we're looking for")}</div>
                  <ul style={{ margin: '10px 0 0', paddingLeft: '18px' }}>
                    {r.reqs.map((q) => <li key={q} className="r-req" style={{ fontSize: '13.5px', lineHeight: 1.7 }}>{t(q)}</li>)}
                  </ul>
                  <a className="r-apply" href={r.applyHref} {...(r.applyExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{tx('rolesApply', "Apply for this role →")}</a>
                </div>
              </div>
            </DataReveal>
          );
        })}
      </div>

      <DataReveal as="p" style={{ textAlign: 'center', fontSize: '12px', color: '#9aa4b6', margin: '28px 0 0' }}>{tx('rolesFootnote', "Don't see your role listed? We're always open to a conversation — email us anyway.")}</DataReveal>
    </>
  );
}
