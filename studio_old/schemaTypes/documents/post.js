export default {
  name: 'post',
  title: 'Post',
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
    {name: 'excerpt', title: 'Excerpt', type: 'localeText'},
    {name: 'body', title: 'Body', type: 'localeBlock'},
    {
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'localeString'}],
    },
    {name: 'author', title: 'Author', type: 'reference', to: [{type: 'teamMember'}]},
    {name: 'publishedAt', title: 'Published at', type: 'datetime'},
    {name: 'categories', title: 'Categories', type: 'array', of: [{type: 'string'}]},
    {name: 'seo', title: 'SEO', type: 'seo'},
  ],
}
