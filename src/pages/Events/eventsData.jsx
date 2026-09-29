/* Events — data + icon helper. */

const ICON_PATHS = {
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  cal: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></>,
  booth: <><path d="M3 9l1-5h16l1 5" /><path d="M4 9v11h16V9" /><path d="M9 20v-6h6v6" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 0 20" /><path d="M12 2a15 15 0 0 0 0 20" /></>,
  tag: <><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 12V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6z" /><path d="M7 7h.01" /></>,
  mobile: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  shield: <><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" /></>,
};
export function Icon({ name }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICON_PATHS[name]}</svg>;
}

export const FACTS = [
  ['pin', 'Karachi Expo Centre', 'Pakistan'],
  ['booth', 'Hall 1 · Booth A-30', 'Our stand'],
  ['grid', '4 sectors shown', 'Real estate to services'],
  ['cal', 'ITCN Asia 2023', 'IT & telecom expo'],
];

export const GALLERY = [
  ['itcn-wall', 'webp', 'Event Photo', 'The main stand at ITCN Asia 2023, Karachi Expo Centre'],
  ['booth-team', 'webp', 'At the booth', 'The Align team at ITCN Asia 2023'],
  ['booth-demo', 'webp', 'Live demos', 'Walking a visitor through the platform, live'],
  ['brochure', 'webp', 'In conversation', 'Talking operations — one conversation at a time'],
];

export const WHY = [
  ['We show up where you are', 'From regional expos to industry conferences, we go where operations teams already gather — not just online.', 'Talk to us', '/contact-us.html', 'globe', 'global-reach'],
  ['Straight answers, not a runaround', 'Walk away from every conversation knowing exactly whether Align fits your business, and what it costs.', 'Ask us anything', '/contact-us.html', 'tag', 'pricing'],
  ['Come see it running, live', 'We bring a real working product to every event, not a slideshow — see it running on a phone or laptop, right in front of you.', 'Book a live demo', '/contact-us.html', 'mobile', 'mobile-app'],
  ['Bring your toughest questions', 'Security, compliance, implementation — whatever’s actually holding your decision back, ask it in person and get a straight answer.', 'Talk to our team', '/contact-us.html', 'shield', 'security'],
];

/* ---------- Event model ----------
   The built-in event (ITCN Asia 2023) in the shape of a Sanity `event`
   document: the useEvents() placeholder, the fallback when the CMS is empty
   or unreachable, and the per-field fallback for the CMS copy of the same
   event (matched by slug) — so an emptied field shows today's copy. */
export const FALLBACK_EVENT_SLUG = 'itcn-asia-2023';
const DESC_BOLD = 'Hall #1, Booth #A-30';
const DESC_PARTS = [
  "At Pakistan's leading IT & telecom exhibition, we set up at",
  'and spent the show doing what we like most — talking to businesses. Teams from real estate, manufacturing, trading and services stopped by to see how the right systems reshape day-to-day operations, and we walked through their challenges one conversation at a time.',
];
export const FALLBACK_EVENT = {
  _id: 'event-itcn-asia-2023',
  slug: { current: FALLBACK_EVENT_SLUG },
  title: 'ITCN Asia 2023',
  featured: true,
  dateLabel: '2023',
  location: 'Karachi Expo Centre · Pakistan',
  venue: 'Karachi Expo Centre',
  booth: 'Hall 1 · Booth A-30',
  facts: FACTS.map(([icon, title, subtitle]) => ({ icon, title, subtitle })),
  galleryFiles: GALLERY.map(([file, ext, label, caption]) => ({ path: `/assets/images/about/${file}.${ext}`, label, caption })),
};
export const FALLBACK_EVENTS = [FALLBACK_EVENT];

/* Portable Text (one language) -> paragraphs of { text, bold } runs. */
function ptParagraphs(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b) => b?._type === 'block')
    .map((b) => (b.children || []).map((c) => ({ text: c.text || '', bold: (c.marks || []).includes('strong') })))
    .filter((runs) => runs.some((r) => r.text.trim()));
}

