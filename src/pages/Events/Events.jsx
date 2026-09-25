import { Fragment, useState, useEffect, useLayoutEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/events.css';
import BaseReveal from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import Gallery from './Gallery';
import { useEvent, usePage } from '../../hooks/useCms';
import { getSanityImageUrl } from '../../lib/sanity';
import SEO, { resolveSeo } from '../../components/SEO';
import { GALLERY, WHY } from './eventsData';

function Reveal({ children, ...props }) {
  return <BaseReveal data-reveal="" baseClass="" shownClass="in" {...props}>{children}</BaseReveal>;
}

const HEAD = ['Where', "you'll", 'find us', '—', 'out', 'in', 'the', 'industry.'];

/* Static gallery paths reshaped as a Sanity `event` fallback — same adapter
   as Gallery.jsx (kept local to each component rather than shared, since both
   are small and independent). */
const FALLBACK_GALLERY_PATHS = GALLERY.map(([file, ext]) => `/assets/images/about/${file}.${ext}`);

function mergeGallery(paths, sanityImages) {
  return GALLERY.map((base, i) => {
    const path = paths?.[i];
    const sanityImage = sanityImages?.[i];
    if (!path) return [...base, sanityImage];
    const m = path.match(/\/([^/]+)\.([a-zA-Z0-9]+)$/);
    return m ? [m[1], m[2], base[2], base[3], sanityImage] : [...base, sanityImage];
  });
}

export default function Events() {
  const { t, lang } = useLanguage();
  const { data: cmsPage } = usePage('events');
  const seo = resolveSeo(cmsPage?.seo, lang);
  const { data: cmsEvent } = useEvent('itcn-asia-2023', {
    fallbackData: { _id: 'fallback-event', galleryPaths: FALLBACK_GALLERY_PATHS },
  });
  const gallery = mergeGallery(cmsEvent?.galleryPaths, cmsEvent?.gallery);
  const gsrc = (i) => getSanityImageUrl(gallery[i][4], { width: 900 }) || `/assets/images/about/${gallery[i][0]}.${gallery[i][1]}`;
  const [play, setPlay] = useState(false);
  const [mk, setMk] = useState(0); // hero montage index

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
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => setMk((k) => (k + 1) % gallery.length), 4200);
    return () => clearInterval(id);
  }, []);

  const hw = `hw${play ? ' play' : ''}`;

  return (
    <main>
      <SEO
        {...seo}
        title={seo.title || t('Events')}
        description={seo.description || t("We show up where our industry gathers — exhibitions, conferences and the rooms where businesses meet the people building their tools.")}
      />
      {/* HERO */}
      <section className="sec" style={{ position: 'relative', background: 'linear-gradient(180deg,var(--tint) 0%,#fff 100%)', padding: '80px 32px 44px', overflow: 'hidden', isolation: 'isolate' }}>
        <div className="evMontage">
          {gallery.map((g, i) => (
            <span key={g[0]} className={i === mk ? 'on' : ''} style={{ backgroundImage: `url('${gsrc(i)}')` }} />
          ))}
        </div>
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: '920px', height: '520px', background: 'radial-gradient(ellipse at center,rgba(26,86,219,.08),transparent 62%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 className="h1" data-headline>
            {HEAD.map((w, i) => (
              <Fragment key={i}>
                <span className={hw} style={{ animationDelay: `${i * 80}ms` }}>
                  {w === 'find us' ? <span className="cave" style={{ fontSize: '1.2em' }}>{t("find us")}</span> : t(w)}
                </span>
                {i < HEAD.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </h1>
          <Reveal as="p" className="lede" style={{ margin: '22px auto 0', maxWidth: '600px' }}>{t("We show up where our industry gathers — exhibitions, conferences and the rooms where businesses meet the people building their tools. Here's where we've been.")}</Reveal>
          <Reveal className="evt-trustline">
            <span>{t("Exhibitions")}</span><span className="tdot" /><span>{t("Conferences")}</span><span className="tdot" /><span>{t("Live demos")}</span><span className="tdot" /><span>{t("Real conversations")}</span>
          </Reveal>
          <Reveal className="evt-scrollcue">{t("Explore")}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></Reveal>
        </div>
      </section>

      {/* FEATURED EVENT + LIGHTBOX */}
      <Gallery />

      {/* WHY WE SHOW UP */}
      <section className="sec" style={{ background: 'linear-gradient(180deg,var(--tint) 0%,#eef4ff 100%)', borderTop: '1px solid #eef1f6' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <Reveal as="span" className="eyebrow">{t("Why we show up")}</Reveal>
            <Reveal as="h2" className="h2">{t("The best conversations happen")} <span className="cave" style={{ fontSize: '1.3em' }}>{t("in person")}</span>.</Reveal>
            <Reveal as="p" style={{ fontSize: '16px', lineHeight: 1.7, color: '#4b5565', margin: '16px 0 0' }}>{t("Software is built for people, and people are easiest to understand face to face. We go to industry events to meet businesses where they are, hear the operational headaches firsthand, and build relationships that outlast any screen.")}</Reveal>
          </div>
          <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '26px', marginTop: '46px' }}>
            {WHY.map((c) => (
              <Reveal key={c[0]} className="evWhy" style={{ background: '#fff', border: '1px solid #eef2f8', borderRadius: '22px', overflow: 'hidden', boxShadow: '0 22px 52px -32px rgba(15,23,41,.3)' }}>
                <div className="evVisual" style={{ overflow: 'hidden' }}>
                  <div className="evShot" style={{ width: '100%', paddingBottom: '46%', backgroundImage: `url('/assets/images/events/${c[5]}.png')`, backgroundSize: 'cover', backgroundPosition: 'center top' }} />
                </div>
                <div style={{ padding: '24px 26px 26px' }}>
                  <div style={{ fontSize: '19px', fontWeight: 700, color: '#0f1729' }}>{t(c[0])}</div>
                  <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#5b6472', margin: '9px 0 0' }}>{t(c[1])}</p>
                  <SmartLink href={c[3]} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: '16px', fontSize: '14px', fontWeight: 700, color: '#1a56db' }}>{c[2]} <span className="evArrow">→</span></SmartLink>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING */}
      <section className="sec" style={{ background: '#fff', padding: '76px 32px' }}>
        <Reveal style={{ position: 'relative', maxWidth: '820px', margin: '0 auto', border: '1px dashed #cddaf0', borderRadius: '22px', padding: '40px 36px', textAlign: 'center', overflow: 'hidden', background: 'var(--tint)' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/images/about/booth-team.png')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(247,250,255,.62),rgba(247,250,255,.82))' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: '#1a56db', textTransform: 'uppercase' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#1a56db', animation: 'evDot 1.8s ease-in-out infinite' }} />{t("What's next")}</div>
            <h3 style={{ fontSize: '24px', fontWeight: 700, margin: '14px 0 0', letterSpacing: '-.5px' }}>{t("Planning our next appearance.")}</h3>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#4b5565', margin: '10px auto 0', maxWidth: '520px' }}>{t("We'll be back on the floor before long. Follow us on LinkedIn to hear where we're headed next — and come say hello.")}</p>
            <a href="https://www.linkedin.com/company/align-business-systems" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '22px', background: '#1a56db', color: '#fff', fontSize: '14.5px', fontWeight: 600, padding: '13px 26px', borderRadius: '999px', boxShadow: '0 12px 28px -10px rgba(26,86,219,.5)' }}>{t("Follow on LinkedIn →")}</a>
          </div>
        </Reveal>
      </section>

      {/* CLOSING CTA */}
      <section className="sec" style={{ background: '#fff', padding: '20px 32px 110px' }}>
        <Reveal style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg,#1a56db,#123f9e)', borderRadius: '28px', padding: '66px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <div style={{ position: 'relative', fontFamily: 'var(--font-hand)', fontSize: '26px', fontWeight: 700, color: '#9fc0ff' }}>{t("Couldn't catch us at an event? The conversation is always open.")}</div>
          <h2 style={{ position: 'relative', fontSize: 'clamp(24px,3.4vw,33px)', lineHeight: 1.22, letterSpacing: '-.8px', fontWeight: 800, color: '#fff', margin: '10px auto 0', maxWidth: '820px' }}>{t("Let's talk about innovative solutions, business automation and how we can help you achieve your business goals.")}</h2>
          <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: '#fff', color: '#1a56db', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px' }}>{t("Let's talk")}</SmartLink>
            <SmartLink href="/contact-us.html" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,.4)' }}>{t("Get Info")}</SmartLink>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
