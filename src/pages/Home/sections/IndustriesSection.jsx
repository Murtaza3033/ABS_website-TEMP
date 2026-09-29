import { useHome } from '../HomeContext';
import SmartLink from '../../../components/SmartLink';
import { useHomeCopy } from '../useHomeCopy';
import { useHomeIndustries } from '../useHomeIndustries';

/* Decorative "LIVE" widget + two floating chips on each industry picture —
   demo UI, kept in code. Picked by industry slug; an industry added later in
   the CMS gets one of these in turn. Chips: [text, dot colour]. */
const W = {
  production: { brand: 'Align', title: 'Production floor', bars: ['Coating', 'Filling', 'Sealing'], toast: '＋ Batch #204 passed QC', chips: [['Batch #204 — 82% yield', '#1a9d55'], ['Uptime 99.2%', '#1a56db']] },
  field: { brand: 'Align', title: 'Field coverage', bars: ['Karachi', 'Lahore', 'Multan'], toast: '＋ Visit logged · Karachi', chips: [['3 visits logged today', '#1a9d55'], ['Coverage 88%', '#1a56db']] },
  dispatch: { brand: 'Align', title: 'Dispatch', bars: ['Loaded', 'En route', 'Delivered'], toast: '＋ #4521 out for delivery', chips: [['Order #4521 · en route', '#1a56db'], ['On-time 96%', '#1a9d55']] },
  group: { brand: 'Align Suite', title: 'Group KPIs', bars: ['Revenue', 'Margin', 'Cash'], toast: '＋ Month-end closed', chips: [['Revenue +18% QoQ', '#1a9d55'], ['3 products · 1 login', '#1a56db']] },
  projects: { brand: 'Align', title: 'Projects', bars: ['Billable', 'Delivery', 'Utilization'], toast: '＋ Invoice #INV-238 sent', chips: [['38.5 hrs logged', '#1a56db'], ['Invoices Rs 1.2M', '#1a9d55']] },
  people: { brand: 'Align', title: 'Attendance', bars: ['Present', 'Remote', 'Leave'], toast: '＋ 12 clock-ins · 9:01', chips: [['Present today 94%', '#1a9d55'], ['Payroll ready to run', '#1a56db']] },
  retail: { brand: 'Align', title: 'Store sales', bars: ['Store A', 'Store B', 'Store C'], toast: '＋ Sale Rs 4,200 · POS 2', chips: [['Sales Rs 245,000 ↗', '#1a9d55'], ['Footfall +12%', '#b78103']] },
};
const WIDGET_BY_SLUG = {
  'food-beverage-fmcg': W.production,
  'pharmaceutical-healthcare': W.field,
  'lighting-electrical': W.dispatch,
  'construction-building-real-estate': W.group,
  'energy-solar': W.projects,
  'technology-mobility': W.people,
};
const WIDGET_CYCLE = Object.values(W);
const widgetFor = (ind, i) => WIDGET_BY_SLUG[ind.slug] || WIDGET_CYCLE[i % WIDGET_CYCLE.length];

