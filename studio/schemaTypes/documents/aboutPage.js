import {defineField, defineType, defineArrayMember} from 'sanity'
import {pageSeoField} from '../objects/pageSeoField'

/* About Us page (/about-us) — singleton, fixed _id "aboutPage" (see
   sanity.config.js). The frontend falls back to the built-in copy/photo for
   anything left empty, so a field can be cleared safely.

   Icon keys must match ICON_PATHS in src/pages/AboutUs/aboutData.jsx.
   Card colours (strip tints, stat and network accents, carousel accents)
   stay in code and follow the item's position. */
const ICONS = [
  {value: 'layers', title: 'Layers'},
  {value: 'target', title: 'Target'},
  {value: 'zap', title: 'Lightning'},
  {value: 'spark', title: 'Spark'},
  {value: 'check', title: 'Check box'},
  {value: 'heart', title: 'Heart'},
  {value: 'building', title: 'Building'},
  {value: 'flag', title: 'Flag'},
]
const RINGS = [
  {value: 'blue', title: 'Blue'},
  {value: 'gold', title: 'Gold'},
  {value: 'green', title: 'Green'},
]

const ls = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeString', fieldset, description})
const lt = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeText', fieldset, description})
const img = (name, title, fieldset, description) =>
  defineField({name, title, type: 'image', options: {hotspot: true}, fieldset, description})
const list = (name, title, fieldset, fields, preview, extra = {}) =>
  defineField({
    name,
    title,
    type: 'array',
    fieldset,
    ...extra,
    of: [defineArrayMember({type: 'object', name: `about_${name}`, fields, preview})],
  })

