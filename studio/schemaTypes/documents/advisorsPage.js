import {defineField, defineType, defineArrayMember} from 'sanity'

/* Our Advisors page (/our-advisors) — singleton, fixed _id "advisorsPage"
   (see sanity.config.js). Page texts only; the advisors themselves (profile,
   photo, quote, career timeline) are "Advisor" documents, shown in sort
   order. The frontend falls back to the built-in copy for anything left empty.

   Icon keys must match ICON_PATHS in src/pages/OurAdvisors/advisorsData.jsx. */
export const ADVISOR_ICONS = [
  ['compass', 'Compass'],
  ['trending', 'Trending up'],
  ['layers', 'Layers'],
  ['users', 'People'],
  ['shield', 'Shield'],
  ['tag', 'Price tag'],
  ['scale', 'Scales'],
  ['map', 'Map'],
  ['lightbulb', 'Light bulb'],
].map(([value, title]) => ({value, title}))

const ls = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeString', fieldset, description})
const lt = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeText', fieldset, description})
const cards = (name, title, fieldset, typeName, description) =>
  defineField({
    name,
    title,
    description,
    type: 'array',
    fieldset,
    of: [
      defineArrayMember({
        type: 'object',
        name: typeName,
        fields: [
          defineField({name: 'title', title: 'Title', type: 'localeString'}),
          defineField({name: 'text', title: 'Text', type: 'localeText'}),
          defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: ADVISOR_ICONS}}),
        ],
        preview: {select: {title: 'title.en', subtitle: 'icon'}},
      }),
    ],
  })

export default defineType({
  name: 'advisorsPage',
  title: 'Our Advisors page',
  type: 'document',
  fieldsets: [
    {name: 'hero', title: '1 · Hero', options: {collapsible: true, collapsed: false}},
    {name: 'profile', title: '2 · Advisor profile labels', description: 'The advisors themselves are Advisor documents.', options: {collapsible: true, collapsed: true}},
    {name: 'areas', title: '3 · Where the guidance lands', options: {collapsible: true, collapsed: true}},
    {name: 'why', title: '4 · Why it matters (dark section)', options: {collapsible: true, collapsed: true}},
    {name: 'timeline', title: '5 · Background timeline', description: 'The milestones are on each Advisor document.', options: {collapsible: true, collapsed: true}},
    {name: 'cta', title: '6 · Closing call to action', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    ls('heroHeading', 'Heading', 'hero', 'e.g. "The perspective behind the plan."'),
    lt('heroText', 'Intro paragraph', 'hero'),

    ls('photoPending', 'Text shown when an advisor has no photo', 'profile', 'e.g. "Advisor photo pending"'),
    ls('aboutLabel', 'Label above the bio', 'profile', 'e.g. "About"'),

    ls('areasEyebrow', 'Eyebrow', 'areas'),
    ls('areasHeading', 'Heading', 'areas'),
    cards('areas', 'Cards', 'areas', 'advisorsArea', 'Numbered automatically, three per row.'),

    ls('whyEyebrow', 'Eyebrow', 'why'),
    ls('whyHeading', 'Heading', 'why'),
    lt('whyText', 'Paragraph', 'why'),
    cards('pillars', 'Points', 'why', 'advisorsPillar'),

    ls('timelineEyebrow', 'Eyebrow', 'timeline'),
    ls('timelineHeading', 'Heading', 'timeline'),
    ls('timelineNote', 'Note under the heading', 'timeline', 'Optional small grey line, e.g. "Career milestones TBD — confirm with advisor". Clear it once the milestones are confirmed.'),

    ls('ctaHeading', 'Heading', 'cta'),
    lt('ctaText', 'Text', 'cta'),
    ls('ctaPrimary', 'Primary button', 'cta', 'Opens the Contact page'),
    ls('ctaSecondary', 'Secondary button', 'cta', 'Opens the About Us page'),
  ],
  preview: {
    prepare: () => ({title: 'Our Advisors page'}),
  },
})
