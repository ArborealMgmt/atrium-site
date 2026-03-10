/**
 * Helper functions for working with Mapbox
 */

import { siteConfig } from '$lib/config/site-config.js';

/**
 * Get Mapbox access token from site config
 * @returns {string|null} Mapbox access token or null if not configured
 */
export function getMapboxAccessToken() {
  return siteConfig.mapboxAccessToken;
}
