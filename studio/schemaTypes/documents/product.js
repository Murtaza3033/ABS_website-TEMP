import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fieldsets: [
    {
      name: 'hero',
      title: 'Home page hero',
      description: 'Text shown when this product is selected in the home page hero switcher.',
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
