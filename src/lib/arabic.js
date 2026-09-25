/* Lazy Arabic dictionary + the pure translator.
   The dictionary (lib/translations.js) is fetched as a separate chunk the
   first time Arabic is needed, so English first paint never waits on it. */
let AR = null;
let pending = null;

export function loadArabic() {
  if (AR) return Promise.resolve(AR);
  if (!pending) {
    pending = import('./translations')
      .then((m) => { AR = m.AR; return AR; })
      .catch((err) => { pending = null; throw err; });
  }
  return pending;
}

export function arabicReady() {
  return AR !== null;
}

/* Arabic when active + in dict, else the English source unchanged.
   Flips directional arrow glyphs for RTL, matching the old DOM-swap behaviour. */
export function tr(text, lang) {
  if (lang !== 'ar' || !AR) return text;
  let out = AR[text] !== undefined ? AR[text] : text;
  if (/[→←›‹]/.test(out)) {
    out = out.replace(/[→←]/g, (c) => (c === '→' ? '←' : '→'))
             .replace(/[›‹]/g, (c) => (c === '›' ? '‹' : '›'));
  }
  return out;
}
