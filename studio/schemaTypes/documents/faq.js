import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'answer', title: 'Answer', type: 'localeText'}),
    defineField({name: 'category', title: 'Category', type: 'string'}),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
  ],
  preview: {
    select: {title: 'question.en', subtitle: 'category'},
  },
})
