import { useLanguage } from '../context/LanguageContext';

// EN / عربي pill. Rendered twice (desktop header bar + mobile menu), so the
// id is overridable to keep ids unique.
export default function LanguageToggle({ id = 'alignI18nToggle' }) {
  const { lang, setLang, t } = useLanguage();

  const wrap = {
    display: 'inline-flex', alignItems: 'center', gap: '2px', marginInlineStart: '10px',
    background: '#f2f6fc', border: '1px solid #e3e9f3', borderRadius: '999px', padding: '3px',
    fontFamily: 'Outfit,sans-serif', flexShrink: 0,
  };
  const base = {
    border: 'none', cursor: 'pointer', fontWeight: 700, padding: '6px 11px', borderRadius: '999px',
  };
  const on = { background: '#1a56db', color: '#fff' };
  const off = { background: 'transparent', color: '#5b6472' };

  return (
    <div id={id} role="group" aria-label={t('Language')} style={wrap}>
      <button
        type="button"
        lang="en"
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
        style={{ ...base, fontSize: '12px', ...(lang === 'en' ? on : off) }}
      >
        EN
      </button>
      <button
        type="button"
        lang="ar"
        aria-pressed={lang === 'ar'}
        onClick={() => setLang('ar')}
        style={{ ...base, fontSize: '13px', fontFamily: "'Cairo',sans-serif", ...(lang === 'ar' ? on : off) }}
      >
        عربي
      </button>
    </div>
  );
}
