import LogoSlot from './LogoSlot';
import { useLanguage } from '../../../context/LanguageContext';

export default function ClientsSection() {
  const { t } = useLanguage();
  return (
    <>
      <section data-screen-label="Clients" className="ag" style={{background: '#ffffff', borderTop: '1px solid #f0f3f8', overflow: 'hidden'}}>
          <div style={{maxWidth: '1240px', margin: '0 auto', padding: '72px 32px', position: 'relative'}}>
            <div style={{position: 'relative'}}>
              <div className="hm-logogrid" style={{display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gridAutoRows: '100px', gap: '12px'}}>
              <div style={{background: '#1a56db', borderRadius: '50%'}}></div>
              <LogoSlot />
              <div style={{background: '#e8effc', borderRadius: '18px'}}></div>
              <div></div>
              <div style={{background: '#e8effc', borderRadius: '50%'}}></div>
              <LogoSlot />
              <LogoSlot />
              <div style={{background: '#e8effc', borderRadius: '18px'}}></div>
              <LogoSlot />
              <div style={{background: '#1a56db', borderRadius: '18px'}}></div>
              <div style={{background: '#e8effc', borderRadius: '18px'}}></div>
              <div style={{background: '#e8effc', borderRadius: '18px 60% 18px 18px'}}></div>
              <div style={{background: '#e8effc', borderRadius: '18px'}}></div>
              <div style={{background: '#e8effc', borderRadius: '18px 18px 60% 18px'}}></div>
              <div style={{background: '#1a56db', borderRadius: '50%'}}></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div style={{background: '#dce7fb', borderRadius: '18px 18px 60% 18px'}}></div>
              <div style={{background: '#e8effc', borderRadius: '18px'}}></div>
              <div style={{background: '#1a56db', borderRadius: '50%'}}></div>
              <LogoSlot />
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div style={{background: '#e8effc', borderRadius: '18px'}}></div>
              <div style={{background: '#dce7fb', borderRadius: '50%'}}></div>
              <div style={{background: '#e8effc', borderRadius: '18px'}}></div>
              <div style={{background: '#dce7fb', borderRadius: '18px'}}></div>
              <LogoSlot />
              <LogoSlot />
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div style={{background: '#e8effc', borderRadius: '18px'}}></div>
              <div style={{background: '#1a56db', borderRadius: '18px'}}></div>
              <LogoSlot />
              <div></div>
              <div style={{background: '#1a56db', borderRadius: '18px'}}></div>
              <LogoSlot />
              <LogoSlot />
              <div></div>
              <div style={{background: '#e8effc', borderRadius: '50%'}}></div>
              <LogoSlot />
              <div style={{background: '#1a56db', borderRadius: '18px'}}></div>
              <LogoSlot />
              <div></div>
              <div></div>
              </div>
            </div>
      
            
            <div style={{position: 'absolute', top: '50%', insetInlineStart: '50%', transform: 'translate(-50%,-50%)', width: '720px', maxWidth: 'calc(100% - 40px)', padding: '34px 52px', textAlign: 'center', background: '#ffffff', borderRadius: '130px', boxShadow: '0 0 0 12px #ffffff', zIndex: '5'}}>
              <h2 style={{fontSize: '32px', fontWeight: '700', letterSpacing: '-1px', margin: '0', lineHeight: '1.15', color: '#0f1729', textWrap: 'pretty'}}>{t('The businesses that grow with')} <span style={{color: '#1a56db'}}>Align</span></h2>
              <p style={{fontSize: '15px', color: '#5b6472', margin: '12px 0 0'}}>{t("Manufacturers, pharma teams, retailers and service companies — running on our software every day.")}</p>
            </div>
          </div>
        </section>
    </>
  );
}
