import { useLanguage } from '../context/LanguageContext';
import { useSiteSettings } from './useCms';
import { locT } from '../lib/loc';
import { FALLBACK_CONTACT, FALLBACK_DEPT, SOCIAL_LABELS, isRealSocialUrl, telHref } from '../lib/contactInfo';

/* Company contact details from Sanity → Site Settings, localized, with the
   built-in copy (lib/contactInfo.js) for anything empty or while the CMS is
   unreachable. One source for the Contact page, footer, chat assistant and
   Careers page, so a single edit updates them all.

   departments: [{ key, name, email, phones: [{ display, tel }], icon }]
   dept(key):   one department (CMS, else built-in), e.g. dept('careers').email
   socials:     [{ platform, url, label }] — only links with a real profile URL */
export function useContactInfo() {
  const { t, lang } = useLanguage();
  const { data: s } = useSiteSettings();
  const F = FALLBACK_CONTACT;
  const tx = (v, fallback) => locT(v, lang, t) || t(fallback);

  const cmsDepts = (s?.departments || []).filter((d) => d?.key);
  const fromCms = cmsDepts.length > 0;
  const departments = (fromCms ? cmsDepts : F.departments).map((d) => {
    const fb = FALLBACK_DEPT[d.key] || {};
    const phones = fromCms ? d.phones || [] : fb.phones;
    return {
      key: d.key,
      name: tx(d.name, fb.name || d.key),
      email: d.email || fb.email || '',
      phones: phones.filter(Boolean).map((p) => ({ display: p, tel: telHref(p) })),
      icon: d.icon || fb.icon || 'mail',
    };
  });
  const dept = (key) => departments.find((d) => d.key === key)
    || { key, name: t(FALLBACK_DEPT[key]?.name || key), email: FALLBACK_DEPT[key]?.email || '', phones: [], icon: 'mail' };

  const socials = (s?.socialLinks?.length ? s.socialLinks : F.socialLinks)
    .filter((l) => l?.platform && isRealSocialUrl(l.url))
    .map((l) => ({ platform: l.platform, url: l.url, label: SOCIAL_LABELS[l.platform] || l.platform }));

  return {
    email: s?.email || F.email,
    phone: s?.phone || F.phone,
    address: tx(s?.address, F.address),
    headOfficeAddress: tx(s?.headOfficeAddress, F.headOfficeAddress),
    officeHours: tx(s?.officeHours, F.officeHours),
    responseTimeLead: tx(s?.responseTimeLead, F.responseTimeLead),
    responseTime: tx(s?.responseTime, F.responseTime),
    // An editor may clear the note to hide it: once Site Settings has
    // loaded, an empty note stays empty.
    responseTimeNote: s ? locT(s.responseTimeNote, lang, t) : t(F.responseTimeNote),
    departments,
    dept,
    socials,
  };
}
