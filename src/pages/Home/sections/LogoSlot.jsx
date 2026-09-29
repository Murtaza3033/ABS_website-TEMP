import { useState, useEffect } from 'react';

/* Clients mosaic slot — idiomatic replacement for the runtime's imperative
   setLogo() DOM injection. The rotation state lives in useLogoRotation()
   (one per mosaic) so every slot's next logo is picked from the ones NOT
   currently shown: no logo ever appears in two slots at the same time. Each
   slot still ticks on its own staggered interval so the grid rotates gently.
   Logos are the CMS Client documents with a logo (ClientsSection); LOGOS
   (homeContent.js) is the built-in list used when the CMS fails or has none.
   Missing logos hide via state, not DOM mutation. */
const SLOT_STYLE = {
  background: '#ffffff', border: '1px solid #eef1f6', borderRadius: '14px',
  transition: 'transform .3s cubic-bezier(.2,.7,.3,1),box-shadow .3s ease',
  position: 'relative', overflow: 'hidden',
};
const IMG_STYLE = {
  position: 'absolute', top: '19%', left: '9%', width: '82%', height: '62%', objectFit: 'contain',
};

function LogoImg({ src, name }) {
  const [broken, setBroken] = useState(false);
  if (broken || !src) return null;
  return (
    <img
      src={src}
      alt={name}
      style={IMG_STYLE}
      className="logo-fade"
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  );
}

/* Returns "count" distinct indices into a list of `total` logos (random
   start). Each slot advances on its own 4.2–7.4s interval to the next logo
   that no other slot shows. Mount it under a key of `total` so a list of a
   different length starts a fresh shuffle. */
export function useLogoRotation(count, total) {
  const n = Math.min(count, total);
  const [slots, setSlots] = useState(() => {
    const order = Array.from({ length: total }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order.slice(0, n);
  });
  useEffect(() => {
    const ids = Array.from({ length: n }, (_, k) => {
      const period = 4200 + Math.floor(Math.random() * 3200); // stagger 4.2–7.4s
      return setInterval(() => setSlots((prev) => {
        const shown = new Set(prev);
        let next = prev[k];
        do { next = (next + 1) % total; } while (shown.has(next) && next !== prev[k]);
        if (next === prev[k]) return prev;
        const copy = prev.slice(); copy[k] = next;
        return copy;
      }), period);
    });
    return () => ids.forEach(clearInterval);
  }, [n, total]);
  return slots;
}

/* `logo` = { name, src } (src undefined while the CMS list is pending: the
   slot stays an empty tile). */
export default function LogoSlot({ logo }) {
  return (
    <div data-hv="hv-7" style={SLOT_STYLE}>
      {/* key by src so the fade-in animation replays on each logo change */}
      {logo && <LogoImg key={logo.src || logo.name} src={logo.src} name={logo.name} />}
    </div>
  );
}
