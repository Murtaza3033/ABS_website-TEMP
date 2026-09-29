import {defineField, defineType, defineArrayMember} from 'sanity'

/* An industry: a tab on the home page and on the Industries page (/industries),
   where it gets a full panel (photo, headline, description, focus, modules
   and member clients). Icon keys must match ICON_PATHS in
   src/pages/Industries/industriesData.jsx. */
export const INDUSTRY_ICONS = [
  ['cup', 'Cup (food & FMCG)'],
  ['cross', 'Medical cross'],
  ['bulb', 'Light bulb'],
  ['building', 'Building'],
  ['sun', 'Sun'],
  ['chip', 'Chip'],
].map(([value, title]) => ({value, title}))

export default defineType({
  name: 'industry',
  title: 'Industry',
  type: 'document',
  fieldsets: [
    {
      name: 'panel',
      title: 'Industries page panel',
      description: 'The panel shown when this industry\'s tab is selected on the Industries page.',
      options: {collapsible: true, collapsed: false},
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name.en', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Short description (home page)',
      description: 'One short sentence shown under the industry tabs on the home page. Empty = the Description is used.',
      type: 'localeString',
    }),
    defineField({
      name: 'illustration',
      title: 'Illustration',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
    }),
    defineField({
      name: 'short',
      title: 'Short name (tab label)',
      description: 'Tab label on the Industries page, e.g. "Pharma & Health". Empty = the Name.',
      type: 'localeString',
      fieldset: 'panel',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {list: INDUSTRY_ICONS},
      fieldset: 'panel',
    }),
    defineField({
      name: 'insight',
      title: 'Highlight on the photo',
      description: 'Bold line on the white card over the photo, e.g. "5 FMCG & food brands served".',
      type: 'localeString',
      fieldset: 'panel',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      description: 'e.g. "Keeping fast-moving goods moving."',
      type: 'localeString',
      fieldset: 'panel',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'The paragraph under the headline.',
      type: 'localeText',
      fieldset: 'panel',
    }),
    defineField({
      name: 'focus',
      title: 'Focus',
      description: 'Shown next to the client count, e.g. "Production → Retail".',
      type: 'localeString',
      fieldset: 'panel',
    }),
    defineField({
      name: 'modules',
      title: 'Runs on Align (modules)',
      type: 'array',
      of: [defineArrayMember({type: 'localeString'})],
      fieldset: 'panel',
    }),
    defineField({
      name: 'members',
      title: 'Trusted here by (clients)',
      description: 'Client logos shown in the panel, in this order; the count ("5 clients on Align") follows the list. Empty = every client whose Industry is this one.',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'client'}]})],
      validation: (Rule) => Rule.unique(),
      fieldset: 'panel',
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  orderings: [{title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name.en', media: 'illustration'},
  },
})