export default function IndustriesSection() {
  const { state, dispatch } = useHome();
  const { t, tx } = useHomeCopy();
  const inds = useHomeIndustries();
  const active = Math.min(state.indTab, Math.max(inds.length - 1, 0));
  return (
    <>
      <section data-screen-label="Industries" className="ag" data-active-ind={active} style={{background: '#f7faff', borderTop: '1px solid #eef1f6', overflow: 'hidden'}}>
          <div style={{maxWidth: '1240px', margin: '0 auto', padding: '100px 32px'}}>
            <div data-reveal="0" style={{opacity: '0', transform: 'translateY(24px)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px'}}>
              <div style={{maxWidth: '780px'}}>
                <div style={{fontSize: '12.5px', fontWeight: '700', color: '#1a56db', letterSpacing: '1.6px', textTransform: 'uppercase'}}>{tx('industriesEyebrow')}</div>
                <h2 style={{fontSize: '46px', fontWeight: '800', letterSpacing: '-1.8px', margin: '14px 0 0', lineHeight: '1.06', textWrap: 'pretty'}}>{tx('industriesHeading')}<br /><span style={{background: 'linear-gradient(100deg,#1a56db 0%,#4b8bff 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{tx('industriesHighlight')}</span></h2>
              </div>
              <SmartLink href="/industries.html" className="tap-pad" style={{fontSize: '15px', fontWeight: '600', color: '#1a56db', textDecoration: 'none', whiteSpace: 'nowrap'}}>{tx('industriesLink')}</SmartLink>
            </div>
      
            <div className="hm-stagger" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '36px'}}>
                {inds.map((ind, i) => (
                <button key={ind.key} data-act={`setInd${i}`} data-on={i === active ? '' : undefined} aria-pressed={i === active} onClick={() => dispatch({ type: 'IND_TAB', n: i })} style={{background: i === active ? '#1a56db' : '#ffffff', color: i === active ? '#ffffff' : '#5b6472', border: i === active ? '1px solid #1a56db' : '1px solid #e4eaf3', borderRadius: '999px', padding: '9px 18px', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer', transition: 'background .3s ease,color .3s ease,border-color .3s ease', whiteSpace: 'nowrap'}}>{ind.name}</button>
                ))}
            </div>
      
            <div data-reveal="1" style={{opacity: '0', transform: 'translateY(24px)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)', display: 'grid', maxWidth: '640px', margin: '22px auto 0', textAlign: 'center'}}>
              {inds.map((ind, i) => (
                <p key={ind.key} aria-hidden={i !== active} style={{gridArea: '1 / 1', margin: '0', fontSize: '16px', lineHeight: '1.6', color: '#4b5565', opacity: i === active ? 1 : 0, transition: 'opacity .5s ease'}}>{ind.summary}</p>
              ))}
            </div>
            <div className="hm-indp-wrap" aria-hidden="true" data-reveal="1" style={{opacity: '0', transform: 'translateY(24px)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)', position: 'relative', height: '480px', marginTop: '28px'}}>
              {inds.map((ind, i) => {
                const w = widgetFor(ind, i);
                return (
                <div key={ind.key} style={{position: 'absolute', inset: '0', transition: 'opacity .6s ease,transform .6s cubic-bezier(.4,0,.2,1)', opacity: i === active ? '1' : '0', transform: i === active ? 'none' : 'translateY(20px)', pointerEvents: i === active ? 'auto' : 'none'}} data-indp={i} data-on={i === active ? '' : undefined}>
                  <div style={{position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{position: 'relative', width: '70%', maxWidth: '660px', height: '430px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 44px 100px -40px rgba(26,86,219,.42)', border: '1px solid rgba(255,255,255,.6)', animation: 'floatY 8s ease-in-out infinite'}}>
                      {ind.img && <img src={ind.img} loading="lazy" decoding="async" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} alt={ind.alt} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />}
                      <div style={{position: 'absolute', top: '16px', insetInlineStart: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(15,23,41,.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.18)', borderRadius: '999px', padding: '7px 14px', zIndex: '4'}}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#4b8bff', boxShadow: '0 0 0 3px rgba(75,139,255,.3)'}}></span><span style={{fontSize: '12px', fontWeight: '700', color: '#fff', letterSpacing: '.4px'}}>{ind.name}</span></div>
                      <div style={{position: 'absolute', insetInlineEnd: '16px', bottom: '16px', width: '262px', background: 'linear-gradient(180deg,rgba(255,255,255,.98),rgba(246,250,255,.95))', backdropFilter: 'blur(16px) saturate(1.3)', WebkitBackdropFilter: 'blur(16px) saturate(1.3)', border: '1px solid rgba(255,255,255,.95)', borderRadius: '20px', boxShadow: '0 34px 72px -22px rgba(26,86,219,.42),0 1px 0 rgba(255,255,255,.7) inset', padding: '16px 18px', animation: 'floatY 6.5s ease-in-out infinite', zIndex: '4'}}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #edf1f7', paddingBottom: '11px'}}><div style={{display: 'flex', alignItems: 'center', gap: '9px'}}><span style={{width: '26px', height: '26px', borderRadius: '9px', background: 'linear-gradient(135deg,#1a56db,#4b8bff)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '13px', fontWeight: '800', boxShadow: '0 7px 16px -5px rgba(26,86,219,.65)'}}>A</span><span style={{fontSize: '13.5px', fontWeight: '800', color: '#0f1729', letterSpacing: '-.3px'}}>{w.brand}</span></div><span style={{display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '9px', fontWeight: '800', letterSpacing: '.6px', color: '#157d44', background: '#e3f6ec', borderRadius: '999px', padding: '4px 9px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', background: '#1a9d55', animation: 'pulseDot 2s ease-in-out infinite'}}></span>{t("LIVE")}</span></div><div style={{marginTop: '11px', position: 'relative'}}><svg viewBox="0 0 224 34" preserveAspectRatio="none" style={{width: '100%', height: '30px', display: 'block'}}><defs><linearGradient id="spk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4b8bff" stopOpacity=".26" /><stop offset="1" stopColor="#4b8bff" stopOpacity="0" /></linearGradient></defs><path d="M0,26 L24,20 L48,23 L72,14 L96,17 L120,9 L144,13 L168,6 L196,10 L224,3 L224,34 L0,34 Z" fill="url(#spk)"/><path d="M0,26 L24,20 L48,23 L72,14 L96,17 L120,9 L144,13 L168,6 L196,10 L224,3" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="620" strokeDashoffset="620" style={{animation: 'spkDraw 2.4s cubic-bezier(.4,0,.2,1) forwards'}}/></svg><span style={{position: 'absolute', insetInlineEnd: '0', top: '1px', width: '6px', height: '6px', borderRadius: '50%', background: '#1a56db', boxShadow: '0 0 0 3px rgba(26,86,219,.18)'}}></span></div>
                        <div style={{fontSize: '11px', color: '#657085', fontWeight: '600', marginTop: '9px', letterSpacing: '.2px'}}>{t(w.title)}</div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '9px'}}><div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{fontSize: '10px', color: '#5b6472', width: '56px', flexShrink: '0'}}>{t(w.bars[0])}</span><div style={{flex: '1', height: '6px', background: '#eef2fa', borderRadius: '99px', overflow: 'hidden'}}><div style={{width: '92%', height: '100%', background: '#1a56db', borderRadius: '99px', animation: 'ucCovA 5s ease-in-out infinite'}}></div></div></div><div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{fontSize: '10px', color: '#5b6472', width: '56px', flexShrink: '0'}}>{t(w.bars[1])}</span><div style={{flex: '1', height: '6px', background: '#eef2fa', borderRadius: '99px', overflow: 'hidden'}}><div style={{width: '86%', height: '100%', background: '#1a56db', borderRadius: '99px', animation: 'ucCovB 5s ease-in-out infinite'}}></div></div></div><div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{fontSize: '10px', color: '#5b6472', width: '56px', flexShrink: '0'}}>{t(w.bars[2])}</span><div style={{flex: '1', height: '6px', background: '#eef2fa', borderRadius: '99px', overflow: 'hidden'}}><div style={{width: '71%', height: '100%', background: '#1a56db', borderRadius: '99px', animation: 'ucCovC 5s ease-in-out infinite'}}></div></div></div></div>
                        <div style={{marginTop: '11px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e3f6ec', borderRadius: '7px', padding: '5px 9px', fontSize: '10px', fontWeight: '700', color: '#157d44', animation: 'ucToast 5s ease-in-out infinite'}}>{t(w.toast)}</div>
                      </div>
                    </div>
                    <div style={{position: 'absolute', insetInlineEnd: '11%', top: '15%', zIndex: '4'}}><div style={{background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid #eef1f6', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 18px 40px -18px rgba(15,23,41,.3)', display: 'flex', alignItems: 'center', gap: '9px', whiteSpace: 'nowrap', cursor: 'default', animation: 'floatY 5s ease-in-out infinite', transition: 'transform .25s ease,box-shadow .25s ease'}} data-hv="hv-16"><span style={{width: '9px', height: '9px', borderRadius: '50%', background: w.chips[0][1], flexShrink: '0', animation: 'pulseDot 2s ease-in-out infinite'}}></span><span style={{fontSize: '12.5px', fontWeight: '700', color: '#0f1729'}}>{t(w.chips[0][0])}</span></div></div>
                    <div style={{position: 'absolute', insetInlineStart: '11%', bottom: '19%', zIndex: '4'}}><div style={{background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid #eef1f6', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 18px 40px -18px rgba(15,23,41,.3)', display: 'flex', alignItems: 'center', gap: '9px', whiteSpace: 'nowrap', cursor: 'default', animation: 'floatY2 5s ease-in-out infinite', transition: 'transform .25s ease,box-shadow .25s ease'}} data-hv="hv-16"><span style={{width: '9px', height: '9px', borderRadius: '50%', background: w.chips[1][1], flexShrink: '0', animation: 'pulseDot 2s ease-in-out infinite'}}></span><span style={{fontSize: '12.5px', fontWeight: '700', color: '#0f1729'}}>{t(w.chips[1][0])}</span></div></div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </section>
    </>
  );
}
