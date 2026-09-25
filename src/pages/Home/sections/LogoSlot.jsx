import { useState, useEffect } from 'react';

/* Clients mosaic slot — idiomatic replacement for the runtime's imperative
   setLogo() DOM injection. The rotation state lives in useLogoRotation()
   (one per mosaic) so every slot's next logo is picked from the ones NOT
   currently shown: no logo ever appears in two slots at the same time. Each
   slot still ticks on its own staggered interval so the grid rotates gently.
   Image paths stay as public/ strings per the scope decision. Missing logos
   hide via state, not DOM mutation. */
const LOGOS = [
  ['Dipitt', 'dipitt-logo'], ['Danpak', 'danpak-logo'], ['Noon', 'noon-logo'],
  ['Nectek', 'nectek-logo'], ['Zamanat', 'zamanat-logo'], ['Greeeno', 'greeeno-logo'],
  ['Allied', 'allied-logo'], ['Oncogen', 'oncogen-pharma-pakistan-logo'], ['Clipsal', 'clipsal-logo'],
  ['Maxim', 'maxim-logo'], ['TechExons', 'techexons-logo'], ['Omega', 'omega-enterprises-logo'],
  ['VSolar', 'vsolar-logo'], ['Coarts', 'coarts-lighting-solutin'], ['Powerhouse', 'powerhouse-builiding-solution-logo'],
  ['KG', 'kg-logo'], ['Buscaro', 'buscaro-logo-original-scaled'],
];

const SLOT_STYLE = {
  background: '#ffffff', border: '1px solid #eef1f6', borderRadius: '14px',
  transition: 'transform .3s cubic-bezier(.2,.7,.3,1),box-shadow .3s ease',
  position: 'relative', overflow: 'hidden',
};
const IMG_STYLE = {
  position: 'absolute', top: '19%', left: '9%', width: '82%', height: '62%', objectFit: 'contain',
};

function LogoImg({ file, name }) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    <img
      src={`/assets/images/clients/${file}.webp`}
      alt={name}
      style={IMG_STYLE}
      className="logo-fade"
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  );
}

/* Returns "count" distinct LOGOS indices (random start). Each slot advances
   on its own 4.2–7.4s interval to the next logo that no other slot shows. */
export function useLogoRotation(count) {
  const n = Math.min(count, LOGOS.length);
  const [slots, setSlots] = useState(() => {
    const order = LOGOS.map((_, i) => i);
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
        do { next = (next + 1) % LOGOS.length; } while (shown.has(next) && next !== prev[k]);
        if (next === prev[k]) return prev;
        const copy = prev.slice(); copy[k] = next;
        return copy;
      }), period);
    });
    return () => ids.forEach(clearInterval);
  }, [n]);
  return slots;
}

export default function LogoSlot({ logo = 0 }) {
  const [name, file] = LOGOS[logo % LOGOS.length];
  return (
    <div data-hv="hv-7" style={SLOT_STYLE}>
      {/* key by file so the fade-in animation replays on each logo change */}
      <LogoImg key={file} file={file} name={name} />
    </div>
  );
}
