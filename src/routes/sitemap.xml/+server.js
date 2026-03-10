import { ROUTES } from '$lib/config/routes.js';
import { escapeXml } from '$lib/xml-escape.js';

// SSR: Sitemap is brand-specific based on host header
export const GET = async ({ locals }) => {
  const { host, protocol } = locals;
  const baseUrl = `${protocol}://${host}`;
  const routes = [ROUTES.HOME, '/gallery', ROUTES.LISTINGS, ROUTES.NEIGHBORHOOD];

  try {
    const urls = routes
      .map(path => {
        const loc = escapeXml(`${baseUrl}${path}`);
        return `<url><loc>${loc}</loc></url>`;
      })
      .join('');

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
      { headers: { 'Content-Type': 'application/xml' } }
    );
  } catch {
    const fallbackUrl = escapeXml(`${baseUrl}`);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${fallbackUrl}</loc></url></urlset>`,
      { headers: { 'Content-Type': 'application/xml' } }
    );
  }
};
