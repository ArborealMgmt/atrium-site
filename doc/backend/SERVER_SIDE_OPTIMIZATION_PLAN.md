# Server-Side Optimization Plan for Affordable Housing Page

## Overview
All efficiency improvements can be implemented **server-side without any external API changes**. 

**What we're doing**: Moving code within this SvelteKit app from:
- `+page.svelte` (runs on server AND gets bundled for browser)
- To `+page.server.js` or `maynard-page-loader.js` (runs ONLY on server)

**Why**: The external Maynard API already returns all necessary data (`affordableHousingRestrictions`). We're just reorganizing where we process that data - moving transformation logic from the component file to the server loader file.

**Result**: Smaller client bundle, faster hydration, same SSR output.

## What Can Be Moved Server-Side (No API Changes Required)

### ✅ 1. Grouped Restrictions Transformation
**Current**: Runs in `+page.svelte` on every render  
**Move to**: `+page.server.js` or `maynard-page-loader.js`  
**Impact**: Eliminates ~100 lines of client-side JS, faster initial page load

### ✅ 2. Income Limits Comparison Logic
**Current**: `areIncomeLimitsSame()` function runs client-side  
**Move to**: Server-side transformation  
**Impact**: Pre-computes whether limits are same/different, reduces template complexity

### ✅ 3. Pre-compute Restrictions with Limits
**Current**: Filters and sorts in template with `{@const}`  
**Move to**: Server-side transformation  
**Impact**: Cleaner templates, faster rendering

### ✅ 4. Combine Array Operations
**Current**: Multiple `.map()`, `.reduce()`, `.filter()` calls  
**Move to**: Single-pass transformation server-side  
**Impact**: More efficient processing, especially for large datasets

### ✅ 5. Pre-compute Display Values
**Current**: Computes `year`, `limitsAreSame`, `restrictionsWithLimits` in template  
**Move to**: Server-side transformation  
**Impact**: Simpler template, better SSR performance

## Implementation Plan

### Step 1: Create Server-Side Transformation Function

Create a new file: `src/lib/server/affordable-housing-transform.js`

```javascript
/**
 * Transform affordable housing restrictions for UI display
 * Moves all heavy computation from client to server
 * @param {Array} affordableHousingRestrictions - Raw API data
 * @returns {Array} Transformed restrictions ready for UI
 */
export function transformAffordableHousing(affordableHousingRestrictions) {
  if (!Array.isArray(affordableHousingRestrictions) || affordableHousingRestrictions.length === 0) {
    return [];
  }

  return affordableHousingRestrictions.map(program => {
    const hasBedroomVariations = Array.isArray(program.bedroomVariations);

    if (hasBedroomVariations) {
      return transformGroupedProgram(program);
    } else {
      return transformLegacyProgram(program);
    }
  });
}

/**
 * Transform grouped program structure (with bedroomVariations)
 */
function transformGroupedProgram(program) {
  const bedroomVariations = program.bedroomVariations || [];
  
  // Single-pass through bedroomVariations to collect all data
  const restrictions = [];
  const amiPercentages = [];
  let unitCount = program.unitCount;
  let totalRestrictedUnits = program.totalRestrictedUnits;

  for (const variation of bedroomVariations) {
    // Collect AMI percentages
    if (variation.amiPercent != null) {
      amiPercentages.push(variation.amiPercent);
    }

    // Sum unit counts from variations (always accumulate non-null values)
    if (variation.unitCount != null) {
      unitCount = (unitCount || 0) + variation.unitCount;
    }

    // Sum total restricted units from variations (always accumulate non-null values)
    if (variation.totalRestrictedUnits != null) {
      totalRestrictedUnits = (totalRestrictedUnits || 0) + variation.totalRestrictedUnits;
    }

    // Build restrictions array
    restrictions.push({
      bedrooms: variation.bedrooms,
      amiPercent: variation.amiPercent,
      currentMaxRent: variation.currentMaxRent,
      rentType: variation.rentType,
      totalRestrictedUnits: variation.totalRestrictedUnits,
      unitCount: variation.unitCount,
      incomeLimits: variation.incomeLimits,
    });
  }

  // Sort restrictions by bedroom number (null first, then 1, 2, 3, etc.)
  restrictions.sort((a, b) => {
    if (a.bedrooms == null && b.bedrooms == null) return 0;
    if (a.bedrooms == null) return -1;
    if (b.bedrooms == null) return 1;
    return (a.bedrooms || 0) - (b.bedrooms || 0);
  });

  // Filter and pre-compute restrictions with income limits
  const restrictionsWithLimits = restrictions.filter(
    r => r.incomeLimits?.limits?.length > 0
  );

  // Pre-compute income limits comparison
  const limitsAreSame = areIncomeLimitsSame(restrictions);
  
  // Pre-compute year (from first restriction with limits)
  const year = restrictionsWithLimits[0]?.incomeLimits?.year;

  const uniqueAMIs = [...new Set(amiPercentages)];
  const hasMultipleAMIs = uniqueAMIs.length > 1;
  const defaultAMIPercent = amiPercentages[0] || null;

  return {
    restrictionName: program.restrictionName || 'Unknown Program',
    restrictionType: program.restrictionType,
    regulator: program.regulator,
    amiPercent: defaultAMIPercent,
    totalRestrictedUnits,
    unitCount,
    hasTotalRestrictedUnits: totalRestrictedUnits != null,
    hasMultipleAMIs,
    restrictions,
    // Pre-computed values for template
    restrictionsWithLimits,
    limitsAreSame,
    year,
  };
}

/**
 * Transform legacy flat structure (single restriction)
 */
function transformLegacyProgram(program) {
  const restrictions = [program];
  const restrictionsWithLimits = program.incomeLimits?.limits?.length > 0 
    ? [program] 
    : [];
  
  return {
    restrictionName: program.restrictionName || 'Unknown Program',
    restrictionType: program.restrictionType,
    regulator: program.regulator,
    amiPercent: program.amiPercent,
    totalRestrictedUnits: program.totalRestrictedUnits,
    unitCount: program.unitCount,
    hasTotalRestrictedUnits: program.totalRestrictedUnits != null,
    hasMultipleAMIs: false,
    restrictions,
    restrictionsWithLimits,
    limitsAreSame: true, // Single restriction = always same
    year: program.incomeLimits?.year,
  };
}

/**
 * Check if income limits are the same across all restrictions
 * Optimized version using JSON serialization for comparison
 */
function areIncomeLimitsSame(restrictions) {
  const restrictionsWithLimits = restrictions.filter(
    r => r.incomeLimits?.limits?.length > 0
  );

  if (restrictionsWithLimits.length <= 1) {
    return true;
  }

  // Serialize first restriction's limits for comparison
  const firstLimits = restrictionsWithLimits[0].incomeLimits.limits;
  const firstSerialized = JSON.stringify(
    firstLimits
      .map(l => `${l.householdSize}:${l.limit}`)
      .sort()
  );

  // Compare all others against the serialized version
  return restrictionsWithLimits.slice(1).every(restriction => {
    const limits = restriction.incomeLimits.limits;
    const serialized = JSON.stringify(
      limits
        .map(l => `${l.householdSize}:${l.limit}`)
        .sort()
    );
    return serialized === firstSerialized;
  });
}
```

