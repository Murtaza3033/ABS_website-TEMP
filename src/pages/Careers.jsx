import { useEffect, useLayoutEffect } from 'react';
import '../styles/careers.css';
import { runPage } from './careers.runtime.js';
import pageHtml from './careers.body.html?raw';

// Careers (careers.html) — exact page markup + ported runtime, torn down on unmount.
export default function Careers() {
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
