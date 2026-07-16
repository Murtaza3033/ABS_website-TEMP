import { createContext, useContext, useState, useEffect } from 'react';
import { applyLang } from '../lib/i18n';

const LanguageContext = createContext({ lang: 'en', setLang: () => {} });

const LS = 'alignLang';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(LS) || 'en'; } catch { return 'en'; }
  });

  const setLang = (v) => {
    try { localStorage.setItem(LS, v); } catch { /* ignore */ }
    setLangState(v);
  };

  // Apply direction + Arabic text layer globally whenever language changes.
  // Runs after render so the DOM (nav, current page) exists to translate.
  useEffect(() => {
    applyLang(lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
