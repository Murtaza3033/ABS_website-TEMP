import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/our-team.css';
import SmartLink from '../../components/SmartLink';
import CountUp from './CountUp';
import ParticleCanvas from './ParticleCanvas';
import LeaderScene from './LeaderScene';
import { useTeam, usePage } from '../../hooks/useCms';
import { loc } from '../../lib/loc';
import SEO, { resolveSeo } from '../../components/SEO';
import { Icon, HERO, LEADERS, WAY, SEN, ROLES, PAL } from './teamData';

const SPINE_PATH = 'M18,12 C70,180 20,340 72,480 C24,620 74,760 30,900 C33,955 46,984 56,1000';

/* Static LEADERS reshaped to look like a Sanity `teamMember` document list —
   same purpose as OurClients' FALLBACK_CLIENTS: instant placeholderData and
   the safe fallback if the CMS is unreachable or empty. */
const FALLBACK_TEAM = LEADERS.map((L, i) => ({
  _id: `fallback-${i}`,
  name: L.name,
  role: L.role,
  bio: L.quote,
  photoPath: `/assets/images/team/${L.photo}.webp`,
  order: i + 1,
}));

/* Adapter: a Sanity teamMember doc (or FALLBACK_TEAM entry, same shape) only
   covers name/role/bio/photo — LeaderScene also needs caption/tags/c1/c2/c3,
   which have no CMS equivalent. So this MERGES the CMS fields onto the
   matching static LEADERS entry (by position — Sanity was seeded in the same
   order) rather than replacing it outright, keeping LeaderScene untouched. */
