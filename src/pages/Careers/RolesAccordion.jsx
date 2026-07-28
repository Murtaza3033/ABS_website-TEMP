import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BaseReveal from '../../components/Reveal';
import { Icon, ROLES } from './careersData';

const DEPTS = [...new Set(ROLES.map((r) => r.dept))];
const CATS = [['All', ROLES.length], ...DEPTS.map((d) => [d, ROLES.filter((r) => r.dept === d).length])];

/* Open-roles accordion + department filter. Open state is a Set of indices;
   the filter is a dept string that toggles `.hide` on non-matching cards
   (was the classList open/hide toggles in the runtime). */
export default function RolesAccordion() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(() => new Set());

  const toggle = (i) => setOpen((prev) => {
    const n = new Set(prev);
    if (n.has(i)) n.delete(i); else n.add(i);
    return n;
  });

  return (
    <>
      <BaseReveal className="jfiltbar" data-reveal="" baseClass="" shownClass="in" style={{ marginTop: '36px' }}>
        {CATS.map(([d, n]) => (
          <button key={d} className={`jfilt${filter === d ? ' on' : ''}`} onClick={() => setFilter(d)}>{d} <span className="n">{n}</span></button>
        ))}
      </BaseReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {ROLES.map((r, i) => {
          const hidden = filter !== 'All' && r.dept !== filter;
          return (
            <BaseReveal key={r.title} data-reveal="" baseClass="" shownClass="in" className={`crRole${open.has(i) ? ' open' : ''}${hidden ? ' hide' : ''}`} data-dept={r.dept}>
              <div className="r-head" onClick={() => toggle(i)}>
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
              <div className="r-panel">
                <div className="r-body">
                  <p className="r-desc" style={{ fontSize: '14.5px', lineHeight: 1.7, margin: '0 0 14px' }}>{t(r.desc)}</p>
                  <div className="r-label">{t("What we're looking for")}</div>
                  <ul style={{ margin: '10px 0 0', paddingLeft: '18px' }}>
                    {r.reqs.map((q) => <li key={q} className="r-req" style={{ fontSize: '13.5px', lineHeight: 1.7 }}>{t(q)}</li>)}
                  </ul>
                  <a className="r-apply" href={`mailto:talent@alignbsystems.com?subject=${encodeURIComponent(`Application: ${r.title}`)}`}>{t("Apply for this role →")}</a>
                </div>
              </div>
            </BaseReveal>
          );
        })}
      </div>

      <BaseReveal as="p" data-reveal="" baseClass="" shownClass="in" style={{ textAlign: 'center', fontSize: '12px', color: '#9aa4b6', margin: '28px 0 0' }}>{t("Don't see your role listed? We're always open to a conversation — email us anyway.")}</BaseReveal>
    </>
  );
}
