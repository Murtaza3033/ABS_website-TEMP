import { useEffect, useLayoutEffect } from 'react';
import '../styles/home.css';
import { runPage } from './index.runtime.js';
import pageHtml from './index.body.html?raw';

// Home (index.html) — exact page markup + ported runtime, torn down on unmount.
export default function Home() {
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
