#!/usr/bin/env node
/**
 * Rebuild brands.js from Maynard API
 *
 * Fetches all properties with sites (both published and unpublished) from the Maynard API
 * and automatically rebuilds src/lib/brands.js with the current configuration.
 *
 * Usage:
 *   # Preview changes without modifying the file
 *   node scripts/local-dev-setup/rebuild-brands-from-api.js --dry-run
 *
 *   # Rebuild brands.js, preserving existing DEFAULT config
 *   node scripts/local-dev-setup/rebuild-brands-from-api.js
 *
 *   # Cleanup mode: Remove all entries not in API, rebuild from scratch
 *   node scripts/local-dev-setup/rebuild-brands-from-api.js --cleanup
 *
 *   # Use a different API URL
 *   node scripts/local-dev-setup/rebuild-brands-from-api.js --api-url https://staging-api.example.com
 *
 *   # Combine options
 *   node scripts/local-dev-setup/rebuild-brands-from-api.js --cleanup --dry-run
 *
 * Options:
 *   --dry-run, -d              Show what would be done without making changes
 *   --cleanup, --clean, -c    Cleanup mode: Delete all existing entries and rebuild
 *                             from scratch using only API data
 *   --api-url, -u <url>       Override API base URL
 *   --help, -h                Show help message
 *
 * Environment Variables:
 *   MAYNARD_API_BASE_URL       API base URL (default: https://maynardapp.azurewebsites.net)
 *
 * Behavior:
 *   - Fetches all properties with sites from /api/nursery/dashboard endpoint
 *   - Generates local domains (xxx.local:4370, xxx.local:4373) for local testing
 *   - Includes both published and unpublished sites
 *   - Properties without domains get placeholder domains (propertyname-temp.local)
 *   - Adds published: true/false flag to each property
 *   - Preserves DEFAULT configuration (unless in cleanup mode)
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../..'); // Go up two levels: local-dev-setup -> scripts -> root

// Get API base URL from environment or use default
const MAYNARD_API_BASE_URL =
  process.env.MAYNARD_API_BASE_URL || 'https://maynardapp.azurewebsites.net';

const DEV_PORT = '4370';
const PROD_PORT = '4373';

/**
 * Fetch all properties with sites from the Maynard API
 */
async function fetchAllSites(apiBaseUrl = MAYNARD_API_BASE_URL) {
  const sites = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  console.log(`📡 Fetching sites from ${apiBaseUrl}...\n`);

  while (hasMore) {
    try {
      const url = `${apiBaseUrl}/api/nursery/dashboard?limit=${limit}&offset=${offset}&includePropertiesWithoutSites=false`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Filter to only properties with sites (include those without domains yet)
      const propertiesWithSites = data.properties.filter(p => p.site !== null);

      sites.push(...propertiesWithSites);
      console.log(
        `  Fetched ${propertiesWithSites.length} properties (offset: ${offset}, total so far: ${sites.length})`
      );

      hasMore = data.properties.length === limit;
      offset += limit;
    } catch (error) {
      console.error(`\n❌ Error fetching sites: ${error.message}`);
      throw error;
    }
  }

  console.log(`\n✅ Found ${sites.length} properties with sites\n`);
  return sites;
}

/**
 * Generate local domain from production domain
 * Examples:
 *   www.example.com -> example.local
 *   example.com -> example.local
 *   sitea.agustinv.com -> sitea.local
 *   celeste-seattle.com -> celeste.local (takes first part before dash)
 *   www.helen-seattle.com -> helen.local
 */
