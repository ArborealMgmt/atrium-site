# Nursery Frontend API Guide

This guide documents the API endpoints available for building property microsites.

## Primary Endpoint: Get Published Site Payload

**Domain:**: `https://maynardapp.azurewebsites.net`

**Endpoint:** `GET /api/public/nursery/properties/:propertyId`

So you need to call https://maynardapp.azurewebsites.net/api/public/nursery/properties/:propertyId

This is your main endpoint. It returns everything needed to render a complete property microsite in a single request.

### Request

| Parameter    | Type   | Location | Description                      |
| ------------ | ------ | -------- | -------------------------------- |
| `propertyId` | number | Path     | Property ID from CMS (e.g., 123) |

### Response Structure

```typescript
interface SitePayload {
  site: Site;
  copy: Record<string, string>; // Key-value pairs of published copy
  media: Record<string, MediaItem[]>; // Media grouped by role
  theme: Theme;
  themeOverrides: Record<string, string>; // CSS variable overrides
  listings: Listing[];
  pointsOfInterest: PointsOfInterest | null;
  affordableHousingRestrictions: AffordableRestriction[];
}
```

### Full Response Example

```json
{
  "site": {
    "id": 1,
    "propertyId": 123,
    "domain": "www.oakwood-apts.com",
    "isPublished": true
  },

  "copy": {
    "home_hero_heading": "Welcome to Oakwood Apartments",
    "home_hero_subheading": "Modern Living in the Heart of the City",
    "home_intro_heading": "Experience luxury living with stunning city views...",
    "amenities_intro_heading": "Discover our world-class amenities",
    "contact_phone_number": "(555) 123-4567",
    "contact_email_address": "leasing@oakwood.com",
    "contact_street_address": "123 Main Street, San Francisco, CA 94102",
    "neighborhood_description": "Located in the vibrant downtown district...",
    "gallery_heading": "Take a Tour",
    "floorplans_heading": "Find your perfect layout",
    "cta_primary_label": "Schedule a Tour",
    "cta_secondary_label": "Apply Now",
    "meta_property_name": "Oakwood Apartments | Downtown SF Living",
    "meta_description_property": "Modern apartments in downtown San Francisco..."
  },

  "media": {
    "hero": [
      {
        "id": 1,
        "cloudinaryId": "nursery/site-1/hero-main",
        "altText": "Oakwood Apartments exterior at sunset",
        "caption": "Our beautiful community",
        "sortOrder": 0,
        "isPrimary": true,
        "slot": null
      }
    ],
    "gallery": [
      {
        "id": 2,
        "cloudinaryId": "nursery/site-1/gallery-living-room",
        "altText": "Spacious living room with floor-to-ceiling windows",
        "caption": "Open concept living spaces",
        "sortOrder": 0,
        "isPrimary": false,
        "slot": null
      },
      {
        "id": 3,
        "cloudinaryId": "nursery/site-1/gallery-kitchen",
        "altText": "Modern kitchen with stainless steel appliances",
        "caption": "Chef-inspired kitchens",
        "sortOrder": 1,
        "isPrimary": false,
        "slot": null
      }
    ],
    "logo": [
      {
        "id": 10,
        "cloudinaryId": "nursery/site-1/logo",
        "altText": "Oakwood Apartments logo",
        "caption": null,
        "sortOrder": 0,
        "isPrimary": true,
        "slot": null
      }
    ],
    "amenity": [],
    "floorplan": [],
    "thumbnail": []
  },

  "theme": {
    "id": 1,
    "name": "Modern Light",
    "description": "Clean, modern theme with light colors",
    "baseTheme": "default",
    "primaryColor": "#3B82F6",
    "accentColor": "#10B981",
    "backgroundColor": "#FFFFFF",
    "textColor": "#1F2937",
    "fontFamily": "Inter, sans-serif",
    "tokensJson": {
      "--border-radius": "8px",
      "--shadow-sm": "0 1px 2px rgba(0,0,0,0.05)",
      "--shadow-md": "0 4px 6px rgba(0,0,0,0.1)",
      "--spacing-unit": "4px"
    }
  },

  "themeOverrides": {
    "--primary-color": "#6366F1",
    "--border-radius": "12px"
  },

  "listings": [
    {
      "id": "uuid-1234",
      "unitName": "Unit 304",
      "unitType": "apartment",
      "bedrooms": 2,
      "bathrooms": 2,
      "squareFeet": 950,
      "rent": 2100,
      "deposit": 2100,
      "availableOn": "2024-02-01",
      "description": "Spacious 2BR with stunning views of the city skyline",
      "photos": [
        "https://res.cloudinary.com/.../unit304-1.jpg",
        "https://res.cloudinary.com/.../unit304-2.jpg"
      ],
      "amenities": ["In-Unit Washer/Dryer", "Balcony", "Walk-in Closet"],
      "utilitiesIncluded": ["Water", "Trash"],
      "applicationUrl": "https://apply.example.com/unit-304",
      "applicationFee": 50,
      "acceptingApplications": true,
      "catsAllowed": true,
      "dogPolicy": "Dogs allowed with $500 deposit",
      "youtubeUrl": null
    }
  ],

  "pointsOfInterest": {
    "propertyCoordinates": {
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    "propertyAddress": "123 Main Street, San Francisco, CA 94102",
    "categories": [
      {
        "category": "transit",
        "pois": [
          { "name": "Montgomery BART Station", "distance": 0.3, "distanceUnit": "miles" },
          { "name": "Muni Stop - Market St", "distance": 0.1, "distanceUnit": "miles" }
        ]
      },
      {
        "category": "grocery",
        "pois": [{ "name": "Whole Foods Market", "distance": 0.5, "distanceUnit": "miles" }]
      },
      {
        "category": "dining",
        "pois": [{ "name": "The Italian Place", "distance": 0.2, "distanceUnit": "miles" }]
      }
    ]
  },

  "affordableHousingRestrictions": [
    {
      "restrictionName": "LIHTC 60% AMI",
      "restrictionType": "income_restricted",
      "regulator": "HUD",
      "amiPercent": 60,
      "bedrooms": null,
      "hasIncomeLimits": true,
      "hasRentLimits": true,
      "totalRestrictedUnits": 50,
      "unitCount": 25,
      "currentMaxRent": 1500.0,
      "rentType": "gross",
      "incomeLimits": {
        "year": 2024,
        "source": "HUD",
        "limits": [
          { "householdSize": 1, "limit": 45000 },
          { "householdSize": 2, "limit": 51450 },
          { "householdSize": 3, "limit": 57900 },
          { "householdSize": 4, "limit": 64300 }
        ]
      }
    }
  ]
}
```

