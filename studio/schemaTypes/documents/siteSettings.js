import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      description: 'Added to every browser-tab title ("About Us | Align Business Systems") and used as the site name in link previews.',
      type: 'localeString',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site description',
      description: 'The footer intro text, and the search/link-preview description of any page without its own.',
      type: 'localeText',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default share image',
      description: 'Shown when a page without its own share image is posted on LinkedIn, WhatsApp, X… Use 1200 × 630.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      description: 'The small icon in the browser tab. Upload a square PNG (512 × 512). Removing it keeps the built-in icon.',
      type: 'image',
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({name: 'phone', title: 'Contact phone', type: 'string'}),
    defineField({name: 'address', title: 'Address', description: 'Short form, shown in the footer (e.g. "Karachi, Pakistan").', type: 'localeString'}),
    defineField({
      name: 'headOfficeAddress',
      title: 'Head office address',
      description: 'Full postal address, shown on the Contact Us page.',
      type: 'localeText',
    }),
    defineField({
      name: 'officeHours',
      title: 'Office hours',
      description: 'Shown in the footer, e.g. "Mon – Fri  |  9:00 AM – 6:00 PM PKT".',
      type: 'localeString',
    }),
    defineField({
      name: 'departments',
      title: 'Departments',
      description: 'Contact cards on the Contact Us page and the chat assistant’s contact options. Keep the keys "sales", "support" and "careers": the chat assistant and the Careers page look them up.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'department',
          fields: [
            defineField({name: 'key', title: 'Key', type: 'string', description: 'sales / support / careers (or a new one)', validation: (Rule) => Rule.required()}),
            defineField({name: 'name', title: 'Name', type: 'localeString'}),
            defineField({name: 'email', title: 'Email', type: 'string', validation: (Rule) => Rule.email()}),
            defineField({
              name: 'phones',
              title: 'Phone numbers',
              description: 'As displayed, e.g. "+92 317 3822206".',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {list: [{value: 'mail', title: 'Mail'}, {value: 'support', title: 'Headset'}, {value: 'careers', title: 'Briefcase'}]},
            }),
          ],
          preview: {select: {title: 'name.en', subtitle: 'email'}},
        }),
      ],
    }),
    defineField({name: 'responseTimeLead', title: 'Response time — sentence', description: 'e.g. "We typically reply within"', type: 'localeString'}),
    defineField({name: 'responseTime', title: 'Response time — highlighted part', description: 'e.g. "one business day"', type: 'localeString'}),
    defineField({name: 'responseTimeNote', title: 'Response time — small note', description: 'Optional grey note after it. Leave empty to hide.', type: 'localeString'}),
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
            defineField({name: 'url', title: 'URL', description: 'The full profile link. A bare domain (https://facebook.com) is treated as "not set" and hidden.', type: 'url'}),
          ],
          preview: {select: {title: 'platform', subtitle: 'url'}},
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
