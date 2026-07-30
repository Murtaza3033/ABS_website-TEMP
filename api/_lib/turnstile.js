/* Cloudflare Turnstile server-side verification (Phase 10G) — server-only,
   never imported by anything that ends up in the browser bundle.

   Two distinct failure philosophies, both deliberate:
   - TURNSTILE_SECRET_KEY unset -> treated as "not yet enabled": verification
     is skipped entirely (ok: true, skipped: true). Same graceful-degradation
     pattern as email in Phase 10E — the endpoint keeps working during local
     dev and before the Cloudflare dashboard widget exists.
   - TURNSTILE_SECRET_KEY set but the verify call itself fails (network
     error, non-2xx, non-JSON, or a genuine `success: false`) -> fails
     CLOSED (ok: false). Once configured, Turnstile is an active security
     gate, not a courtesy, per the canonical siteverify contract. */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(token, remoteip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return {ok: true, skipped: true, reason: 'TURNSTILE_SECRET_KEY not configured'};
  }
  if (!token) {
    return {ok: false, skipped: false, reason: 'missing_token'};
  }

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        secret,
        response: token,
        ...(remoteip ? {remoteip} : {}),
      }),
    });

    if (!res.ok) {
      return {ok: false, skipped: false, reason: `siteverify_http_${res.status}`};
    }

    const json = await res.json().catch(() => null);
    if (!json || typeof json.success !== 'boolean') {
      return {ok: false, skipped: false, reason: 'siteverify_bad_response'};
    }
    if (!json.success) {
      const codes = Array.isArray(json['error-codes']) ? json['error-codes'].join(',') : '';
      return {ok: false, skipped: false, reason: codes || 'siteverify_failed'};
    }

    return {ok: true, skipped: false};
  } catch (err) {
    // Network error reaching Cloudflare — fail closed, never open.
    return {ok: false, skipped: false, reason: err.message || 'network_error'};
  }
}
