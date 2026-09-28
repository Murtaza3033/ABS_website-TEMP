/* Shared data/adapters for the Products index + detail pages (and the About
   page's ProductCarousel, which reuses PRODMETA). */
import { loc, blocksToText } from '../../lib/loc';

/* Per-product accent color + dashboard-mock demo data (no CMS equivalent).
   `url` is the product's live app (shown in the mock browser bar and as the
   "Visit" button); products without one set `bar` for the browser-bar label
   instead. `src` overrides the default /assets/images/about/<img>.webp. */
export const PRODMETA = [
  { slug: 'businessflo', name: 'Businessflo', accent: '#1a56db', tint: 'rgba(26,86,219,.14)', url: 'app.businessflo.com', img: 'dash-businessflo', topTitle: 'PO-2041 approved', topSub: 'Warehouse notified', botLabel: 'Payment received', botValue: 'Rs 84,500', botDelta: '↑ Cleared just now' },
  { slug: 'peoplenest', name: 'PeopleNest', accent: '#7958ff', tint: 'rgba(124,92,255,.14)', url: 'app.peoplenest.com', img: 'dash-peoplenest', topTitle: 'Leave approved', topSub: 'Casual · 2 days', botLabel: 'New hires this month', botValue: '12', botDelta: '↑ Onboarded' },
  { slug: 'pharmafieldflo', name: 'Field Force', accent: '#157d44', tint: 'rgba(26,157,85,.14)', url: 'app.pharmafieldflo.com', img: 'dash-pharmafieldflo', topTitle: 'Visit logged', topSub: 'Dr. review · 4:20 PM', botLabel: 'Coverage today', botValue: '87%', botDelta: '↑ 6% vs target' },
  // HMSflo has no public app URL or logo yet — placeholder dashboard image.
  { slug: 'hmsflo', name: 'HMSflo', accent: '#0e9384', tint: 'rgba(14,147,132,.14)', url: null, bar: 'HMSflo', img: 'hmsflo-dashboard', src: '/assets/images/hero/hmsflo-dashboard.webp', topTitle: 'Patient admitted', topSub: 'Ward B · Bed 12', botLabel: 'Bed occupancy', botValue: '86%', botDelta: '↑ 4% this week' },
];

/* Image path for a PRODMETA entry's dashboard screenshot. */
export const metaImg = (m) => m.src || `/assets/images/about/${m.img}.webp`;

/* Same literal copy seeded into Sanity's `product` documents (sourced from
   Header.jsx's mega-menu descriptions + i18n/ar.js's full sentences),
   mirrored here as the safe fallback if the CMS is unreachable or empty. */
