# Portfolio Site Implementation Plan

This document outlines the step-by-step process for creating a portfolio version of the nursery-app that displays all properties on a single site, without Azure Front Door (AFD) or domain-based routing.

## Overview

The portfolio site will:
- Display all properties on a single website
- Use path-based routing instead of domain-based routing
- Deploy directly to Azure Static Web Apps (no AFD)
- Show a portfolio grid on the homepage
- Allow navigation to individual property detail pages

## Step-by-Step Instructions

### **Step 1: Create a New Repository/Project**

1. Clone the current repository to a new directory:
   ```bash
   cd /Users/ben/Code/NursuryFrontEnd
   cp -r nursery-app portfolio-app
   cd portfolio-app
   ```

2. Initialize a new git repository (optional):
   ```bash
   rm -rf .git
   git init
   ```

### **Step 2: Update Configuration Files**

1. **Update `package.json`**:
   - Change `"name": "nursery-app"` to `"name": "portfolio-app"`
   - Update scripts if needed

2. **Update `swa-cli.config.json`**:
   ```json
   {
     "$schema": "https://aka.ms/azure/static-web-apps-cli/schema",
     "configurations": {
       "portfolio-app": {
         "appLocation": ".",
         "apiLocation": "build/server",
         "outputLocation": "build/static",
         "appBuildCommand": "pnpm run build",
         "appDevserverCommand": "pnpm run dev",
         "appName": "portfolio-app",
         "resourceGroup": "portfolio-app-rg",
         "port": 4373,
         "appDevserverUrl": "http://localhost:4370"
       }
     }
   }
   ```

3. **Remove or update `microsite-config.json`**:
   - Remove AFD-related configs
   - Keep only what's needed for SWA

### **Step 3: Remove Domain-Based Routing Logic**

1. **Simplify `src/hooks.server.js`**:
   - Remove property resolution from host header
   - Remove `resolvePropertyFromHost` usage
   - Set a default property ID or remove brand-specific logic
   - Keep basic request handling and logging

2. **Update `src/routes/+layout.server.js`**:
   - Remove brand/property resolution
   - Return empty data or a default config

3. **Remove or simplify `src/lib/brands.js`**:
   - Keep only a DEFAULT config if needed
   - Remove domain-to-property mapping

### **Step 4: Create Portfolio API Functions**

1. **Create `src/lib/api/portfolio.js`**:
   - Add a function to fetch all published properties from the Maynard API
   - Example endpoint: `/api/public/nursery/properties` (if available) or fetch multiple property IDs

2. **Update `src/lib/api/maynard.js`**:
   - Add `fetchAllProperties()` or `fetchPropertiesList()` if the API supports it
   - Otherwise, maintain a list of property IDs to fetch

### **Step 5: Create Portfolio Homepage**

1. **Create `src/routes/+page.server.js`**:
   ```javascript
   import { fetchAllProperties } from '$lib/api/portfolio.js';
   
   export const load = async () => {
     const properties = await fetchAllProperties();
     return { properties };
   };
   ```

2. **Update `src/routes/+page.svelte`**:
   - Display a grid/list of all properties
   - Show property name, image, address, and link to detail page
   - Remove single-property-specific content

### **Step 6: Create Property Detail Pages**

1. **Create `src/routes/properties/[id]/+page.server.js`**:
   ```javascript
   import { fetchSitePayload } from '$lib/api/maynard.js';
   
   export const load = async ({ params }) => {
     const propertyId = params.id;
     const data = await loadMaynardPage({ 
       locals: { brand: propertyId } 
     });
     return data;
   };
   ```

2. **Create `src/routes/properties/[id]/+page.svelte`**:
   - Reuse existing marketing page components
   - Show single property details, listings, amenities, etc.

### **Step 7: Update Navigation and Components**

1. **Update `src/lib/components/Header.svelte`**:
   - Remove property-specific navigation
   - Add "Portfolio" or "All Properties" link
   - Simplify menu items

2. **Update `src/lib/components/Footer.svelte`**:
   - Remove property-specific content
   - Add portfolio-wide contact info

### **Step 8: Update Sitemap**

1. **Update `src/routes/sitemap.xml/+server.js`**:
   - Generate URLs for all properties
   - Include portfolio homepage and property detail pages
   - Remove host-based logic

### **Step 9: Remove AFD-Related Scripts**

1. **Remove or ignore**:
   - `scripts/domain-setup/*` (AFD setup scripts)
   - `scripts/domain-migration/*` (domain migration scripts)
   - Any scripts referencing AFD or domain routing

