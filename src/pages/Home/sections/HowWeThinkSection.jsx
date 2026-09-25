import { useHome } from '../HomeContext';
import { useLanguage } from '../../../context/LanguageContext';

export default function HowWeThinkSection() {
  const { c, b, act } = useHome();
  const { t } = useLanguage();
  return (
    <>
      <section className="ag" style={{background: '#0f1729', color: '#ffffff'}}>
          <div className="hm-float-wrap" style={{maxWidth: '1240px', margin: '0 auto', padding: '100px 32px', position: 'relative'}}>
            <div className="hm-float" style={{position: 'absolute', top: '-38px', insetInlineEnd: '28px', zIndex: '5', width: '410px', background: 'rgba(255,255,255,.99)', border: '1px solid rgba(255,255,255,.7)', borderRadius: '28px', boxShadow: '0 56px 130px -36px rgba(0,0,0,.72),0 20px 52px -26px rgba(0,0,0,.45),0 2px 4px rgba(0,0,0,.05)', padding: '28px 28px 30px', animation: 'bfFloat 5.6s ease-in-out infinite'}}>
              <div style={{fontSize: '11px', fontWeight: '700', color: '#1a56db', letterSpacing: '1.8px', textTransform: 'uppercase'}}>{t("Clients Benefits")}</div>
              <h3 style={{fontSize: '20px', fontWeight: '700', letterSpacing: '-.4px', color: '#0f1729', margin: '9px 0 0', lineHeight: '1.22'}}>{t("Explore the advantages of partnering with us")}</h3>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 18px', marginTop: '20px'}}>
                <div style={{display: 'flex', gap: '10px', opacity: '1', transform: 'none', transition: 'opacity .55s cubic-bezier(.34,1.45,.5,1),transform .55s cubic-bezier(.34,1.45,.5,1)'}}>
                  <div style={{width: '30px', height: '30px', flexShrink: '0', borderRadius: '8px', background: '#eef4ff', display: 'grid', placeItems: 'center'}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="16" x2="20" y2="16"></line><circle cx="10" cy="8" r="2.2"></circle><circle cx="15" cy="16" r="2.2"></circle></svg></div>
                  <div><div style={{fontSize: '12px', fontWeight: '700', color: '#0f1729', letterSpacing: '-.1px', lineHeight: '1.2'}}>{t("Tailored Solutions")}</div><div style={{fontSize: '10px', lineHeight: '1.35', color: '#6b7480', marginTop: '2px'}}>{t("Built around your needs.")}</div></div>
                </div>
                <div style={{display: 'flex', gap: '10px', opacity: '1', transform: 'none', transition: 'opacity .55s cubic-bezier(.34,1.45,.5,1),transform .55s cubic-bezier(.34,1.45,.5,1)'}}>
                  <div style={{width: '30px', height: '30px', flexShrink: '0', borderRadius: '8px', background: '#eef4ff', display: 'grid', placeItems: 'center'}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"></circle><polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5"></polygon></svg></div>
                  <div><div style={{fontSize: '12px', fontWeight: '700', color: '#0f1729', letterSpacing: '-.1px', lineHeight: '1.2'}}>{t("Expert Guidance")}</div><div style={{fontSize: '10px', lineHeight: '1.35', color: '#6b7480', marginTop: '2px'}}>{t("Seasoned professionals.")}</div></div>
                </div>
                <div style={{display: 'flex', gap: '10px', opacity: '1', transform: 'none', transition: 'opacity .55s cubic-bezier(.34,1.45,.5,1),transform .55s cubic-bezier(.34,1.45,.5,1)'}}>
                  <div style={{width: '30px', height: '30px', flexShrink: '0', borderRadius: '8px', background: '#eef4ff', display: 'grid', placeItems: 'center'}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="7" width="10" height="10" rx="1.5"></rect><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"></path></svg></div>
                  <div><div style={{fontSize: '12px', fontWeight: '700', color: '#0f1729', letterSpacing: '-.1px', lineHeight: '1.2'}}>{t("Innovative Tech")}</div><div style={{fontSize: '10px', lineHeight: '1.35', color: '#6b7480', marginTop: '2px'}}>{t("React, .NET, SQL & more.")}</div></div>
                </div>
                <div style={{display: 'flex', gap: '10px', opacity: '1', transform: 'none', transition: 'opacity .55s cubic-bezier(.34,1.45,.5,1),transform .55s cubic-bezier(.34,1.45,.5,1)'}}>
                  <div style={{width: '30px', height: '30px', flexShrink: '0', borderRadius: '8px', background: '#eef4ff', display: 'grid', placeItems: 'center'}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 13v-1a8 8 0 0 1 16 0v1"></path><rect x="2.5" y="13" width="4" height="6" rx="1.6"></rect><rect x="17.5" y="13" width="4" height="6" rx="1.6"></rect></svg></div>
                  <div><div style={{fontSize: '12px', fontWeight: '700', color: '#0f1729', letterSpacing: '-.1px', lineHeight: '1.2'}}>{t("Timely Support")}</div><div style={{fontSize: '10px', lineHeight: '1.35', color: '#6b7480', marginTop: '2px'}}>{t("Proactive, low downtime.")}</div></div>
                </div>
                <div style={{display: 'flex', gap: '10px', opacity: '1', transform: 'none', transition: 'opacity .55s cubic-bezier(.34,1.45,.5,1),transform .55s cubic-bezier(.34,1.45,.5,1)'}}>
                  <div style={{width: '30px', height: '30px', flexShrink: '0', borderRadius: '8px', background: '#eef4ff', display: 'grid', placeItems: 'center'}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"></path><polyline points="20.5 4 20.5 8.5 16 8.5"></polyline></svg></div>
                  <div><div style={{fontSize: '12px', fontWeight: '700', color: '#0f1729', letterSpacing: '-.1px', lineHeight: '1.2'}}>{t("Continuous Improvement")}</div><div style={{fontSize: '10px', lineHeight: '1.35', color: '#6b7480', marginTop: '2px'}}>{t("Always current practices.")}</div></div>
                </div>
                <div style={{display: 'flex', gap: '10px', opacity: '1', transform: 'none', transition: 'opacity .55s cubic-bezier(.34,1.45,.5,1),transform .55s cubic-bezier(.34,1.45,.5,1)'}}>
                  <div style={{width: '30px', height: '30px', flexShrink: '0', borderRadius: '8px', background: '#eef4ff', display: 'grid', placeItems: 'center'}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 14.5l5-5"></path><path d="M11 6.5l1.2-1.2a3.4 3.4 0 0 1 4.8 4.8l-2 2"></path><path d="M13 17.5l-1.2 1.2a3.4 3.4 0 0 1-4.8-4.8l2-2"></path></svg></div>
                  <div><div style={{fontSize: '12px', fontWeight: '700', color: '#0f1729', letterSpacing: '-.1px', lineHeight: '1.2'}}>{t("Partnership Approach")}</div><div style={{fontSize: '10px', lineHeight: '1.35', color: '#6b7480', marginTop: '2px'}}>{t("Collaborative & open.")}</div></div>
                </div>
              </div>
            </div>
            <div className="hm-float-text" data-reveal="0" style={{opacity: '0', transform: 'translateY(24px)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)', maxWidth: '600px'}}>
              <div style={{fontSize: '12.5px', fontWeight: '700', color: '#7aa7ff', letterSpacing: '2px', textTransform: 'uppercase'}}>{t("How we think")}</div>
              <h2 style={{fontSize: '46px', fontWeight: '800', letterSpacing: '-1.6px', margin: '16px 0 0', lineHeight: '1.08', color: '#ffffff', textWrap: 'pretty'}}>{t("We don't just automate — we orchestrate.")}</h2>
              <p style={{fontSize: '17px', lineHeight: '1.65', color: 'rgba(255,255,255,.7)', margin: '16px 0 0'}}>{t("Align Business Systems is one team behind one platform. We connect finance, people and field operations so your whole company runs on a single source of truth — not five disconnected tools stitched together.")}</p>
            </div>
            <div className="hm-stack hm-float-last" data-reveal="1" style={{opacity: '0', transform: 'translateY(24px)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '20px', overflow: 'hidden', marginTop: '56px'}}>
              <div style={{background: '#131c2e', padding: '38px 34px', transition: 'background .3s ease,transform .3s ease'}} data-hv="hv-8">
                <div style={{position: 'relative', height: '44px', marginBottom: '22px', display: 'flex', alignItems: 'center'}}>
                  <div style={{position: 'absolute', insetInlineStart: '5px', insetInlineEnd: '5px', top: '50%', height: '2px', background: 'rgba(122,167,255,.22)'}}></div>
                  <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', width: '100%'}}><span style={{width: '11px', height: '11px', borderRadius: '50%', background: '#7aa7ff', animation: 'hwtPulse 1.8s ease-in-out 0s infinite'}}></span><span style={{width: '11px', height: '11px', borderRadius: '50%', background: '#7aa7ff', animation: 'hwtPulse 1.8s ease-in-out 0.22s infinite'}}></span><span style={{width: '11px', height: '11px', borderRadius: '50%', background: '#7aa7ff', animation: 'hwtPulse 1.8s ease-in-out 0.44s infinite'}}></span><span style={{width: '11px', height: '11px', borderRadius: '50%', background: '#7aa7ff', animation: 'hwtPulse 1.8s ease-in-out 0.66s infinite'}}></span></div>
                </div><div style={{fontSize: '12px', fontWeight: '700', color: '#7aa7ff', letterSpacing: '1.6px', textTransform: 'uppercase'}}>{t("Operations")}</div>
                <h3 style={{fontSize: '23px', fontWeight: '700', color: '#ffffff', letterSpacing: '-.4px', margin: '16px 0 0', lineHeight: '1.22'}}>{t("Every department, one system")}</h3>
                <p style={{fontSize: '15px', lineHeight: '1.65', color: 'rgba(255,255,255,.62)', margin: '12px 0 0'}}>{t("Finance, HR, field and cross-functional work run on shared data instead of five separate tools that never talk to each other.")}</p>
              </div>
              <div style={{background: '#131c2e', padding: '38px 34px', transition: 'background .3s ease,transform .3s ease'}} data-hv="hv-8">
                <div style={{position: 'relative', height: '44px', marginBottom: '22px'}}>
                  <div style={{position: 'absolute', insetInlineStart: '6px', insetInlineEnd: '6px', top: '50%', transform: 'translateY(-50%)', height: '2px', background: 'rgba(122,167,255,.22)'}}></div>
                  <div style={{position: 'absolute', top: '50%', insetInlineStart: '0', transform: 'translateY(-50%)', width: '13px', height: '13px', borderRadius: '50%', background: '#131c2e', border: '2px solid #7aa7ff'}}></div><div style={{position: 'absolute', top: '50%', insetInlineStart: '50%', marginInlineStart: '-6px', transform: 'translateY(-50%)', width: '13px', height: '13px', borderRadius: '50%', background: '#131c2e', border: '2px solid #7aa7ff'}}></div><div style={{position: 'absolute', top: '50%', insetInlineEnd: '0', transform: 'translateY(-50%)', width: '13px', height: '13px', borderRadius: '50%', background: '#131c2e', border: '2px solid #7aa7ff'}}></div>
                  <div style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', borderRadius: '50%', background: '#4b8bff', boxShadow: '0 0 12px rgba(75,139,255,.9)', animation: 'hwtFlow 2.4s ease-in-out infinite'}}></div>
                </div><div style={{fontSize: '12px', fontWeight: '700', color: '#7aa7ff', letterSpacing: '1.6px', textTransform: 'uppercase'}}>{t("Integration")}</div>
                <h3 style={{fontSize: '23px', fontWeight: '700', color: '#ffffff', letterSpacing: '-.4px', margin: '16px 0 0', lineHeight: '1.22'}}>{t("Nothing lives in a silo")}</h3>
                <p style={{fontSize: '15px', lineHeight: '1.65', color: 'rgba(255,255,255,.62)', margin: '12px 0 0'}}>{t("Payments, attendance, approvals and reporting connect natively — no middleware, no exports, no manual sync.")}</p>
              </div>
              <div style={{background: '#131c2e', padding: '38px 34px', transition: 'background .3s ease,transform .3s ease'}} data-hv="hv-8">
                <div style={{height: '44px', marginBottom: '22px', display: 'flex', alignItems: 'flex-end', gap: '5px'}}><div style={{width: '7px', borderRadius: '2px 2px 0 0', background: '#7aa7ff', height: '40%', animation: 'hwtBar 2s ease-in-out 0s infinite'}}></div><div style={{width: '7px', borderRadius: '2px 2px 0 0', background: '#7aa7ff', height: '40%', animation: 'hwtBar 2s ease-in-out 0.15s infinite'}}></div><div style={{width: '7px', borderRadius: '2px 2px 0 0', background: '#7aa7ff', height: '40%', animation: 'hwtBar 2s ease-in-out 0.3s infinite'}}></div><div style={{width: '7px', borderRadius: '2px 2px 0 0', background: '#7aa7ff', height: '40%', animation: 'hwtBar 2s ease-in-out 0.45s infinite'}}></div><div style={{width: '7px', borderRadius: '2px 2px 0 0', background: '#7aa7ff', height: '40%', animation: 'hwtBar 2s ease-in-out 0.6s infinite'}}></div><span style={{alignSelf: 'center', marginInlineStart: '7px', width: '8px', height: '8px', borderRadius: '50%', background: '#39d98a', animation: 'pulseDot 2s ease-in-out infinite'}}></span></div><div style={{fontSize: '12px', fontWeight: '700', color: '#7aa7ff', letterSpacing: '1.6px', textTransform: 'uppercase'}}>{t("Intelligence")}</div>
                <h3 style={{fontSize: '23px', fontWeight: '700', color: '#ffffff', letterSpacing: '-.4px', margin: '16px 0 0', lineHeight: '1.22'}}>{t("Dashboards that decide, not just display")}</h3>
                <p style={{fontSize: '15px', lineHeight: '1.65', color: 'rgba(255,255,255,.62)', margin: '12px 0 0'}}>{t("Live visibility into every process, with the context to act on it — not just a report to read after the fact.")}</p>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
