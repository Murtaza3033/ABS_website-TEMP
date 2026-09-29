import { Fragment, useState, useEffect, useRef } from 'react';
import SmartLink from './SmartLink';
import { useLanguage } from '../context/LanguageContext';
import { useSiteSettings, useFooterContent } from '../hooks/useCms';
import { loc } from '../lib/loc';
import { cmsPic } from '../lib/cmsImage';
import { useContactInfo } from '../hooks/useContactInfo';
import SocialIcon from './SocialIcon';
import { buildFooterIndex, footerColumnHeading, footerLinkLabel, footerLinkHref, cmsHref, cmsText, cmsExtras, isDeadHref } from '../lib/navAdapters';
import logo from '../assets/images/logos/logo-1783092411267.png';

const FEATURE_PATHS = {
  shield: <><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"></path><path d="M9 12l2 2 4-4"></path></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></>,
  layers: <><path d="M12 2 2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></>,
  trending: <><path d="M23 6l-9.5 9.5-5-5L1 18"></path><path d="M17 6h6v6"></path></>,
  check: <><circle cx="12" cy="12" r="10"></circle><path d="M8 12l3 3 5-6"></path></>,
  zap: <><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"></path></>,
};
const FeatureIcon = ({ name }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{FEATURE_PATHS[name] || FEATURE_PATHS.check}</svg>
);

/* Built-in footer copy: the fallback for Sanity → Footer. */
const FEATURES = [
  { icon: 'shield', title: 'Built in-house', text: 'End-to-end control and security.' },
  { icon: 'lock', title: 'Enterprise grade', text: 'Reliable, secure & future-ready.' },
  { icon: 'layers', title: 'One connected platform', text: 'Finance, people & field — working as one.' },
  { icon: 'trending', title: 'Real-time insights', text: 'Decide faster with complete visibility.' },
];
const LEGAL = [
  { key: 'privacy', label: 'Privacy Policy', href: '#' },
  { key: 'terms', label: 'Terms of Use', href: '#' },
  { key: 'security', label: 'Security', href: '#' },
];
// Link keys each built-in column already places (CMS links under other keys are appended).
const COLUMN_KEYS = {
  company: ['our-team', 'our-advisors', 'our-partners', 'careers', 'about-us', 'contact-us'],
  products: ['businessflo', 'peoplenest', 'field-force', 'hmsflo'],
  resources: ['events', 'insights', 'case-studies', 'blog', 'help-center'],
};

