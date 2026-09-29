import {defineField, defineType, defineArrayMember} from 'sanity'

/* Site footer — singleton, fixed _id "footer". Contact details, office hours
   and social links live in Site Settings. The built-in links keep their
   places; links added to a column here are appended to it. Empty fields fall
   back to the built-in text. */

const ls = (name, title, description, fieldset) =>
  defineField({name, title, type: 'localeString', description, fieldset})

const FEATURE_ICONS = [
  {value: 'shield', title: 'Shield'},
  {value: 'lock', title: 'Lock'},
  {value: 'layers', title: 'Layers'},
  {value: 'trending', title: 'Trend line'},
  {value: 'check', title: 'Check'},
  {value: 'zap', title: 'Lightning'},
]

const link = (name) =>
  defineArrayMember({
    type: 'object',
    name,
    fields: [
      defineField({name: 'label', title: 'Label', type: 'localeString'}),
      defineField({name: 'href', title: 'Link', type: 'string'}),
    ],
    preview: {select: {title: 'label.en', subtitle: 'href'}},
  })

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fieldsets: [{name: 'bottom', title: 'Bottom bar', options: {collapsible: true, collapsed: true}}],
  fields: [
    defineField({name: 'title', title: 'Internal title', type: 'string', initialValue: 'Footer'}),
    ls('followLabel', '"Follow us" label', 'Above the social icons (the icons come from Site Settings → Social links).'),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'localeString'}),
            defineField({name: 'links', title: 'Links', type: 'array', of: [link('footerLink')]}),
          ],
          preview: {select: {title: 'heading.en'}},
        }),
      ],
    }),
    defineField({
      name: 'getStarted',
      title: '"Get Started" box',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        ls('heading', 'Heading'),
        defineField({name: 'text', title: 'Text', type: 'localeText'}),
        ls('buttonLabel', 'Button label', 'e.g. "Book a Demo"'),
        defineField({name: 'buttonHref', title: 'Button link', type: 'string'}),
        ls('supportTitle', 'Support card — title', 'e.g. "Need Support?"'),
        ls('supportText', 'Support card — text'),
        ls('supportLinkLabel', 'Support card — link label', 'e.g. "Visit Help Center →"'),
        defineField({name: 'supportLinkHref', title: 'Support card — link', type: 'string'}),
      ],
    }),
    defineField({
      name: 'features',
      title: 'Feature strip',
      description: 'The row of four highlights above the bottom bar.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerFeature',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'localeString'}),
            defineField({name: 'text', title: 'Text', type: 'localeString'}),
            defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: FEATURE_ICONS}}),
          ],
          preview: {select: {title: 'title.en', subtitle: 'text.en'}},
        }),
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({name: 'copyrightText', title: 'Copyright text', type: 'localeString', fieldset: 'bottom'}),
    defineField({
      name: 'legalLinks',
      title: 'Legal links',
      description: 'Privacy Policy, Terms… A link without a URL (or with "#") stays hidden until its page exists.',
      type: 'array',
      fieldset: 'bottom',
      of: [link('legalLink')],
    }),
    ls('tagline', 'Tagline (bottom right)', 'e.g. "Enterprise software, built in-house."', 'bottom'),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Footer'}
    },
  },
})
