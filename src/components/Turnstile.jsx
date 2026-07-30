import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

/* Cloudflare Turnstile widget (Phase 10G).
   Renders with appearance: 'interaction-only' — invisible and taking zero
   layout space in the overwhelming majority of visits (the whole reason this
   mode exists), so it never changes any existing page's UI. A visible
   challenge only appears on the rare request Cloudflare's edge actually
   flags as needing interaction, which is expected/acceptable per the "gate,
   don't redesign" brief for this integration.

   Site key is a public value by Cloudflare's own design (meant to be
   embedded client-side) — unlike every other credential in this project,
   VITE_TURNSTILE_SITE_KEY is deliberately not a secret. */
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

let scriptPromise = null;
function loadTurnstileScript() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (window.turnstile) { resolve(window.turnstile); return; }
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.turnstile));
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/* Exposes getToken()/reset()/isConfigured() via ref. Callers MUST call
   reset() after every submit attempt (success or failure): a Turnstile token
   is single-use, so retrying with a stale token gets rejected by siteverify
   as "timeout-or-duplicate" rather than actually re-checked. */
const Turnstile = forwardRef(function Turnstile({ action }, ref) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const tokenRef = useRef('');

  useEffect(() => {
    if (!SITE_KEY) return undefined; // not configured yet — render nothing, never block the form
    let cancelled = false;

    loadTurnstileScript().then((turnstile) => {
      if (cancelled || !containerRef.current || !turnstile) return;
      widgetIdRef.current = turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        action: action || 'submit',
        appearance: 'interaction-only',
        callback: (token) => { tokenRef.current = token; },
        'error-callback': () => { tokenRef.current = ''; },
        'expired-callback': () => {
          // Tokens expire after ~5 minutes and can't be un-expired — reset
          // proactively so a fresh one is ready by the time the visitor
          // actually submits, without needing any action from them.
          tokenRef.current = '';
          if (widgetIdRef.current && window.turnstile) {
            try { window.turnstile.reset(widgetIdRef.current); } catch { /* noop */ }
          }
        },
      });
    }).catch(() => { /* script failed to load — getToken() stays '', server treats as no token */ });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* noop */ }
      }
    };
  }, [action]);

  useImperativeHandle(ref, () => ({
    getToken: () => tokenRef.current,
    reset: () => {
      tokenRef.current = '';
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.reset(widgetIdRef.current); } catch { /* noop */ }
      }
    },
    isConfigured: () => Boolean(SITE_KEY),
  }));

  if (!SITE_KEY) return null;
  return <div ref={containerRef} />;
});

export default Turnstile;
