export default {
  name: 'job',
  title: 'Job Opening',
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
    {name: 'department', title: 'Department', type: 'string'},
    {name: 'location', title: 'Location', type: 'localeString'},
    {
      name: 'employmentType',
      title: 'Employment type',
      type: 'string',
      options: {list: ['full-time', 'part-time', 'contract', 'internship']},
    },
    {name: 'description', title: 'Description', type: 'localeBlock'},
    {name: 'requirements', title: 'Requirements', type: 'localeBlock'},
    {name: 'applyUrl', title: 'Apply URL', type: 'url'},
    {name: 'applyEmail', title: 'Apply email', type: 'string'},
    {name: 'isActive', title: 'Active', type: 'boolean', initialValue: true},
    {name: 'seo', title: 'SEO', type: 'seo'},
  ],
}
