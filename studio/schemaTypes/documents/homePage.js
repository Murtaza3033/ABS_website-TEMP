import {defineField, defineType, defineArrayMember} from 'sanity'

/* Home page (/) — singleton, fixed _id "homePage" (see sanity.config.js).
   Texts and images of every section below the hero (the hero itself is
   edited on the Product documents). The frontend falls back to the built-in
   copy/image for anything left empty, so a field can be cleared safely.

   Content kept in code on purpose: the animated mock dashboards/widgets
   (product demo cards, industry "LIVE" widgets, journey line), the icons and
   the positions of cards that sit on fixed diagrams (orbit, journey line).
   Lists tied to those diagrams use their first N entries (N noted per field).

   Elsewhere: client logos = Client documents; product cards can link a
   Product; services = Service documents; industries = Industry documents. */
const ls = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeString', fieldset, description})
const lt = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeText', fieldset, description})
const list = (name, title, fieldset, description, objName, fields, preview) =>
  defineField({
    name,
    title,
    description,
    type: 'array',
    fieldset,
    of: [defineArrayMember({type: 'object', name: objName, fields, preview})],
  })
const f = (name, title, type = 'localeString', description) => defineField({name, title, type, description})

export default defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  fieldsets: [
    {name: 'clients', title: '1 · Clients (logo mosaic)', description: 'The logos are the Client documents that have a logo (sorted by their sort order).', options: {collapsible: true, collapsed: false}},
    {name: 'think', title: '2 · How we think (dark section + benefits card)', options: {collapsible: true, collapsed: true}},
    {name: 'problems', title: '3 · Chaos to aligned (Align ON/OFF journey)', options: {collapsible: true, collapsed: true}},
    {name: 'products', title: '4 · One platform (product cards)', options: {collapsible: true, collapsed: true}},
    {name: 'services', title: '5 · Why Align + services', description: 'The service cards and their pop-ups are Service documents.', options: {collapsible: true, collapsed: true}},
    {name: 'industries', title: '6 · Industries', description: 'The tabs, pictures and short texts are the Industry documents (sorted by their sort order).', options: {collapsible: true, collapsed: true}},
    {name: 'cta', title: '7 · Closing call to action', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // 1 · Clients
    ls('clientsHeading', 'Heading', 'clients', 'e.g. "The businesses that grow with"'),
    ls('clientsHighlight', 'Heading — blue ending', 'clients', 'e.g. "Align"'),
    lt('clientsText', 'Text under the heading', 'clients'),

    // 2 · How we think
    ls('benefitsEyebrow', 'Floating card — small label', 'think', 'e.g. "Clients Benefits"'),
    ls('benefitsHeading', 'Floating card — heading', 'think'),
    list('benefits', 'Floating card — benefits', 'think', 'Shown in a 2-column grid; icons follow the position (6 icons, repeating).', 'homeBenefit',
      [f('title', 'Title'), f('text', 'Text')], {select: {title: 'title.en', subtitle: 'text.en'}}),
    ls('thinkEyebrow', 'Small label', 'think', 'e.g. "How we think"'),
    ls('thinkHeading', 'Heading', 'think'),
    lt('thinkText', 'Intro paragraph', 'think'),
    list('thinkCards', 'Cards', 'think', 'First 3 are shown; each has a fixed animation (1 = pulsing dots, 2 = flowing line, 3 = bars).', 'homeThinkCard',
      [f('eyebrow', 'Small label'), f('title', 'Title'), f('text', 'Text', 'localeText')], {select: {title: 'title.en', subtitle: 'eyebrow.en'}}),

    // 3 · Problems
    ls('problemsHeading', 'Heading — first line', 'problems', 'e.g. "One straight line from"'),
    ls('problemsHighlight', 'Heading — blue second line', 'problems', 'e.g. "chaos to aligned."'),
    lt('problemsText', 'Intro paragraph', 'problems'),
    ls('problemsOnLine', 'Line shown when Align is ON (blue)', 'problems'),
    ls('problemsOffLine', 'Line shown when Align is OFF (red)', 'problems'),
    ls('toggleOnLabel', 'Toggle label — ON', 'problems', 'e.g. "Align ON"'),
    ls('toggleOffLabel', 'Toggle label — OFF', 'problems', 'e.g. "Align OFF"'),
    ls('startLabel', 'Journey start label', 'problems', 'e.g. "Your business"'),
    ls('endOnLabel', 'Journey end label — ON', 'problems', 'e.g. "Aligned & flourishing"'),
    ls('endOffLabel', 'Journey end label — OFF', 'problems', 'e.g. "Stuck & frustrated"'),
    list('journey', 'Journey cards', 'problems', 'First 4 are shown, in order along the line. Keep texts short (they sit in small cards).', 'homeJourneyCard',
      [f('title', 'Title'), f('onText', 'Text when Align is ON'), f('offText', 'Text when Align is OFF')], {select: {title: 'title.en', subtitle: 'onText.en'}}),
    lt('problemsFootnote', 'Text under the journey', 'problems'),
    ls('problemsButton', 'Button label', 'problems', 'Links to the contact page.'),

    // 4 · Products
    ls('productsEyebrow', 'Small label', 'products', 'e.g. "One platform"'),
    ls('productsHeading', 'Heading — first line', 'products'),
    ls('productsHighlight', 'Heading — blue second line', 'products'),
    lt('productsText', 'Intro paragraph', 'products'),
    list('productCards', 'Product cards', 'products', 'First 4 are shown; card 1 shows the Finance demo, 2 People, 3 Field, 4 Hospital. Empty label/text fall back to the linked product’s name/tagline.', 'homeProductCard',
      [
        defineField({name: 'product', title: 'Product', type: 'reference', to: [{type: 'product'}]}),
        f('label', 'Small blue label', 'localeString', 'e.g. "Finance & Operations"'),
        f('title', 'Title'),
        f('text', 'Text', 'localeText'),
      ], {select: {title: 'title.en', subtitle: 'label.en'}}),

    // 5 · Services
    ls('servicesEyebrow', 'Small label', 'services', 'e.g. "Why Align Business Systems"'),
    ls('servicesHeading', 'Heading', 'services'),
    lt('servicesText', 'Intro paragraph', 'services'),
    ls('servicesButton', 'Button label', 'services', 'Links to the contact page.'),
    list('servicesStats', 'Facts row', 'services', '"{count}" in a value becomes the number of Industry documents (e.g. "{count} industries").', 'homeStat',
      [f('value', 'Value (bold)'), f('label', 'Label (small)')], {select: {title: 'value.en', subtitle: 'label.en'}}),
    list('servicesSteps', 'Delivery steps (orbit)', 'services', 'First 5 are shown around the orbit, clockwise from the top.', 'homeStep',
      [
        f('hubName', 'Short name (centre circle)', 'localeString', 'e.g. "Discovery"'),
        f('title', 'Title'),
        f('text', 'Text', 'localeText'),
        defineField({name: 'image', title: 'Thumbnail', type: 'image', options: {hotspot: true}}),
      ], {select: {title: 'title.en', subtitle: 'hubName.en', media: 'image'}}),
    ls('customEyebrow', 'Services box — small label', 'services', `e.g. "When off-the-shelf isn't enough"`),
    ls('customHeading', 'Services box — heading first line', 'services'),
    ls('customHighlight', 'Services box — heading blue line', 'services'),
    lt('customText', 'Services box — text', 'services'),
    defineField({name: 'customPoints', title: 'Services box — ticked points', type: 'array', fieldset: 'services', of: [defineArrayMember({type: 'localeString'})]}),
    ls('customButton', 'Services box — button label', 'services', 'Links to the contact page.'),
    ls('serviceModalButton', 'Service pop-up — button label', 'services', 'e.g. "Talk to us →" (links to the contact page).'),

    // 6 · Industries
    ls('industriesEyebrow', 'Small label', 'industries', 'e.g. "Who runs on Align"'),
    ls('industriesHeading', 'Heading — first line', 'industries'),
    ls('industriesHighlight', 'Heading — blue second line', 'industries'),
    ls('industriesLink', 'Link label', 'industries', 'Links to the Industries page.'),

    // 7 · CTA
    ls('ctaHeading', 'Heading', 'cta'),
    lt('ctaText', 'Text', 'cta'),
    ls('ctaButton', 'Button label', 'cta', 'Links to the contact page.'),
  ],
  preview: {
    prepare: () => ({title: 'Home page'}),
  },
})
