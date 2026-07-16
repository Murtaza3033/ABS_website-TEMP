/* about-us runtime — ported from the static about-us.js (shell-assets loader removed).
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
/* ================= ported about-us.js runtime ================= */

(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function icon(name, sz, sw) {
    var P = { layers:'<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
      target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
      zap:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>', spark:'<path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M5.6 5.6l2.8 2.8"/><path d="M15.6 15.6l2.8 2.8"/><path d="M18.4 5.6l-2.8 2.8"/><path d="M8.4 15.6l-2.8 2.8"/>',
      check:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
      heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
      team:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      shield:'<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
      handshake:'<path d="M11 17l2 2 4-4"/><path d="M2 12l4-4 4 4-4 4-4-4z"/><path d="M14 12l4-4 4 4-4 4"/>',
      building:'<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"/>',
      flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>' };
    return '<svg width="'+(sz||24)+'" height="'+(sz||24)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(sw||1.7)+'" stroke-linecap="round" stroke-linejoin="round">'+(P[name]||'')+'</svg>';
  }

  /* storyboard strip (gradient tiles + labels — over-cap photos omitted) */
  var STRIP = [['Engineering','team-monitor'],['Product Demos','presentation'],['Recognized','award'],['At ITCN Asia','booth-team'],['The Team','team-laptop'],['Live Demos','booth-demo'],['In the Field','brochure'],['Strategy','meeting']];
  var tints = ['#1a56db','#0f1729','#d4a017','#1a9d55','#123f9e','#4b8bff','#7c5cff','#1648b8'];
  $('[data-strip]').innerHTML = STRIP.concat(STRIP).map(function (s, i) {
    return '<div class="strip__card" style="background:linear-gradient(160deg,'+tints[i%tints.length]+',#0f1729);"><img src="/assets/images/about/'+s[1]+'.png" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" onerror="this.remove();"><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,23,41,0) 42%,rgba(15,23,41,.8) 100%);"></div><span>'+s[0]+'</span></div>';
  }).join('');

  /* milestones */
  var MILES = [['Year TBD','Align founded','#1a56db','team-laptop.png'],['Year TBD','BusinessFlo launch','#1a56db','presentation.png'],['2023','ITCN Asia exhibitor','#d4a017','itcn-wall.jpg'],['Year TBD','PeopleNest & Field Force','#1a56db','meeting.png'],['Today','One connected platform','#1a9d55','team-monitor.png']];
  $('[data-milestones]').innerHTML = MILES.map(function (m, i) {
    return '<div data-mile="'+i+'" style="opacity:.25;transform:translateY(10px);transition:opacity .4s ease,transform .4s ease;text-align:center;"><div class="abMile" style="width:76px;height:76px;margin:0 auto;border-radius:50%;padding:3px;background:'+m[2]+';box-shadow:0 14px 28px -12px rgba(15,23,41,.4);transition:transform .3s ease;"><div style="width:100%;height:100%;border-radius:50%;overflow:hidden;background:#fff;position:relative;"><div style="position:absolute;inset:0;background-image:url(/assets/images/about/'+m[3]+');background-size:cover;background-position:center;"></div></div></div><div style="font-size:11px;letter-spacing:1px;color:#8a94a6;margin-top:16px;text-transform:uppercase;font-weight:700;">'+m[0]+'</div><div style="font-size:15px;font-weight:600;color:#0f1729;margin-top:6px;line-height:1.3;">'+m[1]+'</div></div>';
  }).join('');

  /* stats */
  var STATS = [['3','Products on one platform','#4b8bff','rgba(75,139,255,.16)','layers'],['In-house','Design, build & support','#d4a017','rgba(212,160,23,.16)','spark'],['ITCN Asia','National exhibitor','#a48bff','rgba(164,139,255,.18)','building'],['Karachi','Built in Pakistan','#2fd07f','rgba(47,208,127,.16)','flag']];
  $('[data-stats]').innerHTML = STATS.map(function (s, i) {
    return '<div class="card-lift" data-reveal style="position:relative;background:#131c2e;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:26px 22px;overflow:hidden;"><div style="position:absolute;top:0;left:0;right:0;height:3px;background:'+s[2]+';"></div><div style="width:36px;height:36px;border-radius:10px;background:'+s[3]+';color:'+s[2]+';display:grid;place-items:center;margin-bottom:14px;">'+icon(s[4],20)+'</div><div style="font-size:30px;font-weight:800;color:#fff;letter-spacing:-1px;">'+s[0]+'</div><div style="font-size:13px;color:#8a97b0;margin-top:6px;line-height:1.4;">'+s[1]+'</div></div>';
  }).join('');

  /* expertise + tech stack */
  var EXP = [['ERP Architecture','Designing systems that model how an entire business actually runs — finance to field.','layers'],['SQL Server Administration','Reliable, tuned data layers that stay fast as your operations scale.','target'],['Full-Stack SaaS Development','From database to interface, designed, built and owned end to end.','zap'],['Enterprise UI/UX','Complex workflows made clear, usable and quick for everyday teams.','spark']];
  $('[data-expertise]').innerHTML = EXP.map(function (e) {
    return '<div class="card-lift" data-reveal style="display:flex;gap:16px;align-items:flex-start;background:#131c2e;border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:24px;"><div style="width:46px;height:46px;flex-shrink:0;border-radius:12px;background:rgba(26,86,219,.16);color:#7aa7ff;display:grid;place-items:center;">'+icon(e[2],22)+'</div><div><div style="font-size:17px;font-weight:700;color:#fff;">'+e[0]+'</div><p style="font-size:13.5px;line-height:1.6;color:#96a2ba;margin:6px 0 0;">'+e[1]+'</p></div></div>';
  }).join('');
  $('[data-techstack]').innerHTML = ['React','ASP.NET','SQL Server','TypeScript','Azure','REST APIs'].map(function (t) {
    return '<span style="font-size:12.5px;font-weight:700;color:#cdd8ec;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:9px 16px;">'+t+'</span>';
  }).join('');

  /* values */
  var VALS = [['01','Built around real workflows','We design for how teams actually work — not the other way around.','check'],['02','Ship fast, ship right','Quick to deliver, disciplined about quality.','zap'],['03','Client success over feature count','Outcomes matter more than a longer feature list.','target'],['04','One accountable team','We build, deploy and support it all in-house.','heart']];
  $('[data-values]').innerHTML = VALS.map(function (v) {
    return '<div class="card-lift" data-reveal style="position:relative;background:#fff;border:1px solid #eaeef5;border-radius:20px;padding:28px 24px;overflow:hidden;box-shadow:0 16px 40px -30px rgba(15,23,41,.2);"><span style="position:absolute;top:18px;right:20px;font-size:13px;font-weight:700;color:#dbe4f3;">'+v[0]+'</span><div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#1a56db,#4b8bff);color:#fff;display:grid;place-items:center;box-shadow:0 14px 26px -10px rgba(26,86,219,.55);animation:abValFloat 5s ease-in-out infinite;">'+icon(v[3],24)+'</div><div style="font-size:16.5px;font-weight:700;margin-top:18px;line-height:1.25;">'+v[1]+'</div><p style="font-size:13.5px;line-height:1.6;color:#5b6472;margin:8px 0 0;">'+v[2]+'</p></div>';
  }).join('');

  /* PEOPLE & NETWORK — the hub cards (pattern child pages inherit) */
  var NET = [
    { title:'Our Team', tag:'The builders', accent:'#1a56db', tint:'rgba(26,86,219,.1)', line:'The engineers, consultants and operators who build and run Align.', href:'/our-team.html', img:'team-laptop.png' },
    { title:'Our Advisors', tag:'Guidance', accent:'#7c5cff', tint:'rgba(124,92,255,.12)', line:'The guidance shaping how Align grows and where it goes next.', href:'/our-advisors.html', img:'ceo.png' },
    { title:'Our Partners', tag:'Ecosystem', accent:'#d4a017', tint:'rgba(212,160,23,.14)', line:'A network of trusted companies we build and grow alongside.', href:'/our-partners.html', img:'brochure.png' },
    { title:'Our Clients', tag:'Who we serve', accent:'#1a9d55', tint:'rgba(26,157,85,.12)', line:'The businesses that run their operations on Align every day.', href:'/our-clients.html', img:'booth-demo.png' }
  ];
  $('[data-network]').innerHTML = NET.map(function (n) {
    return '<a href="'+n.href+'" class="hub-card" data-reveal><div class="hub-card__rail" style="background:'+n.accent+';"></div>'
      + '<div class="hub-card__ic" style="overflow:hidden;position:relative;"><div style="position:absolute;inset:0;background-image:url(/assets/images/about/'+n.img+');background-size:cover;background-position:center;"></div><div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(26,86,219,.1),rgba(15,23,41,.3));"></div></div>'
      + '<div style="flex:1;"><span style="display:inline-block;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:'+n.accent+';background:'+n.tint+';border-radius:999px;padding:5px 11px;">'+n.tag+'</span>'
      + '<div style="font-size:22px;font-weight:700;color:#0f1729;margin-top:10px;">'+n.title+'</div>'
      + '<p style="font-size:14px;line-height:1.6;color:#5b6472;margin:6px 0 0;">'+n.line+'</p>'
      + '<span style="display:inline-flex;align-items:center;gap:7px;margin-top:14px;font-size:13.5px;font-weight:700;color:'+n.accent+';">Explore <span class="hub-arrow">→</span></span></div></a>';
  }).join('');

  /* What We Build — product preview carousel */
  var PRODMETA = [
    { name:'BusinessFlo', accent:'#1a56db', tint:'rgba(26,86,219,.14)', url:'app.businessflo.com', topTitle:'PO-2041 approved', topSub:'Warehouse notified', botLabel:'Payment received', botValue:'Rs 84,500', botDelta:'↑ Cleared just now' },
    { name:'PeopleNest', accent:'#7c5cff', tint:'rgba(124,92,255,.14)', url:'app.peoplenest.com', topTitle:'Leave approved', topSub:'Casual · 2 days', botLabel:'New hires this month', botValue:'12', botDelta:'↑ Onboarded' },
    { name:'Field Force', accent:'#1a9d55', tint:'rgba(26,157,85,.14)', url:'app.pharmafieldflo.com', topTitle:'Visit logged', topSub:'Dr. review · 4:20 PM', botLabel:'Coverage today', botValue:'87%', botDelta:'↑ 6% vs target' }
  ];
  var pb = 0, pbTimer = null, pbPaused = false, pbResume = null;
  function pbPause() { pbPaused = true; clearTimeout(pbResume); pbResume = setTimeout(function () { pbPaused = false; }, 9000); }
  function renderPb() {
    var m = PRODMETA[pb];
    $('[data-pb-url]').textContent = m.url;
    var track = $('[data-pb-track]'); if (track) track.style.transform = 'translateX(-' + (pb * 100) + '%)';
    $('[data-pb-top]').innerHTML = '<div style="display:flex;align-items:center;gap:11px;"><div style="width:36px;height:36px;border-radius:11px;background:'+m.tint+';color:'+m.accent+';display:grid;place-items:center;flex-shrink:0;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"></path></svg></div><div style="min-width:0;"><div style="font-size:13px;font-weight:800;color:#0f1729;line-height:1.15;">'+m.topTitle+'</div><div style="font-size:10.5px;color:#8a94a6;margin-top:2px;">'+m.topSub+'</div></div><span style="margin-left:auto;width:8px;height:8px;border-radius:50%;background:'+m.accent+';animation:abDot 1.6s ease-in-out infinite;flex-shrink:0;"></span></div>';
    $('[data-pb-bot]').innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;"><span style="font-size:9.5px;letter-spacing:.5px;color:#8a94a6;text-transform:uppercase;">'+m.botLabel+'</span><span style="display:inline-flex;align-items:center;gap:5px;font-size:9.5px;font-weight:700;color:#1a9d55;"><span style="width:6px;height:6px;border-radius:50%;background:#1a9d55;animation:abDot 1.6s ease-in-out infinite;"></span>LIVE</span></div><div style="font-size:23px;font-weight:800;color:#0f1729;margin-top:6px;letter-spacing:-.5px;">'+m.botValue+'</div><div style="font-size:10.5px;font-weight:700;color:'+m.accent+';margin-top:3px;">'+m.botDelta+'</div>';
    $('[data-pb-pills]').innerHTML = PRODMETA.map(function (x, i) { return '<button data-pbp="'+i+'" style="cursor:pointer;font-size:14px;font-weight:600;padding:10px 20px;border-radius:999px;border:1.5px solid '+(i===pb?x.accent:'#e3e9f3')+';background:'+(i===pb?x.accent:'#fff')+';color:'+(i===pb?'#fff':'#5b6472')+';transition:all .3s ease;">'+x.name+'</button>'; }).join('');
    $('[data-pb-dots]').innerHTML = PRODMETA.map(function (x, i) { return '<button data-pbp="'+i+'" aria-label="'+x.name+'" style="cursor:pointer;border:none;padding:0;width:'+(i===pb?'26px':'8px')+';height:8px;border-radius:999px;background:'+(i===pb?x.accent:'#d5deed')+';transition:all .35s ease;"></button>'; }).join('');
    document.querySelectorAll('[data-pbp]').forEach(function (b) { b.addEventListener('click', function () { pb = +b.getAttribute('data-pbp'); pbPause(); renderPb(); }); });
  }
  renderPb();
  var pbPrevBtn = $('[data-act="pbPrev"]'); if (pbPrevBtn) pbPrevBtn.addEventListener('click', function () { pb = (pb + 2) % 3; pbPause(); renderPb(); });
  var pbNextBtn = $('[data-act="pbNext"]'); if (pbNextBtn) pbNextBtn.addEventListener('click', function () { pb = (pb + 1) % 3; pbPause(); renderPb(); });
  pbTimer = setInterval(function () { if (!pbPaused) { pb = (pb + 1) % PRODMETA.length; renderPb(); } }, 5000);

  /* reveal-on-scroll */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function scan() {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) el.classList.add('in');
    });
  }
  if (reduce) document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
  else { window.addEventListener('scroll', scan, { passive: true }); setTimeout(scan, 50); setInterval(scan, 400); }

  /* journey line fill + markers on scroll */
  function journey() {
    var j = $('[data-journey]'); if (!j) return;
    var r = j.getBoundingClientRect(); var vh = window.innerHeight;
    var prog = Math.max(0, Math.min(1, (vh * 0.72 - r.top) / (r.height + vh * 0.34)));
    var line = $('[data-journey-line]'); if (line) line.style.width = (prog * 100) + '%';
    var miles = document.querySelectorAll('[data-mile]');
    miles.forEach(function (el, i) {
      var on = prog >= (i / (miles.length - 0.6));
      el.style.opacity = on ? '1' : '.32'; el.style.transform = on ? 'translateY(0)' : 'translateY(10px)';
      var mk = el.querySelector('.abMile'); if (mk) mk.style.transform = on ? 'scale(1.08)' : 'scale(.9)';
    });
  }
  window.addEventListener('scroll', journey, { passive: true }); setTimeout(journey, 120);
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
