import { Link, useLocation } from 'react-router-dom';

// Map the static site's ".html" hrefs to React Router routes.
const ROUTES = {
  '/index.html': '/',
  '/contact-us.html': '/contact-us',
  '/about-us.html': '/about-us',
  '/our-team.html': '/our-team',
  '/our-advisors.html': '/our-advisors',
  '/our-partners.html': '/our-partners',
  '/our-clients.html': '/our-clients',
  '/industries.html': '/industries',
  '/events.html': '/events',
  '/careers.html': '/careers',
};

// A bare internal path with no ".html" suffix — e.g. "/products",
// "/products/businessflo" — is routed via <Link> too. Anything whose last
// path segment contains a dot (e.g. "/favicon.ico") is left as a plain <a>
// so real static files still load normally; external URLs, mailto:, tel:
// and "#" links never start with "/" so they're unaffected either way.
function isBareInternalPath(href) {
  if (!href.startsWith('/')) return false;
  const lastSegment = href.split('/').pop().split(/[?#]/)[0];
  return !lastSegment.includes('.');
}

// Renders a router <Link> for internal pages, a plain <a> for external / mailto / tel / #.
// Reproduces the static nav's active-link highlight (data-navlink links only).
export default function SmartLink({ href, children, style, ...rest }) {
  const location = useLocation();
  let to = href != null ? ROUTES[href] : undefined;
  if (to === undefined && href && isBareInternalPath(href)) {
    to = href;
  }

  if (to !== undefined) {
    const isNav = rest['data-navlink'] !== undefined;
    let finalStyle = style;
    if (isNav && to === location.pathname) {
      finalStyle = { ...(style || {}), color: '#1a56db', background: '#eef4ff', fontWeight: 700 };
    }
    return (
      <Link to={to} style={finalStyle} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} style={style} {...rest}>
      {children}
    </a>
  );
}
