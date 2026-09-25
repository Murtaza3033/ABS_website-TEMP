import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSiteSettings } from '../hooks/useCms';
import { loc } from '../lib/loc';
import { getSanityImageUrl } from '../lib/sanity';

const SITE_NAME = 'Align Business Systems';
const DEFAULT_DESCRIPTION =
  'Align Business Systems — the ERP, HR and field-force platforms growing businesses run their operations on.';

/* Only set if VITE_SITE_URL is configured (see .env) — canonical/og:url are
   skipped entirely otherwise rather than guessing a production domain. */
const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '');

/* Reusable per-page <head> metadata via react-helmet-async (provider already
   wraps the app in main.jsx). Every value is optional and falls back safely:
   no prop -> site-wide default -> omitted entirely (never a guessed value). */
export default function SEO({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  noIndex = false,
  type = 'website',
}) {
  const { lang } = useLanguage();
  const location = useLocation();
  const { data: cmsSettings } = useSiteSettings();

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const desc = description || DEFAULT_DESCRIPTION;
  const resolvedCanonical = canonical || (SITE_URL ? `${SITE_URL}${location.pathname}` : undefined);
  const defaultOgImage = getSanityImageUrl(cmsSettings?.logo, { width: 1200 });
  const resolvedOgImage = ogImage || defaultOgImage || undefined;
  const ogLocale = lang === 'ar' ? 'ar_AR' : 'en_US';

  return (
    <Helmet>
      <html lang={lang === 'ar' ? 'ar' : 'en'} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
      {resolvedCanonical ? <link rel="canonical" href={resolvedCanonical} /> : null}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || desc} />
      {resolvedCanonical ? <meta property="og:url" content={resolvedCanonical} /> : null}
      {resolvedOgImage ? <meta property="og:image" content={resolvedOgImage} /> : null}

      <meta name="twitter:card" content={resolvedOgImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || desc} />
      {resolvedOgImage ? <meta name="twitter:image" content={resolvedOgImage} /> : null}
    </Helmet>
  );
}

/* Shared helper for CMS `seo` objects (page.seo / product.seo): resolves the
   bilingual metaTitle/metaDescription + ogImage + canonical/noIndex down to
   the plain values <SEO> expects, so callers don't repeat this everywhere. */
export function resolveSeo(seo, lang) {
  if (!seo) return {};
  return {
    title: loc(seo.metaTitle, lang) || undefined,
    description: loc(seo.metaDescription, lang) || undefined,
    ogImage: getSanityImageUrl(seo.ogImage, { width: 1200 }) || undefined,
    canonical: seo.canonical || undefined,
    noIndex: Boolean(seo.noIndex),
  };
}
