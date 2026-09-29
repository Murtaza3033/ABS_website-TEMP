import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

/* Singletons: the frontend reads these by fixed _id (src/lib/queries.js:
   *[_id == "siteSettings"|"navigation"|"footer"|"chatbot"|"homePage"|"clientsPage"|"partnersPage"|"advisorsPage"|"industriesPage"|"teamPage"|"aboutPage"|"eventsPage"|"careersPage"|"contactPage"][0]), so Studio pins each to
   that exact document instead of a list, removes them from every "Create new"
   menu, and hides delete/duplicate/unpublish — a second copy or a deleted one
   would silently disconnect the live site from what editors are editing. */
const SINGLETONS = [
  {type: 'siteSettings', id: 'siteSettings', title: 'Site Settings'},
  {type: 'navigation', id: 'navigation', title: 'Navigation'},
  {type: 'footer', id: 'footer', title: 'Footer'},
  {type: 'chatbot', id: 'chatbot', title: 'Chat assistant'},
  {type: 'homePage', id: 'homePage', title: 'Home page'},
  {type: 'clientsPage', id: 'clientsPage', title: 'Our Clients page'},
  {type: 'partnersPage', id: 'partnersPage', title: 'Our Partners page'},
  {type: 'advisorsPage', id: 'advisorsPage', title: 'Our Advisors page'},
  {type: 'industriesPage', id: 'industriesPage', title: 'Industries page'},
  {type: 'teamPage', id: 'teamPage', title: 'Our Team page'},
  {type: 'aboutPage', id: 'aboutPage', title: 'About Us page'},
  {type: 'eventsPage', id: 'eventsPage', title: 'Events page'},
  {type: 'careersPage', id: 'careersPage', title: 'Careers page'},
  {type: 'contactPage', id: 'contactPage', title: 'Contact Us page'},
]
const singletonTypes = new Set(SINGLETONS.map((s) => s.type))

/* Retired types: still in the schema so their existing documents stay valid
   and readable (Vision, API), but hidden from the desk and every "Create new"
   menu because the site no longer reads them. "page" (Page) was the first
   per-page model; its SEO now lives in each page singleton's "SEO" block. */
const retiredTypes = new Set(['page'])
const hiddenFromMenus = new Set([...singletonTypes, ...retiredTypes])
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Align CMS',

  projectId: '5knwlrie',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            ...SINGLETONS.map((s) =>
              S.listItem()
                .title(s.title)
                .id(s.id)
                .schemaType(s.type)
                .child(S.document().schemaType(s.type).documentId(s.id).title(s.title)),
            ),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => !hiddenFromMenus.has(item.getId())),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // No "new document" templates for singletons or retired types anywhere in Studio.
    templates: (templates) => templates.filter(({schemaType}) => !hiddenFromMenus.has(schemaType)),
  },

  document: {
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter((option) => !hiddenFromMenus.has(option.templateId))
        : prev,
    actions: (prev, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? prev.filter(({action}) => action && SINGLETON_ACTIONS.has(action))
        : prev,
  },
})
