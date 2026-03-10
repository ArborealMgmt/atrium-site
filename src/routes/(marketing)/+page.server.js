import { loadMaynardPage } from '$lib/server/maynard-page-loader.js';

export const load = async ({ locals }) => {
  return loadMaynardPage({
    locals,
  });
};
