# Terrapin Apartments Website

Single-site website for Terrapin Apartments (property 234), built with SvelteKit and deployed on Cloudflare Pages.

- Pure JavaScript SvelteKit (no TypeScript)
- Static content frozen from Maynard CMS
- Theming via CSS tokens
- Tailwind CSS with shadcn-style components
- SEO endpoints: `sitemap.xml`, `robots.txt`
- Cloudflare Pages deployment

## Run

```bash
pnpm install
pnpm dev
```

Visit: http://localhost:5173

## Build & Deploy

```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Deploy to Cloudflare Pages
pnpm deploy
```

## Project Structure

- `src/lib/data/` - Frozen CMS data (site.json, compiled-theme.json)
- `src/routes/` - SvelteKit routes
- `src/lib/components/` - Reusable components
- `wrangler.toml` - Cloudflare Pages configuration

## Content Management

Content is frozen from Maynard CMS (property 234). To update content:

1. Fetch fresh data: `curl https://maynardapp.azurewebsites.net/api/public/nursery/properties/234 | jq . > src/lib/data/site.json`
2. Fetch compiled theme: `curl https://maynardapp.azurewebsites.net/api/public/nursery/sites/{siteId}/theme/compiled | jq . > src/lib/data/compiled-theme.json`
3. Commit changes

## Development

- **Framework**: SvelteKit with Svelte 5
- **Styling**: Tailwind CSS
- **Node Version**: 20.9.0
- **Package Manager**: pnpm 9.x
