import SmartLink from '../../../components/SmartLink';
import { useHomeCopy } from '../useHomeCopy';

export default function CtaSection() {
  const { tx } = useHomeCopy();
  return (
    <>
      <section className="section" style={{textAlign: 'center'}}>
          <div className="wrap" data-reveal style={{background: 'linear-gradient(160deg,var(--blue),#0f3ba8)', borderRadius: '28px', padding: '72px 32px', color: '#fff'}}>
            <h2 className="h2" style={{color: '#fff', maxWidth: '640px', margin: '0 auto'}}>{tx('ctaHeading')}</h2>
            <p style={{fontSize: '17px', lineHeight: '1.6', color: 'rgba(255,255,255,.85)', maxWidth: '520px', margin: '16px auto 0'}}>{tx('ctaText')}</p>
            <SmartLink href="/contact-us.html" className="btn-ghost" style={{marginTop: '30px', background: '#fff', border: 'none'}}>{tx('ctaButton')}</SmartLink>
          </div>
        </section>
    </>
  );
}
