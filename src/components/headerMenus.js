/* Built-in header menus: the fallback copy for Sanity → Navigation, plus the
   icon (NavIcon.jsx) each built-in item keeps. Keys match the `_key`s of the
   navigation singleton's items / sub-items (see lib/navAdapters.js); anything
   the CMS adds under another key is rendered after these with the generic
   icon. */

/* The three mega menus, in header order. `mobile`: which sub-items the mobile
   menu lists under the group heading (the rest appear as its bold links). */
export const MENUS = [
  {
    key: 'company',
    label: 'Company',
    icon: 'building',
    menuTitle: 'About Align',
    items: [
      { key: 'about-us', label: 'About Us', href: '/about-us.html', icon: 'info', description: 'Enterprise software, built in-house.' },
      { key: 'our-team', label: 'Our Team', href: '/our-team.html', icon: 'users', description: 'Meet the people behind Align.' },
      { key: 'our-advisors', label: 'Our Advisors', href: '/our-advisors.html', icon: 'shield', description: 'Industry experts guiding our vision.' },
      { key: 'our-partners', label: 'Our Partners', href: '/our-partners.html', icon: 'partners', description: 'Trusted collaborations that scale.' },
      { key: 'our-clients', label: 'Our Clients', href: '/our-clients.html', icon: 'building', description: 'Businesses that grow with Align.' },
    ],
    mobile: ['our-team', 'our-advisors', 'our-partners'],
    note: { title: 'Our purpose is simple', text: 'Build powerful systems. Empower growing businesses.' },
    spotlight: {
      title: '★ Built for growth.',
      text: 'Align brings ERP, HR, field-force and hospital management together in one powerful platform.',
      linkLabel: 'See how we help →',
      href: '/about-us.html',
    },
  },
  {
    key: 'products',
    label: 'Products',
    icon: 'layers',
    menuTitle: 'Our Products',
    items: [
      { key: 'businessflo', label: 'Businessflo', href: '/products/businessflo', icon: 'doc', description: 'Automate approvals, workflows and operations.' },
      { key: 'peoplenest', label: 'PeopleNest', href: '/products/peoplenest', icon: 'users', description: 'Streamline HR, payroll and employees.' },
      { key: 'field-force', label: 'Field Force', href: '/products/pharmafieldflo', icon: 'chart', description: 'Plan, track and optimize field activities in real time.' },
      { key: 'hmsflo', label: 'HMSflo', href: '/products/hmsflo', icon: 'hospital', description: 'Run OPD, admissions, pharmacy, lab and billing.' },
    ],
    mobile: ['businessflo', 'peoplenest', 'field-force', 'hmsflo'],
    spotlight: {
      title: '✦ One platform.',
      text: 'All Align products are built to work together — so your business stays connected.',
      linkLabel: 'Explore all products →',
      href: '/products',
    },
  },
  {
    key: 'resources',
    label: 'Resources',
    icon: 'doc',
    menuTitle: 'Resources',
    narrow: true,
    items: [
      { key: 'events', label: 'Events', href: '/events.html', icon: 'calendar', description: 'Where Align shows up in the industry.' },
      { key: 'careers', label: 'Careers', href: '/careers.html', icon: 'briefcase', description: 'Build the systems businesses run on.' },
      { key: 'case-studies', label: 'Case Studies', href: '/our-clients.html', icon: 'book', description: 'Real stories from real clients.' },
      { key: 'help-center', label: 'Help Center', href: '/contact-us.html', icon: 'info', description: 'Guidance and support when you need it.' },
    ],
    mobile: ['events', 'careers'],
    spotlight: {
      title: '★ Meet us out there.',
      text: 'See where Align shows up — exhibitions, talks and the teams behind it.',
      linkLabel: 'View events →',
      href: '/events.html',
    },
  },
];

/* Top-level keys the header places itself (menus + flat links); any other
   top-level CMS item is appended as an extra link / menu. */
export const BUILTIN_TOP_KEYS = new Set(['home', 'company', 'products', 'resources', 'our-presence', 'clients-flat', 'contact-us-flat']);
