import { useHome } from '../HomeContext';
import { useLanguage } from '../../../context/LanguageContext';

export default function CtaSection() {
  const { c, b, act } = useHome();
  const { t } = useLanguage();
  return (
    <>
      <section className="section" style={{textAlign: 'center'}}>
          <div className="wrap" data-reveal style={{background: 'linear-gradient(160deg,var(--blue),#0f3ba8)', borderRadius: '28px', padding: '72px 32px', color: '#fff'}}>
            <h2 className="h2" style={{color: '#fff', maxWidth: '640px', margin: '0 auto'}}>{t("Ready to run your business on one connected system?")}</h2>
            <p style={{fontSize: '17px', lineHeight: '1.6', color: 'rgba(255,255,255,.85)', maxWidth: '520px', margin: '16px auto 0'}}>{t("See Align in action and discover how we can transform your operations.")}</p>
            <a href="/contact-us.html" className="btn-ghost" style={{marginTop: '30px', background: '#fff', border: 'none'}}>{t("Book a Demo →")}</a>
          </div>
        </section>
    </>
  );
}
