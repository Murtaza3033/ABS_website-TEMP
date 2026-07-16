/* our-partners runtime — ported from the static our-partners.js (shell-assets loader removed).
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
/* ================= ported our-partners.js runtime ================= */

(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function icon(name) {
    var P = {
      globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20"/><path d="M12 2a15 15 0 0 0 0 20"/>',
      megaphone:'<path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
      chip:'<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 2v3"/><path d="M15 2v3"/><path d="M9 19v3"/><path d="M15 19v3"/><path d="M2 9h3"/><path d="M2 15h3"/><path d="M19 9h3"/><path d="M19 15h3"/>',
      support:'<path d="M18 15a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3z"/>',
      trending:'<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
      shield:'<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>'
    };
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(P[name]||'')+'</svg>';
  }

  var BENEFITS = [
    ['01','Expanded Market Reach','Joining forces with Align opens doors to new markets and customer segments, expanding your reach and increasing brand visibility.','globe'],
    ['02','Co-Marketing Opportunities','Benefit from collaborative marketing, joint campaigns and co-branded materials that leverage the strengths of both businesses.','megaphone'],
    ['03','Access to Cutting-Edge Technology','Gain access to our advanced stack — React, ASP.NET, TypeScript, SQL Server, Crystal Reports — to deliver innovative, robust solutions.','chip'],
    ['04','Comprehensive Training & Support','Take advantage of training programs and dedicated support resources so you can excel at implementing and supporting our solutions.','support'],
    ['05','Joint Business Development','Collaborate on business development, joint proposals and strategic planning — leverage our expertise to accelerate growth.','trending'],
    ['06','Enhanced Competitive Advantage','Stand out with a complete suite of solutions backed by Align’s reputation as a leading ERP provider — and win more projects.','shield']
  ];
  var strip = $('[data-ben-strip]');
  strip.innerHTML = BENEFITS.map(function (b) {
    return '<div class="pBen" style="flex:0 0 46%;position:relative;overflow:hidden;background:#fff;border:1px solid #eaeef5;border-radius:22px;padding:34px;box-shadow:0 22px 52px -32px rgba(15,23,41,.3);"><div style="position:absolute;top:-50px;right:-50px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(26,86,219,.09),transparent 70%);pointer-events:none;"></div><div style="position:absolute;left:0;bottom:0;width:100%;height:5px;background:linear-gradient(90deg,#1a56db,#4b8bff);opacity:.9;"></div><div style="position:relative;display:flex;align-items:center;gap:14px;"><div class="pIco" style="width:54px;height:54px;flex-shrink:0;border-radius:15px;background:linear-gradient(135deg,#1a56db,#4b8bff);color:#fff;display:grid;place-items:center;box-shadow:0 14px 26px -10px rgba(26,86,219,.55);">'+icon(b[3])+'</div><div style="font-size:12px;font-weight:700;letter-spacing:1px;color:#c3d0e6;">'+b[0]+'</div></div><div style="position:relative;font-size:21px;font-weight:700;margin-top:20px;line-height:1.2;">'+b[1]+'</div><p style="position:relative;font-size:14.5px;line-height:1.7;color:#5b6472;margin:12px 0 0;">'+b[2]+'</p></div>';
  }).join('');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* benefits carousel */
  (function initBen() {
    var track = $('[data-ben-track]'), dotsWrap = $('[data-ben-dots]');
    var fill = $('[data-ben-fill]'), countEl = $('[data-ben-count]');
    var cards = Array.prototype.slice.call(strip.children); var n = cards.length; var idx = 0, paused = false, resume;
    var AUTO = 4200, base = (window.performance && performance.now) ? performance.now() : 0;
    var pad = function (v) { return ('0' + v).slice(-2); };
    var dots = cards.map(function (_, i) {
      var d = document.createElement('button'); d.setAttribute('aria-label', 'Go to card ' + (i + 1));
      d.style.cssText = 'border:none;padding:0;height:8px;border-radius:999px;background:#d5deed;cursor:pointer;transition:all .35s ease;width:8px;';
      d.addEventListener('click', function () { go(i); pause(); }); dotsWrap.appendChild(d); return d;
    });
    function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
    function go(i) {
      idx = (i + n) % n; var card = cards[idx];
      var off = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
      strip.style.transform = 'translateX(' + (-off) + 'px)';
      cards.forEach(function (c, k) { c.style.opacity = k === idx ? '1' : '.5'; c.style.transform = k === idx ? 'scale(1)' : 'scale(.95)'; c.style.transition = 'opacity .5s ease, transform .5s ease'; });
      dots.forEach(function (d, k) { d.style.width = k === idx ? '26px' : '8px'; d.style.background = k === idx ? '#1a56db' : '#d5deed'; });
      if (countEl) countEl.innerHTML = '<b>' + pad(idx + 1) + '</b> / ' + pad(n);
      base = now(); if (fill) fill.style.width = '0%';
    }
    function pause() { paused = true; clearTimeout(resume); resume = setTimeout(function () { paused = false; base = now(); }, 6000); }
    if (!reduce) {
      (function tick(t) {
        if (!paused) {
          var e = (t - base) / AUTO;
          if (e >= 1) { go(idx + 1); base = t; e = 0; }
          if (fill) fill.style.width = Math.min(e, 1) * 100 + '%';
        } else if (fill) { fill.style.width = '0%'; }
        requestAnimationFrame(tick);
      })(base);
    }
    $('[data-ben-next]').addEventListener('click', function () { go(idx + 1); pause(); });
    $('[data-ben-prev]').addEventListener('click', function () { go(idx - 1); pause(); });
    track.addEventListener('mouseenter', function () { paused = true; });
    track.addEventListener('mouseleave', function () { paused = false; base = now(); });
    track.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { go(idx + 1); pause(); } else if (e.key === 'ArrowLeft') { go(idx - 1); pause(); } });
    var sx = 0, dragging = false;
    track.addEventListener('pointerdown', function (e) { dragging = true; sx = e.clientX; pause(); });
    window.addEventListener('pointerup', function (e) { if (!dragging) return; dragging = false; var dx = e.clientX - sx; if (dx < -40) go(idx + 1); else if (dx > 40) go(idx - 1); });
    window.addEventListener('resize', function () { go(idx); });
    go(0);
  })();

  /* headline word reveal */
  (function () {
    var words = document.querySelectorAll('[data-headline] .hw');
    if (reduce) { words.forEach(function (w) { w.classList.add('play'); }); return; }
    words.forEach(function (w, i) { w.style.animationDelay = (i * 90) + 'ms'; });
    setTimeout(function () { words.forEach(function (w) { w.classList.add('play'); }); }, 120);
  })();

  /* pointer parallax: bind a source element to a per-move callback */
  function bindParallax(source, onMove, onLeave) {
    if (reduce || !source) return;
    var raf = 0, tx = 0, ty = 0;
    source.addEventListener('pointermove', function (e) {
      var r = source.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; onMove(tx, ty); });
    });
    source.addEventListener('pointerleave', function () {
      tx = 0; ty = 0; requestAnimationFrame(function () { (onLeave || onMove)(0, 0); });
    });
  }

  /* hero duotone card 3D tilt */
  (function () {
    var hero = $('[data-hero]'), card = $('[data-hero-card]'); if (!hero || !card) return;
    bindParallax(hero, function (tx, ty) {
      card.style.transform = 'rotateY(' + (tx * 7) + 'deg) rotateX(' + (-ty * 6) + 'deg)';
    });
  })();

  /* featured stage depth parallax (ghost layers + card tilt) */
  (function () {
    var feat = $('[data-feat]'); if (!feat) return;
    var ghosts = Array.prototype.slice.call(feat.children).slice(0, 2);
    bindParallax(feat, function (tx, ty) {
      ghosts.forEach(function (g, i) {
        var depth = (i + 1) * 11;
        g.style.transition = 'transform .4s cubic-bezier(.2,.7,.3,1)';
        g.style.transform = 'translate(' + (-tx * depth) + 'px,' + (-ty * depth) + 'px)';
      });
    });
  })();

  /* reveal */
  function scan() { document.querySelectorAll('[data-reveal]').forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight * 0.92 && r.bottom > 0) el.classList.add('in'); }); }
  if (reduce) document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
  else { window.addEventListener('scroll', scan, { passive: true }); setTimeout(scan, 50); setInterval(scan, 400); }
})();