export const FALLBACK_PRODUCTS = [
  {
    _id: 'fallback-businessflo',
    name: 'Businessflo',
    slug: 'businessflo',
    tagline: 'Automate approvals, workflows and operations.',
    description:
      'Businessflo moves approvals, workflows, finance, inventory and daily reporting off paper and into one connected ERP — every request routed, every action audited, every number live.',
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
  {
    _id: 'fallback-hmsflo',
    name: 'HMSflo',
    slug: 'hmsflo',
    tagline: 'Run your hospital from one connected system.',
    description:
      'HMSflo brings OPD, admissions, beds, pharmacy, lab and billing into one hospital management system — every patient tracked, every bed visible, every invoice accurate.',
    order: 4,
    // Placeholder feature list until the CMS product doc provides its own.
    features: [
      { _key: 'opd', title: 'OPD & appointments', description: 'Register patients, book appointments and manage outpatient queues from arrival to consultation.' },
      { _key: 'ipd', title: 'Admissions & bed management', description: 'Admit, transfer and discharge patients with a live view of every ward and bed.' },
      { _key: 'pharmacy', title: 'Pharmacy', description: 'Dispense against prescriptions and keep stock, batches and expiry dates under control.' },
      { _key: 'lab', title: 'Laboratory', description: 'Order tests, record results and deliver reports straight to the patient record.' },
      { _key: 'billing', title: 'Billing & insurance', description: 'Accurate invoices, panel and insurance claims, and payments in one ledger.' },
      { _key: 'reports', title: 'Reports & analytics', description: 'Live dashboards for occupancy, revenue and clinical activity across the hospital.' },
    ],
  },
];

/* Local product logos (public/) used when the CMS doc has no logo image.
   They're wide wordmarks, so `w`/`h` (natural size) + `icon` ([x0,y0,x1,y1]
   px box of the symbol) let the 48px tile show just the symbol, legibly.
   Products without a local logo keep the letter tile. */
export const LOCAL_LOGOS = {
  businessflo: { src: '/assets/images/logos/businessflo-logo-6e685b87.png', w: 2501, h: 626, icon: [70, 136, 503, 489] },
  peoplenest: { src: '/assets/images/logos/people-nest-logo.png', w: 1050, h: 215, icon: [0, 0, 259, 186] },
};

/* Inline style that crops a LOCAL_LOGOS wordmark to its symbol, centred in a
   `box`-px square (the <img> sits inside an overflow:hidden box that size). */
export function logoIconStyle(logo, box) {
  const [x0, y0, x1, y1] = logo.icon;
  const s = box / Math.max(x1 - x0, y1 - y0);
  return {
    position: 'absolute', maxWidth: 'none',
    width: `${logo.w * s}px`, height: `${logo.h * s}px`,
    left: `${(box - (x1 - x0) * s) / 2 - x0 * s}px`,
    top: `${(box - (y1 - y0) * s) / 2 - y0 * s}px`,
  };
}

/* Resolves a `description` field that may be plain text (FALLBACK_PRODUCTS)
   or Sanity's Portable Text localeBlock shape ({en:[block...], ar:[block...]}). */
export function resolveDescription(doc, lang, t) {
  const value = doc?.description;
  if (!value) return '';
  // Arabic requested but only English present: run it through the dictionary.
  const tr = (s) => (lang === 'ar' && t ? t(s) : s);
  if (typeof value === 'string') return tr(value);
  const hasAr = Array.isArray(value.ar) && value.ar.length > 0;
  return hasAr ? blocksToText(value, lang) : tr(blocksToText(value, 'en'));
}

/* Attaches the matching PRODMETA entry for the dashboard-showcase visual +
   accent color, which the CMS product schema doesn't model. Matched by slug;
   unknown slugs fall back to position (Sanity was seeded in PRODMETA order). */
export function withMeta(doc, i) {
  const slug = slugOf(doc);
  const meta = PRODMETA.find((m) => m.slug === slug) || PRODMETA[i] || PRODMETA[0];
  return { ...doc, meta };
}

export function findFallbackIndex(slug) {
  const i = FALLBACK_PRODUCTS.findIndex((p) => p.slug === slug);
  return i === -1 ? 0 : i;
}

/* A CMS product doc is only usable if it has a slug and a name; anything else
   (e.g. docs written outside the schema) is ignored in favour of static data. */
export function isValidProduct(p) {
  return Boolean(p && typeof p === 'object' && slugOf(p) && loc(p.name, 'en'));
}

/* Valid CMS products, de-duplicated by slug (first wins), with any known
   product the CMS doesn't provide filled in from FALLBACK_PRODUCTS. */
export function mergeProducts(cmsProducts) {
  const bySlug = new Map();
  for (const p of cmsProducts || []) {
    if (isValidProduct(p) && !bySlug.has(slugOf(p))) bySlug.set(slugOf(p), p);
  }
  for (const p of FALLBACK_PRODUCTS) {
    if (!bySlug.has(p.slug)) bySlug.set(p.slug, p);
  }
  return [...bySlug.values()].sort((a, b) => (a.order || 0) - (b.order || 0));
}

/* Features must be {title, description} objects (schema); plain strings or
   untitled entries are skipped. */
export function validFeatures(features) {
  return Array.isArray(features)
    ? features.filter((f) => f && typeof f === 'object' && loc(f.title, 'en'))
    : [];
}

/* Sanity's slug field is {_type:'slug', current:'...'}; FALLBACK_PRODUCTS uses
   a plain string. This reads either shape. */
export function slugOf(p) {
  if (!p) return '';
  return typeof p.slug === 'string' ? p.slug : p.slug?.current || '';
}
