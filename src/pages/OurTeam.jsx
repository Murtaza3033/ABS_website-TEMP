import { useEffect, useLayoutEffect } from 'react';
import '../styles/our-team.css';
import { runPage } from './our-team.runtime.js';
import pageHtml from './our-team.body.html?raw';

// OurTeam (our-team.html) — exact page markup + ported runtime, torn down on unmount.
export default function OurTeam() {
  // Drive <body> background per-route (page CSS body rules are global in the SPA).
  useLayoutEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#0f1729';
    return () => { document.body.style.background = prev; };
  }, []);
  useEffect(() => {
    const teardown = runPage();
    return teardown;
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: pageHtml }} />;
}
