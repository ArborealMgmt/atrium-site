#!/usr/bin/env node
/**
 * Update /etc/hosts with .local domains from brands.js
 *
 * This script:
 * - Extracts all .local domains from src/lib/brands.js
 * - Adds missing .local entries to /etc/hosts
 * - Removes .local entries that are no longer in brands.js
 * - Preserves all other /etc/hosts entries
 *
 * Usage:
 *   # Mac/Linux: Preview changes without modifying hosts file
 *   sudo node scripts/local-dev-setup/update-hosts-file.js --dry-run
 *
 *   # Mac/Linux: Update hosts file (requires sudo)
 *   sudo node scripts/local-dev-setup/update-hosts-file.js
 *
 *   # Windows: Preview changes (run as Administrator for actual update)
 *   node scripts/local-dev-setup/update-hosts-file.js --dry-run
 *
 *   # Windows: Update hosts file (run PowerShell/CMD as Administrator)
 *   node scripts/local-dev-setup/update-hosts-file.js
 *
 * Options:
 *   --dry-run, -d    Show what would be done without making changes
 *   --help, -h       Show help message
 *
 * Note:
 *   - Mac/Linux: Requires sudo privileges
 *   - Windows: Requires Administrator privileges (run PowerShell/CMD as Admin)
 */

import { readFileSync, writeFileSync } from 'fs';
import { platform } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../..');

// Determine hosts file path based on OS
const IS_WINDOWS = platform() === 'win32';
const HOSTS_FILE = IS_WINDOWS ? 'C:\\Windows\\System32\\drivers\\etc\\hosts' : '/etc/hosts';
const HOSTS_IP = '127.0.0.1';

/**
 * Extract all .local domains from brands.js
 */
function extractLocalDomains() {
  const brandsPath = join(ROOT_DIR, 'src/lib/brands.js');
  const content = readFileSync(brandsPath, 'utf-8');

  // Match domains that end with .local (with optional port)
  // Pattern matches: 'domain.local', 'domain.local:4370', etc.
  const domainRegex = /'([^']+\.local)(?::\d+)?'/g;
  const domains = new Set();
  let match;

  while ((match = domainRegex.exec(content)) !== null) {
    // Extract just the domain name without port
    const domain = match[1];
    domains.add(domain);
  }

  return Array.from(domains).sort();
}

/**
 * Parse /etc/hosts file
 * Returns: { header: string, entries: Array<{ip, hosts, line}>, footer: string }
 */
function parseHostsFile(content) {
  const lines = content.split('\n');
  const header = [];
  const entries = [];
  const footer = [];
  let inHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines and comments in header
    if (trimmed === '' || trimmed.startsWith('#')) {
      if (inHeader) {
        header.push(line);
      } else {
        footer.push(line);
      }
      continue;
    }

    // Parse host entry: IP address followed by hostnames
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      const ip = parts[0];
      const hosts = parts.slice(1);
      entries.push({ ip, hosts, line, index: i });
      inHeader = false;
    } else {
      if (inHeader) {
        header.push(line);
      } else {
        footer.push(line);
      }
    }
  }

  return { header, entries, footer };
}

/**
 * Rebuild /etc/hosts content
 */
