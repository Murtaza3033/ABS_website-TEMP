import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import SmartLink from './SmartLink';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation, useSiteSettings } from '../hooks/useCms';
import { loc } from '../lib/loc';
import { getSanityImageUrl } from '../lib/sanity';
import { buildNavIndex, navLabel, navHref } from '../lib/navAdapters';
import logo from '../assets/images/logos/logo-1783092411267.png';

export default function Header() {
  const { t, lang } = useLanguage();
  const { data: cmsNav } = useNavigation();
  const { data: cmsSettings } = useSiteSettings();
  const nav = buildNavIndex(cmsNav);
  const nl = (key, fallbackText) => navLabel(nav, key, lang, t, fallbackText);
  const nh = (key, fallbackHref) => navHref(nav, key, fallbackHref);
  const logoSrc = getSanityImageUrl(cmsSettings?.logo, { width: 240 }) || logo;
  const logoAlt = loc(cmsSettings?.logo?.alt, lang) || 'Align Business Systems';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastY = useRef(0);
  // Peak/trough hysteresis (Schmitt-trigger style), not "reset the anchor on
  // every direction flip" — real wheel/trackpad scrolling isn't monotonic,
  // it has small reversals mixed into an otherwise consistent gesture (hand
  // tremor, momentum-correction ticks). An anchor that resets on *any* flip
  // gets re-armed by that noise and never accumulates past the threshold, so
  // the header could stay stuck hidden through a genuine scroll-up. Instead,
  // extremeY tracks the furthest point reached in the current direction and
  // only updates while still moving that way; direction only flips (and
  // fires the show/hide) once movement has come back more than the
  // threshold from that extreme, which noise alone can't trigger.
  const dirRef = useRef('none');
  const extremeY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setScrolled(y > 12);
      setShowTop(y > 600);
      setShowBottom(document.documentElement.scrollHeight - window.innerHeight - y > 600);
      // Auto-hide: scrolling down tucks the header away instead of pinning
      // it in place — but any upward scroll brings it straight back, so
      // reaching nav doesn't mean scrolling all the way back up to the top.
      if (!mobileOpen) {
        if (dirRef.current === 'none') {
          dirRef.current = y >= lastY.current ? 'down' : 'up';
          extremeY.current = y;
          if (dirRef.current === 'down' && y > 80) setNavHidden(true);
        } else if (dirRef.current === 'down') {
          if (y > extremeY.current) {
            extremeY.current = y;
            if (y > 80) setNavHidden(true);
          } else if (extremeY.current - y > 24) {
            dirRef.current = 'up';
            extremeY.current = y;
            setNavHidden(false);
          }
        } else {
          if (y < extremeY.current) {
            extremeY.current = y;
          } else if (y - extremeY.current > 24) {
            dirRef.current = 'down';
            extremeY.current = y;
            if (y > 80) setNavHidden(true);
          }
        }
      }
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen]);

  useEffect(() => { if (mobileOpen) setNavHidden(false); }, [mobileOpen]);

  // The burger (the menu's only close control) disappears above 1080px, so
  // growing/rotating the viewport past that breakpoint closes the menu.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1081px)');
    const onChange = () => { if (mq.matches) setMobileOpen(false); };
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Lock the page behind the open mobile menu. iOS ignores overflow:hidden on
  // the root, so pin <body> at the current offset instead, and restore the
  // exact scroll position on close/unmount.
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const y = window.scrollY;
    const b = document.body.style;
    const prev = { position: b.position, top: b.top, left: b.left, right: b.right, width: b.width };
    Object.assign(b, { position: 'fixed', top: `-${y}px`, left: '0', right: '0', width: '100%' });
    return () => {
      Object.assign(b, prev);
      window.scrollTo(0, y);
    };
  }, [mobileOpen]);

  /* Mega menus: desktop hover stays pure CSS (.nav-group:hover). On top of
     that, `openMenu` lets the trigger button toggle a menu (Enter/Space/click,
     reflected in aria-expanded) and CSS :focus-within opens it for keyboard
     focus. `closedMenu` force-hides a menu right after one of its items is
     used (or Esc) even while the pointer/focus is still inside it; it is
     cleared once the pointer leaves or focus moves out of that group. */
  const [openMenu, setOpenMenu] = useState(null);
  const [closedMenu, setClosedMenu] = useState(null);
  // Hover intent: leaving a group (e.g. moving diagonally from the trigger
  // toward the panel's far column) keeps it open for a short grace period so
  // the panel can be re-entered; crossing another trigger on the way only
  // switches menus if the pointer rests there (250ms).
  // Keyboard behaviour (:focus-within / openMenu) is unchanged.
  const [hoverMenu, setHoverMenu] = useState(null);
  const hoverTimer = useRef(null);
  useEffect(() => () => clearTimeout(hoverTimer.current), []);
  const location = useLocation();
  const burgerRef = useRef(null);

  // Route change closes any open menu (desktop mega + mobile).
  useEffect(() => { setOpenMenu(null); setHoverMenu(null); setMobileOpen(false); }, [location.pathname]);

  // Esc closes the mobile menu and returns focus to the burger.
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') { setMobileOpen(false); burgerRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const groupProps = (key) => ({
    className: `nav-group${openMenu === key ? ' open' : ''}${hoverMenu === key ? ' hover' : ''}${closedMenu === key ? ' closed' : ''}`,
    onMouseEnter: () => {
      clearTimeout(hoverTimer.current);
      // Another menu is open: switch only after a short pause, so a pointer
      // that merely crosses this trigger on its way into the open panel
      // (safe-triangle style) doesn't close it.
      if (hoverMenu && hoverMenu !== key) hoverTimer.current = setTimeout(() => setHoverMenu(key), 250);
      else setHoverMenu(key);
    },
    onMouseLeave: () => {
      if (openMenu === key) setOpenMenu(null);
      if (closedMenu === key) setClosedMenu(null);
      clearTimeout(hoverTimer.current);
      hoverTimer.current = setTimeout(() => setHoverMenu(null), 280);
    },
    onBlur: (e) => {
      if (e.currentTarget.contains(e.relatedTarget)) return;
      if (openMenu === key) setOpenMenu(null);
      if (closedMenu === key) setClosedMenu(null);
    },
    onKeyDown: (e) => {
      if (e.key !== 'Escape') return;
      setOpenMenu(null);
      setClosedMenu(key);
      setHoverMenu(null);
      e.currentTarget.querySelector('button.navlink')?.focus();
    },
    // Mouse clicks never park focus inside the group (so :focus-within can't
    // pin a menu open after the pointer leaves) — keyboard focus still works.
    onMouseDown: (e) => { if (e.target.closest('a, button')) e.preventDefault(); },
    onClick: (e) => {
      if (!e.target.closest('.mega-wrap a')) return;
      setOpenMenu(null);
      setClosedMenu(key);
      setHoverMenu(null);
      if (e.currentTarget.contains(document.activeElement)) document.activeElement.blur();
    },
  });

  const triggerProps = (key) => ({
    type: 'button',
    'aria-haspopup': 'true',
    'aria-expanded': openMenu === key,
    'aria-controls': `mega-${key}`,
    onClick: () => {
      if (openMenu === key) { setOpenMenu(null); setClosedMenu(key); }
      else { setOpenMenu(key); setClosedMenu(null); }
    },
  });

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${navHidden ? 'nav-hidden' : ''}`}>
        <div className="nav-inner">
          <SmartLink href={nh('home', '/index.html')} className="nav-logo">
            <img src={logoSrc} alt={logoAlt} width="228" height="152" />
          </SmartLink>

          <nav className="nav-desktop">
            <SmartLink href={nh('home', '/index.html')} data-navlink="index.html" className="navlink">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8"></path><path d="M5 10v10h14V10"></path></svg>
              {nl('home', 'Home')}
            </SmartLink>
      
            
            <div {...groupProps('company')}>
              <button className="navlink" {...triggerProps('company')}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"></path></svg>
                <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>{nl('company', 'Company')} <span className="chev">&#9660;</span></span>
              </button>
              <div className="mega-wrap" id="mega-company">
                <div className="mega">
                  <div>
                    <div className="mega-title">{t("About Align")}</div>
                    <SmartLink href={nh('about-us', '/about-us.html')} className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg></span><span><span className="t">{nl('about-us', 'About Us')}</span><span className="d">{t("Enterprise software, built in-house.")}</span></span></SmartLink>
                    <SmartLink href={nh('our-team', '/our-team.html')} className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span><span><span className="t">{nl('our-team', 'Our Team')}</span><span className="d">{t("Meet the people behind Align.")}</span></span></SmartLink>
                    <SmartLink href={nh('our-advisors', '/our-advisors.html')} className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"></path><path d="M9 12l2 2 4-4"></path></svg></span><span><span className="t">{nl('our-advisors', 'Our Advisors')}</span><span className="d">{t("Industry experts guiding our vision.")}</span></span></SmartLink>
                    <SmartLink href={nh('our-partners', '/our-partners.html')} className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 17l2 2 4-4"></path><path d="M2 12l4-4 4 4-4 4-4-4z"></path><path d="M14 12l4-4 4 4-4 4"></path></svg></span><span><span className="t">{nl('our-partners', 'Our Partners')}</span><span className="d">{t("Trusted collaborations that scale.")}</span></span></SmartLink>
                    <SmartLink href={nh('our-clients', '/our-clients.html')} className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"></path></svg></span><span><span className="t">{nl('our-clients', 'Our Clients')}</span><span className="d">{t("Businesses that grow with Align.")}</span></span></SmartLink>
                    <div className="mega-note"><span style={{color: 'var(--gold)', fontSize: '16px'}}>&#10022;</span><span><span style={{display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--ink)'}}>{t("Our purpose is simple")}</span><span style={{display: 'block', fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px'}}>{t("Build powerful systems. Empower growing businesses.")}</span></span></div>
                  </div>
                  <div>
                    <div className="mega-title">{t("Spotlight")}</div>
                    <div className="mega-spot"><div className="hand">{t("★ Built for growth.")}</div><p>{t("Align brings ERP, HR, field-force and hospital management together in one powerful platform.")}</p><SmartLink href="/about-us.html" style={{display: 'inline-block', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: 'var(--blue)'}}>{t("See how we help →")}</SmartLink></div>
                    <div className="mega-title muted" style={{margin: '20px 0 10px'}}>{t("Explore More")}</div>
                    <SmartLink href={nh('our-presence', '/industries.html')} className="mega-mini"><span className="mi"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15 15 0 0 1 0 20"></path><path d="M12 2a15 15 0 0 0 0 20"></path></svg></span><span style={{flex: '1', fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>{nl('our-presence', 'Our Presence')}</span><span style={{color: 'var(--faint)'}}>&rarr;</span></SmartLink>
                    <SmartLink href={nh('careers', '/careers.html')} className="mega-mini"><span className="mi"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path></svg></span><span style={{flex: '1', fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>{nl('careers', 'Careers')}</span><span style={{color: 'var(--faint)'}}>&rarr;</span></SmartLink>
                    <SmartLink href={nh('contact-us-flat', '/contact-us.html')} className="mega-mini"><span className="mi"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 5L2 7"></path></svg></span><span style={{flex: '1', fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>{nl('contact-us-flat', 'Contact Us')}</span><span style={{color: 'var(--faint)'}}>&rarr;</span></SmartLink>
                  </div>
                </div>
              </div>
            </div>
      
            
            <div {...groupProps('products')}>
              <button className="navlink" {...triggerProps('products')}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>{nl('products', 'Products')} <span className="chev">&#9660;</span></span>
              </button>
              <div className="mega-wrap" id="mega-products">
                <div className="mega">
                  <div>
                    <div className="mega-title">{t("Our Products")}</div>
                    <SmartLink href={nh('businessflo', '/products/businessflo')} className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h8"></path></svg></span><span><span className="t">{nl('businessflo', 'Businessflo')}</span><span className="d">{t("Automate approvals, workflows and operations.")}</span></span></SmartLink>
                    <SmartLink href={nh('peoplenest', '/products/peoplenest')} className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span><span><span className="t">{nl('peoplenest', 'PeopleNest')}</span><span className="d">{t("Streamline HR, payroll and employees.")}</span></span></SmartLink>
                    <SmartLink href={nh('field-force', '/products/pharmafieldflo')} className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><rect x="7" y="11" width="3" height="6"></rect><rect x="12" y="7" width="3" height="10"></rect><rect x="17" y="13" width="3" height="4"></rect></svg></span><span><span className="t">{nl('field-force', 'Field Force')}</span><span className="d">{t("Plan, track and optimize field activities in real time.")}</span></span></SmartLink>
                    <SmartLink href={nh('hmsflo', '/products/hmsflo')} className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M5 21V8l7-5 7 5v13"></path><path d="M12 9v6"></path><path d="M9 12h6"></path></svg></span><span><span className="t">{nl('hmsflo', 'HMSflo')}</span><span className="d">{t("Run OPD, admissions, pharmacy, lab and billing.")}</span></span></SmartLink>
                  </div>
                  <div>
                    <div className="mega-title">{t("Spotlight")}</div>
                    <div className="mega-spot"><div className="hand">{t("✦ One platform.")}</div><p>{t("All Align products are built to work together — so your business stays connected.")}</p><SmartLink href="/products" style={{display: 'inline-block', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: 'var(--blue)'}}>{t("Explore all products →")}</SmartLink></div>
                  </div>
                </div>
              </div>
            </div>
      
            
            <div {...groupProps('resources')}>
              <button className="navlink" {...triggerProps('resources')}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h8"></path></svg>
                <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>{nl('resources', 'Resources')} <span className="chev">&#9660;</span></span>
              </button>
              <div className="mega-wrap" id="mega-resources">
                <div className="mega mega--narrow">
                  <div>
                    <div className="mega-title">{t("Resources")}</div>
                    <SmartLink href={nh('events', '/events.html')} className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg></span><span><span className="t">{nl('events', 'Events')}</span><span className="d">{t("Where Align shows up in the industry.")}</span></span></SmartLink>
                    <SmartLink href={nh('careers', '/careers.html')} className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path></svg></span><span><span className="t">{nl('careers', 'Careers')}</span><span className="d">{t("Build the systems businesses run on.")}</span></span></SmartLink>
                    <SmartLink href={nh('case-studies', '/our-clients.html')} className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></span><span><span className="t">{nl('case-studies', 'Case Studies')}</span><span className="d">{t("Real stories from real clients.")}</span></span></SmartLink>
                    <SmartLink href={nh('help-center', '/contact-us.html')} className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg></span><span><span className="t">{nl('help-center', 'Help Center')}</span><span className="d">{t("Guidance and support when you need it.")}</span></span></SmartLink>
                  </div>
                  <div>
                    <div className="mega-title">{t("Spotlight")}</div>
                    <div className="mega-spot"><div className="hand">{t("★ Meet us out there.")}</div><p>{t("See where Align shows up — exhibitions, talks and the teams behind it.")}</p><SmartLink href="/events.html" style={{display: 'inline-block', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: 'var(--blue)'}}>{t("View events →")}</SmartLink></div>
                    <SmartLink href="/careers.html" className="mega-mini" style={{marginTop: '14px'}}><span className="mi"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path></svg></span><span style={{flex: '1', fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>{t('Join the team')}</span><span style={{color: 'var(--faint)'}}>&rarr;</span></SmartLink>
                  </div>
                </div>
              </div>
            </div>
      
            <SmartLink href={nh('our-presence', '/industries.html')} data-navlink="industries.html" className="navlink"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>{nl('our-presence', 'Our Presence')}</SmartLink>
            <SmartLink href={nh('about-us', '/about-us.html')} data-navlink="about-us.html" className="navlink"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>{nl('about-us', 'About Us')}</SmartLink>
            <SmartLink href={nh('clients-flat', '/our-clients.html')} data-navlink="our-clients.html" className="navlink"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>{nl('clients-flat', 'Clients')}</SmartLink>
            <SmartLink href={nh('contact-us-flat', '/contact-us.html')} data-navlink="contact-us.html" className="navlink"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 5L2 7"></path></svg>{nl('contact-us-flat', 'Contact Us')}</SmartLink>
          </nav>

          <div className="nav-actions">
            <span className="nav-sep"></span>
            <LanguageToggle />
              <SmartLink href="/contact-us.html" className="btn-cta">{t('Book a Demo')} <span>&rarr;</span></SmartLink>
          </div>
      
          <button ref={burgerRef} type="button" className={`nav-burger ${mobileOpen ? 'open' : ''}`} aria-label={t('Menu')} aria-expanded={mobileOpen} aria-controls="navMobile" onClick={() => setMobileOpen(o => !o)}><span></span><span></span><span></span></button>
        </div>
      
        <div id="navMobile" className={`nav-mobile ${mobileOpen ? 'open' : ''}`} onClick={(e) => { if (e.target.closest('a')) setMobileOpen(false); }}>
          <div className="grp">{nl('company', 'Company')}</div>
          <SmartLink href={nh('home', '/index.html')} className="strong">{nl('home', 'Home')}</SmartLink>
          <SmartLink href={nh('our-team', '/our-team.html')}>{nl('our-team', 'Our Team')}</SmartLink>
          <SmartLink href={nh('our-advisors', '/our-advisors.html')}>{nl('our-advisors', 'Our Advisors')}</SmartLink>
          <SmartLink href={nh('our-partners', '/our-partners.html')}>{nl('our-partners', 'Our Partners')}</SmartLink>
          <div className="grp">{nl('products', 'Products')}</div>
          <SmartLink href={nh('businessflo', '/products/businessflo')}>{nl('businessflo', 'Businessflo')}</SmartLink>
          <SmartLink href={nh('peoplenest', '/products/peoplenest')}>{nl('peoplenest', 'PeopleNest')}</SmartLink>
          <SmartLink href={nh('field-force', '/products/pharmafieldflo')}>{nl('field-force', 'Field Force')}</SmartLink>
          <SmartLink href={nh('hmsflo', '/products/hmsflo')}>{nl('hmsflo', 'HMSflo')}</SmartLink>
          <div className="grp">{nl('resources', 'Resources')}</div>
          <SmartLink href={nh('events', '/events.html')}>{nl('events', 'Events')}</SmartLink>
          <SmartLink href={nh('careers', '/careers.html')}>{nl('careers', 'Careers')}</SmartLink>
          <hr />
          <SmartLink href={nh('our-presence', '/industries.html')} className="strong">{nl('our-presence', 'Our Presence')}</SmartLink>
          <SmartLink href={nh('about-us', '/about-us.html')} className="strong">{nl('about-us', 'About Us')}</SmartLink>
          <SmartLink href={nh('clients-flat', '/our-clients.html')} className="strong">{nl('clients-flat', 'Clients')}</SmartLink>
          <SmartLink href={nh('contact-us-flat', '/contact-us.html')} className="strong">{nl('contact-us-flat', 'Contact Us')}</SmartLink>
          <div className="m-lang"><LanguageToggle id="alignI18nToggleMobile" /></div>
          <SmartLink href="/contact-us.html" className="m-cta">{t("Book a Demo →")}</SmartLink>
        </div>
      </header>

      {/* Floating scroll controls, each in its own landmark (axe "region").
          They are hidden (visibility) when there is nowhere to scroll, so they
          sit where the Tab order meets them while shown: "Scroll to bottom"
          right after the header (shown near the top), "Back to top" portalled
          to the end of <body> (shown near the bottom, after the footer). */}
      <aside aria-label={t('Scroll to bottom')}>
        <button className={`scroll-bottom ${showBottom ? 'show' : ''}`} aria-label={t('Scroll to bottom')} onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"></path><path d="M19 12l-7 7-7-7"></path></svg></button>
      </aside>
      {createPortal(
        <aside aria-label={t('Back to top')}>
          <button className={`scroll-top ${showTop ? 'show' : ''}`} aria-label={t('Back to top')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"></path><path d="M5 12l7-7 7 7"></path></svg></button>
        </aside>,
        document.body,
      )}
    </>
  );
}
