import { useRef, useLayoutEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/careers.css';
import BaseReveal from '../../components/Reveal';
import RolesAccordion from './RolesAccordion';
import { Icon, CULTURE, ROLES, STEPS } from './careersData';

function Reveal({ children, ...props }) {
  return <BaseReveal data-reveal="" baseClass="" shownClass="in" {...props}>{children}</BaseReveal>;
}

const cw = (i) => `crWordIn .5s cubic-bezier(.2,.7,.3,1) ${i * 0.06}s both`;
const crWordStyle = { opacity: 0, display: 'inline-block' };
const accentStyle = {
  ...crWordStyle, fontFamily: 'var(--font-hand)', fontWeight: 700, color: '#1a56db', fontSize: '1.24em', letterSpacing: 0,
  background: 'linear-gradient(90deg,#1a56db 0%,#8fb8ff 50%,#1a56db 100%)', backgroundSize: '220% 100%',
  WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
  animation: `${cw(4)}, crSweep 1.1s ease-out ${4 * 0.06 + 0.15}s both`,
};

export default function Careers() {
  const { t } = useLanguage();
  const rolesRef = useRef(null);

  useLayoutEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = 'var(--white)';
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="sec" style={{ position: 'relative', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', padding: '80px 32px 56px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: '920px', height: '520px', background: 'radial-gradient(ellipse at center,rgba(26,86,219,.12),transparent 62%)', pointerEvents: 'none', animation: 'crGlowPulse 6s ease-in-out infinite' }} />
        <img src="/assets/images/careers/hero-bg.avif" alt="" onError={(e) => e.currentTarget.remove()} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1, pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(180deg,#000,transparent 78%)', maskImage: 'linear-gradient(180deg,#000,transparent 78%)' }} />
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Reveal as="span" className="eyebrow">{t("Careers at Align")}</Reveal>
          <h1 className="h1" data-headline>
            <span className="crWord" style={{ ...crWordStyle, animation: cw(0) }}>{t("Build")}</span>{' '}
            <span className="crWord" style={{ ...crWordStyle, animation: cw(1) }}>{t("the")}</span>{' '}
            <span className="crWord" style={{ ...crWordStyle, animation: cw(2) }}>{t("Systems")}</span><br />
            <span className="crWord" style={{ ...crWordStyle, animation: cw(3) }}>{t("Businesses")}</span>{' '}
            <span className="crWord crAccentWord" style={accentStyle}>{t("Run On")}</span>
            <span className="crWord" style={{ ...crWordStyle, animation: cw(5) }}>.</span>
          </h1>
          <Reveal as="p" className="lede" style={{ margin: '22px auto 0', maxWidth: '600px' }}>{t("We're a small, fast-moving team building the ERP, HR and field-force platforms real businesses run their operations on — not internal tools nobody sees. Come own a piece of it.")}</Reveal>
          <Reveal style={{ marginTop: '32px' }}>
            <a href="#open-roles" onClick={(e) => { e.preventDefault(); rolesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} style={{ background: '#1a56db', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '14px 30px', borderRadius: '999px', boxShadow: '0 12px 28px -10px rgba(26,86,219,.5)' }}>{t("See Open Roles")}</a>
          </Reveal>
          <Reveal className="jobstat">
            <span className="live"><i />{t("Hiring now")}</span>
            <span className="sep" />
            <span><b>{ROLES.length}</b> {t(ROLES.length !== 1 ? "open roles" : "open role")}</span>
            <span className="sep" />
            <span>{t("On-site · Karachi")}</span>
          </Reveal>
          <div className="crHeroCard" style={{ position: 'absolute', left: '-6%', top: '14%', background: '#fff', border: '1px solid #eaeef5', borderRadius: '14px', padding: '12px 16px', boxShadow: '0 20px 44px -22px rgba(15,23,41,.3)', animation: 'crFloat 6.5s ease-in-out infinite' }}>
            <div style={{ fontSize: '10px', color: '#8a94a6', letterSpacing: '.5px', fontWeight: 600 }}>DHA Phase 7</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f1729', marginTop: '2px' }}>{t("Karachi Office")}</div>
          </div>
          <div className="crHeroCard" style={{ position: 'absolute', right: '-4%', bottom: '18%', background: '#fff', border: '1px solid #eaeef5', borderRadius: '14px', padding: '12px 16px', boxShadow: '0 20px 44px -22px rgba(15,23,41,.3)', animation: 'crFloat 7.2s ease-in-out .6s infinite' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#1a9d55', animation: 'crDot 1.8s ease-in-out infinite' }} /><span style={{ fontSize: '12px', fontWeight: 700, color: '#0f1729' }}>{t("Hiring now")}</span></div>
          </div>
        </div>
      </section>

      {/* CULTURE */}
      <section className="sec" style={{ background: '#fff', padding: '30px 32px 90px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <Reveal as="span" className="eyebrow">{t("Why join Align")}</Reveal>
            <Reveal as="h2" className="h2">{t("Work that ships, and work that matters.")}</Reveal>
          </div>
          <div className="culture-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px', marginTop: '46px' }}>
            {CULTURE.map((c) => (
              <Reveal key={c[0]} className="crCulture" style={{ background: 'var(--tint)', border: '1px solid #eaeef5', borderRadius: '20px', padding: '26px 22px' }}>
                <div className="crIco" style={{ width: '48px', height: '48px', borderRadius: '13px', background: '#e8effc', color: '#1a56db', display: 'grid', placeItems: 'center', animationDelay: c[3] }}><Icon name={c[2]} /></div>
                <div style={{ fontSize: '16.5px', fontWeight: 700, marginTop: '17px', lineHeight: 1.25 }}>{t(c[0])}</div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#5b6472', margin: '9px 0 0' }}>{t(c[1])}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN ROLES */}
      <section ref={rolesRef} className="sec" id="open-roles" style={{ background: 'linear-gradient(180deg,#fff 0%,#f4f8ff 100%)', borderTop: '1px solid #eef1f6', padding: '20px 32px 100px' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <Reveal as="span" className="eyebrow">{t("Open Roles")}</Reveal>
            <Reveal as="h2" className="h2" style={{ fontSize: 'clamp(28px,4vw,36px)' }}>{t("Where we're hiring right now.")}</Reveal>
          </div>
          <RolesAccordion />
        </div>
      </section>

      {/* HIRING PROCESS */}
      <section className="sec" style={{ background: '#fff', padding: '20px 32px 92px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto' }}>
            <Reveal as="span" className="eyebrow">{t("How hiring works")}</Reveal>
            <Reveal as="h2" className="h2" style={{ fontSize: 'clamp(28px,4vw,36px)' }}>{t("From hello to first day.")}</Reveal>
            <Reveal as="p" style={{ fontSize: '16px', lineHeight: 1.65, color: '#4b5565', margin: '14px auto 0' }}>{t("No endless loops — a few honest conversations and a fast decision, either way.")}</Reveal>
          </div>
          <div className="hsteps">
            <div className="hline" />
            {STEPS.map((s, i) => (
              <Reveal key={s[1]} className="hstep">
                <div className="hnode"><Icon name={s[0]} size={26} sw={1.7} /><span className="hnum">{i + 1}</span></div>
                <h3>{t(s[1])}</h3>
                <p>{t(s[2])}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec" style={{ background: '#fff', padding: '0 32px 110px' }}>
        <Reveal style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg,#1a56db,#123f9e)', borderRadius: '28px', padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <h2 style={{ position: 'relative', fontSize: 'clamp(26px,3.5vw,32px)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-.6px' }}>{t("See yourself here?")}</h2>
          <p style={{ position: 'relative', fontSize: '16px', color: '#cfdcff', margin: '12px auto 0', maxWidth: '520px' }}>{t("Email")} <span style={{ color: '#fff', fontWeight: 600 }}>talent@alignbsystems.com</span> {t("with the role title in the subject line — we read every one.")}</p>
          <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
            <a href="mailto:talent@alignbsystems.com" style={{ background: '#fff', color: '#1a56db', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px' }}>{t("Email Us")}</a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
