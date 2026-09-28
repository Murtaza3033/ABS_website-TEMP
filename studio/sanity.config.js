import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

/* Singletons: the frontend reads these by fixed _id (src/lib/queries.js:
   *[_id == "siteSettings"|"navigation"|"footer"|"clientsPage"][0]), so Studio pins each to
   that exact document instead of a list, removes them from every "Create new"
   menu, and hides delete/duplicate/unpublish — a second copy or a deleted one
   would silently disconnect the live site from what editors are editing. */
const SINGLETONS = [
  {type: 'siteSettings', id: 'siteSettings', title: 'Site Settings'},
  {type: 'navigation', id: 'navigation', title: 'Navigation'},
  {type: 'footer', id: 'footer', title: 'Footer'},
  {type: 'clientsPage', id: 'clientsPage', title: 'Our Clients page'},
]
const singletonTypes = new Set(SINGLETONS.map((s) => s.type))
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
            ...S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId())),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // No "new document" templates for singletons anywhere in Studio.
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter((option) => !singletonTypes.has(option.templateId))
        : prev,
    actions: (prev, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? prev.filter(({action}) => action && SINGLETON_ACTIONS.has(action))
        : prev,
  },
})
