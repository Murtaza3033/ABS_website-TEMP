import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
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
    defineField({name: 'startDate', title: 'Start date', type: 'datetime'}),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'datetime',
      validation: (Rule) =>
        Rule.custom((endDate, context) => {
          const startDate = context.document?.startDate
          if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            return 'End date must be after start date'
          }
          return true
        }),
    }),
    defineField({name: 'location', title: 'Location', type: 'localeString'}),
    defineField({name: 'description', title: 'Description', type: 'localeBlock'}),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
        }),
      ],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title.en', subtitle: 'location.en', media: 'coverImage'},
  },
})
