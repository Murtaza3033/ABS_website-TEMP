export default {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    },
    {name: 'answer', title: 'Answer', type: 'localeText'},
    {name: 'category', title: 'Category', type: 'string'},
    {name: 'order', title: 'Sort order', type: 'number'},
  ],
}
