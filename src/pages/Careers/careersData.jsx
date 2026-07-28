/* Careers — data + icon helper (mirrors careers.runtime.js). */

const ICON_PATHS = {
  check: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 0 20" /><path d="M12 2a15 15 0 0 0 0 20" /></>,
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>,
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
  code: <><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>,
};
export function Icon({ name, size = 22, sw = 1.8 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{ICON_PATHS[name]}</svg>;
}

export const CULTURE = [
  ['Real products, real impact', 'You work on modules businesses run their finance, HR and field teams on — not throwaway internal tools.', 'check', '0s'],
  ['Direct access to leadership', 'A small team means your work is visible and your voice is heard — no layers between you and decisions.', 'users', '.6s'],
  ['A Pakistan-based company', 'Proudly built in Pakistan, serving businesses at home and across the region — local roots, real enterprise scale.', 'globe', '1.2s'],
  ['Ship fast, ship right', 'We move quickly without cutting corners — disciplined about quality, quick to get things live.', 'zap', '1.8s'],
];

export const ROLES = [
  {
    title: '.NET Developer', loc: 'Karachi, Pakistan', dept: 'Engineering', type: 'Full-time',
    desc: 'Join the team building and maintaining the core ERP platform — working across the modules that businesses run their finance, inventory and operations on every day.',
    reqs: ['Strong hands-on experience with .NET / C#', 'Comfortable with SQL Server and data-driven applications', 'Ability to work directly with product and support teams'],
  },
  {
    title: 'ERP Sales Executive', loc: 'Karachi, Pakistan', dept: 'Sales', type: 'Full-time',
    desc: 'Own the conversation with growing businesses evaluating Align — understanding their operations and showing them how our platform fits.',
    reqs: ['Experience selling B2B software or ERP solutions', 'Comfortable running product demos and discovery calls', 'Strong communication in English and Urdu'],
  },
];

export const STEPS = [
  ['mail', 'Apply', 'Email talent@alignbsystems.com with the role title in the subject line.'],
  ['chat', 'Intro call', 'A quick 20–30 minute chat to get to know you and answer your questions.'],
  ['users', 'Role deep-dive', "A focused conversation with the team you'd join — practical, not a quiz."],
  ['rocket', 'Offer & welcome', "If it's a fit both ways, we move fast and get you set up."],
];
