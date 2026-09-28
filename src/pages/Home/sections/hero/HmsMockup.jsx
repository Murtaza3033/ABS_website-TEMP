import { useLanguage } from '../../../../context/LanguageContext';

/* HMSflo hero mockup — a static dashboard screenshot in the same frame and
   scale wrapper as the other products. Swap the image file to update it. */
export const HMS_SCREENSHOT = '/assets/images/hero/hmsflo-dashboard.webp';

export default function HmsMockup({ scrollRegion }) {
  const { t } = useLanguage();
  return (
    <div className="hm-float-wrap" style={{ position: 'relative', animation: 'slideInR .55s cubic-bezier(.2,.7,.3,1) both' }}>
      <div className="hm-scale-scroll-wrap hm-float-main" {...scrollRegion} style={{ '--hm-w': '1040px', '--hm-h': '580px' }}>
        <div className="hm-scale-scroll" style={{ background: '#ffffff', border: '1px solid #e7ecf5', borderRadius: '16px', boxShadow: '0 50px 100px -40px rgba(15,23,41,.35)', overflow: 'hidden' }}>
          <img src={HMS_SCREENSHOT} width="1040" height="580" alt={t('HMSflo hospital management dashboard')} style={{ display: 'block', width: '100%', height: 'auto' }} />
        </div>
      </div>
    </div>
  );
}
