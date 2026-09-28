import {defineField, defineType} from 'sanity'

/* Shared lead-storage document for every capture surface on the site (Phase
   10B) — the Contact form, "Book a Demo" (currently just a pre-selected
   `reason` on the same Contact form, not a separate form), and SalesBot's
   chat-based capture once it's wired up. One type, one `source` field to
   tell them apart, rather than three near-identical schemas. Plain
   string/text fields throughout — this is submitted lead data, not bilingual
   site content, so it intentionally does not use localeString/localeText. */
export default defineType({
  name: 'contactSubmission',
  title: 'Contact Submission',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'company', title: 'Company', type: 'string'}),
    defineField({
      name: 'reason',
      title: 'Reason for contact',
      type: 'string',
      options: {
        list: ['Book a demo', 'Product question', 'Partnership', 'Careers', 'Something else'],
      },
    }),
    defineField({
      name: 'product',
      title: 'Product interest',
      type: 'string',
      options: {
        list: ['Businessflo', 'PeopleNest', 'Field Force', 'HMSflo', 'Not sure yet'],
      },
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {name: 'email'}),
    }),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({name: 'countryIso', title: 'Country (ISO)', type: 'string'}),
    defineField({name: 'message', title: 'Message', type: 'text'}),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {list: ['contact-form', 'book-demo', 'salesbot']},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {list: ['new', 'contacted', 'qualified', 'closed', 'spam']},
      initialValue: 'new',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Submitted at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({name: 'userAgent', title: 'User agent', type: 'string'}),
    defineField({name: 'pageUrl', title: 'Page URL', type: 'url'}),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {name: 'name', email: 'email', status: 'status', source: 'source'},
    prepare({name, email, status, source}) {
      return {
        title: name || email || 'Untitled submission',
        subtitle: `${status || 'new'} · ${source || 'unknown source'}`,
      }
    },
  },
})
