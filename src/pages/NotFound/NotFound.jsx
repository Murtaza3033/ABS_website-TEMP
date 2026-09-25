import { Link, Navigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';
import { LEGACY_ROUTES } from '../../components/SmartLink';

/* Catch-all route. Old static-site URLs typed directly or from backlinks
   (e.g. /about-us.html) redirect to their clean route; anything else gets a
   minimal on-brand "Page not found". */
export default function NotFound() {
  const { pathname, search, hash } = useLocation();
  const { t } = useLanguage();

  const legacy = LEGACY_ROUTES[pathname];
  if (legacy) return <Navigate to={`${legacy}${search}${hash}`} replace />;

  return (
    <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '140px 32px', textAlign: 'center' }}>
      <SEO title={t('Page not found')} noIndex />
      <div style={{ maxWidth: '560px' }}>
        <span className="eyebrow">404</span>
        <h1 className="h1">{t('Page not found')}</h1>
        <p className="lede" style={{ margin: '16px auto 0' }}>{t('The page you’re looking for doesn’t exist or has moved.')}</p>
        <Link to="/" className="btn-cta" style={{ marginTop: '28px' }}>{t('Back to home')}</Link>
      </div>
    </main>
  );
}
