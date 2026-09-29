import {defineField, defineType, defineArrayMember} from 'sanity'

/* Our Clients page (/our-clients) — singleton, fixed _id "clientsPage" (see
   sanity.config.js). The frontend reads *[_id == "clientsPage"][0] and falls
   back to the built-in copy for anything left empty.

   Icon keys must match ICON_PATHS in src/pages/OurClients/clientsData.jsx;
   add a new icon there first, then list it here. */
const ICONS = [
  ['bottle', 'Bottle'],
  ['box', 'Box / package'],
  ['truck', 'Truck'],
  ['shelf', 'Shelves'],
  ['pill', 'Pill'],
  ['hospital', 'Hospital'],
  ['flask', 'Flask / lab'],
  ['pin', 'Map pin'],
  ['lamp', 'Lamp'],
  ['plug', 'Plug'],
  ['bolt', 'Lightning bolt'],
  ['store', 'Store'],
  ['hardhat', 'Hard hat'],
  ['beam', 'Steel beam'],
  ['house', 'House'],
  ['clipboard', 'Clipboard'],
  ['panel', 'Solar panel'],
  ['battery', 'Battery'],
  ['wrench', 'Wrench'],
  ['pylon', 'Power pylon'],
  ['code', 'Code / software'],
  ['swap', 'Swap arrows'],
  ['car', 'Car'],
  ['bag', 'Shopping bag'],
  ['check', 'Check mark'],
  ['cup', 'Cup'],
  ['cross', 'Medical cross'],
  ['bulb', 'Light bulb'],
  ['building', 'Building'],
  ['sun', 'Sun'],
  ['chip', 'Chip'],
].map(([value, title]) => ({value, title}))

const ls = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeString', fieldset, description})
const lt = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeText', fieldset, description})

