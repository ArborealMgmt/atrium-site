/**
 * Configuration helper functions
 */

import { browser, dev } from '$app/environment';

/**
 * Check if we're running in a local browser environment
 * @returns {boolean}
 */
export function isLocalBrowser() {
  if (!browser) return false;
  try {
    return (
      dev || window.location.hostname === 'localhost' || window.location.hostname.includes('.local')
    );
  } catch {
    return false;
  }
}
