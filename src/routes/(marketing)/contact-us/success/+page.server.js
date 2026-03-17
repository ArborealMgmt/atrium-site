/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const leadId = url.searchParams.get('leadId');
  const skippedStep2 = url.searchParams.get('skipped') === 'true';
  return {
    leadId,
    skippedStep2,
    content: { global_property_name: 'Atrium Court' },
  };
}
