/* Reads a bilingual { en, ar } field (as produced by the Studio's localeString /
   localeText / localeBlock objects) for the given language, falling back to
   English when Arabic is missing, and to '' when the field itself is missing. */
export function loc(field, lang) {
  if (!field) return '';
  if (typeof field === 'string') return field;

  const value = lang === 'ar' ? field.ar : field.en;
  if (value) return value;

  return field.en || '';
}

/* Like loc(), but when Arabic is requested and the CMS field has no Arabic
   value, the English text is passed through the dictionary translator `t`
   (so seeded-English CMS copy still localizes). English output is unchanged. */
export function locT(field, lang, t) {
  if (!field) return '';
  if (typeof field === 'string') return lang === 'ar' && t ? t(field) : field;
  if (lang === 'ar' && field.ar) return field.ar;
  const en = field.en || '';
  return lang === 'ar' && t ? t(en) : en;
}

/* Plain-text lines (one per block) of a bilingual Portable Text field
   ({ en: [block...], ar: [block...] }), falling back to English. */
export function blockLines(value, lang) {
  const blocks = (lang === 'ar' ? value?.ar : value?.en) || value?.en || [];
  if (!Array.isArray(blocks)) return [];
  return blocks.map((b) => (b.children || []).map((c) => c.text || '').join(''));
}

/* The same field flattened to a single string. */
export function blocksToText(value, lang) {
  return blockLines(value, lang).join(' ').trim();
}

/* A multi-line (textarea) bilingual field as an array of lines, for short
   copy with manual line breaks. Same language rules as locT() — Arabic from
   the CMS, else each English line through the dictionary `t` — and when the
   field is empty, `fallback` (a string or an array of English lines) is
   translated line by line, so the built-in copy renders exactly as before. */
export function locLines(field, lang, t, fallback = []) {
  const pick = (s) => String(s).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const tr = (l) => (lang === 'ar' && t ? t(l) : l);
  if (field && typeof field === 'object') {
    if (lang === 'ar' && field.ar?.trim()) return pick(field.ar);
    if (field.en?.trim()) return pick(field.en).map(tr);
  } else if (typeof field === 'string' && field.trim()) {
    return pick(field).map(tr);
  }
  return (Array.isArray(fallback) ? fallback : [fallback]).filter(Boolean).map(tr);
}
