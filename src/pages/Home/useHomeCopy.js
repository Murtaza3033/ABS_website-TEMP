import { useLanguage } from '../../context/LanguageContext';
import { useHomePage } from '../../hooks/useCms';
import { locT } from '../../lib/loc';
import { HOME } from './homeContent';

/* Copy for the Home sections below the hero: the "Home page" CMS singleton,
   falling back to the built-in HOME copy (homeContent.js) field by field —
   while the query is pending, when it fails, or when a field is empty — so
   the page renders the same with or without the CMS. Arabic: the CMS's
   Arabic value, else the dictionary translation of the English. */
export function useHomeCopy() {
  const { t, lang } = useLanguage();
  const query = useHomePage();
  const cms = query.data;

  // One bilingual field (CMS object/string), else the English fallback translated.
  const txt = (field, fallback) => locT(field, lang, t) || (fallback ? t(fallback) : '');

  // A top-level text field of the singleton.
  const tx = (key) => txt(cms?.[key], HOME[key]);

  /* A list field. `cols` names the built-in tuple columns (and the CMS row
     fields); `slots` fixes the length for lists drawn on a fixed diagram
     (missing CMS rows fall back to the built-in row in that slot). Otherwise
     the CMS list replaces the built-in one when it has any rows. Each field
     falls back to the built-in value at the same position. Rows keep the raw
     CMS row as `_row`. `cols` null = a list of plain bilingual strings. */
  const rows = (key, cols, slots) => {
    const built = HOME[key] || [];
    const src = Array.isArray(cms?.[key]) && cms[key].length ? cms[key] : [];
    const n = slots || (src.length || built.length);
    return Array.from({ length: n }, (_, i) => {
      const row = src[i];
      const base = built[i];
      if (!cols) return txt(row, base);
      const out = { _row: row || null };
      cols.forEach((c, j) => { out[c] = txt(row?.[c], Array.isArray(base) ? base[j] : undefined); });
      return out;
    }).filter((r) => (cols ? cols.some((c) => r[c]) : r));
  };

  return { t, lang, cms, query, txt, tx, rows };
}
