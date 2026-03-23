import { error } from '@sveltejs/kit';

import { logger } from '$lib/logger.server';

import { env as PRIVATE_ENV } from '$env/dynamic/private';

/**
 * Get the Maynard API base URL from environment
 * Defaults to production if not set
 */
function getMaynardApiBaseUrl() {
  return (
    PRIVATE_ENV?.MAYNARD_API_BASE_URL ||
    (typeof process !== 'undefined' && process.env?.MAYNARD_API_BASE_URL) ||
    'https://maynardapp.azurewebsites.net'
  );
}

const MAYNARD_API_BASE_URL = getMaynardApiBaseUrl();

/**
 * Create a new lead with basic contact information (Step 1)
 * @param {string|number} propertyId - Property ID
 * @param {Object} leadData - Lead data
 * @param {string} leadData.firstName - Lead's first name
 * @param {string} leadData.lastName - Lead's last name
 * @param {string} [leadData.email] - Lead's email address
 * @param {string} [leadData.phoneNumber] - Lead's phone number
 * @param {string} [leadData.middleInitial] - Lead's middle initial
 * @param {string} [leadData.unitId] - Optional unit selection
 * @param {string} [leadData.message] - Optional message
 * @param {Object} [leadData.source] - Source tracking metadata
 * @returns {Promise<Object>} API response with lead ID
 */
export async function createLead(propertyId, leadData) {
  const startTime = Date.now();

  if (!propertyId) {
    logger.error('[leads-api][createLead] missing propertyId');
    throw error(500, 'Property ID is required');
  }

  // Validate required fields
  if (!leadData.firstName?.trim()) {
    throw error(400, 'First name is required');
  }

  if (!leadData.lastName?.trim()) {
    throw error(400, 'Last name is required');
  }

  if (!leadData.email?.trim() && !leadData.phoneNumber?.trim()) {
    throw error(400, 'Either email or phone number is required');
  }

  try {
    // Automatically collect source metadata (server-side safe)
    const enrichedData = {
      ...leadData,
      source: {
        type: 'nursery', // Maps to "Nursery Website" in AppFolio
        propertyId: propertyId,
        ...leadData.source, // Allow override
      },
    };

    const url = `${MAYNARD_API_BASE_URL}/api/public/nursery/properties/${propertyId}/leads`;

    logger.info('[leads-api][createLead] request start', {
      detailedMessage: {
        propertyId,
        url,
        hasEmail: !!leadData.email,
        hasPhone: !!leadData.phoneNumber,
      },
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrichedData),
    });

    const totalDuration = Date.now() - startTime;

    if (!response.ok) {
      let errorMessage = `Failed to create lead for property ${propertyId}`;
      let status = response.status;

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use default error
      }

      logger.error('[leads-api][createLead] request failed', {
        detailedMessage: {
          propertyId,
          status: response.status,
          statusText: response.statusText,
          errorMessage,
          totalDuration,
        },
      });

      throw error(status === 404 ? 404 : status >= 400 && status < 500 ? 400 : 500, errorMessage);
    }

    const result = await response.json();

    logger.info('[leads-api][createLead] request success', {
      detailedMessage: {
        propertyId,
        leadId: result.lead?.id,
        created: result.created,
        duplicate: result.duplicate,
        totalDuration,
      },
    });

    return result;
  } catch (err) {
    const totalDuration = Date.now() - startTime;
    logger.error('[leads-api][createLead] failure', {
      detailedMessage: {
        propertyId,
        errorName: err?.name,
        errorDetail: err?.message ?? 'Lead creation failed',
        totalDuration,
      },
    });

    // If it's already an SvelteKit error, rethrow it
    if (err?.status && typeof err.status === 'number') {
      throw err;
    }

    throw error(500, err?.message || 'Failed to create lead');
  }
}

/**
 * Update an existing lead with additional details (Step 2)
 * @param {string|number} propertyId - Property ID
 * @param {string} leadId - Lead UUID
 * @param {Object} additionalData - Additional lead data
 * @param {number} [additionalData.bedrooms] - Number of bedrooms desired
 * @param {string} [additionalData.bathrooms] - Number of bathrooms desired
 * @param {string} [additionalData.desiredMoveIn] - Desired move-in date (YYYY-MM-DD)
 * @param {string} [additionalData.maxRent] - Maximum rent budget
 * @param {string} [additionalData.monthlyIncome] - Monthly income
 * @param {number} [additionalData.additionalOccupants] - Number of additional occupants
 * @param {boolean} [additionalData.hasCats] - Has cats
 * @param {boolean} [additionalData.hasDogs] - Has dogs
 * @param {boolean} [additionalData.hasOtherPet] - Has other pets
 * @param {string} [additionalData.creditScore] - Credit score range
 * @returns {Promise<Object>} API response
 */
export async function updateLead(propertyId, leadId, additionalData) {
  const startTime = Date.now();

  if (!propertyId) {
    logger.error('[leads-api][updateLead] missing propertyId');
    throw error(500, 'Property ID is required');
  }

  if (!leadId) {
    logger.error('[leads-api][updateLead] missing leadId');
    throw error(500, 'Lead ID is required');
  }

  try {
    const url = `${MAYNARD_API_BASE_URL}/api/public/nursery/properties/${propertyId}/leads/${leadId}`;

    logger.info('[leads-api][updateLead] request start', {
      detailedMessage: { propertyId, leadId, url },
    });

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(additionalData),
    });

    const totalDuration = Date.now() - startTime;

    if (!response.ok) {
      let errorMessage = `Failed to update lead ${leadId}`;
      let status = response.status;

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use default error
      }

      logger.error('[leads-api][updateLead] request failed', {
        detailedMessage: {
          propertyId,
          leadId,
          status: response.status,
          statusText: response.statusText,
          errorMessage,
          totalDuration,
        },
      });

      throw error(status === 404 ? 404 : status >= 400 && status < 500 ? 400 : 500, errorMessage);
    }

    const result = await response.json();

    logger.info('[leads-api][updateLead] request success', {
      detailedMessage: {
        propertyId,
        leadId: result.id,
        totalDuration,
      },
    });

    return result;
  } catch (err) {
    const totalDuration = Date.now() - startTime;
    logger.error('[leads-api][updateLead] failure', {
      detailedMessage: {
        propertyId,
        leadId,
        errorName: err?.name,
        errorDetail: err?.message ?? 'Lead update failed',
        totalDuration,
      },
    });

    // If it's already an SvelteKit error, rethrow it
    if (err?.status && typeof err.status === 'number') {
      throw err;
    }

    throw error(500, err?.message || 'Failed to update lead');
  }
}
