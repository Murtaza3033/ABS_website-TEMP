/* Align Assistant chat widget — ported verbatim in behavior from the static site's
   align-bot (shared.js). Full conversation engine: greeting, main menu, product menu,
   FAQ, lead capture (name/company/email/size), and human-handoff channels.

   Adapted for React: exposed as initSalesBot(rootEl) which builds the widget inside the
   given element and returns a teardown() to remove it (used by SalesBot.jsx's effect
   cleanup so React StrictMode / unmount doesn't duplicate the widget).
   Internal open/close + persistence (localStorage) are preserved from the original. */

export function initSalesBot(rootEl) {
  const BLUE = '#1a56db', SLATE = '#0f1729', TINT = '#f7faff';
  const LS = 'alignBot';
  function load() { try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch { return {}; } }
  function save(o) { try { localStorage.setItem(LS, JSON.stringify(o)); } catch { /* ignore */ } }
  const st = load(); st.data = st.data || {}; st.open = false;
  let awaiting = null, afterCapture = null;
  let tipTimer = null;
  let destroyed = false;
  function esc(s) { return (s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim()); }

  const root = document.createElement('div'); root.id = 'alignBotRoot'; root.style.cssText = 'font-family:Outfit,system-ui,sans-serif;';
  root.innerHTML = '' +
    '<button id="abLauncher" aria-label="Chat with Align Assistant" style="position:fixed;right:24px;bottom:88px;z-index:940;width:60px;height:60px;border-radius:50%;border:none;background:' + BLUE + ';color:#fff;cursor:pointer;box-shadow:0 16px 34px -10px rgba(26,86,219,.6);display:grid;place-items:center;animation:abFloat 5s ease-in-out infinite;">' +
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>' +
      '<span id="abDot" style="position:absolute;top:2px;right:2px;width:14px;height:14px;border-radius:50%;background:#d4a017;border:2px solid #fff;animation:abPulse 1.8s ease-in-out infinite;"></span>' +
    '</button>' +
    '<div id="abTip" style="position:fixed;right:96px;bottom:104px;z-index:939;background:#fff;color:' + SLATE + ';font-size:13px;font-weight:600;padding:10px 14px;border-radius:14px;box-shadow:0 16px 40px -18px rgba(15,23,41,.4);border:1px solid #eef1f6;display:none;max-width:200px;">Need help? Chat with us <span id="abTipX" style="color:#8a94a6;cursor:pointer;margin-left:6px;">&times;</span></div>' +
    '<div id="abPanel" style="position:fixed;right:24px;bottom:88px;z-index:930;width:352px;height:520px;max-height:calc(100vh - 190px);background:#fff;border-radius:22px;box-shadow:0 40px 90px -30px rgba(15,23,41,.5);border:1px solid #e9edf4;display:none;flex-direction:column;overflow:hidden;">' +
      '<div style="background:' + BLUE + ';color:#fff;padding:16px 18px;display:flex;align-items:center;gap:12px;">' +
        '<div style="width:38px;height:38px;border-radius:11px;background:rgba(255,255,255,.16);display:grid;place-items:center;font-weight:800;font-size:16px;">A</div>' +
        '<div style="flex:1;"><div style="font-size:15px;font-weight:700;line-height:1.1;">Align Assistant</div><div style="font-size:11.5px;color:#cfdcff;display:flex;align-items:center;gap:6px;margin-top:2px;"><span style="width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block;"></span>Online now</div></div>' +
        '<button id="abMin" aria-label="Close" style="width:30px;height:30px;border-radius:8px;border:none;background:rgba(255,255,255,.16);color:#fff;cursor:pointer;font-size:18px;line-height:1;">&times;</button>' +
      '</div>' +
      '<div id="abMsgs" style="flex:1;overflow-y:auto;padding:18px 16px;background:' + TINT + ';display:flex;flex-direction:column;gap:10px;"></div>' +
      '<div style="padding:10px 12px;border-top:1px solid #eef1f6;background:#fff;display:flex;gap:8px;align-items:center;">' +
        '<input id="abInput" type="text" placeholder="Type a message…" style="flex:1;font-family:Outfit,sans-serif;font-size:14px;border:1.5px solid #e3e9f3;border-radius:12px;padding:11px 13px;outline:none;color:' + SLATE + ';"/>' +
        '<button id="abSend" aria-label="Send" style="width:42px;height:42px;flex-shrink:0;border-radius:12px;border:none;background:' + BLUE + ';color:#fff;cursor:pointer;display:grid;place-items:center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg></button>' +
      '</div>' +
    '</div>';
  rootEl.appendChild(root);

  const panel = root.querySelector('#abPanel'), launcher = root.querySelector('#abLauncher'), msgWrap = root.querySelector('#abMsgs'),
    input = root.querySelector('#abInput'), tip = root.querySelector('#abTip'), dot = root.querySelector('#abDot');
  const d = st.data;

  function scrollDown() { msgWrap.scrollTop = msgWrap.scrollHeight; }
  function render(m) {
    const row = document.createElement('div'); row.style.cssText = 'animation:abSlideR .3s ease both;display:flex;flex-direction:column;gap:8px;';
    const bubble = document.createElement('div');
    if (m.who === 'user') { row.style.alignItems = 'flex-end'; bubble.style.cssText = 'max-width:80%;background:' + BLUE + ';color:#fff;padding:10px 14px;border-radius:16px 16px 4px 16px;font-size:13.5px;line-height:1.5;'; }
    else { row.style.alignItems = 'flex-start'; bubble.style.cssText = 'max-width:85%;background:#fff;color:' + SLATE + ';padding:11px 14px;border-radius:16px 16px 16px 4px;font-size:13.5px;line-height:1.55;box-shadow:0 8px 22px -16px rgba(15,23,41,.4);border:1px solid #eef1f6;'; }
    bubble.innerHTML = m.html; row.appendChild(bubble);
    if (m.opts) {
      const wrap = document.createElement('div'); wrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:7px;margin-top:2px;';
      m.opts.forEach((o) => {
        const b = document.createElement('button'); b.className = 'abBtn'; b.textContent = o.label;
        b.style.cssText = 'font-family:Outfit,sans-serif;font-size:12.5px;font-weight:600;color:' + BLUE + ';background:#fff;border:1.5px solid #dce7fb;border-radius:999px;padding:8px 14px;cursor:pointer;';
        b.onclick = () => { o.fn(); }; wrap.appendChild(b);
      });
      row.appendChild(wrap);
    }
    if (m.channels) { row.appendChild(buildChannels()); }
    msgWrap.appendChild(row); scrollDown();
  }
  function typing(cb) {
    const row = document.createElement('div'); row.style.cssText = 'display:flex;';
    const b = document.createElement('div'); b.style.cssText = 'background:#fff;border:1px solid #eef1f6;border-radius:16px;padding:12px 14px;display:flex;gap:4px;box-shadow:0 8px 22px -16px rgba(15,23,41,.4);';
    b.innerHTML = '<span style="width:7px;height:7px;border-radius:50%;background:#b8c4d8;animation:abBlink 1.2s infinite;"></span><span style="width:7px;height:7px;border-radius:50%;background:#b8c4d8;animation:abBlink 1.2s .2s infinite;"></span><span style="width:7px;height:7px;border-radius:50%;background:#b8c4d8;animation:abBlink 1.2s .4s infinite;"></span>';
    row.appendChild(b); msgWrap.appendChild(row); scrollDown();
    setTimeout(() => { row.remove(); if (!destroyed) cb(); }, 620);
  }
  function addBot(html, opts, extra) { const m = { who: 'bot', html, opts: opts || null }; if (extra) for (const k in extra) m[k] = extra[k]; render(m); }
  function botSay(html, opts, extra) { typing(() => { addBot(html, opts, extra); }); }
  function addUser(text) { render({ who: 'user', html: esc(text) }); }

  function mailto(addr, subj) { const body = 'Name: ' + (d.name || '') + '%0D%0ACompany: ' + (d.company || '') + '%0D%0AEmail: ' + (d.email || '') + (d.size ? ('%0D%0ACompany size: ' + d.size) : '') + (st.product ? ('%0D%0AInterested in: ' + st.product) : ''); return 'mailto:' + addr + '?subject=' + encodeURIComponent(subj) + '&body=' + body; }
  function buildChannels() {
    const wrap = document.createElement('div'); wrap.style.cssText = 'display:flex;flex-direction:column;gap:7px;margin-top:2px;';
    const items = [
      { t: '✉️  Email Sales', href: mailto('sales@alignbsystems.com', 'Demo / enquiry — Align') },
      { t: '🛟  Email Support', href: mailto('support@alignbsystems.com', 'Support request — Align') },
      { t: '📞  Call Sales · +92 317 3822206', href: 'tel:+923173822206' },
      { t: '📞  Call Support · +92 318 6944418', href: 'tel:+923186944418' },
      { t: '💬  Chat on WhatsApp', href: 'https://wa.me/0000000000', todo: true },
      { t: '💼  Careers · talent@alignbsystems.com', href: mailto('talent@alignbsystems.com', 'Application — Align') },
    ];
    items.forEach((it) => {
      const a = document.createElement('a'); a.href = it.href; a.className = 'abCh'; if (/^https?:/.test(it.href)) a.target = '_blank';
      a.style.cssText = 'display:flex;align-items:center;gap:8px;text-decoration:none;font-size:13px;font-weight:600;color:' + SLATE + ';background:#fff;border:1.5px solid #e3e9f3;border-radius:12px;padding:10px 13px;transition:background .18s,border-color .18s;';
      a.innerHTML = it.t + (it.todo ? ' <span style="color:#c47d17;font-size:10px;font-weight:700;">(TODO: set #)</span>' : ''); wrap.appendChild(a);
    });
    const soc = document.createElement('div'); soc.style.cssText = 'display:flex;gap:8px;margin-top:2px;';
    [['LinkedIn', 'https://www.linkedin.com/'], ['YouTube', 'https://www.youtube.com/'], ['Facebook', 'https://www.facebook.com/']].forEach((s) => {
      const a = document.createElement('a'); a.href = s[1]; a.target = '_blank'; a.textContent = s[0]; a.style.cssText = 'flex:1;text-align:center;text-decoration:none;font-size:11.5px;font-weight:600;color:' + BLUE + ';background:#eef4ff;border-radius:10px;padding:8px 6px;'; soc.appendChild(a);
    });
    wrap.appendChild(soc); return wrap;
  }
  function handoff() { botSay('Here\'s how you can reach a real person on our team — pick whatever\'s easiest:', null, { channels: true }); }

  const FAQ = [
    ['What does Align Business Systems do?', 'We build enterprise software — BusinessFlo (ERP), PeopleNest (HR &amp; workforce), and Field Force (field operations) — plus custom web, mobile, and SaaS development. We help businesses run their operations on one connected system.'],
    ['What products do you offer?', 'Three main products: BusinessFlo for ERP (finance, inventory, procurement, reporting), PeopleNest for HR and workforce management, and Field Force for field-team operations. Want details on any?'],
    ['How do I book a demo?', 'Just tap "Book a demo" and share a few details — our team will set it up. You can also email sales@alignbsystems.com.'],
    ['How much does it cost?', 'Pricing depends on your business size and needs. The best way is a quick chat with our team — shall I connect you?'],
    ['Which industries do you work with?', 'We serve businesses across food &amp; FMCG, pharma &amp; healthcare, lighting &amp; electrical, construction &amp; real estate, energy &amp; solar, and technology &amp; mobility.'],
    ['Where are you located?', 'Our HQ is in DHA Phase 7, Karachi (Imperial Trade Tower). We also serve clients across the region.'],
    ['Do you build custom software?', 'Yes — alongside our products, we build custom web, mobile, and SaaS solutions. Tell us what you need and we\'ll take it from there.'],
    ['How do I get support?', 'For existing customers, reach support@alignbsystems.com or +92 318 6944418. Want me to connect you?'],
    ['Do you have job openings?', 'We\'re often hiring! Send your CV to talent@alignbsystems.com with the role in the subject line, or visit our Careers page.'],
    ['What technology do you use?', 'Our stack includes React, ASP.NET, TypeScript, SQL Server, and Crystal Reports.'],
  ];
  function showFaqList() { botSay('Sure — tap a question:', FAQ.map((f) => ({ label: f[0], fn: () => { addUser(f[0]); botSay(f[1], [{ label: '👍 Yes, thanks', fn: () => { addUser('Yes, thanks'); botSay('Glad that helped! Anything else?', mainMenu()); } }, { label: '🙋 Talk to a human', fn: () => { addUser('Talk to a human'); handoff(); } }]); } }))); }

  function mainMenu() {
    return [
      { label: 'Book a demo', fn: () => { addUser('Book a demo'); startCapture('demo'); } },
      { label: 'Learn about products', fn: () => { addUser('Learn about products'); productMenu(); } },
      { label: 'Ask a question', fn: () => { addUser('Ask a question'); showFaqList(); } },
      { label: 'Partnership', fn: () => { addUser('Partnership'); startCapture('partner'); } },
      { label: 'Careers', fn: () => { addUser('Careers'); botSay('We\'d love to hear from you! Send your CV to <b>talent@alignbsystems.com</b> with the role in the subject line.', [{ label: 'Open Careers page', fn: () => { location.href = '/careers'; } }, { label: 'Back to menu', fn: () => { botSay('What else can I help with?', mainMenu()); } }]); } },
      { label: 'Talk to a human', fn: () => { addUser('Talk to a human'); handoff(); } },
    ];
  }
  function productMenu() {
    botSay('Which one would you like to hear about?', [
      { label: 'BusinessFlo', fn: () => { prod('BusinessFlo', 'Our ERP — finance, inventory, procurement and reporting in one connected flow.'); } },
      { label: 'PeopleNest', fn: () => { prod('PeopleNest', 'HR &amp; workforce — attendance, leave, payroll and people analytics in one place.'); } },
      { label: 'Field Force', fn: () => { prod('Field Force', 'Field operations — visits, routes and live KPIs for teams on the ground.'); } },
    ]);
  }
  function prod(name, desc) { addUser(name); st.product = name; save(st); botSay('<b>' + name + '</b> — ' + desc, [
    { label: 'Book a demo', fn: () => { addUser('Book a demo'); startCapture('demo'); } },
    { label: 'Ask a question', fn: () => { addUser('Ask a question'); showFaqList(); } },
    { label: 'Back to menu', fn: () => { botSay('What else can I help with?', mainMenu()); } },
  ]); }

  function startCapture(path) {
    afterCapture = path;
    if (!d.name) { awaiting = 'name'; botSay('Sure! First — what\'s your name?'); focus(); return; }
    if (!d.email) { awaiting = 'email'; botSay('Welcome back, ' + d.name + '! What\'s the best email to reach you?'); focus(); return; }
    finishCapture(path);
  }
  function focus() { setTimeout(() => { input.focus(); }, 650); }
  function handleText(v) {
    v = v.trim(); if (!v) return;
    if (awaiting) {
      if (awaiting === 'email' && !validEmail(v)) { addUser(v); botSay('Hmm, that doesn\'t look like a valid email — mind trying again?'); focus(); return; }
      addUser(v);
      if (awaiting === 'name') { d.name = v; save(st); awaiting = 'company'; botSay('Nice to meet you, ' + esc(v) + '. What company are you with? <span style="color:#8a94a6;">(optional)</span>', [{ label: 'Skip', fn: () => { addUser('Skip'); awaiting = 'email'; botSay('No problem. What\'s the best email to reach you?'); focus(); } }]); focus(); return; }
      if (awaiting === 'company') { d.company = v; save(st); awaiting = 'email'; botSay('Got it. And the best email to reach you?'); focus(); return; }
      if (awaiting === 'email') { d.email = v; save(st); awaiting = null; askSizeOrFinish(); return; }
    }
    addUser(v); botSay('I want to make sure you get the right answer — let me connect you with our team.', null, { channels: true });
  }
  function askSizeOrFinish() {
    if (afterCapture === 'demo') {
      botSay('Roughly how many people work at your company?', [
        { label: '1–25', fn: () => { setSize('1–25'); } }, { label: '25–50', fn: () => { setSize('25–50'); } }, { label: '50–100', fn: () => { setSize('50–100'); } }, { label: '100–500', fn: () => { setSize('100–500'); } }, { label: '500+', fn: () => { setSize('500+'); } },
      ]);
    } else { finishCapture(afterCapture); }
  }
  function setSize(s) { addUser(s); d.size = s; save(st); finishCapture('demo'); }
  function finishCapture(path) {
    const sum = '<div style="font-size:12px;color:#5b6472;background:' + TINT + ';border:1px solid #e3e9f3;border-radius:10px;padding:9px 11px;margin-top:2px;"><b>Captured:</b> ' + esc(d.name || '') + (d.company ? (' · ' + esc(d.company)) : '') + ' · ' + esc(d.email || '') + (d.size ? (' · ' + d.size) : '') + '<br><span style="color:#c47d17;">TODO: connect to CRM / endpoint</span></div>';
    if (path === 'partner') { botSay('Thanks, ' + esc(d.name) + '! Align partners with companies across the ecosystem. I\'ll connect you with the team.' + sum, null, { channels: true }); }
    else { botSay('Perfect, ' + esc(d.name) + '! Our team will set up a demo of ' + (st.product || 'the Align platform') + '. Here\'s how to reach us directly too:' + sum, null, { channels: true }); }
  }

  let greeted = false;
  function greet() { if (greeted) return; greeted = true; botSay('Hi! I\'m the Align Assistant 👋 How can I help you today?', mainMenu()); }

  function openBot() { panel.style.display = 'flex'; panel.style.animation = 'abEmerge .32s ease both'; launcher.style.display = 'none'; tip.style.display = 'none'; dot.style.display = 'none'; st.open = true; save(st); greet(); }
  function closeBot() { panel.style.display = 'none'; launcher.style.display = 'grid'; st.open = false; save(st); }
  launcher.onclick = openBot; root.querySelector('#abMin').onclick = closeBot;
  root.querySelector('#abTipX').onclick = (e) => { e.stopPropagation(); tip.style.display = 'none'; st.tipDismissed = true; save(st); };
  tip.onclick = openBot;
  function send() { const v = input.value; if (!v.trim()) return; input.value = ''; handleText(v); }
  root.querySelector('#abSend').onclick = send;
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } });

  if (!st.tipDismissed) { tipTimer = setTimeout(() => { if (!st.open && !destroyed) tip.style.display = 'block'; }, 4000); }

  // teardown for React effect cleanup (StrictMode double-invoke / unmount)
  return function teardown() {
    destroyed = true;
    clearTimeout(tipTimer);
    if (root && root.parentNode) root.parentNode.removeChild(root);
  };
}
