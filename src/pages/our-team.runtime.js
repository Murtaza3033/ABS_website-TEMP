/* our-team runtime — ported from the static our-team.js (shell-assets loader removed).
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
/* ================= ported our-team.js runtime ================= */

(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function icon(name, sz) {
    var P = {
      spark: '<path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M5.6 5.6l2.8 2.8"/><path d="M15.6 15.6l2.8 2.8"/><path d="M18.4 5.6l-2.8 2.8"/><path d="M8.4 15.6l-2.8 2.8"/>',
      zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
      target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
      heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>'
    };
    return '<svg width="' + (sz || 24) + '" height="' + (sz || 24) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (P[name] || '') + '</svg>';
  }

  /* hero stats */
  var HERO = [['12','+','Years of Excellence'],['150','+','Enterprise Clients'],['250','+','Team Members'],['20','+','Products & Solutions']];
  $('[data-hero-stats]').innerHTML = HERO.map(function (h) {
    return '<div style="padding:20px 28px;border-right:1px solid rgba(255,255,255,.08);"><div style="font-size:26px;font-weight:800;color:#fff;letter-spacing:-.5px;"><span data-count="'+h[0]+'">0</span>'+h[1]+'</div><div style="font-size:11.5px;color:#96a2ba;margin-top:3px;">'+h[2]+'</div></div>';
  }).join('');

  /* leaders */
  var DESC = { 'Strategy':'Setting direction and the bets worth making.','Vision':'Where Align is headed next.','Leadership':'Steering the team and the culture.','Growth':'Scaling the company sustainably.','.NET':'Core ERP platform engineering.','React':'Modern, responsive product UI.','DevOps':'CI/CD, reliability and releases.','Cloud':'Scalable cloud infrastructure.','SQL':'Data modelling and SQL Server.','Innovation':'Turning new ideas into roadmap.','AI':'Applied intelligence across the platform.','Product':'Shaping what we build and why.','Implementation':'Deploying Align into live operations.','Project Management':'Delivery, on time and on scope.','ERP':'End-to-end business systems.','Client Success':'Onboarding and long-term support.' };
  var LEADERS = [
    { num:'01', role:'Chief Executive Officer', name:'Muhammad Shamsheer', mono:'MS', photo:'p-5818', grad:'linear-gradient(160deg,#1a56db,#0f1729)',
      caption:'Reviewing company strategy from the executive floor, where direction for the whole Align platform comes together.',
      quote:"We don't ship software — we hand businesses the way they'll run for the next decade.",
      tags:['Strategy','Vision','Leadership','Growth'],
      c1:['Company Overview','Active Clients',150,['40%','58%','48%','74%','66%','90%']], c2:['Solutions','LIVE','Deployed',20], c3:['Revenue growth','↑ steady climb'] },
    { num:'02', role:'Director Technical', name:'Ebad ur Rehman', mono:'ER', photo:'p-5733', grad:'linear-gradient(160deg,#123f9e,#0f1729)',
      caption:'Mid production fix — laptop in hand, pointing at a live API issue while the monitors run debugging in the background.',
      quote:"If it isn't rock-solid at 2 AM, it isn't done.",
      tags:['.NET','React','DevOps','Cloud','SQL'],
      c1:['Build Health','Uptime',99,['70%','84%','60%','92%','78%','96%']], c2:['Issue Detected','FIXING','Live API errors',3], c3:['Latency (ms)','↓ trending down'] },
    { num:'03', role:'Manager, Innovation & Strategy', name:'Hadi Shamsheer', mono:'HS', photo:'p-5850', grad:'linear-gradient(160deg,#4b8bff,#0f1729)',
      caption:"Sketching a strategy flow on the glass board, with Align's connected ecosystem — finance, people, field ops, reporting — mapped around the workflow.",
      quote:'Every great feature begins as a simple question: what would make this effortless?',
      tags:['Innovation','AI','Strategy','Product'],
      c1:['Ideas in Progress','This month',12,['44%','56%','66%','72%','84%','92%']], c2:['Alignment','ON TRACK','Cross-functional',82], c3:['Projects in motion','↑ +25% this month'] },
    { num:'04', role:'Implementation Manager', name:'Sadiq', mono:'S', photo:'p-5649', grad:'linear-gradient(160deg,#1a9d55,#0f1729)',
      caption:'Walking a client through go-live — configuration and deployment boards mid-update, checklist ticking off as modules come online.',
      quote:"Go-live isn't the finish line — it's the day we start earning your trust.",
      tags:['Implementation','Project Management','ERP','Client Success'],
      c1:['Go-Live Board','Modules live',18,['50%','62%','74%','80%','88%','100%']], c2:['Deployment','SUCCESS','Completion',100], c3:['Rollout pace','↑ on schedule'] }
  ];
  function tags(arr) { return arr.map(function (t) { return '<span class="tagPop anim" style="font-size:12.5px;font-weight:600;color:#cfe0ff;background:rgba(26,86,219,.16);border:1px solid rgba(75,139,255,.3);border-radius:999px;padding:7px 14px;">'+t+'<span class="tagCard">'+(DESC[t]||'A core strength on the team.')+'</span></span>'; }).join(''); }
  function bars(arr) { return arr.map(function (h) { return '<div class="mBar" style="flex:1;--h:'+h+';background:linear-gradient(#4b8bff,#1a56db);border-radius:2px 2px 0 0;"></div>'; }).join(''); }
  function nameWords(full) { var parts = full.split(' '); return parts.map(function (t, i) { return '<span style="display:inline-block;margin-right:12px;color:' + (i === parts.length - 1 ? '#4b8bff' : '#fff') + ';">' + t + '</span>'; }).join(''); }
  function fcards(L, even) {
    // safe zones: two cards stacked on the content side (clear of the middle text band), one on the portrait side
    var c1pos = even ? 'top:3%;right:2%' : 'top:3%;left:2%';
    var c2pos = even ? 'bottom:5%;right:2%' : 'bottom:5%;left:2%';
    var c3pos = even ? 'top:33%;left:2%' : 'top:33%;right:2%';
    return '<div class="cardWrap" style="position:absolute;inset:0;pointer-events:none;">'
      + '<div class="fcard" style="pointer-events:auto;position:absolute;'+c1pos+';width:210px;background:rgba(255,255,255,.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:16px;box-shadow:0 30px 60px -30px rgba(0,0,0,.6);animation:tmFloat1 7s ease-in-out infinite;"><div style="display:flex;align-items:center;gap:8px;"><span style="width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,#1a56db,#4b8bff);display:grid;place-items:center;color:#fff;font-weight:800;font-size:11px;">A</span><span style="font-size:12px;font-weight:700;color:#fff;">'+L.c1[0]+'</span></div><div style="font-size:10px;color:#7d8db3;text-transform:uppercase;letter-spacing:.5px;margin-top:12px;">'+L.c1[1]+'</div><div data-count="'+L.c1[2]+'" style="font-size:24px;font-weight:800;color:#fff;margin-top:3px;">0</div><div style="display:flex;align-items:flex-end;gap:4px;height:34px;margin-top:10px;">'+bars(L.c1[3])+'</div></div>'
      + '<div class="fcard" style="pointer-events:auto;position:absolute;'+c2pos+';width:196px;background:rgba(255,255,255,.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:16px;box-shadow:0 30px 60px -30px rgba(0,0,0,.6);animation:tmFloat2 8.4s ease-in-out .6s infinite;"><div style="display:flex;align-items:center;justify-content:space-between;"><span style="font-size:11.5px;font-weight:700;color:#fff;">'+L.c2[0]+'</span><span style="display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:800;color:#4bd07f;"><span style="width:6px;height:6px;border-radius:50%;background:#4bd07f;animation:tmDotPulse 1.8s ease-in-out infinite;"></span>'+L.c2[1]+'</span></div><div style="font-size:10px;color:#7d8db3;text-transform:uppercase;letter-spacing:.5px;margin-top:12px;">'+L.c2[2]+'</div><div data-count="'+L.c2[3]+'" style="font-size:22px;font-weight:800;color:#fff;margin-top:3px;">0</div><div style="height:6px;border-radius:4px;background:rgba(255,255,255,.1);margin-top:10px;overflow:hidden;"><div class="mBar" style="--h:100%;width:100%;height:100%;background:linear-gradient(90deg,#1a56db,#4b8bff);"></div></div></div>'
      + '<div class="fcard" style="pointer-events:auto;position:absolute;'+c3pos+';width:180px;background:rgba(255,255,255,.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:15px;box-shadow:0 30px 60px -30px rgba(0,0,0,.6);animation:tmFloat3 7.6s ease-in-out 1s infinite;"><div style="font-size:11px;font-weight:700;color:#fff;">'+L.c3[0]+'</div><svg viewBox="0 0 120 40" style="width:100%;height:38px;margin-top:8px;overflow:visible;"><path class="mLine" d="M2,34 L24,24 L46,28 L68,14 L90,18 L118,4" fill="none" stroke="#4b8bff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg><div style="font-size:10px;color:#4bd07f;font-weight:700;margin-top:4px;">'+L.c3[1]+'</div></div>'
      + '</div>';
  }
  $('[data-leaders]').innerHTML = LEADERS.map(function (L, i) {
    var even = i % 2 === 0;
    var portrait = '<div style="order:'+(even?1:2)+';position:relative;display:flex;justify-content:center;align-items:flex-end;min-height:440px;">'
      + '<div style="position:absolute;bottom:6%;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(26,86,219,.4),transparent 68%);filter:blur(6px);"></div>'
      + '<div style="position:relative;animation:tmPortraitFloat 8s ease-in-out infinite;"><div class="tPortrait" style="background-image:url(/assets/images/team/'+L.photo+'.png);"></div><div style="position:absolute;left:0;right:0;bottom:0;height:26%;background:linear-gradient(to top,#0f1729,transparent);"></div></div>'
      + '<span style="position:absolute;top:8px;left:8px;font-size:64px;font-weight:800;color:rgba(75,139,255,.16);letter-spacing:-2px;">'+L.num+'</span></div>';
    var content = '<div style="order:'+(even?2:1)+';position:relative;">'
      + '<div class="anim" style="font-size:12px;font-weight:700;letter-spacing:2px;color:#7aa7ff;text-transform:uppercase;">'+L.role+'</div>'
      + '<h2 class="anim" style="font-size:clamp(30px,4.5vw,44px);line-height:1.06;letter-spacing:-1.2px;font-weight:800;margin:12px 0 0;color:#fff;">'+nameWords(L.name)+'</h2>'
      + '<p class="anim" style="font-size:16px;line-height:1.7;color:#b7c2d6;margin:18px 0 0;max-width:440px;">'+L.caption+'</p>'
      + '<blockquote class="mQuote" style="margin:20px 0 0;padding-left:16px;border-left:3px solid rgba(75,139,255,.55);font-family:var(--font-hand);font-size:23px;line-height:1.4;color:#8fb8ff;max-width:440px;">“'+L.quote+'”</blockquote>'
      + '<div style="display:flex;flex-wrap:wrap;gap:9px;margin-top:22px;">'+tags(L.tags)+'</div></div>';
    return '<section class="tsec tScene" data-tsec id="leader-'+i+'" style="min-height:100vh;display:flex;align-items:center;padding:90px 32px;position:relative;overflow:hidden;">'
      + '<div class="tGlow"></div>'
      + '<div class="sceneGrid" style="position:relative;z-index:1;max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;width:100%;">'
      + portrait + content + fcards(L, even) + '</div></section>';
  }).join('');

  /* THE ALIGN WAY — culture principles */
  var WAY = [
    ['01','Curiosity first','spark','We hire for the questions people ask — not just the answers they already have.'],
    ['02','Ship, then sharpen','zap','Momentum beats perfection. We release early, gather real feedback, and refine fast.'],
    ['03','Own the outcome','target','One team is accountable — from the first line of code to a client\'s live go-live.'],
    ['04','Teach as you build','heart','Every project leaves the whole team a little sharper than it found them.']
  ];
  var $way = $('[data-align-way]');
  if ($way) $way.innerHTML = WAY.map(function (w) {
    return '<div class="awCard anim"><span class="awNum">'+w[0]+'</span><div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#1a56db,#4b8bff);color:#fff;display:grid;place-items:center;box-shadow:0 14px 26px -10px rgba(26,86,219,.55);">'+icon(w[2],24)+'</div><div style="font-size:18px;font-weight:700;color:#fff;margin-top:18px;letter-spacing:-.3px;">'+w[1]+'</div><p style="font-size:13.5px;line-height:1.6;color:#96a2ba;margin:8px 0 0;">'+w[3]+'</p></div>';
  }).join('');

  /* cursor-follow spotlight per leader scene (creative depth) */
  document.querySelectorAll('.tScene').forEach(function (sc) {
    var g = sc.querySelector('.tGlow'); if (!g) return;
    sc.addEventListener('mousemove', function (e) { var r = sc.getBoundingClientRect(); g.style.left = (e.clientX - r.left) + 'px'; g.style.top = (e.clientY - r.top) + 'px'; g.style.opacity = '1'; });
    sc.addEventListener('mouseleave', function () { g.style.opacity = '0'; });
  });

  /* seniors */
  var SEN = [['SE','Senior Software Engineer','Owns core platform modules.'],['HR','Senior HR Executive','People, culture and hiring.'],['FO','Senior Finance Officer','Keeps the numbers honest.'],['SU','Senior Support Engineer','Clients, unblocked.'],['BA','Senior Business Analyst','Turns needs into specs.']];
  $('[data-seniors]').innerHTML = SEN.map(function (s) {
    return '<div class="anim" style="background:#fff;border:1px solid #eaeef5;border-radius:18px;padding:22px 18px;text-align:center;box-shadow:0 16px 40px -30px rgba(15,23,41,.28);"><div style="width:64px;height:64px;margin:0 auto;border-radius:50%;background:linear-gradient(135deg,#e8effc,#dbe6ff);display:grid;place-items:center;color:#1a56db;font-weight:800;font-size:20px;">'+s[0]+'</div><div style="font-size:13px;font-weight:700;margin-top:14px;color:#b3bccb;letter-spacing:.5px;">NAME TBD</div><div style="font-size:13px;font-weight:600;color:#1a56db;margin-top:4px;line-height:1.3;">'+s[1]+'</div><p style="font-size:12px;line-height:1.5;color:#5b6472;margin:8px 0 0;">'+s[2]+'</p></div>';
  }).join('');

  /* team grid */
  var ROLES = ['Engineer','Consultant','QA','Designer','Support','Sales','Analyst','DevOps','PM','Onboarding','SQL Admin','Ops'];
  var PAL = [['#eef4ff','#1a56db'],['#0f1729','#9fc0ff'],['#e8effc','#1a56db'],['#dbe6ff','#1a56db']];
  $('[data-team]').innerHTML = ROLES.map(function (r, i) {
    var c = PAL[i % PAL.length];
    return '<div class="anim" style="background:var(--tint);border:1px solid #eaeef5;border-radius:16px;padding:18px 12px;text-align:center;"><div style="width:52px;height:52px;margin:0 auto;border-radius:50%;background:'+c[0]+';display:grid;place-items:center;color:'+c[1]+';font-weight:800;font-size:16px;">—</div><div style="font-size:12px;font-weight:700;margin-top:10px;color:#b3bccb;">NAME TBD</div><div style="font-size:11px;color:#5b6472;margin-top:2px;">'+r+'</div></div>';
  }).join('');

  /* ---- interactions: reveal + count-up + spine ---- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var secs = Array.prototype.slice.call(document.querySelectorAll('[data-tsec]'));
  var counted = new Set();
  function runCount(sec) {
    sec.querySelectorAll('[data-count]').forEach(function (el) {
      if (counted.has(el)) return; counted.add(el);
      var target = parseFloat(el.getAttribute('data-count')) || 0, dur = 1200, t0 = performance.now();
      if (reduce) { el.textContent = Math.round(target).toLocaleString(); return; }
      var step = function (now) { var p = Math.min(1, (now - t0) / dur); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString(); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }
  var fill = $('[data-spine-fill]');
  var path = $('[data-spine-path]'), pathLen = 0;
  if (path) { try { pathLen = path.getTotalLength(); path.style.strokeDasharray = pathLen; path.style.strokeDashoffset = reduce ? 0 : pathLen; } catch (e) {} }
  var spineBtns = Array.prototype.slice.call(document.querySelectorAll('[data-spine]'));
  spineBtns.forEach(function (b) { b.addEventListener('click', function () { var el = secs[+b.getAttribute('data-spine')]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); });
  document.querySelectorAll('[data-spine-jump]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); var el = secs[+a.getAttribute('data-spine-jump')]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); });
  function scan() {
    var vh = window.innerHeight;
    secs.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top < vh * 0.78 && r.bottom > vh * 0.1 && !s.classList.contains('tin')) { s.classList.add('tin'); runCount(s); } });
    if (reduce) return;
    var doc = document.documentElement, max = doc.scrollHeight - vh, prog = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (fill) fill.style.height = (prog * 100) + '%';
    if (path) path.style.strokeDashoffset = pathLen * (1 - Math.min(1, prog * 1.3));
    if (window.innerWidth > 900) {
      document.querySelectorAll('.tScene').forEach(function (sc) {
        var r = sc.getBoundingClientRect(); var f = ((r.top + r.height / 2) - vh / 2) / vh;
        var grid = sc.querySelector('.sceneGrid'); if (!grid) return;
        var portrait = grid.children[0]; var wrap = sc.querySelector('.cardWrap');
        if (portrait) portrait.style.transform = 'translateY(' + (f * -26) + 'px)';
        if (wrap) wrap.style.transform = 'translateY(' + (f * -52) + 'px)';
      });
    }
    var vc = window.scrollY + vh / 2, best = 0, bd = Infinity;
    secs.forEach(function (s, i) { var r = s.getBoundingClientRect(); var c = window.scrollY + r.top + r.height / 2; var d = Math.abs(c - vc); if (d < bd) { bd = d; best = i; } });
    spineBtns.forEach(function (b, i) { b.style.color = i === best ? '#4b8bff' : '#5f6f8c'; });
    var spineSvg = document.querySelector('[data-spine-svg]'); if (spineSvg) spineSvg.style.opacity = best === 3 ? '0.35' : '1';
    var spineEl = document.querySelector('.tSpine'), last = secs[secs.length - 1];
    if (spineEl && last) { var hide = last.getBoundingClientRect().top < vh * 0.28; spineEl.style.opacity = hide ? '0' : '1'; spineEl.style.transform = hide ? 'translateY(-50%) translateX(-40px)' : 'translateY(-50%) translateX(0)'; spineEl.style.pointerEvents = hide ? 'none' : 'auto'; }
  }
  if (reduce) secs.forEach(function (s) { s.classList.add('tin'); runCount(s); });
  else { window.addEventListener('scroll', scan, { passive: true }); window.addEventListener('resize', scan, { passive: true }); setInterval(scan, 300); setTimeout(scan, 60); }
})();

;

(function () {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var cv = document.querySelector('[data-particles]'); if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d'), W, H, dots = [], DPR = Math.min(2, window.devicePixelRatio || 1), LINK = 130;
  function resize() { W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; }
  resize(); window.addEventListener('resize', resize);
  var N = Math.max(28, Math.min(66, Math.floor(innerWidth / 26)));
  for (var i = 0; i < N; i++) dots.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .16 * DPR, vy: (Math.random() - .5) * .16 * DPR, r: (Math.random() * 1.5 + .6) * DPR });
  var running = true;
  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i]; d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1; if (d.y < 0 || d.y > H) d.vy *= -1;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.2832); ctx.fillStyle = 'rgba(120,167,255,.5)'; ctx.fill();
      for (var j = i + 1; j < dots.length; j++) {
        var e = dots[j], dx = d.x - e.x, dy = d.y - e.y, dist = Math.sqrt(dx * dx + dy * dy), lim = LINK * DPR;
        if (dist < lim) { ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(e.x, e.y); ctx.strokeStyle = 'rgba(75,139,255,' + (0.16 * (1 - dist / lim)) + ')'; ctx.lineWidth = DPR * .55; ctx.stroke(); }
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) requestAnimationFrame(tick); });
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
