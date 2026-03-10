import { transformMaynardListings } from '$lib/api/listings-transform.js';
import { getImageUrl } from '$lib/api/media.js';
import compiledThemeData from '$lib/data/compiled-theme.json';
// Import frozen static data
import siteData from '$lib/data/site.json';
import { logger } from '$lib/logger.server';
import { transformAffordableHousing } from '$lib/server/affordable-housing-transform.js';

/**
 * Load page data from frozen static data and transform to component-expected format
 * @param {object} params - Load parameters
 * @param {object} params.locals - SvelteKit locals (contains host, protocol, path)
 * @returns {Promise<object>} Page data in format expected by components
 */
export async function loadMaynardPage({ locals }) {
  const { path, host, protocol } = locals;
  const startTime = Date.now();
  const propertyId = 234; // Hardcoded for Terrapin Apartments

  logger.info(`[loadMaynardPage] start`, {
    detailedMessage: `propertyId: ${propertyId} path: ${path ?? ''}`,
  });

  try {
    // Use frozen static data instead of API calls
    const payload = siteData;
    const compiledTheme = compiledThemeData;

    // Transform static data to component-expected format
    const content = transformContent(payload.copy);
    const media = transformMedia(payload.media);
    const listings = transformMaynardListings(payload.listings || []);
    const specials = []; // No specials in frozen data
    // Pass listings to transform so it can count actual available units
    const affordableHousingRestrictions = transformAffordableHousing(
      payload.affordableHousingRestrictions || [],
      listings
    );

    const totalDuration = Date.now() - startTime;
    logger.info(`[loadMaynardPage] success`, {
      detailedMessage: {
        propertyId,
        siteId: payload.site.id,
        hasContent: !!content,
        hasMedia: !!media,
        hasTheme: !!payload.theme,
        hasCompiledTheme: !!compiledTheme,
        listingsCount: listings.length,
        specialsCount: specials.length,
        totalDuration,
      },
    });

    return {
      content,
      media,
      propertyId,
      host,
      protocol,
      path,
      site: payload.site,
      theme: payload.theme,
      themeOverrides: payload.themeOverrides || {},
      compiledTheme,
      listings,
      specials,
      pointsOfInterest: payload.pointsOfInterest,
      affordableHousingRestrictions,
      showAffordableContent: payload.showAffordableContent ?? null,
    };
  } catch (err) {
    const totalDuration = Date.now() - startTime;
    logger.error(`[loadMaynardPage] failure`, {
      detailedMessage: {
        errorName: err?.name,
        errorDetail: err?.message ?? 'Page load failed',
        totalDuration,
      },
    });

    throw err;
  }
}

/**
 * Transform CMS copy content - just pass through with address combination
 */
function transformContent(copy) {
  if (!copy) return {};

  const transformed = { ...copy };

  // Combine new global address fields into a single contact_address field for convenience
  // New structure uses: global_address_line1, global_address_line2, global_address_city, global_address_state, global_address_postal_code
  const addressParts = [];
  if (copy.global_address_line1) addressParts.push(copy.global_address_line1);
  if (copy.global_address_line2) addressParts.push(copy.global_address_line2);

  const cityStateZip = [
    copy.global_address_city,
    copy.global_address_state,
    copy.global_address_postal_code,
  ]
    .filter(Boolean)
    .join(' ');

  if (cityStateZip) addressParts.push(cityStateZip);

  if (addressParts.length > 0) {
    transformed.contact_address = addressParts.join(', ');
  }

  // Also maintain backwards compatibility with old field names if they exist
  // (for properties that haven't migrated yet)
  if (!transformed.contact_address) {
    const oldAddressLine1 = copy.contact_address_line_1;
    const oldCityStateZip = copy.contact_city_state_zip;
    if (oldAddressLine1 || oldCityStateZip) {
      transformed.contact_address = [oldAddressLine1, oldCityStateZip].filter(Boolean).join(', ');
    }
  }

  return transformed;
}

/**
 * Transform media - add filename URLs to each item
 */
function transformMedia(media) {
  if (!media) return {};

  const transformed = {};

  Object.entries(media).forEach(([role, items]) => {
    if (!Array.isArray(items) || items.length === 0) return;

    transformed[role] = items.map(item => ({
      ...item,
      filename: getImageUrl(item),
    }));
  });

  return transformed;
}