### Step 2: Update `maynard-page-loader.js`

Add the transformation to the server-side loader:

```javascript
import { transformAffordableHousing } from '$lib/server/affordable-housing-transform.js';

// In loadMaynardPage function, after fetching payload:
const affordableHousingRestrictions = transformAffordableHousing(
  payload.affordableHousingRestrictions || []
);

return {
  // ... other fields
  affordableHousingRestrictions, // Now pre-transformed
  showAffordableContent: payload.showAffordableContent || false,
};
```

### Step 3: Simplify `+page.svelte`

Remove all transformation logic from the component:

```javascript
<script>
  import { getHeroBySlot, getImageUrl } from '$lib/api/media.js';
  import heroBgImageStatic from '$lib/assets/img/home-page/hero-bg.jpg';
  import CmsImageWrapper from '$lib/components/CmsImageWrapper.svelte';
  import CmsText from '$lib/components/CmsText.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import { ROUTES } from '$lib/config/routes.js';
  import Head from '$lib/seo/Head.svelte';

  let { data } = $props();

  const copy = data.content || {};
  const media = data.media || {};
  const groupedRestrictions = data.affordableHousingRestrictions || []; // Already transformed!

  // ... rest of component (hero image, parsing, etc.)
  
  // Remove: areIncomeLimitsSame function
  // Remove: groupedRestrictions transformation
  // Remove: All {@const} declarations in template
</script>
```

### Step 4: Update Template

Simplify template to use pre-computed values:

```svelte
{#each groupedRestrictions as group (group.restrictionName)}
  {@const restrictionsWithLimits = group.restrictionsWithLimits}
  {@const limitsAreSame = group.limitsAreSame}
  {@const year = group.year}
  
  <!-- Use pre-computed values directly -->
  {#if restrictionsWithLimits.length > 0}
    {#if limitsAreSame}
      <!-- Single table -->
    {:else}
      <!-- Multi-column table -->
    {/if}
  {/if}
{/each}
```

## What Stays Client-Side

### ❌ Currency Formatting
**Reason**: Uses browser's `Intl.NumberFormat` API, needs to run client-side  
**Note**: Can still cache the formatter instance

### ❌ Array Field Parsing
**Reason**: Handles CMS field format variations, minimal performance impact

### ❌ Template Rendering Logic
**Reason**: Svelte template logic, must run client-side for interactivity

## Benefits

1. **Reduced Client Bundle**: ~100-150 lines of JS removed from client bundle
2. **Faster Initial Load**: All computation happens during SSR
3. **Better SEO**: Pre-rendered content includes all transformations
4. **Simpler Templates**: Less complex `{@const}` logic in templates
5. **Better Performance**: Server-side processing is faster than client-side

## Migration Steps

1. ✅ Create `affordable-housing-transform.js` file
2. ✅ Add transformation to `maynard-page-loader.js`
3. ✅ Update `+page.svelte` to use pre-transformed data
4. ✅ Test with property 27
5. ✅ Verify all edge cases (legacy structure, null values, etc.)

## Testing Checklist

- [ ] Property with bedroom variations (property 27)
- [ ] Property with single bedroom variation
- [ ] Property with legacy flat structure
- [ ] Property with null `totalRestrictedUnits`
- [ ] Property with same income limits across bedrooms
- [ ] Property with different income limits across bedrooms
- [ ] Property with no income limits
- [ ] Property with no affordable housing restrictions

## No API Changes Required ✅

All transformations use data already returned by the API:
- `affordableHousingRestrictions[]`
- `bedroomVariations[]`
- `incomeLimits.limits[]`
- `unitCount`, `totalRestrictedUnits`
- All other fields

The API contract remains unchanged - we're just reorganizing where processing happens.
