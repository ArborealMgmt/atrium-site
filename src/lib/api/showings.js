/**
 * Showing booking API functions
 */

import { env as PRIVATE_ENV } from '$env/dynamic/private';

/**
 * Get the API base URL from environment
 * Defaults to production if not set
 */
function getApiBaseUrl() {
  return (
    PRIVATE_ENV?.MAYNARD_API_BASE_URL ||
    process.env?.MAYNARD_API_BASE_URL ||
    'https://maynardapp.azurewebsites.net'
  );
}

const API_BASE_URL = getApiBaseUrl();

/**
 * Fetch available showing slots for a property
 * @param {string|number} propertyId - Property ID
 * @param {Object} options - Query options
 * @param {number} [options.daysAhead=14] - Number of days to look ahead
 * @param {string} [options.startDate] - Override start date (ISO string)
 * @param {string} [options.endDate] - Override end date (ISO string)
 * @param {string} [options.unitId] - Optional unit ID to filter availability
 * @returns {Promise<Object>} Showing slots response
 */
export async function fetchShowingSlots(propertyId, options = {}) {
  if (!propertyId) {
    throw new Error('Property ID is required');
  }

  const params = new URLSearchParams();
  if (options.daysAhead) params.append('daysAhead', options.daysAhead.toString());
  if (options.startDate) params.append('startDate', options.startDate);
  if (options.endDate) params.append('endDate', options.endDate);
  if (options.unitId) params.append('unitId', options.unitId);

  const url = `${API_BASE_URL}/api/public/nursery/properties/${propertyId}/showing-slots?${params}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = `Failed to fetch showing slots for property ${propertyId}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use default error
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Book a showing for a property
 * @param {string|number} propertyId - Property ID
 * @param {Object} bookingData - Booking information
 * @param {string} bookingData.firstName - Lead's first name
 * @param {string} bookingData.lastName - Lead's last name
 * @param {string} bookingData.phoneNumber - Lead's phone number
 * @param {string} bookingData.datetime - Showing start time in ISO 8601 format
 * @param {string} bookingData.unitId - AppFolio unit UUID (REQUIRED)
 * @param {string} [bookingData.email] - Lead's email address
 * @param {string} [bookingData.assignedUserId] - AppFolio user UUID for staff assignment
 * @param {string} [bookingData.notes] - Optional user notes
 * @param {Object} [bookingData.source] - Source tracking metadata
 * @returns {Promise<Object>} Booking confirmation response
 */
export async function bookShowing(propertyId, bookingData) {
  if (!propertyId) {
    throw new Error('Property ID is required');
  }

  // Validate required fields
  const requiredFields = ['firstName', 'lastName', 'phoneNumber', 'datetime', 'unitId'];
  for (const field of requiredFields) {
    if (!bookingData[field]) {
      throw new Error(`${field} is required`);
    }
  }

  // Automatically add source metadata if not provided
  const enrichedBookingData = {
    ...bookingData,
    source: {
      type: 'nursery',
      propertyId: propertyId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      utmSource:
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('utm_source')
          : undefined,
      utmCampaign:
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('utm_campaign')
          : undefined,
      utmMedium:
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('utm_medium')
          : undefined,
      ...bookingData.source, // Allow override of source metadata
    },
  };

  const url = `${API_BASE_URL}/api/public/nursery/properties/${propertyId}/book-showing`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(enrichedBookingData),
  });

  if (!response.ok) {
    let errorMessage = `Failed to book showing for property ${propertyId}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use default error
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
