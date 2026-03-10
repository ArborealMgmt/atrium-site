# CMS API Integration Notes

This document captures important information about how the current implementation fetches data from the Maynard CMS API, before we rebuild the (marketing) routes.

## Key Files & Functions

### 1. Main Data Loader: `src/lib/server/maynard-page-loader.js`

**Function**: `loadMaynardPage({ locals })`

This is the primary function used by all `+page.server.js` files in the (marketing) routes.

**Parameters**:

- `locals` - SvelteKit locals object (contains `propertyId`, `host`, `protocol`, `path`)

**Returns**:

```javascript
{
  (content, // Copy content from Maynard API (key-value pairs)
    media, // Transformed media grouped by role
    brand, // Brand identifier
    brandConfig, // Brand configuration
    host, // Request host
    protocol, // Request protocol
    path, // Request path
    site, // Site object from API
    theme, // Theme object from API
    themeOverrides, // Theme override CSS variables
    listings, // Transformed listings array
    pointsOfInterest, // Points of interest data
    affordableHousingRestrictions); // Affordable housing restrictions array
}
```

**Key Implementation Details**:

1. Gets property ID from property config
2. Calls `fetchSitePayload(propertyId)` to get full site data
3. Transforms Maynard API response to component-expected format
4. Transforms media to include Cloudinary URLs
5. Transforms listings to component format
6. Combines address fields into a single `contact_address` field

### 2. API Client: `src/lib/api/maynard.js`

**Function**: `fetchSitePayload(propertyId)`

Fetches the complete site payload from Maynard API.

**Endpoint**: `GET /api/public/nursery/properties/:propertyId`

**Base URL**:

- From env: `MAYNARD_API_BASE_URL` or `process.env.MAYNARD_API_BASE_URL`
- Default: `https://maynardapp.azurewebsites.net`

**Response Structure** (from API):

```javascript
{
  site: {
    id: number,
    propertyId: number,
    domain: string | null,
    isPublished: boolean
  },
  copy: Record<string, string>,           // Key-value pairs of published copy
  media: Record<string, MediaItem[]>,     // Media grouped by role
  theme: Theme,
  themeOverrides: Record<string, string>,  // CSS variable overrides
  listings: Listing[],
  pointsOfInterest: PointsOfInterest | null,
  affordableHousingRestrictions: AffordableRestriction[]
}
```

**Error Handling**:

- 404 if site not found
- 500 if site not published
- 503 if connection fails

**Function**: `fetchSiteListings(propertyId)`

Fetches only listings for a property (for lazy loading).

**Endpoint**: `GET /api/public/nursery/properties/:propertyId/listings`

### 3. Media Helpers: `src/lib/api/media.js`

**Functions**:

- `buildCloudinaryUrl(cloudinaryId, options)` - Builds Cloudinary URL with transformations
- `getPrimaryMedia(mediaArray)` - Gets primary media item or first item
- `getMediaByRole(media, role)` - Gets media items for a specific role
- `getImageUrl(mediaItem, options)` - Gets image URL from media item with transformations

**Media Roles**:

- `hero` - Hero images
- `gallery` - Gallery images
- `amenity` - Amenity images
- `floorplan` - Floorplan images
- `logo` - Logo images
- `thumbnail` - Thumbnail images

**Cloudinary Configuration**:

- Cloud name from `PUBLIC_CLOUDINARY_CLOUD_NAME` env var
- Or extracted from `CLOUDINARY_URL` (server-side only)
- Default: 'demo'

**Cloudinary URL Format**:

```
https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{cloudinaryId}
```

**Transformation Options**:

- `width` - Image width
- `height` - Image height
- `crop` - Crop mode (fill, fit, etc.)
- `quality` - Image quality (auto, 80, etc.)

### 4. Listings Transform: `src/lib/api/listings-transform.js`

**Function**: `transformMaynardListings(listings)`

Transforms Maynard API listing format to component-expected format for backward compatibility.

**Maynard Listing Structure**:

