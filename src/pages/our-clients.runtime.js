/* our-clients runtime — ported from the static our-clients.js (shell-assets loader removed).
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
/* ================= ported our-clients.js runtime ================= */

(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var T = '/assets/images/clients/';
  function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/'/g,'&#39;'); }
  function icon(name) {
    var P = {
      cup:'<path d="M6 2h12v3a6 6 0 0 1-12 0z"/><path d="M6 5H4a2 2 0 0 0 0 4h2"/><path d="M18 5h2a2 2 0 0 1 0 4h-2"/><path d="M8 15h8v5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"/>',
      cross:'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
      bulb:'<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.5.4.8 1 .9 1.6h6.2c.1-.6.4-1.2.9-1.6A7 7 0 0 0 12 2z"/>',
      building:'<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"/>',
      sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',
      chip:'<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>'
    };
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(P[name]||'')+'</svg>';
  }

  /* CLIENT WALL — logo with onerror -> name wordmark fallback (non-blocking) */
  var CLIENTS = [
    ['BusCaro','buscaro-logo-original-scaled'],['Powerhouse Building Solutions','powerhouse-builiding-solution-logo'],
    ['Dipitt','dipitt-logo'],['NexTek HealthCare','nectek-logo'],['Allied','allied-logo'],['Techexons','techexons-logo'],
    ['Coarts Lighting Solutions','coarts-lighting-solutin'],['Oncogen Pharma','oncogen-pharma-pakistan-logo'],
    ['KG (King’s Group)','kg-logo'],['Zamanat','zamanat-logo'],['Danpak','danpak-logo'],['Noon','noon-logo'],
    ['greenO','greeeno-logo'],['PV360',null],['Clipsal','clipsal-logo'],['Maxim','maxim-logo'],
    ['FIPCo',null],['Hasco Steel',null],['VSolar','vsolar-logo'],['Omega Enterprises','omega-enterprises-logo']
  ];
  var durs = ['6.5s','7.4s','6.9s','8.1s','7s','6.2s','7.8s','6.6s'];
  var dels = ['0s','.5s','.2s','.8s','1.1s','.3s','.7s','1s','.15s','.6s','.9s','.35s'];

  /* SECTORS (defined first so the wall can tag each logo with its industry) */
  var SECTORS = [
    ['Food, Beverage & FMCG','cup',['Dipitt','Danpak','greenO','FIPCo','Maxim']],
    ['Pharmaceutical & Healthcare','cross',['Oncogen Pharma','NexTek HealthCare']],
    ['Lighting & Electrical','bulb',['Coarts Lighting Solutions','Clipsal','Allied']],
    ['Construction, Building & Real Estate','building',['Powerhouse Building Solutions','Zamanat','Hasco Steel','KG (King’s Group)']],
    ['Energy & Solar','sun',['PV360','VSolar']],
    ['Technology, Trading & Mobility','chip',['BusCaro','Techexons','Noon','Omega Enterprises']]
  ];
  var SHORT = ['Food & FMCG','Pharma & Health','Lighting','Construction','Energy & Solar','Technology'];
  var INDOF = {}; SECTORS.forEach(function (s, si) { s[2].forEach(function (m) { INDOF[m] = si; }); });

  /* CLIENT WALL — logo grayscale->color, industry tag, hover caption */
  $('[data-wall]').innerHTML = CLIENTS.map(function (c, i) {
    var name = c[0], file = c[1];
    var ind = (name in INDOF) ? INDOF[name] : -1;
    var body;
    if (file) {
      body = '<img class="clLogo" src="'+T+file+'.png" alt="'+esc(name)+'" style="width:100%;height:82px;object-fit:contain;" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\';">'
           + '<span style="display:none;font-size:22px;font-weight:800;letter-spacing:-.5px;color:#0f1729;text-align:center;">'+esc(name)+'</span>';
    } else {
      body = '<span style="font-size:22px;font-weight:800;letter-spacing:-.5px;color:#0f1729;text-align:center;">'+esc(name)+'</span>';
    }
    return '<div class="clCard" data-reveal data-ind="'+ind+'" style="background:#fff;border:1px solid #eef2f8;border-radius:20px;box-shadow:0 16px 40px -28px rgba(15,23,41,.28);height:150px;display:flex;align-items:center;justify-content:center;padding:26px;animation:floatY '+durs[i%durs.length]+' ease-in-out '+dels[i%dels.length]+' infinite;">'+body+'<div class="clCap">'+esc(name)+'</div></div>';
  }).join('');

  /* INDUSTRY HIGHLIGHT FILTER */
  (function () {
    var bar = $('[data-filters]'); if (!bar) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-wall] .clCard'));
    var labels = ['All Clients'].concat(SHORT);
    bar.innerHTML = labels.map(function (l, i) {
      return '<button class="filt'+(i === 0 ? ' on' : '')+'" data-f="'+(i - 1)+'"><span class="fdot"></span>'+l+'</button>';
    }).join('');
    var btns = Array.prototype.slice.call(bar.querySelectorAll('.filt'));
    function apply(idx) {
      btns.forEach(function (b) { b.classList.toggle('on', (+b.getAttribute('data-f')) === idx); });
      cards.forEach(function (c) {
        var ci = +c.getAttribute('data-ind');
        c.classList.remove('ghost', 'match');
        if (idx < 0) return;
        if (ci === idx) c.classList.add('match'); else c.classList.add('ghost');
      });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { apply(+b.getAttribute('data-f')); }); });
  })();

  /* SECTORS */
  $('[data-sectors]').innerHTML = SECTORS.map(function (s) {
    var chips = s[2].map(function (m) { return '<span class="clChip" style="font-size:13px;font-weight:600;color:#31405c;background:#eef3fb;border:1px solid #e3ecfd;border-radius:999px;padding:7px 13px;">'+esc(m)+'</span>'; }).join('');
    return '<div class="clGrp" data-reveal style="background:#fff;border:1px solid #eaeef5;border-radius:20px;padding:26px;box-shadow:0 16px 42px -30px rgba(15,23,41,.24);">'
      + '<div style="position:absolute;top:-40px;right:-40px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,rgba(26,86,219,.1),transparent 70%);pointer-events:none;z-index:0;"></div>'
      + '<div class="clBar" style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#1a56db,#4b8bff);z-index:2;"></div>'
      + '<div style="position:relative;z-index:1;"><div style="display:flex;align-items:center;gap:12px;"><span class="clIco" style="width:44px;height:44px;border-radius:12px;background:#e8effc;color:#1a56db;display:grid;place-items:center;flex-shrink:0;">'+icon(s[1])+'</span><span style="flex:1;font-size:16.5px;font-weight:700;line-height:1.2;color:#0f1729;">'+esc(s[0])+'</span></div>'
      + '<div style="display:flex;align-items:center;gap:8px;margin-top:14px;"><span style="font-size:11px;font-weight:700;letter-spacing:.5px;color:#1a56db;background:#eef4ff;border-radius:999px;padding:4px 10px;">'+s[2].length+'</span><span style="font-size:12px;color:#8a94a6;">clients</span></div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;">'+chips+'</div></div></div>';
  }).join('');

  /* INTERACTIVE CONVERGENCE — hovering a sector lights its connector to the node */
  (function () {
    var svg = document.querySelector('.converge-svg'); if (!svg) return;
    var lines = Array.prototype.slice.call(svg.querySelectorAll('path[stroke="#4b8bff"]'));
    lines.forEach(function (p, i) { p.setAttribute('data-line', i); });
    var node = document.querySelector('[data-node]');
    var grps = Array.prototype.slice.call(document.querySelectorAll('[data-sectors] .clGrp'));
    grps.forEach(function (g, i) {
      g.addEventListener('mouseenter', function () {
        var p = lines[i]; if (p) { p.style.stroke = '#1a56db'; p.style.strokeWidth = '4'; }
        if (node) node.style.transform = 'scale(1.05)';
      });
      g.addEventListener('mouseleave', function () {
        var p = lines[i]; if (p) { p.style.stroke = ''; p.style.strokeWidth = ''; }
        if (node) node.style.transform = '';
      });
    });
  })();

  /* headline word reveal + hero inline count-up */
  (function () {
    var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var words = document.querySelectorAll('[data-headline] .hw');
    if (rm) { words.forEach(function (w) { w.classList.add('play'); }); }
    else { words.forEach(function (w, i) { w.style.animationDelay = (i * 85) + 'ms'; }); setTimeout(function () { words.forEach(function (w) { w.classList.add('play'); }); }, 120); }
    var el = document.querySelector('[data-hero-count]');
    if (el) {
      var target = parseInt(el.getAttribute('data-hero-count'), 10) || 0;
      if (rm) { el.textContent = target; }
      else { var t0 = performance.now(); (function s(now) { var p = Math.min(1, (now - t0) / 1400); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(s); })(t0); }
    }
  })();

  /* NUMBERS (count-up on reveal) */
  var NUMBERS = [[35,'+','Businesses served'],[6,'+','Industries served'],[100,'%','Built & supported in-house']];
  $('[data-numbers]').innerHTML = NUMBERS.map(function (n) {
    return '<div data-reveal style="background:#131c2e;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:34px 28px;text-align:center;"><div style="font-size:52px;font-weight:800;letter-spacing:-1.5px;color:#fff;line-height:1;"><span data-count="'+n[0]+'">0</span>'+n[1]+'</div><div style="font-size:14.5px;color:#96a2ba;margin-top:12px;">'+n[2]+'</div></div>';
  }).join('');

  /* reveal + count-up */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counted = false;
  function runCount() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0, dur = 1200, t0 = performance.now();
      if (reduce) { el.textContent = target; return; }
      var step = function (now) { var p = Math.min(1, (now - t0) / dur); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }
  function scan() {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight * 0.92 && r.bottom > 0) el.classList.add('in'); });
    if (!counted) { var b = document.querySelector('[data-count]'); if (b) { var r = b.getBoundingClientRect(); if (r.top < window.innerHeight * 0.85 && r.bottom > 0) { counted = true; runCount(); } } }
  }
  if (reduce) { document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in'); }); runCount(); }
  else { window.addEventListener('scroll', scan, { passive: true }); setTimeout(scan, 50); setInterval(scan, 400); }
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
