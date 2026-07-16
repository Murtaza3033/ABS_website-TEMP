/* index runtime — ported from the static home.js (shell-assets loader removed).
   Runs against the rendered markup; captures every interval/timeout/rAF/listener it creates and
   returns a teardown() so the React effect cleanup leaves nothing running. */
export function runPage() {
  const _si = window.setInterval, _st = window.setTimeout, _raf = window.requestAnimationFrame, _caf = window.cancelAnimationFrame;
  const _ael = EventTarget.prototype.addEventListener;
  const iv = [], to = [], af = [], ls = [];
  window.setInterval = function () { const id = _si.apply(window, arguments); iv.push(id); return id; };
  window.setTimeout = function () { const id = _st.apply(window, arguments); to.push(id); return id; };
  window.requestAnimationFrame = function () { const id = _raf.apply(window, arguments); af.push(id); return id; };
  EventTarget.prototype.addEventListener = function () { ls.push([this, arguments]); return _ael.apply(this, arguments); };
  try {
/* ================= ported home.js runtime ================= */

(function () {
  var ICONS = {
    doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/>',
    users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    chart:'<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/>',
    flow:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="12" r="3"/><path d="M8.7 7.5 15 10.5"/><path d="M8.7 16.5 15 13.5"/>',
    boxes:'<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
    gauge:'<circle cx="12" cy="12" r="9"/><path d="M12 12l4-2"/><path d="M12 3v2"/><path d="M3 12h2"/>',
    globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20"/><path d="M12 2a15 15 0 0 0 0 20"/>',
    cloud:'<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
    about:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    trend:'<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
    shield:'<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
    building:'<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"/>',
    handshake:'<path d="M11 17l2 2 4-4"/><path d="M2 12l4-4 4 4-4 4-4-4z"/><path d="M14 12l4-4 4 4-4 4"/>'
  };
  function svg(name, sz){ return '<svg width="'+(sz||22)+'" height="'+(sz||22)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[name]||'')+'</svg>'; }
  var EXT = { businessflo:'https://businessflo.co', peoplenest:'https://peoplenest.co', fieldforce:'https://pharmafieldflo.co' };
  var $ = function (s, r) { return (r || document).querySelector(s); };

  var PRODUCTS = [
    { key:'businessflo', name:'BusinessFlo', tag:'Finance & Ops', href:EXT.businessflo, icon:'doc', accent:'#1a56db',
      desc:'Finance, inventory, procurement and approvals — the whole operation in one connected flow.',
      kpis:[['Revenue','₨ 4.2M','+12%'],['Orders','1,284','+8%'],['Approvals','96%','on-time']], bars:[52,74,61,88,70,94] },
    { key:'peoplenest', name:'PeopleNest', tag:'People & Payroll', href:EXT.peoplenest, icon:'users', accent:'#1a9d55',
      desc:'Attendance, leave, payroll and people analytics — one place for managers and every employee.',
      kpis:[['Present','312','94%'],['On leave','18','today'],['Payroll','Ready','Mar']], bars:[80,62,91,70,84,76] },
    { key:'fieldforce', name:'Field Force', tag:'Field & Sales', href:EXT.fieldforce, icon:'chart', accent:'#d4a017',
      desc:'Field visits, samples, routes and live KPIs — full visibility over teams on the ground.',
      kpis:[['Routes','42','active'],['Visits','318','+21%'],['Delivered','97%','SLA']], bars:[66,58,82,90,64,88] }
  ];
  var VALUES = [
    { t:'Every department, one system', d:'Finance, HR and field teams work from one connected platform — not a patchwork of disconnected tools.', ic:'flow' },
    { t:'Nothing lives in a silo', d:'Payments, attendance, approvals and reporting connect natively — no middleware, no exports, no manual sync.', ic:'boxes' },
    { t:'Dashboards that decide, not just display', d:'Live visibility into every process, with the context to act on it — not just a report to read after the fact.', ic:'gauge' }
  ];
  var SERVICES = [
    { t:'Web Development', d:'Fast, scalable web applications built around your real workflows.', ic:'globe', img:'web' },
    { t:'Mobile Apps', d:'Native-quality iOS and Android apps for teams on the move.', ic:'chart', img:'mobile' },
    { t:'SaaS Platforms', d:'Multi-tenant products engineered to scale securely.', ic:'cloud', img:'saas' },
    { t:'Custom Software', d:'Bespoke systems for the problems off-the-shelf tools can’t solve.', ic:'doc', img:'custom' },
    { t:'Consulting', d:'We map your process, gaps and goals before building anything.', ic:'about', img:'consulting' },
    { t:'Digital Transformation', d:'Modernize operations end-to-end with one connected platform.', ic:'trend', img:'transform' }
  ];
  var PROCESS = [
    ['Discovery & Fit','We map your process, teams, gaps and operational goals before building anything.'],
    ['Product Engineering','We design and develop scalable software products around your real workflows.'],
    ['Implementation','We deploy, configure, train and launch systems with minimal disruption.'],
    ['Support & SLA','We stay involved with support, updates, improvements and managed service.'],
    ['Insight & Optimization','We use feedback, analytics and usage data to continuously improve operations.']
  ];
  var INDUSTRIES = [
    { key:'manufacturing', label:'Manufacturing', ic:'boxes', tint:'#1a56db' },
    { key:'pharma', label:'Pharmaceutical', ic:'shield', tint:'#1a9d55' },
    { key:'retail', label:'Retail', ic:'building', tint:'#d4a017' },
    { key:'distribution', label:'Distribution', ic:'flow', tint:'#1a56db' },
    { key:'hr', label:'HR & Workforce', ic:'users', tint:'#1a9d55' },
    { key:'enterprise', label:'Enterprise', ic:'gauge', tint:'#1a56db' },
    { key:'services', label:'Services', ic:'handshake', tint:'#d4a017' }
  ];
  var CLIENTS = [['Dipitt','dipitt-logo'],['Danpak','danpak-logo'],['Noon','noon-logo'],['KG','kg-logo'],['Nectek','nectek-logo'],['Zamanat','zamanat-logo'],['Coarts','coarts-lighting-solutin'],['Greeeno','greeeno-logo'],['Powerhouse','powerhouse-builiding-solution-logo'],['Allied','allied-logo'],['Oncogen','oncogen-pharma-pakistan-logo'],['Clipsal','clipsal-logo'],['Maxim','maxim-logo'],['BusCaro','buscaro-logo-original-scaled'],['TechExons','techexons-logo'],['Afeef',null],['Omega','omega-enterprises-logo'],['VSolar','vsolar-logo']];

  /* hero interactions moved to dedicated runtime script (verbatim design markup) */

  /* §2-§7 render moved to dedicated body runtime (verbatim design markup) */

  /* ---- reveal-on-scroll (+ wipe) ---- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function play(el) { el.classList.add('in'); el.style.opacity='1'; el.style.transform='none'; var ws = el.matches('[data-wipe]') ? [el] : el.querySelectorAll('[data-wipe]'); ws.forEach(function (w) { w.style.opacity = '1'; w.style.clipPath = 'inset(0 0 0 0)'; }); }
  var all = function () { return document.querySelectorAll('[data-reveal]'); };
  if (reduce) { all().forEach(play); }
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { play(e.target); io.unobserve(e.target); } }); }, { threshold: 0.15 });
    all().forEach(function (el) { io.observe(el); });
    requestAnimationFrame(function () { all().forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight * 0.92) play(el); }); });
  }
})();

;

(function () {
  var hero = document.querySelector('section[data-screen-label="Hero"]');
  if (!hero) return;
  var q = function (s, r) { return (r || hero).querySelector(s); };
  var qa = function (s, r) { return Array.prototype.slice.call((r || hero).querySelectorAll(s)); };

  var st = { product: 'biz', playing: true, aiTab: 'ai', chatOpen: false,
             pnView: 'emp', pnMenu: null, rows: ['open', 'open', 'open'],
             tour: true, toast: false, counts: { a: 24, p: 6, r: 2 }, _tt: null };

  function cond(c) {
    switch (c) {
      case 'isBiz': return st.product === 'biz'; case 'isPn': return st.product === 'pn'; case 'isPff': return st.product === 'pff';
      case 'tourOn': return st.tour && st.product === 'biz'; case 'tourHidden': return st.product === 'biz' && !st.tour;
      case 'aiTabAI': return st.aiTab === 'ai'; case 'aiTabChats': return st.aiTab === 'chats'; case 'aiTabTickets': return st.aiTab === 'tickets';
      case 'chatIsOpen': return st.chatOpen; case 'chatListOpen': return !st.chatOpen;
      case 'pnEmp': return st.pnView === 'emp'; case 'pnMgmt': return st.pnView === 'mgmt';
      case 'pnIsRec': return st.pnMenu === 'rec'; case 'pnIsPd': return st.pnMenu === 'pd'; case 'pnIsTm': return st.pnMenu === 'tm'; case 'pnIsPay': return st.pnMenu === 'pay';
      case 'rowOpen0': return st.rows[0] === 'open'; case 'rowDone0': return st.rows[0] !== 'open';
      case 'rowOpen1': return st.rows[1] === 'open'; case 'rowDone1': return st.rows[1] !== 'open';
      case 'rowOpen2': return st.rows[2] === 'open'; case 'rowDone2': return st.rows[2] !== 'open';
      case 'toastShow': return st.toast;
    }
    return false;
  }
  function applyScif() { Array.prototype.slice.call(document.querySelectorAll('.scif')).forEach(function (el) { el.style.display = cond(el.getAttribute('data-cond')) ? 'contents' : 'none'; }); }

  function setSwitcher() {
    [['goBiz', 'biz'], ['goPn', 'pn'], ['goPff', 'pff']].forEach(function (p) {
      var b = q('[data-act="' + p[0] + '"]'); if (!b) return; var on = st.product === p[1];
      b.style.background = on ? '#1a56db' : 'transparent'; b.style.color = on ? '#ffffff' : '#5b6472';
    });
  }
  function setAiTabs() {
    [['setAI', 'ai'], ['setChats', 'chats'], ['setTickets', 'tickets']].forEach(function (p) {
      var el = q('[data-act="' + p[0] + '"]'); if (!el) return; var on = st.aiTab === p[1];
      el.style.color = on ? '#1a56db' : '#8a94a6'; el.style.borderBottom = '2px solid ' + (on ? '#1a56db' : 'transparent');
    });
    var t = q('[data-bk="aiTitle"]'); if (t) t.textContent = st.aiTab === 'ai' ? 'AI Assistant' : (st.aiTab === 'chats' ? 'Messages' : 'Tickets');
  }
  function setPnPills() {
    var e = q('[data-act="setEmp"]'), m = q('[data-act="setMgmt"]');
    if (e) { var on = st.pnView === 'emp'; e.style.color = on ? '#ffffff' : '#39404d'; e.style.background = on ? '#1a56db' : '#ffffff'; e.style.border = '1px solid ' + (on ? '#1a56db' : '#e0e6f0'); }
    if (m) { var o2 = st.pnView === 'mgmt'; m.style.color = o2 ? '#ffffff' : '#39404d'; m.style.background = o2 ? '#1a56db' : '#ffffff'; m.style.border = '1px solid ' + (o2 ? '#1a56db' : '#e0e6f0'); }
  }
  function setPnMenus() {
    [['pnRec', 'rec'], ['pnPd', 'pd'], ['pnTm', 'tm'], ['pnPay', 'pay']].forEach(function (p) {
      var b = q('[data-act="' + p[0] + '"]'); if (!b) return; b.style.color = st.pnMenu === p[1] ? '#1a56db' : '#39404d';
    });
  }
  function setDonut() {
    var c = st.counts, tot = c.a + c.p + c.r, aDeg = tot ? c.a / tot * 360 : 0, pDeg = tot ? c.p / tot * 360 : 0;
    var el = q('[style*="conic-gradient"]');
    if (el) el.style.background = 'conic-gradient(#64748b 0deg ' + aDeg + 'deg,#f5b40a ' + aDeg + 'deg ' + (aDeg + pDeg) + 'deg,#e5484d ' + (aDeg + pDeg) + 'deg 360deg)';
    var set = function (n, v) { var x = q('[data-bk="' + n + '"]'); if (x) x.textContent = v; };
    set('totalCount', tot); set('approvedCount', c.a); set('pendingCount', c.p); set('rejectedCount', c.r);
  }
  function showToast(kind) {
    var txt = kind === 'approved' ? 'Request approved' : (kind === 'hold' ? 'Request put on hold' : 'Request rejected');
    var col = kind === 'approved' ? '#1a9d55' : (kind === 'hold' ? '#b78103' : '#e5484d');
    var ic = kind === 'approved' ? '✓' : (kind === 'hold' ? '❚' : '✕');
    st.toast = true; applyScif();
    var box = document.querySelector('[data-cond="toastShow"]');
    if (box) {
      var div = box.querySelector('div'); if (div) div.style.borderLeftColor = col;
      var circle = box.querySelector('span'); if (circle) { circle.style.background = col; circle.style.color = '#fff'; }
      var tt = box.querySelector('[data-bk="toastText"]'); if (tt) tt.textContent = txt;
      var ti = box.querySelector('[data-bk="toastIcon"]'); if (ti) ti.textContent = ic;
    }
    clearTimeout(st._tt); st._tt = setTimeout(function () { st.toast = false; applyScif(); }, 2600);
  }
  function actRow(i, kind) {
    if (st.rows[i] !== 'open') return;
    st.rows[i] = kind;
    var lbl = kind === 'approved' ? 'Approved' : (kind === 'hold' ? 'On Hold' : 'Rejected');
    var col = kind === 'approved' ? '#1a9d55' : (kind === 'hold' ? '#b78103' : '#e5484d');
    var bg = kind === 'approved' ? '#e6f5ec' : (kind === 'hold' ? '#fdf3d7' : '#fdeaea');
    var lblEl = q('[data-bk="rowLabel' + i + '"]');
    if (lblEl) { lblEl.textContent = lbl; var pill = lblEl.parentElement; if (pill) { pill.style.color = col; pill.style.background = bg; } }
    if (kind === 'approved') st.counts.a++; else if (kind === 'hold') st.counts.p++; else st.counts.r++;
    applyScif(); setDonut(); showToast(kind);
    st._rt = st._rt || {};
    clearTimeout(st._rt[i]);
    st._rt[i] = setTimeout(function () {
      st.rows[i] = 'open';
      if (kind === 'approved') st.counts.a--; else if (kind === 'hold') st.counts.p--; else st.counts.r--;
      applyScif(); setDonut();
    }, 5000);
  }
  function tickClock() {
    var d = new Date(), h = d.getHours(), m = ('0' + d.getMinutes()).slice(-2), ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var set = function (n, v) { var x = q('[data-bk="' + n + '"]'); if (x) x.textContent = v; };
    set('clockTime', h + ':' + m); set('clockAmPm', ap); set('clockDay', days[d.getDay()]);
    set('clockDate', d.getDate() + ' ' + mon[d.getMonth()] + ' ' + d.getFullYear());
  }
  var CHATS = { openC0: ['Zainab Malik', 'ZM'], openC1: ['Bilal Sattar', 'BS'], openC2: ['Hooria Naveed', 'HN'], openC3: ['Usman Tariq', 'UT'], openC4: ['Mehwish Anwar', 'MA'] };
  function replay(p) {
    ['isBiz', 'isPn', 'isPff'].forEach(function (c) {
      if (!cond(c)) return;
      qa('.scif[data-cond="' + c + '"]').forEach(function (w) { var d = w.firstElementChild; if (d) { d.style.animation = 'none'; void d.offsetWidth; d.style.animation = ''; } });
    });
  }
  var timer = null;
  function pauseAuto() { st.playing = false; if (timer) { clearInterval(timer); timer = null; } var pb = q('[data-act="togglePause"]'); if (pb) pb.textContent = '▶'; }
  function goProduct(p, manual) { st.product = p; st.pnMenu = null; applyScif(); setSwitcher(); replay(); if (p === 'pn') { setPnPills(); setPnMenus(); } if (manual) pauseAuto(); }

  function startAuto() { if (timer) clearInterval(timer); if (st.playing) timer = setInterval(function () { var o = ['biz', 'pn', 'pff'], i = o.indexOf(st.product); goProduct(o[(i + 1) % 3]); }, 5200); }

  hero.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-act]') : null; if (!el) return;
    var a = el.getAttribute('data-act');
    if (a === 'goBiz') goProduct('biz', true);
    else if (a === 'goPn') goProduct('pn', true);
    else if (a === 'goPff') goProduct('pff', true);
    else if (a === 'togglePause') { st.playing = !st.playing; el.textContent = st.playing ? '❙❙' : '▶'; startAuto(); }
    else if (a === 'setAI') { st.aiTab = 'ai'; applyScif(); setAiTabs(); }
    else if (a === 'setChats') { st.aiTab = 'chats'; applyScif(); setAiTabs(); }
    else if (a === 'setTickets') { st.aiTab = 'tickets'; applyScif(); setAiTabs(); }
    else if (/^openC\d$/.test(a)) { var c = CHATS[a]; st.chatOpen = true; var n = q('[data-bk="chatName"]'); if (n) n.textContent = c[0]; var ini = q('[data-bk="chatInitials"]'); if (ini) ini.textContent = c[1]; applyScif(); }
    else if (a === 'closeChat') { st.chatOpen = false; applyScif(); }
    else if (/^act\d[ahr]$/.test(a)) { actRow(+a.charAt(3), a.charAt(4) === 'a' ? 'approved' : (a.charAt(4) === 'h' ? 'hold' : 'rejected')); }
    else if (a === 'pnRec' || a === 'pnPd' || a === 'pnTm' || a === 'pnPay') { var k = { pnRec: 'rec', pnPd: 'pd', pnTm: 'tm', pnPay: 'pay' }[a]; st.pnMenu = st.pnMenu === k ? null : k; applyScif(); setPnMenus(); }
    else if (a === 'setEmp') { st.pnView = 'emp'; applyScif(); setPnPills(); }
    else if (a === 'setMgmt') { st.pnView = 'mgmt'; applyScif(); setPnPills(); }
    else if (a === 'showTour') { st.tour = true; applyScif(); }
  });

  qa('[data-sh]').forEach(function (el) {
    var hov = el.getAttribute('data-sh');
    el.addEventListener('mouseenter', function () { el.__b = el.getAttribute('style') || ''; el.setAttribute('style', el.__b + ';' + hov); });
    el.addEventListener('mouseleave', function () { if (el.__b != null) el.setAttribute('style', el.__b); });
  });

  applyScif(); setSwitcher(); setAiTabs(); setPnPills(); setPnMenus(); setDonut();
  tickClock(); setInterval(tickClock, 10000); startAuto();
})();

;

(function () {
  var q = function (s, r) { return (r || document).querySelector(s); };
  var qa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* hover for [data-sh] in the .ag body sections */
  qa('.ag [data-sh]').forEach(function (el) {
    var hov = el.getAttribute('data-sh');
    el.addEventListener('mouseenter', function () { el.__b = el.getAttribute('style') || ''; el.setAttribute('style', el.__b + ';' + hov); });
    el.addEventListener('mouseleave', function () { if (el.__b != null) el.setAttribute('style', el.__b); });
  });

  /* ---- Clients mosaic: full-colour logos that gently rotate ---- */
  var LOGOS = [['Dipitt', 'dipitt-logo'], ['Danpak', 'danpak-logo'], ['Noon', 'noon-logo'], ['Nectek', 'nectek-logo'], ['Zamanat', 'zamanat-logo'], ['Greeeno', 'greeeno-logo'], ['Allied', 'allied-logo'], ['Oncogen', 'oncogen-pharma-pakistan-logo'], ['Clipsal', 'clipsal-logo'], ['Maxim', 'maxim-logo'], ['TechExons', 'techexons-logo'], ['Omega', 'omega-enterprises-logo'], ['VSolar', 'vsolar-logo'], ['Coarts', 'coarts-lighting-solutin'], ['Powerhouse', 'powerhouse-builiding-solution-logo'], ['KG', 'kg-logo'], ['Buscaro', 'buscaro-logo-original-scaled'], ['Maxim', 'maxim-logo']];
  var slots = qa('[data-logo-slot]');
  slots.forEach(function (slot) { slot.style.position = 'relative'; slot.style.overflow = 'hidden'; });
  function setLogo(slot, c, animate) {
    var img = document.createElement('img');
    img.src = '/assets/images/clients/' + c[1] + '.png'; img.alt = c[0];
    img.style.cssText = 'position:absolute;top:19%;left:9%;width:82%;height:62%;object-fit:contain;opacity:' + (animate ? '0' : '1') + ';transition:opacity .55s ease;';
    img.onerror = function () { img.style.display = 'none'; };
    var prev = Array.prototype.slice.call(slot.children);
    slot.appendChild(img);
    if (animate) requestAnimationFrame(function () { img.style.opacity = '1'; });
    prev.forEach(function (ch) { ch.style.transition = 'opacity .55s ease'; ch.style.opacity = '0'; setTimeout(function () { if (ch.parentNode) ch.parentNode.removeChild(ch); }, 620); });
  }
  var cur = slots.map(function (_, i) { return i % LOGOS.length; });
  slots.forEach(function (slot, i) { setLogo(slot, LOGOS[cur[i]], false); });
  if (slots.length) {
    var ptr = 0;
    setInterval(function () {
      for (var k = 0; k < 3; k++) {
        var si = (ptr++) % slots.length;
        cur[si] = (cur[si] + slots.length) % LOGOS.length;
        setLogo(slots[si], LOGOS[cur[si]], true);
      }
    }, 2200);
  }

  /* ---- Problems: Align on/off toggle (CSS vars) ---- */
  var probSec = q('section[data-screen-label="Problems We Solve"]');
  var probOn = true;
  function setProb(on) {
    probOn = on; if (!probSec) return;
    probSec.style.setProperty('--wOn', on ? '1' : '0');
    probSec.style.setProperty('--wOff', on ? '0' : '1');
    probSec.style.setProperty('--wLabel', on ? '#1a56db' : '#e5484d');
    probSec.style.setProperty('--wTrack', on ? '#1a56db' : '#c9d3e0');
    probSec.style.setProperty('--wKnob', on ? 'translateX(29px)' : 'translateX(0)');
    var lbl = q('[data-bk="togLabel"]', probSec); if (lbl) lbl.textContent = on ? 'Align ON' : 'Align OFF';
  }
  var togBtn = q('[data-act="toggleAbs"]'); if (togBtn) togBtn.addEventListener('click', function () { setProb(!probOn); });
  setProb(true);

  /* ---- Products: tab-filtered floating cards ---- */
  function setProd(n) {
    [['setProd0', 0], ['setProd1', 1], ['setProd2', 2]].forEach(function (p) {
      var el = q('[data-act="' + p[0] + '"]'); if (!el) return; var on = p[1] === n;
      el.style.background = on ? '#ffffff' : 'rgba(255,255,255,.55)';
      el.style.borderColor = on ? '#1a56db' : '#e7ecf5';
      el.style.boxShadow = on ? '0 20px 44px -22px rgba(26,86,219,.4)' : 'none';
    });
    var map = ['fin', 'pen', 'fie'];
    qa('[data-pg]').forEach(function (el) { el.style.display = el.getAttribute('data-pg') === map[n] ? 'block' : 'none'; });
  }
  [['setProd0', 0], ['setProd1', 1], ['setProd2', 2]].forEach(function (p) { var el = q('[data-act="' + p[0] + '"]'); if (el) el.addEventListener('click', function () { setProd(p[1]); }); });
  setProd(0);

  /* ---- Industries: tab-switched showcase panels ---- */
  function setInd(n) {
    for (var i = 0; i < 7; i++) { var b = q('[data-act="setInd' + i + '"]'); if (b) { var on = i === n; b.style.background = on ? '#1a56db' : '#ffffff'; b.style.color = on ? '#ffffff' : '#5b6472'; b.style.borderColor = on ? '#1a56db' : '#e4eaf3'; } }
    qa('[data-indp]').forEach(function (p) { var on = +p.getAttribute('data-indp') === n; p.style.opacity = on ? '1' : '0'; p.style.transform = on ? 'none' : 'translateY(20px)'; p.style.pointerEvents = on ? 'auto' : 'none'; });
  }
  for (var ii = 0; ii < 7; ii++) { (function (i) { var b = q('[data-act="setInd' + i + '"]'); if (b) b.addEventListener('click', function () { setInd(i); }); })(ii); }
  setInd(0);

  /* ---- Services: orbit step-cycler ---- */
  var ORBIT = [
    { name: 'Discovery', arrow: 'M300,228 L300,150' },
    { name: 'Engineering', arrow: 'M356,262 L442,214' },
    { name: 'Implementation', arrow: 'M346,346 L398,392' },
    { name: 'Support', arrow: 'M254,346 L202,392' },
    { name: 'Insight', arrow: 'M244,262 L162,214' }
  ];
  var stageEls = qa('[data-svc-stage]');
  var orbit = { step: 0, playing: true, timer: null };
  function renderOrbit() {
    var n = orbit.step;
    var num = q('[data-bk="svcNum"]'); if (num) num.textContent = '0' + (n + 1);
    var nm = q('[data-bk="svcName"]'); if (nm) nm.textContent = ORBIT[n].name;
    var bars = q('[data-svc-bars]'); if (bars) Array.prototype.slice.call(bars.children).forEach(function (bEl, i) { bEl.style.background = i <= n ? '#1a56db' : '#dbe6fb'; });
    qa('[data-svc-arrow]').forEach(function (p) { p.setAttribute('d', ORBIT[n].arrow); });
    stageEls.forEach(function (el, i) {
      var card = el.querySelector('.svc-card'); if (!card) return; var on = i === n;
      card.style.borderColor = on ? '#1a56db' : '#eaeef5';
      card.style.boxShadow = on ? '0 26px 56px -18px rgba(26,86,219,.5)' : '0 14px 34px -18px rgba(15,23,41,.22)';
      card.style.transform = on ? 'scale(1.045)' : 'scale(1)';
      el.style.zIndex = on ? '9' : '5';
    });
  }
  function orbitGo(n) { orbit.step = ((n % ORBIT.length) + ORBIT.length) % ORBIT.length; renderOrbit(); }
  function orbitAuto() { if (orbit.timer) clearInterval(orbit.timer); if (orbit.playing) orbit.timer = setInterval(function () { orbitGo(orbit.step + 1); }, 2800); }
  stageEls.forEach(function (el, i) { el.addEventListener('click', function () { orbit.playing = false; if (orbit.timer) { clearInterval(orbit.timer); orbit.timer = null; } orbitGo(i); }); });
  var centerNode = q('[data-act="toggleAuto"]'); if (centerNode) centerNode.addEventListener('click', function () { orbit.playing = !orbit.playing; orbitAuto(); });
  if (stageEls.length) { renderOrbit(); orbitAuto(); }

  /* ---- Services: carousel scroll ---- */
  var scroll = q('[data-svc-scroll]');
  var pv = q('[data-act="svcPrev"]'), nx = q('[data-act="svcNext"]');
  if (scroll) { if (pv) pv.addEventListener('click', function () { scroll.scrollBy({ top: -156, behavior: 'smooth' }); }); if (nx) nx.addEventListener('click', function () { scroll.scrollBy({ top: 156, behavior: 'smooth' }); }); }

  /* ---- Services: card modal ---- */
  var SVC = [
    { img: 'web', tag: 'Web Development', title: 'Web Development', desc: 'Fast, scalable web applications built around your real workflows.', feats: ['Responsive', 'Scalable', 'Secure'] },
    { img: 'mobile', tag: 'Mobile Apps', title: 'Mobile App Development', desc: 'Native-quality iOS and Android apps for teams on the move.', feats: ['iOS', 'Android', 'Offline-ready'] },
    { img: 'saas', tag: 'SaaS', title: 'SaaS Development', desc: 'Multi-tenant products engineered to scale securely.', feats: ['Multi-tenant', 'Cloud', 'APIs'] },
    { img: 'custom', tag: 'Custom Software', title: 'Custom Software', desc: 'Bespoke systems for the problems off-the-shelf tools cannot solve.', feats: ['Bespoke', 'Integrated', 'In-house'] },
    { img: 'consulting', tag: 'Consulting', title: 'Technology Consulting', desc: 'We map your process, gaps and goals before building anything.', feats: ['Architecture', 'Strategy', 'Roadmap'] },
    { img: 'transform', tag: 'Digital Transformation', title: 'Digital Transformation', desc: 'Modernize operations end-to-end with one connected platform.', feats: ['Legacy to modern', 'End-to-end', 'Measurable'] }
  ];
  var modal = q('.scif[data-cond="svcOpenOn"]');
  if (modal) modal.style.display = 'none';
  function openSvc(n) {
    if (!modal) return; var s = SVC[n];
    var imgd = modal.querySelector('[style*="background-image"]'); if (imgd) imgd.style.backgroundImage = "url('/assets/images/services/" + s.img + ".png')";
    var tag = modal.querySelector('[data-bk="svcOpenTag"]'); if (tag) tag.textContent = s.tag;
    var ti = modal.querySelector('[data-bk="svcOpenTitle"]'); if (ti) ti.textContent = s.title;
    var de = modal.querySelector('[data-bk="svcOpenDesc"]'); if (de) de.textContent = s.desc;
    var fc = modal.querySelector('div[style*="flex-wrap:wrap"][style*="margin-top:20px"]');
    if (fc) fc.innerHTML = s.feats.map(function (l, i) { return '<span style="font-size:12.5px;font-weight:600;color:#31405c;background:#f2f6fc;border:1px solid #e3ecfd;border-radius:999px;padding:7px 13px;animation:svcFeatIn .5s ease ' + (i * 0.1) + 's both;">' + l + '</span>'; }).join('');
    modal.style.display = 'contents';
  }
  function closeSvc() { if (modal) modal.style.display = 'none'; }
  [0, 1, 2, 3, 4, 5].forEach(function (n) { var el = q('[data-act="svcOpen' + n + '"]'); if (el) el.addEventListener('click', function () { openSvc(n); }); });
  qa('[data-act="closeSvc"]').forEach(function (el) { el.addEventListener('click', closeSvc); });
  var stop = q('[data-act="svcStop"]'); if (stop) stop.addEventListener('click', function (e) { e.stopPropagation(); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSvc(); });
})();

/* ================= end ported runtime ============================= */
  } finally {
    // Restore the sync-scoped patches (init-time interval/timeout/listener registrations are
    // already captured). Keep requestAnimationFrame patched so self-rescheduling animation loops
    // (particle canvas, constellation, etc.) keep pushing their frame ids into af[] for teardown.
    window.setInterval = _si; window.setTimeout = _st;
    EventTarget.prototype.addEventListener = _ael;
  }
  return function teardown() {
    window.requestAnimationFrame = _raf; // restore
    iv.forEach((id) => clearInterval(id));
    to.forEach((id) => clearTimeout(id));
    af.forEach((id) => _caf(id));         // cancel the (latest tracked) animation frame -> loop stops
    ls.forEach((pair) => { try { pair[0].removeEventListener.apply(pair[0], pair[1]); } catch (e) { /* detached */ } });
  };
}
