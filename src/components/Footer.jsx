import { useState, useEffect, useRef } from 'react';
import SmartLink from './SmartLink';
import { useLanguage } from '../context/LanguageContext';
import { useSiteSettings, useFooterContent } from '../hooks/useCms';
import { loc } from '../lib/loc';
import { getSanityImageUrl } from '../lib/sanity';
import { buildFooterIndex, footerColumnHeading, footerLinkLabel, footerLinkHref } from '../lib/navAdapters';
import logo from '../assets/images/logos/logo-1783092411267.png';

export default function Footer() {
  const { t, lang } = useLanguage();
  const { data: cmsSettings } = useSiteSettings();
  const { data: cmsFooter } = useFooterContent();
  const footerIndex = buildFooterIndex(cmsFooter);
  const fh = (key, fallbackText) => footerColumnHeading(footerIndex, key, lang, t, fallbackText);
  const fl = (key, fallbackText) => footerLinkLabel(footerIndex, key, lang, t, fallbackText);
  const fr = (key, fallbackHref) => footerLinkHref(footerIndex, key, fallbackHref);
  const logoSrc = getSanityImageUrl(cmsSettings?.logo, { width: 240 }) || logo;
  const logoAlt = loc(cmsSettings?.logo?.alt, lang) || 'Align Business Systems';
  const lede = loc(cmsSettings?.siteDescription, lang) || t("We build the ERP, HR and field-force platforms growing businesses run their operations on — designed, built and supported in-house.");
  const address = loc(cmsSettings?.address, lang) || t('Karachi, Pakistan');
  const email = cmsSettings?.email || 'info@alignbsystems.com';
  const phone = cmsSettings?.phone || '+92 21 111 254 265';
  const socialByPlatform = {};
  (cmsSettings?.socialLinks || []).forEach((s) => { if (s?.platform && s?.url) socialByPlatform[s.platform] = s.url; });
  const socialUrl = (platform, fallback) => socialByPlatform[platform] || fallback;
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
              <div><span className="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg></span>{t("Mon – Fri  |  9:00 AM – 6:00 PM PKT")}</div>
            </div>
            <div className="ft-social-h">{t('Follow us')}</div>
            <div className="ft-social">
              <SmartLink href={socialUrl('linkedin', 'https://www.linkedin.com/company/align-business-systems')} target="_blank" rel="noopener" aria-label="LinkedIn"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.06 3.77-2.06 4 0 4.75 2.65 4.75 6.1V21H20v-5.4c0-1.3 0-2.95-1.8-2.95s-2.08 1.4-2.08 2.85V21H9z"></path></svg></SmartLink>
            </div>
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
            </div>
          </div>

          <div>
            <div className="ft-col-h">{fh('products', 'Products')}</div><div className="ft-col-rule"></div>
            <div className="ft-links">
              <SmartLink href={fr('businessflo', '/products/businessflo')}>{fl('businessflo', 'Businessflo')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('peoplenest', '/products/peoplenest')}>{fl('peoplenest', 'PeopleNest')} <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href={fr('field-force', '/products/pharmafieldflo')}>{fl('field-force', 'Field Force')} <span className="arw">&rarr;</span></SmartLink>
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
            </div>
          </div>
    
          
          <div className="ft-get">
            <div className="ft-col-h">{t("Get Started")}</div><div className="ft-col-rule"></div>
            <p>{t("See Align in action and discover how we can transform your operations.")}</p>
            <SmartLink href="/contact-us.html" className="g-cta">{t('Book a Demo')} &rarr;</SmartLink>
            <div className="ft-support">
              <div className="row">
                <span className="badge"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"></path><path d="M21 14v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 1z"></path><path d="M3 14v3a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 1z"></path></svg></span>
                <span><span style={{display: 'block', fontSize: '13px', fontWeight: '600', color: '#eaf0fb'}}>{t("Need Support?")}</span><span style={{display: 'block', fontSize: '12px', color: '#96a2ba'}}>{t("We're here to help.")}</span></span>
              </div>
              <SmartLink href="/contact-us.html" style={{display: 'inline-block', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: '#4b8bff'}}>{t("Visit Help Center →")}</SmartLink>
            </div>
          </div>
        </div>
    
        
        <div className="ft-feat">
          <div><span className="fi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"></path><path d="M9 12l2 2 4-4"></path></svg></span><span><span className="ft">{t("Built in-house")}</span><span className="fd">{t("End-to-end control and security.")}</span></span></div>
          <div><span className="fi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span><span><span className="ft">{t("Enterprise grade")}</span><span className="fd">{t("Reliable, secure & future-ready.")}</span></span></div>
          <div><span className="fi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg></span><span><span className="ft">{t("One connected platform")}</span><span className="fd">{t("Finance, people & field — working as one.")}</span></span></div>
          <div><span className="fi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"></path><path d="M17 6h6v6"></path></svg></span><span><span className="ft">{t("Real-time insights")}</span><span className="fd">{t("Decide faster with complete visibility.")}</span></span></div>
        </div>
    
        <div className="ft-bottom">
          <span>{copyrightText}</span>
          <div className="ft-legal">
            <SmartLink href="#">{t("Privacy Policy")}</SmartLink><span className="dot">&bull;</span>
            <SmartLink href="#">{t("Terms of Use")}</SmartLink><span className="dot">&bull;</span>
            <SmartLink href="#">{t("Security")}</SmartLink>
          </div>
          <span>{t("Enterprise software, built in-house.")}</span>
        </div>
      </div>
    </footer>
  );
}
