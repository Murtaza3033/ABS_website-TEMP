export default {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    {name: 'name', title: 'Name', type: 'localeString', validation: (Rule) => Rule.required()},
    {name: 'role', title: 'Role / title', type: 'localeString'},
    {name: 'bio', title: 'Bio', type: 'localeText'},
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'localeString'}],
    },
    {
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            {name: 'platform', title: 'Platform', type: 'string'},
            {name: 'url', title: 'URL', type: 'url'},
          ],
        },
      ],
    },
    {name: 'order', title: 'Sort order', type: 'number'},
  ],
}
