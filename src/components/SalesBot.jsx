import { useEffect, useRef } from 'react';
import { initSalesBot } from '../lib/salesBot';

// Floating Align Assistant chat widget. The (fixed-position) widget is built by the ported
// engine into this container; the effect cleanup removes it so it never duplicates.
export default function SalesBot() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return undefined;
    const teardown = initSalesBot(ref.current);
    return teardown;
  }, []);
  return <div ref={ref} />;
}
