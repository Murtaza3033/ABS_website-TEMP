import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { tr, loadArabic, arabicReady, ensureArabicFont } from '../i18n/translator';

/* Language state + a React-driven translator: components call t(text) and
   render the correct string directly. The only side effect is setting
   dir/lang on <html> (a document-level attribute React can't own) — the Cairo
   font, RTL mirroring and glyph-flip live in styles/i18n.css.
   The Arabic dictionary is lazy: `lang` only flips to 'ar' once it has loaded
   (main.jsx preloads it before first render for returning Arabic visitors,
   and index.html's inline boot script sets dir/lang before first paint). */
const LanguageContext = createContext({
  lang: 'en', setLang: () => {}, t: (s) => s, langLoading: false, langError: false,
});

const LS = 'alignLang';

export function storedLang() {
  try { return localStorage.getItem(LS) || 'en'; } catch { return 'en'; }
}

function persist(v) {
  try { localStorage.setItem(LS, v); } catch { /* ignore */ }
}

// Shown in both languages on purpose: it only appears when the Arabic
// dictionary itself failed to load, so t() can't translate it.
const LOAD_FAILED_MSG = "Arabic couldn't be loaded. Please check your connection and try again.";
const LOAD_FAILED_MSG_AR = 'تعذّر تحميل اللغة العربية. يُرجى التحقق من الاتصال والمحاولة مرة أخرى.';

const toastStyle = {
  position: 'fixed', insetInlineStart: '50%', bottom: '24px', transform: 'translateX(-50%)',
  zIndex: 10000, maxWidth: 'min(92vw, 440px)', padding: '12px 16px', borderRadius: '12px',
  background: '#0f1b33', color: '#fff', boxShadow: '0 10px 30px rgba(15,27,51,.25)',
  fontFamily: 'Outfit, system-ui, sans-serif', fontSize: '14px', lineHeight: 1.45, textAlign: 'center',
};

export function LanguageProvider({ children }) {
  // A returning Arabic visitor whose dictionary failed to load at boot
  // (main.jsx renders English anyway) starts in English with the notice shown;
  // alignLang stays 'ar' so the next page load retries automatically.
  const bootFailed = storedLang() === 'ar' && !arabicReady();
  const [lang, setLangState] = useState(() => (bootFailed ? 'en' : storedLang()));
  const [langLoading, setLangLoading] = useState(false);
  const [langError, setLangError] = useState(bootFailed);
  const requested = useRef(lang);

  const setLang = (v) => {
    requested.current = v;
    setLangError(false);
    if (v !== 'ar' || arabicReady()) {
      persist(v);
      setLangState(v);
      return;
    }
    // Only remember Arabic once it has actually loaded; a failure leaves the
    // visitor in English and the next toggle click retries with a fresh fetch.
    setLangLoading(true);
    loadArabic()
      .then(() => {
        if (requested.current !== 'ar') return;
        persist('ar');
        setLangState('ar');
      })
      .catch(() => {
        if (requested.current === 'ar') setLangError(true);
      })
      .finally(() => setLangLoading(false));
  };

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('lang', lang === 'ar' ? 'ar' : 'en');
    if (lang === 'ar') ensureArabicFont();
  }, [lang]);

  useEffect(() => {
    if (!langError) return undefined;
    const id = setTimeout(() => setLangError(false), 7000);
    return () => clearTimeout(id);
  }, [langError]);

  const t = (text) => tr(text, lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, langLoading, langError }}>
      {children}
      {langError ? (
        <div role="status" aria-live="polite" style={toastStyle}>
          <span lang="en">{LOAD_FAILED_MSG}</span>
          <br />
          <span lang="ar" dir="rtl" style={{ fontFamily: "'Cairo', system-ui, sans-serif" }}>{LOAD_FAILED_MSG_AR}</span>
        </div>
      ) : null}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
