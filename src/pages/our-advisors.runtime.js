/* our-advisors runtime — ported from the static our-advisors.js (shell-assets loader removed).
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
/* ================= ported our-advisors.js runtime ================= */

(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function icon(name, sz, sw) {
    var P = {
      compass:'<circle cx="12" cy="12" r="10"/><path d="M16.2 7.8l-2.9 6.4-6.4 2.9 2.9-6.4 6.4-2.9z"/>',
      trending:'<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
      layers:'<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
      users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      shield:'<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
      tag:'<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 12V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6z"/><path d="M7 7h.01"/>',
      scale:'<path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7l-3 6h6l-3-6z"/><path d="M19 7l-3 6h6l-3-6z"/><path d="M8 21h8"/>',
      map:'<path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"/><path d="M9 3v15"/><path d="M15 6v15"/>',
      lightbulb:'<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.5.4.8 1 .9 1.6h6.2c.1-.6.4-1.2.9-1.6A7 7 0 0 0 12 2z"/>'
    };
    return '<svg width="'+(sz||22)+'" height="'+(sz||22)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(sw||1.8)+'" stroke-linecap="round" stroke-linejoin="round">'+(P[name]||'')+'</svg>';
  }

  var AREAS = [
    ['Strategy & Direction','Helping set where Align focuses next — which markets, which products, which bets are worth making.','compass'],
    ['Growth & Go-to-Market','Sharpening how we reach and win the businesses that need what we build.','trending'],
    ['Product & Platform','A second read on the roadmap — what to build in-house, what to leave, what to connect.','layers'],
    ['Scaling the Team','Growing headcount and structure without losing the quality that defines the work.','users'],
    ['Governance & Risk','Keeping decisions sound as the company and its responsibilities grow.','shield'],
    ['Pricing & Positioning','How Align is valued and framed against the alternatives businesses consider.','tag']
  ];
  $('[data-areas]').innerHTML = AREAS.map(function (a, i) {
    return '<div class="adCard" data-reveal style="position:relative;background:#fff;border:1px solid #eaeef5;border-radius:20px;padding:28px;box-shadow:0 16px 42px -30px rgba(15,23,41,.24);transition-delay:'+((i%3)*70)+'ms;"><span class="adIdx">'+('0'+(i+1))+'</span><div class="adIco" style="width:50px;height:50px;border-radius:14px;background:linear-gradient(135deg,#1a56db,#4b8bff);color:#fff;display:grid;place-items:center;box-shadow:0 14px 26px -10px rgba(26,86,219,.55);">'+icon(a[2])+'</div><div style="font-size:17.5px;font-weight:700;margin-top:18px;line-height:1.25;">'+a[0]+'</div><p style="font-size:14px;line-height:1.65;color:#5b6472;margin:9px 0 0;">'+a[1]+'</p></div>';
  }).join('');
  /* 3D tilt-toward-cursor on the area cards */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.areas-grid .adCard').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateX(' + (-py * 7) + 'deg) rotateY(' + (px * 9) + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  var PILLARS = [
    ['Big calls, pressure-tested','A trusted voice to challenge the decisions that are hard to reverse.','scale'],
    ['A wider map','Perspective from beyond the day-to-day that keeps the long view in focus.','map'],
    ['Experience on tap','Lessons already learned elsewhere, so we don’t learn them the slow way.','lightbulb']
  ];
  $('[data-pillars]').innerHTML = PILLARS.map(function (p) {
    return '<div data-reveal style="display:flex;gap:16px;align-items:flex-start;background:#131c2e;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:20px 22px;"><div style="width:40px;height:40px;flex-shrink:0;border-radius:11px;background:rgba(26,86,219,.18);color:#7aa7ff;display:grid;place-items:center;">'+icon(p[2])+'</div><div><div style="font-size:16px;font-weight:700;color:#fff;">'+p[0]+'</div><p style="font-size:13.5px;line-height:1.6;color:#96a2ba;margin:5px 0 0;">'+p[1]+'</p></div></div>';
  }).join('');

  var TL = [
    ['Year TBD','Early career','Placeholder — foundational roles and the industries where the advisor built their expertise.','#1a56db','lightbulb'],
    ['Year TBD','Leadership role','Placeholder — a senior position that shaped their view on building and scaling software teams.','#4b8bff','users'],
    ['Year TBD','Notable milestone','Placeholder — a defining achievement or venture worth highlighting once confirmed.','#1a56db','trending'],
    ['Year TBD','Advisory work','Placeholder — advising companies and founders, the experience Align now draws on.','#1a9d55','compass'],
    ['Today','Advising Align','Placeholder — the perspective and guidance brought to Align Business Systems today.','#0f1729','shield']
  ];
  $('[data-timeline]').innerHTML = TL.map(function (t) {
    return '<div class="tlItem" data-reveal style="position:relative;display:flex;gap:26px;align-items:flex-start;padding:0 0 30px 0;"><div class="tlNode" data-ring="'+t[3]+'" style="position:relative;z-index:1;width:44px;height:44px;flex-shrink:0;border-radius:50%;background:#fff;border:2px solid #d9e2f0;display:grid;place-items:center;color:#b3bccb;box-shadow:0 10px 22px -10px rgba(15,23,41,.3);">'+icon(t[4])+'</div><div style="flex:1;background:var(--tint);border:1px solid #eaeef5;border-radius:16px;padding:18px 22px;"><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;"><span style="font-size:11px;font-weight:700;letter-spacing:1px;color:#1a56db;background:#eef4ff;border-radius:999px;padding:4px 11px;">'+t[0]+'</span><span style="font-size:17px;font-weight:700;color:#0f1729;">'+t[1]+'</span></div><p style="font-size:14px;line-height:1.6;color:#5b6472;margin:9px 0 0;">'+t[2]+'</p></div></div>';
  }).join('');

  /* headline word-by-word reveal */
  var hl = $('[data-headline]');
  if (hl) {
    var words = hl.textContent.trim().split(/\s+/);
    hl.innerHTML = words.map(function (w, i) { return '<span class="adWord" style="animation-delay:' + (i * 0.09) + 's;">' + w + '</span>'; }).join(' ');
  }
  function playHeadline() { if (hl && hl.getBoundingClientRect().top < window.innerHeight * 0.95) hl.querySelectorAll('.adWord').forEach(function (w) { w.classList.add('play'); }); }

  /* timeline scroll-draw + node activation */
  function timelineDraw() {
    var wrap = $('[data-timeline-wrap]'); if (!wrap) return;
    var fill = $('[data-tl-fill]'), nodes = document.querySelectorAll('.tlNode');
    var r = wrap.getBoundingClientRect(), span = r.height - 12;
    var prog = Math.max(0, Math.min(1, (window.innerHeight * 0.58 - r.top) / (r.height * 0.8)));
    if (fill) fill.style.height = (prog * span) + 'px';
    nodes.forEach(function (n) {
      var nr = n.getBoundingClientRect(), ring = n.getAttribute('data-ring');
      var on = nr.top < window.innerHeight * 0.7 && nr.bottom > 60;
      n.style.borderColor = on ? ring : '#d9e2f0'; n.style.color = on ? ring : '#b3bccb';
      n.style.transform = on ? 'scale(1.08)' : 'scale(1)';
      n.style.boxShadow = on ? '0 12px 26px -8px ' + ring + '66' : '0 10px 22px -10px rgba(15,23,41,.3)';
    });
  }

  /* reveal-on-scroll */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function scan() {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight * 0.92 && r.bottom > 0) el.classList.add('in'); });
    playHeadline(); timelineDraw();
  }
  if (reduce) { document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in'); }); if (hl) hl.querySelectorAll('.adWord').forEach(function (w) { w.style.opacity = 1; }); }
  else { window.addEventListener('scroll', scan, { passive: true }); window.addEventListener('resize', scan, { passive: true }); setTimeout(scan, 50); setInterval(scan, 400); }
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
