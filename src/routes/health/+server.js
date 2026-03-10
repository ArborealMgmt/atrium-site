import { siteConfig } from '$lib/config/site-config.js';
import { getLoggerHealth } from '$lib/logger.server';

// SSR: Health check can be server-side rendered
export const GET = async ({ locals }) => {
  const host = locals.host ?? 'not-set';
  const environment = locals.environment ?? 'unknown';
  const payload = {
    status: 'ok',
    service: 'terrapin-apartments',
    environment,
    host,
    brand: locals.brand ?? 'default',
    time: new Date().toISOString(),
    logger: getLoggerHealth(),
    config: {
      hasAxiomToken: !!siteConfig.axiom.token,
      hasMapboxToken: !!siteConfig.mapboxAccessToken,
      hasCloudinary: !!siteConfig.cloudinaryCloudName,
      hasPlausible: !!siteConfig.plausibleProjectId,
      hasClarity: !!siteConfig.clarityProjectId,
      hasGoogleAds: !!siteConfig.googleAdsId,
      hasMetaPixel: !!siteConfig.metaPixelId,
    },
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  });
};
