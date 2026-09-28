import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fieldsets: [
    {
      name: 'hero',
      title: 'Home page hero',
      description: 'Text shown when this product is selected in the home page hero switcher, including the hand-drawn notes on its demo.',
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
      name: 'heroTitle',
      title: 'Hero headline',
      description: 'First part of the headline, in dark text (e.g. "Go 100% paperless.").',
      type: 'localeString',
      fieldset: 'hero',
    }),
    defineField({
      name: 'heroHighlight',
      title: 'Hero headline — highlighted part',
      description: 'Second part of the headline, shown in blue (e.g. "Transform your operations.").',
      type: 'localeString',
      fieldset: 'hero',
    }),
    defineField({
      name: 'heroText',
      title: 'Hero paragraph',
      type: 'localeText',
      fieldset: 'hero',
    }),
    defineField({
      name: 'heroNotes',
      title: 'Hero hand-drawn notes',
      description:
        'The handwritten tips (with arrows) around the hero demo. Order matters — each entry replaces the note at that position: ' +
        'Businessflo: 1 = "AI Hub", 2 = "Approve on the go". ' +
        'PeopleNest: 1 = "Try our menu", 2 = "click to change the view". ' +
        'HMSflo: 1 = "Live OPD queue", 2 = "switch screens", 3 = "tap to triage". ' +
        'Field Force has no notes (entries are ignored). Positions and arrows are fixed in code; ' +
        'keep text about as long as today’s. Press Enter for a line break. Empty fields show the built-in text.',
      type: 'array',
      fieldset: 'hero',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'heroNote',
          fields: [
            defineField({name: 'text', title: 'Note (handwriting)', type: 'localeText'}),
            defineField({
              name: 'sub',
              title: 'Small line under the note (optional)',
              description: 'Only shown for notes that have one today (Businessflo 1 & 2, HMSflo 1).',
              type: 'localeText',
            }),
          ],
          preview: {
            select: {title: 'text.en', subtitle: 'sub.en'},
          },
        }),
      ],
    }),
    defineField({name: 'tagline', title: 'Tagline', type: 'localeText'}),
    defineField({name: 'description', title: 'Description', type: 'localeBlock'}),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
    }),
    defineField({
      name: 'screenshots',
      title: 'Screenshots',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
        }),
      ],
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'productFeature',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'localeString'}),
            defineField({name: 'description', title: 'Description', type: 'localeText'}),
            defineField({name: 'icon', title: 'Icon', type: 'image'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'name.en', subtitle: 'tagline.en', media: 'logo'},
  },
})
