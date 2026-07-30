import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'job',
  title: 'Job Opening',
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
    defineField({name: 'department', title: 'Department', type: 'string'}),
    defineField({name: 'location', title: 'Location', type: 'localeString'}),
    defineField({
      name: 'employmentType',
      title: 'Employment type',
      type: 'string',
      options: {list: ['full-time', 'part-time', 'contract', 'internship']},
    }),
    defineField({name: 'description', title: 'Description', type: 'localeBlock'}),
    defineField({name: 'requirements', title: 'Requirements', type: 'localeBlock'}),
    defineField({name: 'applyUrl', title: 'Apply URL', type: 'url'}),
    defineField({
      name: 'applyEmail',
      title: 'Apply email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({name: 'isActive', title: 'Active', type: 'boolean', initialValue: true}),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title.en', subtitle: 'department'},
  },
})
