import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'advisor',
  title: 'Advisor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'role', title: 'Role / title', type: 'localeString'}),
    defineField({name: 'bio', title: 'Bio', type: 'localeText'}),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
  ],
  preview: {
    select: {title: 'name.en', subtitle: 'role.en', media: 'photo'},
  },
})
