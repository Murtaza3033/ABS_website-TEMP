export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {name: 'siteTitle', title: 'Site title', type: 'localeString'},
    {name: 'siteDescription', title: 'Site description', type: 'localeText'},
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'localeString'}],
    },
    {name: 'favicon', title: 'Favicon', type: 'image'},
    {name: 'email', title: 'Contact email', type: 'string'},
    {name: 'phone', title: 'Contact phone', type: 'string'},
    {name: 'address', title: 'Address', type: 'localeString'},
    {
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'bluesky', 'discord'],
              },
            },
            {name: 'url', title: 'URL', type: 'url'},
          ],
        },
      ],
    },
    {name: 'seo', title: 'Default SEO', type: 'seo'},
  ],
}
