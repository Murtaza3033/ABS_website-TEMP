/* industries runtime — ported from the static industries.js (shell-assets loader removed).
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
/* ================= ported industries.js runtime ================= */

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
    return '<svg width="'+(name==='hub'?22:20)+'" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(P[name]||'')+'</svg>';
  }
  function member(name, file) {
    var inner = file
      ? '<img src="'+T+file+'.png" alt="'+esc(name)+'" style="width:82px;height:34px;object-fit:contain;" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'inline\';"><span style="display:none;font-size:15px;font-weight:800;color:#0f1729;">'+esc(name)+'</span>'
      : '<span style="font-size:15px;font-weight:800;color:#0f1729;">'+esc(name)+'</span>';
    return '<div style="height:52px;min-width:96px;padding:0 16px;background:#fff;border:1px solid #eef2f8;border-radius:12px;box-shadow:0 12px 28px -22px rgba(15,23,41,.4);display:flex;align-items:center;justify-content:center;">'+inner+'</div>';
  }

  var MCHK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

  var IND = [
    { name:'Food, Beverage & FMCG', short:'FMCG', tint:'#1a56db', ico:'cup', img:'retail', insight:'5 FMCG & food brands served', focus:'Production → Retail',
      modules:['Inventory','Manufacturing','Distribution','Sales','Finance'],
      head:'Keeping fast-moving goods moving.', para:'From production runs to distribution and retail, we give food and FMCG businesses one connected view of inventory, orders and margins — so the shelves stay stocked and the numbers stay clean.',
      members:[['Dipitt','dipitt-logo'],['Danpak','danpak-logo'],['greenO','greeeno-logo'],['FIPCo',null],['Maxim','maxim-logo']] },
    { name:'Pharmaceutical & Healthcare', short:'Pharma & Health', tint:'#1a9d55', ico:'cross', img:'pharma', insight:'Trusted by pharma & healthcare teams', focus:'Compliant & traceable',
      modules:['Batch Tracking','Compliance','Inventory','Field Force','Finance'],
      head:'Precision where it matters most.', para:'We help pharmaceutical and healthcare organizations run compliant, traceable operations — from field teams to inventory — with the accuracy the sector demands.',
      members:[['Oncogen Pharma','oncogen-pharma-pakistan-logo'],['NexTek HealthCare','nectek-logo']] },
    { name:'Lighting & Electrical', short:'Lighting', tint:'#d4a017', ico:'bulb', img:'manufacturing', insight:'3 lighting & electrical leaders', focus:'Warehouse → Invoice',
      modules:['Procurement','Inventory','Sales','Invoicing','Finance'],
      head:'Powering the businesses that light rooms.', para:'Lighting and electrical suppliers rely on us to tie procurement, stock and sales into one system — clear visibility from warehouse to invoice.',
      members:[['Coarts Lighting Solutions','coarts-lighting-solutin'],['Clipsal','clipsal-logo'],['Allied','allied-logo']] },
    { name:'Construction, Building & Real Estate', short:'Construction', tint:'#334166', ico:'building', img:'enterprise', insight:'4 construction & real estate firms', focus:'On schedule, on budget',
      modules:['Projects','Procurement','Assets','Payroll','Finance'],
      head:'Structure for the businesses that build.', para:'We bring order to complex builds — projects, procurement, assets and finance in one place — so construction and real estate teams stay on schedule and on budget.',
      members:[['Powerhouse Building Solutions','powerhouse-builiding-solution-logo'],['Zamanat','zamanat-logo'],['Hasco Steel',null],['KG (King’s Group)','kg-logo']] },
    { name:'Energy & Solar', short:'Energy & Solar', tint:'#1a9d55', ico:'sun', img:'distribution', insight:'Powering solar & energy operations', focus:'Pipeline → Field install',
      modules:['Project Pipeline','Field Ops','Inventory','Service','Finance'],
      head:'Systems for a cleaner grid.', para:'From project pipelines to field installs, we help solar and energy operators manage the moving parts — keeping deployments organized and accountable.',
      members:[['PV360',null],['VSolar','vsolar-logo']] },
    { name:'Technology & Mobility', short:'Tech & Mobility', tint:'#1a56db', ico:'chip', img:'services', insight:'3 tech & mobility innovators', focus:'Built to scale',
      modules:['CRM','Projects','Billing','HR','Finance'],
      head:'Built for the businesses building tomorrow.', para:'Technology and mobility innovators partner with us for systems that scale as fast as they do — flexible, connected and ready for what’s next.',
      members:[['BusCaro','buscaro-logo-original-scaled'],['Techexons','techexons-logo'],['Noon','noon-logo']] }
  ];

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0, autoOn = true;
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }

  /* hero photo montage (cross-fades with the active industry) */
  (function initMontage() {
    var m = $('[data-montage]'); if (!m) return;
    m.innerHTML = IND.map(function (d, i) { return '<span data-mon="'+i+'" style="background-image:url(\'/assets/images/industries/'+d.img+'.png\');"></span>'; }).join('');
  })();
  function syncMontage() { document.querySelectorAll('[data-mon]').forEach(function (s, i) { if (i === cur) s.classList.add('on'); else s.classList.remove('on'); }); }

  function renderTabs() {
    $('[data-tabs]').innerHTML = IND.map(function (d, i) {
      var on = i === cur;
      return '<button class="iTab" data-tab="'+i+'" style="background:'+(on?'#1a56db':'transparent')+';color:'+(on?'#fff':'#0f1729')+';box-shadow:'+(on?'0 12px 24px -10px rgba(26,86,219,.55)':'none')+';">'+d.short+'</button>';
    }).join('');
    $('[data-tabs]').querySelectorAll('[data-tab]').forEach(function (b) { b.addEventListener('click', function () { select(+b.getAttribute('data-tab'), true); }); });
  }
  function renderPanel() {
    var d = IND[cur];
    var members = d.members.map(function (m) { return member(m[0], m[1]); }).join('');
    var mods = d.modules.map(function (x) { return '<span class="modChip">'+MCHK+esc(x)+'</span>'; }).join('');
    $('[data-panel]').innerHTML =
      '<div style="position:relative;border-radius:26px;overflow:hidden;height:460px;box-shadow:0 40px 90px -44px rgba(15,23,41,.5);background:#0f1729;animation:slideInR .5s cubic-bezier(.2,.7,.3,1) both;">'
        + '<div data-ind-parallax style="position:absolute;left:0;right:0;top:-8%;height:116%;will-change:transform;">'
          + '<div data-ind-img style="position:absolute;inset:0;background-image:url(\'/assets/images/industries/'+d.img+'.png\');background-size:cover;background-position:center;animation:kenBurns 12s ease-in-out infinite alternate;"></div>'
        + '</div>'
        + '<div style="position:absolute;inset:0;background:linear-gradient(150deg,rgba(15,23,41,.30),rgba(26,86,219,.30));"></div>'
        + '<div style="position:absolute;inset:0;opacity:.10;background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:40px 40px;"></div>'
        + '<span style="position:absolute;left:20px;top:18px;font-size:10.5px;font-weight:700;letter-spacing:1.5px;color:#fff;background:rgba(15,23,41,.5);border-radius:999px;padding:6px 13px;text-transform:uppercase;">'+esc(d.name)+'</span>'
        + '<div style="position:absolute;right:22px;top:20px;width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,.16);display:grid;place-items:center;color:#fff;">'+icon(d.ico)+'</div>'
        + '<div style="position:absolute;left:22px;bottom:22px;background:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 26px 52px -22px rgba(15,23,41,.55);animation:floatY 6.5s ease-in-out infinite;max-width:240px;"><div style="display:flex;align-items:center;gap:8px;"><span style="width:8px;height:8px;border-radius:50%;background:#1a9d55;animation:iDot 1.8s ease-in-out infinite;"></span><span style="font-size:10px;font-weight:700;letter-spacing:1px;color:#8a94a6;text-transform:uppercase;">Align × '+esc(d.short)+'</span></div><div style="font-size:17px;font-weight:700;color:#0f1729;margin-top:9px;line-height:1.25;">'+esc(d.insight)+'</div></div>'
      + '</div>'
      + '<div data-ind-copy style="animation:slideInR .55s cubic-bezier(.2,.7,.3,1) both;">'
        + '<div style="font-size:12px;font-weight:700;letter-spacing:1.5px;color:#1a56db;text-transform:uppercase;">'+esc(d.name)+'</div>'
        + '<h2 style="font-size:30px;font-weight:800;letter-spacing:-.8px;margin:10px 0 0;line-height:1.14;">'+esc(d.head)+'</h2>'
        + '<p style="font-size:15px;line-height:1.72;color:#4b5565;margin:14px 0 0;">'+esc(d.para)+'</p>'
        + '<div style="display:flex;align-items:center;gap:18px;margin-top:18px;flex-wrap:wrap;">'
          + '<div style="display:flex;align-items:baseline;gap:7px;"><span style="font-size:28px;font-weight:800;color:#0f1729;letter-spacing:-.5px;">'+d.members.length+'</span><span style="font-size:12.5px;font-weight:600;color:#8a94a6;">client'+(d.members.length>1?'s':'')+' on Align</span></div>'
          + '<span style="width:1px;height:28px;background:#e4eaf3;"></span>'
          + '<div><div style="font-size:11px;font-weight:700;letter-spacing:.5px;color:#8a94a6;text-transform:uppercase;">Focus</div><div style="font-size:13.5px;font-weight:700;color:#1a56db;margin-top:2px;">'+esc(d.focus)+'</div></div>'
        + '</div>'
        + '<div style="margin-top:20px;font-size:11px;font-weight:700;letter-spacing:1px;color:#8a94a6;text-transform:uppercase;">Runs on Align</div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">'+mods+'</div>'
        + '<div style="margin-top:20px;font-size:11px;font-weight:700;letter-spacing:1px;color:#8a94a6;text-transform:uppercase;">Trusted here by</div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:12px;">'+members+'</div>'
      + '</div>';
  }

  var base = now(), fill = $('[data-ind-fill]'), AUTO = 4600;
  function select(i, manual) {
    cur = (i + IND.length) % IND.length;
    if (manual) autoOn = false;
    renderTabs(); renderPanel(); syncMontage(); base = now();
    if (manual && fill) fill.style.width = '0%';
  }
  renderTabs(); renderPanel(); syncMontage();
  if (!reduce) {
    (function tick(t) {
      if (autoOn) {
        var e = (t - base) / AUTO;
        if (e >= 1) { cur = (cur + 1) % IND.length; renderTabs(); renderPanel(); syncMontage(); base = t; e = 0; }
        if (fill) fill.style.width = Math.min(e, 1) * 100 + '%';
      } else if (fill) { fill.style.width = '0%'; }
      requestAnimationFrame(tick);
    })(base);
  }
  /* keyboard: ← / → switch industries when the tab bar is focused */
  var tabsEl = $('[data-tabs]');
  if (tabsEl) { tabsEl.setAttribute('tabindex', '0'); tabsEl.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); select(cur + 1, true); } else if (e.key === 'ArrowLeft') { e.preventDefault(); select(cur - 1, true); } }); }

  /* convergence nodes */
  var NODES = [
    ['FMCG','5 brands','Production to shelf in one flow.','cup'],
    ['Pharma & Health','2 organizations','Compliant, traceable operations.','cross'],
    ['Lighting','3 leaders','Procurement to invoice, tied together.','bulb'],
    ['Construction','4 firms','Projects, assets & finance in order.','building'],
    ['Energy & Solar','Field-ready','Pipelines to field installs, tracked.','sun'],
    ['Tech & Mobility','3 innovators','Systems that scale as fast as they do.','chip']
  ];
  function nodeHtml(n, i) {
    var durs=['6.5s','7.2s','6.8s','7.4s','6.6s','7s'], dels=['0s','.4s','.8s','.2s','.6s','1s'];
    return '<div class="convNode" data-reveal data-node-i="'+i+'" title="Explore '+esc(n[0])+'" style="background:#fff;border:1px solid #e9edf4;border-radius:18px;padding:18px 20px;box-shadow:0 20px 46px -26px rgba(15,23,41,.32);animation:floatY '+durs[i%6]+' ease-in-out '+dels[i%6]+' infinite;"><div style="display:flex;align-items:center;gap:12px;"><span class="convIco" style="width:42px;height:42px;border-radius:12px;background:#eef4ff;color:#1a56db;display:grid;place-items:center;flex-shrink:0;">'+icon(n[3])+'</span><div><div style="font-size:15px;font-weight:700;color:#0f1729;line-height:1.15;">'+esc(n[0])+'</div><div style="font-size:11.5px;font-weight:600;color:#1a56db;margin-top:2px;">'+esc(n[1])+'</div></div></div><div style="font-size:12.5px;line-height:1.5;color:#5b6472;margin-top:12px;">'+esc(n[2])+'</div></div>';
  }
  $('[data-conv-top]').innerHTML = NODES.slice(0,3).map(function (n,i) { return nodeHtml(n,i); }).join('');
  $('[data-conv-bottom]').innerHTML = NODES.slice(3).map(function (n,i) { return nodeHtml(n,i+3); }).join('');

  /* INTERACTIVE CONVERGENCE — hover lights the connector, click jumps to that industry */
  (function () {
    var svg = $('.conv-svg');
    var lines = svg ? Array.prototype.slice.call(svg.querySelectorAll('path[stroke="#4b8bff"]')) : [];
    lines.forEach(function (p, i) { p.setAttribute('data-line', i); });
    var hub = $('[data-hub]');
    Array.prototype.slice.call(document.querySelectorAll('.convNode')).forEach(function (g) {
      var i = +g.getAttribute('data-node-i');
      g.addEventListener('mouseenter', function () { var p = lines[i]; if (p) { p.style.stroke = '#1a56db'; p.style.strokeWidth = '1.6'; } if (hub) hub.style.transform = 'scale(1.03)'; });
      g.addEventListener('mouseleave', function () { var p = lines[i]; if (p) { p.style.stroke = ''; p.style.strokeWidth = ''; } if (hub) hub.style.transform = ''; });
      g.addEventListener('click', function () { select(i, true); var sc = $('[data-showcase]'); if (sc) sc.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    });
  })();

  /* hero word reveal + inline count-up */
  (function () {
    var words = document.querySelectorAll('[data-headline] .hw');
    if (reduce) { words.forEach(function (w) { w.classList.add('play'); }); }
    else { words.forEach(function (w, i) { w.style.animationDelay = (i * 85) + 'ms'; }); setTimeout(function () { words.forEach(function (w) { w.classList.add('play'); }); }, 120); }
    document.querySelectorAll('[data-hero-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-hero-count'), 10) || 0;
      if (reduce) { el.textContent = target; return; }
      var t0 = now(); (function s(t) { var p = Math.min(1, (t - t0) / 1300); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(s); })(t0);
    });
  })();

  /* reveal + panel parallax */
  function scan() {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight * 0.92 && r.bottom > 0) el.classList.add('in'); });
    if (!reduce) {
      var pw = document.querySelector('[data-ind-parallax]');
      if (pw && pw.parentElement) { var r = pw.parentElement.getBoundingClientRect(); var off = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight; pw.style.transform = 'translateY(' + (off * -24) + 'px)'; }
    }
  }
  if (reduce) document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
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
