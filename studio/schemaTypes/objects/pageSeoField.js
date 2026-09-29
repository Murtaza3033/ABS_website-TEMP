import {defineField} from 'sanity'

/* The "SEO" block every page singleton carries (last field, collapsed).
   The frontend (src/components/SEO.jsx) builds the browser-tab title as
   "<Meta title> | <Site title>", and falls back to the page's built-in title
   and description for anything left empty. */
export const pageSeoField = () =>
  defineField({
    name: 'seo',
    title: 'SEO — search results & link previews',
    description:
      'Browser-tab / Google title and description, plus the image shown when the page is shared. Empty fields use the built-in text; an empty share image uses Site Settings → Default share image.',
    type: 'seo',
    options: {collapsible: true, collapsed: true},
  })
