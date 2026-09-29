import {defineField, defineType, defineArrayMember} from 'sanity'
import {pageSeoField} from '../objects/pageSeoField'

/* Careers page (/careers) — singleton, fixed _id "careersPage" (see
   sanity.config.js). Page texts only; the openings are "Job Opening"
   documents, and the careers email comes from Site Settings → Departments
   (key "careers"). The frontend falls back to the built-in copy for anything
   left empty.

   Icon keys must match ICON_PATHS in src/pages/Careers/careersData.jsx.
   "{email}" in a text is replaced by the careers email. */
const ICONS = [
  {value: 'check', title: 'Check box'},
  {value: 'users', title: 'People'},
  {value: 'globe', title: 'Globe'},
  {value: 'zap', title: 'Lightning'},
  {value: 'mail', title: 'Mail'},
  {value: 'chat', title: 'Chat'},
  {value: 'rocket', title: 'Rocket'},
  {value: 'briefcase', title: 'Briefcase'},
  {value: 'code', title: 'Code'},
  {value: 'clock', title: 'Clock'},
]

const ls = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeString', fieldset, description})
const lt = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeText', fieldset, description})
const cards = (name, title, fieldset, objName, description) =>
  defineField({
    name,
    title,
    description,
    type: 'array',
    fieldset,
    of: [
      defineArrayMember({
        type: 'object',
        name: objName,
        fields: [
          defineField({name: 'title', title: 'Title', type: 'localeString'}),
          defineField({name: 'text', title: 'Text', type: 'localeText'}),
          defineField({name: 'icon', title: 'Icon', type: 'string', options: {list: ICONS}}),
        ],
        preview: {select: {title: 'title.en', subtitle: 'icon'}},
      }),
    ],
  })

export default defineType({
  name: 'careersPage',
  title: 'Careers page',
  type: 'document',
  fieldsets: [
    {name: 'hero', title: '1 · Hero', options: {collapsible: true, collapsed: false}},
    {name: 'culture', title: '2 · Why join Align', options: {collapsible: true, collapsed: true}},
    {name: 'roles', title: '3 · Open roles', description: 'The roles are Job Opening documents (only "Active" ones show).', options: {collapsible: true, collapsed: true}},
    {name: 'steps', title: '4 · How hiring works', options: {collapsible: true, collapsed: true}},
    {name: 'cta', title: '5 · Closing call to action', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    ls('heroEyebrow', 'Eyebrow', 'hero'),
    ls('heroLine1', 'Heading — first line', 'hero', 'e.g. "Build the Systems"'),
    ls('heroLine2', 'Heading — second line', 'hero', 'e.g. "Businesses"'),
    ls('heroHighlight', 'Heading — highlight (handwriting, blue)', 'hero', 'e.g. "Run On"'),
    lt('heroText', 'Intro paragraph', 'hero'),
    ls('heroButton', 'Button label', 'hero', 'Scrolls to the open roles.'),
    ls('heroHiring', '"Hiring now" label', 'hero'),
    ls('heroWorkplace', 'Workplace note', 'hero', 'e.g. "On-site · Karachi"'),
    ls('heroCardArea', 'Office card — small line', 'hero', 'e.g. "DHA Phase 7"'),
    ls('heroCardTitle', 'Office card — title', 'hero', 'e.g. "Karachi Office"'),
    defineField({
      name: 'heroBackground',
      title: 'Background photo (faded)',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'hero',
    }),

    ls('cultureEyebrow', 'Eyebrow', 'culture'),
    ls('cultureHeading', 'Heading', 'culture'),
    cards('cultureCards', 'Cards', 'culture', 'careersCultureCard'),

    ls('rolesEyebrow', 'Eyebrow', 'roles'),
    ls('rolesHeading', 'Heading', 'roles'),
    ls('rolesRequirementsLabel', 'Requirements label', 'roles', `e.g. "What we're looking for"`),
    ls('rolesApply', 'Apply button label', 'roles', `Opens the job's Apply URL, else an email to its Apply email (or the careers email).`),
    ls('rolesFootnote', 'Line under the list', 'roles'),
    ls('emptyTitle', 'No open roles — title', 'roles'),
    lt('emptyText', 'No open roles — text', 'roles'),
    ls('emptyButton', 'No open roles — button label', 'roles', 'Links to the contact page.'),

    ls('stepsEyebrow', 'Eyebrow', 'steps'),
    ls('stepsHeading', 'Heading', 'steps'),
    lt('stepsText', 'Intro paragraph', 'steps'),
    cards('steps', 'Steps', 'steps', 'careersStep', 'Numbered automatically. "{email}" becomes the careers email.'),

    ls('ctaHeading', 'Heading', 'cta'),
    lt('ctaText', 'Text', 'cta', '"{email}" becomes the careers email (highlighted).'),
    ls('ctaButton', 'Button label', 'cta', 'Opens an email to the careers address.'),
    pageSeoField(),
  ],
  preview: {
    prepare: () => ({title: 'Careers page'}),
  },
})
