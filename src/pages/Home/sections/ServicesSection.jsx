import { useRef, useEffect } from 'react';
import { useHome, ORBIT, pressable } from '../HomeContext';
import SmartLink from '../../../components/SmartLink';
import { useServices } from '../../../hooks/useCms';
import { cmsPic, cssUrl } from '../../../lib/cmsImage';
import { useHomeCopy } from '../useHomeCopy';
import { HOME, SERVICES } from '../homeContent';
import { useHomeIndustries } from '../useHomeIndustries';

/* One URL per service image everywhere it appears (orbit thumbnail, list
   thumbnail, pop-up): the uploads are 480px wide, so this is the full image
   and each loads once. */
const SVC_IMG = { width: 480 };
const svcPath = (img) => `/assets/images/services/${img}.webp`;

export default function ServicesSection() {
  const { b, act, state, dispatch } = useHome();
  const { t, lang, tx, txt, rows, cms, query: homeQuery } = useHomeCopy();
  const scrollRef = useRef(null);
  const goStage = (n) => dispatch({ type: 'ORBIT_GO', n, stop: true });
  const scrollBy = (dy) => scrollRef.current?.scrollBy({ top: dy, behavior: 'smooth' });

  /* Facts row — "{count}" = number of industries shown in the Industries section. */
  const industryCount = useHomeIndustries().length.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');
  const stats = rows('servicesStats', ['value', 'label'])
    .map((st) => ({ ...st, value: st.value.split('{count}').join(industryCount) }));

  /* Delivery steps: five fixed places on the orbit (arrows in ORBIT). */
  const homePic = cmsPic(homeQuery);
  const orbit = rows('servicesSteps', ['hubName', 'title', 'text'], ORBIT.length).map((st, i) => ({
    ...st,
    img: homePic(cms?.servicesSteps?.[i]?.image, SVC_IMG, svcPath(HOME.servicesSteps[i][3])),
  }));

  const points = rows('customPoints', null);

  /* Service cards + pop-up: Service documents (sorted by order), else the
     built-in six. Any number of cards works — the list scrolls. */
  const svcQuery = useServices();
  const svcPic = cmsPic(svcQuery);
  const services = svcQuery.data?.length
    ? svcQuery.data.map((d) => ({
      title: txt(d.name),
      tag: txt(d.tag) || txt(d.name),
      short: txt(d.tagline),
      desc: txt(d.summary),
      feats: (d.features || []).map((f) => txt(f)).filter(Boolean),
      img: svcPic(d.illustration, SVC_IMG),
    }))
    : SERVICES.map((sv) => ({
      title: t(sv.title), tag: t(sv.tag), short: t(sv.short), desc: t(sv.desc),
      feats: sv.feats.map((f) => t(f)),
      img: svcPic(null, null, svcPath(sv.img)),
    }));
  const svc = state.svcModal != null ? services[state.svcModal] || null : null;
  const modalRef = useRef(null);
  const openerRef = useRef(null);
  const isOpen = svc != null;
  // Modal focus management: move focus into the dialog on open, keep Tab
  // cycling inside it, and hand focus back to the card that opened it on close
  // (Esc itself is handled in HomeContext).
  useEffect(() => {
    if (!isOpen) return undefined;
    openerRef.current = document.activeElement;
    const root = modalRef.current;
    const focusables = () => Array.from(root?.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])') || []);
    focusables()[0]?.focus();
    const onKey = (e) => {
      if (e.key !== 'Tab' || !root) return;
      const f = focusables(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      const o = openerRef.current;
      if (o && o.isConnected && typeof o.focus === 'function') o.focus();
    };
  }, [isOpen]);
  return (
    <>
      <section data-screen-label="Services" className="ag" data-orbit={state.orbitStep} style={{background: 'linear-gradient(160deg,#e9f0ff 0%,#f3f8ff 46%,#ffffff 100%)', position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: '-160px', insetInlineStart: '-120px', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(120,167,255,.28),transparent 68%)', pointerEvents: 'none'}}></div>
          <div style={{position: 'absolute', bottom: '-180px', insetInlineEnd: '-140px', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(120,167,255,.18),transparent 70%)', pointerEvents: 'none'}}></div>
          <div style={{maxWidth: '1240px', margin: '0 auto', padding: '100px 32px', position: 'relative'}}>
            <div className="hm-stack" style={{display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: '56px', alignItems: 'center'}}>
              <div data-reveal="0" style={{opacity: '0', transform: 'translateY(24px)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)'}}>
                <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: '#1a56db', letterSpacing: '1.4px', textTransform: 'uppercase', fontFamily: '\'Outfit\',sans-serif'}}>{tx('servicesEyebrow')}</div>
                <h2 style={{fontSize: '42px', fontWeight: '700', letterSpacing: '-1px', margin: '18px 0 0', lineHeight: '1.12', textWrap: 'pretty'}}>{tx('servicesHeading')}</h2>
                <p style={{fontSize: '17px', lineHeight: '1.65', color: '#4b5565', margin: '18px 0 0'}}>{tx('servicesText')}</p>
                <SmartLink href="/contact-us.html" style={{display: 'inline-block', marginTop: '28px', textDecoration: 'none', background: '#1a56db', color: '#ffffff', fontSize: '15.5px', fontWeight: '600', padding: '15px 30px', borderRadius: '14px', boxShadow: '0 16px 34px -14px rgba(26,86,219,.6)'}} data-hv="hv-11">{tx('servicesButton')}</SmartLink>
                <div style={{display: 'flex', gap: '30px', marginTop: '34px', paddingTop: '26px', borderTop: '1px solid #e4ebf6'}}>
                  {stats.map((st, i) => (
                    <div key={i}><div style={{fontSize: '15px', fontWeight: '800', color: '#0f1729'}}>{st.value}</div><div style={{fontSize: '12px', color: '#657085', marginTop: '2px'}}>{st.label}</div></div>
                  ))}
                </div>
              </div>
              
          <div data-reveal="1" className="hm-scale-wrap" style={{opacity: '0', transform: 'translateY(24px)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)', '--hm-w': '600px', '--hm-h': '580px'}}>
            <div data-svc-panel="1" className="hm-scale-panel" style={{position: 'relative', width: '600px', maxWidth: '100%', height: '580px', margin: '0 auto'}}>
              <svg width="600" height="580" viewBox="0 0 600 580" fill="none" style={{position: 'absolute', top: '0', insetInlineStart: '0', zIndex: '3', overflow: 'visible', pointerEvents: 'none'}}>
                <defs><marker id="svcAh" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#9fbdf0"/></marker><marker id="svcAhA" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#1a56db"/></marker></defs>
              <path d="M383,143 Q425,107 406,160" stroke="#bcd0f2" strokeWidth="2.2" strokeLinecap="round" fill="none" markerEnd="url(#svcAh)"/>
              <path d="M466,321 Q513,350 457,349" stroke="#bcd0f2" strokeWidth="2.2" strokeLinecap="round" fill="none" markerEnd="url(#svcAh)"/>
              <path d="M320,454 Q306,508 290,454" stroke="#bcd0f2" strokeWidth="2.2" strokeLinecap="round" fill="none" markerEnd="url(#svcAh)"/>
              <path d="M147,358 Q91,362 138,330" stroke="#bcd0f2" strokeWidth="2.2" strokeLinecap="round" fill="none" markerEnd="url(#svcAh)"/>
              <path d="M186,165 Q164,114 209,148" stroke="#bcd0f2" strokeWidth="2.2" strokeLinecap="round" fill="none" markerEnd="url(#svcAh)"/>
                <path d={ORBIT[state.orbitStep].arrow} stroke="#1a56db" strokeWidth="3" strokeLinecap="round" fill="none" markerEnd="url(#svcAhA)"/>
                <path d={ORBIT[state.orbitStep].arrow} stroke="#8fb8ff" strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="16 2000" style={{animation: 'svcSpark 2.4s linear infinite'}}/>
              </svg>
      
              <div style={{position: 'absolute', insetInlineStart: '238px', top: '226px', width: '124px', height: '124px', borderRadius: '50%', background: '#0f1729', zIndex: '6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 26px 60px -24px rgba(15,23,41,.6)', animation: 'floatY 7s ease-in-out infinite', cursor: 'pointer'}} {...pressable(() => act('toggleAuto'))}>
                <div style={{fontFamily: '\'Outfit\',sans-serif', fontSize: '9px', letterSpacing: '1.5px', color: '#7aa7ff'}}>{t("STEP")}</div>
                <div style={{fontSize: '30px', fontWeight: '800', color: '#fff', lineHeight: '1'}}><span>{b('svcNum')}</span></div>
                <div style={{fontSize: '11px', fontWeight: '700', color: '#7aa7ff', marginTop: '3px'}}><span>{orbit[state.orbitStep]?.hubName}</span></div>
                <div data-svc-bars style={{display: 'flex', gap: '3px', marginTop: '8px'}}>
                  <span style={{width: '10px', height: '4px', borderRadius: '2px', background: '#1a56db', transition: 'background .4s ease'}}></span><span style={{width: '10px', height: '4px', borderRadius: '2px', background: '#dbe6fb', transition: 'background .4s ease'}}></span><span style={{width: '10px', height: '4px', borderRadius: '2px', background: '#dbe6fb', transition: 'background .4s ease'}}></span><span style={{width: '10px', height: '4px', borderRadius: '2px', background: '#dbe6fb', transition: 'background .4s ease'}}></span><span style={{width: '10px', height: '4px', borderRadius: '2px', background: '#dbe6fb', transition: 'background .4s ease'}}></span>
                </div>
              </div>
      
              <div data-svc-stage="0" {...pressable(() => goStage(0))} style={{position: 'absolute', insetInlineStart: '205px', top: '6px', width: '190px', zIndex: '5', opacity: '1', transform: 'none', cursor: 'pointer', transition: 'opacity .4s ease,transform .45s cubic-bezier(.2,.7,.3,1)', animation: 'emerge .6s ease-out 0s both'}}><div className="svc-card" style={{position: 'relative', background: '#fff', border: '1.5px solid #eaeef5', borderRadius: '16px', padding: '13px 14px', boxShadow: '0 14px 34px -18px rgba(15,23,41,.22)', transition: 'border-color .3s ease,box-shadow .3s ease,transform .3s ease'}}><span style={{position: 'absolute', top: '-11px', insetInlineStart: '14px', fontFamily: '\'Outfit\',sans-serif', fontSize: '9px', fontWeight: '700', letterSpacing: '.5px', background: '#eef3fb', color: '#1a56db', borderRadius: '6px', padding: '3px 8px'}}>{t("STEP 01")}</span><div style={{display: 'flex', alignItems: 'center', gap: '11px'}}><div style={{width: '44px', height: '44px', borderRadius: '11px', flexShrink: '0', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 6px 14px -6px rgba(15,23,41,.4)', backgroundImage: cssUrl(orbit[0].img)}}></div><div style={{fontSize: '14.5px', fontWeight: '700', color: '#0f1729', lineHeight: '1.14'}}>{orbit[0].title}</div></div><p style={{fontSize: '11.5px', lineHeight: '1.5', color: '#5b6472', margin: '9px 0 0'}}>{orbit[0].text}</p><div style={{display: 'flex', gap: '4px', marginTop: '10px'}}><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>1</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>2</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>3</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>4</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>5</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>6</span></div></div></div>
      <div data-svc-stage="1" {...pressable(() => goStage(1))} style={{position: 'absolute', insetInlineStart: '402px', top: '150px', width: '190px', zIndex: '5', opacity: '1', transform: 'none', cursor: 'pointer', transition: 'opacity .4s ease,transform .45s cubic-bezier(.2,.7,.3,1)', animation: 'emerge .6s ease-out 0.1s both'}}><div className="svc-card" style={{position: 'relative', background: '#fff', border: '1.5px solid #eaeef5', borderRadius: '16px', padding: '13px 14px', boxShadow: '0 14px 34px -18px rgba(15,23,41,.22)', transition: 'border-color .3s ease,box-shadow .3s ease,transform .3s ease'}}><span style={{position: 'absolute', top: '-11px', insetInlineStart: '14px', fontFamily: '\'Outfit\',sans-serif', fontSize: '9px', fontWeight: '700', letterSpacing: '.5px', background: '#eef3fb', color: '#1a56db', borderRadius: '6px', padding: '3px 8px'}}>{t("STEP 02")}</span><div style={{display: 'flex', alignItems: 'center', gap: '11px'}}><div style={{width: '44px', height: '44px', borderRadius: '11px', flexShrink: '0', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 6px 14px -6px rgba(15,23,41,.4)', backgroundImage: cssUrl(orbit[1].img)}}></div><div style={{fontSize: '14.5px', fontWeight: '700', color: '#0f1729', lineHeight: '1.14'}}>{orbit[1].title}</div></div><p style={{fontSize: '11.5px', lineHeight: '1.5', color: '#5b6472', margin: '9px 0 0'}}>{orbit[1].text}</p><div style={{display: 'flex', gap: '4px', marginTop: '10px'}}><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>1</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>2</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>3</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>4</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>5</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>6</span></div></div></div>
      <div data-svc-stage="2" {...pressable(() => goStage(2))} style={{position: 'absolute', insetInlineStart: '320px', top: '392px', width: '190px', zIndex: '5', opacity: '1', transform: 'none', cursor: 'pointer', transition: 'opacity .4s ease,transform .45s cubic-bezier(.2,.7,.3,1)', animation: 'emerge .6s ease-out 0.2s both'}}><div className="svc-card" style={{position: 'relative', background: '#fff', border: '1.5px solid #eaeef5', borderRadius: '16px', padding: '13px 14px', boxShadow: '0 14px 34px -18px rgba(15,23,41,.22)', transition: 'border-color .3s ease,box-shadow .3s ease,transform .3s ease'}}><span style={{position: 'absolute', top: '-11px', insetInlineStart: '14px', fontFamily: '\'Outfit\',sans-serif', fontSize: '9px', fontWeight: '700', letterSpacing: '.5px', background: '#eef3fb', color: '#1a56db', borderRadius: '6px', padding: '3px 8px'}}>{t("STEP 03")}</span><div style={{display: 'flex', alignItems: 'center', gap: '11px'}}><div style={{width: '44px', height: '44px', borderRadius: '11px', flexShrink: '0', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 6px 14px -6px rgba(15,23,41,.4)', backgroundImage: cssUrl(orbit[2].img)}}></div><div style={{fontSize: '14.5px', fontWeight: '700', color: '#0f1729', lineHeight: '1.14'}}>{orbit[2].title}</div></div><p style={{fontSize: '11.5px', lineHeight: '1.5', color: '#5b6472', margin: '9px 0 0'}}>{orbit[2].text}</p><div style={{display: 'flex', gap: '4px', marginTop: '10px'}}><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>1</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>2</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>3</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>4</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>5</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>6</span></div></div></div>
      <div data-svc-stage="3" {...pressable(() => goStage(3))} style={{position: 'absolute', insetInlineStart: '90px', top: '392px', width: '190px', zIndex: '5', opacity: '1', transform: 'none', cursor: 'pointer', transition: 'opacity .4s ease,transform .45s cubic-bezier(.2,.7,.3,1)', animation: 'emerge .6s ease-out 0.30000000000000004s both'}}><div className="svc-card" style={{position: 'relative', background: '#fff', border: '1.5px solid #eaeef5', borderRadius: '16px', padding: '13px 14px', boxShadow: '0 14px 34px -18px rgba(15,23,41,.22)', transition: 'border-color .3s ease,box-shadow .3s ease,transform .3s ease'}}><span style={{position: 'absolute', top: '-11px', insetInlineStart: '14px', fontFamily: '\'Outfit\',sans-serif', fontSize: '9px', fontWeight: '700', letterSpacing: '.5px', background: '#eef3fb', color: '#1a56db', borderRadius: '6px', padding: '3px 8px'}}>{t("STEP 04")}</span><div style={{display: 'flex', alignItems: 'center', gap: '11px'}}><div style={{width: '44px', height: '44px', borderRadius: '11px', flexShrink: '0', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 6px 14px -6px rgba(15,23,41,.4)', backgroundImage: cssUrl(orbit[3].img)}}></div><div style={{fontSize: '14.5px', fontWeight: '700', color: '#0f1729', lineHeight: '1.14'}}>{orbit[3].title}</div></div><p style={{fontSize: '11.5px', lineHeight: '1.5', color: '#5b6472', margin: '9px 0 0'}}>{orbit[3].text}</p><div style={{display: 'flex', gap: '4px', marginTop: '10px'}}><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>1</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>2</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>3</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>4</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>5</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>6</span></div></div></div>
      <div data-svc-stage="4" {...pressable(() => goStage(4))} style={{position: 'absolute', insetInlineStart: '8px', top: '150px', width: '190px', zIndex: '5', opacity: '1', transform: 'none', cursor: 'pointer', transition: 'opacity .4s ease,transform .45s cubic-bezier(.2,.7,.3,1)', animation: 'emerge .6s ease-out 0.4s both'}}><div className="svc-card" style={{position: 'relative', background: '#fff', border: '1.5px solid #eaeef5', borderRadius: '16px', padding: '13px 14px', boxShadow: '0 14px 34px -18px rgba(15,23,41,.22)', transition: 'border-color .3s ease,box-shadow .3s ease,transform .3s ease'}}><span style={{position: 'absolute', top: '-11px', insetInlineStart: '14px', fontFamily: '\'Outfit\',sans-serif', fontSize: '9px', fontWeight: '700', letterSpacing: '.5px', background: '#eef3fb', color: '#1a56db', borderRadius: '6px', padding: '3px 8px'}}>{t("STEP 05")}</span><div style={{display: 'flex', alignItems: 'center', gap: '11px'}}><div style={{width: '44px', height: '44px', borderRadius: '11px', flexShrink: '0', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 6px 14px -6px rgba(15,23,41,.4)', backgroundImage: cssUrl(orbit[4].img)}}></div><div style={{fontSize: '14.5px', fontWeight: '700', color: '#0f1729', lineHeight: '1.14'}}>{orbit[4].title}</div></div><p style={{fontSize: '11.5px', lineHeight: '1.5', color: '#5b6472', margin: '9px 0 0'}}>{orbit[4].text}</p><div style={{display: 'flex', gap: '4px', marginTop: '10px'}}><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>1</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>2</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>3</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>4</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#e8effc', color: '#1a56db'}}>5</span><span style={{width: '18px', height: '18px', borderRadius: '5px', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700', background: '#f3f5fb', color: '#c3cad6'}}>6</span></div></div></div>
            </div>
          </div>
            </div>
          </div>
      
          <div className="hm-svc-outer" style={{maxWidth: '1240px', margin: '0 auto', padding: '0 32px 110px', position: 'relative'}}>
            <div className="hm-svc-box" style={{background: 'linear-gradient(180deg,#eef4ff 0%,#f5f9ff 100%)', border: '1px solid #e4ecfa', borderRadius: '32px', padding: '56px 52px', boxShadow: '0 44px 96px -54px rgba(26,86,219,.34)'}}>
              <div className="hm-stack" style={{display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '56px', alignItems: 'center'}}>
                <div data-reveal="0" style={{opacity: '0', transform: 'translateY(24px)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)'}}>
                  <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: '\'Outfit\',sans-serif', fontSize: '12px', fontWeight: '700', color: '#1a56db', letterSpacing: '1.4px', textTransform: 'uppercase'}}>{tx('customEyebrow')}</div>
                  <h3 style={{fontSize: '42px', fontWeight: '800', letterSpacing: '-1.4px', lineHeight: '1.08', margin: '20px 0 0'}}>{tx('customHeading')}<br /><span style={{background: 'linear-gradient(100deg,#1a56db 0%,#4b8bff 30%,#8fb8ff 50%,#4b8bff 70%,#1a56db 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', animation: 'shimmerText 4s linear infinite'}}>{tx('customHighlight')}</span></h3>
                  <p style={{fontSize: '16.5px', lineHeight: '1.6', color: '#4b5565', margin: '18px 0 0', maxWidth: '420px'}}>{tx('customText')}</p>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '13px', marginTop: '26px'}}>
                    {points.map((pt, i) => (
                      <div key={i} style={{display: 'flex', alignItems: 'center', gap: '11px', fontSize: '15px', color: '#31405c'}}><span style={{width: '20px', height: '20px', borderRadius: '50%', background: '#e3f6ec', color: '#157d44', display: 'grid', placeItems: 'center', fontSize: '11px', flexShrink: '0'}}>✓</span>{pt}</div>
                    ))}
                  </div>
                  <SmartLink href="/contact-us.html" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '30px', textDecoration: 'none', background: '#0f1729', color: '#fff', fontSize: '15px', fontWeight: '600', padding: '14px 26px', borderRadius: '13px', transition: 'background .25s ease'}} data-hv="hv-12">{tx('customButton')}</SmartLink>
                </div>
                <div data-reveal="1" style={{opacity: '0', transform: 'translateY(24px)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)', position: 'relative'}}>
                <button onClick={() => scrollBy(-156)} className="hm-svc-arrow" aria-label={t('Previous services')} style={{position: 'absolute', top: '-18px', insetInlineEnd: '-50px', zIndex: '5', width: '44px', height: '44px', borderRadius: '50%', border: '1.5px solid #e3e9f3', background: '#fff', color: '#1a56db', fontSize: '18px', lineHeight: '1', cursor: 'pointer', boxShadow: '0 10px 26px -12px rgba(15,23,41,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s ease'}} data-hv="hv-13">&uarr;</button>
                <button onClick={() => scrollBy(156)} className="hm-svc-arrow" aria-label={t('More services')} style={{position: 'absolute', bottom: '-18px', insetInlineEnd: '-50px', zIndex: '5', width: '44px', height: '44px', borderRadius: '50%', border: '1.5px solid #e3e9f3', background: '#fff', color: '#1a56db', fontSize: '18px', lineHeight: '1', cursor: 'pointer', boxShadow: '0 10px 26px -12px rgba(15,23,41,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s ease'}} data-hv="hv-13">&darr;</button>
                <div className="hm-svc-scroll" ref={scrollRef} style={{height: '452px', overflowY: 'hidden', scrollbarWidth: 'none', MsOverflowStyle: 'none', WebkitMaskImage: 'linear-gradient(180deg,transparent 0,#000 8%,#000 92%,transparent 100%)', maskImage: 'linear-gradient(180deg,transparent 0,#000 8%,#000 92%,transparent 100%)', display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 6px'}}>
                  {services.map((sv, i) => (
                    <div key={i} style={{scrollSnapAlign: 'center', flexShrink: '0'}}>
                      <div {...pressable(() => dispatch({ type: 'SVC_OPEN', n: i }))} className="hm-svc-card" style={{display: 'flex', alignItems: 'center', gap: '18px', background: '#ffffff', border: '1.5px solid #eaeef5', borderRadius: '18px', padding: '16px 20px 16px 16px', boxShadow: '0 14px 34px -18px rgba(15,23,41,.22)', animation: `svc6Pulse 9s ease-in-out ${(i * 9) / services.length}s infinite`, transition: 'transform .25s ease', cursor: 'pointer'}} data-hv="hv-14">
                        <div className="hm-svc-thumb" style={{width: '96px', height: '72px', borderRadius: '13px', flexShrink: '0', backgroundImage: cssUrl(sv.img), backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 8px 18px -8px rgba(15,23,41,.4)'}}></div>
                        <div style={{flex: '1', minWidth: 0}}><div className="hm-svc-title" style={{fontSize: '17.5px', fontWeight: '700', color: '#0f1729', lineHeight: '1.15'}}>{sv.title}</div><div style={{fontSize: '13.5px', color: '#657085', marginTop: '3px'}}>{sv.short}</div></div>
                        <span className="card-arw" style={{color: '#1a56db', fontSize: '20px', flexShrink: '0', marginInlineEnd: '4px'}}>→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </div>
          </div>
      
      
          {svc && (<>
            <div onClick={() => act('closeSvc')} style={{position: 'fixed', inset: '0', zIndex: '200', background: 'rgba(15,23,41,.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', animation: 'svcModalBg .3s ease both'}}>
              <div ref={modalRef} className="hm-svc-modal" role="dialog" aria-modal="true" aria-label={svc.title} onClick={(e) => e.stopPropagation()} style={{width: 'min(920px,100%)', background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 60px 140px -40px rgba(15,23,41,.6)', display: 'grid', gridTemplateColumns: '1fr 1fr', animation: 'svcModalIn .45s cubic-bezier(.2,.8,.3,1) both'}}>
                <div className="hm-svc-modal-img" style={{backgroundImage: cssUrl(svc.img), backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '380px', backgroundColor: '#eef4ff'}}></div>
                <div className="hm-svc-modal-body" style={{padding: '38px 36px', position: 'relative'}}>
                  <button onClick={() => act('closeSvc')} aria-label={t('Close')} style={{position: 'absolute', top: '18px', insetInlineEnd: '18px', width: '34px', height: '34px', borderRadius: '50%', border: '1px solid #e6ebf3', background: '#fff', color: '#5b6472', fontSize: '18px', lineHeight: '1', cursor: 'pointer', transition: 'all .2s ease'}} data-hv="hv-15">×</button>
                  <span style={{display: 'inline-flex', alignItems: 'center', gap: '7px', fontFamily: '\'Outfit\',sans-serif', fontSize: '11px', fontWeight: '700', color: '#1a56db', letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(26,86,219,.08)', borderRadius: '999px', padding: '6px 12px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', background: '#1a56db', animation: 'pulseDot 1.6s ease-in-out infinite'}}></span><span>{svc.tag}</span></span>
                  <h3 style={{fontSize: '28px', fontWeight: '800', letterSpacing: '-.8px', margin: '16px 0 0', color: '#0f1729'}}><span>{svc.title}</span></h3>
                  <p style={{fontSize: '15px', lineHeight: '1.6', color: '#4b5565', margin: '12px 0 0'}}><span>{svc.desc}</span></p>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '9px', marginTop: '20px'}}>
                    {svc.feats.map((f, i) => (
                      <span key={`${i}-${f}`} style={{fontSize: '12.5px', fontWeight: '600', color: '#31405c', background: '#f2f6fc', border: '1px solid #e3ecfd', borderRadius: '999px', padding: '7px 13px', animation: `svcFeatIn .5s ease ${i * 0.1}s both`}}>{f}</span>
                    ))}
                  </div>
                  <div style={{display: 'flex', alignItems: 'flex-end', gap: '7px', height: '70px', marginTop: '24px', paddingTop: '6px', borderTop: '1px solid #eef1f6'}}>
                    <div style={{width: '12px', '--h': '45%', background: '#cddcf8', borderRadius: '3px 3px 0 0', animation: 'svcBarGrow .7s cubic-bezier(.2,.8,.3,1) .15s both'}}></div>
                    <div style={{width: '12px', '--h': '72%', background: '#9dbcf3', borderRadius: '3px 3px 0 0', animation: 'svcBarGrow .7s cubic-bezier(.2,.8,.3,1) .25s both'}}></div>
                    <div style={{width: '12px', '--h': '58%', background: '#6f9bef', borderRadius: '3px 3px 0 0', animation: 'svcBarGrow .7s cubic-bezier(.2,.8,.3,1) .35s both'}}></div>
                    <div style={{width: '12px', '--h': '90%', background: '#1a56db', borderRadius: '3px 3px 0 0', animation: 'svcBarGrow .7s cubic-bezier(.2,.8,.3,1) .45s both'}}></div>
                    <div style={{width: '12px', '--h': '66%', background: '#4b8bff', borderRadius: '3px 3px 0 0', animation: 'svcBarGrow .7s cubic-bezier(.2,.8,.3,1) .55s both'}}></div>
                    <span style={{alignSelf: 'center', marginInlineStart: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#157d44'}}><span style={{width: '7px', height: '7px', borderRadius: '50%', background: '#1a9d55', animation: 'pulseDot 1.6s ease-in-out infinite'}}></span>{t("Live")}</span>
                  </div>
                  <SmartLink href="/contact-us.html" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '24px', textDecoration: 'none', background: '#1a56db', color: '#fff', fontSize: '14.5px', fontWeight: '600', padding: '13px 24px', borderRadius: '12px', transition: 'background .2s ease'}} data-hv="hv-11">{tx('serviceModalButton')}</SmartLink>
                </div>
              </div>
            </div>
          </>)}
        </section>
    </>
  );
}
