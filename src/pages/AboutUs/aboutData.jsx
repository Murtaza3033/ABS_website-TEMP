/* About Us — data + icon helper. */

const ICON_PATHS = {
  layers: <><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>,
  target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  spark: <><path d="M12 3v4" /><path d="M12 17v4" /><path d="M3 12h4" /><path d="M17 12h4" /><path d="M5.6 5.6l2.8 2.8" /><path d="M15.6 15.6l2.8 2.8" /><path d="M18.4 5.6l-2.8 2.8" /><path d="M8.4 15.6l-2.8 2.8" /></>,
  check: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />,
  building: <><rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" /></>,
  flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><path d="M4 22v-7" /></>,
};

export function Icon({ name, size = 24, sw = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[name]}
    </svg>
  );
}

export const STRIP = [
  ['Engineering', 'team-monitor'], ['Product Demos', 'presentation'], ['Recognized', 'award'],
  ['At ITCN Asia', 'booth-team'], ['The Team', 'team-laptop'], ['Live Demos', 'booth-demo'],
  ['In the Field', 'brochure'], ['Strategy', 'meeting'],
];
export const STRIP_TINTS = ['#1a56db', '#0f1729', '#d4a017', '#1a9d55', '#123f9e', '#4b8bff', '#7c5cff', '#1648b8'];

export const MILES = [
  ['Year TBD', 'Align founded', '#1a56db', 'team-laptop.webp'],
  ['Year TBD', 'BusinessFlo launch', '#1a56db', 'presentation.webp'],
  ['2023', 'ITCN Asia exhibitor', '#d4a017', 'itcn-wall.webp'],
  ['Year TBD', 'PeopleNest & Field Force', '#1a56db', 'meeting.webp'],
  ['Today', 'One connected platform', '#1a9d55', 'team-monitor.webp'],
];

export const STATS = [
  ['3', 'Products on one platform', '#4b8bff', 'rgba(75,139,255,.16)', 'layers'],
  ['In-house', 'Design, build & support', '#d4a017', 'rgba(212,160,23,.16)', 'spark'],
  ['ITCN Asia', 'National exhibitor', '#a48bff', 'rgba(164,139,255,.18)', 'building'],
  ['Karachi', 'Built in Pakistan', '#2fd07f', 'rgba(47,208,127,.16)', 'flag'],
];

export const EXP = [
  ['ERP Architecture', 'Designing systems that model how an entire business actually runs — finance to field.', 'layers'],
  ['SQL Server Administration', 'Reliable, tuned data layers that stay fast as your operations scale.', 'target'],
  ['Full-Stack SaaS Development', 'From database to interface, designed, built and owned end to end.', 'zap'],
  ['Enterprise UI/UX', 'Complex workflows made clear, usable and quick for everyday teams.', 'spark'],
];
export const TECHSTACK = ['React', 'ASP.NET', 'SQL Server', 'TypeScript', 'Azure', 'REST APIs'];

export const VALS = [
  ['01', 'Built around real workflows', 'We design for how teams actually work — not the other way around.', 'check'],
  ['02', 'Ship fast, ship right', 'Quick to deliver, disciplined about quality.', 'zap'],
  ['03', 'Client success over feature count', 'Outcomes matter more than a longer feature list.', 'target'],
  ['04', 'One accountable team', 'We build, deploy and support it all in-house.', 'heart'],
];

export const NET = [
  { title: 'Our Team', tag: 'The builders', accent: '#1a56db', tint: 'rgba(26,86,219,.1)', line: 'The engineers, consultants and operators who build and run Align.', href: '/our-team.html', img: 'team-laptop.webp' },
  { title: 'Our Advisors', tag: 'Guidance', accent: '#7c5cff', tint: 'rgba(124,92,255,.12)', line: 'The guidance shaping how Align grows and where it goes next.', href: '/our-advisors.html', img: 'ceo.webp' },
  { title: 'Our Partners', tag: 'Ecosystem', accent: '#d4a017', tint: 'rgba(212,160,23,.14)', line: 'A network of trusted companies we build and grow alongside.', href: '/our-partners.html', img: 'brochure.webp' },
  { title: 'Our Clients', tag: 'Who we serve', accent: '#1a9d55', tint: 'rgba(26,157,85,.12)', line: 'The businesses that run their operations on Align every day.', href: '/our-clients.html', img: 'booth-demo.webp' },
];
