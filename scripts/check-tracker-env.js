#!/usr/bin/env node

/**
 * Check if marketing tracker environment variables are set
 *
 * Usage: node scripts/check-tracker-env.js
 */

import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Check for .env file
const envPath = join(projectRoot, '.env');
const envLocalPath = join(projectRoot, '.env.local');

console.log('🔍 Checking marketing tracker environment variables...\n');

const requiredVars = [
  'PUBLIC_PLAUSIBLE_PROJECT_ID',
  'PUBLIC_CLARITY_PROJECT_ID',
  'PUBLIC_GOOGLE_ADS_ID',
  'PUBLIC_META_PIXEL_ID',
];

let envContent = '';

// Try to read .env.local first (usually gitignored, takes precedence)
if (existsSync(envLocalPath)) {
  console.log('📄 Reading .env.local...');
  envContent = readFileSync(envLocalPath, 'utf-8');
} else if (existsSync(envPath)) {
  console.log('📄 Reading .env...');
  envContent = readFileSync(envPath, 'utf-8');
} else {
  console.log('❌ No .env or .env.local file found!\n');
  console.log('💡 Create a .env file in the project root with:');
  requiredVars.forEach(varName => {
    console.log(`   ${varName}=your-id-here`);
  });
  process.exit(1);
}

// Parse env file (simple parsing, doesn't handle all edge cases)
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log('\n📊 Environment Variable Status:\n');

let allSet = true;
requiredVars.forEach(varName => {
  const value = envVars[varName];
  const isSet = value && value.length > 0 && value !== 'your-id-here';

  if (isSet) {
    // Mask the value for security
    const masked =
      value.length > 8 ? value.substring(0, 4) + '...' + value.substring(value.length - 4) : '***';
    console.log(`✅ ${varName}: ${masked}`);
  } else {
    console.log(`❌ ${varName}: Not set`);
    allSet = false;
  }
});

console.log('');

if (allSet) {
  console.log('✅ All marketing tracker environment variables are set!\n');
  console.log("💡 If trackers still don't work:");
  console.log('   1. Restart your dev server');
  console.log('   2. Check browser console for errors');
  console.log('   3. Verify IDs are correct in tracker dashboards');
  console.log('   4. Check Network tab for script loading');
} else {
  console.log('⚠️  Some environment variables are missing!\n');
  console.log('💡 To fix:');
  console.log('   1. Get your tracker IDs from:');
  console.log('      - Plausible: https://plausible.io/ → Your site → Settings');
  console.log('      - Clarity: https://clarity.microsoft.com/ → Your project → Setup');
  console.log('      - Google Ads: https://ads.google.com/ → Tools → Conversions');
  console.log('      - Meta Pixel: https://business.facebook.com/events_manager');
  console.log('   2. Add them to your .env file:');
  requiredVars.forEach(varName => {
    if (!envVars[varName] || envVars[varName] === 'your-id-here') {
      console.log(`      ${varName}=your-actual-id`);
    }
  });
  console.log('   3. Restart your dev server');
}

// Also check for common issues
console.log('\n🔍 Additional Checks:\n');

// Check if .env is gitignored
const gitignorePath = join(projectRoot, '.gitignore');
if (existsSync(gitignorePath)) {
  const gitignore = readFileSync(gitignorePath, 'utf-8');
  if (gitignore.includes('.env') && !gitignore.includes('.env.local')) {
    console.log('✅ .env is in .gitignore (good for security)');
  }
}

// Check for .env.example
const envExamplePath = join(projectRoot, '.env.example');
if (existsSync(envExamplePath)) {
  console.log('✅ .env.example found (good practice)');
} else {
  console.log('💡 Consider creating .env.example with placeholder values');
}

console.log('');
