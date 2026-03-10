# Frontend Theme Usage Guide - Nursery Microsites

**Created:** December 2024
**Target:** Frontend developers and AI agents working in the nursery microsite system
**Scope:** How to fetch, apply, and work with themes in Svelte components

---

## Overview

The nursery microsite system uses a **base theme + per-site overrides** model. Each property site can have:
1. A **base theme** assigned (from a library of reusable themes)
2. **CSS variable overrides** that customize the base theme for that specific site

Themes are compiled server-side and returned as CSS variable objects that you apply to your components.

---

## Theme System Architecture

### Three-Layer System

1. **Base Theme** (`NurseryTheme`): Reusable theme template with default CSS variables
2. **Site Assignment**: A site has a `themeId` that references a base theme
3. **Site Overrides** (`PropertyThemeOverride`): Site-specific CSS variable overrides stored in `tokensJson`

### Compilation Process

When you request a compiled theme for a site, the backend:
1. Loads the base theme's CSS variables
2. Merges any additional tokens from the theme's `tokensJson`
3. Applies site-specific overrides (overrides take precedence)
4. Returns the final compiled CSS variable object

---

## Available Queries & APIs

### TanStack Query Hooks (Recommended)

All theme-related data fetching should use TanStack Query hooks from `$lib/queries/nursery.js`:

```javascript
import {
  useThemes,              // List all available themes
  useTheme,                // Get a specific theme by ID
  useDefaultTheme,         // Get the default theme
  useCompiledTheme,        // Get compiled theme for a site (base + overrides)
  useThemeOverrides,       // Get only the overrides for a site
} from '$lib/queries/nursery.js';
```

### Query Hook Details

#### `useThemes(options?)`
Returns all available themes.

```javascript
const themesQuery = useThemes();
// $themesQuery.data: Array<Theme>
// $themesQuery.isLoading: boolean
// $themesQuery.isError: boolean
```

#### `useTheme(themeIdGetter)`
Get a specific theme by ID. Use a getter function for reactivity.

```javascript
const themeId = $derived($siteQuery.data?.themeId);
const themeQuery = useTheme(() => $themeId);
// $themeQuery.data: Theme | null
```

#### `useDefaultTheme()`
Get the default theme (baseTheme = 'default').

```javascript
const defaultThemeQuery = useDefaultTheme();
// $defaultThemeQuery.data: Theme | null
```

#### `useCompiledTheme(siteId, enabled?)`
**Most important hook for applying themes.** Returns the compiled theme (base + overrides) for a site.

```javascript
const compiledThemeQuery = useCompiledTheme(siteId, true);
// $compiledThemeQuery.data.compiledTokens: Record<string, string>
// $compiledThemeQuery.data.baseTheme: Theme
// $compiledThemeQuery.data.overrides: PropertyThemeOverride | null
```

**Important:** Only enable this query when a theme is actually selected:

```javascript
const hasTheme = $derived($siteQuery.data?.themeId !== null);
const compiledThemeQuery = useCompiledTheme(siteId, () => $hasTheme);
```

#### `useThemeOverrides(siteId)`
Get only the override tokens for a site (not the compiled result).

```javascript
const overridesQuery = useThemeOverrides(siteId);
// $overridesQuery.data.tokensJson: Record<string, string>
```

---

## Theme Data Structure

### Theme Object

```typescript
interface Theme {
  id: number;
  name: string;                    // "Modern Light", "Dark Elegance"
  description: string | null;
  baseTheme: string;               // "default", "minimal", "luxe"
  primaryColor: string | null;     // "#2563eb"
  accentColor: string | null;      // "#3b82f6"
  backgroundColor: string | null;  // "#ffffff"
  textColor: string | null;        // "#1f2937"
  fontFamily: string | null;       // "Roboto, sans-serif"
  tokensJson: Record<string, string>; // Additional CSS variables
}
```

### Compiled Theme Response

```typescript
interface CompiledTheme {
  baseTheme: Theme;
  overrides: PropertyThemeOverride | null;
  compiledTokens: Record<string, string>;  // Final CSS variables to use
}
```

The `compiledTokens` object is what you apply to your components. Keys are CSS variable names (e.g., `--primary-color`), values are CSS-compatible strings.

---

