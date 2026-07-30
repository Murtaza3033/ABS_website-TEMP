import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Main navigation',
    }),
    defineField({
      name: 'items',
      title: 'Navigation items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'localeString'}),
            defineField({name: 'href', title: 'Link', type: 'string'}),
            defineField({
              name: 'children',
              title: 'Sub-items',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'navSubItem',
                  fields: [
                    defineField({name: 'label', title: 'Label', type: 'localeString'}),
                    defineField({name: 'href', title: 'Link', type: 'string'}),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Navigation'}
    },
  },
})
