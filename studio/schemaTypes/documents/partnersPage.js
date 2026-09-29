import {defineField, defineType, defineArrayMember} from 'sanity'
import {pageSeoField} from '../objects/pageSeoField'

/* Our Partners page (/our-partners) — singleton, fixed _id "partnersPage"
   (see sanity.config.js). Page texts and the hero photo only; the partners
   themselves are "Partner" documents (the one ticked "Featured" — else the
   first by sort order — fills the featured card, any others are listed under
   it). The frontend falls back to the built-in copy for anything left empty.

   Icon keys must match ICON_PATHS in src/pages/OurPartners/partnersData.jsx. */
const ICONS = [
  ['globe', 'Globe'],
  ['megaphone', 'Megaphone'],
  ['chip', 'Chip'],
  ['support', 'Chat bubble'],
  ['trending', 'Trending up'],
  ['shield', 'Shield'],
].map(([value, title]) => ({value, title}))

const ls = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeString', fieldset, description})
const lt = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeText', fieldset, description})

export default defineType({
  name: 'partnersPage',
  title: 'Our Partners page',
  type: 'document',
  fieldsets: [
    {name: 'hero', title: '1 · Hero', options: {collapsible: true, collapsed: false}},
    {name: 'network', title: '2 · Partners network + featured partner', description: 'The partners themselves are Partner documents.', options: {collapsible: true, collapsed: true}},
    {name: 'benefits', title: '3 · Partnership benefits', options: {collapsible: true, collapsed: true}},
    {name: 'cta', title: '4 · Closing call to action', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    ls('heroEyebrow', 'Eyebrow', 'hero', 'e.g. "Partners"'),
    ls('heroLine1', 'Heading — line 1', 'hero', 'e.g. "Growth is better"'),
    ls('heroLine2', 'Heading — line 2', 'hero', 'e.g. "built together."'),
    ls('heroHighlight', 'Heading highlight (handwriting, blue)', 'hero', 'Words from line 2 to write in blue handwriting, e.g. "together". Must appear in line 2 exactly as typed.'),
    lt('heroText', 'Intro paragraph', 'hero'),
    ls('heroTextHighlight', 'Intro highlight (handwriting, blue)', 'hero', 'Words from the intro to write in blue handwriting, e.g. "limitless possibilities".'),
    defineField({
      name: 'heroImage',
      title: 'Hero photo',
      description: 'Shown tinted blue behind the two-way value card.',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'hero',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'localeString'})],
    }),
    ls('heroImageCaption', 'Caption on the photo', 'hero', 'e.g. "Value flowing both ways"'),
    ls('heroScrollCue', 'Scroll hint', 'hero', 'e.g. "Explore"'),

    ls('networkEyebrow', 'Eyebrow', 'network', 'e.g. "Our Network"'),
    ls('networkHeading', 'Heading', 'network'),
    lt('networkText', 'Paragraph', 'network'),
    ls('networkButton', 'Button label', 'network', 'Opens the Contact page, e.g. "Contact Us"'),
    ls('networkLink', 'Link label', 'network', 'Scrolls to the featured partner, e.g. "Learn More →"'),
    ls('featuredBubble', 'Bubble above the featured card', 'network', 'e.g. "Meet a partner in our network"'),
    ls('featuredBadge', 'Featured card badge', 'network', 'e.g. "Featured Partner"'),
    ls('featuredStatus', 'Featured card status', 'network', 'e.g. "Active"'),
    ls('moreHeading', '"More partners" heading', 'network', 'Only shown when there is more than one partner.'),

    ls('benefitsEyebrow', 'Eyebrow', 'benefits'),
    ls('benefitsHeading', 'Heading', 'benefits', 'e.g. "Unlock the Power of Partnership"'),
    ls('benefitsHighlight', 'Heading highlight (handwriting, blue)', 'benefits', 'e.g. "Power". Must appear in the heading exactly as typed.'),
    defineField({
      name: 'benefits',
      title: 'Benefit cards',
      description: 'The carousel cards, in order (numbered automatically).',
      type: 'array',
      fieldset: 'benefits',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'partnersBenefit',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'localeString'}),
            defineField({name: 'text', title: 'Text', type: 'localeText'}),
            defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: ICONS}}),
          ],
          preview: {select: {title: 'title.en', subtitle: 'icon'}},
        }),
      ],
    }),
    ls('benefitsHint', 'Hint under the carousel', 'benefits', 'e.g. "Swipe, drag, or use ← → to explore"'),

    ls('ctaKicker', 'Handwritten line', 'cta'),
    ls('ctaHeading', 'Heading', 'cta'),
    ls('ctaPrimary', 'Primary button', 'cta', 'Opens the Contact page'),
    ls('ctaSecondary', 'Secondary button', 'cta', 'Opens the Contact page'),
    pageSeoField(),
  ],
  preview: {
    prepare: () => ({title: 'Our Partners page'}),
  },
})
