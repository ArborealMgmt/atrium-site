#!/usr/bin/env node

const userAgent = process.env.npm_config_user_agent || '';

if (!userAgent.startsWith('pnpm/')) {
  console.error('🚫 This project requires pnpm. Use "pnpm install" and "pnpm dev" instead of npm.');
  process.exit(1);
}