### **Step 10: Update Build Configuration**

1. **Update `build/staticwebapp.config.json`**:
   - Keep existing routing rules
   - Remove any AFD-specific configurations

2. **Update `svelte.config.js`**:
   - Remove domain-based trusted origins if present
   - Simplify CSRF/origin handling

### **Step 11: Create Azure Static Web App**

1. **Create a new SWA resource in Azure**:
   ```bash
   az staticwebapp create \
     --name portfolio-app \
     --resource-group portfolio-app-rg \
     --location eastus2
   ```

2. **Configure custom domain (optional, direct to SWA)**:
   - In Azure Portal: Static Web App → Custom domains
   - Add your domain
   - Configure DNS (CNAME to SWA default domain)

3. **No AFD setup needed** — SWA handles routing directly

### **Step 12: Update Environment Variables**

1. **Create `.env` or update `local.settings.json`**:
   - Keep `MAYNARD_API_BASE_URL`
   - Remove AFD-related variables
   - Add any portfolio-specific configs

### **Step 13: Testing**

1. **Local development**:
   ```bash
   pnpm install
   pnpm dev
   ```
   - Visit `http://localhost:4370` to see portfolio

2. **Test property detail pages**:
   - Visit `http://localhost:4370/properties/157` (Celeste example)

### **Step 14: Deployment**

1. **Build and deploy**:
   ```bash
   pnpm build
   az staticwebapp deploy \
     --name portfolio-app \
     --resource-group portfolio-app-rg \
     --app-location "." \
     --output-location "build/static" \
     --api-location "build/server"
   ```

2. **Or use GitHub Actions**:
   - Create `.github/workflows/azure-static-web-apps-portfolio-app.yml`
   - Configure for the new SWA resource

## Key Differences Summary

| Current (Microsite) | New (Portfolio) |
|---------------------|-----------------|
| Domain-based routing | Single domain, path-based routing |
| AFD required | Direct SWA deployment |
| One property per domain | All properties on one site |
| `hooks.server.js` resolves property from host | No host resolution needed |
| `brands.js` maps domains to properties | Simple property list |
| Property-specific sitemap | Portfolio-wide sitemap |

## Files to Modify

1. `src/hooks.server.js` - Remove property resolution
2. `src/routes/+layout.server.js` - Remove brand logic
3. `src/routes/+page.svelte` - Create portfolio grid
4. `src/routes/+page.server.js` - Fetch all properties
5. `src/lib/brands.js` - Simplify or remove
6. `src/lib/api/portfolio.js` - NEW: Fetch all properties
7. `src/routes/sitemap.xml/+server.js` - Generate portfolio sitemap
8. `swa-cli.config.json` - Update app name
9. `package.json` - Update name

## Files to Create

1. `src/routes/properties/[id]/+page.server.js`
2. `src/routes/properties/[id]/+page.svelte`
3. `src/lib/api/portfolio.js`

## Files to Remove/Ignore

1. `scripts/domain-setup/*`
2. `scripts/domain-migration/*`
3. `microsite-config.json` (or simplify)

## Implementation Notes

### API Considerations

The portfolio site will need to fetch all properties. Options:

1. **If Maynard API has a list endpoint**:
   - Use `/api/public/nursery/properties` to get all published properties
   - Filter for published properties only

2. **If no list endpoint exists**:
   - Maintain a curated list of property IDs in code
   - Fetch each property's data in parallel
   - Cache results appropriately

### Property ID List

You may need to maintain a list of property IDs to include in the portfolio. This could be:
- A static array in `src/lib/api/portfolio.js`
- An environment variable
- Fetched from a configuration endpoint

### Routing Structure

Suggested URL structure:
- `/` - Portfolio homepage (grid of all properties)
- `/properties/[id]` - Individual property detail page
- `/properties/[id]/listings` - Property listings (if separate page needed)
- `/properties/[id]/amenities` - Property amenities (if separate page needed)

### Performance Considerations

- Implement caching for property list
- Use lazy loading for property images
- Consider pagination if portfolio grows large
- Optimize API calls (batch requests where possible)

### SEO Considerations

- Generate proper sitemap with all property URLs
- Add meta tags for portfolio homepage
- Ensure property detail pages have proper canonical URLs
- Add structured data (JSON-LD) for properties

## Next Steps

1. Review this plan and adjust as needed
2. Create the new project directory
3. Start with Step 1 and work through sequentially
4. Test each step before moving to the next
5. Deploy to staging environment first
6. Test thoroughly before production deployment

