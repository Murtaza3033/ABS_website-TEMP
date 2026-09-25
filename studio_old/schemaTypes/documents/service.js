export default {
  name: 'service',
  title: 'Service',
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
    {name: 'summary', title: 'Summary', type: 'localeText'},
    {name: 'description', title: 'Description', type: 'localeBlock'},
    {
      name: 'illustration',
      title: 'Illustration / icon',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'localeString'}],
    },
    {name: 'order', title: 'Sort order', type: 'number'},
    {name: 'seo', title: 'SEO', type: 'seo'},
  ],
}
