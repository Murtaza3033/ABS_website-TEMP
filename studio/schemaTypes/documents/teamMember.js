import {defineField, defineType, defineArrayMember} from 'sanity'

/* A person on the Our Team page (/our-team). `group` decides the section:
   leaders get a full-screen scene each (in `order`), senior people fill the
   "Senior Leadership" cards and everyone else the "Our Amazing Team" grid.
   Anything left empty on a leader falls back to the built-in copy. */
const GROUPS = [
  {value: 'leader', title: 'Leader (full-screen scene)'},
  {value: 'senior', title: 'Senior Leadership card'},
  {value: 'team', title: 'Amazing Team grid'},
]
const notLeader = ({document}) => document?.group !== 'leader'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fieldsets: [
    {
      name: 'scene',
      title: 'Leader scene',
      description: 'Only used when "Section" is Leader.',
      options: {collapsible: true, collapsed: false},
      hidden: notLeader,
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'group',
      title: 'Section on the Our Team page',
      type: 'string',
      options: {list: GROUPS, layout: 'radio'},
      initialValue: 'team',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      description: 'Position within its section (lowest first).',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
    defineField({name: 'role', title: 'Role / title', type: 'localeString'}),
    defineField({
      name: 'bio',
      title: 'Quote / bio',
      description: 'Leaders: shown as the handwritten quote.',
      type: 'localeText',
    }),
    defineField({
      name: 'blurb',
      title: 'Short line',
      description: 'Senior Leadership cards: one short line under the role.',
      type: 'localeString',
      hidden: ({document}) => document?.group !== 'senior',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      description: 'Leaders: a cut-out portrait. Cards: a square head shot (shown in the circle).',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
    }),
    defineField({
      name: 'initials',
      title: 'Initials',
      description: 'Cards only: shown in the circle when there is no photo (e.g. "SE").',
      type: 'string',
      hidden: ({document}) => document?.group === 'leader',
    }),
    defineField({
      name: 'caption',
      title: 'Scene caption',
      type: 'localeText',
      fieldset: 'scene',
    }),
    defineField({
      name: 'tags',
      title: 'Strength tags',
      description: 'Pills under the quote; the description appears on hover.',
      type: 'array',
      fieldset: 'scene',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'teamTag',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'localeString'}),
            defineField({name: 'description', title: 'Hover description', type: 'localeString'}),
          ],
          preview: {select: {title: 'label.en', subtitle: 'description.en'}},
        }),
      ],
    }),
    defineField({
      name: 'card1',
      title: 'Floating card 1 (bar chart)',
      type: 'object',
      fieldset: 'scene',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'title', title: 'Title', type: 'localeString'}),
        defineField({name: 'label', title: 'Small label', type: 'localeString'}),
        defineField({name: 'value', title: 'Number (counts up)', type: 'number'}),
        defineField({
          name: 'bars',
          title: 'Bar heights (%)',
          description: 'Six values between 0 and 100.',
          type: 'array',
          of: [defineArrayMember({type: 'number'})],
          validation: (Rule) => Rule.max(12),
        }),
      ],
    }),
    defineField({
      name: 'card2',
      title: 'Floating card 2 (status)',
      type: 'object',
      fieldset: 'scene',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'title', title: 'Title', type: 'localeString'}),
        defineField({name: 'status', title: 'Status badge', description: 'e.g. "LIVE"', type: 'localeString'}),
        defineField({name: 'label', title: 'Small label', type: 'localeString'}),
        defineField({name: 'value', title: 'Number (counts up)', type: 'number'}),
      ],
    }),
    defineField({
      name: 'card3',
      title: 'Floating card 3 (trend line)',
      type: 'object',
      fieldset: 'scene',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'title', title: 'Title', type: 'localeString'}),
        defineField({name: 'trend', title: 'Trend text', description: 'e.g. "↑ steady climb"', type: 'localeString'}),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({name: 'platform', title: 'Platform', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Section, then sort order',
      name: 'groupOrder',
      by: [
        {field: 'group', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'name.en', role: 'role.en', group: 'group', media: 'photo'},
    prepare: ({title, role, group, media}) => ({
      title,
      subtitle: [GROUPS.find((g) => g.value === group)?.title.split(' (')[0], role].filter(Boolean).join(' · '),
      media,
    }),
  },
})
