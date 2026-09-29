import {defineField, defineType} from 'sanity'

/* A partner on the Our Partners page. The one ticked "Featured" (else the
   first by sort order) fills the featured card; any others are listed under
   the Partners network section. */
export default defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'logo',
      title: 'Logo',
      description: 'Without a logo, the name is shown on a blue tile instead.',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'type',
      title: 'Partner type',
      description: 'Short label on the partner card, e.g. "Technology partner". Not shown on the featured card.',
      type: 'localeString',
    }),
    defineField({name: 'description', title: 'Description', type: 'localeText'}),
    defineField({
      name: 'website',
      title: 'Website',
      description: 'Optional. When set, the partner name links to it.',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'Show this partner in the large featured card. If several are ticked, the first by sort order wins.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
  ],
  orderings: [{title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', subtitle: 'type.en', media: 'logo', featured: 'featured'},
    prepare: ({title, subtitle, media, featured}) => ({title, subtitle: [featured ? 'Featured' : null, subtitle].filter(Boolean).join(' · '), media}),
  },
})
