import {
  createContext, useContext, useReducer, useEffect, useRef, useState,
} from 'react';

/* ============================================================================
   Home state.
   One useReducer drives the hero + §2-7 interactive state; every interval /
   timeout / listener the old runtime created lives here in a cleaned-up
   useEffect. Sections consume this via:
     - c(cond)   -> boolean, drives conditional rendering (was .scif display)
     - b(name)   -> string,  drives text bindings          (was data-bk)
     - act(name) -> event,   dispatches an action          (was data-act)
     - state / dispatch      for §2-7 visibility, orbit, carousel, mosaic
   ========================================================================== */

/* ---- static data ---- */
const CHATS = {
  openC0: ['Zainab Malik', 'ZM'], openC1: ['Bilal Sattar', 'BS'],
  openC2: ['Hooria Naveed', 'HN'], openC3: ['Usman Tariq', 'UT'],
  openC4: ['Mehwish Anwar', 'MA'],
};

export const ORBIT = [
  { name: 'Discovery', arrow: 'M300,228 L300,150' },
  { name: 'Engineering', arrow: 'M356,262 L442,214' },
  { name: 'Implementation', arrow: 'M346,346 L398,392' },
  { name: 'Support', arrow: 'M254,346 L202,392' },
  { name: 'Insight', arrow: 'M244,262 L162,214' },
];

