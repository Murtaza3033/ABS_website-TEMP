/* careers runtime — ported from the static careers.js (shell-assets loader removed).
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
/* ================= ported careers.js runtime ================= */

(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function icon(name, sz, sw) {
    var P = {
      check:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
      users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20"/><path d="M12 2a15 15 0 0 0 0 20"/>',
      zap:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
      briefcase:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
      pin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
      code:'<path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/>',
      clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
      mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
      chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
      rocket:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>'
    };
    return '<svg width="'+(sz||22)+'" height="'+(sz||22)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(sw||1.8)+'" stroke-linecap="round" stroke-linejoin="round">'+(P[name]||'')+'</svg>';
  }

  /* hero word-by-word reveal + accent sweep */
  document.querySelectorAll('.crWord').forEach(function (el, i) {
    el.style.animation = 'crWordIn .5s cubic-bezier(.2,.7,.3,1) ' + (i * 0.06) + 's both';
    if (el.classList.contains('crAccentWord')) { setTimeout(function () { el.style.animation += ', crSweep 1.1s ease-out ' + (i * 0.06 + 0.15) + 's both'; }, 10); }
  });

  /* smooth scroll for in-page anchors */
  document.querySelectorAll('[data-smooth-scroll]').forEach(function (a) {
    a.addEventListener('click', function (e) { var id = a.getAttribute('href'); if (id && id.charAt(0) === '#') { var t = document.querySelector(id); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } } });
  });

  /* culture */
  var CULTURE = [
    ['Real products, real impact','You work on modules businesses run their finance, HR and field teams on — not throwaway internal tools.','check','0s'],
    ['Direct access to leadership','A small team means your work is visible and your voice is heard — no layers between you and decisions.','users','.6s'],
    ['A Pakistan-based company','Proudly built in Pakistan, serving businesses at home and across the region — local roots, real enterprise scale.','globe','1.2s'],
    ['Ship fast, ship right','We move quickly without cutting corners — disciplined about quality, quick to get things live.','zap','1.8s']
  ];
  $('[data-culture]').innerHTML = CULTURE.map(function (c) {
    return '<div class="crCulture" data-reveal style="background:var(--tint);border:1px solid #eaeef5;border-radius:20px;padding:26px 22px;"><div class="crIco" style="width:48px;height:48px;border-radius:13px;background:#e8effc;color:#1a56db;display:grid;place-items:center;animation-delay:'+c[3]+';">'+icon(c[2])+'</div><div style="font-size:16.5px;font-weight:700;margin-top:17px;line-height:1.25;">'+esc(c[0])+'</div><p style="font-size:13.5px;line-height:1.6;color:#5b6472;margin:9px 0 0;">'+esc(c[1])+'</p></div>';
  }).join('');

  /* open roles accordion */
  var ROLES = [
    { title:'.NET Developer', loc:'Karachi, Pakistan', dept:'Engineering', type:'Full-time',
      desc:'Join the team building and maintaining the core ERP platform — working across the modules that businesses run their finance, inventory and operations on every day.',
      reqs:['Strong hands-on experience with .NET / C#','Comfortable with SQL Server and data-driven applications','Ability to work directly with product and support teams'] },
    { title:'ERP Sales Executive', loc:'Karachi, Pakistan', dept:'Sales', type:'Full-time',
      desc:'Own the conversation with growing businesses evaluating Align — understanding their operations and showing them how our platform fits.',
      reqs:['Experience selling B2B software or ERP solutions','Comfortable running product demos and discovery calls','Strong communication in English and Urdu'] }
  ];
  $('[data-roles]').innerHTML = ROLES.map(function (r) {
    var reqs = r.reqs.map(function (q) { return '<li class="r-req" style="font-size:13.5px;line-height:1.7;">'+esc(q)+'</li>'; }).join('');
    return '<div class="crRole" data-reveal data-dept="'+esc(r.dept)+'">'
      + '<div class="r-head"><div class="r-icon">'+icon('briefcase')+'</div>'
      + '<div style="flex:1;"><div class="r-title">'+esc(r.title)+'</div><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;"><span class="rchip">'+icon('pin',12,2)+esc(r.loc)+'</span><span class="rchip">'+icon('clock',12,2)+esc(r.type)+'</span><span class="rchip">'+icon('code',12,2)+esc(r.dept)+'</span></div></div>'
      + '<span class="r-chev">⌄</span></div>'
      + '<div class="r-panel"><div class="r-body"><p class="r-desc" style="font-size:14.5px;line-height:1.7;margin:0 0 14px;">'+esc(r.desc)+'</p>'
      + '<div class="r-label">What we\'re looking for</div><ul style="margin:10px 0 0;padding-left:18px;">'+reqs+'</ul>'
      + '<a class="r-apply" href="mailto:talent@alignbsystems.com?subject=' + encodeURIComponent('Application: ' + r.title) + '">Apply for this role →</a></div></div></div>';
  }).join('');
  document.querySelectorAll('[data-roles] .crRole').forEach(function (card) {
    card.querySelector('.r-head').addEventListener('click', function () { card.classList.toggle('open'); });
  });

  /* department filter */
  (function () {
    var bar = $('[data-jfilters]'); if (!bar) return;
    var depts = []; ROLES.forEach(function (r) { if (depts.indexOf(r.dept) < 0) depts.push(r.dept); });
    var cats = [['All', ROLES.length]].concat(depts.map(function (d) { return [d, ROLES.filter(function (r) { return r.dept === d; }).length]; }));
    bar.innerHTML = cats.map(function (c, i) { return '<button class="jfilt'+(i===0?' on':'')+'" data-fd="'+esc(c[0])+'">'+esc(c[0])+' <span class="n">'+c[1]+'</span></button>'; }).join('');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-roles] .crRole'));
    var btns = Array.prototype.slice.call(bar.querySelectorAll('.jfilt'));
    btns.forEach(function (b) { b.addEventListener('click', function () {
      var d = b.getAttribute('data-fd');
      btns.forEach(function (x) { x.classList.toggle('on', x === b); });
      cards.forEach(function (c) { c.classList.toggle('hide', d !== 'All' && c.getAttribute('data-dept') !== d); });
    }); });
  })();

  /* hero live stat */
  (function () {
    var js = $('[data-jobstat]'); if (!js) return;
    js.innerHTML = '<span class="live"><i></i>Hiring now</span><span class="sep"></span><span><b>'+ROLES.length+'</b> open role'+(ROLES.length!==1?'s':'')+'</span><span class="sep"></span><span>On-site · Karachi</span>';
  })();

  /* hiring process steps */
  var STEPS = [
    ['mail','Apply','Email talent@alignbsystems.com with the role title in the subject line.'],
    ['chat','Intro call','A quick 20–30 minute chat to get to know you and answer your questions.'],
    ['users','Role deep-dive',"A focused conversation with the team you'd join — practical, not a quiz."],
    ['rocket','Offer & welcome',"If it's a fit both ways, we move fast and get you set up."]
  ];
  var hs = $('[data-hsteps]');
  if (hs) {
    hs.innerHTML = '<div class="hline"></div>' + STEPS.map(function (s, i) {
      return '<div class="hstep" data-reveal><div class="hnode">'+icon(s[0],26,1.7)+'<span class="hnum">'+(i+1)+'</span></div><h3>'+esc(s[1])+'</h3><p>'+esc(s[2])+'</p></div>';
    }).join('');
  }

  /* reveal */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function scan() { document.querySelectorAll('[data-reveal]').forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight * 0.92 && r.bottom > 0) el.classList.add('in'); }); }
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
