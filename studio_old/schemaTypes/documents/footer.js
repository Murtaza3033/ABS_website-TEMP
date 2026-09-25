export default {
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    {name: 'title', title: 'Internal title', type: 'string', initialValue: 'Footer'},
    {
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'footerColumn',
          fields: [
            {name: 'heading', title: 'Heading', type: 'localeString'},
            {
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'footerLink',
                  fields: [
                    {name: 'label', title: 'Label', type: 'localeString'},
                    {name: 'href', title: 'Link', type: 'string'},
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {name: 'copyrightText', title: 'Copyright text', type: 'localeString'},
  ],
}
