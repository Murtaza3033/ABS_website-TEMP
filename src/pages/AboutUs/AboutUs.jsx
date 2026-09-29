import { Fragment } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import SEO, { resolveSeo } from '../../components/SEO';
import { usePage, useAboutPage } from '../../hooks/useCms';
import { locT, locLines } from '../../lib/loc';
import { getSanityImageUrl } from '../../lib/sanity';
import { PRODMETA, metaImg } from '../Products/productsData';
import {
  Icon, STRIP, STRIP_TINTS, MILES, STATS, EXP, TECHSTACK, VALS, NET,
} from './aboutData';
import Journey from './Journey';
import ProductCarousel from './ProductCarousel';

const ABOUT_IMG = (name) => `/assets/images/about/${name.includes('.') ? name : `${name}.webp`}`;
const RING = { blue: '#1a56db', gold: '#d4a017', green: '#1a9d55' };
/* Recognition gallery fallback: [image, caption, second line, alt]. */
const GALLERY = [
  ['award', 'Recognition Award', 'Tech destiNATION Pakistan', 'Tech destiNATION Pakistan recognition award'],
  ['booth-team', 'ITCN Asia'], ['booth-demo', 'Live Demos'], ['itcn-wall.webp', 'ITCN Asia 2023'], ['brochure', 'In Conversation'],
];