### Error Responses

| Status | Response                                     | Condition                            |
| ------ | -------------------------------------------- | ------------------------------------ |
| 500    | `{ "error": "Property ID is required" }`     | Missing propertyId parameter         |
| 500    | `{ "error": "Site 'xyz' not found" }`        | Site does not exist                  |
| 500    | `{ "error": "Site 'xyz' is not published" }` | Site exists but `isPublished: false` |

---

## Secondary Endpoint: Get Listings Only

**Endpoint:** `GET /api/public/nursery/properties/:propertyId/listings`

Use this for lazy loading or refreshing listing data without reloading the entire site.

### Response

```json
{
  "listings": [
    {
      "id": "uuid-1234",
      "unitName": "Unit 304",
      "unitType": "apartment",
      "bedrooms": 2,
      "bathrooms": 2,
      "squareFeet": 950,
      "rent": 2100,
      "deposit": 2100,
      "availableOn": "2024-02-01",
      "description": "Spacious 2BR with stunning views",
      "photos": [],
      "amenities": ["In-Unit Washer/Dryer"],
      "utilitiesIncluded": ["Water"],
      "applicationUrl": "https://apply.example.com",
      "applicationFee": 50,
      "acceptingApplications": true,
      "catsAllowed": true,
      "dogPolicy": "Dogs allowed",
      "youtubeUrl": null
    }
  ]
}
```

---

## Data Types Reference

### Site

```typescript
interface Site {
  id: number;
  propertyId: number;
  domain: string | null; // Custom domain if configured
  isPublished: boolean;
}
```

### Copy

Copy is returned as a flat key-value object. Keys correspond to field definitions (see seeder files for complete list).

```typescript
type Copy = Record<string, string>;

// Example keys:
// - home_hero_heading, home_hero_subheading
// - home_intro_heading
// - amenities_intro_heading
// - contact_phone_number, contact_email_address, contact_street_address
// - neighborhood_description
// - gallery_heading
// - floorplans_heading
// - cta_primary_label, cta_secondary_label
// - meta_property_name, meta_description_property
```

**Note:** Only published copy values are returned. If a key is missing, no published content exists for that field.

### Media

Media is grouped by role. Each role contains an array of media items.

```typescript
type MediaByRole = Record<MediaRole, MediaItem[]>;

type MediaRole = 'hero' | 'gallery' | 'amenity' | 'floorplan' | 'logo' | 'thumbnail';

interface MediaItem {
  id: number;
  cloudinaryId: string; // Use with Cloudinary SDK to build URLs
  altText: string | null;
  caption: string | null;
  sortOrder: number; // For ordering within role
  isPrimary: boolean; // Primary item for the role
  slot: string | null; // Optional slot identifier
}
```

