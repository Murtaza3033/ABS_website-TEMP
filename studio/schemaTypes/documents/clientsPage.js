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

export default defineType({
  name: 'clientsPage',
  title: 'Our Clients page',
  type: 'document',
  fieldsets: [
    {
      name: 'trustline',
      title: 'Trust line (under the page intro)',
      description: 'Reads: "Trusted by 50+ businesses • across 6 industries • 100% in-house". Numbers are shown in bold.',
      options: {collapsible: true, collapsed: false},
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
  ],
  fields: [
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
  ],
  preview: {
    prepare: () => ({title: 'Our Clients page'}),
  },
})
