import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import SEO, { resolveSeo } from '../../components/SEO';
import { usePage } from '../../hooks/useCms';
import {
  Icon, STRIP, STRIP_TINTS, STATS, EXP, TECHSTACK, VALS, NET,
} from './aboutData';
import Journey from './Journey';
import ProductCarousel from './ProductCarousel';

export default function AboutUs() {
  const { t, lang } = useLanguage();
  const { data: cmsPage } = usePage('about-us');
  const seo = resolveSeo(cmsPage?.seo, lang);
  return (
    <main>
      <SEO
        {...seo}
        title={seo.title || t('About Us')}
        description={seo.description || t('Align Business Systems designs and builds the ERP, HR, and field-force platforms that businesses across Pakistan use to run their day-to-day operations.')}
      />
      {/* 1. HERO */}
      <section className="sec" style={{ padding: '96px 32px 40px', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '520px', background: 'radial-gradient(ellipse at center,rgba(26,86,219,.09),transparent 62%)', pointerEvents: 'none' }} />
        <img src="/assets/images/about/team-laptop.webp" alt="" aria-hidden="true" onError={(e) => e.currentTarget.remove()} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.06, pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(180deg,#000 0%,transparent 72%)', maskImage: 'linear-gradient(180deg,#000 0%,transparent 72%)' }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <DataReveal as="span" className="eyebrow">{t("About Align")}</DataReveal>
          <DataReveal as="h1" className="h1">{t("We Build the Systems")}<br />{t("Businesses Run On")}</DataReveal>
          <DataReveal as="p" className="lede" style={{ margin: '22px auto 0', maxWidth: '640px' }}>{t("Align Business Systems designs and builds the ERP, HR, and field-force platforms that businesses across Pakistan use to run their day-to-day operations.")}</DataReveal>
          <DataReveal style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
            <SmartLink href="/our-team.html" className="btn-primary">{t("Meet Our Team")}</SmartLink>
            <SmartLink href="/contact-us.html" className="btn-outline">{t("Book a Demo")}</SmartLink>
          </DataReveal>
        </div>
        <DataReveal className="strip" style={{ margin: '60px auto 0' }}>
          <div className="strip__track">
            {STRIP.concat(STRIP).map((s, i) => (
              <div key={i} className="strip__card" style={{ background: `linear-gradient(160deg,${STRIP_TINTS[i % STRIP_TINTS.length]},#0f1729)` }}>
                <img src={`/assets/images/about/${s[1]}.webp`} alt="" decoding="async" loading={i < STRIP.length ? undefined : 'lazy'} onError={(e) => e.currentTarget.remove()} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(15,23,41,0) 42%,rgba(15,23,41,.8) 100%)' }} />
                <span>{t(s[0])}</span>
              </div>
            ))}
          </div>
        </DataReveal>
      </section>

      {/* 2. WHO WE ARE */}
      <section className="sec" style={{ background: '#fff' }}>
        <div className="wrap two-col" style={{ maxWidth: '1100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div>
            <DataReveal as="span" className="eyebrow">{t("Who We Are")}</DataReveal>
            <DataReveal as="h2" className="h2">{t("A Product Company, First.")}</DataReveal>
            <DataReveal as="p" className="lede" style={{ margin: '20px 0 0', fontSize: '17px' }}>{t("We're an engineering-led team building BusinessFlo, PeopleNest, and Field Force — and taking on custom builds for businesses that need something no off-the-shelf tool can offer.")}</DataReveal>
          </div>
          <DataReveal style={{ position: 'relative', aspectRatio: '4/3' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '24px', overflow: 'hidden', border: '1px solid #e0e9f8', boxShadow: '0 30px 70px -34px rgba(15,23,41,.45)', background: 'linear-gradient(150deg,#1a56db,#0f1729)', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.9)' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>
              <img src="/assets/images/about/team-monitor.webp" alt={t("Align engineering team")} loading="lazy" decoding="async" onError={(e) => e.currentTarget.remove()} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="mobile-hide-float" style={{ position: 'absolute', left: '-26px', bottom: '-24px', width: '262px', background: '#fff', border: '1px solid #eaeef5', borderRadius: '18px', padding: '16px', boxShadow: '0 30px 64px -28px rgba(15,23,41,.5)', animation: 'abFloat 6.5s ease-in-out infinite' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f1729' }}>{t("Align Dashboard")}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 700, color: '#157d44' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#1a9d55', animation: 'abDot 1.6s ease-in-out infinite' }} />{t("LIVE")}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                <div style={{ background: '#f7faff', borderRadius: '11px', padding: '9px 11px' }}><div style={{ fontSize: '9px', letterSpacing: '.5px', color: '#657085', textTransform: 'uppercase', fontWeight: 700 }}>{t("Total Sales")}</div><div style={{ fontSize: '16px', fontWeight: 800, color: '#0f1729', marginTop: '2px' }}>1,490,010</div></div>
                <div style={{ background: '#f7faff', borderRadius: '11px', padding: '9px 11px' }}><div style={{ fontSize: '9px', letterSpacing: '.5px', color: '#657085', textTransform: 'uppercase', fontWeight: 700 }}>{t("Total Profit")}</div><div style={{ fontSize: '16px', fontWeight: 800, color: '#1a56db', marginTop: '2px' }}>910,063</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '52px', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #eef1f6' }}>
                {[['44%', '#cddcf8', '0s'], ['70%', '#9dbcf3', '.2s'], ['56%', '#6f9bef', '.4s'], ['88%', '#1a56db', '.6s'], ['64%', '#4b8bff', '.8s'], ['78%', '#8fb8ff', '1s']].map((b, i) => (
                  <div key={i} style={{ flex: 1, height: b[0], background: b[1], borderRadius: '3px 3px 0 0', transformOrigin: 'bottom', animation: `abBarP 2.4s ease-in-out ${b[2]} infinite` }} />
                ))}
              </div>
            </div>
            <div className="mobile-hide-float" style={{ position: 'absolute', right: '-18px', top: '24px', background: '#fff', border: '1px solid #eaeef5', borderRadius: '12px', padding: '10px 13px', boxShadow: '0 22px 48px -24px rgba(15,23,41,.45)', display: 'flex', alignItems: 'center', gap: '9px', animation: 'abFloat2 5.5s ease-in-out infinite' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#e6f5ec', color: '#157d44', display: 'grid', placeItems: 'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg></div>
              <div><div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f1729', lineHeight: 1 }}>{t("PO-2041 approved")}</div><div style={{ fontSize: '9.5px', color: '#657085', marginTop: '2px' }}>{t("just now")}</div></div>
            </div>
          </DataReveal>
        </div>
      </section>

      {/* 3. WHY ALIGN EXISTS */}
      <section className="sec" style={{ background: '#0f1729', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%,rgba(26,86,219,.28),transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <DataReveal as="span" className="eyebrow light">{t("Why Align Exists")}</DataReveal>
          <DataReveal as="h2" className="h2" style={{ color: '#fff' }}>{t("Because Spreadsheets Don't Scale.")}</DataReveal>
          <DataReveal as="p" className="lede" style={{ color: '#b7c2d6', margin: '22px auto 0', maxWidth: '660px' }}>{t("We started Align because too many growing businesses were running critical operations — finance, HR, field teams — on tools never designed for the job. We build the alternative.")}</DataReveal>
        </div>
      </section>

      {/* 4. OUR JOURNEY */}
      <section className="sec" style={{ background: '#fff' }}>
        <div className="wrap" style={{ maxWidth: '1200px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{t("Our Journey")}</DataReveal>
            <DataReveal as="h2" className="h2">{t("Where We've Been")}</DataReveal>
            <DataReveal as="p" style={{ fontSize: '14px', color: 'var(--faint)', margin: '12px 0 0' }}>{t("Milestones TBD — confirm with team")}</DataReveal>
          </div>
          <Journey />
        </div>
      </section>

      {/* 5. RECOGNITION / STATS */}
      <section className="sec" style={{ background: '#0f1729', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 0%,rgba(26,86,219,.25),transparent 55%)' }} />
        <div className="wrap" style={{ position: 'relative' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
            <DataReveal as="span" className="eyebrow light">{t("On the National Stage")}</DataReveal>
            <DataReveal as="h2" className="h2" style={{ color: '#fff' }}>{t("Recognized, and out in the field.")}</DataReveal>
            <DataReveal as="p" className="lede" style={{ color: '#b7c2d6', margin: '16px auto 0', maxWidth: '640px' }}>{t("From exhibiting at ITCN Asia to earning a Tech destiNATION Pakistan recognition award — Align shows up where Pakistan's software industry gathers, and demos BusinessFlo live to the businesses that need it.")}</DataReveal>
          </div>
          <DataReveal className="rec-gallery" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gridTemplateRows: '180px 180px', gap: '16px', marginTop: '44px' }}>
            <div style={{ gridRow: 'span 2', borderRadius: '20px', overflow: 'hidden', position: 'relative', background: '#131c2e' }}><img src="/assets/images/about/award.webp" loading="lazy" decoding="async" alt={t("Tech destiNATION Pakistan recognition award")} onError={(e) => e.currentTarget.remove()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '16px', background: 'linear-gradient(0deg,rgba(15,23,41,.85),transparent)' }}><div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{t("Recognition Award")}</div><div style={{ fontSize: '12px', color: '#b7c2d6', marginTop: '2px' }}>Tech destiNATION Pakistan</div></div></div>
            {[['booth-team', 'ITCN Asia'], ['booth-demo', 'Live Demos'], ['itcn-wall.webp', 'ITCN Asia 2023'], ['brochure', 'In Conversation']].map((g, i) => (
              <div key={i} style={{ borderRadius: '20px', overflow: 'hidden', position: 'relative', background: '#131c2e' }}>
                <img src={`/assets/images/about/${g[0].includes('.') ? g[0] : `${g[0]}.webp`}`} alt={t(g[1])} loading="lazy" decoding="async" onError={(e) => e.currentTarget.remove()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', left: '12px', bottom: '12px', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#fff', textTransform: 'uppercase' }}>{t(g[1])}</span>
              </div>
            ))}
          </DataReveal>
          <div className="four-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginTop: '44px' }}>
            {STATS.map((s) => (
              <DataReveal key={s[0]} className="card-lift" style={{ position: 'relative', background: '#131c2e', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '26px 22px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: s[2] }} />
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s[3], color: s[2], display: 'grid', placeItems: 'center', marginBottom: '14px' }}><Icon name={s[4]} size={20} /></div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>{t(s[0])}</div>
                <div style={{ fontSize: '13px', color: '#8a97b0', marginTop: '6px', lineHeight: 1.4 }}>{t(s[1])}</div>
              </DataReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHAT WE BUILD */}
      <section className="sec" style={{ background: 'var(--tint)', borderTop: '1px solid #eef1f6' }}>
        <div className="wrap" style={{ maxWidth: '1000px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{t("What We Build")}</DataReveal>
            <DataReveal as="h2" className="h2">{t("Three products. One platform.")}</DataReveal>
            <DataReveal as="p" className="lede" style={{ fontSize: '16px', margin: '16px auto 0', maxWidth: '600px' }}>{t("One connected platform, three products. Slide through each live dashboard — or pick one below.")}</DataReveal>
          </div>
          <ProductCarousel />
        </div>
      </section>

      {/* 7. EXPERTISE */}
      <section className="sec" style={{ background: '#0f1729', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 15% 100%,rgba(26,86,219,.22),transparent 55%)' }} />
        <div className="wrap" style={{ maxWidth: '1100px', position: 'relative' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow light">{t("What We're Good At")}</DataReveal>
            <DataReveal as="h2" className="h2" style={{ color: '#fff' }}>{t("The expertise behind the platform.")}</DataReveal>
            <DataReveal as="p" className="lede" style={{ color: '#b7c2d6', fontSize: '16px', margin: '16px auto 0', maxWidth: '600px' }}>{t("Every product we ship is built in-house on the same deep engineering foundation.")}</DataReveal>
          </div>
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '48px' }}>
            {EXP.map((e) => (
              <DataReveal key={e[0]} className="card-lift" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#131c2e', border: '1px solid rgba(255,255,255,.08)', borderRadius: '18px', padding: '24px' }}>
                <div style={{ width: '46px', height: '46px', flexShrink: 0, borderRadius: '12px', background: 'rgba(26,86,219,.16)', color: '#7aa7ff', display: 'grid', placeItems: 'center' }}><Icon name={e[2]} size={22} /></div>
                <div><div style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>{t(e[0])}</div><p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#96a2ba', margin: '6px 0 0' }}>{t(e[1])}</p></div>
              </DataReveal>
            ))}
          </div>
          <DataReveal style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '32px' }}>
            {TECHSTACK.map((t) => (
              <span key={t} style={{ fontSize: '12.5px', fontWeight: 700, color: '#cdd8ec', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '999px', padding: '9px 16px' }}>{t}</span>
            ))}
          </DataReveal>
        </div>
      </section>

      {/* 8. OUR VALUES */}
      <section className="sec" style={{ background: 'linear-gradient(180deg,#fff 0%,#eff5ff 100%)' }}>
        <div className="wrap" style={{ maxWidth: '1100px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{t("How We Work")}</DataReveal>
            <DataReveal as="h2" className="h2">{t("Our Values")}</DataReveal>
          </div>
          <div className="four-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px', marginTop: '48px' }}>
            {VALS.map((v) => (
              <DataReveal key={v[0]} className="card-lift" style={{ position: 'relative', background: '#fff', border: '1px solid #eaeef5', borderRadius: '20px', padding: '28px 24px', overflow: 'hidden', boxShadow: '0 16px 40px -30px rgba(15,23,41,.2)' }}>
                <span aria-hidden="true" style={{ position: 'absolute', top: '18px', right: '20px', fontSize: '13px', fontWeight: 700, color: '#dbe4f3' }}>{v[0]}</span>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg,#1a56db,#4b8bff)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 14px 26px -10px rgba(26,86,219,.55)', animation: 'abValFloat 5s ease-in-out infinite' }}><Icon name={v[3]} size={24} /></div>
                <div style={{ fontSize: '16.5px', fontWeight: 700, marginTop: '18px', lineHeight: 1.25 }}>{t(v[1])}</div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#5b6472', margin: '8px 0 0' }}>{t(v[2])}</p>
              </DataReveal>
            ))}
          </div>
          <DataReveal as="p" style={{ textAlign: 'center', fontSize: '12px', color: '#9aa4b6', margin: '24px 0 0' }}>{t("Values to be confirmed with leadership")}</DataReveal>
        </div>
      </section>

      {/* 9. PEOPLE & NETWORK */}
      <section className="sec" style={{ background: 'var(--tint)', borderTop: '1px solid #eef1f6' }}>
        <div className="wrap" style={{ maxWidth: '1160px' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{t("The People & Network Behind Align")}</DataReveal>
            <DataReveal as="h2" className="h2">{t("The people who make it work.")}</DataReveal>
          </div>
          <div className="hub-grid">
            {NET.map((n) => (
              <DataReveal key={n.title} as={SmartLink} href={n.href} className="hub-card">
                <div className="hub-card__rail" style={{ background: n.accent }} />
                <div className="hub-card__ic" style={{ overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(/assets/images/about/${n.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,rgba(26,86,219,.1),rgba(15,23,41,.3))' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: n.ink || n.accent, background: n.tint, borderRadius: '999px', padding: '5px 11px' }}>{t(n.tag)}</span>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f1729', marginTop: '10px' }}>{t(n.title)}</div>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#5b6472', margin: '6px 0 0' }}>{t(n.line)}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: '14px', fontSize: '13.5px', fontWeight: 700, color: n.ink || n.accent }}>{t("Explore")} <span className="hub-arrow">→</span></span>
                </div>
              </DataReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CLOSING CTA */}
      <section className="sec" style={{ background: '#fff', padding: '40px 32px 110px' }}>
        <DataReveal className="wrap" style={{ maxWidth: '1100px', background: 'linear-gradient(135deg,#1a56db,#123f9e)', borderRadius: '28px', padding: '72px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <h2 style={{ position: 'relative', fontSize: 'clamp(26px,3.5vw,36px)', lineHeight: 1.22, letterSpacing: '-.8px', fontWeight: 800, color: '#fff', margin: '0 auto', maxWidth: '820px' }}>{t("Let's talk about innovative solutions, business automation and how we can help you achieve your business goals.")}</h2>
          <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: '#fff', color: '#1a56db', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px' }}>{t("Let's talk")}</SmartLink>
            <SmartLink href="/contact-us.html" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,.4)' }}>{t("Get Info")}</SmartLink>
          </div>
        </DataReveal>
      </section>
    </main>
  );
}