export default defineType({
  name: 'aboutPage',
  title: 'About Us page',
  type: 'document',
  fieldsets: [
    {name: 'hero', title: '1 · Hero + photo strip', options: {collapsible: true, collapsed: false}},
    {name: 'who', title: '2 · Who we are', options: {collapsible: true, collapsed: true}},
    {name: 'why', title: '3 · Why Align exists', options: {collapsible: true, collapsed: true}},
    {name: 'journey', title: '4 · Our journey', options: {collapsible: true, collapsed: true}},
    {name: 'rec', title: '5 · Recognition gallery + stats', options: {collapsible: true, collapsed: true}},
    {name: 'build', title: '6 · What we build (product carousel)', options: {collapsible: true, collapsed: true}},
    {name: 'exp', title: '7 · Expertise', options: {collapsible: true, collapsed: true}},
    {name: 'values', title: '8 · Values', options: {collapsible: true, collapsed: true}},
    {name: 'net', title: '9 · People & network', options: {collapsible: true, collapsed: true}},
    {name: 'cta', title: '10 · Closing call to action', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // 1 · Hero
    ls('heroEyebrow', 'Eyebrow', 'hero'),
    lt('heroHeading', 'Heading', 'hero', 'One line per row (press Enter for a line break).'),
    lt('heroText', 'Intro paragraph', 'hero'),
    ls('heroPrimaryCta', 'Primary button label', 'hero', 'Links to Our Team.'),
    ls('heroSecondaryCta', 'Secondary button label', 'hero', 'Links to the contact page.'),
    img('heroBackground', 'Faint background photo', 'hero', 'Shown very faintly behind the heading.'),
    list('strip', 'Photo strip', 'hero', [
      img('image', 'Photo'),
      ls('caption', 'Caption'),
    ], {select: {title: 'caption.en', media: 'image'}}),

    // 2 · Who we are
    ls('whoEyebrow', 'Eyebrow', 'who'),
    ls('whoHeading', 'Heading', 'who'),
    lt('whoText', 'Paragraph', 'who'),
    img('whoImage', 'Photo', 'who'),
    ls('whoImageAlt', 'Photo alt text', 'who'),

    // 3 · Why
    ls('whyEyebrow', 'Eyebrow', 'why'),
    ls('whyHeading', 'Heading', 'why'),
    lt('whyText', 'Paragraph', 'why'),

    // 4 · Journey
    ls('journeyEyebrow', 'Eyebrow', 'journey'),
    ls('journeyHeading', 'Heading', 'journey'),
    ls('journeyNote', 'Note under the heading', 'journey', 'Small grey line.'),
    list('milestones', 'Milestones', 'journey', [
      ls('year', 'Year / label', undefined, 'e.g. "2023" or "Today"'),
      ls('title', 'Title'),
      lt('text', 'Short text (optional)'),
      img('image', 'Photo (shown in the circle)'),
      defineField({name: 'ring', title: 'Ring colour', type: 'string', options: {list: RINGS, layout: 'radio', direction: 'horizontal'}, initialValue: 'blue'}),
    ], {select: {title: 'title.en', subtitle: 'year.en', media: 'image'}}),

    // 5 · Recognition
    ls('recEyebrow', 'Eyebrow', 'rec'),
    ls('recHeading', 'Heading', 'rec'),
    lt('recText', 'Paragraph', 'rec'),
    list('gallery', 'Gallery', 'rec', [
      img('image', 'Photo'),
      ls('caption', 'Caption'),
      ls('subcaption', 'Second line', undefined, 'Only shown on the first (large) photo.'),
      ls('alt', 'Alt text', undefined, 'Defaults to the caption.'),
    ], {select: {title: 'caption.en', media: 'image'}}, {description: 'The first photo is the large one on the left; up to four more fill the grid.', validation: (Rule) => Rule.max(5)}),
    list('stats', 'Stat cards', 'rec', [
      ls('value', 'Value', undefined, 'e.g. "4" or "In-house"'),
      ls('label', 'Label'),
      defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: ICONS}}),
    ], {select: {title: 'value.en', subtitle: 'label.en'}}),

    // 6 · What we build
    ls('buildEyebrow', 'Eyebrow', 'build'),
    ls('buildHeading', 'Heading', 'build'),
    lt('buildText', 'Paragraph', 'build'),
    list('products', 'Carousel slides', 'build', [
      ls('name', 'Product name'),
      defineField({name: 'url', title: 'Address bar text', description: 'e.g. "app.businessflo.com"', type: 'string'}),
      img('image', 'Dashboard screenshot'),
      ls('topTitle', 'Top card · title'),
      ls('topSub', 'Top card · second line'),
      ls('botLabel', 'Bottom card · label'),
      defineField({name: 'botValue', title: 'Bottom card · value', type: 'string'}),
      ls('botDelta', 'Bottom card · change line'),
    ], {select: {title: 'name.en', subtitle: 'url', media: 'image'}}),

    // 7 · Expertise
    ls('expEyebrow', 'Eyebrow', 'exp'),
    ls('expHeading', 'Heading', 'exp'),
    lt('expText', 'Paragraph', 'exp'),
    list('expertise', 'Expertise cards', 'exp', [
      ls('title', 'Title'),
      lt('text', 'Text'),
      defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: ICONS}}),
    ], {select: {title: 'title.en', subtitle: 'icon'}}),
    defineField({name: 'techStack', title: 'Tech stack pills', type: 'array', fieldset: 'exp', of: [defineArrayMember({type: 'string'})]}),

    // 8 · Values
    ls('valuesEyebrow', 'Eyebrow', 'values'),
    ls('valuesHeading', 'Heading', 'values'),
    list('values', 'Values', 'values', [
      ls('title', 'Title'),
      lt('text', 'Text'),
      defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: ICONS}}),
    ], {select: {title: 'title.en', subtitle: 'text.en'}}, {description: 'Numbered automatically (01, 02, …).'}),
    ls('valuesNote', 'Note under the cards', 'values', 'Small grey line.'),

    // 9 · Network
    ls('netEyebrow', 'Eyebrow', 'net'),
    ls('netHeading', 'Heading', 'net'),
    list('network', 'Cards', 'net', [
      ls('title', 'Title'),
      ls('tag', 'Tag'),
      lt('text', 'Text'),
      defineField({name: 'href', title: 'Link', description: 'e.g. "/our-team.html"', type: 'string'}),
      img('image', 'Photo'),
    ], {select: {title: 'title.en', subtitle: 'href', media: 'image'}}),

    // 10 · CTA
    lt('ctaHeading', 'Heading', 'cta'),
    ls('ctaPrimary', 'Primary button label', 'cta', 'Links to the contact page.'),
    ls('ctaSecondary', 'Secondary button label', 'cta', 'Links to the contact page.'),
    pageSeoField(),
  ],
  preview: {
    prepare: () => ({title: 'About Us page'}),
  },
})
