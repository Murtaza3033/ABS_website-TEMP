import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import SmartLink from '../../components/SmartLink';
import CountUp from '../../components/CountUp';
import ParticleCanvas from './ParticleCanvas';
import LeaderScene from './LeaderScene';
import { useTeam, useTeamPage } from '../../hooks/useCms';
import { locT } from '../../lib/loc';
import { cmsPic } from '../../lib/cmsImage';
import SEO, { resolveSeo } from '../../components/SEO';
import { Icon, HERO, WAY, PAL, FALLBACK_TEAM } from './teamData';

const SPINE_PATH = 'M18,12 C70,180 20,340 72,480 C24,620 74,760 30,900 C33,955 46,984 56,1000';

const FALLBACK_BY_ID = Object.fromEntries(FALLBACK_TEAM.map((d) => [d._id, d]));
const groupOf = (doc) => doc.group || FALLBACK_BY_ID[doc._id]?.group || 'team';

/* Scene-ready leader: a Sanity teamMember doc (or FALLBACK_TEAM entry, same
   shape) localized, each empty field falling back to the built-in copy of
   the same seeded person (matched by _id). A leader added in Studio without
   scene extras still gets a full scene (next number, alternating side);
   floating cards without a title are simply not drawn. */
function toLeader(doc, i, lang, t, pic) {
  const fb = FALLBACK_BY_ID[doc._id] || {};
  const tx = (v, f) => locT(v, lang, t) || locT(f, lang, t);
  const card = (c, f, keys) => {
    const src = c && locT(c.title, lang, t) ? c : f;
    if (!src || !locT(src.title, lang, t)) return null;
    const out = { value: Number.isFinite(src.value) ? src.value : 0, bars: (src.bars || []).filter(Number.isFinite) };
    keys.forEach((k) => { out[k] = locT(src[k], lang, t); });
    return out;
  };
  return {
    _id: doc._id || `leader-${i}`,
    num: String(i + 1).padStart(2, '0'),
    name: tx(doc.name, fb.name),
    role: tx(doc.role, fb.role),
    quote: tx(doc.bio, fb.bio),
    caption: tx(doc.caption, fb.caption),
    photo: pic(doc.photo, { width: 600 }, fb.photoPath) || '',
    tags: (doc.tags?.length ? doc.tags : fb.tags || [])
      .map((tg) => ({ label: locT(tg?.label, lang, t), description: locT(tg?.description, lang, t) }))
      .filter((tg) => tg.label),
    c1: card(doc.card1, fb.card1, ['title', 'label']),
    c2: card(doc.card2, fb.card2, ['title', 'status', 'label']),
    c3: card(doc.card3, fb.card3, ['title', 'trend']),
  };
}

/* Senior / team card: localized texts + avatar (photo, else initials). */
function toCard(doc, lang, t, pic) {
  const fb = FALLBACK_BY_ID[doc._id] || {};
  const tx = (v, f) => locT(v, lang, t) || locT(f, lang, t);
  const name = tx(doc.name, fb.name);
  return {
    _id: doc._id,
    name,
    role: tx(doc.role, fb.role),
    blurb: tx(doc.blurb, fb.blurb),
    initials: doc.initials || fb.initials || '',
    photo: pic(doc.photo, { width: 160, height: 160 }),
    alt: locT(doc.photo?.alt, lang, t) || name,
  };
}

function Avatar({ p }) {
  return p.photo
    ? <img src={p.photo} alt={p.alt} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
    : p.initials;
}

