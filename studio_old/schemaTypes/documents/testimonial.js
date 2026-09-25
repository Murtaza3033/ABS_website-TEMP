export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'quote',
      title: 'Quote',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
    },
    {name: 'authorName', title: 'Author name', type: 'string'},
    {name: 'authorRole', title: 'Author role', type: 'localeString'},
    {name: 'authorCompany', title: 'Author company', type: 'string'},
    {
      name: 'authorPhoto',
      title: 'Author photo',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
    },
    {name: 'order', title: 'Sort order', type: 'number'},
  ],
}
