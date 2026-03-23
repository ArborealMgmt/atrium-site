/**
 * Centralized route constants
 * All application routes should be defined here for consistency and maintainability
 */

export const ROUTES = {
  HOME: '/',
  AVAILABILITY: '/availability',
  APARTMENTS: '/apartments',
  CONTACT_US: '/contact-us',
  NEIGHBORHOOD: '/neighborhood',
  COMMUNITY: '/community',
  LISTINGS: '/listings',
  AFFORDABLE: '/affordable',
  /** Path prefix; full URL is `/schedule-showing/{unitUuid}`. */
  SCHEDULE_SHOWING: '/schedule-showing',
};

/**
 * Link to the book-a-showing flow for a Maynard/AppFolio unit UUID.
 * @param {string | number | null | undefined} unitId
 * @returns {string}
 */
export function scheduleShowingUrl(unitId) {
  const id = unitId != null ? String(unitId).trim() : '';
  if (!id) return ROUTES.CONTACT_US;
  return `${ROUTES.SCHEDULE_SHOWING}/${encodeURIComponent(id)}`;
}
