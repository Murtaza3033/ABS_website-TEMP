import groq from 'groq';

/* GROQ queries for CMS content. Kept as full-document projections (`...`) for
   now since nothing consumes these yet — Phase 4 can tighten projections once
   real pages are wired up. */

export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]`;

export const NAVIGATION_QUERY = groq`*[_type == "navigation"][0]`;

export const FOOTER_QUERY = groq`*[_type == "footer"][0]`;

export const PAGE_BY_SLUG_QUERY = groq`*[_type == "page" && slug.current == $slug][0]`;

export const ALL_PRODUCTS_QUERY = groq`*[_type == "product"] | order(order asc)`;

export const PRODUCT_BY_SLUG_QUERY = groq`*[_type == "product" && slug.current == $slug][0]`;

export const ALL_CLIENTS_QUERY = groq`*[_type == "client"] | order(order asc){
  ...,
  "industry": industry->{_id, name, "slug": slug.current}
}`;

export const ALL_TEAM_QUERY = groq`*[_type == "teamMember"] | order(order asc)`;

export const ALL_INDUSTRIES_QUERY = groq`*[_type == "industry"] | order(order asc)`;

export const ALL_EVENTS_QUERY = groq`*[_type == "event"] | order(coalesce(startDate, _createdAt) desc)`;

export const EVENT_BY_SLUG_QUERY = groq`*[_type == "event" && slug.current == $slug][0]`;

export const ALL_JOBS_QUERY = groq`*[_type == "job" && isActive == true] | order(order asc)`;

export const JOB_BY_SLUG_QUERY = groq`*[_type == "job" && slug.current == $slug][0]`;

export const ALL_POSTS_QUERY = groq`*[_type == "post"] | order(publishedAt desc){
  ...,
  "author": author->{_id, "name": name.en, "role": role.en}
}`;

export const POST_BY_SLUG_QUERY = groq`*[_type == "post" && slug.current == $slug][0]{
  ...,
  "author": author->{_id, "name": name.en, "role": role.en, photo}
}`;
