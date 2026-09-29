import {defineField, defineType, defineArrayMember} from 'sanity'
import {pageSeoField} from '../objects/pageSeoField'

/* Events page (/events) — singleton, fixed _id "eventsPage" (see
   sanity.config.js). Page texts and photos only; the events themselves are
   "Event" documents. The frontend falls back to the built-in copy/photo for
   anything left empty, so a field can be cleared safely. */
const ls = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeString', fieldset, description})
const lt = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeText', fieldset, description})
const img = (name, title, fieldset, description) =>
  defineField({
    name,
    title,
    type: 'image',
    options: {hotspot: true},
    fieldset,
    description,
    fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
  })

export default defineType({
  name: 'eventsPage',
  title: 'Events page',
  type: 'document',
  fieldsets: [
    {name: 'hero', title: '1 · Hero', options: {collapsible: true, collapsed: false}},
    {name: 'featured', title: '2 · Featured event + More events', description: 'The events themselves are Event documents.', options: {collapsible: true, collapsed: true}},
    {name: 'why', title: '3 · Why we show up', options: {collapsible: true, collapsed: true}},
    {name: 'next', title: "4 · What's next", options: {collapsible: true, collapsed: true}},
    {name: 'cta', title: '5 · Closing call to action', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    ls('heroTitle', 'Heading', 'hero', `The whole heading, e.g. "Where you'll find us — out in the industry."`),
    ls('heroHighlight', 'Heading highlight (handwriting, blue)', 'hero', 'Words from the heading to write in blue handwriting, e.g. "find us". Must appear in the heading exactly as typed.'),
    lt('heroText', 'Intro paragraph', 'hero'),
    defineField({
      name: 'heroTags',
      title: 'Tags under the intro',
      type: 'array',
      fieldset: 'hero',
      of: [defineArrayMember({type: 'localeString'})],
    }),
    ls('heroScrollCue', 'Scroll hint', 'hero', 'e.g. "Explore"'),

    ls('featuredEyebrow', 'Eyebrow', 'featured', 'e.g. "Featured Event"'),
    ls('pastLabel', 'Status on the photo — past event', 'featured', 'e.g. "Exhibited"'),
    ls('upcomingLabel', 'Status on the photo — upcoming event', 'featured', 'e.g. "Upcoming"'),
    ls('boothLabel', 'Booth card label', 'featured', 'e.g. "Find us at"'),
    ls('moreEyebrow', '"More events" eyebrow', 'featured', 'Only shown when there is more than one event.'),
    ls('moreHeading', '"More events" heading', 'featured'),

    ls('whyEyebrow', 'Eyebrow', 'why'),
    ls('whyHeading', 'Heading', 'why', 'e.g. "The best conversations happen"'),
    ls('whyHighlight', 'Heading highlight (handwriting, blue)', 'why', 'e.g. "in person"'),
    lt('whyText', 'Intro paragraph', 'why'),
    defineField({
      name: 'whyCards',
      title: 'Cards',
      type: 'array',
      fieldset: 'why',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'eventsWhyCard',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'localeString'}),
            defineField({name: 'text', title: 'Text', type: 'localeText'}),
            defineField({name: 'linkLabel', title: 'Link label', type: 'localeString'}),
            defineField({name: 'href', title: 'Link', type: 'string', description: 'e.g. /contact-us.html'}),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
            }),
          ],
          preview: {select: {title: 'title.en', subtitle: 'linkLabel.en', media: 'image'}},
        }),
      ],
    }),

    ls('nextEyebrow', 'Eyebrow', 'next', `e.g. "What's next"`),
    ls('nextHeading', 'Heading', 'next'),
    lt('nextText', 'Text', 'next'),
    ls('nextButton', 'Button label', 'next'),
    defineField({name: 'nextButtonUrl', title: 'Button link', type: 'url', fieldset: 'next', description: 'Empty = the LinkedIn link from Site Settings.'}),
    img('nextImage', 'Background photo (faded)', 'next'),

    ls('ctaKicker', 'Handwritten line', 'cta'),
    lt('ctaHeading', 'Heading', 'cta'),
    ls('ctaPrimary', 'Primary button label', 'cta', 'Links to the contact page.'),
    ls('ctaSecondary', 'Secondary button label', 'cta', 'Links to the contact page.'),
    pageSeoField(),
  ],
  preview: {
    prepare: () => ({title: 'Events page'}),
  },
})
