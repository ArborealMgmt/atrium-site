/**
 * Transform affordable housing restrictions for UI display
 * Moves all heavy computation from client to server
 *
 * This module processes the raw API response and pre-computes all values
 * needed by the UI, eliminating client-side transformation overhead.
 *
 * @param {Array} affordableHousingRestrictions - Raw API data
 * @param {Array} listings - Available listings to count actual available units
 * @returns {Array} Transformed restrictions ready for UI
 */
export function transformAffordableHousing(affordableHousingRestrictions, listings = []) {
  if (!Array.isArray(affordableHousingRestrictions) || affordableHousingRestrictions.length === 0) {
    return [];
  }

  return affordableHousingRestrictions.map(program => {
    const hasBedroomVariations = Array.isArray(program.bedroomVariations);

    if (hasBedroomVariations) {
      return transformGroupedProgram(program, listings);
    } else {
      return transformLegacyProgram(program, listings);
    }
  });
}

/**
 * Transform grouped program structure (with bedroomVariations)
 * Single-pass optimization: collects all data in one iteration
 * @param {any} program - Program data from API
 * @param {Array} listings - Available listings to count actual available units
 */
function transformGroupedProgram(program, listings = []) {
  const bedroomVariations = program.bedroomVariations || [];

  // Count actual available listings for this program
  const availableListings = listings.filter(
    listing => listing.affordableHousingProgramName === program.restrictionName
  );
  const actualAvailableCount = availableListings.length;

  // Single-pass through bedroomVariations to collect all data
  const restrictions = [];
  const amiPercentages = [];
  // Start from 0 and sum only from variations to avoid double-counting
  // The program-level values may already include the sum, so we use variations as source of truth
  let unitCount = 0;
  let totalRestrictedUnits = 0;

  for (const variation of bedroomVariations) {
    // Collect AMI percentages
    if (variation.amiPercent != null) {
      amiPercentages.push(variation.amiPercent);
    }

    // Sum unit counts from all variations
    if (variation.unitCount != null) {
      unitCount = unitCount + variation.unitCount;
    }

    // Sum total restricted units from all variations
    if (variation.totalRestrictedUnits != null) {
      totalRestrictedUnits = totalRestrictedUnits + variation.totalRestrictedUnits;
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

  // Filter restrictions with income limits (for comparison only)
  const restrictionsWithLimits = restrictions.filter(r => r.incomeLimits?.limits?.length > 0);

  // Pre-compute income limits comparison (only compare those with limits)
  const limitsAreSame = areIncomeLimitsSame(restrictions);

  // Pre-compute year (from first restriction with limits)
  const year = restrictionsWithLimits[0]?.incomeLimits?.year;

  // For display: include ALL restrictions (even those without limits)
  // This allows showing "N/A" for missing data instead of hiding bedroom types
  const restrictionsForDisplay = restrictions;

  const uniqueAMIs = [...new Set(amiPercentages)];
  const hasMultipleAMIs = uniqueAMIs.length > 1;
  const defaultAMIPercent = amiPercentages[0] || null;

  return {
    restrictionName: program.restrictionName || 'Unknown Program',
    restrictionType: program.restrictionType,
    regulator: program.regulator,
    amiPercent: defaultAMIPercent,
    totalRestrictedUnits,
    // Use actual available listings count instead of backend unitCount
    unitCount: actualAvailableCount > 0 ? actualAvailableCount : null,
    hasTotalRestrictedUnits: totalRestrictedUnits != null,
    hasUnitCount: actualAvailableCount > 0,
    hasMultipleAMIs,
    restrictions,
    // Pre-computed values for template (no client-side computation needed)
    restrictionsWithLimits, // Only restrictions with income limits (for comparison)
    restrictionsForDisplay, // All restrictions (for display, includes those without limits)
    limitsAreSame,
    year,
  };
}

/**
 * Transform legacy flat structure (single restriction)
 * @param {any} program - Program data from API
 * @param {Array} listings - Available listings to count actual available units
 */
function transformLegacyProgram(program, listings = []) {
  // Count actual available listings for this program
  const availableListings = listings.filter(
    listing => listing.affordableHousingProgramName === program.restrictionName
  );
  const actualAvailableCount = availableListings.length;

  const restrictions = [program];
  const restrictionsWithLimits = program.incomeLimits?.limits?.length > 0 ? [program] : [];

  return {
    restrictionName: program.restrictionName || 'Unknown Program',
    restrictionType: program.restrictionType,
    regulator: program.regulator,
    amiPercent: program.amiPercent,
    totalRestrictedUnits: program.totalRestrictedUnits,
    // Use actual available listings count instead of backend unitCount
    unitCount: actualAvailableCount > 0 ? actualAvailableCount : null,
    hasTotalRestrictedUnits: program.totalRestrictedUnits != null,
    hasUnitCount: actualAvailableCount > 0,
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
 *
 * @param {Array} restrictions - Array of restriction objects
 * @returns {boolean} True if all restrictions have identical income limits
 */
function areIncomeLimitsSame(restrictions) {
  const restrictionsWithLimits = restrictions.filter(r => r.incomeLimits?.limits?.length > 0);

  if (restrictionsWithLimits.length <= 1) {
    return true;
  }

  // Serialize first restriction's limits for comparison
  const firstLimits = restrictionsWithLimits[0].incomeLimits.limits;
  const firstSerialized = JSON.stringify(
    firstLimits.map(l => `${l.householdSize}:${l.limit}`).sort()
  );

  // Compare all others against the serialized version
  return restrictionsWithLimits.slice(1).every(restriction => {
    const limits = restriction.incomeLimits.limits;
    const serialized = JSON.stringify(limits.map(l => `${l.householdSize}:${l.limit}`).sort());
    return serialized === firstSerialized;
  });
}
