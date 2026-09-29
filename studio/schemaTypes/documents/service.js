import {defineField, defineType, defineArrayMember} from 'sanity'

/* A service card on the home page ("We also build, what you can't buy."):
   the list shows image + title + short description; clicking opens a pop-up
   with the image, tag, title, long description and feature chips. Cards are
   sorted by "Sort order"; any number works (the list scrolls). */
export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Title',
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
      name: 'tag',
      title: 'Tag (pop-up label)',
      description: 'Small blue label at the top of the pop-up, e.g. "Web Development".',
      type: 'localeString',
    }),
    defineField({
      name: 'tagline',
      title: 'Short description (card)',
      description: 'One short line under the title in the list, e.g. "Built to spec".',
      type: 'localeString',
    }),
    defineField({
      name: 'summary',
      title: 'Long description (pop-up)',
      type: 'localeText',
    }),
    defineField({
      name: 'features',
      title: 'Feature chips (pop-up)',
      description: 'Short words, e.g. "Responsive".',
      type: 'array',
      of: [defineArrayMember({type: 'localeString'})],
    }),
    defineField({
      name: 'illustration',
      title: 'Image',
      description: 'Card thumbnail and pop-up picture.',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
    defineField({name: 'description', title: 'Description (not shown on the site yet)', type: 'localeBlock'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  orderings: [{title: 'Sort order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name.en', subtitle: 'tagline.en', media: 'illustration'},
  },
})
