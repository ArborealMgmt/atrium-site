// Property configurations - using property IDs directly as keys
// Minimal configuration for single-property site (Terrapin Apartments)
// This file exists primarily to satisfy test requirements

export const PROPERTY_CONFIG = Object.freeze({
  234: {
    propertyId: 234,
    domains: ['terrapinapartments.com', 'www.terrapinapartments.com', 'terrapin.local'],
  },
  DEFAULT: {
    propertyId: 'DEFAULT',
    domains: ['localhost'],
  },
});

// Build reverse lookup map for fast host -> property ID resolution
const HOST_TO_PROPERTY = Object.freeze(
  Object.entries(PROPERTY_CONFIG).reduce((acc, [propertyId, config]) => {
    config.domains.forEach(domain => {
      acc[domain.toLowerCase()] = propertyId;
    });
    return acc;
  }, {})
);

export function resolvePropertyFromHost(host) {
  const key = host.toLowerCase();
  const propertyId = HOST_TO_PROPERTY[key] || 'DEFAULT';

  return propertyId;
}

export function getPropertyConfig(propertyId) {
  return PROPERTY_CONFIG[propertyId] || PROPERTY_CONFIG['DEFAULT'];
}

// Legacy function names for backward compatibility during transition
export const resolveBrandFromHost = resolvePropertyFromHost;
export const getBrandConfig = getPropertyConfig;