**Building Cloudinary URLs:**

```javascript
// Base URL pattern
const baseUrl = 'https://res.cloudinary.com/{cloud_name}/image/upload';

// With transformations
const imageUrl = `${baseUrl}/w_800,h_600,c_fill/${cloudinaryId}`;
```

### Theme

```typescript
interface Theme {
  id: number;
  name: string;
  description: string | null;
  baseTheme: string; // 'default', 'minimal', 'luxe', 'modern'
  primaryColor: string; // Hex color
  accentColor: string; // Hex color
  backgroundColor: string; // Hex color
  textColor: string; // Hex color
  fontFamily: string; // CSS font-family value
  tokensJson: Record<string, string>; // Additional CSS variables
}
```

**Theme Overrides:** Site-specific overrides to apply on top of the base theme. Keys are CSS variable names.

```typescript
type ThemeOverrides = Record<string, string>;

// Example
{
  "--primary-color": "#6366F1",
  "--border-radius": "12px"
}
```

**Applying Theme to CSS:**

```javascript
// Merge base theme + tokensJson + overrides
const cssVariables = {
  '--primary-color': theme.primaryColor,
  '--accent-color': theme.accentColor,
  '--background-color': theme.backgroundColor,
  '--text-color': theme.textColor,
  '--font-family': theme.fontFamily,
  ...theme.tokensJson,
  ...themeOverrides,
};

// Apply to :root or container element
Object.entries(cssVariables).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value);
});
```

### Listing

```typescript
interface Listing {
  id: string; // UUID
  unitName: string; // "Unit 304", "Apt 2B"
  unitType: string; // "apartment", "townhouse", etc.
  bedrooms: number;
  bathrooms: number;
  squareFeet: number | null;
  rent: number; // Monthly rent in dollars
  deposit: number | null;
  availableOn: string | null; // ISO date string "2024-02-01"
  description: string | null;
  photos: string[]; // Array of image URLs
  amenities: string[]; // Unit-specific amenities
  utilitiesIncluded: string[];
  applicationUrl: string | null;
  applicationFee: number | null;
  acceptingApplications: boolean;
  catsAllowed: boolean | null;
  dogPolicy: string | null;
  youtubeUrl: string | null; // Video tour URL
}
```

### Points of Interest

```typescript
interface PointsOfInterest {
  propertyCoordinates: {
    latitude: number;
    longitude: number;
  } | null;
  propertyAddress: string | null;
  categories: POICategory[];
}

interface POICategory {
  category: string; // 'transit', 'grocery', 'dining', 'parks', 'schools', etc.
  pois: POI[];
}

interface POI {
  name: string;
  distance: number;
  distanceUnit: string; // 'miles', 'km'
}
```

### Affordable Housing Restrictions

```typescript
interface AffordableRestriction {
  restrictionName: string;
  restrictionType: string; // 'income_restricted', 'age_restricted', etc.
  regulator: string | null; // 'HUD', 'CHFA', etc.
  amiPercent: number | null; // 30, 50, 60, 80, etc.
  bedrooms: number | null; // If restriction is bedroom-specific
  hasIncomeLimits: boolean;
  hasRentLimits: boolean;
  totalRestrictedUnits: number | null;
  unitCount: number | null;
  currentMaxRent: number | null;
  rentType: string | null; // 'gross', 'net'
  incomeLimits: IncomeLimits | null;
}

interface IncomeLimits {
  year: number;
  source: string;
  limits: IncomeLimit[];
}

interface IncomeLimit {
  householdSize: number;
  limit: number; // Annual income limit in dollars
}
```

---

## Handling Missing Data

The API always returns the full response structure, but fields may be empty or null:

| Field                           | When Empty                                |
| ------------------------------- | ----------------------------------------- |
| `copy`                          | `{}` - No published copy values           |
| `media.{role}`                  | `[]` - No media for that role             |
| `listings`                      | `[]` - No available listings              |
| `pointsOfInterest`              | `null` - No POI data configured           |
| `affordableHousingRestrictions` | `[]` - Not an affordable property         |
| `themeOverrides`                | `{}` - Using base theme without overrides |

---

## Chat Endpoint (Future)

**Endpoint:** `POST /api/public/nursery/chat`

For property chatbot functionality. Currently returns echo responses.

```typescript
// Request
interface ChatRequest {
  conversationId: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  propertyMaynardId: string;
  unitId?: string;
  pageContext?: {
    url: string;
    utmSource?: string;
  };
}

// Response
interface ChatResponse {
  messages: Array<{ role: 'assistant'; content: string }>;
}
```
