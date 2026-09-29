import {defineField, defineType, defineArrayMember} from 'sanity'
import {ADVISOR_ICONS} from './advisorsPage'

/* An advisor on the Our Advisors page: profile card (photo, name, bio, quote)
   and their career timeline. Several advisors are shown one after another in
   sort order. */
const COLORS = [
  ['#1a56db', 'Blue'],
  ['#4b8bff', 'Light blue'],
  ['#1a9d55', 'Green'],
  ['#0f1729', 'Navy'],
].map(([value, title]) => ({value, title}))

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
    defineField({name: 'label', title: 'Label above the name', description: 'e.g. "Strategic Advisor"', type: 'localeString'}),
    defineField({name: 'role', title: 'Role / title', type: 'localeString'}),
    defineField({
      name: 'photo',
      title: 'Photo',
      description: 'Shown in the round frame. Without a photo, a placeholder icon is shown.',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
    }),
    defineField({name: 'badge', title: 'Badge on the photo panel', description: 'e.g. "Advising since day one". Leave empty to hide.', type: 'localeString'}),
    defineField({name: 'bio', title: 'Bio', type: 'localeText'}),
    defineField({name: 'quote', title: 'Quote', description: 'Include the quotation marks.', type: 'localeText'}),
    defineField({
      name: 'links',
      title: 'Links',
      description: 'Optional, e.g. LinkedIn. Shown under the quote.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'advisorLink',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'localeString'}),
            defineField({name: 'url', title: 'URL', type: 'url', validation: (Rule) => Rule.required()}),
          ],
          preview: {select: {title: 'label.en', subtitle: 'url'}},
        }),
      ],
    }),
    defineField({
      name: 'timeline',
      title: 'Career timeline',
      description: 'Milestones for the "Background" section, oldest first.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'advisorMilestone',
          fields: [
            defineField({name: 'year', title: 'Year', description: 'e.g. "2015" or "Today"', type: 'localeString'}),
            defineField({name: 'title', title: 'Title', type: 'localeString'}),
            defineField({name: 'text', title: 'Text', type: 'localeText'}),
            defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: ADVISOR_ICONS}}),
            defineField({name: 'color', title: 'Highlight colour', type: 'string', options: {list: COLORS}}),
          ],
          preview: {select: {title: 'title.en', subtitle: 'year.en'}},
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
  ],
  orderings: [{title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name.en', subtitle: 'role.en', media: 'photo'},
  },
})
