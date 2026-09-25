export default {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {name: 'metaTitle', title: 'Meta title', type: 'localeString'},
    {name: 'metaDescription', title: 'Meta description', type: 'localeText'},
    {
      name: 'shareImage',
      title: 'Share image',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    },
  ],
}
