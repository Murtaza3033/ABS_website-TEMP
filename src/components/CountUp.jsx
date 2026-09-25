import { useRef, useState, useEffect } from 'react';

/* Shared count-up — animates 0 → end when first scrolled into view (rAF easing),
   honoring reduced-motion. Observes its own node via a ref (no DOM queries). */
export default function CountUp({ end, suffix = '', duration = 1200, style, className }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(end); return undefined; }
    let raf = 0;
    let io = null;
    const start = () => {
      if (done.current) return;
      done.current = true;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        setVal(Math.round(end * (1 - (1 - p) ** 3)));
        raf = p < 1 ? requestAnimationFrame(step) : 0;
      };
      raf = requestAnimationFrame(step);
    };
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
      start();
    } else {
      io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { start(); io.unobserve(e.target); } });
      }, { threshold: 0.2 });
      io.observe(el);
    }
    return () => {
      if (io) io.disconnect();
      // An interrupted run is allowed to restart if the effect runs again.
      if (raf) { cancelAnimationFrame(raf); done.current = false; }
    };
  }, [end, duration]);

  return <span ref={ref} style={style} className={className}>{val.toLocaleString()}{suffix}</span>;
}
