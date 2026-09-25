export default {
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    {name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()},
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
    },
    {name: 'website', title: 'Website', type: 'url'},
    {name: 'order', title: 'Sort order', type: 'number'},
  ],
}
