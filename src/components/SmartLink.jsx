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

// Renders a router <Link> for internal pages, a plain <a> for external / mailto / tel / #.
// Reproduces the static nav's active-link highlight (data-navlink links only).
export default function SmartLink({ href, children, style, ...rest }) {
  const location = useLocation();
  const to = href != null ? ROUTES[href] : undefined;

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
