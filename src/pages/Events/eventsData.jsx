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
  ['itcn-wall', 'webp', 'Event Photo', 'The main stand at ITCN Asia 2023, Karachi Expo Centre'],
  ['booth-team', 'webp', 'At the booth', 'The Align team at ITCN Asia 2023'],
  ['booth-demo', 'webp', 'Live demos', 'Walking a visitor through the platform, live'],
  ['brochure', 'webp', 'In conversation', 'Talking operations — one conversation at a time'],
];
export const gsrc = (i) => `/assets/images/about/${GALLERY[i][0]}.${GALLERY[i][1]}`;

export const WHY = [
  ['We show up where you are', 'From regional expos to industry conferences, we go where operations teams already gather — not just online.', 'Talk to us', '/contact-us.html', 'globe', 'global-reach'],
  ['Straight answers, not a runaround', 'Walk away from every conversation knowing exactly whether Align fits your business, and what it costs.', 'Ask us anything', '/contact-us.html', 'tag', 'pricing'],
  ['Come see it running, live', 'We bring a real working product to every event, not a slideshow — see it running on a phone or laptop, right in front of you.', 'Book a live demo', '/contact-us.html', 'mobile', 'mobile-app'],
  ['Bring your toughest questions', 'Security, compliance, implementation — whatever’s actually holding your decision back, ask it in person and get a straight answer.', 'Talk to our team', '/contact-us.html', 'shield', 'security'],
];
