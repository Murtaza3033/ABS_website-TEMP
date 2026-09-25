import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { tr, loadArabic, arabicReady } from '../lib/arabic';

/* Language state + a React-driven translator: components call t(text) and
   render the correct string directly. The only side effect is setting
   dir/lang on <html> (a document-level attribute React can't own) — the Cairo
   font, RTL mirroring and glyph-flip live in styles/i18n.css.
   The Arabic dictionary is lazy: `lang` only flips to 'ar' once it has loaded
   (main.jsx preloads it before first render for returning Arabic visitors). */
const LanguageContext = createContext({ lang: 'en', setLang: () => {}, t: (s) => s });

const LS = 'alignLang';

export function storedLang() {
  try { return localStorage.getItem(LS) || 'en'; } catch { return 'en'; }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const v = storedLang();
    return v === 'ar' && !arabicReady() ? 'en' : v;
  });
  const requested = useRef(lang);

  const setLang = (v) => {
    requested.current = v;
    try { localStorage.setItem(LS, v); } catch { /* ignore */ }
    if (v !== 'ar' || arabicReady()) { setLangState(v); return; }
    loadArabic()
      .then(() => { if (requested.current === 'ar') setLangState('ar'); })
      .catch(() => { /* chunk failed to load — stay in English */ });
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
