// SSR: Brand resolution happens at runtime based on host header
export const load = async ({ locals }) => {
  const brand = locals.brand;

  // For now, return just the brand identifier
  // Page-specific content comes from individual route loaders via loadMaynardPage
  return {
    brand,
  };
};
