/**
 * Transform Maynard API listings format to component-expected format
 * Maps Maynard listing structure to the existing component structure for backward compatibility
 */

/**
 * Parse amenities from various formats (array, JSON string, or plain string)
 * @param {any} amenities - Amenities in various formats
 * @returns {Array|null} Parsed amenities array or null
 */
function parseAmenities(amenities) {
  if (!amenities) return null;

  // If it's already an array, return it
  if (Array.isArray(amenities)) {
    return amenities;
  }

  // If it's a string that looks like JSON, try to parse it
  if (typeof amenities === 'string') {
    // Check if it looks like a JSON array
    if (amenities.trim().startsWith('[') && amenities.trim().endsWith(']')) {
      try {
        const parsed = JSON.parse(amenities);
        return Array.isArray(parsed) ? parsed : null;
      } catch {
        // If parsing fails, treat as a single string
        return [amenities];
      }
    }
    // If it's a regular string, treat as a single amenity
    return [amenities];
  }

  return null;
}

/**
 * Parse photos from various formats (array, JSON string)
 * @param {any} photos - Photos in various formats
 * @returns {Array|null} Array of photo URLs or null
 */
function parsePhotos(photos) {
  if (!photos) return null;

  // If it's already an array, extract URLs
  if (Array.isArray(photos)) {
    return photos
      .map(photo => {
        if (typeof photo === 'string') return photo;
        return photo.url || photo.thumbnailUrl || photo;
      })
      .filter(Boolean);
  }

  // If it's a string that looks like JSON, try to parse it
  if (typeof photos === 'string') {
    // Check if it looks like a JSON array
    if (photos.trim().startsWith('[') && photos.trim().endsWith(']')) {
      try {
        const parsed = JSON.parse(photos);
        if (Array.isArray(parsed)) {
          return parsed
            .map(photo => {
              if (typeof photo === 'string') return photo;
              return photo.url || photo.thumbnailUrl || photo;
            })
            .filter(Boolean);
        }
      } catch {
        // If parsing fails, return null
        return null;
      }
    }
    // If it's a regular string (single URL), return as array
    return [photos];
  }

  return null;
}

/**
 * Transform a single Maynard listing to component format
 * @param {object} listing - Listing from Maynard API
 * @returns {object} Transformed listing in component format
 */
export function transformMaynardListing(listing) {
  return {
    // IDs
    id: listing.id,
    unitId: listing.id, // For backward compatibility
    unitName: listing.unitName,

    // Pricing
    rent: listing.rent,
    primaryRent: listing.rent,
    advertisedRent: listing.rent,
    listingAdvertisedRent: listing.rent,
    listingDeposit: listing.deposit,
    deposit: listing.deposit,
    applicationFee: listing.applicationFee || null,

    // Property details
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    squareFeet: listing.squareFeet,
    primaryBedrooms: listing.bedrooms,
    primaryBathrooms: listing.bathrooms,
    primarySquareFeet: listing.squareFeet,
    sqft: listing.squareFeet,
    bedAndBath: `${listing.bedrooms} bed / ${listing.bathrooms} bath`,
    unitType: listing.unitType || 'apartment',

    // Description and Marketing
    primaryDescription: listing.description,
    description: listing.description,
    marketingTitle: listing.marketingTitle || null,

    // Address (extract from property or use defaults)
    address1: null, // Maynard listings don't include address
    address2: listing.unitName || null,
    city: null,
    state: null,
    zip: null,

    // Photos - handle both array and JSON string formats
    photos: parsePhotos(listing.photos),
    listingPhotos: parsePhotos(listing.photos),
    unitPhotos: parsePhotos(listing.photos),

    // Amenities - handle both array and JSON string formats
    primaryAmenities: parseAmenities(listing.amenities),
    amenities: parseAmenities(listing.amenities),
    listingAmenities: parseAmenities(listing.amenities),
    unitAmenities: parseAmenities(listing.amenities),

    // Utilities
    utilitiesIncluded:
      Array.isArray(listing.utilitiesIncluded) && listing.utilitiesIncluded.length > 0
        ? true
        : false,
    utilitiesIncludedList: listing.utilitiesIncluded || [],

    // Availability
    availableOn: listing.availableOn || null,

    // Pets
    catsAllowed: listing.catsAllowed ?? null,
    dogsAllowed: listing.dogPolicy ? true : null, // Convert dogPolicy string to boolean
    dogPolicy: listing.dogPolicy || null,

    // Application
    applicationUrl: listing.applicationUrl || null, // Preserve camelCase from API
    applicationURL: listing.applicationUrl || null, // Backward compatibility
    acceptingApplications:
      listing.acceptingApplications !== undefined ? listing.acceptingApplications : true,

    // Video
    youtubeUrl: listing.youtubeUrl || null,

    // Affordable Housing
    affordableHousingProgramName: listing.affordableHousingProgramName || null,
    incomeLimits: listing.incomeLimits || null,
    amiPercent: listing.amiPercent || null,
  };
}

/**
 * Transform array of Maynard listings to component format
 * @param {Array} listings - Array of listings from Maynard API
 * @returns {Array} Transformed listings in component format
 */
export function transformMaynardListings(listings) {
  if (!Array.isArray(listings)) return [];
  return listings.map(transformMaynardListing);
}
