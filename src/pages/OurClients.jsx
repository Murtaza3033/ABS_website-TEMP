import { useEffect, useLayoutEffect } from 'react';
import '../styles/our-clients.css';
import { runPage } from './our-clients.runtime.js';
import pageHtml from './our-clients.body.html?raw';

// OurClients (our-clients.html) — exact page markup + ported runtime, torn down on unmount.
export default function OurClients() {
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
