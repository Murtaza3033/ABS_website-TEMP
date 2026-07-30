/* CORS origin resolution — shared by every API endpoint (just `contact.js`
   for now, more later). Platform-agnostic: takes/returns plain strings, no
   assumptions about req/res shape, so it works the same under a Vercel
   handler, a Netlify handler, or a plain Express route. */

/* localhost:5173 is the plain `vite` dev server; localhost:3000 is where
   `vercel dev` serves the frontend + api/*.js together locally (Phase 10H) —
   both are needed since either can be the origin depending on how you're
   running things locally. 127.0.0.1 variants included since some setups
   (and some browsers) treat that as a distinct origin from `localhost`. */
const DEV_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

/* Returns the exact origin to echo back in `Access-Control-Allow-Origin`,
   or null if the request's origin isn't allowed (caller should then respond
   without that header, which the browser treats as a CORS denial — never
   fall back to '*' once ALLOWED_ORIGIN is set, per Phase 10B's security plan). */
export function resolveAllowedOrigin(requestOrigin) {
  if (!requestOrigin) return null;
  if (DEV_ORIGINS.includes(requestOrigin)) return requestOrigin;

  const configured = (process.env.ALLOWED_ORIGIN || '').replace(/\/+$/, '');
  if (configured && requestOrigin === configured) return requestOrigin;

  return null;
}

export function corsHeaders(requestOrigin) {
  const allowed = resolveAllowedOrigin(requestOrigin);
  if (!allowed) return {};
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}
