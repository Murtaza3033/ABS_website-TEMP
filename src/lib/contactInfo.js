/* Company contact details — the built-in copy of what editors manage in
   Sanity → Site Settings (emails, phones, address, office hours, response
   time, social links). Used as the fallback whenever the CMS is empty or
   unreachable; see hooks/useContactInfo.js for the merged, localized view. */
export const FALLBACK_CONTACT = {
  email: 'info@alignbsystems.com',
  phone: '+92 21 111 254 265',
  address: 'Karachi, Pakistan',
  headOfficeAddress: 'Suite #404, Imperial Trade Tower 68-C, 7th Street Jami Commercial, Main Street 11, D.H.A. Phase 7, Karachi, 75500',
  officeHours: 'Mon – Fri  |  9:00 AM – 6:00 PM PKT',
  responseTimeLead: 'We typically reply within',
  responseTime: 'one business day',
  responseTimeNote: '(response time — pending confirmation)',
  departments: [
    { key: 'sales', name: 'Sales', email: 'sales@alignbsystems.com', phones: ['+92 317 3822206', '+92 317 3822207'], icon: 'mail' },
    { key: 'support', name: 'Support', email: 'support@alignbsystems.com', phones: ['+92 318 6944418'], icon: 'support' },
    { key: 'careers', name: 'Careers', email: 'talent@alignbsystems.com', phones: [], icon: 'careers' },
  ],
  socialLinks: [
    { platform: 'linkedin', url: 'https://www.linkedin.com/company/align-business-systems' },
  ],
};

export const FALLBACK_DEPT = Object.fromEntries(FALLBACK_CONTACT.departments.map((d) => [d.key, d]));

/* tel: link for a phone number as displayed ("+92 317 3822206"). */
export const telHref = (display) => `tel:${String(display).replace(/[^\d+]/g, '')}`;

/* A social link worth showing: an http(s) URL that points at an actual
   profile, not a bare-domain placeholder like "https://facebook.com". */
export function isRealSocialUrl(url) {
  try {
    const u = new URL(url);
    return /^https?:$/.test(u.protocol) && u.pathname.replace(/\/+$/, '') !== '';
  } catch {
    return false;
  }
}

export const SOCIAL_LABELS = {
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  twitter: 'X (Twitter)',
  bluesky: 'Bluesky',
  discord: 'Discord',
};
