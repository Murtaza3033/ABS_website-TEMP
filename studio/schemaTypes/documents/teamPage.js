import {defineField, defineType, defineArrayMember} from 'sanity'
import {pageSeoField} from '../objects/pageSeoField'

/* Our Team page (/our-team) — singleton, fixed _id "teamPage" (see
   sanity.config.js). Page texts only; the people themselves are
   "Team Member" documents (their "Section" field picks leader / senior /
   team). The frontend falls back to the built-in copy for anything empty.

   Icon keys must match ICON_PATHS in src/pages/OurTeam/teamData.jsx. */
const ICONS = [
  {value: 'spark', title: 'Spark'},
  {value: 'zap', title: 'Lightning'},
  {value: 'target', title: 'Target'},
  {value: 'heart', title: 'Heart'},
]

const ls = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeString', fieldset, description})
const lt = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeText', fieldset, description})

export default defineType({
  name: 'teamPage',
  title: 'Our Team page',
  type: 'document',
  fieldsets: [
    {name: 'hero', title: 'Hero (top of the page)', options: {collapsible: true, collapsed: false}},
    {name: 'way', title: '"The Align Way" section', options: {collapsible: true, collapsed: true}},
    {name: 'senior', title: 'Senior Leadership section', description: 'The cards are Team Member documents with Section = Senior.', options: {collapsible: true, collapsed: true}},
    {name: 'team', title: 'Amazing Team section', description: 'The cards are Team Member documents with Section = Team.', options: {collapsible: true, collapsed: true}},
    {name: 'cta', title: 'Closing call to action', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    ls('heroEyebrow', 'Eyebrow', 'hero', 'e.g. "Our Team"'),
    ls('heroTitle', 'Heading', 'hero', 'e.g. "The Minds Behind"'),
    ls('heroHighlight', 'Heading highlight (handwriting, blue)', 'hero', 'e.g. "Innovation"'),
    lt('heroText', 'Intro paragraph', 'hero'),
    defineField({
      name: 'heroStats',
      title: 'Stats',
      type: 'array',
      fieldset: 'hero',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'teamStat',
          fields: [
            defineField({name: 'value', title: 'Number (counts up)', type: 'number', validation: (Rule) => Rule.required().min(0)}),
            defineField({name: 'suffix', title: 'Suffix', description: 'e.g. "+". Leave empty for none.', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'localeString'}),
          ],
          preview: {
            select: {value: 'value', suffix: 'suffix', label: 'label.en'},
            prepare: ({value, suffix, label}) => ({title: `${value ?? ''}${suffix ?? ''}`, subtitle: label}),
          },
        }),
      ],
    }),
    ls('heroStatsNote', 'Note under the stats', 'hero', 'Small grey line.'),
    ls('heroButton', 'Button label', 'hero', 'Scrolls to the first leader.'),

    ls('wayEyebrow', 'Eyebrow', 'way'),
    ls('wayHeading', 'Heading', 'way'),
    lt('wayText', 'Intro paragraph', 'way'),
    defineField({
      name: 'wayItems',
      title: 'Principles',
      description: 'Numbered automatically (01, 02, …).',
      type: 'array',
      fieldset: 'way',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'teamPrinciple',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'localeString'}),
            defineField({name: 'text', title: 'Text', type: 'localeText'}),
            defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: ICONS}}),
          ],
          preview: {select: {title: 'title.en', subtitle: 'icon'}},
        }),
      ],
    }),

    ls('seniorEyebrow', 'Eyebrow', 'senior'),
    ls('seniorHeading', 'Heading', 'senior'),

    ls('teamEyebrow', 'Eyebrow', 'team'),
    ls('teamHeading', 'Heading', 'team'),
    lt('teamClosing', 'Line under the grid', 'team'),

    ls('ctaTitle', 'Heading', 'cta', 'e.g. "Together, we build"'),
    ls('ctaHighlight', 'Heading highlight (handwriting, blue)', 'cta', 'e.g. "the future."'),
    ls('ctaPrimary', 'Primary button label', 'cta', 'Links to the contact page.'),
    ls('ctaSecondary', 'Secondary button label', 'cta', 'Links to the contact page.'),
    pageSeoField(),
  ],
  preview: {
    prepare: () => ({title: 'Our Team page'}),
  },
})
