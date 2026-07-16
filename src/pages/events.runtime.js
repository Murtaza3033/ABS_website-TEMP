/* events runtime — ported from the static events.js (shell-assets loader removed).
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
/* ================= ported events.js runtime ================= */

(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function icon(name) {
    var P = {
      pin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
      grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
      cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
      booth:'<path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>',
      globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20"/><path d="M12 2a15 15 0 0 0 0 20"/>',
      tag:'<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 12V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6z"/><path d="M7 7h.01"/>',
      mobile:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
      shield:'<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>'
    };
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(P[name]||'')+'</svg>';
  }

  /* facts */
  var FACTS = [['pin','Karachi Expo Centre','Pakistan'],['booth','Hall 1 · Booth A-30','Our stand'],['grid','4 sectors shown','Real estate to services'],['cal','ITCN Asia 2023','IT & telecom expo']];
  $('[data-facts]').innerHTML = FACTS.map(function (f) {
    return '<div class="evFact" style="background:var(--tint);border:1px solid #eef1f6;border-radius:14px;padding:16px 18px;"><div class="evIcoWrap" style="width:38px;height:38px;border-radius:10px;background:#e8effc;color:#1a56db;display:grid;place-items:center;">'+icon(f[0])+'</div><div style="font-size:14.5px;font-weight:700;color:#0f1729;margin-top:12px;line-height:1.25;">'+esc(f[1])+'</div><div style="font-size:12.5px;color:#5b6472;margin-top:3px;">'+esc(f[2])+'</div></div>';
  }).join('');

  /* INTERACTIVE PHOTO GALLERY — main stage + thumbnails + lightbox */
  var GALLERY = [
    ['itcn-wall','jpg','Event Photo','The main stand at ITCN Asia 2023, Karachi Expo Centre'],
    ['booth-team','png','At the booth','The Align team at ITCN Asia 2023'],
    ['booth-demo','png','Live demos','Walking a visitor through the platform, live'],
    ['brochure','png','In conversation','Talking operations — one conversation at a time']
  ];
  var gi = 0;
  var stage = $('[data-stage]'), stageLabel = $('[data-stage-label]');
  function gsrc(i) { return '/assets/images/about/' + GALLERY[i][0] + '.' + GALLERY[i][1]; }
  function setStage(i) {
    gi = (i + GALLERY.length) % GALLERY.length;
    if (stage) {
      stage.style.opacity = '0';
      setTimeout(function () {
        stage.style.backgroundImage = "url('" + gsrc(gi) + "')";
        stage.style.animation = 'none'; void stage.offsetWidth; stage.style.animation = 'kenBurns 14s ease-in-out infinite alternate';
        stage.style.opacity = '1';
      }, 160);
    }
    if (stageLabel) stageLabel.textContent = GALLERY[gi][2];
    document.querySelectorAll('[data-g]').forEach(function (t, k) { if (k === gi) t.classList.add('active'); else t.classList.remove('active'); });
  }
  $('[data-thumbs]').innerHTML = GALLERY.map(function (t, i) {
    return '<div class="evVisual evGThumb'+(i===0?' active':'')+'" data-g="'+i+'" style="background:#0f1729;box-shadow:0 20px 44px -30px rgba(15,23,41,.4);"><div class="evShot" style="position:absolute;inset:0;background-image:url(\'/assets/images/about/'+t[0]+'.'+t[1]+'\');background-size:cover;background-position:center;"></div><div style="position:absolute;inset:0;background:linear-gradient(0deg,rgba(15,23,41,.5),transparent 55%);"></div><span style="position:absolute;left:14px;bottom:12px;font-size:10px;font-weight:700;letter-spacing:1px;color:#fff;text-transform:uppercase;">'+esc(t[2])+'</span></div>';
  }).join('');
  document.querySelectorAll('[data-g]').forEach(function (t) { t.addEventListener('click', function () { setStage(+t.getAttribute('data-g')); }); });

  /* lightbox */
  var lb = $('[data-lbox]'), lbImg = $('[data-lb-img]'), lbCap = $('[data-lb-cap]');
  function paintLb() { if (lbImg) lbImg.src = gsrc(gi); if (lbCap) lbCap.innerHTML = '<b>' + esc(GALLERY[gi][2]) + '</b> — ' + esc(GALLERY[gi][3]); }
  function openLb() { paintLb(); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function closeLb() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  function lbGo(d) { setStage(gi + d); paintLb(); }
  if (lb) {
    $('[data-lb-close]').addEventListener('click', closeLb);
    $('[data-lb-prev]').addEventListener('click', function () { lbGo(-1); });
    $('[data-lb-next]').addEventListener('click', function () { lbGo(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lb.firstElementChild) closeLb(); });
    document.addEventListener('keydown', function (e) { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowRight') lbGo(1); else if (e.key === 'ArrowLeft') lbGo(-1); });
    var wrap = $('[data-stage-wrap]'); if (wrap) wrap.addEventListener('click', function (e) { if (e.target.closest('.evStageBtn') || e.target.closest('[data-stage]') || e.target === wrap) openLb(); });
  }

  /* why-cards */
  var WHY = [
    ['Global reach, local expertise','Connect with an expert who understands your market, speaks your language, and tailors support to your needs.','Discover what sets us apart','/about-us.html','globe','#1a56db','global-reach'],
    ['The perfect pricing plan','Our experts will recommend the bundle best-suited to you. Start simple and scale as you grow.','See our pricing','/contact-us.html','tag','#1a9d55','pricing'],
    ['Access anytime, anywhere','Stay connected wherever you are with our mobile app.','Learn more','/about-us.html','mobile','#123f9e','mobile-app'],
    ['Your data, safe and sound','We take security and compliance seriously, with systems and processes designed to protect your business.','See our security standards','/about-us.html','shield','#d4a017','security']
  ];
  $('[data-why]').innerHTML = WHY.map(function (c) {
    return '<div class="evWhy" data-reveal style="background:#fff;border:1px solid #eef2f8;border-radius:22px;overflow:hidden;box-shadow:0 22px 52px -32px rgba(15,23,41,.3);"><div class="evVisual" style="overflow:hidden;"><div class="evShot" style="width:100%;padding-bottom:46%;background-image:url(\'/assets/images/events/'+c[6]+'.png\');background-size:cover;background-position:center top;"></div></div><div style="padding:24px 26px 26px;"><div style="font-size:19px;font-weight:700;color:#0f1729;">'+esc(c[0])+'</div><p style="font-size:14px;line-height:1.65;color:#5b6472;margin:9px 0 0;">'+esc(c[1])+'</p><a href="'+c[3]+'" style="display:inline-flex;align-items:center;gap:7px;margin-top:16px;font-size:14px;font-weight:700;color:#1a56db;">'+esc(c[2])+' <span class="evArrow">→</span></a></div></div>';
  }).join('');

  /* reveal */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* hero photo montage (slow cross-fade of the event shots) */
  (function () {
    var m = $('[data-montage]'); if (!m) return;
    m.innerHTML = GALLERY.map(function (t, i) { return '<span'+(i===0?' class="on"':'')+' style="background-image:url(\'/assets/images/about/'+t[0]+'.'+t[1]+'\');"></span>'; }).join('');
    if (reduce) return;
    var spans = m.querySelectorAll('span'), k = 0;
    setInterval(function () { spans[k].classList.remove('on'); k = (k + 1) % spans.length; spans[k].classList.add('on'); }, 4200);
  })();

  /* headline word reveal */
  (function () {
    var words = document.querySelectorAll('[data-headline] .hw');
    if (reduce) { words.forEach(function (w) { w.classList.add('play'); }); return; }
    words.forEach(function (w, i) { w.style.animationDelay = (i * 80) + 'ms'; });
    setTimeout(function () { words.forEach(function (w) { w.classList.add('play'); }); }, 120);
  })();
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
