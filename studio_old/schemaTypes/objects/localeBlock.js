export default {
  name: 'localeBlock',
  title: 'Localized rich text',
  type: 'object',
  fields: [
    {name: 'en', title: 'English', type: 'array', of: [{type: 'block'}]},
    {name: 'ar', title: 'Arabic', type: 'array', of: [{type: 'block'}]},
  ],
}