function mergeLeader(doc, i, lang) {
  const base = LEADERS[i] || LEADERS[0];
  const photo = doc.photoPath
    ? doc.photoPath.replace(/^.*\//, '').replace(/\.[a-z0-9]+$/i, '')
    : base.photo;
  return {
    ...base,
    name: loc(doc.name, lang) || base.name,
    role: loc(doc.role, lang) || base.role,
    quote: loc(doc.bio, lang) || base.quote,
    photo,
    sanityPhoto: doc.photo,
  };
}

export default function OurTeam() {
  const { t, lang } = useLanguage();
  const { data: cmsPage } = usePage('our-team');
  const seo = resolveSeo(cmsPage?.seo, lang);
  const { data: cmsTeam } = useTeam({ fallbackData: FALLBACK_TEAM });
  const leaders = (cmsTeam && cmsTeam.length > 0 ? cmsTeam : FALLBACK_TEAM).map((doc, i) => mergeLeader(doc, i, lang));
  const secRefs = useRef([]);
  const fillRef = useRef(null);
  const pathRef = useRef(null);
  const svgRef = useRef(null);
  const revealedRef = useRef(Array(9).fill(false));
  const activeRef = useRef(0);
  const hiddenRef = useRef(false);
  const [revealed, setRevealed] = useState(() => Array(9).fill(false));
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
      secRefs.current.forEach((s, i) => {
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
      secRefs.current.forEach((s, i) => {
        if (!s) return;
        const r = s.getBoundingClientRect();
        const c = window.scrollY + r.top + r.height / 2;
        const d = Math.abs(c - vc);
        if (d < bd) { bd = d; best = i; }
      });
      if (best !== activeRef.current) { activeRef.current = best; setActiveIdx(best); }
      if (svgRef.current) svgRef.current.style.opacity = best === 3 ? '0.35' : '1';

      const last = secRefs.current[8];
      const hide = last ? last.getBoundingClientRect().top < vh * 0.28 : false;
      if (hide !== hiddenRef.current) { hiddenRef.current = hide; setSpineHidden(hide); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(scan); };
    scan();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

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
      <svg ref={svgRef} data-spine-svg viewBox="0 0 100 1000" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none', transition: 'opacity .4s ease' }}>
        <path d={SPINE_PATH} fill="none" stroke="rgba(143,184,255,.35)" strokeWidth="0.9" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px rgba(143,184,255,.35))' }} />
        <path ref={pathRef} d={SPINE_PATH} pathLength="100" fill="none" stroke="#8fb8ff" strokeWidth="0.7" strokeLinecap="round" style={{ strokeDasharray: 100, strokeDashoffset: 100, filter: 'drop-shadow(0 0 7px rgba(143,184,255,.75))' }} />
      </svg>

      <ParticleCanvas />

      {/* spine nav */}
      <nav className="tSpine" aria-label="Section navigation" style={{ opacity: spineHidden ? 0 : 1, transform: spineHidden ? 'translateY(-50%) translateX(-40px)' : 'translateY(-50%) translateX(0)', pointerEvents: spineHidden ? 'none' : 'auto' }}>
        <span className="rail"><i ref={fillRef} style={{ height: '0%' }} /></span>
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <button key={n} className="spineBtn" onClick={() => jumpTo(n)} style={{ color: activeIdx === n ? '#4b8bff' : '#5f6f8c' }}>{String(n).padStart(2, '0')}</button>
        ))}
      </nav>

      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* HERO */}
        <section ref={setSec(0)} className={tin(0)} style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 32px 80px', position: 'relative' }}>
          <span className="anim" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '3px', color: '#7aa7ff', textTransform: 'uppercase' }}>{t("Our Team")}</span>
          <h1 className="anim" style={{ fontSize: 'clamp(40px,7vw,62px)', lineHeight: 1.05, letterSpacing: '-1.8px', fontWeight: 800, margin: '18px 0 0', maxWidth: '900px', color: '#fff' }}>{t("The Minds Behind")} <span style={{ fontFamily: 'var(--font-hand)', fontWeight: 700, fontSize: '1.24em', color: '#4b8bff', letterSpacing: 0 }}>{t("Innovation")}</span></h1>
          <p className="anim" style={{ fontSize: '19px', lineHeight: 1.6, color: '#96a2ba', margin: '24px auto 0', maxWidth: '600px' }}>{t("Meet the passionate leaders and talented professionals building powerful enterprise solutions that drive businesses forward.")}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, marginTop: '40px', border: '1px solid rgba(255,255,255,.1)', borderRadius: '20px', overflow: 'hidden', background: 'rgba(255,255,255,.03)', animation: 'tmFloat1 7s ease-in-out infinite' }}>
            {HERO.map((h) => (
              <div key={h[2]} style={{ padding: '20px 28px', borderRight: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', letterSpacing: '-.5px' }}><CountUp end={+h[0]} suffix={h[1]} /></div>
                <div style={{ fontSize: '11.5px', color: '#96a2ba', marginTop: '3px' }}>{t(h[2])}</div>
              </div>
            ))}
          </div>
          <div className="anim" style={{ fontSize: '10.5px', color: '#5f6f8c', marginTop: '12px', letterSpacing: '.5px' }}>{t("Figures indicative — pending confirmation")}</div>
          <button className="anim" onClick={() => jumpTo(1)} style={{ display: 'inline-block', marginTop: '30px', background: '#1a56db', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '14px 30px', border: 'none', borderRadius: '999px', cursor: 'pointer', boxShadow: '0 16px 34px -12px rgba(26,86,219,.6)' }}>{t("Explore Our Team ↓")}</button>
          <div className="anim" style={{ marginTop: '46px' }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7aa7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'tmScrollCue 1.8s ease-in-out infinite' }}><path d="M12 5v13" /><path d="M6 12l6 6 6-6" /></svg></div>
        </section>

        {/* LEADERS */}
        {leaders.map((L, k) => (
          <LeaderScene key={L.num} L={L} i={k} even={k % 2 === 0} revealed={revealed[k + 1]} refCb={setSec(k + 1)} />
        ))}

        {/* THE ALIGN WAY */}
        <section ref={setSec(5)} className={tin(5)} style={{ padding: '110px 32px', position: 'relative' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
              <span className="anim" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: '#7aa7ff', textTransform: 'uppercase' }}>{t("How This Team Works")}</span>
              <h2 className="anim" style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.1, letterSpacing: '-1px', fontWeight: 800, margin: '14px 0 0', color: '#fff' }}>{t("The Align Way.")}</h2>
              <p className="anim" style={{ fontSize: '16.5px', lineHeight: 1.7, color: '#96a2ba', margin: '16px auto 0', maxWidth: '560px' }}>{t("Four principles the whole team is built around — the reason our software ships fast and holds up in production.")}</p>
            </div>
            <div className="aw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px', marginTop: '52px' }}>
              {WAY.map((w) => (
                <div key={w[0]} className="awCard anim">
                  <span className="awNum">{w[0]}</span>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg,#1a56db,#4b8bff)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 14px 26px -10px rgba(26,86,219,.55)' }}><Icon name={w[2]} size={24} /></div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginTop: '18px', letterSpacing: '-.3px' }}>{t(w[1])}</div>
                  <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#96a2ba', margin: '8px 0 0' }}>{t(w[3])}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SENIOR LEADERSHIP */}
        <section ref={setSec(6)} className={tin(6)} style={{ background: 'var(--tint)', color: '#0f1729', padding: '100px 32px', position: 'relative', zIndex: 3 }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
              <span className="anim" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: '#1a56db', textTransform: 'uppercase' }}>{t("Senior Leadership")}</span>
              <h2 className="anim" style={{ fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.1, letterSpacing: '-1px', fontWeight: 800, margin: '14px 0 0' }}>{t("The team steering every build.")}</h2>
            </div>
            <div className="grid5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '16px', marginTop: '44px' }}>
              {SEN.map((s) => (
                <div key={s[1]} className="anim" style={{ background: '#fff', border: '1px solid #eaeef5', borderRadius: '18px', padding: '22px 18px', textAlign: 'center', boxShadow: '0 16px 40px -30px rgba(15,23,41,.28)' }}>
                  <div style={{ width: '64px', height: '64px', margin: '0 auto', borderRadius: '50%', background: 'linear-gradient(135deg,#e8effc,#dbe6ff)', display: 'grid', placeItems: 'center', color: '#1a56db', fontWeight: 800, fontSize: '20px' }}>{s[0]}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '14px', color: '#b3bccb', letterSpacing: '.5px' }}>{t("NAME TBD")}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a56db', marginTop: '4px', lineHeight: 1.3 }}>{t(s[1])}</div>
                  <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#5b6472', margin: '8px 0 0' }}>{t(s[2])}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AMAZING TEAM */}
        <section ref={setSec(7)} className={tin(7)} style={{ background: '#fff', color: '#0f1729', padding: '100px 32px', position: 'relative', zIndex: 3 }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
              <span className="anim" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: '#1a56db', textTransform: 'uppercase' }}>{t("Our Amazing Team")}</span>
              <h2 className="anim" style={{ fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.1, letterSpacing: '-1px', fontWeight: 800, margin: '14px 0 0' }}>{t("The people who make it work.")}</h2>
            </div>
            <div className="grid6" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '14px', marginTop: '44px' }}>
              {ROLES.map((r, i) => {
                const c = PAL[i % PAL.length];
                return (
                  <div key={r} className="anim" style={{ background: 'var(--tint)', border: '1px solid #eaeef5', borderRadius: '16px', padding: '18px 12px', textAlign: 'center' }}>
                    <div style={{ width: '52px', height: '52px', margin: '0 auto', borderRadius: '50%', background: c[0], display: 'grid', placeItems: 'center', color: c[1], fontWeight: 800, fontSize: '16px' }}>—</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '10px', color: '#b3bccb' }}>{t("NAME TBD")}</div>
                    <div style={{ fontSize: '11px', color: '#5b6472', marginTop: '2px' }}>{t(r)}</div>
                  </div>
                );
              })}
            </div>
            <p className="anim" style={{ textAlign: 'center', fontSize: '17px', lineHeight: 1.6, color: '#4b5565', margin: '40px auto 0', maxWidth: '600px' }}>{t("Together we build the technology that transforms businesses and creates a better tomorrow.")}</p>
          </div>
        </section>

        {/* CLOSING */}
        <section ref={setSec(8)} className={tin(8)} style={{ padding: '120px 32px', textAlign: 'center', position: 'relative' }}>
          <h2 className="anim" style={{ fontSize: 'clamp(34px,5vw,48px)', lineHeight: 1.08, letterSpacing: '-1.4px', fontWeight: 800, color: '#fff', margin: '0 auto', maxWidth: '760px' }}>{t("Together, we build")} <span style={{ fontFamily: 'var(--font-hand)', color: '#4b8bff', fontSize: '1.12em' }}>{t("the future.")}</span></h2>
          <div className="anim" style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '34px', flexWrap: 'wrap' }}>
            <SmartLink href="/contact-us.html" style={{ background: '#1a56db', color: '#fff', fontSize: '15px', fontWeight: 700, padding: '15px 32px', borderRadius: '999px', boxShadow: '0 16px 34px -12px rgba(26,86,219,.6)' }}>{t("Let's talk")}</SmartLink>
            <SmartLink href="/contact-us.html" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: '15px', fontWeight: 600, padding: '15px 32px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,.4)' }}>{t("Get Info")}</SmartLink>
          </div>
        </section>
      </main>
    </div>
  );
}
