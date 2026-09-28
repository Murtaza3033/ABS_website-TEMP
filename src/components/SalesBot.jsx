import { useReducer, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { submitContact, validEmail, validName } from '../lib/contactApi';
import Turnstile from './Turnstile';

// Real number only — never a placeholder. Unset until VITE_WHATSAPP_NUMBER is
// configured, in which case the WhatsApp channel below appears automatically.
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '';

/* Align Assistant — a useReducer-driven chat state machine (replaces the
   imperative lib/salesBot.js engine). State holds the message history, captured
   lead fields, current menu/step and open/tip flags; lead data + product +
   tip-dismissed persist to localStorage via an effect. Rendered as real JSX. */

const BLUE = '#1a56db';
const SLATE = '#0f1729';
const TINT = '#f7faff';
const LS = 'alignBot';

const load = () => { try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch { return {}; } };

const persisted = load();
const initialState = {
  open: false,
  messages: [],
  data: persisted.data || {},
  product: persisted.product || null,
  awaiting: null,
  afterCapture: null,
  greeted: false,
  typing: false,
  tipVisible: false,
  tipDismissed: !!persisted.tipDismissed,
};

let mid = 0;
const nextId = () => { mid += 1; return mid; };

function reducer(s, a) {
  switch (a.type) {
    case 'OPEN': return { ...s, open: true, tipVisible: false };
    case 'CLOSE': return { ...s, open: false };
    case 'ADD': return { ...s, messages: [...s.messages, { id: nextId(), ...a.msg }] };
    case 'TYPING': return { ...s, typing: a.on };
    case 'MERGE_DATA': return { ...s, data: { ...s.data, ...a.data } };
    case 'PRODUCT': return { ...s, product: a.product };
    case 'AWAITING': return { ...s, awaiting: a.value };
    case 'AFTER': return { ...s, afterCapture: a.value };
    case 'GREETED': return { ...s, greeted: true };
    case 'TIP': return { ...s, tipVisible: a.on };
    case 'DISMISS_TIP': return { ...s, tipVisible: false, tipDismissed: true };
    default: return s;
  }
}

const FAQ = [
  ['What does Align Business Systems do?', 'We build enterprise software — Businessflo (ERP), PeopleNest (HR & workforce), and Field Force (field operations) — plus custom web, mobile, and SaaS development. We help businesses run their operations on one connected system.'],
  ['What products do you offer?', 'Three main products: Businessflo for ERP (finance, inventory, procurement, reporting), PeopleNest for HR and workforce management, and Field Force for field-team operations. Want details on any?'],
  ['How do I book a demo?', 'Just tap "Book a demo" and share a few details — our team will set it up. You can also email sales@alignbsystems.com.'],
  ['How much does it cost?', 'Pricing depends on your business size and needs. The best way is a quick chat with our team — shall I connect you?'],
  ['Which industries do you work with?', 'We serve businesses across food & FMCG, pharma & healthcare, lighting & electrical, construction & real estate, energy & solar, and technology & mobility.'],
  ['Where are you located?', 'Our HQ is in DHA Phase 7, Karachi (Imperial Trade Tower). We also serve clients across the region.'],
  ['Do you build custom software?', "Yes — alongside our products, we build custom web, mobile, and SaaS solutions. Tell us what you need and we'll take it from there."],
  ['How do I get support?', 'For existing customers, reach support@alignbsystems.com or +92 318 6944418. Want me to connect you?'],
  ['Do you have job openings?', "We're often hiring! Send your CV to talent@alignbsystems.com with the role in the subject line, or visit our Careers page."],
  ['What technology do you use?', 'Our stack includes React, ASP.NET, TypeScript, SQL Server, and Crystal Reports.'],
];

export default function SalesBot() {
  const { t } = useLanguage();
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;
  const inputRef = useRef(null);
  const msgsRef = useRef(null);
  const typingTimer = useRef(null);
  const greetedRef = useRef(false);
  const submittingRef = useRef(false);
  const turnstileRef = useRef(null);

  // persist lead data / product / tip-dismissed
  useEffect(() => {
    try {
      localStorage.setItem(LS, JSON.stringify({ data: state.data, product: state.product, tipDismissed: state.tipDismissed }));
    } catch { /* ignore */ }
  }, [state.data, state.product, state.tipDismissed]);

  // auto-scroll on new messages / typing
  useEffect(() => {
    const el = msgsRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.messages, state.typing]);

  // show the nudge tip after 4s (unless dismissed / already open)
  useEffect(() => {
    if (state.tipDismissed) return undefined;
    const id = setTimeout(() => {
      if (!stateRef.current.open && !stateRef.current.tipDismissed) dispatch({ type: 'TIP', on: true });
    }, 4000);
    return () => clearTimeout(id);
  }, [state.tipDismissed]);

  // Once shown, the nudge tip gets out of the way by itself: after 7s, or as
  // soon as the visitor scrolls, so it never sits on top of page content.
  // (Hidden for this page view only — not a permanent dismissal.)
  useEffect(() => {
    if (!state.tipVisible) return undefined;
    const hide = () => dispatch({ type: 'TIP', on: false });
    const id = setTimeout(hide, 7000);
    const y0 = window.scrollY;
    const onScroll = () => { if (Math.abs(window.scrollY - y0) > 80) hide(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(id); window.removeEventListener('scroll', onScroll); };
  }, [state.tipVisible]);

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  // ---- conversation helpers (stable via dispatch + refs) ----
  const addUser = (text) => dispatch({ type: 'ADD', msg: { who: 'user', content: text } });
  const botSay = (content, opts = null, extra = {}) => {
    dispatch({ type: 'TYPING', on: true });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      dispatch({ type: 'TYPING', on: false });
      dispatch({ type: 'ADD', msg: { who: 'bot', content, opts, ...extra } });
    }, 620);
  };
  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 650);
  // Shows a bot message immediately, bypassing the typing-delay timer used by
  // botSay() — needed for the "Sending your details…" status message, since
  // botSay() clears any pending timer when called again (which would silently
  // drop this message if the API responds before the 620ms typing delay).
  const botSayNow = (content, opts = null, extra = {}) => dispatch({ type: 'ADD', msg: { who: 'bot', content, opts, ...extra } });

  // Fills {name}-style placeholders after translating (t() is identity in English).
  const tf = (text, vars) => t(text).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

  const handoff = () => botSay(t("Here's how you can reach a real person on our team — pick whatever's easiest:"), null, { channels: true });

  const showFaq = () => botSay(t('Sure — tap a question:'), FAQ.map(([q, ans]) => ({
    label: t(q),
    onClick: () => {
      addUser(t(q));
      botSay(t(ans), [
        { label: `👍 ${t('Yes, thanks')}`, onClick: () => { addUser(t('Yes, thanks')); botSay(t('Glad that helped! Anything else?'), mainMenu()); } },
        { label: `🙋 ${t('Talk to a human')}`, onClick: () => { addUser(t('Talk to a human')); handoff(); } },
      ]);
    },
  })));

  const prod = (name, desc) => {
    addUser(name);
    dispatch({ type: 'PRODUCT', product: name });
    botSay(<><b>{name}</b> — {t(desc)}</>, [
      { label: t('Book a demo'), onClick: () => { addUser(t('Book a demo')); startCapture('demo'); } },
      { label: t('Ask a question'), onClick: () => { addUser(t('Ask a question')); showFaq(); } },
      { label: t('Back to menu'), onClick: () => botSay(t('What else can I help with?'), mainMenu()) },
    ]);
  };
  const productMenu = () => botSay(t('Which one would you like to hear about?'), [
    { label: 'Businessflo', onClick: () => prod('Businessflo', 'Our ERP — finance, inventory, procurement and reporting in one connected flow.') },
    { label: 'PeopleNest', onClick: () => prod('PeopleNest', 'HR & workforce — attendance, leave, payroll and people analytics in one place.') },
    { label: 'Field Force', onClick: () => prod('Field Force', 'Field operations — visits, routes and live KPIs for teams on the ground.') },
  ]);

  const mainMenu = () => [
    { label: t('Book a demo'), onClick: () => { addUser(t('Book a demo')); startCapture('demo'); } },
    { label: t('Learn about products'), onClick: () => { addUser(t('Learn about products')); productMenu(); } },
    { label: t('Ask a question'), onClick: () => { addUser(t('Ask a question')); showFaq(); } },
    { label: t('Partnership'), onClick: () => { addUser(t('Partnership')); startCapture('partner'); } },
    { label: t('Careers'), onClick: () => { addUser(t('Careers')); botSay(<>{t("We'd love to hear from you! Send your CV to")} <b>talent@alignbsystems.com</b> {t("with the role in the subject line.")}</>, [{ label: t('Open Careers page'), onClick: () => { window.location.href = '/careers'; } }, { label: t('Back to menu'), onClick: () => botSay(t('What else can I help with?'), mainMenu()) }]); } },
    { label: t('Talk to a human'), onClick: () => { addUser(t('Talk to a human')); handoff(); } },
  ];

  const finishCapture = async (path) => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    const d = stateRef.current.data;
    const product = stateRef.current.product;
    botSayNow(t('Sending your details…'));

    const result = await submitContact({
      name: d.name,
      company: d.company,
      email: d.email,
      companySize: d.size || undefined, // not in the contactSubmission schema yet — folded into `message` below too, so it's never lost
      reason: path === 'partner' ? 'Partnership' : 'Book a demo',
      product: product || 'Not sure yet',
      message: d.size ? `Company size: ${d.size} (captured via Align Assistant chat)` : '(captured via Align Assistant chat)',
      source: 'salesbot',
      pageUrl: window.location.href,
      honeypot: '', // SalesBot has no exposed form field for bots to fill — always empty
      turnstileToken: turnstileRef.current?.getToken() || '',
    });
    submittingRef.current = false;
    // Single-use token — reset now so the next capture flow gets a fresh one.
    turnstileRef.current?.reset();

    if (result.ok) {
      if (path === 'partner') {
        botSay(tf("Thanks, {name}! Align partners with companies across the ecosystem — I've passed your details to the team. Here's how to reach us directly too:", { name: d.name }), null, { channels: true });
      } else {
        botSay(tf("Perfect, {name}! Our team will set up a demo of {product} — I've sent your details over. Here's how to reach us directly too:", { name: d.name, product: product || t('the Align platform') }), null, { channels: true });
      }
    } else {
      botSay(t("Hmm, I couldn't send that through just now — but your details are saved, and here's how to reach our team directly:"), null, { channels: true });
    }
  };
  const setSize = (sz) => { addUser(sz); dispatch({ type: 'MERGE_DATA', data: { size: sz } }); setTimeout(() => finishCapture('demo'), 0); };
  const askSizeOrFinish = () => {
    if (stateRef.current.afterCapture === 'demo') {
      botSay(t('Roughly how many people work at your company?'), ['1–25', '25–50', '50–100', '100–500', '500+'].map((sz) => ({ label: sz, onClick: () => setSize(sz) })));
    } else finishCapture(stateRef.current.afterCapture);
  };

  const startCapture = (path) => {
    dispatch({ type: 'AFTER', value: path });
    const d = stateRef.current.data;
    if (!d.name) { dispatch({ type: 'AWAITING', value: 'name' }); botSay(t("Sure! First — what's your name?")); focusInput(); return; }
    if (!d.email) { dispatch({ type: 'AWAITING', value: 'email' }); botSay(tf("Welcome back, {name}! What's the best email to reach you?", { name: d.name })); focusInput(); return; }
    finishCapture(path);
  };

  const handleText = (raw) => {
    const v = (raw || '').trim();
    if (!v) return;
    const { awaiting } = stateRef.current;
    if (awaiting) {
      // Same rule the contact form and the server apply — otherwise the lead
      // is rejected at submit time and lost.
      if (awaiting === 'name' && !validName(v)) { addUser(v); botSay(t('Enter a valid name (letters only).')); focusInput(); return; }
      if (awaiting === 'email' && !validEmail(v)) { addUser(v); botSay(t("Hmm, that doesn't look like a valid email — mind trying again?")); focusInput(); return; }
      addUser(v);
      if (awaiting === 'name') { dispatch({ type: 'MERGE_DATA', data: { name: v } }); dispatch({ type: 'AWAITING', value: 'company' }); botSay(<>{tf('Nice to meet you, {name}. What company are you with?', { name: v })} <span style={{ color: '#657085' }}>{t("(optional)")}</span></>, [{ label: t('Skip'), onClick: () => { addUser(t('Skip')); dispatch({ type: 'AWAITING', value: 'email' }); botSay(t("No problem. What's the best email to reach you?")); focusInput(); } }]); focusInput(); return; }
      if (awaiting === 'company') { dispatch({ type: 'MERGE_DATA', data: { company: v } }); dispatch({ type: 'AWAITING', value: 'email' }); botSay(t('Got it. And the best email to reach you?')); focusInput(); return; }
      if (awaiting === 'email') { dispatch({ type: 'MERGE_DATA', data: { email: v } }); dispatch({ type: 'AWAITING', value: null }); setTimeout(askSizeOrFinish, 0); return; }
    }
    addUser(v);
    botSay(t('I want to make sure you get the right answer — let me connect you with our team.'), null, { channels: true });
  };

  const openBot = () => {
    dispatch({ type: 'OPEN' });
    if (!greetedRef.current) { greetedRef.current = true; dispatch({ type: 'GREETED' }); botSay(t("Hi! I'm the Align Assistant 👋 How can I help you today?"), mainMenu()); }
  };
  const send = () => {
    const v = inputRef.current?.value || '';
    if (!v.trim()) return;
    inputRef.current.value = '';
    handleText(v);
  };

  const mailto = (addr, subj) => {
    const d = stateRef.current.data;
    const body = `Name: ${d.name || ''}%0D%0ACompany: ${d.company || ''}%0D%0AEmail: ${d.email || ''}${d.size ? `%0D%0ACompany size: ${d.size}` : ''}${stateRef.current.product ? `%0D%0AInterested in: ${stateRef.current.product}` : ''}`;
    return `mailto:${addr}?subject=${encodeURIComponent(subj)}&body=${body}`;
  };

  return (
    <aside className="ab-root" aria-label={t('Align Assistant')} style={{ fontFamily: 'Outfit,system-ui,sans-serif' }}>
      {/* Mounted as soon as SalesBot mounts (every page) so a token is
          typically already ready by the time a capture flow completes —
          invisible (interaction-only), takes no layout space. */}
      <Turnstile ref={turnstileRef} action="salesbot" />
      {!state.open && (
        <button className="ab-launcher" aria-label={t('Chat with Align Assistant')} onClick={openBot}
          style={{ position: 'fixed', right: '24px', bottom: '88px', zIndex: 940, width: '60px', height: '60px', borderRadius: '50%', border: 'none', background: BLUE, color: '#fff', cursor: 'pointer', boxShadow: '0 16px 34px -10px rgba(26,86,219,.6)', display: 'grid', placeItems: 'center', animation: 'abFloat 5s ease-in-out infinite' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <span style={{ position: 'absolute', top: '2px', right: '2px', width: '14px', height: '14px', borderRadius: '50%', background: '#d4a017', border: '2px solid #fff', animation: 'abPulse 1.8s ease-in-out infinite' }} />
        </button>
      )}

      {state.tipVisible && !state.open && (
        <div className="ab-tip" onClick={openBot} style={{ position: 'fixed', right: '96px', bottom: '104px', zIndex: 939, background: '#fff', color: SLATE, fontSize: '13px', fontWeight: 600, padding: '10px 14px', borderRadius: '14px', boxShadow: '0 16px 40px -18px rgba(15,23,41,.4)', border: '1px solid #eef1f6', maxWidth: '200px', cursor: 'pointer' }}>
          {t("Need help? Chat with us")} <span style={{ color: '#657085', marginLeft: '6px' }} onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DISMISS_TIP' }); }}>×</span>
        </div>
      )}

      {state.open && (
        <div className="ab-panel" style={{ position: 'fixed', right: '24px', bottom: '88px', zIndex: 930, width: '352px', height: '520px', maxHeight: 'calc(100vh - 190px)', background: '#fff', borderRadius: '22px', boxShadow: '0 40px 90px -30px rgba(15,23,41,.5)', border: '1px solid #e9edf4', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'abEmerge .32s ease both' }}>
          <div style={{ background: BLUE, color: '#fff', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'rgba(255,255,255,.16)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '16px' }}>A</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.1 }}>{t('Align Assistant')}</div>
              <div style={{ fontSize: '11.5px', color: '#cfdcff', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />{t('Online now')}</div>
            </div>
            <button aria-label={t('Close')} onClick={() => dispatch({ type: 'CLOSE' })} style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,.16)', color: '#fff', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>

          <div ref={msgsRef} className="ab-msgs" style={{ flex: 1, overflowY: 'auto', padding: '18px 16px', background: TINT, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {state.messages.map((m) => (
              <div key={m.id} style={{ animation: 'abSlideR .3s ease both', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: m.who === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={m.who === 'user'
                  ? { maxWidth: '80%', background: BLUE, color: '#fff', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', fontSize: '13.5px', lineHeight: 1.5 }
                  : { maxWidth: '85%', background: '#fff', color: SLATE, padding: '11px 14px', borderRadius: '16px 16px 16px 4px', fontSize: '13.5px', lineHeight: 1.55, boxShadow: '0 8px 22px -16px rgba(15,23,41,.4)', border: '1px solid #eef1f6' }}>
                  {m.content}
                </div>
                {m.opts && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                    {m.opts.map((o, i) => (
                      <button key={i} onClick={o.onClick} style={{ fontFamily: 'Outfit,sans-serif', fontSize: '12.5px', fontWeight: 600, color: BLUE, background: '#fff', border: '1.5px solid #dce7fb', borderRadius: '999px', padding: '8px 14px', whiteSpace: 'nowrap', cursor: 'pointer' }}>{o.label}</button>
                    ))}
                  </div>
                )}
                {m.channels && <Channels mailto={mailto} />}
              </div>
            ))}
            {state.typing && (
              <div style={{ display: 'flex' }}>
                <div style={{ background: '#fff', border: '1px solid #eef1f6', borderRadius: '16px', padding: '12px 14px', display: 'flex', gap: '4px', boxShadow: '0 8px 22px -16px rgba(15,23,41,.4)' }}>
                  {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#b8c4d8', animation: `abBlink 1.2s ${d}s infinite` }} />)}
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: '10px 12px', borderTop: '1px solid #eef1f6', background: '#fff', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input ref={inputRef} type="text" maxLength={state.awaiting === 'name' ? 100 : state.awaiting === 'company' ? 150 : 200} aria-label={t('Type a message…')} placeholder={t('Type a message…')} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
              style={{ flex: 1, fontFamily: 'Outfit,sans-serif', fontSize: '14px', border: '1.5px solid #e3e9f3', borderRadius: '12px', padding: '11px 13px', outline: 'none', color: SLATE }} />
            <button aria-label={t('Send message')} onClick={send} style={{ width: '42px', height: '42px', flexShrink: 0, borderRadius: '12px', border: 'none', background: BLUE, color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

function Channels({ mailto }) {
  const { t } = useLanguage();
  const items = [
    [`✉️  ${t('Email Sales')}`, mailto('sales@alignbsystems.com', 'Demo / enquiry — Align')],
    [`🛟  ${t('Email Support')}`, mailto('support@alignbsystems.com', 'Support request — Align')],
    [`📞  ${t('Call Sales')} · +92 317 3822206`, 'tel:+923173822206'],
    [`📞  ${t('Call Support')} · +92 318 6944418`, 'tel:+923186944418'],
    // Only shown once a real number is configured (VITE_WHATSAPP_NUMBER) —
    // never a placeholder pretending to be a working link.
    ...(WHATSAPP_NUMBER ? [[`💬  ${t('Chat on WhatsApp')}`, `https://wa.me/${WHATSAPP_NUMBER}`]] : []),
    [`💼  ${t('Careers')} · talent@alignbsystems.com`, mailto('talent@alignbsystems.com', 'Application — Align')],
  ];
  const linkStyle = { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, color: SLATE, background: '#fff', border: '1.5px solid #e3e9f3', borderRadius: '12px', padding: '10px 13px' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: '2px' }}>
      {items.map(([label, href]) => (
        <a key={label} href={href} target={/^https?:/.test(href) ? '_blank' : undefined} rel="noopener noreferrer" style={linkStyle}>
          {label}
        </a>
      ))}
      <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
        {[['LinkedIn', 'https://www.linkedin.com/'], ['YouTube', 'https://www.youtube.com/'], ['Facebook', 'https://www.facebook.com/']].map(([name, href]) => (
          <a key={name} href={href} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', fontSize: '11.5px', fontWeight: 600, color: BLUE, background: '#eef4ff', borderRadius: '10px', padding: '8px 6px' }}>{name}</a>
        ))}
      </div>
    </div>
  );
}
