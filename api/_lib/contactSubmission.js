/* Core Contact Submission handler — platform-agnostic on purpose.
   Phase 10B's brief: the hosting platform (Vercel / Netlify / Cloudflare /
   plain Express) isn't decided yet, so all the real logic (validation +
   the Sanity write) lives here as plain functions that take/return plain
   objects. `api/contact.js` is the only file that knows about a specific
   platform's request/response shape — swapping platforms later means
   rewriting that one thin adapter, not this file. */

import {randomUUID} from 'node:crypto';
import {createClient} from '@sanity/client';
import {sendContactNotification} from './email.js';
import {verifyTurnstileToken} from './turnstile.js';
// Field rules are shared verbatim with the browser (src/lib/contactApi.js
// re-exports the same module), so client and server validation can't drift.
import {
  CONTACT_LIMITS,
  NAME_RE,
  EMAIL_RE,
  validPhone,
  validPageUrl,
} from '../../src/lib/contactRules.js';

export const REASONS = ['Book a demo', 'Product question', 'Partnership', 'Careers', 'Something else'];
export const PRODUCTS = ['Businessflo', 'PeopleNest', 'Field Force', 'HMSflo', 'Not sure yet'];
export const SOURCES = ['contact-form', 'book-demo', 'salesbot'];

const MAX = {
  name: CONTACT_LIMITS.name.max,
  company: CONTACT_LIMITS.company.max,
  email: CONTACT_LIMITS.email.max,
  phone: CONTACT_LIMITS.phone.max,
  countryIso: CONTACT_LIMITS.countryIso.max,
  message: CONTACT_LIMITS.message.max,
  pageUrl: CONTACT_LIMITS.pageUrl.max,
};

/* Leads are written under a dotted _id ("private.contactSubmission.<uuid>").
   Sanity treats any document whose _id contains a "." as being in a path,
   and path documents are never returned to unauthenticated requests — even
   in a public dataset — so the frontend's public, token-less client (and
   anyone else hitting the public API/CDN) can't read leads, while Studio and
   the write-token client (both authenticated) still see them. */
export const LEAD_ID_PREFIX = 'private.contactSubmission.';

function trimStr(v) {
  return typeof v === 'string' ? v.trim() : '';
}

/* Returns { fields: {...} } with one message per invalid field, or null if
   the payload is clean. Every field is validated independently so the
   caller can report all problems at once (matches the classic-form UX,
   which already shows multiple field errors together). */
export function validateContactPayload(body) {
  const fields = {};
  const b = body && typeof body === 'object' ? body : {};

  // Honeypot: a real visitor never fills this hidden field. Any non-empty
  // value is treated as a bot — checked first so callers can short-circuit.
  if (trimStr(b.honeypot)) {
    fields._honeypot = 'spam_detected';
  }

  const name = trimStr(b.name);
  if (!name) fields.name = 'Name is required.';
  else if (name.length < CONTACT_LIMITS.name.min) fields.name = `Name must be at least ${CONTACT_LIMITS.name.min} characters.`;
  else if (name.length > MAX.name) fields.name = `Name must be ${MAX.name} characters or fewer.`;
  else if (!NAME_RE.test(name)) fields.name = 'Enter a valid name (letters only).';

  const email = trimStr(b.email);
  if (!email) fields.email = 'Email is required.';
  else if (email.length > MAX.email) fields.email = `Email must be ${MAX.email} characters or fewer.`;
  else if (!EMAIL_RE.test(email)) fields.email = 'Enter a valid email address.';

  const reason = trimStr(b.reason);
  if (!reason) fields.reason = 'Reason is required.';
  else if (!REASONS.includes(reason)) fields.reason = 'Unrecognized reason.';

  const product = trimStr(b.product);
  if (product && !PRODUCTS.includes(product)) fields.product = 'Unrecognized product.';

  const phone = trimStr(b.phone);
  if (phone.length > MAX.phone) fields.phone = `Phone must be ${MAX.phone} characters or fewer.`;
  else if (!validPhone(phone)) fields.phone = 'Enter a valid phone number.';

  const countryIso = trimStr(b.countryIso);
  if (countryIso.length > MAX.countryIso) fields.countryIso = 'Invalid country code.';

  const message = trimStr(b.message);
  if (message.length > MAX.message) fields.message = `Message must be ${MAX.message} characters or fewer.`;

  const company = trimStr(b.company);
  if (company.length > MAX.company) fields.company = `Company must be ${MAX.company} characters or fewer.`;

  const pageUrl = trimStr(b.pageUrl);
  if (!validPageUrl(pageUrl)) fields.pageUrl = 'Invalid page URL.';

  return Object.keys(fields).length > 0 ? fields : null;
}

