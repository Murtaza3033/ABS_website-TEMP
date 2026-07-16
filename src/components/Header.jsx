import { useState, useEffect } from 'react';
import SmartLink from './SmartLink';
import LanguageToggle from './LanguageToggle';
import logo from '../assets/images/logos/logo-1783092411267.png';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setScrolled(y > 12);
      setShowTop(y > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`} data-nav-header>
        <div className="nav-inner">
          <SmartLink href="/index.html" className="nav-logo">
            <img src={logo} alt="Align Business Systems" />
          </SmartLink>
      
          <nav className="nav-desktop">
            <SmartLink href="/index.html" data-navlink="index.html" className="navlink">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8"></path><path d="M5 10v10h14V10"></path></svg>
              Home
            </SmartLink>
      
            
            <div className="nav-group">
              <button className="navlink">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"></path></svg>
                <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>Company <span className="chev">&#9660;</span></span>
              </button>
              <div className="mega-wrap">
                <div className="mega">
                  <div>
                    <div className="mega-title">About Align</div>
                    <SmartLink href="/about-us.html" className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg></span><span><span className="t">About Us</span><span className="d">Enterprise software, built in-house.</span></span></SmartLink>
                    <SmartLink href="/our-team.html" className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span><span><span className="t">Our Team</span><span className="d">Meet the people behind Align.</span></span></SmartLink>
                    <SmartLink href="/our-advisors.html" className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"></path><path d="M9 12l2 2 4-4"></path></svg></span><span><span className="t">Our Advisors</span><span className="d">Industry experts guiding our vision.</span></span></SmartLink>
                    <SmartLink href="/our-partners.html" className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 17l2 2 4-4"></path><path d="M2 12l4-4 4 4-4 4-4-4z"></path><path d="M14 12l4-4 4 4-4 4"></path></svg></span><span><span className="t">Our Partners</span><span className="d">Trusted collaborations that scale.</span></span></SmartLink>
                    <SmartLink href="/our-clients.html" className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"></path></svg></span><span><span className="t">Our Clients</span><span className="d">Businesses that grow with Align.</span></span></SmartLink>
                    <div className="mega-note"><span style={{color: 'var(--gold)', fontSize: '16px'}}>&#10022;</span><span><span style={{display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--ink)'}}>Our purpose is simple</span><span style={{display: 'block', fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px'}}>Build powerful systems. Empower growing businesses.</span></span></div>
                  </div>
                  <div>
                    <div className="mega-title">Spotlight</div>
                    <div className="mega-spot"><div className="hand">&#9733; Built for growth.</div><p>Align brings ERP, HR and field-force together in one powerful platform.</p><SmartLink href="/about-us.html" style={{display: 'inline-block', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: 'var(--blue)'}}>See how we help &rarr;</SmartLink></div>
                    <div className="mega-title muted" style={{margin: '20px 0 10px'}}>Explore More</div>
                    <SmartLink href="/industries.html" className="mega-mini"><span className="mi"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15 15 0 0 1 0 20"></path><path d="M12 2a15 15 0 0 0 0 20"></path></svg></span><span style={{flex: '1', fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>Our Presence</span><span style={{color: 'var(--faint)'}}>&rarr;</span></SmartLink>
                    <SmartLink href="/careers.html" className="mega-mini"><span className="mi"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path></svg></span><span style={{flex: '1', fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>Careers</span><span style={{color: 'var(--faint)'}}>&rarr;</span></SmartLink>
                    <SmartLink href="/contact-us.html" className="mega-mini"><span className="mi"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 5L2 7"></path></svg></span><span style={{flex: '1', fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>Contact Us</span><span style={{color: 'var(--faint)'}}>&rarr;</span></SmartLink>
                  </div>
                </div>
              </div>
            </div>
      
            
            <div className="nav-group">
              <button className="navlink">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>Products <span className="chev">&#9660;</span></span>
              </button>
              <div className="mega-wrap">
                <div className="mega">
                  <div>
                    <div className="mega-title">Our Products</div>
                    <SmartLink href="https://businessflo.co" target="_blank" rel="noopener" className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h8"></path></svg></span><span><span className="t">BusinessFlo <span style={{fontSize: '11px', color: 'var(--faint)'}}>&#8599;</span></span><span className="d">Automate approvals, workflows and operations.</span></span></SmartLink>
                    <SmartLink href="https://peoplenest.co" target="_blank" rel="noopener" className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span><span><span className="t">PeopleNest <span style={{fontSize: '11px', color: 'var(--faint)'}}>&#8599;</span></span><span className="d">Streamline HR, payroll and employees.</span></span></SmartLink>
                    <SmartLink href="https://pharmafieldflo.co" target="_blank" rel="noopener" className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><rect x="7" y="11" width="3" height="6"></rect><rect x="12" y="7" width="3" height="10"></rect><rect x="17" y="13" width="3" height="4"></rect></svg></span><span><span className="t">Field Force <span style={{fontSize: '11px', color: 'var(--faint)'}}>&#8599;</span></span><span className="d">Plan, track and optimize field activities in real time.</span></span></SmartLink>
                  </div>
                  <div>
                    <div className="mega-title">Spotlight</div>
                    <div className="mega-spot"><div className="hand">&#10022; One platform.</div><p>All Align products are built to work together — so your business stays connected.</p><SmartLink href="/about-us.html" style={{display: 'inline-block', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: 'var(--blue)'}}>Explore all products &rarr;</SmartLink></div>
                  </div>
                </div>
              </div>
            </div>
      
            
            <div className="nav-group">
              <button className="navlink">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h8"></path></svg>
                <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>Resources <span className="chev">&#9660;</span></span>
              </button>
              <div className="mega-wrap">
                <div className="mega mega--narrow">
                  <div>
                    <div className="mega-title">Resources</div>
                    <SmartLink href="/events.html" className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg></span><span><span className="t">Events</span><span className="d">Where Align shows up in the industry.</span></span></SmartLink>
                    <SmartLink href="/careers.html" className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path></svg></span><span><span className="t">Careers</span><span className="d">Build the systems businesses run on.</span></span></SmartLink>
                    <SmartLink href="/our-clients.html" className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></span><span><span className="t">Case Studies</span><span className="d">Real stories from real clients.</span></span></SmartLink>
                    <SmartLink href="/contact-us.html" className="mega-item"><span className="mega-ic"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg></span><span><span className="t">Help Center</span><span className="d">Guidance and support when you need it.</span></span></SmartLink>
                  </div>
                  <div>
                    <div className="mega-title">Spotlight</div>
                    <div className="mega-spot"><div className="hand">&#9733; Meet us out there.</div><p>See where Align shows up — exhibitions, talks and the teams behind it.</p><SmartLink href="/events.html" style={{display: 'inline-block', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: 'var(--blue)'}}>View events &rarr;</SmartLink></div>
                    <SmartLink href="/careers.html" className="mega-mini" style={{marginTop: '14px'}}><span className="mi"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path></svg></span><span style={{flex: '1', fontSize: '14px', fontWeight: '600', color: 'var(--ink)'}}>Join the team</span><span style={{color: 'var(--faint)'}}>&rarr;</span></SmartLink>
                  </div>
                </div>
              </div>
            </div>
      
            <SmartLink href="/industries.html" data-navlink="industries.html" className="navlink"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>Our Presence</SmartLink>
            <SmartLink href="/about-us.html" data-navlink="about-us.html" className="navlink"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>About Us</SmartLink>
            <SmartLink href="/our-clients.html" data-navlink="our-clients.html" className="navlink"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>Clients</SmartLink>
            <SmartLink href="/contact-us.html" data-navlink="contact-us.html" className="navlink"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 5L2 7"></path></svg>Contact Us</SmartLink>
          </nav>
      
          <div className="nav-actions">
            <span className="nav-sep"></span>
            <button className="icon-btn" aria-label="Apps"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="5" r="1.6"></circle><circle cx="12" cy="5" r="1.6"></circle><circle cx="19" cy="5" r="1.6"></circle><circle cx="5" cy="12" r="1.6"></circle><circle cx="12" cy="12" r="1.6"></circle><circle cx="19" cy="12" r="1.6"></circle><circle cx="5" cy="19" r="1.6"></circle><circle cx="12" cy="19" r="1.6"></circle><circle cx="19" cy="19" r="1.6"></circle></svg></button>
            <LanguageToggle />
              <SmartLink href="/contact-us.html" className="btn-cta">Book a Demo <span>&rarr;</span></SmartLink>
          </div>
      
          <button className={`nav-burger ${mobileOpen ? 'open' : ''}`} aria-label="Menu" onClick={() => setMobileOpen(o => !o)}><span></span><span></span><span></span></button>
        </div>
      
        <div className={`nav-mobile ${mobileOpen ? 'open' : ''}`} onClick={(e) => { if (e.target.closest('a')) setMobileOpen(false); }}>
          <div className="grp">Company</div>
          <SmartLink href="/index.html" className="strong">Home</SmartLink>
          <SmartLink href="/our-team.html">Our Team</SmartLink>
          <SmartLink href="/our-advisors.html">Our Advisors</SmartLink>
          <SmartLink href="/our-partners.html">Our Partners</SmartLink>
          <div className="grp">Products</div>
          <SmartLink href="https://businessflo.co" target="_blank" rel="noopener">BusinessFlo &#8599;</SmartLink>
          <SmartLink href="https://peoplenest.co" target="_blank" rel="noopener">PeopleNest &#8599;</SmartLink>
          <SmartLink href="https://pharmafieldflo.co" target="_blank" rel="noopener">Field Force &#8599;</SmartLink>
          <div className="grp">Resources</div>
          <SmartLink href="/events.html">Events</SmartLink>
          <SmartLink href="/careers.html">Careers</SmartLink>
          <hr />
          <SmartLink href="/industries.html" className="strong">Our Presence</SmartLink>
          <SmartLink href="/about-us.html" className="strong">About Us</SmartLink>
          <SmartLink href="/our-clients.html" className="strong">Clients</SmartLink>
          <SmartLink href="/contact-us.html" className="strong">Contact Us</SmartLink>
          <SmartLink href="/contact-us.html" className="m-cta">Book a Demo &rarr;</SmartLink>
        </div>
      </header>

      <button className={`scroll-top ${showTop ? 'show' : ''}`} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"></path><path d="M5 12l7-7 7 7"></path></svg></button>
    </>
  );
}
