import { useLanguage } from '../../../../context/LanguageContext';
import { getSanityImageUrl } from '../../../../lib/sanity';
import { locT } from '../../../../lib/loc';

/* HMSflo hero mockup — a static dashboard screenshot in the same frame and
   scale wrapper as the other products. The CMS "Hero screenshot" (product →
   Home page hero) wins; the bundled file is the fallback. */
export const HMS_SCREENSHOT = '/assets/images/hero/hmsflo-dashboard.webp';

export default function HmsMockup({ scrollRegion, image }) {
  const { t, lang } = useLanguage();
  const src = getSanityImageUrl(image, { width: 2080 }) || HMS_SCREENSHOT;
  const alt = locT(image?.alt, lang, t) || t('HMSflo hospital management dashboard');
  return (
    <div className="hm-float-wrap" style={{ position: 'relative', animation: 'slideInR .55s cubic-bezier(.2,.7,.3,1) both' }}>
      <div className="hm-scale-scroll-wrap hm-float-main" {...scrollRegion} style={{ '--hm-w': '1040px', '--hm-h': '580px' }}>
        <div className="hm-scale-scroll" style={{ background: '#ffffff', border: '1px solid #e7ecf5', borderRadius: '16px', boxShadow: '0 50px 100px -40px rgba(15,23,41,.35)', overflow: 'hidden' }}>
          <img src={src} width="1040" height="580" alt={alt} style={{ display: 'block', width: '100%', height: '580px', objectFit: 'cover', objectPosition: 'top left' }} />
        </div>
      </div>
    </div>
  );
}
