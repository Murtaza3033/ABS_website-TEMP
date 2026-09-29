import {defineField, defineType, defineArrayMember} from 'sanity'

/* Main navigation (header + mobile menu) — singleton, fixed _id "navigation".
   The built-in items keep their own icons and places in the layout; items
   added here are appended (desktop: to their menu or as a top-level link;
   mobile: to their group) with a generic icon. Empty fields fall back to
   the built-in text. */

const ls = (name, title, description) => defineField({name, title, type: 'localeString', description})

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Main navigation',
    }),
    defineField({
      name: 'items',
      title: 'Navigation items',
      description: 'Top-level links and menus. A menu (Company, Products, Resources) opens a panel with its sub-items and a Spotlight box.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'localeString'}),
            defineField({name: 'href', title: 'Link', type: 'string', description: 'Page path ("/about-us") or full URL. Not used for menus.'}),
            defineField({
              name: 'children',
              title: 'Sub-items',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'navSubItem',
                  fields: [
                    defineField({name: 'label', title: 'Label', type: 'localeString'}),
                    defineField({name: 'href', title: 'Link', type: 'string'}),
                    ls('description', 'Description', 'Small grey line under the label in the desktop menu.'),
                  ],
                  preview: {select: {title: 'label.en', subtitle: 'href'}},
                }),
              ],
            }),
            ls('menuTitle', 'Menu heading', 'Menus only: the heading above the sub-items, e.g. "About Align".'),
            defineField({
              name: 'spotlight',
              title: 'Spotlight box',
              description: 'Menus only: the highlighted box on the right of the menu panel.',
              type: 'object',
              options: {collapsible: true, collapsed: true},
              fields: [
                ls('title', 'Title (handwriting)', 'e.g. "★ Built for growth."'),
                defineField({name: 'text', title: 'Text', type: 'localeText'}),
                ls('linkLabel', 'Link label', 'e.g. "See how we help →"'),
                defineField({name: 'href', title: 'Link', type: 'string'}),
              ],
            }),
            defineField({
              name: 'note',
              title: 'Note under the items',
              description: 'Company menu: the starred note under the sub-items.',
              type: 'object',
              options: {collapsible: true, collapsed: true},
              fields: [ls('title', 'Title'), ls('text', 'Text')],
            }),
          ],
          preview: {select: {title: 'label.en', subtitle: 'href'}},
        }),
      ],
    }),
    ls('ctaLabel', 'Header button label', 'The blue button at the right of the header, e.g. "Book a Demo".'),
    ls('mobileCtaLabel', 'Mobile menu button label', 'The same button at the bottom of the mobile menu, e.g. "Book a Demo →".'),
    defineField({name: 'ctaHref', title: 'Header button link', type: 'string', description: 'e.g. "/contact-us"'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Navigation'}
    },
  },
})
