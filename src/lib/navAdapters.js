/* Adapters for the CMS `navigation` and `footer` singletons. Both schemas only
   model label/href (+ children for nav, + heading for footer columns) — the
   real Header/Footer markup also has icons, descriptions and "Spotlight"
   blocks with no CMS equivalent, so these build a flat `_key -> item` lookup
   that individual components merge onto their existing static shell, instead
   of a full data-driven re-render (same pattern as the OurTeam/Industries
   page adapters). */

import { loc } from './loc';

/* The `navigation`/`footer` docs were seeded (Phase 2) before the product
   pages existed (Phase 5) and before their links were pointed internal
   (Phase 5B), so they still carry the old external product URLs. Rather than
   re-seed CMS content in a frontend-only phase, normalize known-stale product
   URLs to the current internal routes wherever a CMS href is consumed. */
const STALE_PRODUCT_HREF_MAP = {
  'https://businessflo.co': '/products/businessflo',
  'https://peoplenest.co': '/products/peoplenest',
  'https://pharmafieldflo.co': '/products/pharmafieldflo',
};

/* CMS hrefs are editor-supplied, so only safe forms reach an <a href>:
   http(s), mailto:, tel:, root-relative "/path", "#hash", "?query" — anything
   else (javascript:, data:, vbscript:, protocol-relative "//host", …) is
   dropped in favour of the static fallback. */
export function safeHref(href) {
  if (typeof href !== 'string') return null;
  const h = href.trim();
  // Browsers ignore tabs/newlines/control chars inside a scheme
  // ("java\nscript:"), so classify on a copy with them removed.
  const probe = h.replace(/[\u{0}-\u{20}\u{7F}-\u{9F}]/gu, '');
  if (!probe) return null;
  // Protocol-relative ("//host") and backslash forms can leave the site.
  if (probe.startsWith('//') || probe.includes('\\')) return null;
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(probe);
  if (!scheme) return h; // relative: "/path", "#hash", "?q", "page"
  return ['http', 'https', 'mailto', 'tel'].includes(scheme[1].toLowerCase()) ? h : null;
}

function resolveHref(href, fallback) {
  const safe = safeHref(href);
  if (!safe) return fallback;
  return STALE_PRODUCT_HREF_MAP[safe] || safe;
}

/* A CMS label is normally bilingual ({en, ar}); a plain string (not schema
   shape) has no Arabic, so it goes through the dictionary like static text. */
function cmsLabel(field, lang, t) {
  return typeof field === 'string' ? t(field) : loc(field, lang);
}

/* navigation.items[] (+ each item's children[]) -> flat lookup by _key. */
export function buildNavIndex(doc) {
  const index = {};
  (doc?.items || []).forEach((item) => {
    if (item?._key) index[item._key] = item;
    (item?.children || []).forEach((child) => {
      if (child?._key) index[child._key] = child;
    });
  });
  return index;
}

export function navLabel(index, key, lang, t, fallbackText) {
  const item = index[key];
  const label = item && cmsLabel(item.label, lang, t);
  return label || t(fallbackText);
}

export function navHref(index, key, fallbackHref) {
  const item = index[key];
  return resolveHref(item?.href, fallbackHref);
}

/* footer.columns[] -> flat lookups by _key, for both columns and their links. */
export function buildFooterIndex(doc) {
  const columns = {};
  const links = {};
  (doc?.columns || []).forEach((col) => {
    if (col?._key) columns[col._key] = col;
    (col?.links || []).forEach((link) => {
      if (link?._key) links[link._key] = link;
    });
  });
  return { columns, links };
}

export function footerColumnHeading({ columns }, key, lang, t, fallbackText) {
  const col = columns[key];
  const heading = col && cmsLabel(col.heading, lang, t);
  return heading || t(fallbackText);
}

export function footerLinkLabel({ links }, key, lang, t, fallbackText) {
  const link = links[key];
  const label = link && cmsLabel(link.label, lang, t);
  return label || t(fallbackText);
}

export function footerLinkHref({ links }, key, fallbackHref) {
  const link = links[key];
  return resolveHref(link?.href, fallbackHref);
}
