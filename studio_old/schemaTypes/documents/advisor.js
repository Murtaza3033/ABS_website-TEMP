export default {
  name: 'advisor',
  title: 'Advisor',
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
    {name: 'order', title: 'Sort order', type: 'number'},
  ],
}