function generateLocalDomain(domain) {
  // Remove protocol if present
  domain = domain.replace(/^https?:\/\//, '');

  // Remove www. prefix
  domain = domain.replace(/^www\./, '');

  // Get the first part before the first dot
  const parts = domain.split('.');
  const firstPart = parts[0];

  // If the first part contains a dash, take only the part before the dash
  // e.g., "celeste-seattle" -> "celeste"
  const localName = firstPart.split('-')[0];

  return `${localName}.local`;
}

/**
 * Generate placeholder domain from property name or ID
 * Used when a property has a site but no domain yet
 * Format: {propertyname}-temp.local (e.g., "Alcove First Hill" -> "alcovefirsthill-temp.local")
 */
function generatePlaceholderDomain(property) {
  const propertyName = property.propertyName || `property${property.propertyId}`;

  // Convert property name to a valid domain-like string
  // Remove special characters, convert to lowercase, remove spaces
  let placeholder = propertyName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars (keep spaces for now)
    .replace(/\s+/g, '') // Remove all spaces
    .replace(/-+/g, ''); // Remove hyphens

  // If empty or too short, use property ID
  if (!placeholder || placeholder.length < 3) {
    placeholder = `property${property.propertyId}`;
  }

  // Append -temp suffix
  return `${placeholder}-temp.local`;
}

/**
 * Normalize domain - remove protocol, trailing slashes, etc.
 */
function normalizeDomain(domain) {
  if (!domain) return null;

  domain = domain.trim();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.replace(/\/$/, '');

  return domain || null;
}

/**
 * Generate domains array for a property
 */
function generateDomains(productionDomain) {
  const normalizedDomain = normalizeDomain(productionDomain);
  if (!normalizedDomain) {
    return [];
  }

  const localDomain = generateLocalDomain(normalizedDomain);
  const domains = [
    `${localDomain}:${DEV_PORT}`, // dev port
    `${localDomain}:${PROD_PORT}`, // prod port
    normalizedDomain, // production
  ];

  // If domain doesn't start with www, also add www version
  if (!normalizedDomain.startsWith('www.')) {
    domains.push(`www.${normalizedDomain}`); // production with www
  }

  return domains;
}

/**
 * Generate property name comment from property data
 */
function getPropertyComment(property) {
  return property.propertyName || `Property ${property.propertyId}`;
}

/**
 * Rebuild brands.js file from fetched sites
 * @param {Array} sites - Array of site objects from API
 * @param {boolean} cleanup - If true, ignore existing file and rebuild from scratch
 */
function rebuildBrandsJs(sites, cleanup = false) {
  const brandsPath = join(ROOT_DIR, 'src/lib/brands.js');

  let defaultConfig = `  DEFAULT: {
    domains: ['localhost:4370', 'localhost:4373', '127.0.0.1:4370', '127.0.0.1:4373'],
    propertyId: 157, // Default to Celeste
  }`;

  // Only try to preserve DEFAULT config from existing file if not in cleanup mode
  if (!cleanup) {
    let existingContent = '';
    try {
      existingContent = readFileSync(brandsPath, 'utf-8');

      // Extract DEFAULT config if it exists
      const defaultMatch = existingContent.match(/(\s+DEFAULT:\s*\{[\s\S]*?\}),?\s*\}\);/);
      if (defaultMatch) {
        defaultConfig = defaultMatch[1];
      }
    } catch {
      // File doesn't exist, use default template
      console.warn('⚠️  Could not read existing brands.js, will create new file');
    }
  } else {
    console.log('🧹 Cleanup mode: Ignoring existing brands.js, rebuilding from scratch');
  }

  // Sort sites by property ID for consistent output
  sites.sort((a, b) => a.propertyId - b.propertyId);

  // Generate property config entries
  const propertyEntries = sites
    .map(property => {
      const domain = normalizeDomain(property.site.domain);
      const comment = getPropertyComment(property);

      let domains;
      let hasPlaceholderDomain = false;

      if (!domain) {
        // Property has a site but no domain yet - generate placeholder
        const placeholderLocal = generatePlaceholderDomain(property);
        domains = [
          `${placeholderLocal}:${DEV_PORT}`, // dev port
          `${placeholderLocal}:${PROD_PORT}`, // prod port
        ];
        hasPlaceholderDomain = true;
        console.warn(
          `⚠️  Property ${property.propertyId} (${property.propertyName}) has no domain - using placeholder: ${placeholderLocal}`
        );
      } else {
        domains = generateDomains(domain);
      }

      const placeholderComment = hasPlaceholderDomain
        ? ' // TODO: Add production domain when available'
        : '';

      return `  ${property.propertyId}: {
    // ${comment}${placeholderComment}
    domains: [
${domains.map(d => `      '${d}',`).join('\n')}
    ],
    propertyId: ${property.propertyId},
  },`;
    })
    .filter(Boolean); // Remove null entries

  // Generate the new file content
  const newContent = `// Property configurations - using property IDs directly as keys
// Auto-generated by scripts/rebuild-brands-from-api.js
// Last updated: ${new Date().toISOString()}
export const PROPERTY_CONFIG = Object.freeze({
${propertyEntries.join('\n')}
${defaultConfig}
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
`;

  return newContent;
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    apiUrl: null,
    cleanup: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dry-run' || arg === '-d') {
      options.dryRun = true;
    } else if (arg === '--cleanup' || arg === '--clean' || arg === '-c') {
      options.cleanup = true;
    } else if (arg === '--api-url' || arg === '-u') {
      options.apiUrl = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Rebuild brands.js from Maynard API

Usage:
  node scripts/local-dev-setup/rebuild-brands-from-api.js [options]

Options:
  --dry-run, -d              Show what would be done without making changes
  --cleanup, --clean, -c     Cleanup mode: Delete all existing entries and rebuild
                             from scratch using only API data
  --api-url, -u <url>        Override API base URL (default: ${MAYNARD_API_BASE_URL})
  --help, -h                 Show this help message

Environment Variables:
  MAYNARD_API_BASE_URL       API base URL (default: ${MAYNARD_API_BASE_URL})

Examples:
  # Preview changes
  node scripts/local-dev-setup/rebuild-brands-from-api.js --dry-run

  # Rebuild, preserving existing DEFAULT config
  node scripts/local-dev-setup/rebuild-brands-from-api.js

  # Cleanup: Remove all entries not in API, rebuild from scratch
  node scripts/local-dev-setup/rebuild-brands-from-api.js --cleanup
`);
      process.exit(0);
    }
  }

  return options;
}

/**
 * Main function
 */
async function main() {
  const options = parseArgs();
  const apiBaseUrl = options.apiUrl || MAYNARD_API_BASE_URL;

  console.log('🔄 Rebuilding brands.js from Maynard API\n');
  console.log(`API Base URL: ${apiBaseUrl}\n`);

  if (options.dryRun) {
    console.log('[DRY RUN MODE - No files will be modified]\n');
  }

  if (options.cleanup) {
    console.log('[CLEANUP MODE - Will remove all entries not in API]\n');
  }

  try {
    // Fetch all sites
    const sites = await fetchAllSites(apiBaseUrl);

    if (sites.length === 0) {
      console.log('⚠️  No sites found. brands.js will not be updated.');
      process.exit(0);
    }

    // Display summary
    console.log('📋 Sites found:');
    sites.forEach(property => {
      const domain = normalizeDomain(property.site.domain);
      const status = property.site.isPublished ? '✅ published' : '⏳ unpublished';
      console.log(
        `  ${property.propertyId}: ${property.propertyName || 'Unknown'} - ${domain || 'No domain'} (${status})`
      );
    });

    // Rebuild brands.js
    console.log('\n📝 Rebuilding brands.js...');
    const newContent = rebuildBrandsJs(sites, options.cleanup);

    if (options.dryRun) {
      console.log('\n[DRY RUN] Generated content preview:');
      console.log('─'.repeat(80));
      console.log(newContent.substring(0, 1000));
      if (newContent.length > 1000) {
        console.log(`\n... (${newContent.length - 1000} more characters)`);
      }
      console.log('─'.repeat(80));
      console.log('\n[DRY RUN] File would be written to: src/lib/brands.js');
    } else {
      const brandsPath = join(ROOT_DIR, 'src/lib/brands.js');
      writeFileSync(brandsPath, newContent, 'utf-8');
      console.log(`\n✅ Successfully rebuilt brands.js`);
      console.log(`   File: ${brandsPath}`);
      console.log(`   Properties: ${sites.length}`);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the script
main();