const eventTime = (doc) => {
  if (doc.startDate) return new Date(doc.startDate).getTime();
  const y = String(doc.dateLabel?.en || doc.dateLabel || '').match(/\b(19|20)\d{2}\b/);
  if (y) return new Date(`${y[0]}-01-01T00:00:00Z`).getTime();
  return doc._createdAt ? new Date(doc._createdAt).getTime() : 0;
};

/* Newest first (start date, else the year in the date label, else creation). */
export const sortEvents = (docs) => [...docs].sort((a, b) => eventTime(b) - eventTime(a));

/* A Sanity event doc (or FALLBACK_EVENT) -> what the page renders: localized
   texts, date text, facts, and gallery items with ready image URLs.
   `pic` is lib/cmsImage's resolver (undefined src while the CMS is pending). */
export function toEvent(doc, { lang, t, pic }) {
  const fb = doc.slug?.current === FALLBACK_EVENT_SLUG ? FALLBACK_EVENT : {};
  const L = (v) => {
    if (!v) return '';
    if (typeof v === 'string') return t(v);
    if (lang === 'ar' && v.ar) return v.ar;
    return v.en ? t(v.en) : '';
  };
  const tx = (v, f) => L(v) || L(f);

  let dateText = L(doc.dateLabel);
  if (!dateText && doc.startDate) {
    const fmt = new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const a = new Date(doc.startDate);
    const b = doc.endDate ? new Date(doc.endDate) : null;
    try { dateText = b && b > a ? fmt.formatRange(a, b) : fmt.format(a); } catch { dateText = fmt.format(a); }
  }
  if (!dateText) dateText = L(fb.dateLabel);
  const endMs = doc.endDate || doc.startDate ? new Date(doc.endDate || doc.startDate).getTime() : 0;

  // Description: CMS Portable Text (Arabic, else English), else the built-in copy.
  let paragraphs = ptParagraphs(lang === 'ar' && doc.description?.ar?.length ? doc.description.ar : doc.description?.en);
  if (lang === 'ar' && !doc.description?.ar?.length && paragraphs.length) {
    paragraphs = paragraphs.map((runs) => runs.map((r) => ({ ...r, text: t(r.text) })));
  }
  if (!paragraphs.length && fb === FALLBACK_EVENT) {
    paragraphs = [[{ text: `${t(DESC_PARTS[0])} ` }, { text: DESC_BOLD, bold: true }, { text: ` ${t(DESC_PARTS[1])}` }]];
  }

  const facts = (doc.facts?.length ? doc.facts : fb.facts || [])
    .map((f) => ({ icon: f?.icon || 'pin', title: L(f?.title), subtitle: L(f?.subtitle) }))
    .filter((f) => f.title);

  const cmsGallery = (doc.gallery || []).filter((g) => g?.asset);
  const fbFiles = fb.galleryFiles || [];
  let gallery;
  if (cmsGallery.length) {
    gallery = cmsGallery.map((g, i) => ({
      key: g._key || `g${i}`,
      src: pic(g, { width: 1200 }),
      label: tx(g.label, fbFiles[i]?.label),
      caption: tx(g.caption, fbFiles[i]?.caption),
      alt: L(g.alt) || tx(g.caption, fbFiles[i]?.caption) || tx(g.label, fbFiles[i]?.label),
    }));
  } else if (fbFiles.length) {
    gallery = fbFiles.map((g, i) => ({ key: `fb${i}`, src: pic(null, null, g.path), label: t(g.label), caption: t(g.caption), alt: t(g.caption) }));
  } else if (doc.coverImage?.asset) {
    gallery = [{ key: 'cover', src: pic(doc.coverImage, { width: 1200 }), label: '', caption: '', alt: L(doc.coverImage.alt) }];
  } else {
    gallery = [];
  }
  const cover = doc.coverImage?.asset ? pic(doc.coverImage, { width: 760 }) : gallery[0]?.src;

  return {
    id: doc._id || doc.slug?.current,
    title: tx(doc.title, fb.title),
    featured: !!doc.featured,
    dateText,
    upcoming: endMs > Date.now(),
    location: tx(doc.location, fb.location),
    venue: tx(doc.venue, fb.venue) || tx(doc.location, fb.location),
    booth: tx(doc.booth, fb.booth),
    paragraphs,
    facts,
    gallery,
    cover,
  };
}
