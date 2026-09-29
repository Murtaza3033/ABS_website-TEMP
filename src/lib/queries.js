import groq from 'groq';

/* GROQ queries for CMS content (full-document projections).
   Singletons are fetched by their canonical _id (see studio/scripts/seed.mjs)
   so a stray second document of the same type can never be picked instead. */

export const SITE_SETTINGS_QUERY = groq`*[_id == "siteSettings"][0]`;

export const NAVIGATION_QUERY = groq`*[_id == "navigation"][0]`;

export const FOOTER_QUERY = groq`*[_id == "footer"][0]`;

// Product cards may link a Product: its name/tagline fill empty card fields.
export const HOME_PAGE_QUERY = groq`*[_id == "homePage"][0]{
  ...,
  productCards[]{..., "product": product->{name, tagline, "slug": slug.current}}
}`;

export const CLIENTS_PAGE_QUERY = groq`*[_id == "clientsPage"][0]{
  ...,
  filters[]{..., "industry": industry->{_id, name, short}}
}`;

export const PARTNERS_PAGE_QUERY = groq`*[_id == "partnersPage"][0]`;

export const ADVISORS_PAGE_QUERY = groq`*[_id == "advisorsPage"][0]`;

// The business count on the Industries page is the Our Clients trust line's.
export const INDUSTRIES_PAGE_QUERY = groq`*[_id == "industriesPage"][0]{
  ...,
  "businessesCount": *[_id == "clientsPage"][0].trustline.businessesCount
}`;

export const TEAM_PAGE_QUERY = groq`*[_id == "teamPage"][0]`;

export const ABOUT_PAGE_QUERY = groq`*[_id == "aboutPage"][0]`;

export const EVENTS_PAGE_QUERY = groq`*[_id == "eventsPage"][0]`;

export const CAREERS_PAGE_QUERY = groq`*[_id == "careersPage"][0]`;

export const CONTACT_PAGE_QUERY = groq`*[_id == "contactPage"][0]`;

export const PAGE_BY_SLUG_QUERY = groq`*[_type == "page" && slug.current == $slug][0]`;

export const ALL_PRODUCTS_QUERY = groq`*[_type == "product"] | order(order asc)`;

// defined(name): skip docs without the required name so a malformed duplicate
// sharing the slug is never chosen.
export const PRODUCT_BY_SLUG_QUERY = groq`*[_type == "product" && slug.current == $slug && defined(name)] | order(order asc)[0]`;

export const ALL_CLIENTS_QUERY = groq`*[_type == "client"] | order(order asc){
  ...,
  "industry": industry->{_id, name, "slug": slug.current}
}`;

export const ALL_SERVICES_QUERY = groq`*[_type == "service" && defined(name)] | order(order asc)`;

export const ALL_TEAM_QUERY = groq`*[_type == "teamMember"] | order(order asc)`;

// members: the picked clients, else every client whose Industry is this one.
export const ALL_INDUSTRIES_QUERY = groq`*[_type == "industry"] | order(order asc){
  ...,
  "members": select(
    count(members) > 0 => members[]->{_id, name, logo},
    *[_type == "client" && industry._ref == ^._id] | order(order asc){_id, name, logo}
  )
}`;

export const ALL_PARTNERS_QUERY = groq`*[_type == "partner" && defined(name)] | order(order asc)`;

export const ALL_ADVISORS_QUERY = groq`*[_type == "advisor" && defined(name)] | order(order asc)`;

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
