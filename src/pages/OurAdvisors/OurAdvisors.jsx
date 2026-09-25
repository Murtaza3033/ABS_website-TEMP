import { Fragment, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/our-advisors.css';
import BaseReveal from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import { Icon, AREAS, PILLARS } from './advisorsData';
import AreaCard from './AreaCard';
import Timeline from './Timeline';
import SEO, { resolveSeo } from '../../components/SEO';
import { usePage } from '../../hooks/useCms';

function Reveal({ children, ...props }) {
  return <BaseReveal data-reveal="" baseClass="" shownClass="in" {...props}>{children}</BaseReveal>;
}

// Headline with word-by-word reveal (was the runtime's [data-headline] split + .play).
function Headline() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPlay(true); return undefined; }
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) { setPlay(true); return undefined; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { setPlay(true); io.disconnect(); } }), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const words = 'The perspective behind the plan.'.split(/\s+/);
  return (
    <h1 ref={ref} className="h1" data-headline style={{ maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto', textWrap: 'balance' }}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className={`adWord${play ? ' play' : ''}`} style={{ animationDelay: `${i * 0.09}s` }}>{t(w)}</span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </h1>
  );
}

const shape = (extra) => ({ position: 'absolute', ...extra });

export default function OurAdvisors() {
  const { t, lang } = useLanguage();
  const { data: cmsPage } = usePage('our-advisors');
  const seo = resolveSeo(cmsPage?.seo, lang);
  useLayoutEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = 'var(--white)';
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <main>
      <SEO
        {...seo}
        title={seo.title || t('Our Advisors')}
        description={seo.description || t('Building a company that businesses trust with their operations takes more than good engineering. Our advisor brings the experience that helps Align make sharper calls on strategy, growth and scale.')}
      />
      {/* HERO */}
      <section className="sec" style={{ position: 'relative', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', padding: '90px 32px 56px', overflow: 'hidden', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={shape({ top: '-14%', left: '8%', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,219,.18),transparent 66%)', filter: 'blur(14px)', animation: 'advAurora1 20s ease-in-out infinite' })} />
          <div style={shape({ top: '8%', right: '6%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,92,255,.14),transparent 66%)', filter: 'blur(16px)', animation: 'advAurora2 24s ease-in-out 2s infinite' })} />
          <div style={shape({ bottom: '-18%', left: '38%', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(75,139,255,.12),transparent 68%)', filter: 'blur(18px)', animation: 'advAurora1 26s ease-in-out 1s infinite' })} />
          <div className="adShape" style={{ top: '18%', left: '15%', width: '26px', height: '26px', border: '2px solid rgba(26,86,219,.25)', borderRadius: '8px', animation: 'advFloatShape 9s ease-in-out infinite' }} />
          <div className="adShape" style={{ top: '28%', right: '17%', width: '16px', height: '16px', background: 'rgba(75,139,255,.4)', borderRadius: '50%', animation: 'advFloatShape 7s ease-in-out .6s infinite' }} />
          <div className="adShape" style={{ bottom: '24%', left: '23%', width: '20px', height: '20px', border: '2px solid rgba(124,92,255,.3)', borderRadius: '50%', animation: 'advFloatShape 8.5s ease-in-out 1.2s infinite' }} />
          <div className="adShape" style={{ bottom: '30%', right: '22%', width: '22px', height: '22px', border: '2px solid rgba(26,86,219,.22)', borderRadius: '6px', transform: 'rotate(20deg)', animation: 'advFloatShape 10s ease-in-out .3s infinite' }} />
        </div>
        <div style={{ maxWidth: '920px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Headline />
          <Reveal as="p" className="lede" style={{ margin: '22px auto 0', maxWidth: '620px' }}>{t("Building a company that businesses trust with their operations takes more than good engineering. Our advisor brings the experience that helps Align make sharper calls on strategy, growth and scale.")}</Reveal>
          <Reveal style={{ marginTop: '44px' }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'advScrollCue 1.8s ease-in-out infinite' }}><path d="M12 5v13" /><path d="M6 12l6 6 6-6" /></svg></Reveal>
        </div>
      </section>

      {/* EDITORIAL PROFILE */}
      <section style={{ background: '#fff', padding: '36px 32px 80px' }}>
        <Reveal className="profile-grid" style={{ maxWidth: '1080px', margin: '0 auto', background: 'var(--tint)', border: '1px solid #eaeef5', borderRadius: '28px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '0.82fr 1.18fr', boxShadow: '0 30px 70px -40px rgba(15,23,41,.35)' }}>
          <div style={{ position: 'relative', background: 'linear-gradient(160deg,#0f1729,#1c2b52)', minHeight: '460px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '40px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.14, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '38px 38px' }} />
            <div style={{ position: 'relative', width: '220px', height: '220px', display: 'grid', placeItems: 'center' }}>
              <span style={{ position: 'absolute', width: '158px', height: '158px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(75,139,255,.3),transparent 70%)', animation: 'advPulseRing 3s ease-out infinite' }} />
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(122,167,255,.28)', animation: 'advSpin 24s linear infinite' }}><span style={{ position: 'absolute', top: '-4px', left: '50%', width: '9px', height: '9px', marginLeft: '-4.5px', borderRadius: '50%', background: '#4b8bff', boxShadow: '0 0 12px #4b8bff' }} /></span>
              <span style={{ position: 'absolute', inset: '26px', borderRadius: '50%', border: '1px dashed rgba(122,167,255,.24)', animation: 'advSpinR 18s linear infinite' }}><span style={{ position: 'absolute', bottom: '-3px', left: '50%', width: '7px', height: '7px', marginLeft: '-3.5px', borderRadius: '50%', background: '#7aa7ff', boxShadow: '0 0 9px #7aa7ff' }} /></span>
              <div className="adProfileImg" style={{ position: 'relative', zIndex: 2, width: '132px', height: '132px', borderRadius: '50%', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', display: 'grid', placeItems: 'center', color: '#9fc0ff', transition: 'transform .5s cubic-bezier(.2,.7,.3,1)' }}>
                <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a7 7 0 0 1 14 0v1" /></svg>
              </div>
            </div>
            <span style={{ position: 'relative', fontSize: '11px', letterSpacing: '1.5px', color: '#7d8db3', textTransform: 'uppercase', fontWeight: 700 }}>{t("Advisor photo pending")}</span>
            <div style={{ position: 'absolute', left: '24px', bottom: '24px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.16)', borderRadius: '12px', padding: '9px 13px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'adFloat 6s ease-in-out infinite' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4b8bff', animation: 'adDot 1.8s ease-in-out infinite' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#dbe6ff' }}>{t("Advising since day one")}</span>
            </div>
          </div>
          <div style={{ padding: '48px 46px' }}>
            <span className="eyebrow">{t("Strategic Advisor")}</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '12px 0 0', color: '#b3bccb', letterSpacing: '.5px' }}>{t("Name pending")}</h2>
            <div style={{ fontSize: '15px', color: '#5b6472', marginTop: '5px' }}>{t("Role / title to be confirmed")}</div>
            <div style={{ height: '1px', background: '#e6ecf6', margin: '24px 0' }} />
            <div style={{ fontSize: '11px', letterSpacing: '1px', color: '#8a94a6', textTransform: 'uppercase', fontWeight: 700 }}>{t("About")}</div>
            <p style={{ fontSize: '15.5px', lineHeight: 1.7, color: '#4b5565', margin: '10px 0 0' }}>{t("Placeholder for the advisor's background — the experience across enterprise software, scaling teams and go-to-market that informs the guidance they bring to Align. Real bio to be added once confirmed.")}</p>
            <blockquote style={{ margin: '26px 0 0', padding: '20px 24px', background: '#fff', borderLeft: '3px solid var(--blue)', borderRadius: '0 14px 14px 0', fontSize: '17px', lineHeight: 1.5, color: '#31405c', fontStyle: 'italic' }}>{t("\"Advisor quote pending — a short line capturing their perspective on Align's mission.\"")}</blockquote>
          </div>
        </Reveal>
      </section>

      {/* AREAS OF GUIDANCE */}
      <section className="sec" style={{ background: 'linear-gradient(180deg,#fff 0%,#f4f8ff 100%)', borderTop: '1px solid #eef1f6' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <Reveal as="span" className="eyebrow">{t("Where the guidance lands")}</Reveal>
            <Reveal as="h2" className="h2">{t("How our advisor shapes Align.")}</Reveal>
          </div>
          <div className="grid3 areas-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginTop: '46px', perspective: '1200px' }}>
            {AREAS.map((a, i) => <AreaCard key={a[0]} a={a} i={i} />)}
          </div>
        </div>
      </section>

      {/* WHY AN ADVISOR */}
      <section className="sec" style={{ background: '#0f1729', position: 'relative', overflow: 'hidden', padding: '100px 32px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 0%,rgba(26,86,219,.24),transparent 55%)' }} />
        <div className="why-grid" style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>
          <div>
            <Reveal as="span" className="eyebrow light">{t("Why it matters")}</Reveal>
            <Reveal as="h2" className="h2" style={{ color: '#fff' }}>{t("A sounding board for the decisions that shape a company.")}</Reveal>
            <Reveal as="p" className="lede" style={{ fontSize: '16px', color: '#b7c2d6', margin: '18px 0 0' }}>{t("How our advisor helps Align pressure-test big calls — when to build vs. partner, how to price, where to focus the roadmap, and how to grow the team without losing what makes the work good.")}</Reveal>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {PILLARS.map((p) => (
              <Reveal key={p[0]} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#131c2e', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '20px 22px' }}>
                <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '11px', background: 'rgba(26,86,219,.18)', color: '#7aa7ff', display: 'grid', placeItems: 'center' }}><Icon name={p[2]} /></div>
                <div><div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{t(p[0])}</div><p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#96a2ba', margin: '5px 0 0' }}>{t(p[1])}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BACKGROUND TIMELINE */}
      <section className="sec" style={{ background: '#fff', borderTop: '1px solid #eef1f6' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <Reveal as="span" className="eyebrow">{t("Background")}</Reveal>
            <Reveal as="h2" className="h2">{t("A track record worth learning from.")}</Reveal>
            <Reveal as="p" style={{ fontSize: '14px', color: 'var(--faint)', margin: '12px 0 0' }}>{t("Career milestones TBD — confirm with advisor")}</Reveal>
          </div>
          <Timeline />
        </div>
      </section>

      {/* CTA */}
      <section className="sec" style={{ background: 'var(--tint)', padding: '90px 32px 110px' }}>
        <Reveal style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg,#1a56db,#123f9e)', borderRadius: '28px', padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <h2 style={{ position: 'relative', fontSize: 'clamp(26px,3.5vw,32px)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-.6px' }}>{t("Backed by experience. Built by our team.")}</h2>
          <p style={{ position: 'relative', fontSize: '16px', color: '#cfdcff', margin: '12px auto 0', maxWidth: '560px' }}>{t("See what that combination builds — take a walkthrough of the Align platform.")}</p>
          <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: '#fff', color: '#1a56db', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px' }}>{t("Book a Demo")}</SmartLink>
            <SmartLink href="/about-us.html" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,.4)' }}>{t("Back to About")}</SmartLink>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
