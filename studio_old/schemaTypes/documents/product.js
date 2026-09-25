export default {
  name: 'product',
  title: 'Product',
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
    {name: 'tagline', title: 'Tagline', type: 'localeText'},
    {name: 'description', title: 'Description', type: 'localeBlock'},
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'localeString'}],
    },
    {
      name: 'screenshots',
      title: 'Screenshots',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [{name: 'alt', title: 'Alt text', type: 'localeString'}],
        },
      ],
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'productFeature',
          fields: [
            {name: 'title', title: 'Title', type: 'localeString'},
            {name: 'description', title: 'Description', type: 'localeText'},
            {name: 'icon', title: 'Icon', type: 'image'},
          ],
        },
      ],
    },
    {name: 'order', title: 'Sort order', type: 'number'},
    {name: 'seo', title: 'SEO', type: 'seo'},
  ],
}
