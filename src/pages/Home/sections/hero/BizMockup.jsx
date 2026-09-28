import { useHome, pressable } from '../../HomeContext';
import { useLanguage } from '../../../../context/LanguageContext';

/* Businessflo hero mockup (approvals list, AI/Chats/Tickets panel, approval
   donut). Rendered by HeroSection while Businessflo is the active product. */
export default function BizMockup({ scrollRegion }) {
  'use no memo'; // Compiler skipped this markup before the split; memoizing its ~300 inline styles adds ~20 KB per mockup.
  const { c, b, act, state } = useHome();
  const { t } = useLanguage();
  // donut ring proportions from live counts (was setDonut())
  const { a, p, r } = state.counts;
  const tot = a + p + r;
  const aDeg = tot ? (a / tot) * 360 : 0;
  const pDeg = tot ? (p / tot) * 360 : 0;
  const donutBg = `conic-gradient(#64748b 0deg ${aDeg}deg,#f5b40a ${aDeg}deg ${aDeg + pDeg}deg,#e5484d ${aDeg + pDeg}deg 360deg)`;
  // approval-row pill colours per outcome (was actRow's pill styling)
  const PILL = {
    approved: { color: '#157d44', background: '#e6f5ec' },
    hold: { color: '#926702', background: '#fdf3d7' },
    rejected: { color: '#e5484d', background: '#fdeaea' },
  };
  const pill = (i) => PILL[state.rows[i]] || PILL.approved;
  return (
    <>
            <div className="hm-float-wrap" style={{position: 'relative', animation: 'slideInR .55s cubic-bezier(.2,.7,.3,1) both'}}>
              <div className="hm-scale-scroll-wrap hm-float-main" {...scrollRegion} style={{'--hm-w': '1040px', '--hm-h': '580px'}}>
              <div className="hm-scale-scroll" style={{background: '#ffffff', border: '1px solid #e7ecf5', borderRadius: '16px', boxShadow: '0 50px 100px -40px rgba(15,23,41,.35)', overflow: 'hidden'}}>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 18px', borderBottom: '1px solid #eef1f6'}}>
                  <span style={{display: 'flex', flexDirection: 'column', gap: '3px'}}><span style={{width: '16px', height: '2px', background: '#39404d', borderRadius: '2px'}}></span><span style={{width: '16px', height: '2px', background: '#39404d', borderRadius: '2px'}}></span><span style={{width: '16px', height: '2px', background: '#39404d', borderRadius: '2px'}}></span></span>
                  <img src="/assets/images/logos/businessflo-logo-6e685b87.png" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} alt="Businessflo" style={{height: '20px', display: 'block'}} />
                  <span style={{marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: '14px', color: '#5b6472'}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5b6472" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5"></path><path d="M9 10.7V4h6v6.7l2 3.3H7z"></path></svg>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5b6472" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8"></path><path d="M5 10v10h14V10"></path></svg>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5b6472" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4-4"></path></svg>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5b6472" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <span style={{position: 'relative'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5b6472" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg><span style={{position: 'absolute', top: '-7px', insetInlineEnd: '-8px', background: '#e5484d', color: '#fff', fontSize: '8px', fontWeight: '700', borderRadius: '99px', padding: '1px 5px'}}>20</span></span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '7px'}}><span style={{width: '26px', height: '26px', borderRadius: '50%', background: '#0e9384', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '9px', fontWeight: '700'}}>AB</span><span style={{fontSize: '10px', fontWeight: '700', color: '#0f1729', lineHeight: '1.2'}}>Align Business Systems</span></span>
                  </span>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '9px 18px', borderBottom: '1px solid #f0f3f8', fontSize: '10.5px', color: '#39404d', overflow: 'hidden'}}>
                  <span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("System Administration")}</span><span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("Organizational Structure")}</span><span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("Budget")}</span><span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("General Ledger")}</span><span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("Accounts Payable")}</span><span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("Accounts Receivable")}</span><span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("Cash & Bank")}</span><span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("Expense Management")}</span><span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("Tax Controlling")}</span><span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("Fixed Asset")}</span><span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("Product Information")}</span><span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("Inventory Control")}</span><span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("Procurement & Sourcing")}</span><span style={{whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color .15s'}} data-hv="hv-1">{t("Sales & Distribution")}</span>
                  <span style={{marginInlineStart: 'auto', display: 'flex', gap: '8px', color: '#657085', flexShrink: '0'}}>‹ › ⚙</span>
                </div>
                
                <div style={{background: '#f3f5fb', padding: '16px'}}>
                  <div style={{display: 'flex', gap: '14px'}}>
                    <div style={{flex: '1.5', background: '#ffffff', borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px'}}>
                      <span style={{width: '44px', height: '44px', borderRadius: '50%', border: '5px solid #f5a623', borderInlineStartColor: 'transparent', transform: 'rotate(35deg)', flexShrink: '0'}}></span>
                      <span><span style={{display: 'block', fontSize: '17px', fontWeight: '800', color: '#0f1729'}}>{t("Hello 👋")}</span><span style={{display: 'block', fontSize: '11px', color: '#657085', marginTop: '1px'}}>{t("Good evening")}</span><span style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#1a56db', marginTop: '3px'}}>Align Business Systems – UAT</span></span>
                    </div>
                    <div style={{flex: '.8', background: '#ffffff', borderRadius: '14px', padding: '14px 16px'}}>
                      <span style={{fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', color: '#657085'}}>{t("CURRENT TIME")}</span>
                      <span style={{display: 'block', fontSize: '22px', fontWeight: '800', color: '#0f1729', marginTop: '3px'}}><span>{b('clockTime')}</span> <span style={{fontSize: '12px', color: '#1a56db'}}><span>{b('clockAmPm')}</span></span></span>
                      <span style={{display: 'block', fontSize: '11px', fontWeight: '700', color: '#39404d', marginTop: '2px'}}><span>{t(b('clockDay'))}</span> <span style={{fontWeight: '400', color: '#657085'}}><span>{b('clockDate').replace(/[A-Za-z]+/, (m) => t(m))}</span></span></span>
                    </div>
                    <div style={{flex: '1.1', background: '#ffffff', borderRadius: '14px', padding: '14px 16px'}}>
                      <span style={{fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px', color: '#657085'}}>{t("QUICK ACTIONS")}</span>
                      <span style={{display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #eef1f6', borderRadius: '10px', padding: '9px 12px', marginTop: '8px', cursor: 'pointer'}} data-hv="hv-2"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="3" width="8" height="4" rx="1"></rect><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path></svg><span style={{fontSize: '12px', fontWeight: '600', color: '#39404d'}}>{t("Functional Area")}</span></span>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '12px', marginTop: '14px'}}>
                    <div style={{flex: '1', background: '#ffffff', border: '1px solid #eef1f6', borderRadius: '12px', padding: '13px 15px', display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer', transition: 'box-shadow .2s,transform .2s'}} data-hv="hv-3"><span style={{width: '30px', height: '30px', borderRadius: '9px', background: '#e8effc', display: 'grid', placeItems: 'center', flexShrink: '0'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="3" width="8" height="4" rx="1"></rect><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path></svg></span><span><span style={{display: 'block', fontSize: '19px', fontWeight: '800', color: '#0f1729', lineHeight: '1'}}>20</span><span style={{display: 'block', fontSize: '10px', color: '#5b6472', marginTop: '3px'}}>{t("For Approval")}</span></span></div>
                    <div style={{flex: '1', background: '#ffffff', border: '1px solid #eef1f6', borderRadius: '12px', padding: '13px 15px', display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer', transition: 'box-shadow .2s,transform .2s'}} data-hv="hv-3"><span style={{width: '30px', height: '30px', borderRadius: '9px', background: '#e3f6ec', display: 'grid', placeItems: 'center', flexShrink: '0'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a9d55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"></path></svg></span><span><span style={{display: 'block', fontSize: '19px', fontWeight: '800', color: '#0f1729', lineHeight: '1'}}>0</span><span style={{display: 'block', fontSize: '10px', color: '#5b6472', marginTop: '3px'}}>{t("Sent for Approval")}</span></span></div>
                    <div style={{flex: '1', background: '#ffffff', border: '1px solid #eef1f6', borderRadius: '12px', padding: '13px 15px', display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer', transition: 'box-shadow .2s,transform .2s'}} data-hv="hv-3"><span style={{width: '30px', height: '30px', borderRadius: '9px', background: '#fdf3d7', display: 'grid', placeItems: 'center', flexShrink: '0'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b78103" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg></span><span><span style={{display: 'block', fontSize: '19px', fontWeight: '800', color: '#0f1729', lineHeight: '1'}}>0</span><span style={{display: 'block', fontSize: '10px', color: '#5b6472', marginTop: '3px'}}>{t("Open Tasks")}</span></span></div>
                    <div style={{flex: '1', background: '#ffffff', border: '1px solid #eef1f6', borderRadius: '12px', padding: '13px 15px', display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer', transition: 'box-shadow .2s,transform .2s'}} data-hv="hv-3"><span style={{width: '30px', height: '30px', borderRadius: '9px', background: '#f0eafd', display: 'grid', placeItems: 'center', flexShrink: '0'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7a4fd6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.7 21a2 2 0 0 1-3.4 0"></path></svg></span><span><span style={{display: 'block', fontSize: '19px', fontWeight: '800', color: '#0f1729', lineHeight: '1'}}>0</span><span style={{display: 'block', fontSize: '10px', color: '#5b6472', marginTop: '3px'}}>{t("Notifications")}</span></span></div>
                    <div style={{flex: '1', background: '#ffffff', border: '1px solid #eef1f6', borderRadius: '12px', padding: '13px 15px', display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer', transition: 'box-shadow .2s,transform .2s'}} data-hv="hv-3"><span style={{width: '30px', height: '30px', borderRadius: '9px', background: '#fdeaea', display: 'grid', placeItems: 'center', flexShrink: '0'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e5484d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg></span><span><span style={{display: 'block', fontSize: '19px', fontWeight: '800', color: '#0f1729', lineHeight: '1'}}>0</span><span style={{display: 'block', fontSize: '10px', color: '#5b6472', marginTop: '3px'}}>{t("Messages")}</span></span></div>
                  </div>
                  <div style={{display: 'flex', gap: '14px', marginTop: '14px'}}>
                    <div style={{flex: '1', background: '#ffffff', borderRadius: '14px', padding: '16px 18px'}}>
                      <div style={{display: 'flex', alignItems: 'center'}}><span style={{fontSize: '13px', fontWeight: '700', color: '#0f1729'}}>{t("My Active Approvals")}</span><span style={{marginInlineStart: 'auto', fontSize: '10px', fontWeight: '600', color: '#1a56db', cursor: 'pointer'}}>{t("View All")}</span></div>
                      <div style={{display: 'flex', gap: '11px', padding: '12px 0', borderTop: '1px solid #f0f3f8'}}>
        <span style={{width: '26px', height: '26px', borderRadius: '8px', background: '#eef2fb', display: 'grid', placeItems: 'center', flexShrink: '0'}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path><path d="M14 3v5h5"></path></svg></span>
        <span style={{flex: '1', minWidth: '0'}}>
          <span style={{display: 'flex', alignItems: 'center', fontSize: '11.5px', fontWeight: '600', color: '#0f1729', lineHeight: '1.4'}}><span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: '0'}}>{t("Approval Request: Employee Leaves Request (ELCL0401)")}</span><span style={{display: 'inline-flex', alignItems: 'center', gap: '9px', marginInlineStart: '12px', flexShrink: '0', fontSize: '10px', fontWeight: '700'}}>{c('rowOpen0') && (<><span {...pressable(() => act('act0a'))} style={{color: '#157d44', cursor: 'pointer'}}>{t("Approve")}</span><span {...pressable(() => act('act0h'))} style={{color: '#926702', cursor: 'pointer'}}>{t("Hold")}</span><span {...pressable(() => act('act0r'))} style={{color: '#e5484d', cursor: 'pointer'}}>{t("Reject")}</span></>)}{c('rowDone0') && (<><span style={{...pill(0), borderRadius: '99px', padding: '2px 10px'}}><span>{t(b('rowLabel0'))}</span></span></>)}</span></span>
          <span style={{display: 'block', fontSize: '10px', color: '#5b6472', marginTop: '3px'}}><b style={{color: '#39404d'}}>{t("Process:")}</b>{" "}{t("Employee Leaves Request")}{"  |  "}<b style={{color: '#39404d'}}>{t("Trans #:")}</b> ELCL0401</span>
          <span style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}><span style={{fontSize: '9.5px', color: '#657085'}}>{t("19-Jun-2026 · 2 weeks ago")}</span><span style={{marginInlineStart: 'auto', fontSize: '10px', fontWeight: '600', color: '#1a56db', cursor: 'pointer'}}>{t("Open ↗")}</span></span>
        </span></div>
                      <div style={{display: 'flex', gap: '11px', padding: '12px 0', borderTop: '1px solid #f0f3f8'}}>
        <span style={{width: '26px', height: '26px', borderRadius: '8px', background: '#eef2fb', display: 'grid', placeItems: 'center', flexShrink: '0'}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path><path d="M14 3v5h5"></path></svg></span>
        <span style={{flex: '1', minWidth: '0'}}>
          <span style={{display: 'flex', alignItems: 'center', fontSize: '11.5px', fontWeight: '600', color: '#0f1729', lineHeight: '1.4'}}><span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: '0'}}>{t("Approval Request: Purchase Order (C01LPO25000203)")}</span><span style={{display: 'inline-flex', alignItems: 'center', gap: '9px', marginInlineStart: '12px', flexShrink: '0', fontSize: '10px', fontWeight: '700'}}>{c('rowOpen1') && (<><span {...pressable(() => act('act1a'))} style={{color: '#157d44', cursor: 'pointer'}}>{t("Approve")}</span><span {...pressable(() => act('act1h'))} style={{color: '#926702', cursor: 'pointer'}}>{t("Hold")}</span><span {...pressable(() => act('act1r'))} style={{color: '#e5484d', cursor: 'pointer'}}>{t("Reject")}</span></>)}{c('rowDone1') && (<><span style={{...pill(1), borderRadius: '99px', padding: '2px 10px'}}><span>{t(b('rowLabel1'))}</span></span></>)}</span></span>
          <span style={{display: 'block', fontSize: '10px', color: '#5b6472', marginTop: '3px'}}><b style={{color: '#39404d'}}>{t("Process:")}</b>{" "}{t("Purchase Order")}{"  |  "}<b style={{color: '#39404d'}}>{t("Trans #:")}</b> C01LPO25000203</span>
          <span style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}><span style={{fontSize: '9.5px', color: '#657085'}}>{t("10-Jun-2026 · 3 weeks ago")}</span><span style={{marginInlineStart: 'auto', fontSize: '10px', fontWeight: '600', color: '#1a56db', cursor: 'pointer'}}>{t("Open ↗")}</span></span>
        </span></div>
                      <div style={{display: 'flex', gap: '11px', padding: '12px 0', borderTop: '1px solid #f0f3f8'}}>
        <span style={{width: '26px', height: '26px', borderRadius: '8px', background: '#eef2fb', display: 'grid', placeItems: 'center', flexShrink: '0'}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path><path d="M14 3v5h5"></path></svg></span>
        <span style={{flex: '1', minWidth: '0'}}>
          <span style={{display: 'flex', alignItems: 'center', fontSize: '11.5px', fontWeight: '600', color: '#0f1729', lineHeight: '1.4'}}><span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: '0'}}>{t("Approval Request: Purchase Requisition (C01PR26000278)")}</span><span style={{display: 'inline-flex', alignItems: 'center', gap: '9px', marginInlineStart: '12px', flexShrink: '0', fontSize: '10px', fontWeight: '700'}}>{c('rowOpen2') && (<><span {...pressable(() => act('act2a'))} style={{color: '#157d44', cursor: 'pointer'}}>{t("Approve")}</span><span {...pressable(() => act('act2h'))} style={{color: '#926702', cursor: 'pointer'}}>{t("Hold")}</span><span {...pressable(() => act('act2r'))} style={{color: '#e5484d', cursor: 'pointer'}}>{t("Reject")}</span></>)}{c('rowDone2') && (<><span style={{...pill(2), borderRadius: '99px', padding: '2px 10px'}}><span>{t(b('rowLabel2'))}</span></span></>)}</span></span>
          <span style={{display: 'block', fontSize: '10px', color: '#5b6472', marginTop: '3px'}}><b style={{color: '#39404d'}}>{t("Process:")}</b>{" "}{t("Purchase Requisition")}{"  |  "}<b style={{color: '#39404d'}}>{t("Trans #:")}</b> C01PR26000278</span>
          <span style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}><span style={{fontSize: '9.5px', color: '#657085'}}>{t("10-Jun-2026 · 3 weeks ago")}</span><span style={{marginInlineStart: 'auto', fontSize: '10px', fontWeight: '600', color: '#1a56db', cursor: 'pointer'}}>{t("Open ↗")}</span></span>
        </span></div>
                    </div>

                  </div>
                </div>
              </div>
              </div>
              <div className="hm-annotate" style={{position: 'absolute', top: '-186px', insetInlineStart: '-14px', width: '300px', textAlign: 'center', zIndex: '7', pointerEvents: 'none', display: state.tour ? undefined : 'none'}}>
                <div style={{fontFamily: 'Caveat,cursive', fontWeight: '700', fontSize: '38px', letterSpacing: '.5px', color: '#1a56db', lineHeight: '1', transform: 'rotate(-3deg)'}}>{t("AI Hub")}</div>
                <div style={{fontFamily: 'Outfit,sans-serif', fontSize: '12px', fontWeight: '500', color: '#1a56db', lineHeight: '1.4', marginTop: '4px'}}>{t("AI chat, support tickets & quick help —")}<br />{t("built into every interactive field")}</div>
                <svg width="84" height="74" viewBox="0 0 84 74" fill="none" style={{marginTop: '2px', marginInlineStart: '104px'}}><path d="M44 8 C 10 6, 8 44, 38 38 C 60 34, 48 60, 44 70" stroke="#1a56db" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{strokeDasharray: '240', animation: 'drawCurve 2.6s ease-in-out infinite'}}></path><path d="M44 70 L 33 56 M44 70 L 56 58" stroke="#1a56db" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" style={{animation: 'drawHead 2.6s ease-in-out infinite'}}></path></svg>
              </div>
              <span className="hm-float-caption">{t("✨ Built-in AI assistant")}</span>
              <div className="hm-float" style={{position: 'absolute', top: '-30px', insetInlineStart: '-14px', zIndex: '6', width: '300px', borderRadius: '16px', overflow: 'hidden', background: '#ffffff', border: '1px solid #e9edf4', boxShadow: '0 30px 60px -22px rgba(15,23,41,.34)', animation: 'floatY 6.5s ease-in-out infinite'}}>
        <div style={{display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg,#2c6ef2,#6d5df6)', padding: '11px 15px'}}>
          <span style={{fontSize: '13px', fontWeight: '700', color: '#ffffff'}}>✦ <span>{t(b('aiTitle'))}</span></span>
          <span style={{marginInlineStart: 'auto', fontSize: '12px', color: 'rgba(255,255,255,.8)', cursor: 'pointer'}}>✕</span>
        </div>
        <div style={{display: 'flex', gap: '16px', padding: '9px 15px', borderBottom: '1px solid #eef1f6', fontSize: '11px'}}>
          <span data-act="setAI" {...pressable(() => act('setAI'))} style={{fontWeight: '700', color: '#1a56db', borderBottom: '2px solid #1a56db', paddingBottom: '5px', cursor: 'pointer'}}>烙 AI</span>
          <span data-act="setChats" {...pressable(() => act('setChats'))} style={{fontWeight: '700', color: '#657085', borderBottom: '2px solid transparent', paddingBottom: '5px', cursor: 'pointer'}}> {t("Chats")}</span>
          <span data-act="setTickets" {...pressable(() => act('setTickets'))} style={{fontWeight: '700', color: '#657085', borderBottom: '2px solid transparent', paddingBottom: '5px', cursor: 'pointer'}}> {t("Tickets")}</span>
        </div>
      
        {c('aiTabAI') && (<>
          <div style={{padding: '12px', background: '#fbfcfe'}}>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}><span style={{maxWidth: '82%', background: '#1a56db', color: '#ffffff', fontSize: '11px', lineHeight: '1.5', borderRadius: '12px 12px 4px 12px', padding: '8px 11px'}}>{t("Show pending approvals for this week.")}</span></div>
            <div style={{display: 'flex', marginTop: '9px'}}><span style={{maxWidth: '88%', background: '#ffffff', border: '1px solid #e9edf4', color: '#39404d', fontSize: '11px', lineHeight: '1.55', borderRadius: '12px 12px 12px 4px', padding: '8px 11px'}}>{t("You have")} <b>{t("5 pending approvals")}</b>{t(": 2 Purchase Orders, 2 Expense Claims and 1 Leave Request. Oldest — PO C01LPO25000203.")}</span></div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 13px', borderTop: '1px solid #eef1f6'}}>
            <span style={{flex: '1', background: '#f3f5fb', borderRadius: '99px', padding: '7px 13px', fontSize: '11px', color: '#657085'}}>{t("Ask the assistant…")}</span>
            <span style={{width: '24px', height: '24px', borderRadius: '50%', background: '#e8effc', display: 'grid', placeItems: 'center', fontSize: '11px', color: '#1a56db'}}>➤</span>
          </div>
        </>)}
      
        {c('aiTabChats') && (<>
          {c('chatIsOpen') && (<>
            <div style={{background: '#fbfcfe'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 13px', borderBottom: '1px solid #eef1f6', background: '#ffffff'}}>
                <span {...pressable(() => act('closeChat'))} style={{fontSize: '15px', color: '#1a56db', cursor: 'pointer'}}>←</span>
                <span style={{width: '26px', height: '26px', borderRadius: '50%', background: '#1a56db', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: '700'}}><span>{b('chatInitials')}</span></span>
                <span><span style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#0f1729'}}><span>{b('chatName')}</span></span><span style={{display: 'block', fontSize: '9px', color: '#157d44'}}>{t("● Online")}</span></span>
              </div>
              <div style={{padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '118px'}}>
                <span style={{alignSelf: 'flex-start', maxWidth: '80%', background: '#ffffff', border: '1px solid #e9edf4', color: '#39404d', fontSize: '11px', lineHeight: '1.5', borderRadius: '12px 12px 12px 4px', padding: '7px 10px'}}>Hi </span>
                <span style={{alignSelf: 'flex-end', maxWidth: '80%', background: '#1a56db', color: '#fff', fontSize: '11px', lineHeight: '1.5', borderRadius: '12px 12px 4px 12px', padding: '7px 10px'}}>{t("Hello! Sharing the approval summary shortly.")}</span>
                <span style={{alignSelf: 'flex-start', maxWidth: '80%', background: '#ffffff', border: '1px solid #e9edf4', color: '#39404d', fontSize: '11px', lineHeight: '1.5', borderRadius: '12px 12px 12px 4px', padding: '7px 10px'}}>{t("Perfect, thanks.")}</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 13px', borderTop: '1px solid #eef1f6', background: '#ffffff'}}>
                <span style={{flex: '1', background: '#f3f5fb', borderRadius: '99px', padding: '7px 13px', fontSize: '11px', color: '#657085'}}>{t("Type a message…")}</span>
                <span style={{width: '24px', height: '24px', borderRadius: '50%', background: '#e8effc', display: 'grid', placeItems: 'center', fontSize: '11px', color: '#1a56db'}}>➤</span>
              </div>
            </div>
          </>)}
          {c('chatListOpen') && (<>
            <div style={{background: '#ffffff'}}>
              <div style={{padding: '11px 13px 4px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e6e9ef', borderRadius: '10px', padding: '8px 11px'}}>
                  <span style={{color: '#657085', fontSize: '12px'}}></span>
                  <span style={{display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: '12px', color: '#0f1729', borderInlineEnd: '1.5px solid #1a56db', paddingInlineEnd: '1px', animation: 'typeChat 5s cubic-bezier(.5,0,.5,1) infinite, caretB 1s steps(1) infinite'}}>Zai</span>
                </div>
              </div>
              <div style={{padding: '4px 8px'}}><div {...pressable(() => act('openC0'))} style={{display: 'flex', alignItems: 'center', gap: '11px', padding: '9px 6px', borderRadius: '10px', cursor: 'pointer'}} data-hv="hv-4"><span style={{width: '32px', height: '32px', borderRadius: '50%', background: '#c2410c', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: '700', flexShrink: '0'}}>ZM</span><span style={{flex: '1', minWidth: '0'}}><span style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#0f1729'}}>{t("Zainab Malik")}</span><span style={{display: 'block', fontSize: '10px', color: '#657085'}}>hi</span></span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"></path></svg></div></div>
              <div style={{fontSize: '9px', fontWeight: '700', letterSpacing: '1px', color: '#657085', padding: '6px 14px 3px'}}>{t("START A NEW CHAT")}</div>
              <div style={{padding: '0 8px 8px'}}>
                <div {...pressable(() => act('openC1'))} style={{display: 'flex', alignItems: 'center', gap: '11px', padding: '9px 6px', borderRadius: '10px', cursor: 'pointer'}} data-hv="hv-4"><span style={{width: '32px', height: '32px', borderRadius: '50%', background: '#0e9384', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: '700', flexShrink: '0'}}>BS</span><span style={{flex: '1', minWidth: '0'}}><span style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#0f1729'}}>{t("Bilal Sattar")}</span></span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"></path></svg></div>
                <div {...pressable(() => act('openC2'))} style={{display: 'flex', alignItems: 'center', gap: '11px', padding: '9px 6px', borderRadius: '10px', cursor: 'pointer'}} data-hv="hv-4"><span style={{width: '32px', height: '32px', borderRadius: '50%', background: '#dc2626', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: '700', flexShrink: '0'}}>HN</span><span style={{flex: '1', minWidth: '0'}}><span style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#0f1729'}}>{t("Hooria Naveed")}</span></span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"></path></svg></div>
                <div {...pressable(() => act('openC3'))} style={{display: 'flex', alignItems: 'center', gap: '11px', padding: '9px 6px', borderRadius: '10px', cursor: 'pointer'}} data-hv="hv-4"><span style={{width: '32px', height: '32px', borderRadius: '50%', background: '#ea580c', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: '700', flexShrink: '0'}}>UT</span><span style={{flex: '1', minWidth: '0'}}><span style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#0f1729'}}>{t("Usman Tariq")}</span></span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"></path></svg></div>
                <div {...pressable(() => act('openC4'))} style={{display: 'flex', alignItems: 'center', gap: '11px', padding: '9px 6px', borderRadius: '10px', cursor: 'pointer'}} data-hv="hv-4"><span style={{width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: '700', flexShrink: '0'}}>MA</span><span style={{flex: '1', minWidth: '0'}}><span style={{display: 'block', fontSize: '12px', fontWeight: '700', color: '#0f1729'}}>{t("Mehwish Anwar")}</span></span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"></path></svg></div>
              </div>
            </div>
          </>)}
        </>)}
      
        {c('aiTabTickets') && (<>
          <div style={{background: '#ffffff', minHeight: '210px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px 20px'}}>
            <span style={{color: '#c3cad6'}}></span>
            <span style={{fontSize: '13px', fontWeight: '700', color: '#39404d', marginTop: '12px'}}>{t("Not connected to Beep")}</span>
            <span style={{fontSize: '11px', color: '#657085', marginTop: '4px'}}>{t("Connect to raise and track tickets.")}</span>
          </div>
        </>)}
      </div>
              
            <span className="hm-float-caption">{t("📊 Live approval tracking")}</span>
            <div className="hm-float" style={{position: 'absolute', bottom: '-24px', insetInlineEnd: '-22px', zIndex: '20', width: '322px', animation: 'floatY2 7.5s ease-in-out infinite'}}><div style={{background: '#ffffff', border: '1px solid #eef1f6', borderRadius: '18px', boxShadow: '0 40px 80px -26px rgba(15,23,41,.4)', padding: '20px 22px', transformOrigin: 'top left', animation: 'emerge 1.1s cubic-bezier(.2,.7,.3,1) both'}}>
        <div style={{fontSize: '15px', fontWeight: '700', color: '#0f1729'}}>{t("Approval Status")}</div>
        <div style={{fontSize: '11px', color: '#657085'}}>{t("This Month")}</div>
        <div style={{display: 'grid', placeItems: 'center', padding: '16px 0 12px'}}>
          <div style={{width: '170px', height: '170px', borderRadius: '50%', background: donutBg, display: 'grid', placeItems: 'center', transition: 'background .4s ease'}}>
            <div style={{width: '116px', height: '116px', borderRadius: '50%', background: '#ffffff', display: 'grid', placeItems: 'center'}}><span style={{textAlign: 'center'}}><span style={{display: 'block', fontSize: '40px', fontWeight: '800', color: '#0f1729', lineHeight: '1'}}><span>{b('totalCount')}</span></span><span style={{display: 'block', fontSize: '12px', color: '#657085', marginTop: '3px'}}>{t("Total")}</span></span></div>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap'}}>
          <span style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: '#39404d'}}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#64748b'}}></span>{t("Approved")} <b><span>{b('approvedCount')}</span></b></span>
          <span style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: '#39404d'}}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#f5b40a'}}></span>{t("Pending")} <b><span>{b('pendingCount')}</span></b></span>
          <span style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: '#39404d'}}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#e5484d'}}></span>{t("Rejected")} <b><span>{b('rejectedCount')}</span></b></span>
        </div>
      </div></div>
            </div>
    </>
  );
}