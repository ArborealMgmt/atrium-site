import { redirect } from '@sveltejs/kit';

import { loadMaynardPage } from '$lib/server/maynard-page-loader.js';

export const load = async ({ locals }) => {
  /** @type {any} */
  const data = await loadMaynardPage({
    locals,
  });

  // Redirect only when the backend explicitly disables affordable content (e.g. property has none).
  // When showAffordableContent is null/undefined or restrictions are empty, still show the page
  // so the nav link works and copy (intro, eligibility, process) is visible.
  if (data.showAffordableContent === false) {
    throw redirect(302, '/');
  }

  return data;
};
