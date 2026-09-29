import {defineField, defineType} from 'sanity'

/* Search / social metadata, used by every page singleton and by Products.
   Read by src/components/SEO.jsx; every field is optional and falls back to
   the page's built-in text, then to Site Settings. */
export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      description:
        'Browser tab and Google title. The site title is added automatically ("About Us" → "About Us | Align Business Systems"); a title equal to the site title is shown on its own.',
      type: 'localeString',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      description: 'The snippet under the title in Google and in link previews. Aim for 120–160 characters.',
      type: 'localeText',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image (OG image)',
      description: 'Shown when the page is shared on LinkedIn, WhatsApp, X… Best at 1200 × 630. Empty: Site Settings → Default share image.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      type: 'url',
      description: 'Set only if this content is duplicated from, or canonical to, another URL.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
