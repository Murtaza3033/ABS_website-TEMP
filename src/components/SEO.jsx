import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSiteSettings } from '../hooks/useCms';
import { locT } from '../lib/loc';
import { getSanityImageUrl } from '../lib/sanity';

/* Built-in site-wide defaults, used while Site Settings is loading or when
   the CMS is unreachable (Sanity → Site Settings: siteTitle, siteDescription,
   defaultOgImage). */
const SITE_NAME = 'Align Business Systems';
const DEFAULT_DESCRIPTION =
  'Align Business Systems — the ERP, HR, field-force and hospital management platforms growing businesses run their operations on.';

/* Only set if VITE_SITE_URL is configured (see .env) — canonical/og:url are
   skipped entirely otherwise rather than guessing a production domain. */
const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '');

/* Static 1200x630 share image (public/og-image.png, generated from the brand
   logo) for when neither the page nor Site Settings supplies one. */
const STATIC_OG_IMAGE_PATH = '/og-image.png';

/* The favicon the static files in public/ were generated from. Site Settings
   is seeded with that same image, so it only replaces the static icons once
   an editor uploads a different one (no second download of the same icon). */
const BUILTIN_FAVICON_ASSET = 'image-16c5e219e1d8e08ddab9958fc070e1477d52e4e3-512x512-png';

/* Scrapers need absolute og:image / twitter:image URLs: prefer the configured
   VITE_SITE_URL, else the origin the page is actually served from. */
function absoluteUrl(url) {
  if (!url || /^https?:\/\//i.test(url)) return url;
  const origin = SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  if (url.startsWith('//')) return `https:${url}`;
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
}

/* A favicon uploaded in Site Settings replaces the hrefs of index.html's
   static icon links (restored if it is removed again). */
function useCmsFavicon(favicon) {
  const ref = favicon?.asset?._ref;
  const custom = ref && ref !== BUILTIN_FAVICON_ASSET ? favicon : null;
  const small = getSanityImageUrl(custom, { width: 48, height: 48 });
  const touch = getSanityImageUrl(custom, { width: 180, height: 180 });
  useEffect(() => {
    document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]').forEach((link) => {
      if (!link.dataset.staticHref) link.dataset.staticHref = link.getAttribute('href');
      const next = small ? (link.rel === 'apple-touch-icon' ? touch : small) : link.dataset.staticHref;
      if (link.getAttribute('href') !== next) {
        link.setAttribute('href', next);
        if (small) link.removeAttribute('type');
      }
    });
  }, [small, touch]);
}

/* Reusable per-page <head> metadata via react-helmet-async (provider already
   wraps the app in main.jsx). Every value is optional and falls back safely:
   no prop -> Site Settings -> built-in default -> omitted (never guessed).
   Pages pass their singleton's `seo` through resolveSeo() with their built-in
   title/description as the fallback. */
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
  const { lang, t } = useLanguage();
  const location = useLocation();
  const { data: cmsSettings } = useSiteSettings();
  useCmsFavicon(cmsSettings?.favicon);

  const siteName = locT(cmsSettings?.siteTitle, lang, t) || SITE_NAME;
  // t() is identity in English; in Arabic it localizes any English copy that
  // reaches here untranslated (CMS fallbacks, the site-wide default).
  const pageTitle = title ? t(title) : '';
  // A page whose title is the site name (Home) shows it on its own.
  const fullTitle = pageTitle && pageTitle !== siteName ? `${pageTitle} | ${siteName}` : siteName;
  const desc = t(description || locT(cmsSettings?.siteDescription, lang, t) || DEFAULT_DESCRIPTION);
  const resolvedCanonical = canonical || (SITE_URL ? `${SITE_URL}${location.pathname}` : undefined);
  const defaultOgImage = getSanityImageUrl(cmsSettings?.defaultOgImage, { width: 1200, height: 630 });
  const resolvedOgImage = absoluteUrl(ogImage || defaultOgImage || STATIC_OG_IMAGE_PATH);
  const ogLocale = lang === 'ar' ? 'ar_AR' : 'en_US';

  return (
    <Helmet>
      <html lang={lang === 'ar' ? 'ar' : 'en'} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
      {resolvedCanonical ? <link rel="canonical" href={resolvedCanonical} /> : null}

      <meta property="og:site_name" content={siteName} />
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

/* Shared helper for CMS `seo` objects (every page singleton's `seo`, and
   product.seo): resolves the bilingual metaTitle/metaDescription + ogImage +
   canonical/noIndex down to the plain values <SEO> expects. Arabic falls back
   to the English value through the dictionary (locT), like the page copy. */
export function resolveSeo(seo, lang, t) {
  if (!seo) return {};
  return {
    title: locT(seo.metaTitle, lang, t) || undefined,
    description: locT(seo.metaDescription, lang, t) || undefined,
    ogImage: getSanityImageUrl(seo.ogImage, { width: 1200, height: 630 }) || undefined,
    canonical: seo.canonical || undefined,
    noIndex: Boolean(seo.noIndex),
  };
}
