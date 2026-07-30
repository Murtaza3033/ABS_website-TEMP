import {defineField, defineType} from 'sanity'

export const localeString = defineType({
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
  fields: [
    defineField({name: 'en', title: 'English', type: 'string'}),
    defineField({name: 'ar', title: 'Arabic', type: 'string'}),
  ],
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized text',
  type: 'object',
  fields: [
    defineField({name: 'en', title: 'English', type: 'text', rows: 4}),
    defineField({name: 'ar', title: 'Arabic', type: 'text', rows: 4}),
  ],
})

export const localeBlock = defineType({
  name: 'localeBlock',
  title: 'Localized rich text',
  type: 'object',
  fields: [
    defineField({name: 'en', title: 'English', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'ar', title: 'Arabic', type: 'array', of: [{type: 'block'}]}),
  ],
})
