import { useEffect, useLayoutEffect } from 'react';
import '../styles/industries.css';
import { runPage } from './industries.runtime.js';
import pageHtml from './industries.body.html?raw';

// Industries (industries.html) — exact page markup + ported runtime, torn down on unmount.
export default function Industries() {
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
