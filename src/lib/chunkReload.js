/* Recovery for lazily-loaded code that fails to download — typically a
   visitor whose open tab predates a new deploy (old hashed chunk names are
   gone) or a network blip. A single full reload fetches the current
   index.html + chunk names and almost always fixes it; the sessionStorage
   timestamp stops a reload loop when the chunk is genuinely unavailable (the
   ErrorBoundary fallback with its manual "Reload" button shows instead). */

const KEY = 'alignChunkReloadAt';
const WINDOW_MS = 30000;

const CHUNK_ERROR_RE = /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Unable to preload CSS|ChunkLoadError|Loading (CSS )?chunk .* failed/i;

export function isChunkLoadError(err) {
  return Boolean(err && CHUNK_ERROR_RE.test(String(err.message || err)));
}

/* Reloads the page unless we already auto-reloaded in the last 30s.
   Returns true when a reload was triggered. */
export function reloadOnceForChunkError() {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < WINDOW_MS) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    return false; // no storage = no loop guard, so never auto-reload
  }
  window.location.reload();
  return true;
}
