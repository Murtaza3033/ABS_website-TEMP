import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Internal title', type: 'string', initialValue: 'Footer'}),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'localeString'}),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'footerLink',
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
    defineField({name: 'copyrightText', title: 'Copyright text', type: 'localeString'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Footer'}
    },
  },
})
