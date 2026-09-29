import { Fragment, useRef, useLayoutEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import RolesAccordion, { useRoleDocs } from './RolesAccordion';
import { Icon, CULTURE, STEPS } from './careersData';
import SEO, { resolveSeo } from '../../components/SEO';
import { useCareersPage } from '../../hooks/useCms';
import { useContactInfo } from '../../hooks/useContactInfo';
import { locT } from '../../lib/loc';
import { cmsPic } from '../../lib/cmsImage';

const cw = (i) => `crWordIn .5s cubic-bezier(.2,.7,.3,1) ${i * 0.06}s both`;
const crWordStyle = { opacity: 0, display: 'inline-block' };
const accentStyle = (i) => ({
  ...crWordStyle, fontFamily: 'var(--font-hand)', fontWeight: 700, color: '#1a56db', fontSize: '1.24em', letterSpacing: 0,
  background: 'linear-gradient(90deg,#1a56db 0%,#8fb8ff 50%,#1a56db 100%)', backgroundSize: '220% 100%',
  WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
  animation: `${cw(i)}, crSweep 1.1s ease-out ${i * 0.06 + 0.15}s both`,
});
const words = (s) => s.split(/\s+/).filter(Boolean);
const BUILTIN_EMAIL = 'talent@alignbsystems.com';
/* "{email}" in CMS texts (and the built-in address in the built-in copy)
   becomes the careers email from Site Settings. */
const withEmail = (s, email) => s.split('{email}').join(email).split(BUILTIN_EMAIL).join(email);

export default function Careers() {
  const { t, lang } = useLanguage();
  // <head> title/description: this page's singleton → SEO block, else the built-in copy below.
  const seo = resolveSeo(useCareersPage().data?.seo, lang, t);
  const rolesRef = useRef(null);
  const openRoles = useRoleDocs().length;
  /* Page texts + hero photo: "Careers page" singleton (built-in copy for
     anything empty); the careers email: Site Settings → Departments. */
  const pageQuery = useCareersPage();
  const cms = pageQuery.data;
  const tx = (k, fallback) => locT(cms?.[k], lang, t) || t(fallback);
  const email = useContactInfo().dept('careers').email || BUILTIN_EMAIL;
  const heroBg = cmsPic(pageQuery)(cms?.heroBackground, { width: 740 }, '/assets/images/careers/hero-bg.avif');
  const line1 = cms && locT(cms.heroLine1, lang, t) ? words(locT(cms.heroLine1, lang, t)) : [t('Build'), t('the'), t('Systems')];
  const line2 = cms && locT(cms.heroLine2, lang, t) ? words(locT(cms.heroLine2, lang, t)) : [t('Businesses')];
  const accent = tx('heroHighlight', 'Run On');
  const culture = cms?.cultureCards?.length
    ? cms.cultureCards.map((c, i) => ({ title: locT(c?.title, lang, t), text: locT(c?.text, lang, t), icon: c?.icon || 'check', delay: `${(i % 4) * 0.6}s` }))
    : CULTURE.map((c) => ({ title: t(c[0]), text: t(c[1]), icon: c[2], delay: c[3] }));
  const steps = cms?.steps?.length
    ? cms.steps.map((c) => ({ title: locT(c?.title, lang, t), text: withEmail(locT(c?.text, lang, t), email), icon: c?.icon || 'check' }))
    : STEPS.map((c) => ({ title: t(c[1]), text: withEmail(t(c[2]), email), icon: c[0] }));
  // CTA sentence around the (highlighted) email.
  const ctaText = locT(cms?.ctaText, lang, t);
  const [ctaBefore, ctaAfter] = ctaText && ctaText.includes('{email}')
    ? [ctaText.slice(0, ctaText.indexOf('{email}')).trim(), ctaText.slice(ctaText.indexOf('{email}') + 7).trim()]
    : ctaText ? [ctaText, ''] : [t("Email"), t("with the role title in the subject line — we read every one.")];

  useLayoutEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = 'var(--white)';
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <main>
      <SEO
        {...seo}
        title={seo.title || t('Careers')}
        description={seo.description || t("We're a small, fast-moving team building the ERP, HR, field-force and hospital management platforms real businesses run their operations on — not internal tools nobody sees.")}
      />
      {/* HERO */}
      <section className="sec" style={{ position: 'relative', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', padding: '80px 32px 56px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: '920px', height: '520px', background: 'radial-gradient(ellipse at center,rgba(26,86,219,.12),transparent 62%)', pointerEvents: 'none', animation: 'crGlowPulse 6s ease-in-out infinite' }} />
        {heroBg && <img src={heroBg} alt="" onError={(e) => e.currentTarget.remove()} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1, pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(180deg,#000,transparent 78%)', maskImage: 'linear-gradient(180deg,#000,transparent 78%)' }} />}
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <DataReveal as="span" className="eyebrow">{tx('heroEyebrow', "Careers at Align")}</DataReveal>
          <h1 className="h1" data-headline>
            {line1.map((w, i) => (
              <Fragment key={`a${i}`}>
                <span className="crWord" style={{ ...crWordStyle, animation: cw(i) }}>{w}</span>{i < line1.length - 1 ? ' ' : null}
              </Fragment>
            ))}<br />
            {line2.map((w, i) => (
              <Fragment key={`b${i}`}>
                <span className="crWord" style={{ ...crWordStyle, animation: cw(line1.length + i) }}>{w}</span>{' '}
              </Fragment>
            ))}
            <span className="crWord crAccentWord" style={accentStyle(line1.length + line2.length)}>{accent}</span>
            <span className="crWord" style={{ ...crWordStyle, animation: cw(line1.length + line2.length + 1) }}>.</span>
          </h1>
          <DataReveal as="p" className="lede" style={{ margin: '22px auto 0', maxWidth: '600px' }}>{tx('heroText', "We're a small, fast-moving team building the ERP, HR, field-force and hospital management platforms real businesses run their operations on — not internal tools nobody sees. Come own a piece of it.")}</DataReveal>
          <DataReveal style={{ marginTop: '32px' }}>
            <a href="#open-roles" onClick={(e) => { e.preventDefault(); rolesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} style={{ background: '#1a56db', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '14px 30px', borderRadius: '999px', boxShadow: '0 12px 28px -10px rgba(26,86,219,.5)' }}>{tx('heroButton', "See Open Roles")}</a>
          </DataReveal>
          <DataReveal className="jobstat">
            <span className="live"><i />{tx('heroHiring', "Hiring now")}</span>
            <span className="sep" />
            <span><b>{openRoles}</b> {t(openRoles !== 1 ? "open roles" : "open role")}</span>
            <span className="sep" />
            <span>{tx('heroWorkplace', "On-site · Karachi")}</span>
          </DataReveal>
          <div className="crHeroCard" style={{ position: 'absolute', left: '-6%', top: '14%', background: '#fff', border: '1px solid #eaeef5', borderRadius: '14px', padding: '12px 16px', boxShadow: '0 20px 44px -22px rgba(15,23,41,.3)', animation: 'crFloat 6.5s ease-in-out infinite' }}>
            <div style={{ fontSize: '10px', color: '#657085', letterSpacing: '.5px', fontWeight: 600 }}>{locT(cms?.heroCardArea, lang, t) || 'DHA Phase 7'}</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f1729', marginTop: '2px' }}>{tx('heroCardTitle', "Karachi Office")}</div>
          </div>
          <div className="crHeroCard" style={{ position: 'absolute', right: '-4%', bottom: '18%', background: '#fff', border: '1px solid #eaeef5', borderRadius: '14px', padding: '12px 16px', boxShadow: '0 20px 44px -22px rgba(15,23,41,.3)', animation: 'crFloat 7.2s ease-in-out .6s infinite' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#1a9d55', animation: 'crDot 1.8s ease-in-out infinite' }} /><span style={{ fontSize: '12px', fontWeight: 700, color: '#0f1729' }}>{tx('heroHiring', "Hiring now")}</span></div>
          </div>
        </div>
      </section>

      {/* CULTURE */}
      <section className="sec" style={{ background: '#fff', padding: '30px 32px 90px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{tx('cultureEyebrow', "Why join Align")}</DataReveal>
            <DataReveal as="h2" className="h2">{tx('cultureHeading', "Work that ships, and work that matters.")}</DataReveal>
          </div>
          <div className="culture-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px', marginTop: '46px' }}>
            {culture.map((c, i) => (
              <DataReveal key={`${i}-${c.title}`} className="crCulture" style={{ background: 'var(--tint)', border: '1px solid #eaeef5', borderRadius: '20px', padding: '26px 22px' }}>
                <div className="crIco" style={{ width: '48px', height: '48px', borderRadius: '13px', background: '#e8effc', color: '#1a56db', display: 'grid', placeItems: 'center', animationDelay: c.delay }}><Icon name={c.icon} /></div>
                <div style={{ fontSize: '16.5px', fontWeight: 700, marginTop: '17px', lineHeight: 1.25 }}>{c.title}</div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#5b6472', margin: '9px 0 0' }}>{c.text}</p>
              </DataReveal>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN ROLES */}
      <section ref={rolesRef} className="sec" id="open-roles" style={{ background: 'linear-gradient(180deg,#fff 0%,#f4f8ff 100%)', borderTop: '1px solid #eef1f6', padding: '20px 32px 100px' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{tx('rolesEyebrow', "Open Roles")}</DataReveal>
            <DataReveal as="h2" className="h2" style={{ fontSize: 'clamp(28px,4vw,36px)' }}>{tx('rolesHeading', "Where we're hiring right now.")}</DataReveal>
          </div>
          <RolesAccordion page={cms} email={email} />
        </div>
      </section>

      {/* HIRING PROCESS */}
      <section className="sec" style={{ background: '#fff', padding: '20px 32px 92px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{tx('stepsEyebrow', "How hiring works")}</DataReveal>
            <DataReveal as="h2" className="h2" style={{ fontSize: 'clamp(28px,4vw,36px)' }}>{tx('stepsHeading', "From hello to first day.")}</DataReveal>
            <DataReveal as="p" style={{ fontSize: '16px', lineHeight: 1.65, color: '#4b5565', margin: '14px auto 0' }}>{tx('stepsText', "No endless loops — a few honest conversations and a fast decision, either way.")}</DataReveal>
          </div>
          <div className="hsteps">
            <div className="hline" />
            {steps.map((s, i) => (
              <DataReveal key={`${i}-${s.title}`} className="hstep">
                <div className="hnode"><Icon name={s.icon} size={26} sw={1.7} /><span className="hnum">{i + 1}</span></div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </DataReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec" style={{ background: '#fff', padding: '0 32px 110px' }}>
        <DataReveal style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg,#1a56db,#123f9e)', borderRadius: '28px', padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <h2 style={{ position: 'relative', fontSize: 'clamp(26px,3.5vw,32px)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-.6px' }}>{tx('ctaHeading', "See yourself here?")}</h2>
          <p style={{ position: 'relative', fontSize: '16px', color: '#cfdcff', margin: '12px auto 0', maxWidth: '520px' }}>{ctaBefore}{ctaBefore ? ' ' : ''}<span style={{ color: '#fff', fontWeight: 600 }}>{email}</span>{ctaAfter ? ' ' : ''}{ctaAfter}</p>
          <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
            <a href={`mailto:${email}`} style={{ background: '#fff', color: '#1a56db', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px' }}>{tx('ctaButton', "Email Us")}</a>
          </div>
        </DataReveal>
      </section>
    </main>
  );
}
