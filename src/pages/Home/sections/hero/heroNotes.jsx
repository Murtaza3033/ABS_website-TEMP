import { Fragment } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { locLines } from '../../../../lib/loc';

/* Hand-drawn hero notes, editable in Sanity (product → "Home page hero" →
   "Hero hand-drawn notes"; entry i replaces this product's note i). Returns
   note(i, 'text' | 'sub', fallbackLines) → the note's lines joined with <br />,
   using the built-in English lines (translated for Arabic) when the CMS entry
   or field is empty. Positions and arrows stay in each mockup. */
export function useHeroNote(notes) {
  const { t, lang } = useLanguage();
  return (i, field, fallback) => {
    const entry = Array.isArray(notes) ? notes[i] : null;
    return locLines(entry?.[field], lang, t, fallback).map((line, k) => (
      <Fragment key={k}>{k > 0 && <br />}{line}</Fragment>
    ));
  };
}
