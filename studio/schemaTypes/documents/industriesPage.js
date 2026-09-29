import {defineField, defineType, defineArrayMember} from 'sanity'
import {INDUSTRY_ICONS} from './industry'

/* Industries page (/industries) — singleton, fixed _id "industriesPage" (see
   sanity.config.js). Page texts only; the tabs and their panels are the
   Industry documents. The frontend falls back to the built-in copy for
   anything left empty. */
const ls = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeString', fieldset, description})
const lt = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeText', fieldset, description})

export default defineType({
  name: 'industriesPage',
  title: 'Industries page',
  type: 'document',
  fieldsets: [
    {name: 'hero', title: '1 · Hero', options: {collapsible: true, collapsed: false}},
    {
      name: 'numbers',
      title: '1b · Numbers line (under the intro)',
      description: 'Reads "6 industries • 50+ businesses • 1 platform". The industry count is the number of Industry documents; the business count is the one in Our Clients page → Trust line, so both stay in step site-wide.',
      options: {collapsible: true, collapsed: true},
    },
    {name: 'panel', title: '2 · Industry panel labels', description: 'The panel content is on each Industry document.', options: {collapsible: true, collapsed: true}},
    {name: 'diagram', title: '3 · "One platform, every sector" diagram', options: {collapsible: true, collapsed: true}},
    {name: 'cta', title: '4 · Closing call to action', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    ls('heroHeading', 'Heading', 'hero', 'e.g. "The industries we help move forward."'),
    ls('heroHighlight', 'Heading highlight (handwriting, blue)', 'hero', 'e.g. "forward". Must appear in the heading exactly as typed.'),
    lt('heroText', 'Intro paragraph', 'hero'),
    ls('heroScrollCue', 'Scroll hint', 'hero', 'e.g. "Explore"'),

    ls('industriesAfter', 'Text after the industry count', 'numbers', 'e.g. "industries"'),
    ls('businessesAfter', 'Text after the business count', 'numbers', 'Directly after the number, no space added — e.g. "+ businesses"'),
    defineField({name: 'platformValue', title: 'Third value', description: 'e.g. "1"', type: 'string', fieldset: 'numbers'}),
    ls('platformAfter', 'Text after the third value', 'numbers', 'e.g. "platform"'),

    ls('focusLabel', '"Focus" label', 'panel'),
    ls('modulesLabel', 'Modules label', 'panel', 'e.g. "Runs on Align"'),
    ls('membersLabel', 'Clients label', 'panel', 'e.g. "Trusted here by"'),
    ls('clientSingular', 'After the client count — one', 'panel', 'e.g. "client on Align"'),
    ls('clientPlural', 'After the client count — several', 'panel', 'e.g. "clients on Align"'),

    ls('convEyebrow', 'Eyebrow', 'diagram'),
    ls('convHeading', 'Heading', 'diagram', 'e.g. "Six industries. One Align."'),
    ls('convHighlight', 'Heading highlight (handwriting, blue)', 'diagram', 'e.g. "One"'),
    lt('convText', 'Paragraph', 'diagram'),
    defineField({name: 'hubTitle', title: 'Centre box — title', description: 'e.g. "Align Business Systems"', type: 'string', fieldset: 'diagram'}),
    ls('hubText', 'Centre box — line', 'diagram'),
    defineField({
      name: 'hubPills',
      title: 'Centre box — tags',
      type: 'array',
      fieldset: 'diagram',
      of: [defineArrayMember({type: 'localeString'})],
    }),
    defineField({
      name: 'nodes',
      title: 'Industry boxes',
      description: 'Up to six, in the same order as the Industry documents: three above the centre box, three below. Clicking a box opens that industry\'s tab.',
      type: 'array',
      fieldset: 'diagram',
      validation: (Rule) => Rule.max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'industriesNode',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'localeString'}),
            defineField({name: 'metric', title: 'Blue line', description: 'e.g. "5 brands"', type: 'localeString'}),
            defineField({name: 'text', title: 'Text', type: 'localeString'}),
            defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: INDUSTRY_ICONS}}),
          ],
          preview: {select: {title: 'title.en', subtitle: 'metric.en'}},
        }),
      ],
    }),

    ls('ctaKicker', 'Handwritten line', 'cta'),
    ls('ctaHeading', 'Heading', 'cta'),
    ls('ctaPrimary', 'Primary button', 'cta', 'Opens the Contact page'),
    ls('ctaSecondary', 'Secondary button', 'cta', 'Opens the Contact page'),
  ],
  preview: {
    prepare: () => ({title: 'Industries page'}),
  },
})
