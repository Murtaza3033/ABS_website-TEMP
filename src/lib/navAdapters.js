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

export function resolveHref(href, fallback) {
  if (!href) return fallback;
  return STALE_PRODUCT_HREF_MAP[href] || href;
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
  const label = item && loc(item.label, lang);
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
  const heading = col && loc(col.heading, lang);
  return heading || t(fallbackText);
}

export function footerLinkLabel({ links }, key, lang, t, fallbackText) {
  const link = links[key];
  const label = link && loc(link.label, lang);
  return label || t(fallbackText);
}

export function footerLinkHref({ links }, key, fallbackHref) {
  const link = links[key];
  return resolveHref(link?.href, fallbackHref);
}
