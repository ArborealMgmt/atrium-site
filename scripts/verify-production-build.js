#!/usr/bin/env node

/**
 * Verify that marketing tracker scripts are included in the production build
 *
 * This script checks the built HTML files to see if tracker script tags are present.
 * Useful for debugging why trackers aren't working in production.
 *
 * Usage: node scripts/verify-production-build.js
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const buildDir = join(projectRoot, 'build', 'static');

console.log('🔍 Verifying marketing tracker scripts in production build...\n');

// Check if build directory exists
if (!existsSync(buildDir)) {
  console.log('❌ Build directory not found:', buildDir);
  console.log('💡 Run `pnpm build` first to create the build');
  process.exit(1);
}

// Find all HTML files in the build
function findHtmlFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const htmlFiles = findHtmlFiles(buildDir);

if (htmlFiles.length === 0) {
  console.log('❌ No HTML files found in build directory');
  process.exit(1);
}

console.log(`📄 Found ${htmlFiles.length} HTML file(s) to check\n`);

// Trackers to check
const trackers = {
  plausible: {
    name: 'Plausible',
    patterns: ['plausible.io'],
    found: false,
    files: [],
  },
  clarity: {
    name: 'Microsoft Clarity',
    patterns: ['clarity.ms'],
    found: false,
    files: [],
  },
  googleAds: {
    name: 'Google Ads',
    patterns: ['googletagmanager.com', 'google-analytics.com'],
    found: false,
    files: [],
  },
  metaPixel: {
    name: 'Meta Pixel',
    patterns: ['facebook.net', 'facebook.com'],
    found: false,
    files: [],
  },
};

// Check each HTML file
htmlFiles.forEach(filePath => {
  const content = readFileSync(filePath, 'utf-8');
  const relativePath = filePath.replace(buildDir, '').replace(/^\//, '') || 'index.html';

  Object.keys(trackers).forEach(key => {
    const tracker = trackers[key];
    const hasTracker = tracker.patterns.some(pattern => content.includes(pattern));

    if (hasTracker) {
      tracker.found = true;
      if (!tracker.files.includes(relativePath)) {
        tracker.files.push(relativePath);
      }
    }
  });
});

// Report results
console.log('=== Tracker Script Verification ===\n');

let allFound = true;
Object.keys(trackers).forEach(key => {
  const tracker = trackers[key];
  if (tracker.found) {
    console.log(`✅ ${tracker.name}: Found in ${tracker.files.length} file(s)`);
    if (tracker.files.length <= 3) {
      tracker.files.forEach(file => console.log(`   - ${file}`));
    } else {
      tracker.files.slice(0, 3).forEach(file => console.log(`   - ${file}`));
      console.log(`   ... and ${tracker.files.length - 3} more`);
    }
  } else {
    console.log(`❌ ${tracker.name}: NOT FOUND`);
    allFound = false;
  }
  console.log('');
});

// Summary
if (allFound) {
  console.log('✅ All marketing tracker scripts are present in the build!\n');
  console.log("💡 If trackers still don't work in production:");
  console.log('   1. Check that GitHub Secrets are set correctly');
  console.log('   2. Verify the deployment used these build files');
  console.log('   3. Check browser console for errors');
  console.log('   4. Check Network tab for script loading');
} else {
  console.log('⚠️  Some tracker scripts are missing from the build!\n');
  console.log('🔧 This means environment variables were not available during build.\n');
  console.log('To fix:');
  console.log('1. Check GitHub Secrets are set:');
  Object.keys(trackers).forEach(key => {
    const tracker = trackers[key];
    if (!tracker.found) {
      const varName = {
        plausible: 'PUBLIC_PLAUSIBLE_PROJECT_ID',
        clarity: 'PUBLIC_CLARITY_PROJECT_ID',
        googleAds: 'PUBLIC_GOOGLE_ADS_ID',
        metaPixel: 'PUBLIC_META_PIXEL_ID',
      }[key];
      console.log(`   - ${varName}`);
    }
  });
  console.log('2. Go to GitHub → Settings → Secrets and variables → Actions');
  console.log('3. Add the missing secrets');
  console.log('4. Redeploy the application');
  console.log('\nSee: doc/marketing/PRODUCTION_SETUP.md for detailed instructions');
}

console.log('');
