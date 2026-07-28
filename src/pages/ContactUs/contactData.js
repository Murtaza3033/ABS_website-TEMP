/* Contact Us — data + validation helpers (mirrors contact-us.runtime.js). */

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

export const lenText = (iso) => {
  const c = cc(iso);
  return c.len[0] === c.len[1] ? `${c.len[0]} digits` : `${c.len[0]}–${c.len[1]} digits`;
};
export const phonePH = (iso) => {
  const c = cc(iso);
  return c.len[0] === c.len[1] ? `${c.len[0]}-digit number` : lenText(iso);
};
export const phoneErr = (iso) => `Enter a valid ${cc(iso).name} number (${lenText(iso)}).`;

export const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());
export const validName = (v) => {
  const t = (v || '').trim();
  return t.length >= 2 && /^[A-Za-z][A-Za-z .'-]*$/.test(t);
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

export const PINS = [
  { city: 'Karachi', tag: 'Headquarters', label: 'Suite #404, Imperial Trade Tower, DHA Phase 7 — our head office.', x: 67.3, y: 37.5, hit: 40 },
  { city: 'Islamabad', tag: 'Regional office', label: 'Our presence in the capital, serving northern operations.', x: 68.5, y: 33, hit: 30 },
  { city: 'Lahore', tag: 'Regional office', label: 'Supporting clients across Punjab and central Pakistan.', x: 68.8, y: 35.5, hit: 30 },
  { city: 'Dubai, UAE', tag: 'Regional presence', label: 'Our gateway to the Gulf market and regional clients.', x: 61.4, y: 45.9, hit: 38 },
  { city: 'Saudi Arabia', tag: 'Regional presence', label: 'Serving enterprises across the Kingdom.', x: 57.9, y: 50.5, hit: 42 },
  { city: 'UK, London', tag: 'International presence', label: 'Our foothold in the European market.', x: 43.5, y: 23.3, hit: 38 },
  { city: 'Australia', tag: 'Growing into', label: 'Expanding our reach into the Australian market.', x: 83, y: 81.3, hit: 38 },
];
