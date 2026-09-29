import { Fragment, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import SmartLink from './SmartLink';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation, useSiteSettings } from '../hooks/useCms';
import { loc } from '../lib/loc';
import { cmsPic } from '../lib/cmsImage';
import { buildNavIndex, navLabel, navHref, cmsHref, cmsText, cmsExtras } from '../lib/navAdapters';
import NavIcon from './NavIcon';
import { MENUS, BUILTIN_TOP_KEYS } from './headerMenus';
import logo from '../assets/images/logos/logo-1783092411267.png';

export default function Header() {
  const { t, lang } = useLanguage();
  const { data: cmsNav } = useNavigation();
  const settingsQuery = useSiteSettings();
  const cmsSettings = settingsQuery.data;
  const nav = buildNavIndex(cmsNav);
  const nl = (key, fallbackText) => navLabel(nav, key, lang, t, fallbackText);
  const nh = (key, fallbackHref) => navHref(nav, key, fallbackHref);
  const tx = (value, fallbackText) => cmsText(value, lang, t, fallbackText);

  /* Mega menus: the built-in ones (headerMenus.js) with their CMS texts,
     plus CMS sub-items / menus the layout doesn't know, appended. */
  const subItems = (children, known) => cmsExtras(children, known, lang, t)
    .filter((x) => x.href)
    .map((x) => ({ key: x.key, label: x.label, href: x.href, icon: 'link', description: tx(x.item.description) }));
  const spotlightOf = (cms, fb = {}) => {
    const s = {
      title: tx(cms?.title, fb.title),
      text: tx(cms?.text, fb.text),
      linkLabel: tx(cms?.linkLabel, fb.linkLabel),
      href: cmsHref(cms?.href, fb.href || null),
    };
    return s.title || s.text ? s : null;
  };
  const builtinMenus = MENUS.map((m) => {
    const known = new Set(m.items.map((it) => it.key));
    const extras = subItems(nav[m.key]?.children, known);
    const items = [
      ...m.items.map((it) => ({ ...it, label: nl(it.key, it.label), href: nh(it.key, it.href), description: tx(nav[it.key]?.description, it.description) })),
      ...extras,
    ];
    const note = m.note ? { title: tx(nav[m.key]?.note?.title, m.note.title), text: tx(nav[m.key]?.note?.text, m.note.text) } : null;
    return {
      key: m.key,
      label: nl(m.key, m.label),
      icon: m.icon,
      narrow: m.narrow,
      menuTitle: tx(nav[m.key]?.menuTitle, m.menuTitle),
      items,
      mobileItems: [...items.filter((it) => m.mobile.includes(it.key)), ...extras],
      note,
      spotlight: spotlightOf(nav[m.key]?.spotlight, m.spotlight),
    };
  });
  const topExtras = cmsExtras(cmsNav?.items, BUILTIN_TOP_KEYS, lang, t);
  const extraMenus = topExtras
    .filter((x) => x.item.children?.length)
    .map((x) => {
      const items = subItems(x.item.children, new Set());
      return { key: x.key, label: x.label, icon: 'link', menuTitle: tx(x.item.menuTitle, x.label), items, mobileItems: items, note: null, spotlight: spotlightOf(x.item.spotlight) };
    })
    .filter((m) => m.items.length);
  const menus = [...builtinMenus, ...extraMenus];
  const extraLinks = topExtras.filter((x) => !x.item.children?.length && x.href);
  const ctaLabel = tx(cmsNav?.ctaLabel, 'Book a Demo');
  const mobileCtaLabel = tx(cmsNav?.mobileCtaLabel, 'Book a Demo →');
  const ctaHref = cmsHref(cmsNav?.ctaHref, '/contact-us.html');
  // No src until Site Settings answers (lib/cmsImage.js): avoids loading the
  // built-in logo and then the Sanity copy; width/height keep the box.
  const logoSrc = cmsPic(settingsQuery)(cmsSettings?.logo, { width: 240 }, logo);
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
              <NavIcon name="home" />
              {nl('home', 'Home')}
            </SmartLink>

            {menus.map((m) => (
              <div key={m.key} {...groupProps(m.key)}>
                <button className="navlink" {...triggerProps(m.key)}>
                  <NavIcon name={m.icon} />
                  <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>{m.label} <span className="chev">&#9660;</span></span>
                </button>
                <div className="mega-wrap" id={`mega-${m.key}`}>
                  <div className={m.narrow ? 'mega mega--narrow' : 'mega'}>
                    <div>
                      <div className="mega-title">{m.menuTitle}</div>
                      {m.items.map((it) => (
                        <SmartLink key={it.key} href={it.href} className="mega-item"><span className="mega-ic"><NavIcon name={it.icon} /></span><span><span className="t">{it.label}</span>{it.description ? <span className="d">{it.description}</span> : null}</span></SmartLink>
                      ))}
                      {m.note ? <div className="mega-note"><span style={{color: 'var(--gold)', fontSize: '16px'}}>&#10022;</span><span><span style={{display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--ink)'}}>{m.note.title}</span><span style={{display: 'block', fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px'}}>{m.note.text}</span></span></div> : null}
                    </div>
                    {m.spotlight || m.key === 'company' || m.key === 'resources' ? (
                      <div>
                        {m.spotlight ? <>
                          <div className="mega-title">{t("Spotlight")}</div>
                          <div className="mega-spot"><div className="hand">{m.spotlight.title}</div><p>{m.spotlight.text}</p>{m.spotlight.href ? <SmartLink href={m.spotlight.href} style={{display: 'inline-block', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: 'var(--blue)'}}>{m.spotlight.linkLabel}</SmartLink> : null}</div>
                        </> : null}
                        {m.key === 'company' ? <>
                          <div className="mega-title muted" style={{margin: '20px 0 10px'}}>{t("Explore More")}</div>
                          <SmartLink href={nh('our-presence', '/industries.html')} className="mega-mini"><span className="mi"><NavIcon name="globe" /></span><span style={{flex: '1', fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>{nl('our-presence', 'Our Presence')}</span><span style={{color: 'var(--faint)'}}>&rarr;</span></SmartLink>
                          <SmartLink href={nh('careers', '/careers.html')} className="mega-mini"><span className="mi"><NavIcon name="briefcase" /></span><span style={{flex: '1', fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>{nl('careers', 'Careers')}</span><span style={{color: 'var(--faint)'}}>&rarr;</span></SmartLink>
                          <SmartLink href={nh('contact-us-flat', '/contact-us.html')} className="mega-mini"><span className="mi"><NavIcon name="mail" /></span><span style={{flex: '1', fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>{nl('contact-us-flat', 'Contact Us')}</span><span style={{color: 'var(--faint)'}}>&rarr;</span></SmartLink>
                        </> : null}
                        {m.key === 'resources' ? (
                          <SmartLink href="/careers.html" className="mega-mini" style={{marginTop: '14px'}}><span className="mi"><NavIcon name="briefcase" /></span><span style={{flex: '1', fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>{t('Join the team')}</span><span style={{color: 'var(--faint)'}}>&rarr;</span></SmartLink>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}

            <SmartLink href={nh('our-presence', '/industries.html')} data-navlink="industries.html" className="navlink"><NavIcon name="pin" />{nl('our-presence', 'Our Presence')}</SmartLink>
            <SmartLink href={nh('about-us', '/about-us.html')} data-navlink="about-us.html" className="navlink"><NavIcon name="info" />{nl('about-us', 'About Us')}</SmartLink>
            <SmartLink href={nh('clients-flat', '/our-clients.html')} data-navlink="our-clients.html" className="navlink"><NavIcon name="users" />{nl('clients-flat', 'Clients')}</SmartLink>
            <SmartLink href={nh('contact-us-flat', '/contact-us.html')} data-navlink="contact-us.html" className="navlink"><NavIcon name="mail" />{nl('contact-us-flat', 'Contact Us')}</SmartLink>
            {extraLinks.map((x) => (
              <SmartLink key={x.key} href={x.href} className="navlink"><NavIcon name="link" />{x.label}</SmartLink>
            ))}
          </nav>

          <div className="nav-actions">
            <span className="nav-sep"></span>
            <LanguageToggle />
              <SmartLink href={ctaHref} className="btn-cta">{ctaLabel} <span>&rarr;</span></SmartLink>
          </div>

          <button ref={burgerRef} type="button" className={`nav-burger ${mobileOpen ? 'open' : ''}`} aria-label={t('Menu')} aria-expanded={mobileOpen} aria-controls="navMobile" onClick={() => setMobileOpen(o => !o)}><span></span><span></span><span></span></button>
        </div>

        <div id="navMobile" className={`nav-mobile ${mobileOpen ? 'open' : ''}`} onClick={(e) => { if (e.target.closest('a')) setMobileOpen(false); }}>
          {menus.map((m) => (
            <Fragment key={m.key}>
              <div className="grp">{m.label}</div>
              {m.key === 'company' ? <SmartLink href={nh('home', '/index.html')} className="strong">{nl('home', 'Home')}</SmartLink> : null}
              {m.mobileItems.map((it) => <SmartLink key={it.key} href={it.href}>{it.label}</SmartLink>)}
            </Fragment>
          ))}
          <hr />
          <SmartLink href={nh('our-presence', '/industries.html')} className="strong">{nl('our-presence', 'Our Presence')}</SmartLink>
          <SmartLink href={nh('about-us', '/about-us.html')} className="strong">{nl('about-us', 'About Us')}</SmartLink>
          <SmartLink href={nh('clients-flat', '/our-clients.html')} className="strong">{nl('clients-flat', 'Clients')}</SmartLink>
          <SmartLink href={nh('contact-us-flat', '/contact-us.html')} className="strong">{nl('contact-us-flat', 'Contact Us')}</SmartLink>
          {extraLinks.map((x) => <SmartLink key={x.key} href={x.href} className="strong">{x.label}</SmartLink>)}
          <div className="m-lang"><LanguageToggle id="alignI18nToggleMobile" /></div>
          <SmartLink href={ctaHref} className="m-cta">{mobileCtaLabel}</SmartLink>
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
