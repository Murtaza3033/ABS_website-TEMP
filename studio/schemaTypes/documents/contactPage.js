import {defineField, defineType, defineArrayMember} from 'sanity'
import {pageSeoField} from '../objects/pageSeoField'

/* Contact Us page (/contact-us) — singleton, fixed _id "contactPage" (see
   sanity.config.js). Page texts, photos and the presence map only. Emails,
   phones, the address, office hours, response time and social links live in
   Site Settings (shared with the footer and the chat assistant). The contact
   form itself (fields, validation) stays in code. */
const ls = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeString', fieldset, description})
const lt = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeText', fieldset, description})

const ANCHORS = [
  {value: 'c', title: 'Centred on the dot'},
  {value: 't', title: 'Below the dot'},
  {value: 'br', title: 'Above-left of the dot'},
  {value: 'bl', title: 'Above-right of the dot'},
]

export default defineType({
  name: 'contactPage',
  title: 'Contact Us page',
  type: 'document',
  fieldsets: [
    {name: 'hero', title: '1 · Hero', options: {collapsible: true, collapsed: false}},
    {name: 'map', title: '2 · Our presence (map)', options: {collapsible: true, collapsed: true}},
    {name: 'cards', title: '3 · Contact cards', description: 'Department names, emails, phones and the address are in Site Settings.', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    ls('heroEyebrow', 'Eyebrow', 'hero'),
    ls('heroTitle', 'Heading', 'hero', `e.g. "Let's"`),
    ls('heroHighlight', 'Heading highlight (handwriting, blue)', 'hero', 'e.g. "start the conversation."'),
    lt('heroText', 'Intro paragraph', 'hero'),
    defineField({
      name: 'heroImage',
      title: 'Background photo (faded)',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'hero',
    }),

    ls('mapEyebrow', 'Eyebrow', 'map'),
    ls('mapHeading', 'Heading', 'map'),
    lt('mapText', 'Text', 'map'),
    defineField({
      name: 'mapImage',
      title: 'Map image',
      description: 'The labelled world map (1672 × 941). Pins are invisible tap targets placed over it, so keep their positions in step with the image.',
      type: 'image',
      fieldset: 'map',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
    }),
    defineField({
      name: 'pins',
      title: 'Map pins',
      type: 'array',
      fieldset: 'map',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'mapPin',
          fields: [
            defineField({name: 'city', title: 'Place', type: 'localeString', description: 'e.g. "Karachi" or "Dubai, UAE"'}),
            defineField({name: 'tag', title: 'Type', type: 'localeString', description: 'e.g. "Headquarters", "Regional office"'}),
            defineField({name: 'label', title: 'Description', type: 'localeText'}),
            defineField({name: 'x', title: 'X position (% from left)', type: 'number', validation: (Rule) => Rule.required().min(0).max(100)}),
            defineField({name: 'y', title: 'Y position (% from top)', type: 'number', validation: (Rule) => Rule.required().min(0).max(100)}),
            defineField({name: 'hit', title: 'Tap target size (px)', type: 'number', initialValue: 32, validation: (Rule) => Rule.min(32)}),
            defineField({name: 'anchor', title: 'Tap target placement', type: 'string', options: {list: ANCHORS}, initialValue: 'c'}),
            defineField({name: 'group', title: 'Cluster group', type: 'string', description: 'Pins very close together share a group (e.g. "pk", "gulf") and merge into one zoom button on small screens.'}),
          ],
          preview: {select: {title: 'city.en', subtitle: 'tag.en'}},
        }),
      ],
    }),

    ls('headOfficeTitle', 'Head office card — title', 'cards', 'The address itself is in Site Settings.'),
    ls('viewOnMap', 'Head office card — map link label', 'cards'),
    pageSeoField(),
  ],
  preview: {
    prepare: () => ({title: 'Contact Us page'}),
  },
})
