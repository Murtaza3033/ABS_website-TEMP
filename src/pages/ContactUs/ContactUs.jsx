import { useReducer, useState, useEffect, useRef } from 'react';
import Reveal from '../../components/Reveal';
import { useLanguage } from '../../context/LanguageContext';
import PhoneField from './PhoneField';
import PresenceMap from './PresenceMap';
import Turnstile from '../../components/Turnstile';
import {
  cc, validPhone, phoneErr,
  REASON_OPTS, PRODUCT_OPTS, Q_TITLES, chatSteps,
} from './contactData';
import { submitContact, validEmail, validName, CONTACT_LIMITS } from '../../lib/contactApi';
import SEO, { resolveSeo } from '../../components/SEO';
import { usePage } from '../../hooks/useCms';

const initialState = {
  view: 'choice', // choice | chat | classic | done
  step: 0,
  name: '', company: '', reason: 'Book a demo', product: 'Not sure yet',
  email: '', phone: '', country: 'PK', message: '',
  honeypot: '', // hidden field — a real visitor never fills this in
  touched: {},
  submitting: false,
  submitError: null,
};

function reducer(s, a) {
  switch (a.type) {
    case 'PICK': return a.mode === 'chat' ? { ...s, view: 'chat', step: 0 } : { ...s, view: 'classic' };
    case 'TO_CLASSIC': return { ...s, view: 'classic' };
    case 'TO_CHAT': return { ...s, view: 'chat', step: 0 };
    case 'RESET': return initialState;
    case 'FIELD': return { ...s, [a.field]: a.value };
    case 'COUNTRY': return { ...s, country: a.value };
    case 'OPT': return { ...s, [a.field]: a.value, step: s.step + 1 };
    case 'TOUCH': return { ...s, touched: { ...s.touched, ...Object.fromEntries(a.fields.map((f) => [f, true])) } };
    case 'STEP_NEXT': return { ...s, step: s.step + 1 };
    case 'STEP_BACK': return { ...s, step: Math.max(0, s.step - 1) };
    case 'SUBMIT_START': return { ...s, submitting: true, submitError: null };
    case 'SUBMIT_SUCCESS': return { ...s, submitting: false, submitError: null, view: 'done' };
    case 'SUBMIT_ERROR': return { ...s, submitting: false, submitError: a.error };
    default: return s;
  }
}

/* ---- copy-to-clipboard button (local state, no DOM mutation) ---- */
function CopyButton({ text }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return undefined;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);
  const copy = () => {
    try { navigator.clipboard.writeText(text).then(() => setCopied(true), () => setCopied(true)); }
    catch { setCopied(true); }
  };
  return (
    <button className="cCopy" onClick={copy} aria-label={t('Copy email')} title={t('Copy')}
      style={{ display: 'inline-grid', placeItems: 'center', width: '24px', height: '24px', borderRadius: '7px', border: '1px solid #e3e9f3', background: '#fff', color: copied ? '#157d44' : '#657085', cursor: 'pointer' }}>
      {copied ? '✓' : '⎘'}
    </button>
  );
}

// Same limits the API enforces (lib/contactRules.js) — applied as input
// maxLength so the server never has to reject an over-long field.
const MAX = {
  name: CONTACT_LIMITS.name.max,
  company: CONTACT_LIMITS.company.max,
  email: CONTACT_LIMITS.email.max,
  message: CONTACT_LIMITS.message.max,
};

const infoLink = { display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '13.5px', color: '#4b5565', textDecoration: 'none' };
const ldot = { width: '5px', height: '5px', borderRadius: '50%', background: '#c9d8f5', transition: 'background .2s' };

