/* Helpers for CMS headings that write part of the text in blue handwriting.

   headWords(): a heading as words for the staggered word-by-word reveal. The
   highlight phrase (if it occurs in the heading) stays one entry flagged
   `hl`, and characters glued to it — the full stop in "forward." — are kept
   on that entry as `pre` / `post`, so they sit inside the same word span.
   Words are split on single spaces, so a doubled space keeps an empty word
   (the same gap the built-in Arabic headings have where a word has no
   translation). */
export function headWords(heading, highlight) {
  if (!heading) return [];
  const MARK = '\u0000'; // placeholder for the highlight while splitting
  const at = highlight ? heading.indexOf(highlight) : -1;
  const src = at < 0 ? heading : `${heading.slice(0, at)}${MARK}${heading.slice(at + highlight.length)}`;
  return src.trimEnd().split(' ').map((w) => {
    const m = w.indexOf(MARK);
    return m < 0 ? { w } : { w: highlight, hl: true, pre: w.slice(0, m), post: w.slice(m + 1) };
  });
}

/* splitHighlight(): [before, highlight, after] for inline copy with one
   highlighted phrase; ['text', '', ''] when the phrase isn't in it. */
export function splitHighlight(text, highlight) {
  const at = text && highlight ? text.indexOf(highlight) : -1;
  if (at < 0) return [text || '', '', ''];
  return [text.slice(0, at), highlight, text.slice(at + highlight.length)];
}
