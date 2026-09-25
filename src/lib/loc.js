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
