import { loadMaynardPage } from '$lib/server/maynard-page-loader.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
  // Load the standard Maynard page data for consistent branding
  const pageData = await loadMaynardPage({ locals });

  // Extract query parameters
  const leadId = url.searchParams.get('leadId');
  const skipped = url.searchParams.get('skipped') === 'true';

  return {
    ...pageData,
    leadId,
    skippedStep2: skipped,
  };
}
