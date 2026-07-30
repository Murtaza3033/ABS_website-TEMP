import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'metaTitle', title: 'Meta title', type: 'localeString'}),
    defineField({name: 'metaDescription', title: 'Meta description', type: 'localeText'}),
    defineField({
      name: 'ogImage',
      title: 'Social share image (OG image)',
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
