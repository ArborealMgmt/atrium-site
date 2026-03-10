import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getPropertyConfig, PROPERTY_CONFIG, resolvePropertyFromHost } from '../src/lib/brands.js';

test('resolvePropertyFromHost matches known domain and defaults unknown', () => {
  // Find any property with a domain (not DEFAULT)
  const propertyId = Object.keys(PROPERTY_CONFIG).find(
    key => key !== 'DEFAULT' && PROPERTY_CONFIG[key]?.domains?.length > 0
  );

  if (!propertyId) {
    throw new Error('No properties found in PROPERTY_CONFIG to test with');
  }

  const property = PROPERTY_CONFIG[propertyId];
  const testDomain = property.domains[0]; // Use first domain from the property

  // Test that resolvePropertyFromHost correctly resolves a known domain
  const resolvedId = resolvePropertyFromHost(testDomain);
  assert.equal(
    resolvedId,
    propertyId,
    `Domain ${testDomain} should resolve to property ${propertyId}`
  );

  // Test that unknown domains default to 'DEFAULT'
  assert.equal(resolvePropertyFromHost('unknown.example.com'), 'DEFAULT');
  assert.equal(resolvePropertyFromHost('not-in-config.local'), 'DEFAULT');
});

test('getPropertyConfig returns config with fallback', () => {
  // Find any property (not DEFAULT) to test with
  const propertyId = Object.keys(PROPERTY_CONFIG).find(
    key => key !== 'DEFAULT' && PROPERTY_CONFIG[key]?.propertyId
  );

  if (!propertyId) {
    throw new Error('No properties found in PROPERTY_CONFIG to test with');
  }

  const expectedProperty = PROPERTY_CONFIG[propertyId];

  // Test that getPropertyConfig returns the correct config for an existing property
  const propertyConfig = getPropertyConfig(propertyId);
  assert.equal(propertyConfig.propertyId, expectedProperty.propertyId);
  assert.ok(Array.isArray(propertyConfig.domains));
  assert.ok(propertyConfig.domains.length > 0);

  // Test that getPropertyConfig falls back to DEFAULT for non-existent properties
  const fallback = getPropertyConfig('does-not-exist-99999');
  assert.equal(fallback, PROPERTY_CONFIG['DEFAULT']);
  assert.equal(fallback.propertyId, PROPERTY_CONFIG['DEFAULT'].propertyId);
});
