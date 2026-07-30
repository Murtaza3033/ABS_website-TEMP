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
