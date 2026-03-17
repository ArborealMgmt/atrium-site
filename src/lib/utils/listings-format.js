/**
 * Display formatters for listings after optional transform (transformMaynardListings).
 * Use with the nursery-app shape: primaryRent, unitId, availableOn, listingDeposit, applicationFee, etc.
 */

/**
 * Format rent for display (e.g. $1,495/month).
 * @param {number | string | null | undefined} rent
 * @returns {string}
 */
export function formatRent(rent) {
  if (rent == null) return '—';
  if (typeof rent === 'number') return `$${rent.toLocaleString()}/month`;
  return String(rent);
}

/**
 * Format a numeric amount as currency (e.g. $500).
 * @param {number | string | null | undefined} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (amount == null) return '—';
  const n = typeof amount === 'number' ? amount : Number(amount);
  if (Number.isNaN(n)) return '—';
  return `$${n.toLocaleString()}`;
}

/**
 * Format availableOn (YYYY-MM-DD) for display (e.g. Available Jan 15, 2026).
 * @param {string | null | undefined} availableOn
 * @returns {string}
 */
export function formatAvailableDate(availableOn) {
  if (!availableOn) return '';
  try {
    const d = new Date(availableOn);
    if (Number.isNaN(d.getTime())) return '';
    return `Available ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  } catch {
    return '';
  }
}

/**
 * Build bed/bath/sqft line from transformed listing (primaryBedrooms, primaryBathrooms, primarySquareFeet / sqft).
 * @param {{ primaryBedrooms?: number; primaryBathrooms?: number; primarySquareFeet?: number; sqft?: number; squareFeet?: number; bedrooms?: number; bathrooms?: number }} listing
 * @returns {string}
 */
export function formatBedBathSqft(listing) {
  const b = listing.primaryBedrooms ?? listing.bedrooms;
  const bth = listing.primaryBathrooms ?? listing.bathrooms;
  const sqft = listing.primarySquareFeet ?? listing.sqft ?? listing.squareFeet;
  const parts = [];
  if (b != null) parts.push(`${b} bed${b !== 1 ? 's' : ''}`);
  if (bth != null) parts.push(`${bth} bath${bth !== 1 ? 's' : ''}`);
  if (sqft != null) parts.push(`${sqft} sq ft`);
  return parts.join(' ');
}
