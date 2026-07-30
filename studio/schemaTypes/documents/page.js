import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
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
    defineField({name: 'heroTitle', title: 'Hero title', type: 'localeString'}),
    defineField({name: 'heroSubtitle', title: 'Hero subtitle', type: 'localeText'}),
    defineField({name: 'body', title: 'Body', type: 'localeBlock'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title.en', subtitle: 'slug.current'},
  },
})
