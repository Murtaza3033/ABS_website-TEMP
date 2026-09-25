import { createImageUrlBuilder } from '@sanity/image-url';

/* Read-only Sanity access for the frontend: a plain GET against the public
   API CDN (the same request @sanity/client makes with useCdn), without
   shipping the full client to the browser. No token here — VITE_ vars are
   inlined into the public bundle, so this can only read published content.
   Writes (Studio, seed scripts, api/) use authenticated clients elsewhere. */
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

const QUERY_URL = `https://${projectId}.apicdn.sanity.io/v${apiVersion.replace(/^v/, '')}/data/query/${dataset}`;

/* Runs a GROQ query; params become `$name` search params (JSON-encoded, as
   the API expects). Resolves to the query `result`, rejects on HTTP errors. */
export async function sanityFetch(query, params = {}) {
  const search = new URLSearchParams({ query });
  for (const [key, value] of Object.entries(params)) search.append(`$${key}`, JSON.stringify(value));
  search.append('returnQuery', 'false');
  const res = await fetch(`${QUERY_URL}?${search}`);
  if (!res.ok) throw new Error(`Sanity query failed (${res.status})`);
  return (await res.json()).result;
}

const builder = createImageUrlBuilder({ projectId, dataset });

function urlFor(source) {
  return builder.image(source);
}

/* Safe URL resolver for a Sanity image field: returns null (never throws) when
   the field is empty/unpopulated, so callers can chain a static-path fallback
   with `getSanityImageUrl(doc.photo, opts) || fallbackPath`. */
export function getSanityImageUrl(image, { width, height, quality = 80 } = {}) {
  if (!image || !image.asset) return null;
  let b = urlFor(image);
  if (width) b = b.width(width);
  if (height) b = b.height(height);
  return b.quality(quality).auto('format').url();
}
