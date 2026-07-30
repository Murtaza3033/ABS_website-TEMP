/* POST /api/contact — Vercel-style adapter.
   ---------------------------------------------------------------------------
   Why Vercel-style, and why this is still platform-neutral:

   The hosting platform for this site hasn't been chosen yet (Netlify /
   Vercel / Cloudflare Pages Functions are all still on the table — see the
   Phase 10A plan). Rather than guess, all the actual logic — validation,
   sanitization, the Sanity write — lives in `api/_lib/contactSubmission.js`
   as plain functions with no req/res awareness at all. This file is the only
   platform-specific part, and it's intentionally thin (~30 lines of glue).

   Vercel's `(req, res)` shape was picked as the concrete example because:
     1. It's the closest of the three to a plain Node http handler, so it's
        the easiest to re-express as Express middleware later if a real
        server is ever wanted.
     2. `api/*.js` at the project root is a convention Vercel, Next.js, and
        many Vite+Express setups all recognize — self-documenting regardless
        of where this ends up deployed.
     3. Switching to Netlify later means writing a new
        `netlify/functions/contact.js` that parses `event.body`/`event.headers`
        instead of `req.body`/`req.headers` and returns
        `{ statusCode, headers, body: JSON.stringify(...) }` instead of
        calling `res.status().json()` — a small, mechanical adapter rewrite
        that touches NONE of `_lib/contactSubmission.js`. Cloudflare Pages
        Functions would be a similarly small `onRequestPost({ request, env })`
        adapter. None of that logic needs to be written until a platform is
        chosen.
   --------------------------------------------------------------------------- */

import {handleContactSubmission} from './_lib/contactSubmission.js';
import {corsHeaders, resolveAllowedOrigin} from './_lib/cors.js';
import {getClientIp, checkRateLimit} from './_lib/rateLimit.js';

export default async function handler(req, res) {
  const origin = req.headers.origin;
  const headers = corsHeaders(origin);
  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ok: false, error: 'method_not_allowed'});
    return;
  }

  // Reject cross-origin POSTs from anywhere not explicitly allowed, even
  // though the browser's own CORS enforcement already blocks the response
  // from being read — this stops the write from happening at all instead of
  // just hiding the result.
  if (origin && !resolveAllowedOrigin(origin)) {
    res.status(403).json({ok: false, error: 'origin_not_allowed'});
    return;
  }

  // Rate limit before parsing/touching the body at all — a spamming IP gets
  // rejected as cheaply as possible, before honeypot/Turnstile/Sanity/email
  // ever run (Phase 10G-B).
  const remoteip = getClientIp(req.headers, req.socket?.remoteAddress);
  const rateLimitResult = await checkRateLimit(remoteip);
  if (rateLimitResult.limited) {
    res.status(429).json({ok: false, error: 'rate_limited'});
    return;
  }

  const body = typeof req.body === 'string' ? safeJsonParse(req.body) : req.body;
  if (!body) {
    res.status(400).json({ok: false, error: 'validation_failed', fields: {_body: 'Invalid JSON body.'}});
    return;
  }

  const result = await handleContactSubmission({
    body,
    source: body.source,
    userAgent: req.headers['user-agent'],
    pageUrl: body.pageUrl || req.headers.referer,
    remoteip,
  });

  res.status(result.status).json(result.body);
}

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