/* Only the known, expected fields are ever forwarded to Sanity — anything
   else in the request body (unexpected keys, prototype-pollution attempts,
   etc.) is silently dropped rather than stored. */
export function sanitizeContactPayload(body, {source} = {}) {
  const b = body && typeof body === 'object' ? body : {};
  return {
    name: trimStr(b.name),
    company: trimStr(b.company) || undefined,
    reason: trimStr(b.reason) || undefined,
    product: trimStr(b.product) || undefined,
    email: trimStr(b.email).toLowerCase(),
    phone: trimStr(b.phone) || undefined,
    countryIso: trimStr(b.countryIso) || undefined,
    message: trimStr(b.message) || undefined,
    source: SOURCES.includes(source) ? source : 'contact-form',
    pageUrl: trimStr(b.pageUrl) || undefined,
  };
}

let cachedClient = null;

/* Server-side Sanity client — uses SANITY_WRITE_TOKEN (never the VITE_
   frontend env), so this file must never be imported by anything that ends
   up in the browser bundle. Reads either SANITY_PROJECT_ID/SANITY_DATASET
   (this backend's own vars, per Phase 10B) or the SANITY_STUDIO_* names
   already used by studio/scripts/*.mjs, so one .env value works for both. */
export function getSanityWriteClient() {
  if (cachedClient) return cachedClient;

  const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
  const token = process.env.SANITY_WRITE_TOKEN;

  if (!projectId) throw new Error('Missing SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID) env var.');
  if (!token) throw new Error('Missing SANITY_WRITE_TOKEN env var.');

  cachedClient = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });
  return cachedClient;
}

/* Core entry point — takes plain data, returns a plain { status, body }
   result. No knowledge of HTTP request/response objects at all, so any
   adapter (Vercel, Netlify, Cloudflare, Express) can call this the same way. */
export async function handleContactSubmission({body, source, userAgent, pageUrl, remoteip} = {}) {
  const validationErrors = validateContactPayload({...body, pageUrl: body?.pageUrl || pageUrl});
  if (validationErrors) {
    if (validationErrors._honeypot) {
      // Bots get a generic-looking success so they don't learn the honeypot
      // was detected — nothing is written to Sanity.
      return {status: 200, body: {ok: true, id: null}};
    }
    return {status: 400, body: {ok: false, error: 'validation_failed', fields: validationErrors}};
  }

  // Checked after the cheap field validation (no point spending a network
  // round-trip to Cloudflare on an obviously-malformed payload) but before
  // the Sanity write. Gracefully skipped entirely if TURNSTILE_SECRET_KEY
  // isn't configured yet — see api/_lib/turnstile.js for the full rationale.
  const turnstileResult = await verifyTurnstileToken(body?.turnstileToken, remoteip);
  if (!turnstileResult.ok) {
    console.error('contactSubmission: Turnstile verification failed:', turnstileResult.reason);
    return {status: 400, body: {ok: false, error: 'verification_failed'}};
  }

  const doc = {
    _id: `${LEAD_ID_PREFIX}${randomUUID()}`,
    _type: 'contactSubmission',
    ...sanitizeContactPayload(body, {source}),
    pageUrl: trimStr(body?.pageUrl) || trimStr(pageUrl) || undefined,
    status: 'new',
    createdAt: new Date().toISOString(),
    userAgent: trimStr(userAgent) || undefined,
  };

  let created;
  try {
    const client = getSanityWriteClient();
    created = await client.create(doc);
  } catch (err) {
    console.error('contactSubmission: Sanity write failed:', err.message || err);
    return {status: 500, body: {ok: false, error: 'server_error'}};
  }

  // Sanity is the source of truth and has already succeeded at this point —
  // the lead is safely stored. Email is a courtesy notification on top of
  // that, so a failure here must never undo the write or surface a raw
  // provider error to the visitor; it only gets logged server-side.
  try {
    const emailResult = await sendContactNotification({...doc, _id: created._id});
    if (!emailResult.ok) {
      console.error(
        'contactSubmission: email notification not sent:',
        emailResult.skipped ? emailResult.reason : (emailResult.error || `status ${emailResult.status}`),
      );
    }
  } catch (emailErr) {
    console.error('contactSubmission: email notification threw:', emailErr.message || emailErr);
  }

  return {status: 200, body: {ok: true, id: created._id}};
}
