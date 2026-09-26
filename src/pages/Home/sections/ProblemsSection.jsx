import { useHome, useScrollRegionProps } from '../HomeContext';
import { useLanguage } from '../../../context/LanguageContext';
import SmartLink from '../../../components/SmartLink';

export default function ProblemsSection() {
  const { b, act, state } = useHome();
  const { t } = useLanguage();
  const scrollRegion = useScrollRegionProps(t('Scrollable preview'));
  const on = state.probOn;
  // CSS vars drive the whole ON/OFF wipe + toggle (was setProb()'s setProperty calls)
  const wVars = {
    '--wOn': on ? '1' : '0',
    '--wOff': on ? '0' : '1',
    '--wLabel': on ? '#1a56db' : '#e5484d',
    '--wTrack': on ? '#1a56db' : '#c9d3e0',
    '--wKnob': on ? 'translateX(29px)' : 'translateX(0)',
  };
  return (
    <>
      <section data-screen-label="Problems We Solve" className="ag" style={{background: '#ffffff', overflow: 'hidden', ...wVars}}>
          <div style={{maxWidth: '1240px', margin: '0 auto', padding: '100px 32px'}}>
            <div data-reveal="0" style={{opacity: '0', transform: 'translateY(24px)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)', maxWidth: '720px', margin: '0 auto', textAlign: 'center'}}>
              <h2 style={{fontSize: '46px', fontWeight: '800', letterSpacing: '-1.8px', margin: '0', lineHeight: '1.06', textWrap: 'pretty'}}>{t("One straight line from")}<br /><span style={{background: 'linear-gradient(100deg,#1a56db 0%,#4b8bff 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{t("chaos to aligned.")}</span></h2>
              <p style={{fontSize: '17px', lineHeight: '1.65', color: '#4b5565', margin: '18px 0 0'}}>{t("Approvals, payroll, field visits, mismatched tools — the daily friction of a growing business. Watch what happens to that journey with Align, and without it.")}</p>
            </div>
      
            <div data-reveal="1" style={{opacity: '0', transform: 'translateY(24px)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginTop: '44px'}}>
              <div style={{position: 'relative', height: '30px', minWidth: '340px', flex: '1'}}>
                <div style={{position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: '700', color: '#1a56db', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease'}}>{t("A single, tracked path — every problem resolved in days.")}</div>
                <div style={{position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: '700', color: '#e5484d', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease'}}>{t("Loops, dead-ends and manual rework — weeks lost, every week.")}</div>
              </div>
              <div style={{display: 'inline-flex', alignItems: 'center', gap: '13px', flexShrink: '0'}}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: '1px'}}>
                  <svg width="11" height="15" viewBox="0 0 11 15" fill="none" style={{animation: 'nudgeR 1.4s ease-in-out 0s infinite'}}><path d="M2 3 L7 7.5 L2 12" stroke="#1a56db" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <svg width="13" height="17" viewBox="0 0 13 17" fill="none" style={{animation: 'nudgeR 1.4s ease-in-out .15s infinite'}}><path d="M2 3.5 L8.5 8.5 L2 13.5" stroke="#1a56db" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <svg width="15" height="19" viewBox="0 0 15 19" fill="none" style={{animation: 'nudgeR 1.4s ease-in-out .3s infinite'}}><path d="M2 4 L10 9.5 L2 15" stroke="#1a56db" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span style={{fontSize: '14.5px', fontWeight: '700', color: 'var(--wLabel,#1a56db)', transition: 'color .35s ease'}}><span>{t(b('togLabel'))}</span></span>
                <button onClick={() => act('toggleAbs')} aria-label={t('Toggle Align on or off')} style={{position: 'relative', width: '62px', height: '33px', border: 'none', borderRadius: '99px', background: 'var(--wTrack,#1a56db)', cursor: 'pointer', transition: 'background .35s ease', padding: '0'}}>
                  <span style={{position: 'absolute', top: '4px', insetInlineStart: '4px', width: '25px', height: '25px', borderRadius: '50%', background: '#ffffff', transform: 'var(--wKnob,translateX(29px))', transition: 'transform .35s cubic-bezier(.5,1.6,.4,1)', boxShadow: '0 2px 7px rgba(15,23,41,.3)'}}></span>
                </button>
              </div>
            </div>
      
            <div className="hm-scale-scroll-wrap" {...scrollRegion} data-reveal="1" style={{opacity: '0', transform: 'translateY(24px)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)', marginTop: '26px', borderRadius: '24px', '--hm-w': '1000px', '--hm-h': '430px'}}>
            <div className="hm-scale-scroll" style={{position: 'relative', background: '#f7faff', border: '1px solid #eef1f6', borderRadius: '24px', height: '430px', overflow: 'hidden'}}>
              <div style={{position: 'absolute', inset: '0', background: 'radial-gradient(ellipse at center,rgba(229,72,77,.1) 0%,rgba(229,72,77,0) 70%)', opacity: 'var(--wOff,0)', transition: 'opacity .5s ease', pointerEvents: 'none'}}></div>
              
              <div style={{position: 'absolute', insetInlineStart: '3.5%', top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none'}}>
                <div style={{width: '16px', height: '16px', borderRadius: '50%', background: '#0f1729', margin: '0 auto', boxShadow: '0 0 0 6px rgba(15,23,41,.08)'}}></div>
                {/* End-point labels are shifted to hang off their node toward the panel's
                    inside (centred on nodes at 3.5% / 95%, the panel edge clipped
                    them: "four business", "ourishin"). Layout box unchanged. */}
                <div style={{fontSize: '11px', fontWeight: '700', color: '#5b6472', marginTop: '8px', whiteSpace: 'nowrap', transform: 'translateX(calc(50% - 8px))'}}>{t("Your business")}</div>
              </div>
              
              <div style={{position: 'absolute', insetInlineStart: '95%', top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none'}}>
                <div style={{position: 'relative', width: '60px', height: '60px', margin: '0 auto'}}>
                  <span style={{position: 'absolute', inset: '0', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease'}}><svg viewBox="0 0 36 36" style={{width: '60px', height: '60px', display: 'block'}}><circle cx="18" cy="18" r="16" fill="#e3f6ec" stroke="#1a9d55" strokeWidth="1.6"/><path d="M11.5 18.5 L16 22.5 L25 13.5" fill="none" stroke="#1a9d55" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <span style={{position: 'absolute', top: '-14px', insetInlineStart: '-12px', width: '20px', height: '20px', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease'}}><svg viewBox="0 0 24 24" style={{width: '100%', height: '100%'}}><path d="M12 2 L13 6 M12 2 L11 6" stroke="#1a9d55" strokeWidth="1.8" strokeLinecap="round"/><path d="M4 6 L6 8 M20 6 L18 8" stroke="#f5b40a" strokeWidth="1.8" strokeLinecap="round"/></svg></span>
                  <span style={{position: 'absolute', inset: '0', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease'}}><svg viewBox="0 0 36 36" style={{width: '60px', height: '60px', display: 'block'}}><circle cx="18" cy="18" r="16" fill="#fdeaea" stroke="#e5484d" strokeWidth="1.6"/><path d="M18 10.5 L18 19" stroke="#e5484d" strokeWidth="2.6" strokeLinecap="round"/><circle cx="18" cy="23.5" r="1.7" fill="#e5484d"/></svg></span>
                </div>
                <div style={{fontSize: '11.5px', fontWeight: '700', color: '#157d44', marginTop: '9px', whiteSpace: 'nowrap', transform: 'translateX(calc(-50% + 30px))', opacity: 'var(--wOn,1)', transition: 'opacity .4s'}}>{t("Aligned & flourishing")}</div>
                <div style={{fontSize: '11.5px', fontWeight: '700', color: '#e5484d', marginTop: '9px', whiteSpace: 'nowrap', position: 'absolute', insetInlineStart: '50%', transform: 'translateX(calc(-100% + 30px))', opacity: 'var(--wOff,0)', transition: 'opacity .4s'}}>{t("Stuck & frustrated")}</div>
              </div>
              
              <svg viewBox="0 0 1000 380" preserveAspectRatio="none" style={{position: 'absolute', inset: '0', width: '100%', height: '100%'}}>
                <defs>
                  <linearGradient id="pgblue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1a56db" /><stop offset="1" stopColor="#4b8bff" /></linearGradient>
                </defs>
                <g style={{opacity: 'var(--wOn,1)', transition: 'opacity .5s ease'}}>
                  <path d="M12,192 C110,168 130,168 165,188 C270,214 300,214 400,190 C505,166 545,166 620,190 C735,214 775,214 850,189 C925,176 960,184 988,190" fill="none" stroke="url(#pgblue)" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
                  <circle r="7" fill="#1a56db" vectorEffect="non-scaling-stroke"><animateMotion dur="3.4s" repeatCount="indefinite" rotate="auto" path="M12,192 C110,168 130,168 165,188 C270,214 300,214 400,190 C505,166 545,166 620,190 C735,214 775,214 850,189 C925,176 960,184 988,190"/></circle>
                  <circle r="13" fill="#1a56db" opacity="0.22"><animateMotion dur="3.4s" repeatCount="indefinite" path="M12,192 C110,168 130,168 165,188 C270,214 300,214 400,190 C505,166 545,166 620,190 C735,214 775,214 850,189 C925,176 960,184 988,190"/></circle>
                </g>
                <g style={{opacity: 'var(--wOff,0)', transition: 'opacity .5s ease'}}>
                  <path d="M12,192 C55,70 245,120 165,205 C70,300 120,330 265,300 C405,272 300,110 400,192 C520,262 455,330 560,300 C690,268 545,105 620,188 C745,262 690,330 785,300 C905,266 800,100 850,190 C930,244 945,150 988,192" fill="none" stroke="#e5484d" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="1 9" vectorEffect="non-scaling-stroke" opacity="0.85"/>
                  <path d="M12,192 C55,70 245,120 165,205 C70,300 120,330 265,300 C405,272 300,110 400,192 C520,262 455,330 560,300 C690,268 545,105 620,188 C745,262 690,330 785,300 C905,266 800,100 850,190 C930,244 945,150 988,192" fill="none" stroke="#e5484d" strokeWidth="3.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.35"/>
                  <circle r="7" fill="#e5484d"><animateMotion dur="11s" repeatCount="indefinite" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.7 0 0.3 1" path="M12,192 C55,70 245,120 165,205 C70,300 120,330 265,300 C405,272 300,110 400,192 C520,262 455,330 560,300 C690,268 545,105 620,188 C745,262 690,330 785,300 C905,266 800,100 850,190 C930,244 945,150 988,192"/></circle>
                </g>
              </svg>
              
            <div style={{position: 'absolute', insetInlineStart: '16.5%', top: '0', bottom: '0', width: '210px', transform: 'translateX(-50%)', pointerEvents: 'none'}}>
              <div style={{position: 'absolute', insetInlineStart: '50%', transform: 'translateX(-50%)', bottom: '57%', width: '198px', background: '#ffffff', border: '1px solid #e7ecf5', borderRadius: '14px', boxShadow: '0 16px 34px -18px rgba(15,23,41,.25)', padding: '13px 15px', textAlign: 'start'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <div style={{position: 'relative', width: '34px', height: '34px', flexShrink: '0'}}>
                    <span style={{position: 'absolute', inset: '0', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease'}}><svg viewBox="0 0 36 36" style={{width: '34px', height: '34px', display: 'block'}}><circle cx="18" cy="18" r="16" fill="#e3f6ec" stroke="#1a9d55" strokeWidth="1.6"/><path d="M11.5 18.5 L16 22.5 L25 13.5" fill="none" stroke="#1a9d55" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                    <span style={{position: 'absolute', inset: '0', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease'}}><svg viewBox="0 0 36 36" style={{width: '34px', height: '34px', display: 'block'}}><circle cx="18" cy="18" r="16" fill="#fdeaea" stroke="#e5484d" strokeWidth="1.6"/><path d="M18 10.5 L18 19" stroke="#e5484d" strokeWidth="2.6" strokeLinecap="round"/><circle cx="18" cy="23.5" r="1.7" fill="#e5484d"/></svg></span>
                  </div>
                  <div style={{fontSize: '14px', fontWeight: '700', color: '#0f1729', lineHeight: '1.2'}}>{t("Approvals")}</div>
                </div>
                <div style={{position: 'relative', height: '20px', marginTop: '9px'}}>
                  <span style={{position: 'absolute', inset: '0', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: '#157d44', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease'}}><span style={{width: '15px', height: '15px', borderRadius: '50%', background: '#e3f6ec', display: 'grid', placeItems: 'center', fontSize: '9px'}}>✓</span>{t("One-tap approved")}</span>
                  <span style={{position: 'absolute', inset: '0', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: '#e5484d', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease'}}><span style={{width: '15px', height: '15px', borderRadius: '50%', background: '#fdeaea', display: 'grid', placeItems: 'center', fontSize: '9px'}}>!</span>{t("Stuck for days")}</span>
                </div>
              </div>
              <div style={{position: 'absolute', insetInlineStart: '50%', transform: 'translateX(-50%)', bottom: '50%', height: '7%', width: '2px', background: '#dce7fb'}}></div>
              <div style={{position: 'absolute', insetInlineStart: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '34px', height: '34px', borderRadius: '50%', display: 'grid', placeItems: 'center'}}>
                <span style={{position: 'absolute', inset: '0', borderRadius: '50%', background: '#1a56db', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: '800', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease', boxShadow: '0 0 0 5px rgba(26,86,219,.15)'}}>1</span>
                <span style={{position: 'absolute', inset: '0', borderRadius: '50%', background: '#e5484d', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: '800', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease', boxShadow: '0 0 0 5px rgba(229,72,77,.15)'}}>1</span>
              </div>
            </div>
            <div style={{position: 'absolute', insetInlineStart: '40%', top: '0', bottom: '0', width: '210px', transform: 'translateX(-50%)', pointerEvents: 'none'}}>
              <div style={{position: 'absolute', insetInlineStart: '50%', transform: 'translateX(-50%)', top: '57%', width: '198px', background: '#ffffff', border: '1px solid #e7ecf5', borderRadius: '14px', boxShadow: '0 16px 34px -18px rgba(15,23,41,.25)', padding: '13px 15px', textAlign: 'start'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <div style={{position: 'relative', width: '34px', height: '34px', flexShrink: '0'}}>
                    <span style={{position: 'absolute', inset: '0', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease'}}><svg viewBox="0 0 36 36" style={{width: '34px', height: '34px', display: 'block'}}><circle cx="18" cy="18" r="16" fill="#e3f6ec" stroke="#1a9d55" strokeWidth="1.6"/><path d="M11.5 18.5 L16 22.5 L25 13.5" fill="none" stroke="#1a9d55" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                    <span style={{position: 'absolute', inset: '0', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease'}}><svg viewBox="0 0 36 36" style={{width: '34px', height: '34px', display: 'block'}}><circle cx="18" cy="18" r="16" fill="#fdeaea" stroke="#e5484d" strokeWidth="1.6"/><path d="M18 10.5 L18 19" stroke="#e5484d" strokeWidth="2.6" strokeLinecap="round"/><circle cx="18" cy="23.5" r="1.7" fill="#e5484d"/></svg></span>
                  </div>
                  <div style={{fontSize: '14px', fontWeight: '700', color: '#0f1729', lineHeight: '1.2'}}>{t("Payroll")}</div>
                </div>
                <div style={{position: 'relative', height: '20px', marginTop: '9px'}}>
                  <span style={{position: 'absolute', inset: '0', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: '#157d44', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease'}}><span style={{width: '15px', height: '15px', borderRadius: '50%', background: '#e3f6ec', display: 'grid', placeItems: 'center', fontSize: '9px'}}>✓</span>{t("Runs in hours")}</span>
                  <span style={{position: 'absolute', inset: '0', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: '#e5484d', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease'}}><span style={{width: '15px', height: '15px', borderRadius: '50%', background: '#fdeaea', display: 'grid', placeItems: 'center', fontSize: '9px'}}>!</span>{t("Weeks by hand")}</span>
                </div>
              </div>
              <div style={{position: 'absolute', insetInlineStart: '50%', transform: 'translateX(-50%)', top: '50%', height: '7%', width: '2px', background: '#dce7fb'}}></div>
              <div style={{position: 'absolute', insetInlineStart: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '34px', height: '34px', borderRadius: '50%', display: 'grid', placeItems: 'center'}}>
                <span style={{position: 'absolute', inset: '0', borderRadius: '50%', background: '#1a56db', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: '800', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease', boxShadow: '0 0 0 5px rgba(26,86,219,.15)'}}>2</span>
                <span style={{position: 'absolute', inset: '0', borderRadius: '50%', background: '#e5484d', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: '800', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease', boxShadow: '0 0 0 5px rgba(229,72,77,.15)'}}>2</span>
              </div>
            </div>
            <div style={{position: 'absolute', insetInlineStart: '62%', top: '0', bottom: '0', width: '210px', transform: 'translateX(-50%)', pointerEvents: 'none'}}>
              <div style={{position: 'absolute', insetInlineStart: '50%', transform: 'translateX(-50%)', bottom: '57%', width: '198px', background: '#ffffff', border: '1px solid #e7ecf5', borderRadius: '14px', boxShadow: '0 16px 34px -18px rgba(15,23,41,.25)', padding: '13px 15px', textAlign: 'start'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <div style={{position: 'relative', width: '34px', height: '34px', flexShrink: '0'}}>
                    <span style={{position: 'absolute', inset: '0', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease'}}><svg viewBox="0 0 36 36" style={{width: '34px', height: '34px', display: 'block'}}><circle cx="18" cy="18" r="16" fill="#e3f6ec" stroke="#1a9d55" strokeWidth="1.6"/><path d="M11.5 18.5 L16 22.5 L25 13.5" fill="none" stroke="#1a9d55" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                    <span style={{position: 'absolute', inset: '0', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease'}}><svg viewBox="0 0 36 36" style={{width: '34px', height: '34px', display: 'block'}}><circle cx="18" cy="18" r="16" fill="#fdeaea" stroke="#e5484d" strokeWidth="1.6"/><path d="M18 10.5 L18 19" stroke="#e5484d" strokeWidth="2.6" strokeLinecap="round"/><circle cx="18" cy="23.5" r="1.7" fill="#e5484d"/></svg></span>
                  </div>
                  <div style={{fontSize: '14px', fontWeight: '700', color: '#0f1729', lineHeight: '1.2'}}>{t("Reporting")}</div>
                </div>
                <div style={{position: 'relative', height: '20px', marginTop: '9px'}}>
                  <span style={{position: 'absolute', inset: '0', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: '#157d44', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease'}}><span style={{width: '15px', height: '15px', borderRadius: '50%', background: '#e3f6ec', display: 'grid', placeItems: 'center', fontSize: '9px'}}>✓</span>{t("Live visibility")}</span>
                  <span style={{position: 'absolute', inset: '0', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: '#e5484d', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease'}}><span style={{width: '15px', height: '15px', borderRadius: '50%', background: '#fdeaea', display: 'grid', placeItems: 'center', fontSize: '9px'}}>!</span>{t("Flying blind")}</span>
                </div>
              </div>
              <div style={{position: 'absolute', insetInlineStart: '50%', transform: 'translateX(-50%)', bottom: '50%', height: '7%', width: '2px', background: '#dce7fb'}}></div>
              <div style={{position: 'absolute', insetInlineStart: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '34px', height: '34px', borderRadius: '50%', display: 'grid', placeItems: 'center'}}>
                <span style={{position: 'absolute', inset: '0', borderRadius: '50%', background: '#1a56db', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: '800', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease', boxShadow: '0 0 0 5px rgba(26,86,219,.15)'}}>3</span>
                <span style={{position: 'absolute', inset: '0', borderRadius: '50%', background: '#e5484d', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: '800', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease', boxShadow: '0 0 0 5px rgba(229,72,77,.15)'}}>3</span>
              </div>
            </div>
            <div style={{position: 'absolute', insetInlineStart: '85%', top: '0', bottom: '0', width: '210px', transform: 'translateX(-50%)', pointerEvents: 'none'}}>
              <div style={{position: 'absolute', insetInlineStart: '50%', transform: 'translateX(-50%)', top: '57%', width: '198px', background: '#ffffff', border: '1px solid #e7ecf5', borderRadius: '14px', boxShadow: '0 16px 34px -18px rgba(15,23,41,.25)', padding: '13px 15px', textAlign: 'start'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <div style={{position: 'relative', width: '34px', height: '34px', flexShrink: '0'}}>
                    <span style={{position: 'absolute', inset: '0', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease'}}><svg viewBox="0 0 36 36" style={{width: '34px', height: '34px', display: 'block'}}><circle cx="18" cy="18" r="16" fill="#e3f6ec" stroke="#1a9d55" strokeWidth="1.6"/><path d="M11.5 18.5 L16 22.5 L25 13.5" fill="none" stroke="#1a9d55" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                    <span style={{position: 'absolute', inset: '0', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease'}}><svg viewBox="0 0 36 36" style={{width: '34px', height: '34px', display: 'block'}}><circle cx="18" cy="18" r="16" fill="#fdeaea" stroke="#e5484d" strokeWidth="1.6"/><path d="M18 10.5 L18 19" stroke="#e5484d" strokeWidth="2.6" strokeLinecap="round"/><circle cx="18" cy="23.5" r="1.7" fill="#e5484d"/></svg></span>
                  </div>
                  <div style={{fontSize: '14px', fontWeight: '700', color: '#0f1729', lineHeight: '1.2'}}>{t("Custom software")}</div>
                </div>
                <div style={{position: 'relative', height: '20px', marginTop: '9px'}}>
                  <span style={{position: 'absolute', inset: '0', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: '#157d44', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease'}}><span style={{width: '15px', height: '15px', borderRadius: '50%', background: '#e3f6ec', display: 'grid', placeItems: 'center', fontSize: '9px'}}>✓</span>{t("Built to fit")}</span>
                  <span style={{position: 'absolute', inset: '0', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: '#e5484d', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease'}}><span style={{width: '15px', height: '15px', borderRadius: '50%', background: '#fdeaea', display: 'grid', placeItems: 'center', fontSize: '9px'}}>!</span>{t("Fighting the tool")}</span>
                </div>
              </div>
              <div style={{position: 'absolute', insetInlineStart: '50%', transform: 'translateX(-50%)', top: '50%', height: '7%', width: '2px', background: '#dce7fb'}}></div>
              <div style={{position: 'absolute', insetInlineStart: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '34px', height: '34px', borderRadius: '50%', display: 'grid', placeItems: 'center'}}>
                <span style={{position: 'absolute', inset: '0', borderRadius: '50%', background: '#1a56db', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: '800', opacity: 'var(--wOn,1)', transition: 'opacity .4s ease', boxShadow: '0 0 0 5px rgba(26,86,219,.15)'}}>4</span>
                <span style={{position: 'absolute', inset: '0', borderRadius: '50%', background: '#e5484d', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: '800', opacity: 'var(--wOff,0)', transition: 'opacity .4s ease', boxShadow: '0 0 0 5px rgba(229,72,77,.15)'}}>4</span>
              </div>
            </div>
            </div>
            </div>
            <div data-reveal="1" style={{opacity: '0', transform: 'translateY(24px)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', marginTop: '34px', flexWrap: 'wrap'}}>
              <p style={{fontSize: '16px', lineHeight: '1.6', color: '#4b5565', margin: '0', maxWidth: '520px', textAlign: 'center'}}>{t("Every product we ship began as one of these knots inside a real client's business — and we straightened it.")}</p>
              <SmartLink href="/contact-us.html" style={{flexShrink: '0', textDecoration: 'none', background: '#1a56db', color: '#ffffff', fontSize: '15px', fontWeight: '600', padding: '13px 26px', borderRadius: '12px', boxShadow: '0 12px 28px -10px rgba(26,86,219,.5)', transition: 'transform .25s ease'}} data-hv="hv-9">{t("Untangle your operations →")}</SmartLink>
            </div>
          </div>
        </section>
    </>
  );
}
