import { useEffect, useLayoutEffect } from 'react';
import '../styles/our-partners.css';
import { runPage } from './our-partners.runtime.js';
import pageHtml from './our-partners.body.html?raw';

// OurPartners (our-partners.html) — exact page markup + ported runtime, torn down on unmount.
export default function OurPartners() {
  // Drive <body> background per-route (page CSS body rules are global in the SPA).
  useLayoutEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = 'var(--white)';
    return () => { document.body.style.background = prev; };
  }, []);
  useEffect(() => {
    const teardown = runPage();
    return teardown;
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: pageHtml }} />;
}
