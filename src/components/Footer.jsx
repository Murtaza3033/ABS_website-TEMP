import { useState, useEffect } from 'react';
import SmartLink from './SmartLink';
import logo from '../assets/images/logos/logo-1783092411267.png';

export default function Footer() {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const scan = () => {
      const el = document.querySelector('[data-ft]');
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
    <footer className={`site-footer ${revealed ? 'reveal' : ''}`} data-ft>
      <div className="ft-inner">
        <div className="ft-main">
          
          <div>
            <img className="ft-logo" src={logo} alt="Align Business Systems" />
            <p className="ft-lede">We build the ERP, HR and field-force platforms growing businesses run their operations on &mdash; designed, built and supported in-house.</p>
            <div className="ft-rule"></div>
            <div className="ft-contact">
              <div><span className="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></span>Karachi, Pakistan</div>
              <SmartLink href="mailto:info@alignbsystems.com"><span className="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 5L2 7"></path></svg></span>info@alignbsystems.com</SmartLink>
              <div><span className="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.8.4 1.7.6 2.6.7a2 2 0 0 1 1.7 2z"></path></svg></span>+92 21 111 254 265</div>
              <div><span className="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg></span>Mon &ndash; Fri &nbsp;|&nbsp; 9:00 AM &ndash; 6:00 PM PKT</div>
            </div>
            <div className="ft-social-h">Follow us</div>
            <div className="ft-social">
              <SmartLink href="https://www.linkedin.com/company/align-business-systems" target="_blank" rel="noopener" aria-label="LinkedIn"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.06 3.77-2.06 4 0 4.75 2.65 4.75 6.1V21H20v-5.4c0-1.3 0-2.95-1.8-2.95s-2.08 1.4-2.08 2.85V21H9z"></path></svg></SmartLink>
              <SmartLink href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V5h-3c-2.2 0-4 1.8-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1z"></path></svg></SmartLink>
              <SmartLink href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="0.6"></circle></svg></SmartLink>
              <SmartLink href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.4-.4-5a2.8 2.8 0 0 0-2-2C18.8 4.5 12 4.5 12 4.5s-6.8 0-8.6.5a2.8 2.8 0 0 0-2 2C1 8.6 1 12 1 12s0 3.4.4 5a2.8 2.8 0 0 0 2 2c1.8.5 8.6.5 8.6.5s6.8 0 8.6-.5a2.8 2.8 0 0 0 2-2c.4-1.6.4-5 .4-5z"></path><path d="M10 15.5 15 12l-5-3.5z" fill="#0b1220"></path></svg></SmartLink>
            </div>
          </div>
    
          
          <div>
            <div className="ft-col-h">Company</div><div className="ft-col-rule"></div>
            <div className="ft-links">
              <SmartLink href="/our-team.html">Our Team <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href="/our-advisors.html">Our Advisors <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href="/our-partners.html">Our Partners <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href="/careers.html">Careers <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href="/about-us.html">About Us <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href="/contact-us.html">Contact Us <span className="arw">&rarr;</span></SmartLink>
            </div>
          </div>
    
          
          <div>
            <div className="ft-col-h">Products</div><div className="ft-col-rule"></div>
            <div className="ft-links">
              <SmartLink href="https://businessflo.co" target="_blank" rel="noopener">BusinessFlo <span className="arw">&#8599;</span></SmartLink>
              <SmartLink href="https://peoplenest.co" target="_blank" rel="noopener">PeopleNest <span className="arw">&#8599;</span></SmartLink>
              <SmartLink href="https://pharmafieldflo.co" target="_blank" rel="noopener">Field Force <span className="arw">&#8599;</span></SmartLink>
            </div>
          </div>
    
          
          <div>
            <div className="ft-col-h">Resources</div><div className="ft-col-rule"></div>
            <div className="ft-links">
              <SmartLink href="/events.html">Events <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href="#">Insights <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href="/our-clients.html">Case Studies <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href="#">Blog <span className="arw">&rarr;</span></SmartLink>
              <SmartLink href="/contact-us.html">Help Center <span className="arw">&rarr;</span></SmartLink>
            </div>
          </div>
    
          
          <div className="ft-get">
            <div className="ft-col-h">Get Started</div><div className="ft-col-rule"></div>
            <p>See Align in action and discover how we can transform your operations.</p>
            <SmartLink href="/contact-us.html" className="g-cta">Book a Demo &rarr;</SmartLink>
            <div className="ft-support">
              <div className="row">
                <span className="badge"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"></path><path d="M21 14v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 1z"></path><path d="M3 14v3a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 1z"></path></svg></span>
                <span><span style={{display: 'block', fontSize: '13px', fontWeight: '600', color: '#eaf0fb'}}>Need Support?</span><span style={{display: 'block', fontSize: '12px', color: '#96a2ba'}}>We're here to help.</span></span>
              </div>
              <SmartLink href="/contact-us.html" style={{display: 'inline-block', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: '#4b8bff'}}>Visit Help Center &rarr;</SmartLink>
            </div>
          </div>
        </div>
    
        
        <div className="ft-feat">
          <div><span className="fi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"></path><path d="M9 12l2 2 4-4"></path></svg></span><span><span className="ft">Built in-house</span><span className="fd">End-to-end control and security.</span></span></div>
          <div><span className="fi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span><span><span className="ft">Enterprise grade</span><span className="fd">Reliable, secure &amp; future-ready.</span></span></div>
          <div><span className="fi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg></span><span><span className="ft">One connected platform</span><span className="fd">Finance, people &amp; field — working as one.</span></span></div>
          <div><span className="fi"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"></path><path d="M17 6h6v6"></path></svg></span><span><span className="ft">Real-time insights</span><span className="fd">Decide faster with complete visibility.</span></span></div>
        </div>
    
        <div className="ft-bottom">
          <span>&copy; 2026 Align Business Systems. All rights reserved.</span>
          <div className="ft-legal">
            <SmartLink href="#">Privacy Policy</SmartLink><span className="dot">&bull;</span>
            <SmartLink href="#">Terms of Use</SmartLink><span className="dot">&bull;</span>
            <SmartLink href="#">Security</SmartLink>
          </div>
          <span>Enterprise software, built in-house.</span>
        </div>
      </div>
    </footer>
  );
}