export const SVC = [
  { img: 'web', tag: 'Web Development', title: 'Web Development', desc: 'Fast, scalable web applications built around your real workflows.', feats: ['Responsive', 'Scalable', 'Secure'] },
  { img: 'mobile', tag: 'Mobile Apps', title: 'Mobile App Development', desc: 'Native-quality iOS and Android apps for teams on the move.', feats: ['iOS', 'Android', 'Offline-ready'] },
  { img: 'saas', tag: 'SaaS', title: 'SaaS Development', desc: 'Multi-tenant products engineered to scale securely.', feats: ['Multi-tenant', 'Cloud', 'APIs'] },
  { img: 'custom', tag: 'Custom Software', title: 'Custom Software', desc: 'Bespoke systems for the problems off-the-shelf tools cannot solve.', feats: ['Bespoke', 'Integrated', 'In-house'] },
  { img: 'consulting', tag: 'Consulting', title: 'Technology Consulting', desc: 'We map your process, gaps and goals before building anything.', feats: ['Architecture', 'Strategy', 'Roadmap'] },
  { img: 'transform', tag: 'Digital Transformation', title: 'Digital Transformation', desc: 'Modernize operations end-to-end with one connected platform.', feats: ['Legacy to modern', 'End-to-end', 'Measurable'] },
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ROW_LABEL = { approved: 'Approved', hold: 'On Hold', rejected: 'Rejected' };

/* ---- initial state (mirrors `st` + the §2-7 locals in the runtime) ---- */
const initialState = {
  product: 'biz',          // biz | pn | pff
  playing: true,           // hero auto-rotate
  aiTab: 'ai',             // ai | chats | tickets
  chatOpen: false,
  chatName: '',
  chatInitials: '',
  pnView: 'emp',           // emp | mgmt
  pnMenu: null,            // rec | pd | tm | pay | null
  rows: ['open', 'open', 'open'],   // open | approved | hold | rejected
  counts: { a: 24, p: 6, r: 2 },
  tour: true,
  // §2-7
  prodTab: 0,              // 0..2  (products filter)
  indTab: 0,               // 0..6  (industries panel)
  probOn: true,            // problems Align on/off
  orbitStep: 0,            // 0..4  (services orbit)
  orbitPlaying: true,
  svcModal: null,          // 0..5 | null (service modal)
};

function reducer(s, a) {
  switch (a.type) {
    case 'PRODUCT':
      return { ...s, product: a.p, pnMenu: null, playing: a.manual ? false : s.playing };
    case 'NEXT_PRODUCT': {
      const o = ['biz', 'pn', 'pff'];
      return { ...s, product: o[(o.indexOf(s.product) + 1) % 3], pnMenu: null };
    }
    case 'TOGGLE_PAUSE':
      return { ...s, playing: !s.playing };
    case 'AI_TAB':
      return { ...s, aiTab: a.tab };
    case 'OPEN_CHAT':
      return { ...s, chatOpen: true, chatName: a.name, chatInitials: a.initials };
    case 'CLOSE_CHAT':
      return { ...s, chatOpen: false };
    case 'PN_VIEW':
      return { ...s, pnView: a.view };
    case 'PN_MENU':
      return { ...s, pnMenu: s.pnMenu === a.menu ? null : a.menu };
    case 'SHOW_TOUR':
      return { ...s, tour: true };
    case 'HIDE_TOUR':
      return { ...s, tour: false };
    case 'ROW_ACT': {
      if (s.rows[a.i] !== 'open') return s;
      const rows = s.rows.slice(); rows[a.i] = a.kind;
      const counts = { ...s.counts };
      if (a.kind === 'approved') counts.a++;
      else if (a.kind === 'hold') counts.p++;
      else counts.r++;
      return { ...s, rows, counts };
    }
    case 'ROW_RESET': {
      if (s.rows[a.i] !== a.kind) return s;   // already changed/reset — no-op
      const rows = s.rows.slice(); rows[a.i] = 'open';
      const counts = { ...s.counts };
      if (a.kind === 'approved') counts.a--;
      else if (a.kind === 'hold') counts.p--;
      else counts.r--;
      return { ...s, rows, counts };
    }
    case 'PROD_TAB':
      return { ...s, prodTab: a.n };
    case 'IND_TAB':
      return { ...s, indTab: a.n };
    case 'TOGGLE_PROB':
      return { ...s, probOn: !s.probOn };
    case 'ORBIT_GO':
      return {
        ...s,
        orbitStep: ((a.n % ORBIT.length) + ORBIT.length) % ORBIT.length,
        orbitPlaying: a.stop ? false : s.orbitPlaying,
      };
    case 'ORBIT_NEXT':
      return { ...s, orbitStep: (s.orbitStep + 1) % ORBIT.length };
    case 'TOGGLE_ORBIT':
      return { ...s, orbitPlaying: !s.orbitPlaying };
    case 'SVC_OPEN':
      return { ...s, svcModal: a.n };
    case 'SVC_CLOSE':
      return { ...s, svcModal: null };
    default:
      return s;
  }
}

const HomeContext = createContext(null);

export function HomeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [now, setNow] = useState(() => new Date());
  const rowTimers = useRef({});
  // Hero height probe: while `probe === 'all'` every product's hero blocks
  // render at once for a single synchronous layout pass (never painted) so
  // HeroSection can measure the tallest one — see HeroSection.jsx.
  const [probe, setProbe] = useState(null);
  const all = probe === 'all';

  /* live clock — 10s tick (was tickClock + setInterval 10000) */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(id);
  }, []);

  /* hero product auto-rotate — 5.2s (was startAuto) */
  // heroHold: keyboard focus is inside the hero — never swap the product (and
  // unmount the focused demo control) under a keyboard user.
  const heroHold = useRef(false);
  useEffect(() => {
    if (!state.playing) return undefined;
    const id = setInterval(() => { if (!heroHold.current) dispatch({ type: 'NEXT_PRODUCT' }); }, 5200);
    return () => clearInterval(id);
  }, [state.playing]);

  /* services orbit auto-cycle — 2.8s (was orbitAuto) */
  useEffect(() => {
    if (!state.orbitPlaying) return undefined;
    const id = setInterval(() => dispatch({ type: 'ORBIT_NEXT' }), 2800);
    return () => clearInterval(id);
  }, [state.orbitPlaying]);

  /* Escape closes the service modal (was window keydown) */
  useEffect(() => {
    if (state.svcModal == null) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') dispatch({ type: 'SVC_CLOSE' }); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.svcModal]);

  /* clear any pending row-reset timers on unmount */
  const timers = rowTimers.current;
  useEffect(() => () => { Object.values(timers).forEach(clearTimeout); }, [timers]);

  /* ---- c(): condition -> boolean (was cond()) ---- */
  function c(cond) {
    switch (cond) {
      case 'isBiz': return all || state.product === 'biz';
      case 'isPn': return all || state.product === 'pn';
      case 'isPff': return all || state.product === 'pff';
      case 'tourOn': return state.tour && state.product === 'biz';
      case 'tourHidden': return state.product === 'biz' && !state.tour;
      case 'aiTabAI': return state.aiTab === 'ai';
      case 'aiTabChats': return state.aiTab === 'chats';
      case 'aiTabTickets': return state.aiTab === 'tickets';
      case 'chatIsOpen': return state.chatOpen;
      case 'chatListOpen': return !state.chatOpen;
      case 'pnEmp': return state.pnView === 'emp';
      case 'pnMgmt': return state.pnView === 'mgmt';
      case 'pnIsRec': return state.pnMenu === 'rec';
      case 'pnIsPd': return state.pnMenu === 'pd';
      case 'pnIsTm': return state.pnMenu === 'tm';
      case 'pnIsPay': return state.pnMenu === 'pay';
      case 'rowOpen0': return state.rows[0] === 'open';
      case 'rowDone0': return state.rows[0] !== 'open';
      case 'rowOpen1': return state.rows[1] === 'open';
      case 'rowDone1': return state.rows[1] !== 'open';
      case 'rowOpen2': return state.rows[2] === 'open';
      case 'rowDone2': return state.rows[2] !== 'open';
      case 'svcOpenOn': return state.svcModal != null;
      default: return false;
    }
  }

  /* ---- b(): binding -> string (was the data-bk textContent writes) ---- */
  function b(name) {
    const { counts } = state;
    switch (name) {
      case 'aiTitle':
        return state.aiTab === 'ai' ? 'AI Assistant' : state.aiTab === 'chats' ? 'Messages' : 'Tickets';
      case 'chatName': return state.chatName;
      case 'chatInitials': return state.chatInitials;
      case 'clockTime': {
        const h = now.getHours() % 12 || 12;
        return `${h}:${(`0${now.getMinutes()}`).slice(-2)}`;
      }
      case 'clockAmPm': return now.getHours() >= 12 ? 'PM' : 'AM';
      case 'clockDay': return DAYS[now.getDay()];
      case 'clockDate': return `${now.getDate()} ${MON[now.getMonth()]} ${now.getFullYear()}`;
      case 'rowLabel0': return ROW_LABEL[state.rows[0]] || '';
      case 'rowLabel1': return ROW_LABEL[state.rows[1]] || '';
      case 'rowLabel2': return ROW_LABEL[state.rows[2]] || '';
      case 'totalCount': return String(counts.a + counts.p + counts.r);
      case 'approvedCount': return String(counts.a);
      case 'pendingCount': return String(counts.p);
      case 'rejectedCount': return String(counts.r);
      case 'pauseIcon': return state.playing ? '❙❙' : '▶';
      case 'togLabel': return state.probOn ? 'Align ON' : 'Align OFF';
      case 'svcNum': return `0${state.orbitStep + 1}`;
      case 'svcName': return ORBIT[state.orbitStep].name;
      case 'svcOpenTag': return state.svcModal != null ? SVC[state.svcModal].tag : '';
      case 'svcOpenTitle': return state.svcModal != null ? SVC[state.svcModal].title : '';
      case 'svcOpenDesc': return state.svcModal != null ? SVC[state.svcModal].desc : '';
      default: return '';
    }
  }

  /* ---- act(): action name -> dispatch (was the delegated click handler) ---- */
  function act(name) {
    if (name === 'goBiz') return dispatch({ type: 'PRODUCT', p: 'biz', manual: true });
    if (name === 'goPn') return dispatch({ type: 'PRODUCT', p: 'pn', manual: true });
    if (name === 'goPff') return dispatch({ type: 'PRODUCT', p: 'pff', manual: true });
    if (name === 'togglePause') return dispatch({ type: 'TOGGLE_PAUSE' });
    if (name === 'setAI') return dispatch({ type: 'AI_TAB', tab: 'ai' });
    if (name === 'setChats') return dispatch({ type: 'AI_TAB', tab: 'chats' });
    if (name === 'setTickets') return dispatch({ type: 'AI_TAB', tab: 'tickets' });
    if (/^openC\d$/.test(name)) {
      const chat = CHATS[name];
      return dispatch({ type: 'OPEN_CHAT', name: chat[0], initials: chat[1] });
    }
    if (name === 'closeChat') return dispatch({ type: 'CLOSE_CHAT' });
    const rm = /^act(\d)([ahr])$/.exec(name);
    if (rm) {
      const i = +rm[1];
      const kind = rm[2] === 'a' ? 'approved' : rm[2] === 'h' ? 'hold' : 'rejected';
      dispatch({ type: 'ROW_ACT', i, kind });
      clearTimeout(rowTimers.current[i]);
      rowTimers.current[i] = setTimeout(() => dispatch({ type: 'ROW_RESET', i, kind }), 5000);
      return undefined;
    }
    if (name === 'pnRec') return dispatch({ type: 'PN_MENU', menu: 'rec' });
    if (name === 'pnPd') return dispatch({ type: 'PN_MENU', menu: 'pd' });
    if (name === 'pnTm') return dispatch({ type: 'PN_MENU', menu: 'tm' });
    if (name === 'pnPay') return dispatch({ type: 'PN_MENU', menu: 'pay' });
    if (name === 'setEmp') return dispatch({ type: 'PN_VIEW', view: 'emp' });
    if (name === 'setMgmt') return dispatch({ type: 'PN_VIEW', view: 'mgmt' });
    if (name === 'showTour') return dispatch({ type: 'SHOW_TOUR' });
    if (name === 'hideTour') return dispatch({ type: 'HIDE_TOUR' });
    // §2-7
    const pm = /^setProd(\d)$/.exec(name);
    if (pm) return dispatch({ type: 'PROD_TAB', n: +pm[1] });
    const im = /^setInd(\d)$/.exec(name);
    if (im) return dispatch({ type: 'IND_TAB', n: +im[1] });
    if (name === 'toggleAbs') return dispatch({ type: 'TOGGLE_PROB' });
    if (name === 'toggleAuto') return dispatch({ type: 'TOGGLE_ORBIT' });
    const so = /^svcOpen(\d)$/.exec(name);
    if (so) return dispatch({ type: 'SVC_OPEN', n: +so[1] });
    if (name === 'closeSvc') return dispatch({ type: 'SVC_CLOSE' });
    // svcNext / svcPrev / svcStop are handled locally in ServicesSection (carousel ref).
    return undefined;
  }

  const value = { state, dispatch, c, b, act, probe, setProbe, heroHold };
  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHome() {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error('useHome must be used within <HomeProvider>');
  return ctx;
}

/* Props that make a non-button element (card, demo tab, mockup row) behave
   like a button for keyboard users: focusable, announced as a button, and
   activated with Enter/Space as well as click. Visible focus ring: home.css. */
export function pressable(fn, extra) {
  return {
    role: 'button',
    tabIndex: 0,
    onClick: fn,
    onKeyDown: (e) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); }
    },
    ...extra,
  };
}

/* The mockup wrappers only become horizontally scrollable at <=1024px
   (home.css); only then do they need to be a focusable, labelled region so
   keyboard users can scroll them. */
const NARROW_Q = '(max-width: 1024px)';
export function useScrollRegionProps(label) {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(NARROW_Q).matches);
  useEffect(() => {
    const mq = window.matchMedia(NARROW_Q);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return narrow ? { tabIndex: 0, role: 'region', 'aria-label': label } : {};
}
