import { fail, redirect } from '@sveltejs/kit';

import { createLead } from '$lib/api/leads.js';
import { leadValidation } from '$lib/utils/leadValidation.js';

const PROPERTY_ID = 232; // Atrium Court

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  // Optional: pass unit/tour from availability "Schedule Tour" links
  const unitId = url.searchParams.get('tour') ?? url.searchParams.get('unitId') ?? null;
  return {
    unitId,
    content: { global_property_name: 'Atrium Court' },
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, url }) => {
    const formData = await request.formData();
    const firstName = (formData.get('firstName') ?? '').toString().trim();
    const lastName = (formData.get('lastName') ?? '').toString().trim();
    const email = (formData.get('email') ?? '').toString().trim();
    const phoneNumber = (formData.get('phoneNumber') ?? '').toString().trim();
    const message = (formData.get('message') ?? '').toString().trim();
    const unitId = (formData.get('unitId') ?? '').toString().trim() || null;

    const leadData = { firstName, lastName, email, phoneNumber, message, unitId };
    const errors = leadValidation.validateBasicLead(leadData);

    if (errors.length > 0) {
      return fail(400, {
        errors,
        ...leadData,
      });
    }

    try {
      const result = await createLead(PROPERTY_ID, {
        firstName,
        lastName,
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
        message: message || undefined,
        unitId: unitId || undefined,
      });

      const leadId = result?.lead?.id ?? result?.id ?? null;
      const redirectUrl = new URL('/contact-us/success', url.origin);
      if (leadId) redirectUrl.searchParams.set('leadId', String(leadId));

      throw redirect(303, redirectUrl.toString());
    } catch (err) {
      if (err?.status === 303 && err?.location) throw err;
      return fail(500, {
        errors: [
          err?.message ?? 'Something went wrong. Please try again or contact us by phone or email.',
        ],
        ...leadData,
      });
    }
  },
};
