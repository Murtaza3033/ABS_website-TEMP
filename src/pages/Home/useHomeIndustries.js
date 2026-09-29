import { useIndustries } from '../../hooks/useCms';
import { cmsPic } from '../../lib/cmsImage';
import { useHomeCopy } from './useHomeCopy';
import { INDUSTRIES } from './homeContent';

/* The industries shown on the home page: the CMS Industry documents (sorted
   by order) — name, short description (summary, else description) and
   illustration — else the built-in six. Shared with the Services facts row
   ("{count} industries"). `img` is undefined while the CMS list is pending
   (lib/cmsImage.js), so no picture downloads twice. */
export function useHomeIndustries() {
  const { txt } = useHomeCopy();
  const query = useIndustries();
  const pic = cmsPic(query);
  const docs = query.data?.length ? query.data : null;
  // Picture box is 660px wide at most: 1200w (the illustrations' own width) covers 2x.
  if (docs) {
    return docs.map((d, i) => ({
      key: d._id || i,
      slug: d.slug?.current,
      name: txt(d.name),
      summary: txt(d.summary) || txt(d.description),
      img: pic(d.illustration, { width: 1200 }),
      alt: txt(d.illustration?.alt) || txt(d.name),
    }));
  }
  return INDUSTRIES.map((d) => ({
    key: d.slug,
    slug: d.slug,
    name: txt(null, d.name),
    summary: txt(null, d.summary),
    img: pic(null, null, `/assets/images/industries/${d.img}.webp`),
    alt: txt(null, d.name),
  }));
}
