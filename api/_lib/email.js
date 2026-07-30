/* Email notification support (Phase 10E) — server-only, never imported by
   anything that ends up in the browser bundle.

   Why plain `fetch` to Resend's HTTP API instead of the `resend` npm
   package: the entire API surface needed here is one POST request with a
   JSON body and a Bearer token. The official SDK is a thin wrapper around
   exactly that `fetch` call — pulling it in as a dependency buys nothing
   for a single-endpoint use case, adds a package to audit/update, and adds
   to the serverless function's cold-start bundle size for no real benefit.
   If richer Resend features are needed later (templates, batch sending,
   webhooks), reconsider the SDK then. */

const RESEND_API_URL = 'https://api.resend.com/emails';

/* Generic transport — reusable for any future email, not just contact
   notifications. Never throws; always returns a plain result object. */
export async function sendEmail({to, from, subject, text, html, replyTo}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {ok: false, skipped: true, reason: 'RESEND_API_KEY not configured'};
  }
  if (!from) {
    return {ok: false, skipped: true, reason: 'CONTACT_FROM_EMAIL not configured'};
  }
  if (!to) {
    return {ok: false, skipped: true, reason: 'no recipient configured'};
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        text,
        html,
        ...(replyTo ? {reply_to: replyTo} : {}),
      }),
    });

    if (!res.ok) {
      // Resend's error body is JSON like { message, name }; never log the
      // Authorization header or the API key itself.
      const errText = await res.text().catch(() => '');
      return {ok: false, status: res.status, error: errText.slice(0, 300)};
    }

    const json = await res.json().catch(() => ({}));
    return {ok: true, id: json.id};
  } catch (err) {
    return {ok: false, error: err.message || 'network_error'};
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

const CAREERS_REASON = 'Careers';
const PARTNERSHIP_REASON = 'Partnership';
const DEMO_REASON = 'Book a demo';

/* Reason -> recipient. Careers goes to TALENT_EMAIL (a hiring inbox, not
   sales). Partnership goes to SALES_EMAIL — business-development /
   partnership enquiries are a growth topic sales/BD teams typically own,
   not a customer-support one, so SUPPORT_EMAIL is deliberately not used
   here (kept configured for a future routing rule if one is ever needed).
   Everything else (Book a demo, Product question, Something else) also
   goes to SALES_EMAIL. If the specific recipient env var isn't set, falls
   back to DEFAULT_NOTIFY_EMAIL, then to SALES_EMAIL as a last resort. */
function resolveRecipient(reason) {
  const sales = process.env.SALES_EMAIL;
  const talent = process.env.TALENT_EMAIL;
  const fallback = process.env.DEFAULT_NOTIFY_EMAIL || sales;

  if (reason === CAREERS_REASON) return talent || fallback;
  if (reason === PARTNERSHIP_REASON) return sales || fallback;
  return sales || fallback;
}

function buildSubject(doc) {
  if (doc.source === 'salesbot') return `New SalesBot lead — ${doc.name}`;
  if (doc.reason === DEMO_REASON) return `New demo request — ${doc.name}`;
  return `New enquiry — ${doc.name} (${doc.reason || 'General'})`;
}

function buildBody(doc) {
  const rows = [
    ['Name', doc.name],
    ['Email', doc.email],
    ['Company', doc.company],
    ['Phone', doc.phone],
    ['Reason', doc.reason],
    ['Product', doc.product],
    ['Source', doc.source],
    ['Message', doc.message],
    ['Page URL', doc.pageUrl],
    ['Sanity document ID', doc._id],
    ['Submitted at', doc.createdAt],
  ].filter(([, value]) => value);

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  const html = `<table cellpadding="4" cellspacing="0">${rows
    .map(([label, value]) => `<tr><td><b>${escapeHtml(label)}</b></td><td>${escapeHtml(value)}</td></tr>`)
    .join('')}</table>`;

  return {text, html};
}

/* Builds and sends the notification email for a just-created contactSubmission
   doc. `doc` must include `_id` (the Sanity document ID) and `createdAt`.
   Never throws — callers should still treat a failed/skipped result as
   non-fatal, since the lead is already safely stored in Sanity by this point. */
export async function sendContactNotification(doc) {
  const to = resolveRecipient(doc.reason);
  const from = process.env.CONTACT_FROM_EMAIL;
  const {text, html} = buildBody(doc);

  return sendEmail({
    to,
    from,
    subject: buildSubject(doc),
    text,
    html,
    replyTo: doc.email,
  });
}
