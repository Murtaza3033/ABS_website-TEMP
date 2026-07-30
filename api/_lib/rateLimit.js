/* Per-IP rate limiting for /api/contact (Phase 10G-B) — server-only, never
   imported by anything that ends up in the browser bundle.

   Uses Upstash Redis's REST API directly over fetch, no SDK: the only thing
   needed here is one pipelined INCR+EXPIRE call, which is a single POST with
   a Bearer token — the same "don't add a dependency for one simple call"
   reasoning already used for Resend (api/_lib/email.js) and Turnstile
   (api/_lib/turnstile.js).

   Fixed-window counter, not a sliding window: key is `contact:{ip}:{hourBucket}`,
   so it resets cleanly every hour rather than needing a more complex sorted-set
   scheme. Slightly less precise at window boundaries (a burst spanning the
   exact top of the hour could technically allow up to ~10 in a short window)
   but simple, cheap, and matches the brief's own suggested key format.

   Fails OPEN, not closed: unlike Turnstile (an active security gate once
   configured), rate limiting here is a defense-in-depth layer on top of
   Turnstile + honeypot + validation, not the primary gate. If Upstash itself
   is unreachable or misbehaves, the contact form must keep working — a
   caching-layer outage should never take down lead capture entirely. */

const LIMIT = 5;
const WINDOW_SECONDS = 60 * 60; // 1 hour
const KEY_TTL_SECONDS = WINDOW_SECONDS + 5 * 60; // a bit past the hour so a key never lingers indefinitely

/* Priority: cf-connecting-ip (set only when traffic actually passes through
   Cloudflare — most trustworthy, can't be spoofed past Cloudflare's edge),
   then x-forwarded-for (take the first/left-most entry — the original
   client, per the standard reverse-proxy convention; trusted here because
   the hosting platform, not the client, sets it), then x-real-ip (a
   narrower single-IP fallback some proxies use instead), then the raw
   socket address as a last resort. Deliberately never reads anything from
   the request body — a spoofed body field must never influence this. */
export function getClientIp(headers = {}, socketRemoteAddress) {
  const cf = headers['cf-connecting-ip'];
  if (cf) return String(cf).trim();

  const xff = headers['x-forwarded-for'];
  if (xff) return String(xff).split(',')[0].trim();

  const xri = headers['x-real-ip'];
  if (xri) return String(xri).trim();

  return socketRemoteAddress || '';
}

function currentHourBucket() {
  return Math.floor(Date.now() / 1000 / WINDOW_SECONDS);
}

/* Returns { limited, skipped, count?, reason? }. Never throws — every
   failure mode (missing config, no IP, Upstash error, bad response) resolves
   to `limited: false` so a rate-limiter problem can never block a real
   submission. `skipped: true` means no actual check happened (logged as a
   warning server-side so it's visible in logs without being visitor-facing). */
export async function checkRateLimit(ip) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('rateLimit: UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN not configured — skipping rate limiting (local dev default).');
    return {limited: false, skipped: true, reason: 'not_configured'};
  }
  if (!ip) {
    console.warn('rateLimit: no client IP available — skipping rate limiting for this request.');
    return {limited: false, skipped: true, reason: 'no_ip'};
  }

  const key = `contact:${ip}:${currentHourBucket()}`;

  try {
    // Upstash's REST "pipeline" endpoint runs both commands atomically in one
    // request, avoiding a race between a separate INCR and EXPIRE call.
    const res = await fetch(`${url.replace(/\/+$/, '')}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, String(KEY_TTL_SECONDS)],
      ]),
    });

    if (!res.ok) {
      console.warn(`rateLimit: Upstash request failed (HTTP ${res.status}) — failing open.`);
      return {limited: false, skipped: true, reason: `upstash_http_${res.status}`};
    }

    const json = await res.json().catch(() => null);
    const count = Array.isArray(json) ? Number(json[0]?.result) : NaN;
    if (!Number.isFinite(count)) {
      console.warn('rateLimit: unexpected Upstash response shape — failing open.');
      return {limited: false, skipped: true, reason: 'bad_response'};
    }

    return {limited: count > LIMIT, skipped: false, count};
  } catch (err) {
    console.warn('rateLimit: Upstash request threw — failing open:', err.message || err);
    return {limited: false, skipped: true, reason: 'network_error'};
  }
}