;

(function () {
  var cv = document.querySelector('[data-net]'); if (!cv) return;
  var host = document.querySelector('[data-hero]'); if (!host) return;
  var ctx = cv.getContext('2d'); if (!ctx) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, N = 16, nodes = [], hub = { x: 0, y: 0 };
  var mouse = { x: 0, y: 0, active: false }, raf = 0, running = false;

  function size() {
    var r = host.getBoundingClientRect(); W = r.width; H = r.height;
    cv.width = Math.max(1, W * dpr); cv.height = Math.max(1, H * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }
  function build() {
    hub.x = W * 0.6; hub.y = H * 0.46; nodes = [];
    var R = Math.min(Math.max(W, 640), 1180) * 0.5;
    for (var i = 0; i < N; i++) {
      var a = (i / N) * Math.PI * 2 + i * 0.7;
      var rad = R * (0.22 + 0.62 * ((i * 97) % 100) / 100);
      nodes.push({
        x: hub.x + Math.cos(a) * rad, y: hub.y + Math.sin(a) * rad * 0.82,
        vx: (((i * 53) % 20) / 20 - 0.5) * 0.22, vy: (((i * 31) % 20) / 20 - 0.5) * 0.22,
        r: 1.5 + ((i * 17) % 10) / 10 * 2.4, ph: i * 0.9
      });
    }
  }
  function step(t) {
    ctx.clearRect(0, 0, W, H);
    var mx = mouse.x, my = mouse.y, i, j, p;
    for (i = 0; i < nodes.length; i++) {
      p = nodes[i];
      if (!reduce) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 8 || p.x > W - 8) p.vx *= -1;
        if (p.y < 8 || p.y > H - 8) p.vy *= -1;
      }
      var near = mouse.active && Math.hypot(p.x - mx, p.y - my) < 150;
      var dh = Math.hypot(p.x - hub.x, p.y - hub.y);
      var alpha = Math.max(0, 0.5 - dh / (Math.max(W, H) * 0.95));
      ctx.strokeStyle = 'rgba(26,86,219,' + (alpha * (near ? 1 : 0.5)).toFixed(3) + ')';
      ctx.lineWidth = near ? 1.2 : 0.7;
      ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    }
    for (i = 0; i < nodes.length; i++) {
      for (j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 118) {
          ctx.strokeStyle = 'rgba(75,139,255,' + (0.16 * (1 - d / 118)).toFixed(3) + ')';
          ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (i = 0; i < nodes.length; i++) {
      p = nodes[i]; var pulse = 0.6 + 0.4 * Math.sin((t || 0) * 0.002 + p.ph);
      ctx.fillStyle = 'rgba(26,86,219,' + (0.35 + 0.3 * pulse).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    var hp = 0.6 + 0.4 * Math.sin((t || 0) * 0.003);
    ctx.beginPath(); ctx.arc(hub.x, hub.y, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(26,86,219,' + (0.09 + 0.05 * hp).toFixed(3) + ')'; ctx.fill();
    ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(26,86,219,' + (0.3 + 0.3 * hp).toFixed(3) + ')';
    ctx.beginPath(); ctx.arc(hub.x, hub.y, 10 + 4 * hp, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(hub.x, hub.y, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(26,86,219,.9)'; ctx.fill();
    if (running && !reduce) raf = requestAnimationFrame(step);
  }
  function start() { if (running) return; running = true; raf = requestAnimationFrame(step); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  size();
  window.addEventListener('resize', size, { passive: true });
  host.addEventListener('pointermove', function (e) {
    var r = host.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  host.addEventListener('pointerleave', function () { mouse.active = false; });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  if (reduce) step(0); else start();
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