function ContactCard({ icon, title, email, phones }) {
  const { t } = useLanguage();
  return (
    <Reveal className="cCard" style={{ position: 'relative', overflow: 'hidden', background: '#fff', border: '1px solid #eaeef5', borderRadius: '18px', padding: '24px', boxShadow: '0 16px 42px -30px rgba(15,23,41,.24)' }}>
      <div style={{ position: 'absolute', top: '-46px', right: '-46px', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,219,.12),transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eef4ff', color: 'var(--blue)', display: 'grid', placeItems: 'center' }}>{icon}</div>
      <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '16px' }}>{t(title)}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: '12px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
          <a className="cInfoLink" href={`mailto:${email}`} style={infoLink}><span className="cInfoLdot" style={ldot} />{email}</a>
          <CopyButton text={email} />
        </span>
        {phones.map((p) => (
          <a key={p.tel} className="cInfoLink" href={`tel:${p.tel}`} style={{ ...infoLink, width: 'fit-content' }}>
            <span className="cInfoLdot" style={ldot} /><bdi dir="ltr">{p.display}</bdi>
          </a>
        ))}
      </div>
    </Reveal>
  );
}

function SubmitErrorBanner({ message, onRetry, mailtoHref, t }) {
  if (!message) return null;
  return (
    <div style={{ marginTop: '16px', padding: '12px 16px', background: '#fdf2f2', border: '1px solid #f5c6c6', borderRadius: '12px', fontSize: '13.5px', color: '#9b2c2c' }}>
      <div>⚠ {t(message)}</div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
        <button type="button" onClick={onRetry} style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontSize: '13px', fontWeight: 700, color: '#9b2c2c', textDecoration: 'underline' }}>{t('Try again')}</button>
        <a href={mailtoHref} style={{ fontSize: '13px', fontWeight: 700, color: '#9b2c2c', textDecoration: 'underline' }}>{t('Email us directly')}</a>
      </div>
    </div>
  );
}

const ICONS = {
  mail: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg>,
  support: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2" /><path d="M21 14v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 1z" /><path d="M3 14v3a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 1z" /></svg>,
  careers: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>,
};

