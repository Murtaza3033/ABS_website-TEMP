import { createContext, useContext, useState, useEffect } from 'react';
import { tr } from '../lib/translations';

/* Language state + a React-driven translator. Replaces lib/i18n.js's
   MutationObserver + TreeWalker DOM-text-swap: components now call t(text) and
   render the correct string directly. The only side effect is setting
   dir/lang on <html> (a document-level attribute React can't own) — the Cairo
   font, RTL mirroring and glyph-flip live in styles/i18n.css. */
const LanguageContext = createContext({ lang: 'en', setLang: () => {}, t: (s) => s });

const LS = 'alignLang';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(LS) || 'en'; } catch { return 'en'; }
  });

  const setLang = (v) => {
    try { localStorage.setItem(LS, v); } catch { /* ignore */ }
    setLangState(v);
  };

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('lang', lang === 'ar' ? 'ar' : 'en');
  }, [lang]);

  const t = (text) => tr(text, lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
