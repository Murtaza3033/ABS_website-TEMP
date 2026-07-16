import { useEffect, useLayoutEffect } from 'react';
import '../styles/contact-us.css';
import { runPage } from './contact-us.runtime.js';
import pageHtml from './contact-us.body.html?raw';

// ContactUs (contact-us.html) — exact page markup + ported runtime, torn down on unmount.
export default function ContactUs() {
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
