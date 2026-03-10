/**
 * Helper functions for working with Maynard media data
 */

import { siteConfig } from '$lib/config/site-config.js';

/**
 * Build Cloudinary URL from cloudinaryId
 * @param {string} cloudinaryId - Cloudinary ID (e.g., 'nursery/site-1/hero-main')
 * @param {object} options - Transformation options
 * @param {number} options.width - Image width
 * @param {number} options.height - Image height
 * @param {string} options.crop - Crop mode (fill, fit, etc.)
 * @param {string} options.quality - Image quality (auto, 80, etc.)
 * @returns {string|null} Full Cloudinary URL or null if cloud name is missing
 */
export function buildCloudinaryUrl(cloudinaryId, options = {}) {
  if (!cloudinaryId) return null;

  const cloudName = siteConfig.cloudinaryCloudName;

  // Return null if cloud name is missing instead of using invalid 'demo' fallback
  // This prevents generating invalid URLs that won't load
  if (!cloudName) {
    return null;
  }

  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  // Build transformation string
  const transformations = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.quality) transformations.push(`q_${options.quality}`);

  const transformString = transformations.length > 0 ? transformations.join(',') + '/' : '';

  return `${baseUrl}/${transformString}${cloudinaryId}`;
}

/**
 * Get primary media item from a media array
 * @param {Array} mediaArray - Array of media items
 * @returns {object|null} Primary media item or first item if no primary
 */
export function getPrimaryMedia(mediaArray) {
  if (!mediaArray || !Array.isArray(mediaArray) || mediaArray.length === 0) {
    return null;
  }

  // Find primary item
  const primary = mediaArray.find(item => item.isPrimary);
  if (primary) return primary;

  // Sort by sortOrder and return first
  const sorted = [...mediaArray].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return sorted[0] || null;
}

/**
 * Get media by role
 * @param {object} media - Media object grouped by role
 * @param {string} role - Media role (hero, gallery, amenity, etc.)
 * @returns {Array} Array of media items for the role
 */
export function getMediaByRole(media, role) {
  if (!media || typeof media !== 'object') return [];
  return media[role] || [];
}

/**
 * Get image URL from media item (with transformations)
 * @param {object} mediaItem - Media item from API
 * @param {object} options - Cloudinary transformation options
 * @returns {string|null} Image URL or null
 */
export function getImageUrl(mediaItem, options = {}) {
  if (!mediaItem || !mediaItem.cloudinaryId) return null;

  // Default options for common use cases
  const defaultOptions = {
    quality: 'auto',
    ...options,
  };

  return buildCloudinaryUrl(mediaItem.cloudinaryId, defaultOptions);
}

/**
 * Get hero image by slot/key name
 * First checks if media object has the key directly, then searches through hero role
 * @param {object} media - Media object grouped by role
 * @param {string} slotKey - Slot/key name (e.g., 'apartments_hero_image')
 * @returns {object|null} Hero media item or null
 */
export function getHeroBySlot(media, slotKey) {
  if (!media || typeof media !== 'object' || !slotKey) return null;

  // First, check if media object has the key directly
  if (media[slotKey]) {
    // If it's an array, get the first item
    if (Array.isArray(media[slotKey])) {
      return media[slotKey][0] || null;
    }
    // If it's a single item, return it
    if (media[slotKey].cloudinaryId) {
      return media[slotKey];
    }
  }

  // Search through hero role for items matching the key
  const heroItems = getMediaByRole(media, 'hero');
  if (heroItems.length === 0) return null;

  // Check if any hero item has a matching key or fieldName property
  const matchingItem = heroItems.find(
    item => item.key === slotKey || item.fieldName === slotKey || item.slot === slotKey
  );

  if (matchingItem) return matchingItem;

  // If no match found, return the primary hero or first hero item
  return getPrimaryMedia(heroItems);
}

/**
 * Get media item by key/fieldName
 * Searches through all media roles to find an item with matching key
 * @param {object} media - Media object grouped by role
 * @param {string} key - Key/fieldName to search for (e.g., 'apartments_feature_1_image')
 * @returns {object|null} Media item or null
 */
export function getMediaByKey(media, key) {
  if (!media || typeof media !== 'object' || !key) return null;

  // First, check if media object has the key directly
  if (media[key]) {
    // If it's an array, get the first item
    if (Array.isArray(media[key])) {
      return media[key][0] || null;
    }
    // If it's a single item, return it
    if (media[key].cloudinaryId) {
      return media[key];
    }
  }

  // Search through all roles for items matching the key
  for (const [, items] of Object.entries(media)) {
    if (!Array.isArray(items)) continue;

    // Check if any item has a matching key, fieldName, or slot property
    const matchingItem = items.find(
      item => item.key === key || item.fieldName === key || item.slot === key
    );

    if (matchingItem) return matchingItem;
  }

  return null;
}