export default defineType({
  name: 'clientsPage',
  title: 'Our Clients page',
  type: 'document',
  fieldsets: [
    {name: 'hero', title: 'Hero', options: {collapsible: true, collapsed: false}},
    {
      name: 'trustline',
      title: 'Trust line (under the page intro)',
      description: 'Reads: "Trusted by 50+ businesses • across 6 industries • 100% in-house". Numbers are shown in bold. The business count is also used on the Industries page.',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'wall',
      title: 'Client wall + industry filter',
      description: 'The logos are the Client documents; a client shows under a filter button when its Industry matches.',
      options: {collapsible: true, collapsed: true},
    },
    {
      name: 'track',
      title: 'Track record (dark "by the numbers" section)',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'industries',
      title: 'Industry cards',
      options: {collapsible: true, collapsed: false},
    },
    {name: 'cta', title: 'Closing call to action', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    ls('heroHeading', 'Heading', 'hero', `e.g. "The businesses we're proud to work with."`),
    ls('heroHighlight', 'Heading highlight (handwriting, blue)', 'hero', 'e.g. "proud". Must appear in the heading exactly as typed.'),
    lt('heroText', 'Intro paragraph', 'hero'),

    defineField({
      name: 'trustline',
      title: 'Trust line',
      type: 'object',
      fieldset: 'trustline',
      fields: [
        defineField({name: 'businessesBefore', title: '1 · Text before the number', description: 'e.g. "Trusted by"', type: 'localeString'}),
        defineField({name: 'businessesCount', title: '1 · Number (counts up)', description: 'e.g. 50', type: 'number', validation: (Rule) => Rule.integer().min(0)}),
        defineField({name: 'businessesAfter', title: '1 · Text after the number', description: 'Directly after the number, no space added — e.g. "+ businesses"', type: 'localeString'}),
        defineField({name: 'industriesBefore', title: '2 · Text before the number', description: 'e.g. "across"', type: 'localeString'}),
        defineField({name: 'industriesCount', title: '2 · Number', description: 'e.g. 6', type: 'number', validation: (Rule) => Rule.integer().min(0)}),
        defineField({name: 'industriesAfter', title: '2 · Text after the number', description: 'e.g. "industries"', type: 'localeString'}),
        defineField({name: 'inhouseValue', title: '3 · Bold value', description: 'e.g. "100%"', type: 'string'}),
        defineField({name: 'inhouseAfter', title: '3 · Text after the value', description: 'e.g. "in-house"', type: 'localeString'}),
      ],
    }),
    ls('filterAll', '"All" button', 'wall', 'e.g. "All Clients"'),
    defineField({
      name: 'filters',
      title: 'Industry filter buttons',
      description: 'One button per industry, in this order. Empty = the built-in six buttons.',
      type: 'array',
      fieldset: 'wall',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'clientsFilter',
          fields: [
            defineField({name: 'industry', title: 'Industry', type: 'reference', to: [{type: 'industry'}], validation: (Rule) => Rule.required()}),
            defineField({name: 'label', title: 'Button label', description: 'e.g. "Food & FMCG". Empty = the industry name.', type: 'localeString'}),
          ],
          preview: {select: {title: 'label.en', subtitle: 'industry.name.en'}},
        }),
      ],
    }),
    ls('wallHint', 'Hint under the wall', 'wall', 'e.g. "Filter by industry, or hover a logo to bring it to life"'),
    defineField({
      name: 'trackEyebrow',
      title: 'Eyebrow',
      description: 'Small label above the heading, e.g. "The track record".',
      type: 'localeString',
      fieldset: 'track',
    }),
    defineField({
      name: 'trackHeading',
      title: 'Heading',
      description: 'e.g. "Trust, by the numbers."',
      type: 'localeString',
      fieldset: 'track',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      description: 'Up to three cards, in order. Each card keeps its animation by position: 1 = client-logo stack, 2 = industry ring, 3 = progress ring.',
      type: 'array',
      fieldset: 'track',
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'clientsStat',
          fields: [
            defineField({name: 'value', title: 'Number (counts up)', type: 'number', validation: (Rule) => Rule.required().min(0)}),
            defineField({name: 'suffix', title: 'Suffix', description: 'Shown right after the number, e.g. "+" or "%". Leave empty for none.', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'localeString'}),
          ],
          preview: {
            select: {value: 'value', suffix: 'suffix', label: 'label.en'},
            prepare: ({value, suffix, label}) => ({title: `${value ?? ''}${suffix ?? ''}`, subtitle: label}),
          },
        }),
      ],
    }),
    ls('trackMarqueeCaption', 'Caption above the logo strip', 'track', 'e.g. "A few of the names behind the number". The strip shows every Client with a logo.'),
    ls('sectorsEyebrow', 'Eyebrow', 'industries', 'e.g. "Across every sector"'),
    ls('sectorsHeading', 'Heading', 'industries', 'e.g. "One system. Six industries."'),
    ls('sectorsHighlight', 'Heading highlight (handwriting, blue)', 'industries', 'e.g. "Six"'),
    lt('sectorsText', 'Paragraph', 'industries'),
    defineField({
      name: 'sectors',
      title: 'Industries',
      description: 'Up to six cards, in order (each card keeps its own icon and connector line by position). Each card lists four sub-areas.',
      type: 'array',
      fieldset: 'industries',
      validation: (Rule) => Rule.max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'clientsSector',
          fields: [
            defineField({name: 'title', title: 'Industry name', type: 'localeString'}),
            defineField({
              name: 'areas',
              title: 'Sub-areas',
              type: 'array',
              validation: (Rule) => Rule.max(4),
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'clientsSectorArea',
                  fields: [
                    defineField({name: 'caption', title: 'Caption', type: 'localeString'}),
                    defineField({
                      name: 'icon',
                      title: 'Icon',
                      type: 'string',
                      options: {list: ICONS},
                    }),
                  ],
                  preview: {
                    select: {title: 'caption.en', subtitle: 'icon'},
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'title.en'},
          },
        }),
      ],
    }),
    ls('ctaKicker', 'Handwritten line', 'cta'),
    ls('ctaHeading', 'Heading', 'cta'),
    ls('ctaPrimary', 'Primary button', 'cta', 'Opens the Contact page'),
    ls('ctaSecondary', 'Secondary button', 'cta', 'Opens the Contact page'),
  ],
  preview: {
    prepare: () => ({title: 'Our Clients page'}),
  },
})
