import LogoSlot, { useLogoRotation } from './LogoSlot';
import { LOGOS } from '../homeContent';
import { useClients } from '../../../hooks/useCms';
import { cmsPic } from '../../../lib/cmsImage';
import { useHomeCopy } from '../useHomeCopy';

/* The mosaic's 12 logo slots rotate through `list` ({ name, src }); keyed by
   list length in ClientsSection so a different-sized list reshuffles. */
function LogoMosaic({ list }) {
  const idx = useLogoRotation(12, list.length); // 12 slots, always 12 different logos
  const logos = idx.map((i) => list[i]);
  return (
              <div className="hm-logogrid" style={{display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gridAutoRows: '100px', gap: '12px'}}>
              <div style={{background: '#1a56db', borderRadius: '50%'}}></div>
              <LogoSlot logo={logos[0]} />
              <div style={{background: '#e8effc', borderRadius: '18px'}}></div>
              <div></div>
              <div style={{background: '#e8effc', borderRadius: '50%'}}></div>
              <LogoSlot logo={logos[1]} />
              <LogoSlot logo={logos[2]} />
              <div style={{background: '#e8effc', borderRadius: '18px'}}></div>
              <LogoSlot logo={logos[3]} />
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
              <LogoSlot logo={logos[4]} />
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
              <LogoSlot logo={logos[5]} />
              <LogoSlot logo={logos[6]} />
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div style={{background: '#e8effc', borderRadius: '18px'}}></div>
              <div style={{background: '#1a56db', borderRadius: '18px'}}></div>
              <LogoSlot logo={logos[7]} />
              <div></div>
              <div style={{background: '#1a56db', borderRadius: '18px'}}></div>
              <LogoSlot logo={logos[8]} />
              <LogoSlot logo={logos[9]} />
              <div></div>
              <div style={{background: '#e8effc', borderRadius: '50%'}}></div>
              <LogoSlot logo={logos[10]} />
              <div style={{background: '#1a56db', borderRadius: '18px'}}></div>
              <LogoSlot logo={logos[11]} />
              <div></div>
              <div></div>
              </div>
  );
}

export default function ClientsSection() {
  const { tx } = useHomeCopy();
  /* Logos: the CMS Client documents that have one (sorted by order); the
     built-in files only if the CMS fails or has none. Nothing loads while
     the list is pending (lib/cmsImage.js) — the slots stay empty tiles. */
  const clientsQuery = useClients();
  const pic = cmsPic(clientsQuery);
  const cmsLogos = (clientsQuery.data || []).filter((c) => c?.logo?.asset);
  // Slots are ~72px wide at most (1240px grid / 12): 160w covers 2x screens.
  const list = cmsLogos.length
    ? cmsLogos.map((c) => ({ name: c.logo.alt || c.name, src: pic(c.logo, { width: 160 }) }))
    : LOGOS.map(([name, file]) => ({ name, src: pic(null, null, `/assets/images/clients/${file}.webp`) }));
  return (
    <>
      <section data-screen-label="Clients" className="ag" style={{background: '#ffffff', borderTop: '1px solid #f0f3f8', overflow: 'hidden'}}>
          <div style={{maxWidth: '1240px', margin: '0 auto', padding: '72px 32px', position: 'relative'}}>
            <div style={{position: 'relative'}}>
              <LogoMosaic key={list.length} list={list} />
            </div>
      
            
            <div style={{position: 'absolute', top: '50%', insetInlineStart: '50%', transform: 'translate(-50%,-50%)', width: '720px', maxWidth: 'calc(100% - 40px)', padding: '34px 52px', textAlign: 'center', background: '#ffffff', borderRadius: '130px', boxShadow: '0 0 0 12px #ffffff', zIndex: '5'}}>
              <h2 style={{fontSize: '32px', fontWeight: '700', letterSpacing: '-1px', margin: '0', lineHeight: '1.15', color: '#0f1729', textWrap: 'pretty'}}>{tx('clientsHeading')} <span style={{color: '#1a56db'}}>{tx('clientsHighlight')}</span></h2>
              <p style={{fontSize: '15px', color: '#5b6472', margin: '12px 0 0'}}>{tx('clientsText')}</p>
            </div>
          </div>
        </section>
    </>
  );
}