export default function OurTeam() {
  const { t, lang } = useLanguage();
  // <head> title/description: this page's singleton → SEO block, else the built-in copy below.
  const seo = resolveSeo(useTeamPage().data?.seo, lang, t);
  /* People are Sanity "Team Member" docs grouped by their Section field
     (leader / senior / team, each sorted by order); page texts come from the
     "Our Team page" singleton. The built-in copy is the fallback for an
     empty/unreachable CMS and for any field left empty. */
  const teamQuery = useTeam({ fallbackData: FALLBACK_TEAM });
  const cmsTeam = teamQuery.data;
  // Portraits: no source until the CMS answers (lib/cmsImage.js), so the
  // built-in photo is never loaded just to be replaced by the Sanity copy.
  const pic = cmsPic(teamQuery);
  const { data: cms } = useTeamPage();
  const tx = (k, fallback) => locT(cms?.[k], lang, t) || t(fallback);
  const people = cmsTeam?.length ? cmsTeam : FALLBACK_TEAM;
  const leaders = people.filter((d) => groupOf(d) === 'leader').map((d, i) => toLeader(d, i, lang, t, pic));
  const senior = people.filter((d) => groupOf(d) === 'senior').map((d) => toCard(d, lang, t, pic));
  const members = people.filter((d) => groupOf(d) === 'team').map((d) => toCard(d, lang, t, pic));
  const heroStats = cms?.heroStats?.length
    ? cms.heroStats.map((h) => [Number.isFinite(h?.value) ? h.value : 0, h?.suffix || '', locT(h?.label, lang, t)])
    : HERO.map((h) => [+h[0], h[1], t(h[2])]);
  const way = cms?.wayItems?.length
    ? cms.wayItems.map((w) => [locT(w?.title, lang, t), w?.icon || 'spark', locT(w?.text, lang, t)])
    : WAY.map((w) => [t(w[1]), w[2], t(w[3])]);

  /* Sections tracked by the scroll scan / spine: hero, one per leader, The
     Align Way, Senior Leadership and Amazing Team (only when they have
     people), closing CTA. */
  const iWay = leaders.length + 1;
  const iSen = senior.length ? iWay + 1 : -1;
  const iTeam = members.length ? Math.max(iWay, iSen) + 1 : -1;
  const iEnd = Math.max(iWay, iSen, iTeam) + 1;
  const sectionCount = iEnd + 1;
  const spineItems = Array.from({ length: sectionCount }, (_, i) => i);

  const secRefs = useRef([]);
  const fillRef = useRef(null);
  const pathRef = useRef(null);
  const svgRef = useRef(null);
  const revealedRef = useRef([]);
  const activeRef = useRef(0);
  const hiddenRef = useRef(false);
  const [revealed, setRevealed] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [spineHidden, setSpineHidden] = useState(false);

  const setSec = (i) => (el) => { secRefs.current[i] = el; };
  const jumpTo = (i) => secRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useLayoutEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#0f1729';
    return () => { document.body.style.background = prev; };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const scan = () => {
      raf = 0;
      const vh = window.innerHeight;
      let changed = false;
      const secs = secRefs.current.slice(0, sectionCount);
      secs.forEach((s, i) => {
        if (!s || revealedRef.current[i]) return;
        const r = s.getBoundingClientRect();
        if (r.top < vh * 0.78 && r.bottom > vh * 0.1) { revealedRef.current[i] = true; changed = true; }
      });
      if (changed) setRevealed([...revealedRef.current]);

      if (reduce) {
        if (fillRef.current) fillRef.current.style.height = '100%';
        if (pathRef.current) pathRef.current.style.strokeDashoffset = 0;
        return;
      }
      const doc = document.documentElement;
      const max = doc.scrollHeight - vh;
      const prog = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fillRef.current) fillRef.current.style.height = `${prog * 100}%`;
      if (pathRef.current) pathRef.current.style.strokeDashoffset = 100 * (1 - Math.min(1, prog * 1.3));

      const vc = window.scrollY + vh / 2;
      let best = 0; let bd = Infinity;
      secs.forEach((s, i) => {
        if (!s) return;
        const r = s.getBoundingClientRect();
        const c = window.scrollY + r.top + r.height / 2;
        const d = Math.abs(c - vc);
        if (d < bd) { bd = d; best = i; }
      });
      if (best !== activeRef.current) { activeRef.current = best; setActiveIdx(best); }
      if (svgRef.current) svgRef.current.style.opacity = best === 3 ? '0.35' : '1';

      const last = secs[sectionCount - 1];
      const hide = last ? last.getBoundingClientRect().top < vh * 0.28 : false;
      if (hide !== hiddenRef.current) { hiddenRef.current = hide; setSpineHidden(hide); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(scan); };
    scan();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [sectionCount]);

  const tin = (i) => `tsec${revealed[i] ? ' tin' : ''}`;

  return (
    <div data-page-root style={{ position: 'relative', overflow: 'hidden', isolation: 'isolate', background: '#0f1729', color: '#eaf0fb' }}>
      <SEO
        {...seo}
        title={seo.title || t('Our Team')}
        description={seo.description || t('Meet the passionate leaders and talented professionals building powerful enterprise solutions that drive businesses forward.')}
      />
      {/* drifting glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '8%', left: '12%', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,219,.22),transparent 66%)', animation: 'tmGlowDrift 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '52%', right: '6%', width: '460px', height: '460px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,219,.16),transparent 66%)', animation: 'tmGlowDrift 22s ease-in-out 2s infinite' }} />
      </div>
      {/* diagonal spine SVG */}
      <svg ref={svgRef} viewBox="0 0 100 1000" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none', transition: 'opacity .4s ease' }}>
        <path d={SPINE_PATH} fill="none" stroke="rgba(143,184,255,.35)" strokeWidth="0.9" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px rgba(143,184,255,.35))' }} />
        <path ref={pathRef} d={SPINE_PATH} pathLength="100" fill="none" stroke="#8fb8ff" strokeWidth="0.7" strokeLinecap="round" style={{ strokeDasharray: 100, strokeDashoffset: 100, filter: 'drop-shadow(0 0 7px rgba(143,184,255,.75))' }} />
      </svg>

      <ParticleCanvas />

      {/* spine nav */}
      <nav className="tSpine" aria-label={t('Section navigation')} style={{ opacity: spineHidden ? 0 : 1, transform: spineHidden ? `translateY(-50%) translateX(${lang === 'ar' ? 40 : -40}px)` : 'translateY(-50%) translateX(0)', pointerEvents: spineHidden ? 'none' : 'auto' }}>
        <span className="rail"><i ref={fillRef} style={{ height: '0%' }} /></span>
        {/* one item per tracked section (hero, each leader, closing sections)
            so whichever section is centred always has a lit spine item */}
        {spineItems.map((n) => (
          <button key={n} type="button" className="spineBtn" aria-current={activeIdx === n ? 'true' : undefined} onClick={() => jumpTo(n)} style={{ color: activeIdx === n ? '#4b8bff' : '#5f6f8c' }}>{String(n).padStart(2, '0')}</button>
        ))}
      </nav>

      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* HERO */}
        <section ref={setSec(0)} className={tin(0)} style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 32px 80px', position: 'relative' }}>
          <span className="anim" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '3px', color: '#7aa7ff', textTransform: 'uppercase' }}>{tx('heroEyebrow', 'Our Team')}</span>
          <h1 className="anim" style={{ fontSize: 'clamp(40px,7vw,62px)', lineHeight: 1.05, letterSpacing: '-1.8px', fontWeight: 800, margin: '18px 0 0', maxWidth: '900px', color: '#fff' }}>{tx('heroTitle', 'The Minds Behind')} <span style={{ fontFamily: 'var(--font-hand)', fontWeight: 700, fontSize: '1.24em', color: '#4b8bff', letterSpacing: 0 }}>{tx('heroHighlight', 'Innovation')}</span></h1>
          <p className="anim" style={{ fontSize: '19px', lineHeight: 1.6, color: '#96a2ba', margin: '24px auto 0', maxWidth: '600px' }}>{tx('heroText', 'Meet the passionate leaders and talented professionals building powerful enterprise solutions that drive businesses forward.')}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, marginTop: '40px', border: '1px solid rgba(255,255,255,.1)', borderRadius: '20px', overflow: 'hidden', background: 'rgba(255,255,255,.03)', animation: 'tmFloat1 7s ease-in-out infinite' }}>
            {heroStats.map((h, k) => (
              <div key={k} style={{ padding: '20px 28px', borderRight: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', letterSpacing: '-.5px' }}><CountUp end={h[0]} suffix={h[1]} /></div>
                <div style={{ fontSize: '11.5px', color: '#96a2ba', marginTop: '3px' }}>{h[2]}</div>
              </div>
            ))}
          </div>
          <div className="anim" style={{ fontSize: '10.5px', color: '#5f6f8c', marginTop: '12px', letterSpacing: '.5px' }}>{tx('heroStatsNote', 'Figures indicative — pending confirmation')}</div>
          <button className="anim" onClick={() => jumpTo(1)} style={{ display: 'inline-block', marginTop: '30px', background: '#1a56db', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '14px 30px', border: 'none', borderRadius: '999px', cursor: 'pointer', boxShadow: '0 16px 34px -12px rgba(26,86,219,.6)' }}>{tx('heroButton', 'Explore Our Team ↓')}</button>
          <div className="anim" style={{ marginTop: '46px' }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7aa7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'tmScrollCue 1.8s ease-in-out infinite' }}><path d="M12 5v13" /><path d="M6 12l6 6 6-6" /></svg></div>
        </section>

        {/* LEADERS */}
        {leaders.map((L, k) => (
          <LeaderScene key={L._id} L={L} i={k} even={k % 2 === 0} revealed={Boolean(revealed[k + 1])} refCb={setSec(k + 1)} />
        ))}

        {/* THE ALIGN WAY */}
        <section ref={setSec(iWay)} className={tin(iWay)} style={{ padding: '110px 32px', position: 'relative' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
              <span className="anim" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: '#7aa7ff', textTransform: 'uppercase' }}>{tx('wayEyebrow', 'How This Team Works')}</span>
              <h2 className="anim" style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.1, letterSpacing: '-1px', fontWeight: 800, margin: '14px 0 0', color: '#fff' }}>{tx('wayHeading', 'The Align Way.')}</h2>
              <p className="anim" style={{ fontSize: '16.5px', lineHeight: 1.7, color: '#96a2ba', margin: '16px auto 0', maxWidth: '560px' }}>{tx('wayText', 'Four principles the whole team is built around — the reason our software ships fast and holds up in production.')}</p>
            </div>
            <div className="aw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px', marginTop: '52px' }}>
              {way.map((w, k) => (
                <div key={k} className="awCard anim">
                  <span className="awNum">{String(k + 1).padStart(2, '0')}</span>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg,#1a56db,#4b8bff)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 14px 26px -10px rgba(26,86,219,.55)' }}><Icon name={w[1]} size={24} /></div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginTop: '18px', letterSpacing: '-.3px' }}>{w[0]}</div>
                  <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#96a2ba', margin: '8px 0 0' }}>{w[2]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SENIOR LEADERSHIP */}
        {senior.length > 0 && <section ref={setSec(iSen)} className={tin(iSen)} style={{ background: 'var(--tint)', color: '#0f1729', padding: '100px 32px', position: 'relative', zIndex: 3 }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
              <span className="anim" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: '#1a56db', textTransform: 'uppercase' }}>{tx('seniorEyebrow', 'Senior Leadership')}</span>
              <h2 className="anim" style={{ fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.1, letterSpacing: '-1px', fontWeight: 800, margin: '14px 0 0' }}>{tx('seniorHeading', 'The team steering every build.')}</h2>
            </div>
            <div className="grid5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '16px', marginTop: '44px' }}>
              {senior.map((s) => (
                <div key={s._id} className="anim" style={{ background: '#fff', border: '1px solid #eaeef5', borderRadius: '18px', padding: '22px 18px', textAlign: 'center', boxShadow: '0 16px 40px -30px rgba(15,23,41,.28)' }}>
                  <div style={{ width: '64px', height: '64px', margin: '0 auto', borderRadius: '50%', background: 'linear-gradient(135deg,#e8effc,#dbe6ff)', display: 'grid', placeItems: 'center', color: '#1a56db', fontWeight: 800, fontSize: '20px', overflow: 'hidden' }}><Avatar p={s} /></div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '14px', color: '#657085', letterSpacing: '.5px' }}>{s.name}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a56db', marginTop: '4px', lineHeight: 1.3 }}>{s.role}</div>
                  {s.blurb && <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#5b6472', margin: '8px 0 0' }}>{s.blurb}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>}

        {/* AMAZING TEAM */}
        {members.length > 0 && <section ref={setSec(iTeam)} className={tin(iTeam)} style={{ background: '#fff', color: '#0f1729', padding: '100px 32px', position: 'relative', zIndex: 3 }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
              <span className="anim" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: '#1a56db', textTransform: 'uppercase' }}>{tx('teamEyebrow', 'Our Amazing Team')}</span>
              <h2 className="anim" style={{ fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.1, letterSpacing: '-1px', fontWeight: 800, margin: '14px 0 0' }}>{tx('teamHeading', 'The people who make it work.')}</h2>
            </div>
            <div className="grid6" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '14px', marginTop: '44px' }}>
              {members.map((m, i) => {
                const c = PAL[i % PAL.length];
                return (
                  <div key={m._id} className="anim" style={{ background: 'var(--tint)', border: '1px solid #eaeef5', borderRadius: '16px', padding: '18px 12px', textAlign: 'center' }}>
                    <div style={{ width: '52px', height: '52px', margin: '0 auto', borderRadius: '50%', background: c[0], display: 'grid', placeItems: 'center', color: c[1], fontWeight: 800, fontSize: '16px', overflow: 'hidden' }}><Avatar p={m} /></div>
                    <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '10px', color: '#657085' }}>{m.name}</div>
                    <div style={{ fontSize: '11px', color: '#5b6472', marginTop: '2px' }}>{m.role}</div>
                  </div>
                );
              })}
            </div>
            <p className="anim" style={{ textAlign: 'center', fontSize: '17px', lineHeight: 1.6, color: '#4b5565', margin: '40px auto 0', maxWidth: '600px' }}>{tx('teamClosing', 'Together we build the technology that transforms businesses and creates a better tomorrow.')}</p>
          </div>
        </section>}

        {/* CLOSING */}
        <section ref={setSec(iEnd)} className={tin(iEnd)} style={{ padding: '120px 32px', textAlign: 'center', position: 'relative' }}>
          <h2 className="anim" style={{ fontSize: 'clamp(34px,5vw,48px)', lineHeight: 1.08, letterSpacing: '-1.4px', fontWeight: 800, color: '#fff', margin: '0 auto', maxWidth: '760px' }}>{tx('ctaTitle', 'Together, we build')} <span style={{ fontFamily: 'var(--font-hand)', color: '#4b8bff', fontSize: '1.12em' }}>{tx('ctaHighlight', 'the future.')}</span></h2>
          <div className="anim" style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '34px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: '#1a56db', color: '#fff', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px', boxShadow: '0 16px 34px -12px rgba(26,86,219,.6)' }}>{tx('ctaPrimary', "Let's talk")}</SmartLink>
            <SmartLink href="/contact-us.html" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,.4)' }}>{tx('ctaSecondary', 'Get Info')}</SmartLink>
          </div>
        </section>
      </main>
    </div>
  );
}
