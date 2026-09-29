import {defineField, defineType, defineArrayMember} from 'sanity'

/* An event shown on /events. The featured one (tick "Featured", else the
   newest by date) gets the big gallery; every other event is listed under
   "More events" and opens in the same gallery when clicked.

   Fact icon keys must match ICON_PATHS in src/pages/Events/eventsData.jsx. */
const FACT_ICONS = [
  {value: 'pin', title: 'Map pin'},
  {value: 'booth', title: 'Booth / stand'},
  {value: 'grid', title: 'Grid'},
  {value: 'cal', title: 'Calendar'},
  {value: 'globe', title: 'Globe'},
  {value: 'tag', title: 'Tag'},
  {value: 'mobile', title: 'Phone'},
  {value: 'shield', title: 'Shield'},
]

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fieldsets: [
    {name: 'where', title: 'When & where', options: {collapsible: true, collapsed: false}},
    {name: 'media', title: 'Photos', options: {collapsible: true, collapsed: false}},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title.en', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'Show this event in the big gallery at the top of /events. If several are ticked, the newest wins; if none, the newest event is featured.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({name: 'startDate', title: 'Start date', type: 'datetime', fieldset: 'where'}),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'datetime',
      fieldset: 'where',
      validation: (Rule) =>
        Rule.custom((endDate, context) => {
          const startDate = context.document?.startDate
          if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            return 'End date must be after start date'
          }
          return true
        }),
    }),
    defineField({
      name: 'dateLabel',
      title: 'Date label',
      description: 'Optional text shown instead of the dates, e.g. "2023" or "Spring 2026". Leave empty to show the dates.',
      type: 'localeString',
      fieldset: 'where',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      description: 'Shown as the chip above the title, e.g. "Karachi Expo Centre · Pakistan".',
      type: 'localeString',
      fieldset: 'where',
    }),
    defineField({
      name: 'venue',
      title: 'Venue (short)',
      description: 'Shown on the floating card over the photo, e.g. "Karachi Expo Centre".',
      type: 'localeString',
      fieldset: 'where',
    }),
    defineField({
      name: 'booth',
      title: 'Booth / stand',
      description: 'e.g. "Hall 1 · Booth A-30". Shown as "Find us at" over the photo; leave empty to hide.',
      type: 'localeString',
      fieldset: 'where',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Use bold for highlights (e.g. the booth number).',
      type: 'localeBlock',
    }),
    defineField({
      name: 'facts',
      title: 'Fact tiles',
      description: 'The small tiles under the description (up to 4 look best).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'eventFact',
          fields: [
            defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: FACT_ICONS}}),
            defineField({name: 'title', title: 'Title', type: 'localeString'}),
            defineField({name: 'subtitle', title: 'Subtitle', type: 'localeString'}),
          ],
          preview: {select: {title: 'title.en', subtitle: 'subtitle.en'}},
        }),
      ],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      description: 'Used on the "More events" card, and as the gallery when the gallery is empty.',
      type: 'image',
      fieldset: 'media',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      fieldset: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'label', title: 'Label', description: 'Short tag on the photo, e.g. "At the booth".', type: 'localeString'}),
            defineField({name: 'caption', title: 'Caption', description: 'Shown under the photo in the full-size view.', type: 'localeString'}),
            defineField({name: 'alt', title: 'Alt text', type: 'localeString'}),
          ],
          preview: {select: {title: 'label.en', subtitle: 'caption.en', media: 'asset'}},
        }),
      ],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  orderings: [
    {title: 'Start date, newest first', name: 'startDesc', by: [{field: 'startDate', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title.en', subtitle: 'location.en', media: 'coverImage', featured: 'featured'},
    prepare: ({title, subtitle, media, featured}) => ({title: `${featured ? '★ ' : ''}${title || ''}`, subtitle, media}),
  },
})
