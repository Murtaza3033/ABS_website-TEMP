import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({name: 'siteTitle', title: 'Site title', type: 'localeString'}),
    defineField({name: 'siteDescription', title: 'Site description', type: 'localeText'}),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
    }),
    defineField({name: 'favicon', title: 'Favicon', type: 'image'}),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({name: 'phone', title: 'Contact phone', type: 'string'}),
    defineField({name: 'address', title: 'Address', type: 'localeString'}),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'bluesky', 'discord'],
              },
            }),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'siteTitle.en'},
    prepare({title}) {
      return {title: title || 'Site Settings'}
    },
  },
})
