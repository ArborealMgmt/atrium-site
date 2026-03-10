# Nursery Sites API and Preview Mode Guide

## Getting the List of Property Sites

### Endpoint
```
GET /api/nursery/dashboard
```

### Query Parameters
- `includePropertiesWithoutSites` (boolean): Include properties that don't have sites yet (default: `false`)
- `limit` (number): Pagination limit (default: 100)
- `offset` (number): Pagination offset (default: 0)
- `propertyName` (string): Filter by property name (search)
- `managementPortfolioId` (number): Filter by management portfolio ID
- `ownerGroupId` (number): Filter by owner group ID

### Response Structure
```json
{
  "properties": [
    {
      "propertyId": 123,              // Maynard property ID
      "propertyName": "Property Name",
      "managementCompany": "arboreal",
      "managementPortfolio": {
        "id": 1,
        "name": "Portfolio Name"
      },
      "ownerGroup": {
        "id": 2,
        "name": "Owner Group Name"
      },
      "site": {
        "id": 1,
        "domain": "www.property.com",  // Custom domain (may be null)
        "isPublished": true,            // Published status
        "theme": {
          "id": 1,
          "name": "Theme Name"
        }
      },
      "copyCount": 5,
      "mediaCount": 10
    }
  ],
  "total": 50,
  "limit": 100,
  "offset": 0
}
```

### Example Usage
```javascript
// Get all properties with sites
const response = await fetch('/api/nursery/dashboard?includePropertiesWithoutSites=false');
const data = await response.json();

// Access site information
data.properties.forEach(property => {
  console.log(`Property: ${property.propertyName}`);
  console.log(`Domain: ${property.site?.domain || 'No domain'}`);
  console.log(`Published: ${property.site?.isPublished}`);
  console.log(`Maynard Property ID: ${property.propertyId}`);
});
```

## Accessing Sites in Preview Mode

Preview mode allows you to access **unpublished sites** and view **draft content** when developing locally against a production backend.

### Endpoints That Support Preview Mode

All public nursery endpoints support the `?preview=true` query parameter:

1. **Full Site Payload (SSR)**
   ```
   GET /api/public/nursery/properties/:propertyId?preview=true
   ```

2. **Listings Only**
   ```
   GET /api/public/nursery/properties/:propertyId/listings?preview=true
   ```

3. **Special Listings (Campaigns)**
   ```
   GET /api/public/nursery/properties/:propertyId/listings/specials?preview=true
   ```

### Preview Mode Behavior

When `?preview=true` is included:

1. **Unpublished Sites**: You can access sites even if `isPublished: false`
2. **Draft Content**: Copy values include draft versions (prefers draft over published when both exist)
3. **Works in All Environments**: Preview mode works regardless of backend environment (development, staging, production)

### Example Usage

```javascript
// Access unpublished site with draft content
const propertyId = 123;
const response = await fetch(
  `/api/public/nursery/properties/${propertyId}?preview=true`
);
const siteData = await response.json();

// siteData includes:
// - Unpublished site data
// - Draft copy values (if available)
// - All other site content (media, theme, listings, etc.)
```

### Use Case: Local Frontend Development

When developing the frontend locally but connecting to a production backend:

```javascript
// In your local frontend config
const API_BASE_URL = 'https://maynard-api.arboreal.com/api';

// Access WIP site that isn't published yet
const getSiteData = async (propertyId) => {
  const response = await fetch(
    `${API_BASE_URL}/public/nursery/properties/${propertyId}?preview=true`
  );
  return response.json();
};

// This allows you to:
// 1. Test unpublished sites locally
// 2. See draft content changes before publishing
// 3. Develop against production data without affecting live sites
```

## Complete Example: Setup Script

Here's a complete example for a setup script that fetches all sites and generates config:

```javascript
// scripts/setup-nursery-sites.js

async function fetchAllSites() {
  const sites = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `/api/nursery/dashboard?limit=${limit}&offset=${offset}&includePropertiesWithoutSites=false`
    );
    const data = await response.json();

    // Filter to only properties with sites
    const propertiesWithSites = data.properties.filter(p => p.site !== null);
    sites.push(...propertiesWithSites);

    hasMore = data.properties.length === limit;
    offset += limit;
  }

  return sites;
}

async function generateSiteConfig() {
  const sites = await fetchAllSites();

  const config = sites.map(property => ({
    maynardPropertyId: property.propertyId,
    propertyName: property.propertyName,
    domain: property.site.domain,
    isPublished: property.site.isPublished,
    themeId: property.site.theme?.id,
    themeName: property.site.theme?.name
  }));

  console.log(JSON.stringify(config, null, 2));
  return config;
}

// Usage
generateSiteConfig();
```

## Notes

- **Preview mode is public**: Anyone can use `?preview=true` to access unpublished sites. This is intentional for local development workflows.
- **Draft content priority**: In preview mode, if both draft and published copy values exist for the same field, the draft version is returned.
- **Production safety**: Preview mode doesn't affect published sites - it only allows access to unpublished ones. Published sites work normally without the parameter.