function rebuildHostsFile(parsed, localDomains) {
  const lines = [];

  // Add header
  lines.push(...parsed.header);

  // Add local domains entry (one per line for readability)
  if (localDomains.length > 0) {
    // Add a comment for our section
    lines.push('');
    lines.push('# Nursery app local development domains');
    for (const domain of localDomains) {
      lines.push(`${HOSTS_IP}       ${domain}`);
    }
    lines.push('');
  }

  // Add other entries (non-.local domains)
  for (const entry of parsed.entries) {
    // Filter out .local domains from existing entries
    const nonLocalHosts = entry.hosts.filter(h => !h.endsWith('.local'));
    if (nonLocalHosts.length > 0) {
      lines.push(`${entry.ip}       ${nonLocalHosts.join(' ')}`);
    }
  }

  // Add footer
  lines.push(...parsed.footer);

  return (
    lines.join('\n') + (lines.length > 0 && !lines[lines.length - 1].endsWith('\n') ? '\n' : '')
  );
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dry-run' || arg === '-d') {
      options.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Update /etc/hosts with .local domains from brands.js

Usage:
  # Mac/Linux (requires sudo):
  sudo node scripts/local-dev-setup/update-hosts-file.js [options]
  
  # Windows (run PowerShell/CMD as Administrator):
  node scripts/local-dev-setup/update-hosts-file.js [options]

Options:
  --dry-run, -d    Show what would be done without making changes
  --help, -h       Show this help message

Note: 
  - Mac/Linux: Requires sudo privileges
  - Windows: Requires Administrator privileges
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

  console.log('🔧 Updating /etc/hosts with .local domains from brands.js\n');

  if (options.dryRun) {
    console.log('[DRY RUN MODE - No files will be modified]\n');
  }

  try {
    // Extract .local domains from brands.js
    console.log('📖 Reading brands.js...');
    const localDomains = extractLocalDomains();
    console.log(`   Found ${localDomains.length} .local domains:`);
    localDomains.forEach(domain => {
      console.log(`     - ${domain}`);
    });

    // Read current hosts file
    const hostsFileName = IS_WINDOWS ? 'C:\\Windows\\System32\\drivers\\etc\\hosts' : '/etc/hosts';
    console.log(`\n📖 Reading ${hostsFileName}...`);
    const hostsContent = readFileSync(HOSTS_FILE, 'utf-8');
    const parsed = parseHostsFile(hostsContent);

    // Find existing .local entries
    const existingLocalDomains = new Set();
    for (const entry of parsed.entries) {
      for (const host of entry.hosts) {
        if (host.endsWith('.local')) {
          existingLocalDomains.add(host);
        }
      }
    }

    console.log(`   Found ${existingLocalDomains.size} existing .local entries`);

    // Determine what needs to be added/removed
    const domainsToAdd = localDomains.filter(d => !existingLocalDomains.has(d));
    const domainsToRemove = Array.from(existingLocalDomains).filter(d => !localDomains.includes(d));

    if (domainsToAdd.length === 0 && domainsToRemove.length === 0) {
      console.log('\n✅ /etc/hosts is already up to date!');
      return;
    }

    if (domainsToAdd.length > 0) {
      console.log(`\n➕ Will add ${domainsToAdd.length} .local domain(s):`);
      domainsToAdd.forEach(domain => {
        console.log(`     + ${domain}`);
      });
    }

    if (domainsToRemove.length > 0) {
      console.log(`\n➖ Will remove ${domainsToRemove.length} .local domain(s):`);
      domainsToRemove.forEach(domain => {
        console.log(`     - ${domain}`);
      });
    }

    // Rebuild hosts file
    console.log('\n📝 Rebuilding /etc/hosts...');
    const newContent = rebuildHostsFile(parsed, localDomains);

    if (options.dryRun) {
      console.log(`\n[DRY RUN] New ${hostsFileName} content:`);
      console.log('─'.repeat(80));
      console.log(newContent);
      console.log('─'.repeat(80));
      console.log(`\n[DRY RUN] File would be written to: ${hostsFileName}`);
    } else {
      // Check if we have write permissions (requires sudo)
      try {
        writeFileSync(HOSTS_FILE, newContent, 'utf-8');
        console.log(`\n✅ Successfully updated ${hostsFileName}`);
        console.log(`   Added: ${domainsToAdd.length} domain(s)`);
        console.log(`   Removed: ${domainsToRemove.length} domain(s)`);
      } catch (error) {
        if (error.code === 'EACCES' || error.code === 'EPERM') {
          console.error('\n❌ Permission denied. This script requires elevated privileges.');
          if (IS_WINDOWS) {
            console.error('   Please run PowerShell or CMD as Administrator, then:');
            console.error('   node scripts/local-dev-setup/update-hosts-file.js');
          } else {
            console.error('   Please run: sudo node scripts/local-dev-setup/update-hosts-file.js');
          }
        } else {
          throw error;
        }
        process.exit(1);
      }
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
