import { redirect } from '@sveltejs/kit';

import { loadMaynardPage } from '$lib/server/maynard-page-loader.js';

export const load = async ({ locals }) => {
  /** @type {any} */
  const data = await loadMaynardPage({
    locals,
  });

  // Redirect to home only if affordable content is explicitly disabled (false)
  // Allow page to be viewed if showAffordableContent is null/undefined (for development/testing)
  if (data.showAffordableContent === false) {
    throw redirect(302, '/');
  }

  return data;
};