export default function ContactUs() {
  const { t, lang } = useLanguage();
  const { data: cmsPage } = usePage('contact-us');
  const seo = resolveSeo(cmsPage?.seo, lang);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [classicErr, setClassicErr] = useState({});
  const turnstileRef = useRef(null);

  const setField = (field, value) => {
    dispatch({ type: 'FIELD', field, value });
    if (field === 'company' || field === 'message') setClassicErr((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  /* Kept only as the manual fallback link shown when the API call fails —
     no longer the primary submission path (Phase 10C). */
  const buildMailtoHref = () => {
    const s = state;
    const subject = `Website enquiry — ${s.name || ''}`;
    const body = `Name: ${s.name}\nCompany: ${s.company}\nReason: ${s.reason}\nProduct: ${s.product}\nEmail: ${s.email}\nPhone: ${s.phone ? `${cc(s.country).dial} ${s.phone}` : ''}\n\n${s.message}`;
    return `mailto:sales@alignbsystems.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const doSubmit = async () => {
    if (state.submitting) return;
    dispatch({ type: 'SUBMIT_START' });

    const payload = {
      name: state.name,
      company: state.company,
      reason: state.reason,
      product: state.product,
      email: state.email,
      phone: state.phone,
      countryIso: state.country,
      message: state.message,
      honeypot: state.honeypot,
      source: 'contact-form',
      pageUrl: window.location.href,
      turnstileToken: turnstileRef.current?.getToken() || '',
    };

    const result = await submitContact(payload);
    // Tokens are single-use — reset now so a retry (or the next visit to
    // this form) gets a fresh one instead of being rejected as a duplicate.
    turnstileRef.current?.reset();
    if (result.ok) dispatch({ type: 'SUBMIT_SUCCESS' });
    else {
      dispatch({ type: 'SUBMIT_ERROR', error: result.error });
      // Server-side validation_failed: mark the offending fields it named.
      const f = result.fields || {};
      const serverErrs = {};
      if (f.name) serverErrs.name = state.name.trim().length > MAX.name ? 'Name must be 100 characters or fewer.' : 'Enter a valid name (letters only).';
      if (f.email) serverErrs.email = state.email.trim().length > MAX.email ? 'Email must be 200 characters or fewer.' : 'Enter a valid email address.';
      if (f.phone) serverErrs.phone = phoneErr(state.country, t);
      if (f.company) serverErrs.company = 'Company must be 150 characters or fewer.';
      if (f.message) serverErrs.message = 'Message must be 2000 characters or fewer.';
      if (Object.keys(serverErrs).length) {
        setClassicErr((prev) => ({ ...prev, ...serverErrs }));
        dispatch({ type: 'TOUCH', fields: Object.keys(serverErrs) });
      }
    }
  };

  /* ---- guided chat ---- */
  const st = chatSteps(state.reason);
  const key = st[state.step] || 'message';
  const advance = () => {
    if (state.submitting) return;
    if (key === 'name' && !validName(state.name)) { dispatch({ type: 'TOUCH', fields: ['name'] }); return; }
    if (key === 'contact' && (!validEmail(state.email) || !validPhone(state.phone, state.country))) {
      dispatch({ type: 'TOUCH', fields: ['email', 'phone'] }); return;
    }
    if (state.step >= st.length - 1) doSubmit();
    else dispatch({ type: 'STEP_NEXT' });
  };
  const onEnter = (e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); advance(); } };

  /* ---- classic submit ---- */
  const submitClassic = (e) => {
    e.preventDefault();
    if (state.submitting) return;
    const errs = {};
    if (!validName(state.name)) errs.name = 'Enter a valid name (letters only).';
    if (!state.email.trim()) errs.email = 'Email is required so we can reply.';
    else if (!validEmail(state.email)) errs.email = 'Enter a valid email address.';
    if (!validPhone(state.phone, state.country)) errs.phone = phoneErr(state.country, t);
    setClassicErr(errs);
    if (Object.keys(errs).length === 0) doSubmit();
  };

  const nameBad = key === 'name' && state.touched.name && !validName(state.name);
  const emailBad = state.touched.email && (!state.email.trim() || !validEmail(state.email));
  const phoneBad = state.touched.phone && !validPhone(state.phone, state.country);

  return (
    <main style={{ fontFamily: 'var(--font-sans)', color: 'var(--ink)', background: '#fff' }}>
      <SEO
        {...seo}
        title={seo.title || t('Contact Us')}
        description={seo.description || t("Tell us what you're working with today and we'll show you what Align can do for your operations — however you prefer to reach us.")}
      />
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', padding: '90px 32px 30px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/images/about/meeting.webp')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.07, pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(180deg,#000 0%,transparent 88%)', maskImage: 'linear-gradient(180deg,#000 0%,transparent 88%)' }} />
        <div className="cReveal cin" style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
          <span className="hero-eyebrow">{t("Contact Us")}</span>
          <h1 style={{ fontSize: 'clamp(38px,6vw,56px)', lineHeight: 1.05, letterSpacing: '-1.6px', fontWeight: 800, margin: '14px 0 0', color: 'var(--ink)' }}>{t("Let's")} <span style={{ fontFamily: 'var(--font-hand)', fontWeight: 700, color: 'var(--blue)', fontSize: '1.18em' }}>{t("start the conversation.")}</span></h1>
          <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#4b5565', margin: '20px auto 0', maxWidth: '540px' }}>{t("Tell us what you're working with today and we'll show you what Align can do for your operations — however you prefer to reach us.")}</p>
        </div>
      </section>

      {/* MODE + FORM */}
      <section style={{ background: '#fff', padding: '20px 32px 90px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', background: '#fff', border: '1px solid #eaeef5', borderRadius: '24px', boxShadow: '0 30px 70px -40px rgba(15,23,41,.3)', padding: '34px', minHeight: '420px', position: 'relative' }}>

          {/* CHOICE */}
          {state.view === 'choice' && (
            <div style={{ textAlign: 'center', animation: 'cEmerge .5s ease both' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-.6px', margin: '6px 0 0' }}>{t("How would you like to reach us?")}</h2>
              <p style={{ fontSize: '14.5px', color: 'var(--faint)', margin: '8px 0 0' }}>{t("Pick whichever feels easier — same result either way.")}</p>
              <div className="cGrid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '28px', textAlign: 'left' }}>
                <button className="cCard cChoice" onClick={() => dispatch({ type: 'PICK', mode: 'chat' })} style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', background: 'var(--tint)', border: '1.5px solid #eaeef5', borderRadius: '18px', padding: '24px', textAlign: 'left' }}>
                  <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '130px', height: '130px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,219,.14),transparent 70%)', pointerEvents: 'none' }} />
                  <div className="cChoiceIco" style={{ width: '46px', height: '46px', borderRadius: '13px', background: 'var(--blue)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 12px 24px -10px rgba(26,86,219,.6)' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginTop: '14px' }}>{t("Quick chat")}</div>
                  <div style={{ fontSize: '13px', color: '#5b6472', marginTop: '4px' }}>{t("One question at a time. Takes a minute.")}</div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '14px', fontSize: '13px', fontWeight: 700, color: 'var(--blue)' }}>{t("Start chat")} <span className="cArrow" style={{ display: 'inline-block' }}>→</span></span>
                </button>
                <button className="cCard cChoice" onClick={() => dispatch({ type: 'PICK', mode: 'classic' })} style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', background: 'var(--tint)', border: '1.5px solid #eaeef5', borderRadius: '18px', padding: '24px', textAlign: 'left' }}>
                  <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '130px', height: '130px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,219,.1),transparent 70%)', pointerEvents: 'none' }} />
                  <div className="cChoiceIco" style={{ width: '46px', height: '46px', borderRadius: '13px', background: '#e8effc', color: 'var(--blue)', display: 'grid', placeItems: 'center' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6" /><path d="M9 17h4" /></svg></div>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginTop: '14px' }}>{t("Classic form")}</div>
                  <div style={{ fontSize: '13px', color: '#5b6472', marginTop: '4px' }}>{t("All the fields at once. Fill and send.")}</div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '14px', fontSize: '13px', fontWeight: 700, color: 'var(--blue)' }}>{t("Open form")} <span className="cArrow" style={{ display: 'inline-block' }}>→</span></span>
                </button>
              </div>
            </div>
          )}

          {/* CHAT */}
          {state.view === 'chat' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <button onClick={() => dispatch({ type: 'TO_CLASSIC' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--faint)' }}>{t("← Switch to classic")}</button>
                <div style={{ flex: 1, height: '6px', background: '#eef2f8', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${Math.round((state.step / st.length) * 100)}%`, background: 'linear-gradient(90deg,var(--blue),#4b8bff)', transition: 'width .4s ease' }} /></div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--faint)', whiteSpace: 'nowrap' }}>{state.step + 1} / {st.length}</span>
              </div>

              <div style={{ minHeight: '230px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '24px' }}>
                <div key={state.step} style={{ animation: 'cSlideR .45s cubic-bezier(.2,.7,.3,1) both' }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-.5px', color: 'var(--ink)' }}>{t(Q_TITLES[key])}</div>

                  {(key === 'name' || key === 'company') && (
                    <>
                      <input autoFocus value={key === 'name' ? state.name : state.company} maxLength={key === 'name' ? MAX.name : MAX.company}
                        onChange={(e) => setField(key, e.target.value)} onKeyDown={onEnter}
                        className={`cInput${nameBad ? ' cErr' : ''}`}
                        placeholder={key === 'name' ? t('Your name') : t('Company (optional)')} style={{ marginTop: '18px' }} />
                      {nameBad && <div className="cErrMsg">{t("⚠ Enter a valid name (letters only).")}</div>}
                    </>
                  )}

                  {key === 'reason' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                      {REASON_OPTS.map((o) => <button key={o} className="cOpt" onClick={() => dispatch({ type: 'OPT', field: 'reason', value: o })}>{t(o)}</button>)}
                    </div>
                  )}

                  {key === 'product' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                      {PRODUCT_OPTS.map((o) => <button key={o} className="cOpt" onClick={() => dispatch({ type: 'OPT', field: 'product', value: o })}>{t(o)}</button>)}
                    </div>
                  )}

                  {key === 'contact' && (
                    <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <input value={state.email} maxLength={MAX.email} onChange={(e) => setField('email', e.target.value)} onKeyDown={onEnter}
                          type="email" className={`cInput${emailBad ? ' cErr' : ''}`} placeholder={t('you@company.com (required)')} autoFocus />
                        {emailBad && <div className="cErrMsg">⚠ {!state.email.trim() ? t('Email is required so we can reply.') : t('Enter a valid email address.')}</div>}
                      </div>
                      <PhoneField country={state.country} phone={state.phone}
                        onCountry={(v) => dispatch({ type: 'COUNTRY', value: v })} onPhone={(v) => setField('phone', v)}
                        error={phoneBad ? phoneErr(state.country, t) : ''} />
                    </div>
                  )}

                  {key === 'message' && (
                    <>
                      <textarea value={state.message} maxLength={MAX.message} onChange={(e) => setField('message', e.target.value)}
                        className={`cInput${classicErr.message ? ' cErr' : ''}`} aria-invalid={classicErr.message ? true : undefined} placeholder={t('Optional — a line or two of context')} rows={4} style={{ marginTop: '18px', resize: 'vertical' }} />
                      {classicErr.message && <div className="cErrMsg">⚠ {t(classicErr.message)}</div>}
                    </>
                  )}
                </div>
              </div>

              <Turnstile ref={turnstileRef} action="contact_form" />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '18px' }}>
                <button onClick={() => dispatch({ type: 'STEP_BACK' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: state.step === 0 ? '#d5deed' : '#657085' }}>{t("← Back")}</button>
                {key !== 'reason' && key !== 'product' && (
                  <button onClick={advance} disabled={state.submitting} style={{ cursor: state.submitting ? 'default' : 'pointer', opacity: state.submitting ? 0.7 : 1, background: 'var(--blue)', color: '#fff', fontSize: '14.5px', fontWeight: 600, padding: '12px 26px', border: 'none', borderRadius: '12px' }}>{state.submitting ? t('Sending…') : (state.step >= st.length - 1 ? t('Send') : t('Continue'))}</button>
                )}
              </div>
              <div style={{ textAlign: 'right', fontSize: '11.5px', color: '#657085', marginTop: '8px' }}>{t("Press Enter to continue")}</div>
              <SubmitErrorBanner message={state.submitError} onRetry={doSubmit} mailtoHref={buildMailtoHref()} t={t} />
            </div>
          )}

          {/* CLASSIC */}
          {state.view === 'classic' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>{t("Send us a message")}</h2>
                <button onClick={() => dispatch({ type: 'TO_CHAT' })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--faint)' }}>{t("Prefer a quick chat? →")}</button>
              </div>
              <form onSubmit={submitClassic} noValidate>
                {/* Honeypot — hidden from real visitors (off-screen, unreachable by tab,
                    ignored by screen readers); any bot that autofills every field it can
                    find will fill this one, and the API rejects the submission silently. */}
                <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                  <label htmlFor="cf-company-site">{t("Company website")}</label>
                  <input id="cf-company-site" type="text" tabIndex={-1} autoComplete="off"
                    value={state.honeypot} onChange={(e) => setField('honeypot', e.target.value)} />
                </div>
                <div className="cGrid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '22px' }}>
                  <div>
                    <label htmlFor="cf-name" style={{ fontSize: '12px', fontWeight: 600, color: '#5b6472' }}>{t("Name")}</label>
                    <input id="cf-name" maxLength={MAX.name} value={state.name} onChange={(e) => setField('name', e.target.value)} className={`cInput${classicErr.name ? ' cErr' : ''}`} placeholder={t('Your name')} style={{ marginTop: '6px' }} />
                    {classicErr.name && <div className="cErrMsg">⚠ {t(classicErr.name)}</div>}
                  </div>
                  <div>
                    <label htmlFor="cf-company" style={{ fontSize: '12px', fontWeight: 600, color: '#5b6472' }}>{t("Company")} <span style={{ color: '#657085' }}>{t("(optional)")}</span></label>
                    <input id="cf-company" maxLength={MAX.company} value={state.company} onChange={(e) => setField('company', e.target.value)} className={`cInput${classicErr.company ? ' cErr' : ''}`} placeholder={t('Company')} style={{ marginTop: '6px' }} />
                    {classicErr.company && <div className="cErrMsg">⚠ {t(classicErr.company)}</div>}
                  </div>
                  <div>
                    <label htmlFor="cf-reason" style={{ fontSize: '12px', fontWeight: 600, color: '#5b6472' }}>{t("Reason for contact")}</label>
                    <select id="cf-reason" value={state.reason} onChange={(e) => setField('reason', e.target.value)} className="cInput" style={{ marginTop: '6px' }}>
                      {REASON_OPTS.map((o) => <option key={o} value={o}>{t(o)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cf-product" style={{ fontSize: '12px', fontWeight: 600, color: '#5b6472' }}>{t("Product interest")} <span style={{ color: '#657085' }}>{t("(optional)")}</span></label>
                    <select id="cf-product" value={state.product} onChange={(e) => setField('product', e.target.value)} className="cInput" style={{ marginTop: '6px' }}>
                      {PRODUCT_OPTS.map((o) => <option key={o} value={o}>{t(o)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cf-email" style={{ fontSize: '12px', fontWeight: 600, color: '#5b6472' }}>{t("Email")}</label>
                    <input id="cf-email" maxLength={MAX.email} value={state.email} onChange={(e) => setField('email', e.target.value)} type="email" className={`cInput${classicErr.email ? ' cErr' : ''}`} placeholder="you@company.com" style={{ marginTop: '6px' }} />
                    {classicErr.email && <div className="cErrMsg">⚠ {t(classicErr.email)}</div>}
                  </div>
                  <div>
                    <label htmlFor="cf-phone" style={{ fontSize: '12px', fontWeight: 600, color: '#5b6472' }}>{t("Phone")} <span style={{ color: '#657085' }}>{t("(optional)")}</span></label>
                    <div style={{ marginTop: '6px' }}>
                      <PhoneField id="cf-phone" country={state.country} phone={state.phone}
                        onCountry={(v) => dispatch({ type: 'COUNTRY', value: v })} onPhone={(v) => setField('phone', v)}
                        error={classicErr.phone || ''} />
                    </div>
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label htmlFor="cf-message" style={{ fontSize: '12px', fontWeight: 600, color: '#5b6472' }}>{t("Message")} <span style={{ color: '#657085' }}>{t("(optional)")}</span></label>
                    <textarea id="cf-message" maxLength={MAX.message} value={state.message} onChange={(e) => setField('message', e.target.value)} className={`cInput${classicErr.message ? ' cErr' : ''}`} aria-invalid={classicErr.message ? true : undefined} rows={4} placeholder={t('How can we help?')} style={{ marginTop: '6px', resize: 'vertical' }} />
                    {classicErr.message && <div className="cErrMsg">⚠ {t(classicErr.message)}</div>}
                  </div>
                </div>
                <Turnstile ref={turnstileRef} action="contact_form" />
                <button type="submit" disabled={state.submitting} style={{ cursor: state.submitting ? 'default' : 'pointer', opacity: state.submitting ? 0.7 : 1, width: '100%', marginTop: '20px', background: 'var(--blue)', color: '#fff', fontSize: '15px', fontWeight: 700, padding: '15px', border: 'none', borderRadius: '14px' }}>{state.submitting ? t('Sending…') : t('Send message →')}</button>
                <SubmitErrorBanner message={state.submitError} onRetry={doSubmit} mailtoHref={buildMailtoHref()} t={t} />
              </form>
            </div>
          )}

          {/* DONE */}
          {state.view === 'done' && (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{ width: '76px', height: '76px', margin: '0 auto', borderRadius: '50%', background: '#e6f5ec', display: 'grid', placeItems: 'center', animation: 'cTick .5s cubic-bezier(.5,1.6,.4,1) both' }}><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#1a9d55" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg></div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-.6px', margin: '22px 0 0' }}>{state.name ? t('Thanks, {name} — message sent.').replace('{name}', state.name.split(' ')[0]) : t('Thanks — message sent.')}</h2>
              <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#4b5565', margin: '12px auto 0', maxWidth: '420px' }}>{t("Our team will be in touch shortly. We typically reply within one business day.")}</p>
              <button onClick={() => dispatch({ type: 'RESET' })} style={{ cursor: 'pointer', marginTop: '24px', background: '#eef4ff', color: 'var(--blue)', fontSize: '14.5px', fontWeight: 600, padding: '12px 24px', border: 'none', borderRadius: '12px' }}>{t("Send another message")}</button>
            </div>
          )}
        </div>
      </section>

      {/* PRESENCE MAP */}
      <section id="our-presence" style={{ background: 'linear-gradient(180deg,var(--tint),#fff)', padding: '90px 32px', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <span className="hero-eyebrow">{t("Our Presence")}</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.1, letterSpacing: '-1px', fontWeight: 800, margin: '14px 0 0' }}>{t("The markets we serve — and grow into.")}</h2>
            <p style={{ fontSize: '15.5px', lineHeight: 1.65, color: '#4b5565', margin: '14px 0 0' }}>{t("Headquartered in Karachi, with a growing regional presence across the Gulf and beyond.")}</p>
          </Reveal>
          <PresenceMap />
        </div>
      </section>

      {/* DIRECT CONTACT */}
      <section style={{ background: '#fff', padding: '80px 32px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="cContactGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '18px' }}>
            <ContactCard icon={ICONS.mail} title="Sales" email="sales@alignbsystems.com" phones={[{ tel: '+923173822206', display: '+92 317 3822206' }, { tel: '+923173822207', display: '+92 317 3822207' }]} />
            <ContactCard icon={ICONS.support} title="Support" email="support@alignbsystems.com" phones={[{ tel: '+923186944418', display: '+92 318 6944418' }]} />
            <ContactCard icon={ICONS.careers} title="Careers" email="talent@alignbsystems.com" phones={[]} />

            {/* Head office (dark) */}
            <Reveal className="cCard cInfoDark" style={{ position: 'relative', overflow: 'hidden', background: 'var(--ink)', color: '#eaf0fb', border: '1px solid var(--ink)', borderRadius: '18px', padding: '24px' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.5, background: 'radial-gradient(circle at 85% 0%,rgba(26,86,219,.4),transparent 55%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(75,139,255,.18)', color: '#7aa7ff', display: 'grid', placeItems: 'center' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg></div>
              <div style={{ position: 'relative', fontSize: '16px', fontWeight: 700, marginTop: '16px', color: '#fff' }}>{t("Head Office")}</div>
              <div style={{ position: 'relative', fontSize: '13px', lineHeight: 1.6, color: '#96a2ba', marginTop: '10px' }}>Suite #404, Imperial Trade Tower 68-C, 7th Street Jami Commercial, Main Street 11, D.H.A. Phase 7, Karachi, 75500</div>
              <a href="#our-presence" className="cInfoGo" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '14px', fontSize: '13px', fontWeight: 700, color: '#7aa7ff', textDecoration: 'none' }}>{t("View on map")} <span className="cArrow" style={{ display: 'inline-block' }}>→</span></a>
            </Reveal>
          </div>

          {/* REASSURANCE */}
          <Reveal style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginTop: '36px', padding: '22px 26px', background: 'var(--tint)', border: '1px solid var(--line)', borderRadius: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e6f5ec', color: '#157d44', display: 'grid', placeItems: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg></span>
              <span style={{ fontSize: '14.5px', color: '#39404d' }}>{t("We typically reply within")} <b>{t("one business day")}</b>. <span style={{ color: '#657085', fontSize: '12px' }}>{t("(response time — pending confirmation)")}</span></span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { href: 'https://www.linkedin.com/company/align-business-systems', label: 'LinkedIn', path: <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.06 3.77-2.06 4 0 4.75 2.65 4.75 6.1V21H20v-5.4c0-1.3 0-2.95-1.8-2.95s-2.08 1.4-2.08 2.85V21H9z" /> },
                { href: 'https://facebook.com', label: 'Facebook', path: <path d="M14 9h3V5h-3c-2.2 0-4 1.8-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1z" /> },
                { href: 'https://youtube.com', label: 'YouTube', path: <><path d="M23 12s0-3.4-.4-5a2.8 2.8 0 0 0-2-2C18.8 4.5 12 4.5 12 4.5s-6.8 0-8.6.5a2.8 2.8 0 0 0-2 2C1 8.6 1 12 1 12s0 3.4.4 5a2.8 2.8 0 0 0 2 2c1.8.5 8.6.5 8.6.5s6.8 0 8.6-.5a2.8 2.8 0 0 0 2-2c.4-1.6.4-5 .4-5z" /><path d="M10 15.5 15 12l-5-3.5z" fill="#fff" /></> },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', border: '1px solid #e3e9f3', color: 'var(--blue)', display: 'grid', placeItems: 'center' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">{s.path}</svg>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
