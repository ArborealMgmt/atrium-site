import { transformMaynardListings } from '$lib/api/listings-transform.js';
import { siteConfig } from '$lib/config/site-config.js';
import { logger } from '$lib/logger.server.js';
import { transformAffordableHousing } from '$lib/server/affordable-housing-transform.js';

/** Atrium Court property ID for Maynard API (listings & specials). */
const ATRIUM_PROPERTY_ID = 232;

/**
 * Load availability page data: listings and specials from Maynard API for Atrium Court (232).
 * When the API returns no listings, the page shows the empty-state message.
 *
 * Why no listings? The Maynard API (properties/232/listings) returns { "listings": [] } when
 * there are no available units in the backend for this property. Listings are managed in
 * Maynard/AppFolio; once units are added there, they will appear here.
 *
 * @type {import('./$types').PageServerLoad}
 */
export async function load() {
  const baseUrl =
    (typeof process !== 'undefined' && process.env?.MAYNARD_API_BASE_URL) ||
    siteConfig.maynardApiBaseUrl;
  const listingsUrl = `${baseUrl}/api/public/nursery/properties/${ATRIUM_PROPERTY_ID}/listings`;
  const specialsUrl = `${baseUrl}/api/public/nursery/properties/${ATRIUM_PROPERTY_ID}/listings/specials`;
  const propertyUrl = `${baseUrl}/api/public/nursery/properties/${ATRIUM_PROPERTY_ID}`;

  let listings = [];
  let specials = [];
  let affordableHousingRestrictions = [];
  let showAffordableContent = false;

  try {
    const [listingsRes, specialsRes, propertyRes] = await Promise.all([
      fetch(listingsUrl, { headers: { Accept: 'application/json' } }),
      fetch(specialsUrl, { headers: { Accept: 'application/json' } }),
      fetch(propertyUrl, { headers: { Accept: 'application/json' } }),
    ]);

    if (listingsRes.ok) {
      const data = await listingsRes.json();
      const raw = Array.isArray(data?.listings) ? data.listings : [];
      listings = transformMaynardListings(raw);
      if (raw.length === 0) {
        logger.info('[availability] Maynard API returned 0 listings for property 232', {
          detailedMessage: { listingsUrl, status: listingsRes.status },
        });
      }
    } else {
      logger.warn('[availability] Listings API request failed', {
        detailedMessage: { listingsUrl, status: listingsRes.status },
      });
    }

    if (specialsRes.ok) {
      const data = await specialsRes.json();
      const raw = Array.isArray(data?.listings) ? data.listings : [];
      specials = transformMaynardListings(raw);
    }

    if (propertyRes.ok) {
      const payload = await propertyRes.json();
      const rawRestrictions = payload?.affordableHousingRestrictions ?? [];
      showAffordableContent = payload?.showAffordableContent === true || rawRestrictions.length > 0;
      affordableHousingRestrictions = transformAffordableHousing(rawRestrictions, listings);
    }
  } catch (err) {
    logger.warn('[availability] Error loading listings or property', {
      detailedMessage: { error: err?.message ?? String(err) },
    });
  }

  return {
    listings,
    specials,
    affordableHousingRestrictions,
    showAffordableContent,
  };
}
