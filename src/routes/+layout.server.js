// SSR: Brand resolution happens at runtime based on host header
export const load = async ({ locals }) => {
  const brand = locals.brand;
  const host = locals.host ?? '';
  const protocol = locals.protocol ?? '';
  const path = locals.path ?? '';

  // For now, return brand + request context so all pages (e.g. contact-us) have host/protocol/path for SEO
  return {
    brand,
    host,
    protocol,
    path,
  };
};
