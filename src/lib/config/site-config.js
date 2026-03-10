/**
 * Hardcoded site configuration for Terrapin Apartments
 *
 * This eliminates the need for environment variables in Cloudflare Pages.
 * All values here are public (they end up in client-side code anyway).
 */

export const siteConfig = {
  // Property ID (hardcoded for this single-property site)
  propertyId: 234,

  // Backend API
  maynardApiBaseUrl: 'https://maynardapp.azurewebsites.net',

  // Analytics & Tracking (set to null to disable)
  plausibleProjectId: null, // e.g., 'pa-4umnMul0fjPnL8xuogSsV'
  clarityProjectId: null, // e.g., 'udt8692dne'
  googleAdsId: null, // e.g., 'AW-123456789'
  metaPixelId: null, // e.g., '123456789012345'

  // Maps & Media (set to null to disable; Mapbox can use PUBLIC_MAPBOX_ACCESS_TOKEN env)
  get mapboxAccessToken() {
    return typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_MAPBOX_ACCESS_TOKEN != null
      ? import.meta.env.PUBLIC_MAPBOX_ACCESS_TOKEN
      : null;
  },
  cloudinaryCloudName: 'dtpnyxy15', // e.g., 'your-cloud-name'

  // Axiom Logging (set to null to disable - falls back to console)
  axiom: {
    dataset: null,
    token: null,
    publicDataset: null,
    publicToken: null,
  },
};

export default siteConfig;
