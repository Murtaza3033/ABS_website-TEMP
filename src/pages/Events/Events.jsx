import { Fragment, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { DataReveal } from '../../components/Reveal';
import SmartLink from '../../components/SmartLink';
import Gallery from './Gallery';
import { useEvents, useEventsPage, usePage } from '../../hooks/useCms';
import { useContactInfo } from '../../hooks/useContactInfo';
import { locT } from '../../lib/loc';
import { cmsPic, cssUrl } from '../../lib/cmsImage';
import SEO, { resolveSeo } from '../../components/SEO';
import { WHY, FALLBACK_EVENTS, sortEvents, toEvent } from './eventsData';

const HEAD = ['Where', "you'll", 'find us', '—', 'out', 'in', 'the', 'industry.'];
const HERO_TAGS = ['Exhibitions', 'Conferences', 'Live demos', 'Real conversations'];
const LINKEDIN = 'https://www.linkedin.com/company/align-business-systems';

/* Heading words for the staggered reveal: the CMS heading split into words,
   with the highlight phrase (if it occurs in it) kept as one word. */
function headWords(heading, highlight) {
  const words = (s) => s.split(/\s+/).filter(Boolean).map((w) => ({ w }));
  const at = highlight ? heading.indexOf(highlight) : -1;
  if (at < 0) return words(heading);
  return [...words(heading.slice(0, at)), { w: highlight, hl: true }, ...words(heading.slice(at + highlight.length))];
}

export default function Events() {
  const { t, lang } = useLanguage();
  const { data: cmsPage } = usePage('events');
  const seo = resolveSeo(cmsPage?.seo, lang);
  /* Page texts/photos: "Events page" singleton. Events: every Event document
     (featured = ticked "Featured", else the newest); the built-in ITCN Asia
     2023 event while loading / if the CMS is empty or unreachable. Photos
     have no source until the CMS answers (lib/cmsImage.js). */
  const pageQuery = useEventsPage();
  const cms = pageQuery.data;
  const pagePic = cmsPic(pageQuery);
  const tx = (k, fallback) => locT(cms?.[k], lang, t) || t(fallback);
  const eventsQuery = useEvents({ fallbackData: FALLBACK_EVENTS });
  const evPic = cmsPic(eventsQuery);
  const docs = sortEvents(eventsQuery.data?.length ? eventsQuery.data : FALLBACK_EVENTS);
  const events = docs.map((d) => toEvent(d, { lang, t, pic: evPic }));
  const featured = events.find((e) => e.featured) || events[0];
  const [selectedId, setSelectedId] = useState(null);
  const shown = events.find((e) => e.id === selectedId) || featured;
  const others = events.filter((e) => e !== shown);
  const featRef = useRef(null);
  const openEvent = (id) => {
    setSelectedId(id);
    featRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const { socials } = useContactInfo();
  const linkedin = socials.find((s) => s.platform === 'linkedin')?.url || LINKEDIN;

  const heroWords = cms && locT(cms.heroTitle, lang, t)
    ? headWords(locT(cms.heroTitle, lang, t), locT(cms.heroHighlight, lang, t))
    : HEAD.map((w) => (w === 'find us' ? { w: t('find us'), hl: true } : { w: t(w) }));
  const heroTags = cms?.heroTags?.length ? cms.heroTags.map((x) => locT(x, lang, t)).filter(Boolean) : HERO_TAGS.map((x) => t(x));
  const labels = {
    eyebrow: tx('featuredEyebrow', 'Featured Event'),
    past: tx('pastLabel', 'Exhibited'),
    upcoming: tx('upcomingLabel', 'Upcoming'),
    booth: tx('boothLabel', 'Find us at'),
  };
  const why = cms?.whyCards?.length
    ? cms.whyCards.map((c, i) => ({
      title: locT(c?.title, lang, t), text: locT(c?.text, lang, t), link: locT(c?.linkLabel, lang, t), href: c?.href || '/contact-us.html',
      src: pagePic(c?.image, { width: 1140 }, WHY[i] && `/assets/images/events/${WHY[i][5]}.webp`),
    }))
    : WHY.map((c) => ({ title: t(c[0]), text: t(c[1]), link: t(c[2]), href: c[3], src: pagePic(null, null, `/assets/images/events/${c[5]}.webp`) }));

  // Hero montage: the featured event's photos.
  const montage = featured?.gallery || [];
  const [play, setPlay] = useState(false);
  const [mk, setMk] = useState(0); // hero montage index
  const montageCount = montage.length;

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
    if (montageCount < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => setMk((k) => (k + 1) % montageCount), 4200);
    return () => clearInterval(id);
  }, [montageCount]);

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
          {montage.map((g, i) => (
            <span key={g.key} className={i === mk % montageCount ? 'on' : ''} style={{ backgroundImage: cssUrl(g.src) }} />
          ))}
        </div>
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: '920px', height: '520px', background: 'radial-gradient(ellipse at center,rgba(26,86,219,.08),transparent 62%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 className="h1" data-headline>
            {heroWords.map((x, i) => (
              <Fragment key={i}>
                <span className={hw} style={{ animationDelay: `${i * 80}ms` }}>
                  {x.hl ? <span className="cave" style={{ fontSize: '1.2em' }}>{x.w}</span> : x.w}
                </span>
                {i < heroWords.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </h1>
          <DataReveal as="p" className="lede" style={{ margin: '22px auto 0', maxWidth: '600px' }}>{tx('heroText', "We show up where our industry gathers — exhibitions, conferences and the rooms where businesses meet the people building their tools. Here's where we've been.")}</DataReveal>
          <DataReveal className="evt-trustline">
            {heroTags.map((tag, i) => (
              <Fragment key={tag}>
                {i > 0 && <span className="tdot" />}
                <span>{tag}</span>
              </Fragment>
            ))}
          </DataReveal>
          <DataReveal className="evt-scrollcue">{tx('heroScrollCue', 'Explore')}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></DataReveal>
        </div>
      </section>

      {/* FEATURED (or picked) EVENT + LIGHTBOX */}
      {shown && <Gallery key={shown.id} ev={shown} labels={labels} sectionRef={featRef} />}

      {/* MORE EVENTS — only when there is more than one event */}
      {others.length > 0 && (
        <section className="sec" style={{ background: '#fff', padding: '0 32px 90px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <DataReveal style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
              <span className="eyebrow">{tx('moreEyebrow', 'More events')}</span>
              <span style={{ flex: 1, height: '1px', background: '#e4eaf3' }} />
            </DataReveal>
            <DataReveal as="h2" className="h2" style={{ fontSize: 'clamp(26px,3.4vw,30px)', margin: '0 0 26px' }}>{tx('moreHeading', "Where else we've been.")}</DataReveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,300px),1fr))', gap: '22px' }}>
              {others.map((e) => {
                const excerpt = (e.paragraphs[0] || []).map((r) => r.text).join('');
                return (
                  <DataReveal
                    key={e.id} as="button" type="button" className="evWhy evVisual" onClick={() => openEvent(e.id)}
                    aria-label={`${e.title} — ${t('Show photo')}`}
                    style={{ display: 'block', width: '100%', padding: 0, textAlign: 'start', cursor: 'pointer', font: 'inherit', color: 'inherit', background: '#fff', border: '1px solid #eef2f8', borderRadius: '22px', overflow: 'hidden', boxShadow: '0 22px 52px -32px rgba(15,23,41,.3)' }}
                  >
                    <div style={{ position: 'relative', overflow: 'hidden', background: '#0f1729' }}>
                      <div className="evShot" style={{ width: '100%', paddingBottom: '58%', backgroundImage: cssUrl(e.cover), backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      {e.dateText && <span style={{ position: 'absolute', insetInlineStart: '16px', top: '14px', fontSize: '10.5px', fontWeight: 700, letterSpacing: '1px', color: '#fff', background: 'rgba(15,23,41,.55)', borderRadius: '999px', padding: '6px 12px', textTransform: 'uppercase' }}>{e.dateText}</span>}
                    </div>
                    <div style={{ padding: '20px 22px 22px' }}>
                      {e.location && <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: '#1a56db', textTransform: 'uppercase' }}>{e.location}</div>}
                      <div style={{ fontSize: '19px', fontWeight: 700, color: '#0f1729', marginTop: '8px', lineHeight: 1.25 }}>{e.title}</div>
                      {excerpt && <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#5b6472', margin: '8px 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{excerpt}</p>}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: '14px', fontSize: '14px', fontWeight: 700, color: '#1a56db' }}>{t('See details')} <span className="evArrow">→</span></span>
                    </div>
                  </DataReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* WHY WE SHOW UP */}
      <section className="sec" style={{ background: 'linear-gradient(180deg,var(--tint) 0%,#eef4ff 100%)', borderTop: '1px solid #eef1f6' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <DataReveal as="span" className="eyebrow">{tx('whyEyebrow', "Why we show up")}</DataReveal>
            <DataReveal as="h2" className="h2">{tx('whyHeading', "The best conversations happen")} <span className="cave cave-end" style={{ fontSize: '1.3em' }}>{tx('whyHighlight', "in person")}</span>.</DataReveal>
            <DataReveal as="p" style={{ fontSize: '16px', lineHeight: 1.7, color: '#4b5565', margin: '16px 0 0' }}>{tx('whyText', "Software is built for people, and people are easiest to understand face to face. We go to industry events to meet businesses where they are, hear the operational headaches firsthand, and build relationships that outlast any screen.")}</DataReveal>
          </div>
          <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '26px', marginTop: '46px' }}>
            {why.map((c, i) => (
              <DataReveal key={`${i}-${c.title}`} className="evWhy" style={{ background: '#fff', border: '1px solid #eef2f8', borderRadius: '22px', overflow: 'hidden', boxShadow: '0 22px 52px -32px rgba(15,23,41,.3)' }}>
                <div className="evVisual" style={{ overflow: 'hidden' }}>
                  <div className="evShot" style={{ width: '100%', paddingBottom: '46%', backgroundImage: cssUrl(c.src), backgroundSize: 'cover', backgroundPosition: 'center top' }} />
                </div>
                <div style={{ padding: '24px 26px 26px' }}>
                  <div style={{ fontSize: '19px', fontWeight: 700, color: '#0f1729' }}>{c.title}</div>
                  <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#5b6472', margin: '9px 0 0' }}>{c.text}</p>
                  {c.link && <SmartLink href={c.href} className="tap-pad" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: '16px', fontSize: '14px', fontWeight: 700, color: '#1a56db' }}>{c.link} <span className="evArrow">→</span></SmartLink>}
                </div>
              </DataReveal>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING */}
      <section className="sec" style={{ background: '#fff', padding: '76px 32px' }}>
        <DataReveal style={{ position: 'relative', maxWidth: '820px', margin: '0 auto', border: '1px dashed #cddaf0', borderRadius: '22px', padding: '40px 36px', textAlign: 'center', overflow: 'hidden', background: 'var(--tint)' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: cssUrl(pagePic(cms?.nextImage, { width: 1254 }, '/assets/images/about/booth-team.webp')), backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(247,250,255,.62),rgba(247,250,255,.82))' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: '#1a56db', textTransform: 'uppercase' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#1a56db', animation: 'evDot 1.8s ease-in-out infinite' }} />{tx('nextEyebrow', "What's next")}</div>
            <h3 style={{ fontSize: '24px', fontWeight: 700, margin: '14px 0 0', letterSpacing: '-.5px' }}>{tx('nextHeading', "Planning our next appearance.")}</h3>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#4b5565', margin: '10px auto 0', maxWidth: '520px' }}>{tx('nextText', "We'll be back on the floor before long. Follow us on LinkedIn to hear where we're headed next — and come say hello.")}</p>
            <a href={cms?.nextButtonUrl || linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '22px', background: '#1a56db', color: '#fff', fontSize: '14.5px', fontWeight: 600, padding: '13px 26px', borderRadius: '999px', boxShadow: '0 12px 28px -10px rgba(26,86,219,.5)' }}>{tx('nextButton', "Follow on LinkedIn →")}</a>
          </div>
        </DataReveal>
      </section>

      {/* CLOSING CTA */}
      <section className="sec" style={{ background: '#fff', padding: '20px 32px 110px' }}>
        <DataReveal style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg,#1a56db,#123f9e)', borderRadius: '28px', padding: '66px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <div style={{ position: 'relative', fontFamily: 'var(--font-hand)', fontSize: '26px', fontWeight: 700, color: '#9fc0ff' }}>{tx('ctaKicker', "Couldn't catch us at an event? The conversation is always open.")}</div>
          <h2 style={{ position: 'relative', fontSize: 'clamp(24px,3.4vw,33px)', lineHeight: 1.22, letterSpacing: '-.8px', fontWeight: 800, color: '#fff', margin: '10px auto 0', maxWidth: '820px' }}>{tx('ctaHeading', "Let's talk about innovative solutions, business automation and how we can help you achieve your business goals.")}</h2>
          <div style={{ position: 'relative', display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: '#fff', color: '#1a56db', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px' }}>{tx('ctaPrimary', "Let's talk")}</SmartLink>
            <SmartLink href="/contact-us.html" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,.4)' }}>{tx('ctaSecondary', "Get Info")}</SmartLink>
          </div>
        </DataReveal>
      </section>
    </main>
  );
}