## Applying Themes to Components

### Method 1: Apply to Root Element (Global Theme)

For microsite pages where the entire page should use the theme:

```svelte
<script>
  import { useCompiledTheme } from '$lib/queries/nursery.js';

  let { siteId } = $props();

  const compiledThemeQuery = useCompiledTheme(siteId, () => siteId !== null);

  // Get CSS variables as a style string
  const themeStyles = $derived.by(() => {
    const tokens = $compiledThemeQuery.data?.compiledTokens || {};
    return Object.entries(tokens)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  });
</script>

{#if $compiledThemeQuery.isLoading}
  <div>Loading theme...</div>
{:else if $compiledThemeQuery.data}
  <div style={themeStyles}>
    <!-- Your page content here -->
    <!-- All child elements will inherit CSS variables -->
  </div>
{:else}
  <div>No theme configured</div>
{/if}
```

### Method 2: Apply to `:root` (Using Svelte's `svelte:body`)

For applying theme globally to the entire document:

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { useCompiledTheme } from '$lib/queries/nursery.js';

  let { siteId } = $props();

  const compiledThemeQuery = useCompiledTheme(siteId);

  function applyThemeToDocument() {
    const tokens = $compiledThemeQuery.data?.compiledTokens;
    if (!tokens) return;

    const root = document.documentElement;
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  function removeThemeFromDocument() {
    const tokens = $compiledThemeQuery.data?.compiledTokens;
    if (!tokens) return;

    const root = document.documentElement;
    Object.keys(tokens).forEach((key) => {
      root.style.removeProperty(key);
    });
  }

  $effect(() => {
    if ($compiledThemeQuery.data) {
      applyThemeToDocument();
      return () => removeThemeFromDocument();
    }
  });
</script>

<!-- Your component content -->
```

### Method 3: Apply to Specific Container

For scoped theming within a component:

```svelte
<script>
  import { useCompiledTheme } from '$lib/queries/nursery.js';

  let { siteId } = $props();

  const compiledThemeQuery = useCompiledTheme(siteId);

  const containerStyle = $derived.by(() => {
    const tokens = $compiledThemeQuery.data?.compiledTokens || {};
    const styleProps = Object.entries(tokens)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
    return styleProps ? `style="${styleProps}"` : '';
  });
</script>

<div {containerStyle}>
  <h1>This heading uses --text-color</h1>
  <button class="bg-[var(--primary-color)]">Button uses --primary-color</button>
</div>
```

### Method 4: Using CSS Variables Directly in Tailwind

If using Tailwind CSS, you can reference CSS variables directly:

```svelte
<script>
  import { useCompiledTheme } from '$lib/queries/nursery.js';

  let { siteId } = $props();
  const compiledThemeQuery = useCompiledTheme(siteId);
</script>

{#if $compiledThemeQuery.data}
  <div style={/* apply CSS variables here */}>
    <!-- Use Tailwind arbitrary values with CSS variables -->
    <h1 class="text-[var(--text-color)]">Heading</h1>
    <button class="bg-[var(--primary-color)] text-white">Button</button>
    <div class="font-[var(--font-family)]">Custom font</div>
  </div>
{/if}
```

---

## Standard CSS Variables

All themes provide these standard CSS variables (if defined in the theme):

- `--primary-color`: Primary brand color
- `--accent-color`: Accent/highlight color (use this for link highlights, borders, etc.)
- `--background-color`: Background color
- `--text-color`: Primary text color
- `--font-family`: Font family stack

Additional variables may be defined in the theme's `tokensJson` field.

**Note:** The frontend maps `--custom-highlight` to `--accent-color` for backward compatibility with existing CMS customCss. For new code, use `--accent-color` directly. If you need a different highlight color, override `--accent-color` in your theme's `customCss` field.

---

## Complete Example: Themed Microsite Page

Here's a complete example of a microsite page component that uses themes:

```svelte
<script>
  import { useCompiledTheme, useNurserySite } from '$lib/queries/nursery.js';

  let { siteId } = $props();

  // Get site data
  const siteQuery = useNurserySite(siteId);

  // Only load compiled theme if site has a theme
  const hasTheme = $derived($siteQuery.data?.themeId !== null);
  const compiledThemeQuery = useCompiledTheme(siteId, () => $hasTheme);

  // Generate inline style string for CSS variables
  const themeStyles = $derived.by(() => {
    const tokens = $compiledThemeQuery.data?.compiledTokens || {};
    if (Object.keys(tokens).length === 0) return '';

    return Object.entries(tokens)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  });

  // Helper to get a specific CSS variable value
  function getThemeVar(name) {
    return $compiledThemeQuery.data?.compiledTokens?.[name] || null;
  }
</script>

{#if $siteQuery.isLoading || ($hasTheme && $compiledThemeQuery.isLoading)}
  <div class="flex items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
{:else if $siteQuery.data}
  <div {themeStyles} class="min-h-screen" style:background-color="var(--background-color)">
    <!-- Header -->
    <header class="bg-[var(--primary-color)] text-white p-4">
      <h1 class="text-2xl font-bold" style:font-family="var(--font-family)">
        {$siteQuery.data.property?.name || 'Property Site'}
      </h1>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <h2 class="text-xl mb-4" style:color="var(--text-color)">
        Welcome
      </h2>

      <!-- Use theme colors in Tailwind -->
      <button
        class="px-4 py-2 rounded bg-[var(--accent-color)] text-white hover:opacity-90 transition-opacity"
        style:font-family="var(--font-family)"
      >
        Contact Us
      </button>
    </main>
  </div>
{:else}
  <div class="text-center py-12">
    <p class="text-gray-600">Site not found</p>
  </div>
{/if}
```

---

## Best Practices

### 1. Always Check for Theme Existence

Don't assume a site has a theme. Always handle the "no theme" case:

```javascript
const hasTheme = $derived($siteQuery.data?.themeId !== null);
const compiledThemeQuery = useCompiledTheme(siteId, () => $hasTheme);

// Provide fallback styling
const fallbackStyles = {
  '--primary-color': '#2563eb',
  '--text-color': '#1f2937',
  // ... defaults
};
```

### 2. Use Conditional Query Enabling

Only enable the compiled theme query when a theme is actually selected:

```javascript
// ✅ GOOD - Only queries when theme exists
const hasTheme = $derived($siteQuery.data?.themeId !== null);
const compiledThemeQuery = useCompiledTheme(siteId, () => $hasTheme);

// ❌ BAD - Queries even when no theme
const compiledThemeQuery = useCompiledTheme(siteId, true);
```

### 3. Handle Loading States

Always show appropriate loading states while theme data is being fetched:

```svelte
{#if $compiledThemeQuery.isLoading}
  <div>Loading theme...</div>
{:else if $compiledThemeQuery.isError}
  <div>Error loading theme: {$compiledThemeQuery.error.message}</div>
{:else if $compiledThemeQuery.data}
  <!-- Render themed content -->
{/if}
```

### 4. Use CSS Variables, Not Direct Values

Apply CSS variables to DOM elements, then reference them in your CSS/Tailwind:

```svelte
<!-- ✅ GOOD - Apply variables, use in CSS -->
<div style={themeStyles}>
  <button class="bg-[var(--primary-color)]">Button</button>
</div>

<!-- ❌ BAD - Hardcoded values -->
<button style="background-color: #2563eb">Button</button>
```

### 5. Provide Fallbacks

When using CSS variables in Tailwind, provide fallback values:

```html
<!-- With fallback -->
<div class="bg-[var(--primary-color,#2563eb)]">Content</div>

<!-- Or use CSS -->
<style>
  .themed-button {
    background-color: var(--primary-color, #2563eb);
  }
</style>
```

### 6. Avoid Direct API Calls

Always use TanStack Query hooks instead of direct API calls:

```javascript
// ✅ GOOD
import { useCompiledTheme } from '$lib/queries/nursery.js';
const query = useCompiledTheme(siteId);

// ❌ BAD
import { fetchCompiledTheme } from '$lib/api/nursery.js';
const theme = await fetchCompiledTheme(siteId);
```

---

## Theme Management (Admin UI)

For managing themes (editing, creating, assigning), see the existing `ThemeEditor` component:

- **Location:** `frontend/src/lib/components/nursery/ThemeEditor.svelte`
- **Features:** Theme selection, CSS variable override editing
- **Pattern:** Follows the same pattern as `CopyEditor` and `PhotosManager`

The `ThemeEditor` component demonstrates:
- Loading themes and compiled themes
- Editing CSS variable overrides
- Saving overrides using mutations
- Handling theme selection changes

---

## Common Patterns

### Pattern 1: Page-Level Theme Application

```svelte
<script>
  import { useCompiledTheme } from '$lib/queries/nursery.js';

  let { siteId } = $props();
  const compiledThemeQuery = useCompiledTheme(siteId, () => siteId !== null);

  $effect(() => {
    if ($compiledThemeQuery.data?.compiledTokens) {
      const root = document.documentElement;
      Object.entries($compiledThemeQuery.data.compiledTokens).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      return () => {
        // Cleanup: remove variables when component unmounts
        Object.keys($compiledThemeQuery.data.compiledTokens).forEach((key) => {
          root.style.removeProperty(key);
        });
      };
    }
  });
</script>

<!-- Your page content -->
```

### Pattern 2: Component with Theme-Aware Styling

```svelte
<script>
  import { useCompiledTheme } from '$lib/queries/nursery.js';

  let { siteId } = $props();
  const compiledThemeQuery = useCompiledTheme(siteId);
</script>

<div
  class="card p-6 rounded-lg"
  style="
    background-color: var(--background-color, white);
    color: var(--text-color, #1f2937);
    border-color: var(--accent-color, #e5e7eb);
  "
>
  <h2 style="color: var(--primary-color, #2563eb)">Card Title</h2>
  <p>Card content using theme colors</p>
</div>
```

### Pattern 3: Dynamic Theme Switching

```svelte
<script>
  import { useCompiledTheme, useNurserySite } from '$lib/queries/nursery.js';

  let { siteId } = $props();

  const siteQuery = useNurserySite(siteId);
  const themeId = $derived($siteQuery.data?.themeId);

  // Query re-runs when themeId changes
  const compiledThemeQuery = useCompiledTheme(siteId, () => $themeId !== null);

  // Apply theme reactively
  $effect(() => {
    if ($compiledThemeQuery.data?.compiledTokens) {
      const root = document.documentElement;
      Object.entries($compiledThemeQuery.data.compiledTokens).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  });
</script>
```

---

## Troubleshooting

### Theme Not Loading

1. Check if site has a theme assigned: `$siteQuery.data?.themeId`
2. Verify query is enabled: `useCompiledTheme(siteId, () => hasTheme)`
3. Check query error: `$compiledThemeQuery.error`
4. Verify API endpoint: Check network tab for `/nursery/sites/{id}/theme/compiled`

### CSS Variables Not Applying

1. Ensure CSS variables are applied to a parent element
2. Check variable names match (case-sensitive, must include `--` prefix)
3. Verify values are valid CSS (colors, sizes, etc.)
4. Check browser DevTools to see if variables are set on the element

### Overrides Not Showing

1. Verify overrides exist: `$compiledThemeQuery.data?.overrides`
2. Check compiled tokens include overrides: `$compiledThemeQuery.data?.compiledTokens`
3. Overrides should override base theme values in the compiled result

---

## Related Files

- **Queries:** `frontend/src/lib/queries/nursery.js`
- **API Client:** `frontend/src/lib/api/nursery.js`
- **Theme Editor Component:** `frontend/src/lib/components/nursery/ThemeEditor.svelte`
- **Backend Routes:** `src/nursery/routes/themes.js`
- **Backend Service:** `src/nursery/services/ThemeService.js`
- **Backend Models:** `src/models/nursery/NurseryTheme.js`, `src/models/nursery/PropertyThemeOverride.js`

---

## Summary

1. **Fetch compiled theme** using `useCompiledTheme(siteId)` hook
2. **Get CSS variables** from `$compiledThemeQuery.data.compiledTokens`
3. **Apply to DOM** by setting CSS variables on `:root` or container element
4. **Use in CSS/Tailwind** with `var(--variable-name)` syntax
5. **Handle edge cases**: loading states, no theme, errors
6. **Follow patterns**: Use TanStack Query, provide fallbacks, enable queries conditionally

The theme system is designed to be flexible and performant. Always use the compiled theme result rather than manually merging base themes and overrides.
