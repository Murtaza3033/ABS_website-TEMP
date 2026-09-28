/* Contact Us — data + validation helpers. */

export const COUNTRIES = [
  { iso: 'PK', name: 'Pakistan', dial: '+92', len: [10, 10] },
  { iso: 'AE', name: 'United Arab Emirates', dial: '+971', len: [9, 9] },
  { iso: 'SA', name: 'Saudi Arabia', dial: '+966', len: [9, 9] },
  { iso: 'QA', name: 'Qatar', dial: '+974', len: [8, 8] },
  { iso: 'KW', name: 'Kuwait', dial: '+965', len: [8, 8] },
  { iso: 'BH', name: 'Bahrain', dial: '+973', len: [8, 8] },
  { iso: 'OM', name: 'Oman', dial: '+968', len: [8, 8] },
  { iso: 'GB', name: 'United Kingdom', dial: '+44', len: [10, 10] },
  { iso: 'US', name: 'United States', dial: '+1', len: [10, 10] },
  { iso: 'CA', name: 'Canada', dial: '+1', len: [10, 10] },
  { iso: 'AU', name: 'Australia', dial: '+61', len: [9, 9] },
  { iso: 'IN', name: 'India', dial: '+91', len: [10, 10] },
  { iso: 'BD', name: 'Bangladesh', dial: '+880', len: [10, 10] },
  { iso: 'LK', name: 'Sri Lanka', dial: '+94', len: [9, 9] },
  { iso: 'EG', name: 'Egypt', dial: '+20', len: [10, 10] },
  { iso: 'TR', name: 'Turkey', dial: '+90', len: [10, 10] },
  { iso: 'ZA', name: 'South Africa', dial: '+27', len: [9, 9] },
  { iso: 'NG', name: 'Nigeria', dial: '+234', len: [10, 10] },
  { iso: 'MY', name: 'Malaysia', dial: '+60', len: [9, 10] },
  { iso: 'SG', name: 'Singapore', dial: '+65', len: [8, 8] },
  { iso: 'ID', name: 'Indonesia', dial: '+62', len: [9, 11] },
  { iso: 'PH', name: 'Philippines', dial: '+63', len: [10, 10] },
  { iso: 'CN', name: 'China', dial: '+86', len: [11, 11] },
  { iso: 'JP', name: 'Japan', dial: '+81', len: [10, 10] },
  { iso: 'DE', name: 'Germany', dial: '+49', len: [10, 11] },
  { iso: 'FR', name: 'France', dial: '+33', len: [9, 9] },
  { iso: 'IT', name: 'Italy', dial: '+39', len: [9, 10] },
  { iso: 'ES', name: 'Spain', dial: '+34', len: [9, 9] },
  { iso: 'NL', name: 'Netherlands', dial: '+31', len: [9, 9] },
  { iso: 'BR', name: 'Brazil', dial: '+55', len: [10, 11] },
];

const byIso = Object.fromEntries(COUNTRIES.map((c) => [c.iso, c]));
export const cc = (iso) => byIso[iso] || byIso.PK;

/* `t` is the LanguageContext translator (identity by default / in English);
   the templates below are dictionary keys with {placeholders}. */
const id = (s) => s;
const lenText = (iso, t = id) => {
  const c = cc(iso);
  const n = c.len[0] === c.len[1] ? `${c.len[0]}` : `${c.len[0]}–${c.len[1]}`;
  return t('{n} digits').replace('{n}', n);
};
export const phonePH = (iso, t = id) => {
  const c = cc(iso);
  return c.len[0] === c.len[1] ? t('{n}-digit number').replace('{n}', `${c.len[0]}`) : lenText(iso, t);
};
export const phoneErr = (iso, t = id) => t('Enter a valid {country} number ({len}).')
  .replace('{country}', t(cc(iso).name)).replace('{len}', lenText(iso, t));

/* Live input filter: digits only, capped at the country's max length. Drops a
   pasted dial code (+92 …) and the national trunk 0 (0321… → 321…); Italy
   keeps its leading 0 because it is part of Italian numbers. */
export const cleanPhone = (v, iso) => {
  const c = cc(iso);
  let d = String(v).replace(/\D/g, '');
  const dial = c.dial.replace(/\D/g, '');
  if (d.length > c.len[1] && d.startsWith(dial)) d = d.slice(dial.length);
  if (c.iso !== 'IT') d = d.replace(/^0+/, '');
  return d.slice(0, c.len[1]);
};

export const validPhone = (v, iso) => {
  if (!v || !v.trim()) return true; // phone is optional
  const c = cc(iso);
  const d = v.replace(/\D/g, '');
  return d.length >= c.len[0] && d.length <= c.len[1];
};

export const REASON_OPTS = ['Book a demo', 'Product question', 'Partnership', 'Careers', 'Something else'];
export const PRODUCT_OPTS = ['BusinessFlo', 'PeopleNest', 'Field Force', 'Not sure yet'];
export const Q_TITLES = {
  name: "What's your name?",
  company: 'What company are you with?',
  reason: 'What brings you to Align?',
  product: 'Which product interests you?',
  contact: 'How can we reach you?',
  message: "Anything you'd like us to know?",
};

// step order depends on the chosen reason (demo/product question route to a product step)
export const chatSteps = (reason) => {
  const routed = reason === 'Book a demo' || reason === 'Product question';
  return ['name', 'company', 'reason', routed ? 'product' : null, 'contact', 'message'].filter(Boolean);
};

/* x/y = the pin's dot on the map image (%). hit = tap-target size (px, >=32).
   anchor = which corner/edge of the tap target sits on the dot. Cities that
   are only ~1% apart (Karachi/Lahore/Islamabad, Dubai/Saudi) get targets that
   open away from each other (Islamabad up, Lahore right, Karachi left-down…),
   so they never overlap, instead of centred boxes that do. Below ~500px of
   effective map width even that can't fit, so each `group` collapses into
   one cluster button that zooms in (PresenceMap.jsx).
   'c' centre · 't' below · 'br' above-left · 'bl' above-right */
export const PINS = [
  { city: 'Karachi', tag: 'Headquarters', label: 'Suite #404, Imperial Trade Tower, DHA Phase 7 — our head office.', x: 67.3, y: 37.5, hit: 32, anchor: 't', group: 'pk' },
  { city: 'Islamabad', tag: 'Regional office', label: 'Our presence in the capital, serving northern operations.', x: 68.5, y: 33, hit: 32, anchor: 'br', group: 'pk' },
  { city: 'Lahore', tag: 'Regional office', label: 'Supporting clients across Punjab and central Pakistan.', x: 68.8, y: 35.5, hit: 32, anchor: 'bl', group: 'pk' },
  { city: 'Dubai, UAE', tag: 'Regional presence', label: 'Our gateway to the Gulf market and regional clients.', x: 61.4, y: 45.9, hit: 32, anchor: 'br', group: 'gulf' },
  { city: 'Saudi Arabia', tag: 'Regional presence', label: 'Serving enterprises across the Kingdom.', x: 57.9, y: 50.5, hit: 32, anchor: 't', group: 'gulf' },
  { city: 'UK, London', tag: 'International presence', label: 'Our foothold in the European market.', x: 43.5, y: 23.3, hit: 38 },
  { city: 'Australia', tag: 'Growing into', label: 'Expanding our reach into the Australian market.', x: 83, y: 81.3, hit: 38 },
];
