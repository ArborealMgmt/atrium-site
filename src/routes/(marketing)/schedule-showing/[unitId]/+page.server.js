import { error, fail } from '@sveltejs/kit';

import { transformMaynardListings } from '$lib/api/listings-transform.js';
import { bookShowing, fetchShowingSlots } from '$lib/api/showings.js';
import { siteConfig } from '$lib/config/site-config.js';
import { logger } from '$lib/logger.server.js';

/** Atrium Court — same property as availability list. */
const PROPERTY_ID = 232;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const unitId = params.unitId?.trim();
  if (!unitId) {
    error(404, 'Not found');
  }

  const baseUrl =
    (typeof process !== 'undefined' && process.env?.MAYNARD_API_BASE_URL) ||
    siteConfig.maynardApiBaseUrl;
  const listingsUrl = `${baseUrl}/api/public/nursery/properties/${PROPERTY_ID}/listings`;

  let listings = [];
  let listingsOk = false;

  try {
    const res = await fetch(listingsUrl, { headers: { Accept: 'application/json' } });
    listingsOk = res.ok;
    if (res.ok) {
      const data = await res.json();
      const raw = Array.isArray(data?.listings) ? data.listings : [];
      listings = transformMaynardListings(raw);
    } else {
      logger.warn('[schedule-showing] listings request failed', {
        detailedMessage: { listingsUrl, status: res.status },
      });
    }
  } catch (err) {
    logger.warn('[schedule-showing] listings fetch error', {
      detailedMessage: { error: err?.message ?? String(err) },
    });
  }

  if (!listingsOk && listings.length === 0) {
    error(503, 'Unable to load listings. Please try again later.');
  }

  const selectedUnit = listings.find(
    l => String(l.id) === String(unitId) || String(l.unitId) === String(unitId)
  );

  if (!selectedUnit) {
    error(404, 'This unit is not available or is no longer listed.');
  }

  let showingSlots = [];

  try {
    const slotPayload = await fetchShowingSlots(PROPERTY_ID, {
      daysAhead: 14,
      unitId,
    });
    const raw = slotPayload?.slots ?? slotPayload?.data?.slots;
    showingSlots = Array.isArray(raw) ? raw : [];
  } catch (err) {
    logger.warn('[schedule-showing] showing slots failed', {
      detailedMessage: { unitId, error: err?.message ?? String(err) },
    });
    showingSlots = [];
  }

  return {
    selectedUnit,
    showingSlots,
    propertyId: PROPERTY_ID,
    content: { global_property_name: 'Atrium Court' },
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  book: async ({ request, params }) => {
    const unitId = params.unitId?.trim();
    if (!unitId) {
      return fail(400, { errors: ['Missing unit.'] });
    }

    const formData = await request.formData();
    const firstName = (formData.get('firstName') ?? '').toString().trim();
    const lastName = (formData.get('lastName') ?? '').toString().trim();
    const phoneNumber = (formData.get('phoneNumber') ?? '').toString().trim();
    const email = (formData.get('email') ?? '').toString().trim();
    const notes = (formData.get('notes') ?? '').toString().trim();
    const datetime = (formData.get('datetime') ?? '').toString().trim();
    const assignedUserIdRaw = (formData.get('assignedUserId') ?? '').toString().trim();
    const assignedUserId = assignedUserIdRaw || undefined;

    const fieldData = {
      firstName,
      lastName,
      phoneNumber,
      email,
      notes,
      datetime,
      assignedUserId: assignedUserIdRaw,
    };

    const errors = [];
    if (!firstName) errors.push('First name is required.');
    if (!lastName) errors.push('Last name is required.');
    if (!phoneNumber) errors.push('Phone number is required.');
    if (!datetime) errors.push('Please choose a showing time.');

    if (errors.length > 0) {
      return fail(400, { errors, ...fieldData });
    }

    try {
      const result = await bookShowing(PROPERTY_ID, {
        firstName,
        lastName,
        phoneNumber,
        email: email || undefined,
        notes: notes || undefined,
        datetime,
        unitId,
        assignedUserId,
        source: {
          type: 'nursery',
          propertyId: PROPERTY_ID,
          referrer: request.headers.get('referer') ?? undefined,
        },
      });

      const bookingId =
        result?.booking?.id ?? result?.id ?? result?.bookingId ?? result?.confirmationId ?? null;

      return {
        success: true,
        bookingId,
        booking: result,
      };
    } catch (err) {
      logger.error('[schedule-showing] book showing failed', {
        detailedMessage: {
          unitId,
          message: err?.message ?? String(err),
        },
      });
      return fail(400, {
        errors: [err?.message ?? 'Could not complete booking. Please try again or call us.'],
        ...fieldData,
      });
    }
  },
};
