import { useQuery } from '@tanstack/react-query';
import { sanityFetch } from '../lib/sanity';
import {
  SITE_SETTINGS_QUERY,
  NAVIGATION_QUERY,
  FOOTER_QUERY,
  CHATBOT_QUERY,
  HOME_PAGE_QUERY,
  CLIENTS_PAGE_QUERY,
  PARTNERS_PAGE_QUERY,
  ADVISORS_PAGE_QUERY,
  INDUSTRIES_PAGE_QUERY,
  TEAM_PAGE_QUERY,
  ABOUT_PAGE_QUERY,
  EVENTS_PAGE_QUERY,
  CAREERS_PAGE_QUERY,
  CONTACT_PAGE_QUERY,
  ALL_PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  ALL_CLIENTS_QUERY,
  ALL_SERVICES_QUERY,
  ALL_TEAM_QUERY,
  ALL_INDUSTRIES_QUERY,
  ALL_PARTNERS_QUERY,
  ALL_ADVISORS_QUERY,
  ALL_EVENTS_QUERY,
  EVENT_BY_SLUG_QUERY,
  ALL_JOBS_QUERY,
  JOB_BY_SLUG_QUERY,
  ALL_POSTS_QUERY,
  POST_BY_SLUG_QUERY,
} from '../lib/queries';

/* Thin useQuery wrapper shared by every CMS hook below.
   - Returns CMS data once it arrives; never throws on null/empty results.
   - `fallbackData` (the static copy of the content) becomes `placeholderData`. */
function useSanityQuery(queryKey, query, params, { fallbackData, enabled = true, ...rest } = {}) {
  return useQuery({
    queryKey,
    queryFn: () => sanityFetch(query, params),
    placeholderData: fallbackData,
    enabled,
    ...rest,
  });
}

export function useSiteSettings(options) {
  return useSanityQuery(['siteSettings'], SITE_SETTINGS_QUERY, {}, options);
}

export function useNavigation(options) {
  return useSanityQuery(['navigation'], NAVIGATION_QUERY, {}, options);
}

export function useFooterContent(options) {
  return useSanityQuery(['footer'], FOOTER_QUERY, {}, options);
}

export function useChatbot(options) {
  return useSanityQuery(['chatbot'], CHATBOT_QUERY, {}, options);
}

export function useHomePage(options) {
  return useSanityQuery(['homePage'], HOME_PAGE_QUERY, {}, options);
}

export function useClientsPage(options) {
  return useSanityQuery(['clientsPage'], CLIENTS_PAGE_QUERY, {}, options);
}

export function usePartnersPage(options) {
  return useSanityQuery(['partnersPage'], PARTNERS_PAGE_QUERY, {}, options);
}

export function useAdvisorsPage(options) {
  return useSanityQuery(['advisorsPage'], ADVISORS_PAGE_QUERY, {}, options);
}

export function useIndustriesPage(options) {
  return useSanityQuery(['industriesPage'], INDUSTRIES_PAGE_QUERY, {}, options);
}

export function useTeamPage(options) {
  return useSanityQuery(['teamPage'], TEAM_PAGE_QUERY, {}, options);
}

export function useAboutPage(options) {
  return useSanityQuery(['aboutPage'], ABOUT_PAGE_QUERY, {}, options);
}

export function useEventsPage(options) {
  return useSanityQuery(['eventsPage'], EVENTS_PAGE_QUERY, {}, options);
}

export function useCareersPage(options) {
  return useSanityQuery(['careersPage'], CAREERS_PAGE_QUERY, {}, options);
}

export function useContactPage(options) {
  return useSanityQuery(['contactPage'], CONTACT_PAGE_QUERY, {}, options);
}

export function useProducts(options) {
  return useSanityQuery(['products'], ALL_PRODUCTS_QUERY, {}, options);
}

export function useProduct(slug, options) {
  return useSanityQuery(['product', slug], PRODUCT_BY_SLUG_QUERY, { slug }, {
    enabled: Boolean(slug),
    ...options,
  });
}

export function useClients(options) {
  return useSanityQuery(['clients'], ALL_CLIENTS_QUERY, {}, options);
}

export function useServices(options) {
  return useSanityQuery(['services'], ALL_SERVICES_QUERY, {}, options);
}

export function useTeam(options) {
  return useSanityQuery(['team'], ALL_TEAM_QUERY, {}, options);
}

export function useIndustries(options) {
  return useSanityQuery(['industries'], ALL_INDUSTRIES_QUERY, {}, options);
}

export function usePartners(options) {
  return useSanityQuery(['partners'], ALL_PARTNERS_QUERY, {}, options);
}

export function useAdvisors(options) {
  return useSanityQuery(['advisors'], ALL_ADVISORS_QUERY, {}, options);
}

export function useEvents(options) {
  return useSanityQuery(['events'], ALL_EVENTS_QUERY, {}, options);
}

export function useEvent(slug, options) {
  return useSanityQuery(['event', slug], EVENT_BY_SLUG_QUERY, { slug }, {
    enabled: Boolean(slug),
    ...options,
  });
}

export function useJobs(options) {
  return useSanityQuery(['jobs'], ALL_JOBS_QUERY, {}, options);
}

export function useJob(slug, options) {
  return useSanityQuery(['job', slug], JOB_BY_SLUG_QUERY, { slug }, {
    enabled: Boolean(slug),
    ...options,
  });
}

export function usePosts(options) {
  return useSanityQuery(['posts'], ALL_POSTS_QUERY, {}, options);
}

export function usePost(slug, options) {
  return useSanityQuery(['post', slug], POST_BY_SLUG_QUERY, { slug }, {
    enabled: Boolean(slug),
    ...options,
  });
}
