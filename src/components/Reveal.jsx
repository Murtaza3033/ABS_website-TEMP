import { forwardRef, useRef, useState, useEffect } from 'react';

/* Reveal-on-scroll — idiomatic replacement for the runtimes' scroll-scan +
   classList.add('cin'/'in') approach. Observes its OWN node via a ref and
   toggles a state-driven className; no querySelector / classList on the
   document. One-shot (unobserves after first reveal), matching the originals.
   Renders as `<Tag className="cReveal cin?">` so the existing CSS applies.
   Forwards refs (merged with the internal observer ref) for callers that also
   need the node (e.g. pointer-parallax hosts). */
const Reveal = forwardRef(function Reveal({
  as: Tag = 'div', className = '', baseClass = 'cReveal', shownClass = 'cin', style, children, ...rest
}, extRef) {
  const innerRef = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return undefined;
    }
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { setShown(true); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const setRef = (el) => {
    innerRef.current = el;
    if (typeof extRef === 'function') extRef(el);
    else if (extRef) extRef.current = el;
  };

  const cls = [baseClass, shown ? shownClass : '', className].filter(Boolean).join(' ');
  return <Tag ref={setRef} className={cls} style={style} {...rest}>{children}</Tag>;
});

export default Reveal;

/* Preset used by the page stylesheets, which reveal via [data-reveal] + `.in`
   (rather than .cReveal/.cin). `ref` passes through as a prop (React 19). */
export function DataReveal(props) {
  return <Reveal data-reveal="" baseClass="" shownClass="in" {...props} />;
}