export default function AboutUs() {
  const { t, lang } = useLanguage();
  const { data: cmsPage } = usePage('about-us');
  const seo = resolveSeo(cmsPage?.seo, lang);
  /* Every text and photo below is editable in Sanity ("About Us page"
     singleton). Anything empty falls back to the built-in copy/photo (lists:
     the whole built-in list when the CMS list is empty; an item's missing
     photo falls back to the built-in photo at the same position). Photos are
     served from the Sanity CDN at ~2x their displayed size. */
  const { data: cms } = useAboutPage();
  const tx = (k, fallback) => locT(cms?.[k], lang, t) || t(fallback);
  const lt = (v) => locT(v, lang, t);
  const pic = (image, width, fallback) => getSanityImageUrl(image, { width }) || fallback || '';
  const pick = (k, fallback, fromCms, fromFallback) => (cms?.[k]?.length ? cms[k].map(fromCms) : fallback.map(fromFallback));

  const heading = locLines(cms?.heroHeading, lang, t, ['We Build the Systems', 'Businesses Run On']);
  const strip = pick('strip', STRIP,
    (x, i) => ({ caption: lt(x?.caption), src: pic(x?.image, 600, STRIP[i] && ABOUT_IMG(STRIP[i][1])) }),
    (x) => ({ caption: t(x[0]), src: ABOUT_IMG(x[1]) }));
  const miles = pick('milestones', MILES,
    (x, i) => ({ year: lt(x?.year), title: lt(x?.title), text: lt(x?.text), color: RING[x?.ring] || RING.blue, src: pic(x?.image, 160, MILES[i] && ABOUT_IMG(MILES[i][3])) }),
    (x) => ({ year: t(x[0]), title: t(x[1]), text: '', color: x[2], src: ABOUT_IMG(x[3]) }));
  const gallery = pick('gallery', GALLERY,
    (x, i) => ({ caption: lt(x?.caption), sub: lt(x?.subcaption), alt: lt(x?.alt) || lt(x?.caption), src: pic(x?.image, i === 0 ? 900 : 640, GALLERY[i] && ABOUT_IMG(GALLERY[i][0])) }),
    (x) => ({ caption: t(x[1]), sub: x[2] || '', alt: t(x[3] || x[1]), src: ABOUT_IMG(x[0]) }));
  const [feature, ...tiles] = gallery;
  const stats = pick('stats', STATS,
    (x, i) => ({ value: lt(x?.value), label: lt(x?.label), icon: x?.icon || STATS[i % STATS.length][4], color: STATS[i % STATS.length][2], bg: STATS[i % STATS.length][3] }),
    (x) => ({ value: t(x[0]), label: t(x[1]), icon: x[4], color: x[2], bg: x[3] }));
  const slides = pick('products', PRODMETA,
    (x, i) => {
      const m = PRODMETA[i % PRODMETA.length];
      return { name: lt(x?.name), nameEn: locT(x?.name, 'en'), url: x?.url || '', src: pic(x?.image, 1672, PRODMETA[i] && metaImg(PRODMETA[i])), topTitle: lt(x?.topTitle), topSub: lt(x?.topSub), botLabel: lt(x?.botLabel), botValue: x?.botValue || '', botDelta: lt(x?.botDelta), accent: m.accent, tint: m.tint };
    },
    (m) => ({ name: t(m.name), nameEn: m.name, url: m.url || m.bar, src: metaImg(m), topTitle: t(m.topTitle), topSub: t(m.topSub), botLabel: t(m.botLabel), botValue: m.botValue, botDelta: t(m.botDelta), accent: m.accent, tint: m.tint }));
  const expertise = pick('expertise', EXP,
    (x) => ({ title: lt(x?.title), text: lt(x?.text), icon: x?.icon || 'layers' }),
    (x) => ({ title: t(x[0]), text: t(x[1]), icon: x[2] }));
  const techStack = cms?.techStack?.length ? cms.techStack : TECHSTACK;
  const values = pick('values', VALS,
    (x) => ({ title: lt(x?.title), text: lt(x?.text), icon: x?.icon || 'check' }),
    (x) => ({ title: t(x[1]), text: t(x[2]), icon: x[3] }));
  const network = pick('network', NET,
    (x, i) => {
      const n = NET[i % NET.length];
      return { title: lt(x?.title), tag: lt(x?.tag), text: lt(x?.text), href: x?.href || '/', src: pic(x?.image, 280, NET[i] && ABOUT_IMG(NET[i].img)), accent: n.accent, ink: n.ink, tint: n.tint };
    },
    (n) => ({ title: t(n.title), tag: t(n.tag), text: t(n.line), href: n.href, src: ABOUT_IMG(n.img), accent: n.accent, ink: n.ink, tint: n.tint }));
  return (
    <main>
      <SEO
        {...seo}
        title={seo.title || t('About Us')}
        description={seo.description || t('Align Business Systems designs and builds the ERP, HR, field-force and hospital management platforms that businesses across Pakistan use to run their day-to-day operations.')}
      />
      {/* 1. HERO */}
      <section className="sec" style={{ padding: '96px 32px 40px', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '520px', background: 'radial-gradient(ellipse at center,rgba(26,86,219,.09),transparent 62%)', pointerEvents: 'none' }} />
        <img src={pic(cms?.heroBackground, 1254, ABOUT_IMG('team-laptop'))} alt="" aria-hidden="true" onError={(e) => e.currentTarget.remove()} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.06, pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(180deg,#000 0%,transparent 72%)', maskImage: 'linear-gradient(180deg,#000 0%,transparent 72%)' }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <DataReveal as="span" className="eyebrow">{tx('heroEyebrow', 'About Align')}</DataReveal>
          <DataReveal as="h1" className="h1">{heading.map((l, i) => <Fragment key={i}>{i > 0 && <br />}{l}</Fragment>)}</DataReveal>
          <DataReveal as="p" className="lede" style={{ margin: '22px auto 0', maxWidth: '640px' }}>{tx('heroText', 'Align Business Systems designs and builds the ERP, HR, field-force and hospital management platforms that businesses across Pakistan use to run their day-to-day operations.')}</DataReveal>
          <DataReveal style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
            <SmartLink href="/our-team.html" className="btn-primary">{tx('heroPrimaryCta', 'Meet Our Team')}</SmartLink>
            <SmartLink href="/contact-us.html" className="btn-outline">{tx('heroSecondaryCta', 'Book a Demo')}</SmartLink>
          </DataReveal>
        </div>
        <DataReveal className="strip" style={{ margin: '60px auto 0' }}>
          <div className="strip__track">
            {strip.concat(strip).map((s, i) => (
              <div key={i} className="strip__card" style={{ background: `linear-gradient(160deg,${STRIP_TINTS[i % STRIP_TINTS.length]},#0f1729)` }}>
                {s.src && <img src={s.src} alt="" decoding="async" loading={i < strip.length ? undefined : 'lazy'} onError={(e) => e.currentTarget.remove()} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(15,23,41,0) 42%,rgba(15,23,41,.8) 100%)' }} />
                <span>{s.caption}</span>
              </div>
            ))}
          </div>
        </DataReveal>
      </section>

      {/* 2. WHO WE ARE */}
      <section className="sec" style={{ background: '#fff' }}>
        <div className="wrap two-col" style={{ maxWidth: '1100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div>
            <DataReveal as="span" className="eyebrow">{tx('whoEyebrow', 'Who We Are')}</DataReveal>
            <DataReveal as="h2" className="h2">{tx('whoHeading', 'A Product Company, First.')}</DataReveal>
            <DataReveal as="p" className="lede" style={{ margin: '20px 0 0', fontSize: '17px' }}>{tx('whoText', "We're an engineering-led team building Businessflo, PeopleNest, Field Force and HMSflo — and taking on custom builds for businesses that need something no off-the-shelf tool can offer.")}</DataReveal>
          </div>
          <DataReveal style={{ position: 'relative', aspectRatio: '4/3' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '24px', overflow: 'hidden', border: '1px solid #e0e9f8', boxShadow: '0 30px 70px -34px rgba(15,23,41,.45)', background: 'linear-gradient(150deg,#1a56db,#0f1729)', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.9)' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>
              <img src={pic(cms?.whoImage, 1040, ABOUT_IMG('team-monitor'))} alt={tx('whoImageAlt', 'Align engineering team')} loading="lazy" decoding="async" onError={(e) => e.currentTarget.remove()} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
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
          <DataReveal as="span" className="eyebrow light">{tx('whyEyebrow', 'Why Align Exists')}</DataReveal>
          <DataReveal as="h2" className="h2" style={{ color: '#fff' }}>{tx('whyHeading', "Because Spreadsheets Don't Scale.")}</DataReveal>
          <DataReveal as="p" className="lede" style={{ color: '#b7c2d6', margin: '22px auto 0', maxWidth: '660px' }}>{tx('whyText', 'We started Align because too many growing businesses were running critical operations — finance, HR, field teams — on tools never designed for the job. We build the alternative.')}</DataReveal>
        </div>
      </section>

      {/* 4. OUR JOURNEY */}
      <section className="sec" style={{ background: '#fff' }}>
        <div className="wrap" style={{ maxWidth: '1200px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{tx('journeyEyebrow', 'Our Journey')}</DataReveal>
            <DataReveal as="h2" className="h2">{tx('journeyHeading', "Where We've Been")}</DataReveal>
            <DataReveal as="p" style={{ fontSize: '14px', color: 'var(--faint)', margin: '12px 0 0' }}>{tx('journeyNote', 'Milestones TBD — confirm with team')}</DataReveal>
          </div>
          <Journey miles={miles} />
        </div>
      </section>

      {/* 5. RECOGNITION / STATS */}
      <section className="sec" style={{ background: '#0f1729', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 0%,rgba(26,86,219,.25),transparent 55%)' }} />
        <div className="wrap" style={{ position: 'relative' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
            <DataReveal as="span" className="eyebrow light">{tx('recEyebrow', 'On the National Stage')}</DataReveal>
            <DataReveal as="h2" className="h2" style={{ color: '#fff' }}>{tx('recHeading', 'Recognized, and out in the field.')}</DataReveal>
            <DataReveal as="p" className="lede" style={{ color: '#b7c2d6', margin: '16px auto 0', maxWidth: '640px' }}>{tx('recText', "From exhibiting at ITCN Asia to earning a Tech destiNATION Pakistan recognition award — Align shows up where Pakistan's software industry gathers, and demos Businessflo live to the businesses that need it.")}</DataReveal>
          </div>
          <DataReveal className="rec-gallery" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gridTemplateRows: '180px 180px', gap: '16px', marginTop: '44px' }}>
            {feature && <div style={{ gridRow: 'span 2', borderRadius: '20px', overflow: 'hidden', position: 'relative', background: '#131c2e' }}>{feature.src && <img src={feature.src} loading="lazy" decoding="async" alt={feature.alt} onError={(e) => e.currentTarget.remove()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}<div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '16px', background: 'linear-gradient(0deg,rgba(15,23,41,.85),transparent)' }}><div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{feature.caption}</div>{feature.sub && <div style={{ fontSize: '12px', color: '#b7c2d6', marginTop: '2px' }}>{feature.sub}</div>}</div></div>}
            {tiles.map((g, i) => (
              <div key={i} style={{ borderRadius: '20px', overflow: 'hidden', position: 'relative', background: '#131c2e' }}>
                {g.src && <img src={g.src} alt={g.alt} loading="lazy" decoding="async" onError={(e) => e.currentTarget.remove()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                <span style={{ position: 'absolute', left: '12px', bottom: '12px', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#fff', textTransform: 'uppercase' }}>{g.caption}</span>
              </div>
            ))}
          </DataReveal>
          <div className="four-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginTop: '44px' }}>
            {stats.map((s, i) => (
              <DataReveal key={i} className="card-lift" style={{ position: 'relative', background: '#131c2e', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', padding: '26px 22px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: s.color }} />
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.bg, color: s.color, display: 'grid', placeItems: 'center', marginBottom: '14px' }}><Icon name={s.icon} size={20} /></div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: '#8a97b0', marginTop: '6px', lineHeight: 1.4 }}>{s.label}</div>
              </DataReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHAT WE BUILD */}
      <section className="sec" style={{ background: 'var(--tint)', borderTop: '1px solid #eef1f6' }}>
        <div className="wrap" style={{ maxWidth: '1000px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{tx('buildEyebrow', 'What We Build')}</DataReveal>
            <DataReveal as="h2" className="h2">{tx('buildHeading', 'Four products. One platform.')}</DataReveal>
            <DataReveal as="p" className="lede" style={{ fontSize: '16px', margin: '16px auto 0', maxWidth: '600px' }}>{tx('buildText', 'One connected platform, four products. Slide through each live dashboard — or pick one below.')}</DataReveal>
          </div>
          <ProductCarousel slides={slides} />
        </div>
      </section>

      {/* 7. EXPERTISE */}
      <section className="sec" style={{ background: '#0f1729', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 15% 100%,rgba(26,86,219,.22),transparent 55%)' }} />
        <div className="wrap" style={{ maxWidth: '1100px', position: 'relative' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow light">{tx('expEyebrow', "What We're Good At")}</DataReveal>
            <DataReveal as="h2" className="h2" style={{ color: '#fff' }}>{tx('expHeading', 'The expertise behind the platform.')}</DataReveal>
            <DataReveal as="p" className="lede" style={{ color: '#b7c2d6', fontSize: '16px', margin: '16px auto 0', maxWidth: '600px' }}>{tx('expText', 'Every product we ship is built in-house on the same deep engineering foundation.')}</DataReveal>
          </div>
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '48px' }}>
            {expertise.map((e, i) => (
              <DataReveal key={i} className="card-lift" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#131c2e', border: '1px solid rgba(255,255,255,.08)', borderRadius: '18px', padding: '24px' }}>
                <div style={{ width: '46px', height: '46px', flexShrink: 0, borderRadius: '12px', background: 'rgba(26,86,219,.16)', color: '#7aa7ff', display: 'grid', placeItems: 'center' }}><Icon name={e.icon} size={22} /></div>
                <div><div style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>{e.title}</div><p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#96a2ba', margin: '6px 0 0' }}>{e.text}</p></div>
              </DataReveal>
            ))}
          </div>
          <DataReveal style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '32px' }}>
            {techStack.map((name, i) => (
              <span key={i} style={{ fontSize: '12.5px', fontWeight: 700, color: '#cdd8ec', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '999px', padding: '9px 16px' }}>{name}</span>
            ))}
          </DataReveal>
        </div>
      </section>

      {/* 8. OUR VALUES */}
      <section className="sec" style={{ background: 'linear-gradient(180deg,#fff 0%,#eff5ff 100%)' }}>
        <div className="wrap" style={{ maxWidth: '1100px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{tx('valuesEyebrow', 'How We Work')}</DataReveal>
            <DataReveal as="h2" className="h2">{tx('valuesHeading', 'Our Values')}</DataReveal>
          </div>
          <div className="four-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px', marginTop: '48px' }}>
            {values.map((v, i) => (
              <DataReveal key={i} className="card-lift" style={{ position: 'relative', background: '#fff', border: '1px solid #eaeef5', borderRadius: '20px', padding: '28px 24px', overflow: 'hidden', boxShadow: '0 16px 40px -30px rgba(15,23,41,.2)' }}>
                <span aria-hidden="true" style={{ position: 'absolute', top: '18px', right: '20px', fontSize: '13px', fontWeight: 700, color: '#dbe4f3' }}>{String(i + 1).padStart(2, '0')}</span>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg,#1a56db,#4b8bff)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 14px 26px -10px rgba(26,86,219,.55)', animation: 'abValFloat 5s ease-in-out infinite' }}><Icon name={v.icon} size={24} /></div>
                <div style={{ fontSize: '16.5px', fontWeight: 700, marginTop: '18px', lineHeight: 1.25 }}>{v.title}</div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#5b6472', margin: '8px 0 0' }}>{v.text}</p>
              </DataReveal>
            ))}
          </div>
          <DataReveal as="p" style={{ textAlign: 'center', fontSize: '12px', color: '#9aa4b6', margin: '24px 0 0' }}>{tx('valuesNote', 'Values to be confirmed with leadership')}</DataReveal>
        </div>
      </section>

      {/* 9. PEOPLE & NETWORK */}
      <section className="sec" style={{ background: 'var(--tint)', borderTop: '1px solid #eef1f6' }}>
        <div className="wrap" style={{ maxWidth: '1160px' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{tx('netEyebrow', 'The People & Network Behind Align')}</DataReveal>
            <DataReveal as="h2" className="h2">{tx('netHeading', 'The people who make it work.')}</DataReveal>
          </div>
          <div className="hub-grid">
            {network.map((n, i) => (
              <DataReveal key={i} as={SmartLink} href={n.href} className="hub-card">
                <div className="hub-card__rail" style={{ background: n.accent }} />
                <div className="hub-card__ic" style={{ overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: n.src ? `url(${n.src})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,rgba(26,86,219,.1),rgba(15,23,41,.3))' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: n.ink || n.accent, background: n.tint, borderRadius: '999px', padding: '5px 11px' }}>{n.tag}</span>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f1729', marginTop: '10px' }}>{n.title}</div>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#5b6472', margin: '6px 0 0' }}>{n.text}</p>
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
          <h2 style={{ position: 'relative', fontSize: 'clamp(26px,3.5vw,36px)', lineHeight: 1.22, letterSpacing: '-.8px', fontWeight: 800, color: '#fff', margin: '0 auto', maxWidth: '820px' }}>{tx('ctaHeading', "Let's talk about innovative solutions, business automation and how we can help you achieve your business goals.")}</h2>
          <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: '#fff', color: '#1a56db', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px' }}>{tx('ctaPrimary', "Let's talk")}</SmartLink>
            <SmartLink href="/contact-us.html" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,.4)' }}>{tx('ctaSecondary', 'Get Info')}</SmartLink>
          </div>
        </DataReveal>
      </section>
    </main>
  );
}
