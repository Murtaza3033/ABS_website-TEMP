import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'authorName', title: 'Author name', type: 'string'}),
    defineField({name: 'authorRole', title: 'Author role', type: 'localeString'}),
    defineField({name: 'authorCompany', title: 'Author company', type: 'string'}),
    defineField({
      name: 'authorPhoto',
      title: 'Author photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
  ],
  preview: {
    select: {title: 'authorName', subtitle: 'quote.en', media: 'authorPhoto'},
  },
})
