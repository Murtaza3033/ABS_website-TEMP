export default {
  name: 'event',
  title: 'Event',
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
    {name: 'startDate', title: 'Start date', type: 'datetime'},
    {name: 'endDate', title: 'End date', type: 'datetime'},
    {name: 'location', title: 'Location', type: 'localeString'},
    {name: 'description', title: 'Description', type: 'localeBlock'},
    {
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'localeString'}],
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [{name: 'alt', title: 'Alt text', type: 'localeString'}],
        },
      ],
    },
    {name: 'seo', title: 'SEO', type: 'seo'},
  ],
}