export default function Footer() {
  const { t, lang } = useLanguage();
  const settingsQuery = useSiteSettings();
  const cmsSettings = settingsQuery.data;
  const { data: cmsFooter } = useFooterContent();
  const footerIndex = buildFooterIndex(cmsFooter);
  const fh = (key, fallbackText) => footerColumnHeading(footerIndex, key, lang, t, fallbackText);
  const fl = (key, fallbackText) => footerLinkLabel(footerIndex, key, lang, t, fallbackText);
  const fr = (key, fallbackHref) => footerLinkHref(footerIndex, key, fallbackHref);
  const tx = (value, fallbackText) => cmsText(value, lang, t, fallbackText);
  const extraLinks = (colKey) => cmsExtras(footerIndex.columns[colKey]?.links, new Set(COLUMN_KEYS[colKey]), lang, t)
    .filter((x) => x.href)
    .map((x) => <SmartLink key={x.key} href={x.href}>{x.label} <span className="arw">&rarr;</span></SmartLink>);
  const gs = cmsFooter?.getStarted;
  const cmsFeatures = (cmsFooter?.features || []).filter((f) => f?.title || f?.text);
  const features = cmsFeatures.length
    ? cmsFeatures.map((f, i) => ({ key: f._key || i, icon: f.icon || FEATURES[i]?.icon, title: tx(f.title), text: tx(f.text) }))
    : FEATURES.map((f, i) => ({ ...f, key: i, title: t(f.title), text: t(f.text) }));
  // Legal links without a real URL yet ("#" / empty) are hidden, not dead.
  const legalLinks = (Array.isArray(cmsFooter?.legalLinks) ? cmsFooter.legalLinks : LEGAL)
    .filter((l) => !isDeadHref(l?.href))
    .map((l, i) => ({ key: l._key || l.key || i, label: tx(l.label), href: cmsHref(l.href, null) }))
    .filter((l) => l.label);
  // No src until Site Settings answers (lib/cmsImage.js): avoids loading the
  // built-in logo and then the Sanity copy; width/height keep the box.
  const logoSrc = cmsPic(settingsQuery)(cmsSettings?.logo, { width: 240 }, logo);
  const logoAlt = loc(cmsSettings?.logo?.alt, lang) || 'Align Business Systems';
  const lede = loc(cmsSettings?.siteDescription, lang) || t("We build the ERP, HR, field-force and hospital management platforms growing businesses run their operations on — designed, built and supported in-house.");
  // Address, email, phone, office hours and social links: Site Settings
  // (shared with the Contact page and the chat assistant).
  const { address, email, phone, officeHours, socials } = useContactInfo();
  const copyrightText = loc(cmsFooter?.copyrightText, lang) || t('© 2026 Align Business Systems. All rights reserved.');
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const scan = () => {
      const el = ref.current;
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.95) {
        setRevealed(true);
        window.removeEventListener('scroll', scan);
      }
    };
    window.addEventListener('scroll', scan, { passive: true });
    const t1 = setTimeout(scan, 60);
    const t2 = setTimeout(() => setRevealed(true), 1800);
    return () => { window.removeEventListener('scroll', scan); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <footer ref={ref} className={`site-footer ${revealed ? 'reveal' : ''}`}>
      <div className="ft-inner">
        <div className="ft-main">
          
          <div>
            <img className="ft-logo" src={logoSrc} width="228" height="152" loading="lazy" decoding="async" alt={logoAlt} />
            <p className="ft-lede">{lede}</p>
            <div className="ft-rule"></div>
            <div className="ft-contact">
              <div><span className="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></span>{address}</div>
              <SmartLink href={`mailto:${email}`}><span className="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 5L2 7"></path></svg></span>{email}</SmartLink>
              <div><span className="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.8.4 1.7.6 2.6.7a2 2 0 0 1 1.7 2z"></path></svg></span><bdi dir="ltr">{phone}</bdi></div>
              <div><span className="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg></span>{officeHours}</div>
            </div>
            {socials.length > 0 && (
              <>
                <div className="ft-social-h">{tx(cmsFooter?.followLabel, 'Follow us')}</div>
                <div className="ft-social">
                  {socials.map((l) => (
                    <SmartLink key={l.platform + l.url} href={l.url} target="_blank" rel="noopener" aria-label={l.label}><SocialIcon platform={l.platform} /></SmartLink>
                  ))}
                </div>
              </>
            )}
          </div>
    
          
          <div>
            <div className="ft-col-h">{fh('company', 'Company')}</div><div className="ft-col-rule"></div>
            <div className="ft-links">
              <SmartLink href={fr('our-team', '/our-team.html')}>{fl('our-team', 'Our Team')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('our-advisors', '/our-advisors.html')}>{fl('our-advisors', 'Our Advisors')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('our-partners', '/our-partners.html')}>{fl('our-partners', 'Our Partners')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('careers', '/careers.html')}>{fl('careers', 'Careers')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('about-us', '/about-us.html')}>{fl('about-us', 'About Us')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('contact-us', '/contact-us.html')}>{fl('contact-us', 'Contact Us')} <span className="arw">&rarr;</span></SmartLink>
              {extraLinks('company')}
            </div>
          </div>

          <div>
            <div className="ft-col-h">{fh('products', 'Products')}</div><div className="ft-col-rule"></div>
            <div className="ft-links">
              <SmartLink href={fr('businessflo', '/products/businessflo')}>{fl('businessflo', 'Businessflo')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('peoplenest', '/products/peoplenest')}>{fl('peoplenest', 'PeopleNest')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('field-force', '/products/pharmafieldflo')}>{fl('field-force', 'Field Force')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('hmsflo', '/products/hmsflo')}>{fl('hmsflo', 'HMSflo')} <span className="arw">&rarr;</span></SmartLink>
              {extraLinks('products')}
            </div>
          </div>

          <div>
            <div className="ft-col-h">{fh('resources', 'Resources')}</div><div className="ft-col-rule"></div>
            <div className="ft-links">
              <SmartLink href={fr('events', '/events.html')}>{fl('events', 'Events')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('insights', '#')}>{fl('insights', 'Insights')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('case-studies', '/our-clients.html')}>{fl('case-studies', 'Case Studies')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('blog', '#')}>{fl('blog', 'Blog')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('help-center', '/contact-us.html')}>{fl('help-center', 'Help Center')} <span className="arw">&rarr;</span></SmartLink>
              {extraLinks('resources')}
            </div>
          </div>
    
          
          <div className="ft-get">
            <div className="ft-col-h">{tx(gs?.heading, 'Get Started')}</div><div className="ft-col-rule"></div>
            <p>{tx(gs?.text, 'See Align in action and discover how we can transform your operations.')}</p>
            <SmartLink href={cmsHref(gs?.buttonHref, '/contact-us.html')} className="g-cta">{tx(gs?.buttonLabel, 'Book a Demo')} &rarr;</SmartLink>
            <div className="ft-support">
              <div className="row">
                <span className="badge"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"></path><path d="M21 14v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 1z"></path><path d="M3 14v3a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 1z"></path></svg></span>
                <span><span style={{display: 'block', fontSize: '13px', fontWeight: '600', color: '#eaf0fb'}}>{tx(gs?.supportTitle, 'Need Support?')}</span><span style={{display: 'block', fontSize: '12px', color: '#96a2ba'}}>{tx(gs?.supportText, "We're here to help.")}</span></span>
              </div>
              <SmartLink href={cmsHref(gs?.supportLinkHref, '/contact-us.html')} style={{display: 'inline-block', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: '#4b8bff'}}>{tx(gs?.supportLinkLabel, 'Visit Help Center →')}</SmartLink>
            </div>
          </div>
        </div>
    
        
        <div className="ft-feat">
          {features.map((f) => (
            <div key={f.key}><span className="fi"><FeatureIcon name={f.icon} /></span><span><span className="ft">{f.title}</span><span className="fd">{f.text}</span></span></div>
          ))}
        </div>

        <div className="ft-bottom">
          <span>{copyrightText}</span>
          {legalLinks.length > 0 && (
            <div className="ft-legal">
              {legalLinks.map((l, i) => (
                <Fragment key={l.key}>{i > 0 && <span className="dot">&bull;</span>}<SmartLink href={l.href}>{l.label}</SmartLink></Fragment>
              ))}
            </div>
          )}
          <span>{tx(cmsFooter?.tagline, 'Enterprise software, built in-house.')}</span>
        </div>
      </div>
    </footer>
  );
}
