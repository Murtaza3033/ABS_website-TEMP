/* Lazy Arabic dictionary + Arabic webfont + the pure translator.
   The dictionary (lib/translations.js) is fetched the first time Arabic is
   needed, so English first paint never waits on it.

   It is imported by URL (`?url` makes Vite emit it as its own hashed file)
   rather than as a bundled `import('./translations')` chunk because browsers
   cache a FAILED dynamic import per URL for the life of the page: after one
   network blip, retrying the same import() rejects instantly without a new
   request. Owning the URL lets a retry add a cache-busting query, which is a
   new module-map entry and therefore a real re-fetch. */
import dictUrl from './translations.js?url';

let AR = null;
let pending = null;
let attempts = 0;

/* Cairo is only needed while Arabic is active, so English visitors never pay
   for it. index.html's inline boot script adds the same <link id> before
   first paint for returning Arabic visitors; this covers the toggle path.
   Keep the URL in sync with index.html. */
export const CAIRO_HREF = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap';
export function ensureArabicFont() {
  if (typeof document === 'undefined' || document.getElementById('font-cairo')) return;
  const link = document.createElement('link');
  link.id = 'font-cairo';
  link.rel = 'stylesheet';
  link.href = CAIRO_HREF;
  document.head.appendChild(link);
}

export function loadArabic() {
  if (AR) return Promise.resolve(AR);
  ensureArabicFont();
  if (!pending) {
    const url = attempts++ === 0
      ? dictUrl
      : `${dictUrl}${dictUrl.includes('?') ? '&' : '?'}retry=${Date.now()}`;
    pending = import(/* @vite-ignore */ url)
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
