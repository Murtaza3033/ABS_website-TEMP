import { getSanityImageUrl } from './sanity';

/* CMS image sources without the double download.

   Pages render their built-in copy while the CMS query is in flight
   (placeholderData), so resolving an image as "Sanity URL, else static path"
   made every photo load twice: the static file first, then the Sanity copy
   once the query resolved. Instead, while the first answer for the query is
   still outstanding, no source is returned at all (callers keep the box /
   background, so nothing shifts); the static path is used only when the
   query failed or the CMS field is empty.

   `query` is the react-query result object of the query the image comes
   from (useAboutPage(), useTeam(), …). */
export function cmsWaiting(query) {
  if (!query || query.isError) return false;
  // First fetch (or its retry) still running: no real data yet.
  return (query.status === 'pending' || query.isPlaceholderData) && query.fetchStatus === 'fetching';
}

/* Returns pic(image, opts, fallback) -> URL string, or undefined while the
   query is still pending. `image` may be null to resolve a static-only path
   (built-in items rendered as placeholders). */
export function cmsPic(query) {
  const waiting = cmsWaiting(query);
  return (image, opts, fallback) => {
    const url = getSanityImageUrl(image, opts || {});
    if (url) return url;
    if (waiting) return undefined;
    return fallback || undefined;
  };
}

/* CSS background-image value for a possibly-missing URL. */
export const cssUrl = (src) => (src ? `url('${src}')` : 'none');
