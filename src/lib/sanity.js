import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

/* Read-only Sanity client for the frontend.
   No token here — VITE_ vars are inlined into the public bundle, so this
   client can only ever read published content via useCdn. Writes (Studio,
   the seed script) go through separate authenticated clients elsewhere. */
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source) {
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