```javascript
{
  id: string,                    // UUID
  unitName: string,
  unitType: string,
  bedrooms: number,
  bathrooms: number,
  squareFeet: number | null,
  rent: number,
  deposit: number | null,
  availableOn: string | null,     // ISO date
  description: string | null,
  photos: string[],              // Array of image URLs
  amenities: string[],
  utilitiesIncluded: string[],
  applicationUrl: string | null,
  applicationFee: number | null,
  acceptingApplications: boolean,
  catsAllowed: boolean | null,
  dogPolicy: string | null,
  youtubeUrl: string | null
}
```

## Current Route Implementation Pattern

All routes follow this pattern:

### `+page.server.js`:

```javascript
import { loadMaynardPage } from '$lib/server/maynard-page-loader.js';

export const load = async ({ locals }) => {
  return loadMaynardPage({
    locals,
  });
};
```

### `+page.svelte`:

```javascript
<script>
  let { data } = $props();

  // Helper function to get content by tag name
  function getContent(tagName) {
    if (!data.content) return null;
    return data.content[tagName];
  }
</script>

<!-- Use data.content, data.media, data.listings, etc. -->
```

## Content Key Mapping

All pages get the full payload from the CMS API.

## Copy Content Structure

The `content` object contains key-value pairs from the Maynard API. Components access content using keys like:

- `main_banner_title`, `main_banner_text` - Hero section
- `building_info_title`, `building_info_text` - About section
- `amenities_hook_card_title`, `amenities_hook_card_text` - Amenities section
- `contact_phone`, `contact_email`, `contact_address` - Contact information
- `gallery_hook_card_title`, `gallery_hook_card_text` - Gallery section
- `floorplans_hook_card_title`, `floorplans_hook_card_text` - Floorplans section
- And other content keys as defined in the Maynard CMS

**Note**: The `contact_address` field is automatically generated by combining `contact_address_line_1` and `contact_city_state_zip` from the API.

## Media Role Structure

Media is grouped by role in the `media` object:

- `hero` - Hero images
- `gallery` - Gallery images
- `amenity` - Amenity images
- `floorplan` - Floorplan images
- `logo` - Logo images
- `thumbnail` - Thumbnail images

Each media item includes a `filename` property with the Cloudinary URL.

## Property Configuration

The property ID is determined from property config:

- `getPropertyConfig(propertyId)` returns property configuration
- Uses `propertyConfig.propertyId` to fetch from Maynard API: `/api/public/nursery/properties/:propertyId`

## Data Available in Components

From `loadMaynardPage`, components receive:

1. **`data.content`** - Copy content (key-value pairs from Maynard API)
2. **`data.media`** - Media grouped by role (with Cloudinary URLs in `filename` property)
3. **`data.listings`** - Transformed listings array
4. **`data.site`** - Site metadata
5. **`data.theme`** - Theme configuration
6. **`data.themeOverrides`** - CSS variable overrides
7. **`data.pointsOfInterest`** - Neighborhood POI data
8. **`data.affordableHousingRestrictions`** - Affordable housing data
9. **`data.propertyId`** - Property identifier
10. **`data.propertyConfig`** - Property configuration

## Important Notes for Rebuild

1. **Single API Call**: The entire site payload is fetched in one request - no need for multiple API calls per page
2. **Server-Side Rendering**: All data fetching happens in `+page.server.js` (SSR)
3. **Error Handling**: The loader handles 404, 500, and 503 errors appropriately
4. **Media URLs**: Media items need to be transformed using `getImageUrl()` to get Cloudinary URLs
5. **Listings**: Already transformed to component format, but structure may need updating for new design
6. **Theme**: Theme data is available but may not be fully applied in current implementation
7. **Content Keys**: Components use specific content keys (e.g., `main_banner_title`, `building_info_text`) that should match the keys returned by the Maynard API

## Environment Variables

- `MAYNARD_API_BASE_URL` - Maynard API base URL (defaults to production)
- `PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name (public, safe for client-side)
- `CLOUDINARY_URL` - Full Cloudinary URL (server-side only, can extract cloud name from it)
