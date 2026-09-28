/* Contact submission + generic field validation, shared by the Contact Us
   page and the site-wide SalesBot. */

// Field rules live in ./contactRules.js — the same module the API
// (api/_lib/contactSubmission.js) imports, so client and server can never
// drift. Re-exported here so existing imports keep working; use
// CONTACT_LIMITS.<field>.max for input maxLength attributes.
export {
  CONTACT_LIMITS,
  NAME_RE,
  EMAIL_RE,
  cleanName,
  validName,
  validEmail,
  validPhone,
  validCompany,
  validMessage,
  contactFieldErrors,
} from './contactRules.js';

/* Posts a Contact form submission to the /api/contact backend. Returns a plain
   { ok, id } or { ok: false, error, fields } — never throws, so callers don't
   need try/catch. No token/secret is ever sent from the browser; the write
   token lives only server-side in api/_lib/contactSubmission.js. */
export async function submitContact(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    let json = null;
    try { json = await res.json(); } catch { /* non-JSON response — treated as an error below */ }

    if (res.ok && json?.ok) return { ok: true, id: json.id };

    return {
      ok: false,
      error: json?.error === 'validation_failed'
        ? 'Please check the highlighted fields and try again.'
        : 'Something went wrong sending your message — please try again, or email us directly.',
      fields: json?.fields || null,
    };
  } catch {
    clearTimeout(timeout);
    return { ok: false, error: "We couldn't reach our server — please try again, or email us directly.", fields: null };
  }
}
