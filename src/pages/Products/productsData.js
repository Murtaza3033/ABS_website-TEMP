/* Shared data/adapter for the Products index + detail pages.
   PRODMETA (per-product accent color + dashboard-mock demo data) is reused
   for reference only, per the phase's explicit allowance — it isn't
   modified, and the About page's own ProductCarousel is untouched. */
import { PRODMETA } from '../AboutUs/aboutData';

/* Same literal copy seeded into Sanity's `product` documents (sourced from
   Header.jsx's mega-menu descriptions + translations.js's full sentences),
   mirrored here as the safe fallback if the CMS is unreachable or empty. */
export const FALLBACK_PRODUCTS = [
  {
    _id: 'fallback-businessflo',
    name: 'BusinessFlo',
    slug: 'businessflo',
    tagline: 'Automate approvals, workflows and operations.',
    description:
      'BusinessFlo moves approvals, workflows, finance, inventory and daily reporting off paper and into one connected ERP — every request routed, every action audited, every number live.',
    order: 1,
  },
  {
    _id: 'fallback-peoplenest',
    name: 'PeopleNest',
    slug: 'peoplenest',
    tagline: 'Streamline HR, payroll and employees.',
    description:
      'PeopleNest manages employees, attendance, leave, payroll, performance, documents and every HR workflow from one modern platform — with a self-service view for every employee.',
    order: 2,
  },
  {
    _id: 'fallback-pharmafieldflo',
    name: 'Field Force',
    slug: 'pharmafieldflo',
    tagline: 'Plan, track and optimize field activities in real time.',
    description:
      'Field Force plans field visits, tracks calls, manages doctors and pharmacies, and turns territory activity into live field performance analytics — visible the moment it happens.',
    order: 3,
  },
];

/* Resolves a `description` field that may be plain text (FALLBACK_PRODUCTS)
   or Sanity's Portable Text localeBlock shape ({en:[block...], ar:[block...]}). */
export function resolveDescription(doc, lang) {
  const value = doc?.description;
  if (!value) return '';
  if (typeof value === 'string') return value;
  const blocks = (lang === 'ar' ? value.ar : value.en) || value.en || [];
  return blocks
    .map((b) => (b.children || []).map((c) => c.text || '').join(''))
    .join(' ')
    .trim();
}

/* Attaches the matching PRODMETA entry (by position — Sanity was seeded in
   the same order as PRODMETA/FALLBACK_PRODUCTS) for the dashboard-showcase
   visual + accent color, which the CMS product schema doesn't model. */
export function withMeta(doc, i) {
  const meta = PRODMETA[i] || PRODMETA[0];
  return { ...doc, meta };
}

export function findFallbackIndex(slug) {
  const i = FALLBACK_PRODUCTS.findIndex((p) => p.slug === slug);
  return i === -1 ? 0 : i;
}

/* Sanity's slug field is {_type:'slug', current:'...'}; FALLBACK_PRODUCTS uses
   a plain string. This reads either shape. */
export function slugOf(p) {
  if (!p) return '';
  return typeof p.slug === 'string' ? p.slug : p.slug?.current || '';
}
