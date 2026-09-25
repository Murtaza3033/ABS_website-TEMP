export default {
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    {name: 'title', title: 'Internal title', type: 'string', initialValue: 'Main navigation'},
    {
      name: 'items',
      title: 'Navigation items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          fields: [
            {name: 'label', title: 'Label', type: 'localeString'},
            {name: 'href', title: 'Link', type: 'string'},
            {
              name: 'children',
              title: 'Sub-items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'navSubItem',
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
  ],
}
