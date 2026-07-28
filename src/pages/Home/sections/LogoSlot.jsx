import { useState, useEffect } from 'react';

/* Clients mosaic slot — idiomatic replacement for the runtime's imperative
   setLogo() DOM injection. Each slot owns its own rotation state + interval
   (staggered so the grid rotates gently, as the original did by cycling 3
   slots every 2.2s). Image paths stay as public/ strings per the scope
   decision. Missing logos hide via state, not DOM mutation. */
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
      src={`/assets/images/clients/${file}.png`}
      alt={name}
      style={IMG_STYLE}
      className="logo-fade"
      onError={() => setBroken(true)}
    />
  );
}

export default function LogoSlot() {
  const [i, setI] = useState(() => Math.floor(Math.random() * LOGOS.length));
  useEffect(() => {
    const period = 4200 + Math.floor(Math.random() * 3200); // stagger 4.2–7.4s
    const id = setInterval(() => setI((p) => (p + 1) % LOGOS.length), period);
    return () => clearInterval(id);
  }, []);
  const [name, file] = LOGOS[i];
  return (
    <div data-hv="hv-7" style={SLOT_STYLE}>
      {/* key by file so the fade-in animation replays on each logo change */}
      <LogoImg key={file} file={file} name={name} />
    </div>
  );
}
