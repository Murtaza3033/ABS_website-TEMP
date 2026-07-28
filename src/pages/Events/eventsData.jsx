/* Events — data + icon helper (mirrors events.runtime.js). */

const ICON_PATHS = {
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  cal: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></>,
  booth: <><path d="M3 9l1-5h16l1 5" /><path d="M4 9v11h16V9" /><path d="M9 20v-6h6v6" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 0 20" /><path d="M12 2a15 15 0 0 0 0 20" /></>,
  tag: <><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 12V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6z" /><path d="M7 7h.01" /></>,
  mobile: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  shield: <><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" /></>,
};
export function Icon({ name }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICON_PATHS[name]}</svg>;
}

export const FACTS = [
  ['pin', 'Karachi Expo Centre', 'Pakistan'],
  ['booth', 'Hall 1 · Booth A-30', 'Our stand'],
  ['grid', '4 sectors shown', 'Real estate to services'],
  ['cal', 'ITCN Asia 2023', 'IT & telecom expo'],
];

export const GALLERY = [
  ['itcn-wall', 'jpg', 'Event Photo', 'The main stand at ITCN Asia 2023, Karachi Expo Centre'],
  ['booth-team', 'png', 'At the booth', 'The Align team at ITCN Asia 2023'],
  ['booth-demo', 'png', 'Live demos', 'Walking a visitor through the platform, live'],
  ['brochure', 'png', 'In conversation', 'Talking operations — one conversation at a time'],
];
export const gsrc = (i) => `/assets/images/about/${GALLERY[i][0]}.${GALLERY[i][1]}`;

export const WHY = [
  ['Global reach, local expertise', 'Connect with an expert who understands your market, speaks your language, and tailors support to your needs.', 'Discover what sets us apart', '/about-us.html', 'globe', 'global-reach'],
  ['The perfect pricing plan', 'Our experts will recommend the bundle best-suited to you. Start simple and scale as you grow.', 'See our pricing', '/contact-us.html', 'tag', 'pricing'],
  ['Access anytime, anywhere', 'Stay connected wherever you are with our mobile app.', 'Learn more', '/about-us.html', 'mobile', 'mobile-app'],
  ['Your data, safe and sound', 'We take security and compliance seriously, with systems and processes designed to protect your business.', 'See our security standards', '/about-us.html', 'shield', 'security'],
];
