export default {
  name: 'client',
  title: 'Client',
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
    {name: 'industry', title: 'Industry', type: 'reference', to: [{type: 'industry'}]},
    {name: 'order', title: 'Sort order', type: 'number'},
  ],
}
