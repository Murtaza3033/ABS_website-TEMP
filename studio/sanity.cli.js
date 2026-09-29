import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '5knwlrie',
    dataset: 'production'
  },
  studioHost: 'align-cms',
  deployment: {
    appId: 'rmk5ztvt094s4psqt4w497qu',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
