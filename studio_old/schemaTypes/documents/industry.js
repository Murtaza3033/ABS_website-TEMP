export default {
  name: 'industry',
  title: 'Industry',
  type: 'document',
  fields: [
    {name: 'name', title: 'Name', type: 'localeString', validation: (Rule) => Rule.required()},
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name.en', maxLength: 96},
      validation: (Rule) => Rule.required(),
    },
    {name: 'description', title: 'Description', type: 'localeText'},
    {
      name: 'illustration',
      title: 'Illustration',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'localeString'}],
    },
    {name: 'order', title: 'Sort order', type: 'number'},
  ],
}
