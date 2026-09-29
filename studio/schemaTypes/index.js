import {localeString, localeText, localeBlock} from './objects/locale'
import seo from './objects/seo'

import siteSettings from './documents/siteSettings'
import navigation from './documents/navigation'
import footer from './documents/footer'
import homePage from './documents/homePage'
import clientsPage from './documents/clientsPage'
import teamPage from './documents/teamPage'
import aboutPage from './documents/aboutPage'
import eventsPage from './documents/eventsPage'
import careersPage from './documents/careersPage'
import contactPage from './documents/contactPage'
import page from './documents/page'
import product from './documents/product'
import service from './documents/service'
import teamMember from './documents/teamMember'
import advisor from './documents/advisor'
import client from './documents/client'
import partner from './documents/partner'
import industry from './documents/industry'
import event from './documents/event'
import job from './documents/job'
import post from './documents/post'
import faq from './documents/faq'
import testimonial from './documents/testimonial'
import contactSubmission from './documents/contactSubmission'

export const schemaTypes = [
  // Bilingual field objects
  localeString,
  localeText,
  localeBlock,
  seo,

  // Documents
  siteSettings,
  navigation,
  footer,
  homePage,
  clientsPage,
  teamPage,
  aboutPage,
  eventsPage,
  careersPage,
  contactPage,
  page,
  product,
  service,
  teamMember,
  advisor,
  client,
  partner,
  industry,
  event,
  job,
  post,
  faq,
  testimonial,
  contactSubmission,
]
