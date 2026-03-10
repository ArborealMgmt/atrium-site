# Claude Code Project Info

## Package Manager

This project uses **pnpm** (not npm). Always use `pnpm` commands:

- `pnpm install` to install dependencies
- `pnpm run dev` to start development server
- `pnpm run build` to build the project
- `pnpm run preview` to preview the build locally
- `pnpm run deploy` to deploy to Cloudflare Pages

## Project Details

- **Framework**: SvelteKit with Svelte 5
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages
- **Node Version**: 20.9.0
- **pnpm Version**: 9.x

## Development Scripts

- `pnpm run dev` - Start development server (http://localhost:5173)
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build locally using Wrangler
- `pnpm run deploy` - Build and deploy to Cloudflare Pages
- `pnpm run lint` - Run ESLint on all files
- `pnpm run lint:fix` - Run ESLint and auto-fix issues
- `pnpm run format` - Format all files with Prettier
- `pnpm run format:check` - Check if files are formatted correctly

## Local Development

- **Development**: http://localhost:5173 (default Vite port)

## Pre-commit Hooks

This project uses **Husky** with **lint-staged** to automatically:

- Run ESLint with auto-fix on staged `.js`, `.ts`, and `.svelte` files
- Run Prettier on all staged files
- Ensure code quality before commits

The pre-commit hook will automatically run when you commit changes.

## Coding Standards

### Import Paths

**Always use absolute paths for imports, never relative paths:**

- ✅ Good: `import { logger } from '$lib/logger.js'`
- ❌ Bad: `import { logger } from './logger.js'`
- ✅ Good: `import { Component } from '$lib/components/Component.svelte'`
- ❌ Bad: `import { Component } from '../components/Component.svelte'`

Use SvelteKit's built-in aliases:

- `$lib/` - for src/lib
- `$config/` - for src/config
- `$app/` - for SvelteKit app modules

### Logging

- Follow `doc/standards/logger.md` for end-to-end logging guidelines.
- Use `$lib/logger.server.js` on the server (never `console.*`).
- Populate `detailedMessage` with structured metadata; the helper handles stringification.

## Content Data

Content is frozen in `src/lib/data/site.json` and `src/lib/data/compiled-theme.json`. These files contain the complete CMS payload for Terrapin Apartments (property 234) and are loaded statically at build time.
