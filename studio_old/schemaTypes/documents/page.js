export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {name: 'title', title: 'Title', type: 'localeString', validation: (Rule) => Rule.required()},
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title.en', maxLength: 96},
      validation: (Rule) => Rule.required(),
    },
    {name: 'heroTitle', title: 'Hero title', type: 'localeString'},
    {name: 'heroSubtitle', title: 'Hero subtitle', type: 'localeText'},
    {name: 'body', title: 'Body', type: 'localeBlock'},
    {name: 'seo', title: 'SEO', type: 'seo'},
  ],
}
