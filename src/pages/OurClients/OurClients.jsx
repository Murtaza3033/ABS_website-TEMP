import { Fragment, useState, useEffect, useLayoutEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import CountUp from '../../components/CountUp';
import ClientWall from './ClientWall';
import Sectors from './Sectors';
import TrackRecord from './TrackRecord';
import SEO, { resolveSeo } from '../../components/SEO';
import { usePage, useClientsPage } from '../../hooks/useCms';
import { locT } from '../../lib/loc';
import { headWords, splitHighlight } from '../../lib/headWords';
import { TRUSTLINE } from './clientsData';

const HEAD = ['The', 'businesses', "we're", 'proud', 'to', 'work', 'with.'];

export default function OurClients() {
  const { t, lang } = useLanguage();
  const { data: cmsPage } = usePage('our-clients');
  const seo = resolveSeo(cmsPage?.seo, lang);
  /* Trust line, track record and industry cards are editable in Sanity
     ("Our Clients page" singleton); the built-in copy is the fallback. */
  const { data: cms } = useClientsPage();
  const tl = cms?.trustline;
  const tx = (k) => locT(tl?.[k], lang, t) || t(TRUSTLINE[k]);
  const num = (k) => (Number.isFinite(tl?.[k]) ? tl[k] : TRUSTLINE[k]);
  const txt = (k, fallback) => locT(cms?.[k], lang, t) || t(fallback);
  const heading = locT(cms?.heroHeading, lang, t);
  const heroWords = heading
    ? headWords(heading, locT(cms?.heroHighlight, lang, t))
    : HEAD.map((w) => (w === 'proud' ? { w: t('proud'), hl: true, pre: '', post: '' } : { w: t(w) }));
  const secHeading = locT(cms?.sectorsHeading, lang, t);
  const [secA, secHl, secB] = secHeading
    ? splitHighlight(secHeading, locT(cms?.sectorsHighlight, lang, t))
    : [`${t('One system.')} `, t('Six'), ` ${t('industries.')}`];
  const [play, setPlay] = useState(false);

  useLayoutEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = 'var(--white)';
    return () => { document.body.style.background = prev; };
  }, []);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPlay(true); return undefined; }
    const id = setTimeout(() => setPlay(true), 120);
    return () => clearTimeout(id);
  }, []);

  const hw = `hw${play ? ' play' : ''}`;

  return (
    <main>
      <SEO
        {...seo}
        title={seo.title || t('Our Clients')}
        description={seo.description || txt('heroText', "Every name here chose to trust us with the systems their business runs on. Their growth is the story we're proudest of — and the reason we keep building.")}
      />
      {/* HERO */}
      <section className="sec" style={{ position: 'relative', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', padding: '80px 32px 46px', overflow: 'hidden' }}>
        <div className="dotfield" />
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: '920px', height: '520px', background: 'radial-gradient(ellipse at center,rgba(26,86,219,.09),transparent 62%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 className="h1" data-headline>
            {heroWords.map((x, i) => (
              <Fragment key={i}>
                <span className={hw} style={{ animationDelay: `${i * 85}ms` }}>
                  {x.hl ? <>{x.pre}<span className="cave cave-sp" style={{ fontSize: '1.22em' }}>{x.w}</span>{x.post}</> : x.w}
                </span>
                {i < heroWords.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </h1>
          <DataReveal as="p" className="lede" style={{ margin: '20px auto 0', maxWidth: '600px' }}>{txt('heroText', "Every name here chose to trust us with the systems their business runs on. Their growth is the story we're proudest of — and the reason we keep building.")}</DataReveal>
          <DataReveal className="oc-trustline">
            <span>{tx('businessesBefore')} <b><CountUp end={num('businessesCount')} duration={1400} /></b>{tx('businessesAfter')}</span>
            <span className="tdot" />
            <span>{tx('industriesBefore')} <b>{num('industriesCount')}</b> {tx('industriesAfter')}</span>
            <span className="tdot" />
            <span><b>{tl?.inhouseValue || TRUSTLINE.inhouseValue}</b> {tx('inhouseAfter')}</span>
          </DataReveal>
        </div>
      </section>

      {/* CLIENT WALL */}
      <section className="sec" style={{ background: '#fff', padding: '40px 32px 90px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ClientWall cms={cms} />
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="sec" style={{ background: 'linear-gradient(180deg,#fff 0%,#f4f8ff 100%)', borderTop: '1px solid #eef1f6', padding: '96px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '660px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{txt('sectorsEyebrow', 'Across every sector')}</DataReveal>
            <DataReveal as="h2" className="h2">{secA}{secHl ? <span className="cave" style={{ fontSize: '1.3em' }}>{secHl}</span> : null}{secB}</DataReveal>
            <DataReveal as="p" style={{ fontSize: '16px', lineHeight: 1.65, color: '#4b5565', margin: '16px 0 0' }}>{txt('sectorsText', 'From factory floors to pharmacies to solar rooftops — the businesses that trust us span the breadth of how the country actually works. Every one of them connects back to a single place.')}</DataReveal>
          </div>
          <Sectors cms={cms?.sectors} />
        </div>
      </section>

      {/* BY THE NUMBERS */}
      <section className="sec" style={{ background: '#0f1729', position: 'relative', overflow: 'hidden', padding: '90px 32px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%,rgba(26,86,219,.26),transparent 58%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
        <div style={{ maxWidth: '1060px', margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow light">{locT(cms?.trackEyebrow, lang, t) || t("The track record")}</DataReveal>
            <DataReveal as="h2" className="h2" style={{ color: '#fff' }}>{locT(cms?.trackHeading, lang, t) || t("Trust, by the numbers.")}</DataReveal>
          </div>
          <TrackRecord cms={cms?.stats} caption={locT(cms?.trackMarqueeCaption, lang, t)} />
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="sec" style={{ background: '#fff', padding: '90px 32px 110px' }}>
        <DataReveal style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg,#1a56db,#123f9e)', borderRadius: '28px', padding: '66px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <div style={{ position: 'relative', fontFamily: 'var(--font-hand)', fontSize: '26px', fontWeight: 700, color: '#9fc0ff' }}>{txt('ctaKicker', 'Join the businesses that grow with Align.')}</div>
          <h2 style={{ position: 'relative', fontSize: 'clamp(24px,3.4vw,33px)', lineHeight: 1.22, letterSpacing: '-.8px', fontWeight: 800, color: '#fff', margin: '10px auto 0', maxWidth: '820px' }}>{txt('ctaHeading', "Let's talk about innovative solutions, business automation and how we can help you achieve your business goals.")}</h2>
          <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: '#fff', color: '#1a56db', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px' }}>{txt('ctaPrimary', "Let's talk")}</SmartLink>
            <SmartLink href="/contact-us.html" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,.4)' }}>{txt('ctaSecondary', 'Get Info')}</SmartLink>
          </div>
        </DataReveal>
      </section>
    </main>
  );
}
