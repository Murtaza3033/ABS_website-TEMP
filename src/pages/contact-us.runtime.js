/* contact-us runtime — ported from the static contact-us.js (shell-assets loader removed).
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
/* ================= ported contact-us.js runtime ================= */

(function () {
  var root = document;
  var state = { mode: null, step: 0, name: '', company: '', reason: 'Book a demo', product: 'Not sure yet', email: '', phone: '', country: 'PK', message: '', touched: {} };

  var validEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim()); };
  var validName = function (v) { v = (v || '').trim(); return v.length >= 2 && /^[A-Za-z][A-Za-z .'-]*$/.test(v); };

  /* ---- country dial codes + national number lengths ---- */
  var COUNTRIES = [
    { iso: 'PK', name: 'Pakistan', dial: '+92', len: [10, 10] },
    { iso: 'AE', name: 'United Arab Emirates', dial: '+971', len: [9, 9] },
    { iso: 'SA', name: 'Saudi Arabia', dial: '+966', len: [9, 9] },
    { iso: 'QA', name: 'Qatar', dial: '+974', len: [8, 8] },
    { iso: 'KW', name: 'Kuwait', dial: '+965', len: [8, 8] },
    { iso: 'BH', name: 'Bahrain', dial: '+973', len: [8, 8] },
    { iso: 'OM', name: 'Oman', dial: '+968', len: [8, 8] },
    { iso: 'GB', name: 'United Kingdom', dial: '+44', len: [10, 10] },
    { iso: 'US', name: 'United States', dial: '+1', len: [10, 10] },
    { iso: 'CA', name: 'Canada', dial: '+1', len: [10, 10] },
    { iso: 'AU', name: 'Australia', dial: '+61', len: [9, 9] },
    { iso: 'IN', name: 'India', dial: '+91', len: [10, 10] },
    { iso: 'BD', name: 'Bangladesh', dial: '+880', len: [10, 10] },
    { iso: 'LK', name: 'Sri Lanka', dial: '+94', len: [9, 9] },
    { iso: 'EG', name: 'Egypt', dial: '+20', len: [10, 10] },
    { iso: 'TR', name: 'Turkey', dial: '+90', len: [10, 10] },
    { iso: 'ZA', name: 'South Africa', dial: '+27', len: [9, 9] },
    { iso: 'NG', name: 'Nigeria', dial: '+234', len: [10, 10] },
    { iso: 'MY', name: 'Malaysia', dial: '+60', len: [9, 10] },
    { iso: 'SG', name: 'Singapore', dial: '+65', len: [8, 8] },
    { iso: 'ID', name: 'Indonesia', dial: '+62', len: [9, 11] },
    { iso: 'PH', name: 'Philippines', dial: '+63', len: [10, 10] },
    { iso: 'CN', name: 'China', dial: '+86', len: [11, 11] },
    { iso: 'JP', name: 'Japan', dial: '+81', len: [10, 10] },
    { iso: 'DE', name: 'Germany', dial: '+49', len: [10, 11] },
    { iso: 'FR', name: 'France', dial: '+33', len: [9, 9] },
    { iso: 'IT', name: 'Italy', dial: '+39', len: [9, 10] },
    { iso: 'ES', name: 'Spain', dial: '+34', len: [9, 9] },
    { iso: 'NL', name: 'Netherlands', dial: '+31', len: [9, 9] },
    { iso: 'BR', name: 'Brazil', dial: '+55', len: [10, 11] }
  ];
  var ccByIso = {}; COUNTRIES.forEach(function (c) { ccByIso[c.iso] = c; });
  function cc(iso) { return ccByIso[iso] || ccByIso.PK; }
  function ccOptions(sel) { return COUNTRIES.map(function (c) { return '<option value="' + c.iso + '"' + (c.iso === sel ? ' selected' : '') + '>' + c.dial + ' ' + c.name + '</option>'; }).join(''); }
  function lenText(iso) { var c = cc(iso); return c.len[0] === c.len[1] ? (c.len[0] + ' digits') : (c.len[0] + '–' + c.len[1] + ' digits'); }
  function phonePH(iso) { return cc(iso).len[0] === cc(iso).len[1] ? (cc(iso).len[0] + '-digit number') : (lenText(iso)); }
  function phoneErr(iso) { return 'Enter a valid ' + cc(iso).name + ' number (' + lenText(iso) + ').'; }
  var validPhone = function (v, iso) { if (!v || !v.trim()) return true; var c = cc(iso); var d = v.replace(/\D/g, ''); return d.length >= c.len[0] && d.length <= c.len[1]; };
  function wirePhoneCC(scope) {
    (scope || root).querySelectorAll('[data-phone-cc]').forEach(function (sel) {
      if (!sel.options.length) sel.innerHTML = ccOptions(state.country);
      sel.value = state.country;
      var inp0 = sel.parentNode.querySelector('input[type="tel"]');
      if (inp0) inp0.placeholder = phonePH(state.country);
      if (sel.__wired) return; sel.__wired = true;
      sel.addEventListener('change', function () {
        state.country = sel.value;
        var inp = sel.parentNode.querySelector('input[type="tel"]');
        if (inp) inp.placeholder = phonePH(state.country);
        root.querySelectorAll('[data-phone-cc]').forEach(function (s2) { if (s2 !== sel) s2.value = state.country; });
      });
    });
  }

  var views = {};
  ['choice', 'chat', 'classic', 'done'].forEach(function (k) { views[k] = root.querySelector('[data-view="' + k + '"]'); });
  function show(view) {
    Object.keys(views).forEach(function (k) { if (views[k]) views[k].style.display = (k === view) ? '' : 'none'; });
  }

  function submit() {
    var s = state;
    var subject = 'Website enquiry — ' + (s.name || '');
    var body = 'Name: ' + s.name + '\nCompany: ' + s.company + '\nReason: ' + s.reason + '\nProduct: ' + s.product + '\nEmail: ' + s.email + '\nPhone: ' + (s.phone ? cc(s.country).dial + ' ' + s.phone : '') + '\n\n' + s.message;
    var done = root.querySelector('[data-done-title]');
    if (done) done.textContent = 'Thanks' + (s.name ? ', ' + s.name.split(' ')[0] : '') + ' — message sent.';
    show('done');
    try { window.location.href = 'mailto:sales@alignbsystems.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); } catch (e) {}
  }

  /* ---- mode choice ---- */
  root.querySelectorAll('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.mode = b.getAttribute('data-pick');
      if (state.mode === 'chat') { state.step = 0; renderChat(); show('chat'); }
      else show('classic');
    });
  });
  root.querySelectorAll('[data-act="toClassic"]').forEach(function (b) { b.addEventListener('click', function () { state.mode = 'classic'; show('classic'); }); });
  root.querySelectorAll('[data-act="toChat"]').forEach(function (b) { b.addEventListener('click', function () { state.mode = 'chat'; state.step = 0; renderChat(); show('chat'); }); });
  var resetBtn = root.querySelector('[data-act="reset"]');
  if (resetBtn) resetBtn.addEventListener('click', function () { state = { mode: null, step: 0, name: '', company: '', reason: 'Book a demo', product: 'Not sure yet', email: '', phone: '', country: 'PK', message: '', touched: {} }; show('choice'); });

  /* ---- conversational flow ---- */
  var qTitles = { name: "What's your name?", company: 'What company are you with?', reason: 'What brings you to Align?', product: 'Which product interests you?', contact: 'How can we reach you?', message: "Anything you'd like us to know?" };
  var reasonOpts = ['Book a demo', 'Product question', 'Partnership', 'Careers', 'Something else'];
  var productOpts = ['BusinessFlo', 'PeopleNest', 'Field Force', 'Not sure yet'];
  function steps() {
    var routed = state.reason === 'Book a demo' || state.reason === 'Product question';
    return ['name', 'company', 'reason', routed ? 'product' : null, 'contact', 'message'].filter(Boolean);
  }
  var errRow = function (msg) { return msg ? '<div class="cErrMsg">&#9888; ' + msg + '</div>' : ''; };

  function renderChat() {
    var st = steps(); var key = st[state.step] || 'message';
    var body = root.querySelector('[data-chat-body]');
    var bar = root.querySelector('[data-chat-bar]');
    var label = root.querySelector('[data-chat-label]');
    var nextBtn = root.querySelector('[data-act="chatNext"]');
    var backBtn = root.querySelector('[data-act="chatBack"]');
    bar.style.width = Math.round((state.step / st.length) * 100) + '%';
    label.textContent = (state.step + 1) + ' / ' + st.length;
    backBtn.style.color = state.step === 0 ? '#d5deed' : '#8a94a6';
    var html = '<div style="animation:cSlideR .45s cubic-bezier(.2,.7,.3,1) both;"><div style="font-size:24px;font-weight:800;letter-spacing:-.5px;color:var(--ink);">' + qTitles[key] + '</div>';
    if (key === 'name' || key === 'company') {
      var val = key === 'name' ? state.name : state.company;
      var bad = key === 'name' && state.touched.name && !validName(state.name);
      html += '<input data-chat-input class="cInput' + (bad ? ' cErr' : '') + '" value="' + (val || '').replace(/"/g, '&quot;') + '" placeholder="' + (key === 'name' ? 'Your name' : 'Company (optional)') + '" style="margin-top:18px;">';
      if (bad) html += errRow('Enter a valid name (letters only).');
    } else if (key === 'reason' || key === 'select-reason') {
      html += '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:20px;">' + reasonOpts.map(function (o) { return '<button class="cOpt" data-opt="reason" data-val="' + o + '">' + o + '</button>'; }).join('') + '</div>';
    } else if (key === 'product') {
      html += '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:20px;">' + productOpts.map(function (o) { return '<button class="cOpt" data-opt="product" data-val="' + o + '">' + o + '</button>'; }).join('') + '</div>';
    } else if (key === 'contact') {
      var eb = state.touched.email && (!state.email.trim() || !validEmail(state.email));
      var pb = state.touched.phone && !validPhone(state.phone, state.country);
      html += '<div style="margin-top:18px;display:flex;flex-direction:column;gap:12px;">'
        + '<div><input data-chat-input data-field="email" type="email" class="cInput' + (eb ? ' cErr' : '') + '" value="' + (state.email || '').replace(/"/g, '&quot;') + '" placeholder="you@company.com (required)">' + (eb ? errRow(!state.email.trim() ? 'Email is required so we can reply.' : 'Enter a valid email address.') : '') + '</div>'
        + '<div><div style="display:flex;gap:8px;"><select data-phone-cc class="cInput" style="width:172px;flex-shrink:0;padding:13px 10px;">' + ccOptions(state.country) + '</select><input data-field="phone" type="tel" class="cInput' + (pb ? ' cErr' : '') + '" value="' + (state.phone || '').replace(/"/g, '&quot;') + '" placeholder="' + phonePH(state.country) + ' (optional)"></div>' + (pb ? errRow(phoneErr(state.country)) : '') + '</div>'
        + '</div>';
    } else if (key === 'message') {
      html += '<textarea data-field="message" class="cInput" placeholder="Optional — a line or two of context" rows="4" style="margin-top:18px;resize:vertical;">' + (state.message || '') + '</textarea>';
    }
    html += '</div>';
    body.innerHTML = html;
    wirePhoneCC(body);
    nextBtn.style.display = (key === 'reason' || key === 'product') ? 'none' : '';
    nextBtn.textContent = state.step >= st.length - 1 ? 'Send' : 'Continue';

    // wire inputs
    var inp = body.querySelector('[data-chat-input]');
    if (inp) { setTimeout(function () { inp.focus(); }, 60); }
    body.querySelectorAll('input,textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        var f = el.getAttribute('data-field');
        if (key === 'name') state.name = el.value;
        else if (key === 'company') state.company = el.value;
        else if (f === 'email') state.email = el.value;
        else if (f === 'phone') state.phone = el.value;
        else if (f === 'message') state.message = el.value;
      });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' && el.tagName !== 'TEXTAREA') { e.preventDefault(); advance(); } });
    });
    body.querySelectorAll('[data-opt]').forEach(function (b) {
      b.addEventListener('click', function () {
        state[b.getAttribute('data-opt')] = b.getAttribute('data-val');
        state.step += 1; renderChat();
      });
    });
  }
  function advance() {
    var st = steps(); var key = st[state.step] || 'message';
    if (key === 'name' && !validName(state.name)) { state.touched.name = true; renderChat(); return; }
    if (key === 'contact' && (!validEmail(state.email) || !validPhone(state.phone, state.country))) { state.touched.email = true; state.touched.phone = true; renderChat(); return; }
    if (state.step >= st.length - 1) submit(); else { state.step += 1; renderChat(); }
  }
  root.querySelector('[data-act="chatNext"]').addEventListener('click', advance);
  root.querySelector('[data-act="chatBack"]').addEventListener('click', function () { if (state.step > 0) { state.step -= 1; renderChat(); } });

  /* ---- classic form ---- */
  var form = root.querySelector('[data-classic-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      state.name = f.name.value; state.company = f.company.value; state.reason = f.reason.value;
      state.product = f.product.value; state.email = f.email.value; state.phone = f.phone.value; state.message = f.message.value;
      var ok = true;
      var setErr = function (name, msg) {
        var box = form.querySelector('[data-err="' + name + '"]');
        var input = f[name];
        if (msg) { ok = false; input.classList.add('cErr'); if (box) box.innerHTML = errRow(msg); }
        else { input.classList.remove('cErr'); if (box) box.innerHTML = ''; }
      };
      setErr('name', !validName(state.name) ? 'Enter a valid name (letters only).' : '');
      setErr('email', !state.email.trim() ? 'Email is required so we can reply.' : (!validEmail(state.email) ? 'Enter a valid email address.' : ''));
      setErr('phone', !validPhone(state.phone, state.country) ? phoneErr(state.country) : '');
      if (ok) submit();
    });
  }

  wirePhoneCC(); // populate the classic form's country selector on load

  /* ---- copy-to-clipboard buttons ---- */
  root.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var txt = b.getAttribute('data-copy');
      var flash = function () { b.style.color = '#1a9d55'; b.innerHTML = '&#10003;'; setTimeout(function () { b.style.color = '#8a94a6'; b.innerHTML = '&#9112;'; }, 1500); };
      try { navigator.clipboard.writeText(txt).then(flash, flash); } catch (e) { flash(); }
    });
  });

  /* ---- reveal-on-scroll ---- */
  var scan = function () {
    root.querySelectorAll('[data-reveal]').forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && !el.classList.contains('cin')) { el.style.animationDelay = ((i % 4) * 0.08) + 's'; el.classList.add('cin'); }
    });
  };
  window.addEventListener('scroll', scan, { passive: true });
  setTimeout(scan, 60); var scanIv = setInterval(scan, 400);
  window.addEventListener('beforeunload', function () { clearInterval(scanIv); });

  /* ---- presence map: pins + zoom/pan + hover ---- */
  var pins = [
    { city: 'Karachi', tag: 'Headquarters', label: 'Suite #404, Imperial Trade Tower, DHA Phase 7 — our head office.', x: 67.3, y: 37.5, hit: 40 },
    { city: 'Islamabad', tag: 'Regional office', label: 'Our presence in the capital, serving northern operations.', x: 68.5, y: 33, hit: 30 },
    { city: 'Lahore', tag: 'Regional office', label: 'Supporting clients across Punjab and central Pakistan.', x: 68.8, y: 35.5, hit: 30 },
    { city: 'Dubai, UAE', tag: 'Regional presence', label: 'Our gateway to the Gulf market and regional clients.', x: 61.4, y: 45.9, hit: 38 },
    { city: 'Saudi Arabia', tag: 'Regional presence', label: 'Serving enterprises across the Kingdom.', x: 57.9, y: 50.5, hit: 42 },
    { city: 'UK, London', tag: 'International presence', label: 'Our foothold in the European market.', x: 43.5, y: 23.3, hit: 38 },
    { city: 'Australia', tag: 'Growing into', label: 'Expanding our reach into the Australian market.', x: 83, y: 81.3, hit: 38 }
  ];
  var stage = root.querySelector('[data-map-stage]');
  var vp = root.querySelector('[data-map-vp]');
  var card = root.querySelector('[data-pin-card]');
  var map = { zoom: 1, ox: 50, oy: 50 };
  function applyMap() { stage.style.transformOrigin = map.ox + '% ' + map.oy + '%'; stage.style.transform = 'scale(' + map.zoom + ')'; }
  function showCard(p) {
    card.style.display = '';
    card.innerHTML = '<div style="display:flex;align-items:center;gap:9px;"><span style="width:10px;height:10px;border-radius:50%;background:var(--blue);box-shadow:0 0 0 4px rgba(26,86,219,.18);"></span><span style="font-size:15px;font-weight:700;color:var(--ink);">' + p.city + '</span></div>'
      + '<div style="font-size:10px;font-weight:700;letter-spacing:1px;color:var(--blue);text-transform:uppercase;margin-top:8px;">' + p.tag + '</div>'
      + '<div style="font-size:12.5px;line-height:1.55;color:#5b6472;margin-top:6px;">' + p.label + '</div>';
  }
  if (stage) {
    pins.forEach(function (p) {
      var dot = document.createElement('div');
      dot.style.cssText = 'position:absolute;left:' + p.x + '%;top:' + p.y + '%;width:' + p.hit + 'px;height:' + p.hit + 'px;transform:translate(-50%,-50%);border-radius:50%;z-index:3;cursor:pointer;';
      dot.addEventListener('mouseenter', function () { showCard(p); });
      dot.addEventListener('mouseleave', function () { card.style.display = 'none'; });
      dot.addEventListener('click', function () { map.zoom = 2.4; map.ox = p.x; map.oy = p.y; applyMap(); showCard(p); });
      stage.appendChild(dot);
    });
    root.querySelector('[data-act="zoomIn"]').addEventListener('click', function () { map.zoom = Math.min(3.2, map.zoom + 0.4); applyMap(); });
    root.querySelector('[data-act="zoomOut"]').addEventListener('click', function () { map.zoom = Math.max(1, map.zoom - 0.4); if (map.zoom <= 1) { map.ox = 50; map.oy = 50; } applyMap(); });
    root.querySelector('[data-act="resetView"]').addEventListener('click', function () { map.zoom = 1; map.ox = 50; map.oy = 50; card.style.display = 'none'; applyMap(); });
    vp.addEventListener('wheel', function (e) {
      e.preventDefault();
      var r = vp.getBoundingClientRect();
      map.ox = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100));
      map.oy = Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100));
      map.zoom = Math.min(3.2, Math.max(1, map.zoom + (e.deltaY < 0 ? 0.25 : -0.25)));
      applyMap();
    }, { passive: false });
  }
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
