/* Contact field rules — the ONE definition shared by the browser (Contact Us
   page, SalesBot via lib/contactApi.js) and the server (api/_lib/
   contactSubmission.js imports this file directly). Pure JS with no browser or
   Node APIs, so both sides always enforce identical limits and patterns.
   Use CONTACT_LIMITS.<field>.max for input maxLength attributes. */

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 200 },
  phone: { max: 30, minDigits: 4, maxDigits: 15 },
  company: { max: 150 },
  message: { max: 2000 },
  countryIso: { max: 5 },
  pageUrl: { max: 500 },
};

// Starts with a letter (any script), then letters, combining marks (Arabic
// harakat, Devanagari vowel signs, decomposed accents), space, period, straight
// or curly apostrophe (iOS/macOS smart punctuation types ’), hyphen, and
// ZWNJ/ZWJ (U+200C/U+200D, required in Persian/Urdu/Indic names).
export const NAME_RE = /^\p{L}[\p{L}\p{M} .'\u{2019}\u{200C}\u{200D}-]*$/u;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (v) => (typeof v === 'string' ? v.trim() : '');

export const validName = (v) => {
  const t = str(v);
  return t.length >= CONTACT_LIMITS.name.min && t.length <= CONTACT_LIMITS.name.max && NAME_RE.test(t);
};

export const validEmail = (v) => {
  const t = str(v);
  return t.length <= CONTACT_LIMITS.email.max && EMAIL_RE.test(t);
};

/* Optional field: empty is valid. Broad sanity check only (the Contact page
   adds its per-country digit count on top as a UX nicety). */
export const validPhone = (v) => {
  const t = str(v);
  if (!t) return true;
  if (t.length > CONTACT_LIMITS.phone.max) return false;
  const digits = t.replace(/\D/g, '').length;
  return digits >= CONTACT_LIMITS.phone.minDigits && digits <= CONTACT_LIMITS.phone.maxDigits;
};

export const validCompany = (v) => str(v).length <= CONTACT_LIMITS.company.max;
export const validMessage = (v) => str(v).length <= CONTACT_LIMITS.message.max;

/* Returns { field: code } for every invalid field (code: 'required' |
   'too_short' | 'too_long' | 'invalid'), or null when all are valid. */
export function contactFieldErrors({ name, email, phone, company, message } = {}) {
  const e = {};
  const n = str(name);
  if (!n) e.name = 'required';
  else if (n.length < CONTACT_LIMITS.name.min) e.name = 'too_short';
  else if (n.length > CONTACT_LIMITS.name.max) e.name = 'too_long';
  else if (!NAME_RE.test(n)) e.name = 'invalid';

  const em = str(email);
  if (!em) e.email = 'required';
  else if (em.length > CONTACT_LIMITS.email.max) e.email = 'too_long';
  else if (!EMAIL_RE.test(em)) e.email = 'invalid';

  const ph = str(phone);
  if (ph.length > CONTACT_LIMITS.phone.max) e.phone = 'too_long';
  else if (!validPhone(ph)) e.phone = 'invalid';

  if (!validCompany(company)) e.company = 'too_long';
  if (!validMessage(message)) e.message = 'too_long';
  return Object.keys(e).length ? e : null;
}

/* pageUrl: only absolute http(s) URLs or same-site root-relative paths
   ("/contact-us", never protocol-relative "//evil"). Rejects javascript:,
   data:, etc. */
export function validPageUrl(v) {
  const t = str(v);
  if (!t) return true;
  if (t.length > CONTACT_LIMITS.pageUrl.max) return false;
  if (t.startsWith('/')) return !t.startsWith('//') && !t.includes('\\');
  try {
    const u = new URL(t);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
