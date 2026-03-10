# Analytics + Ads Tracking Setup (Plausible, Clarity, Google Ads, Meta Pixel)

## Goal

Add **unified client-side tracking** to the Nursery SvelteKit frontend so that:

* **Plausible** tracks pageviews + custom events across all domains.
* **Microsoft Clarity** records session replays + heatmaps.
* **Google Ads (gtag)** receives events for conversion tracking.
* **Meta Pixel (fbq)** receives events for retargeting + conversion tracking.
* Components can call a single `track()` helper to fan out events to all relevant providers.
* No Maynard backend integration is required at this time (no `/api/analytics` endpoint, no per-site config).

Assume:

* Single SvelteKit app deployed as Azure Static Web App.
* Multiple domains routed via Azure Front Door, all sharing this same frontend.
* All sites should have analytics enabled; no need for per-property toggles right now.

---

## High-Level Design

1. Add a small **client-side analytics helper** `src/lib/analytics.ts` with:

   * `TrackEvent` union type.
   * `track(eventName, props?)` function.
   * Internally calls:

     * `window.plausible(...)` if available.
     * `window.gtag(...)` if available.
     * `window.fbq(...)` if available.

2. In the root Svelte layout (`+layout.svelte` at app root):

   * Inject **Plausible** project-specific script tag (automatically supports multi-domain tracking).
   * Inject **Clarity** script tag with a fixed project ID.
   * Inject **Google Ads gtag** script tag with a configurable ID.
   * Inject **Meta Pixel** script tag with a configurable Pixel ID.

3. Use **SvelteKit public environment variables** for IDs so we don't hard-code them:

   * `PUBLIC_PLAUSIBLE_PROJECT_ID` (Plausible project-specific script ID, e.g., `pa-XXXXXXXXXXXXXXX`)
   * `PUBLIC_CLARITY_PROJECT_ID`
   * `PUBLIC_GOOGLE_ADS_ID`
   * `PUBLIC_META_PIXEL_ID`

   Note: The `PUBLIC_` prefix makes these variables available on both server and client, which is required for injecting scripts in the layout. Plausible uses a project-specific script that automatically supports multi-domain tracking across all Nursery microsites.

4. Update a few representative components to use `track()` for:

   * “Apply Now” button → `StartApplication`
   * Lead/contact form submit → `SubmitLead`
   * Phone link click → `ClickCall`

---

## Environment Variables

Add the following to the project's `.env` (or the appropriate environment file):

```bash
PUBLIC_PLAUSIBLE_PROJECT_ID=pa-XXXXXXXXXXXXXXX  # Plausible project ID from script filename (e.g., from https://plausible.io/js/pa-4umnMul0fjPnL8xuogSsV.js)
PUBLIC_CLARITY_PROJECT_ID=udt8692dne            # Clarity project ID from script snippet (see instructions below)
PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX               # Replace with your Google Ads conversion ID
PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXX            # Replace with your Meta Pixel ID
```

**Important**: 
- The `PUBLIC_` prefix is required for SvelteKit to expose these variables to client-side code. These values will be available via SvelteKit's `$env/static/public` or `$env/dynamic/public` modules.

**How to Get Project IDs:**

1. **Plausible Project ID**: Get this from your Plausible dashboard. The project-specific script URL will be something like `https://plausible.io/js/pa-4umnMul0fjPnL8xuogSsV.js` - extract the ID part (`pa-4umnMul0fjPnL8xuogSsV`) and use that as the value. This script automatically supports multi-domain tracking across all Nursery microsites.

2. **Clarity Project ID**: Get this from your Clarity dashboard script snippet. Look for the script code that Clarity provides:
   ```html
   <script type="text/javascript">
       (function(c,l,a,r,i,t,y){
           c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
           t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
           y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
       })(window, document, "clarity", "script", "udt8692dne");
   </script>
   ```
   The project ID is the **last string parameter** in the function call (in this example, `"udt8692dne"`). Extract just that string value (without quotes) and use it as `PUBLIC_CLARITY_PROJECT_ID`.

### Deployment Configuration

Since these are `PUBLIC_*` variables, they are **baked into the client bundle at build time**. You need to configure them in your CI/CD pipeline:

#### 1. GitHub Secrets (Required)

Add these as secrets in your GitHub repository:

1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `PUBLIC_PLAUSIBLE_PROJECT_ID` (the project ID from Plausible, e.g., `pa-4umnMul0fjPnL8xuogSsV`)
   - `PUBLIC_CLARITY_PROJECT_ID`
   - `PUBLIC_GOOGLE_ADS_ID`
   - `PUBLIC_META_PIXEL_ID`

#### 2. Update GitHub Actions Workflow

Update `.github/workflows/deploy.yml` to include the new environment variables:

**In the "Build project" step** (around line 61-67), add the new variables:
```yaml
- name: Build project
  uses: ./.github/actions/build
  with:
    public_axiom_token: ${{ secrets.PUBLIC_AXIOM_TOKEN }}
    public_axiom_dataset: ${{ secrets.PUBLIC_AXIOM_DATASET }}
    public_cloudinary_cloud_name: ${{ secrets.PUBLIC_CLOUDINARY_CLOUD_NAME }}
    public_mapbox_access_token: ${{ secrets.PUBLIC_MAPBOX_ACCESS_TOKEN }}
    # Add these new analytics variables:
    public_plausible_project_id: ${{ secrets.PUBLIC_PLAUSIBLE_PROJECT_ID }}
    public_clarity_project_id: ${{ secrets.PUBLIC_CLARITY_PROJECT_ID }}
    public_google_ads_id: ${{ secrets.PUBLIC_GOOGLE_ADS_ID }}
    public_meta_pixel_id: ${{ secrets.PUBLIC_META_PIXEL_ID }}
```

**In the "Verify environment variables" step** (around line 45-59), optionally add verification:
```yaml
- name: Verify environment variables
  env:
    PUBLIC_AXIOM_TOKEN: ${{ secrets.PUBLIC_AXIOM_TOKEN }}
    PUBLIC_AXIOM_DATASET: ${{ secrets.PUBLIC_AXIOM_DATASET }}
    PUBLIC_CLOUDINARY_CLOUD_NAME: ${{ secrets.PUBLIC_CLOUDINARY_CLOUD_NAME }}
    PUBLIC_MAPBOX_ACCESS_TOKEN: ${{ secrets.PUBLIC_MAPBOX_ACCESS_TOKEN }}
    # Add these for verification:
    PUBLIC_PLAUSIBLE_PROJECT_ID: ${{ secrets.PUBLIC_PLAUSIBLE_PROJECT_ID }}
    PUBLIC_CLARITY_PROJECT_ID: ${{ secrets.PUBLIC_CLARITY_PROJECT_ID }}
    PUBLIC_GOOGLE_ADS_ID: ${{ secrets.PUBLIC_GOOGLE_ADS_ID }}
    PUBLIC_META_PIXEL_ID: ${{ secrets.PUBLIC_META_PIXEL_ID }}
  run: |
    echo "Checking environment variables:"
    # ... existing checks ...
    echo "PUBLIC_PLAUSIBLE_PROJECT_ID: $PUBLIC_PLAUSIBLE_PROJECT_ID"
    echo "PUBLIC_CLARITY_PROJECT_ID exists: $([[ -n "$PUBLIC_CLARITY_PROJECT_ID" ]] && echo "YES" || echo "NO")"
```

#### 3. Update Build Action

Update `.github/actions/build/action.yml` to accept the new inputs:

```yaml
inputs:
  public_axiom_token:
    description: PUBLIC_AXIOM_TOKEN environment variable
    required: false
  public_axiom_dataset:
    description: PUBLIC_AXIOM_DATASET environment variable
    required: false
  public_cloudinary_cloud_name:
    description: PUBLIC_CLOUDINARY_CLOUD_NAME environment variable
    required: false
  public_mapbox_access_token:
    description: PUBLIC_MAPBOX_ACCESS_TOKEN environment variable
    required: false
  # Add these new inputs:
  public_plausible_project_id:
    description: PUBLIC_PLAUSIBLE_PROJECT_ID environment variable
    required: false
  public_clarity_project_id:
    description: PUBLIC_CLARITY_PROJECT_ID environment variable
    required: false
  public_google_ads_id:
    description: PUBLIC_GOOGLE_ADS_ID environment variable
    required: false
  public_meta_pixel_id:
    description: PUBLIC_META_PIXEL_ID environment variable
    required: false
runs:
  using: composite
  steps:
    - name: pnpm build
      run: pnpm run build
      shell: bash
      env:
        PUBLIC_AXIOM_TOKEN: ${{ inputs.public_axiom_token }}
        PUBLIC_AXIOM_DATASET: ${{ inputs.public_axiom_dataset }}
        PUBLIC_CLOUDINARY_CLOUD_NAME: ${{ inputs.public_cloudinary_cloud_name }}
        PUBLIC_MAPBOX_ACCESS_TOKEN: ${{ inputs.public_mapbox_access_token }}
        # Add these new env vars:
        PUBLIC_PLAUSIBLE_PROJECT_ID: ${{ inputs.public_plausible_project_id }}
        PUBLIC_CLARITY_PROJECT_ID: ${{ inputs.public_clarity_project_id }}
        PUBLIC_GOOGLE_ADS_ID: ${{ inputs.public_google_ads_id }}
        PUBLIC_META_PIXEL_ID: ${{ inputs.public_meta_pixel_id }}
```

#### 4. Azure Static Web App Portal (Optional)

**You do NOT need to add these to Azure SWA portal environment variables** because:
- `PUBLIC_*` variables are baked into the client bundle at build time
- They're already included in the deployed static files
- Azure SWA environment variables are for runtime/server-side use

However, if you want to change these values without rebuilding, you could set them in Azure Portal → Your SWA → **Configuration** → **Application settings**, but this would require using `$env/dynamic/public` instead of `$env/static/public` in your code.

---

## Step 1 – Create `src/lib/analytics.ts`

If `src/lib/analytics.ts` does not exist, create it. If it exists, **merge** with the following design.

```ts
// src/lib/analytics.ts

// Core events we care about right now.
// Extend this union as needed.
export type TrackEvent =
  | 'PageView'
  | 'ViewUnit'
  | 'StartApplication'
  | 'SubmitApplication'
  | 'SubmitLead'
  | 'ClickCall'
  | 'ClickEmail'
  | 'ScheduleTour';

export function track(eventName: TrackEvent, props: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as any;

  // Plausible custom events
  if (typeof w.plausible === 'function') {
    try {
      w.plausible(eventName, { props });
    } catch (e) {
      console.error('Plausible tracking error', e);
    }
  }

  // Google Ads / gtag
  if (typeof w.gtag === 'function') {
    try {
      // Use the same event name so we can mark it as a conversion in Google Ads
      w.gtag('event', eventName, props);
    } catch (e) {
      console.error('gtag tracking error', e);
    }
  }

  // Meta Pixel
  if (typeof w.fbq === 'function') {
    try {
      // trackCustom lets us send arbitrary event names
      w.fbq('trackCustom', eventName, props);
    } catch (e) {
      console.error('Meta Pixel tracking error', e);
    }
  }
}
```

Notes:

* We do not send anything to a custom backend here.
* All tracking is client-side and optional (each provider is called only if available).

---

## Step 2 – Inject Scripts in Root `+layout.svelte`

Locate the **root** `+layout.svelte` file at `src/routes/+layout.svelte`.

The current layout structure uses Svelte 5 runes and has existing content. Update it to:

1. Read env vars using `import.meta.env` in the existing `<script>` block.
2. Add a `<svelte:head>` block (if it doesn't exist) to inject analytics scripts.
3. **Preserve all existing layout content** (ThemeProvider, children, ScrollToTop, etc.).

**Current layout structure** (preserve this):
```svelte
<script>
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  // ... existing imports
  let { children, data } = $props();
  // ... existing logic
</script>

{#if compiledTheme}
  <ThemeProvider {compiledTheme} />
{/if}

{@render children()}

<ScrollToTop />
```

**Add this to the existing `<script>` block:**
```svelte
<script>
  // ... existing imports ...
  import { env as PUBLIC_ENV } from '$env/dynamic/public';
  
  // ... existing code ...
  
  // Analytics environment variables (using SvelteKit pattern to match project conventions)
  const PLAUSIBLE_PROJECT_ID = PUBLIC_ENV?.PUBLIC_PLAUSIBLE_PROJECT_ID;
  const CLARITY_PROJECT_ID = PUBLIC_ENV?.PUBLIC_CLARITY_PROJECT_ID;
  const GOOGLE_ADS_ID = PUBLIC_ENV?.PUBLIC_GOOGLE_ADS_ID;
  const META_PIXEL_ID = PUBLIC_ENV?.PUBLIC_META_PIXEL_ID;
</script>
```

**Alternative (using static imports for better tree-shaking):**
If you prefer static imports (which are tree-shaken and type-safe), you can use:
```svelte
<script>
  // ... existing imports ...
  import {
    PUBLIC_PLAUSIBLE_PROJECT_ID,
    PUBLIC_CLARITY_PROJECT_ID,
    PUBLIC_GOOGLE_ADS_ID,
    PUBLIC_META_PIXEL_ID,
  } from '$env/static/public';
  
  // ... existing code ...
</script>
```

Both approaches work. The dynamic import (`$env/dynamic/public`) is more flexible for runtime values, while static imports (`$env/static/public`) are better for build-time optimization. For analytics IDs that don't change at runtime, either is fine.

**Add `<svelte:head>` block before the existing content:**
```svelte
<svelte:head>
  {#if PLAUSIBLE_PROJECT_ID}
    <!-- Plausible Analytics - Project-specific script (supports multi-domain automatically) -->
    <!-- This replaces the old domain-based script - no data-domain attribute needed -->
    <script async src={"https://plausible.io/js/" + PLAUSIBLE_PROJECT_ID + ".js"}></script>
    <script>
      {`
        window.plausible = window.plausible || function() {
          (plausible.q = plausible.q || []).push(arguments);
        };
        plausible.init = plausible.init || function(config) {
          plausible.o = config || {};
        };
        plausible.init();
      `}
    </script>
  {/if}
```

**Important - Remove Old Plausible Usage:**

If you have any existing Plausible scripts in your codebase, remove references to:
- `script.js` or `script.multidomain.js` (old Plausible scripts)
- `data-domain="..."` attributes
- Dynamic domain injection for Plausible
- Any code that sets `data-domain` based on the current host

The new project-specific script handles all of this automatically. All Nursery microsites (90+ domains) will share one Plausible project and track correctly without any domain configuration.

  {#if GOOGLE_ADS_ID}
    <!-- Google Ads / gtag -->
    <script async src={"https://www.googletagmanager.com/gtag/js?id=" + GOOGLE_ADS_ID}></script>
    <script>
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GOOGLE_ADS_ID}');
      `}
    </script>
  {/if}

  {#if META_PIXEL_ID}
    <!-- Meta Pixel -->
    <script>
      {`
        !function(f,b,e,v,n,t,s){
          if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)
        }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </script>
    <noscript>
      <img
        alt=""
        height="1"
        width="1"
        style="display:none"
        src={"https://www.facebook.com/tr?id=" + META_PIXEL_ID + "&ev=PageView&noscript=1"} />
    </noscript>
  {/if}

  {#if CLARITY_PROJECT_ID}
    <!-- Microsoft Clarity -->
    <script>
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/" + i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `}
    </script>
  {/if}
</svelte:head>

<!-- Existing layout content below -->
{#if compiledTheme}
  <ThemeProvider {compiledTheme} />
{/if}

{@render children()}

<ScrollToTop />
```

Requirements:

* Do **not** reference `window` directly in the `<script>` block at the top; we only reference `window` inside stringified scripts to avoid SSR issues.
* **Preserve all existing layout content** - the analytics scripts are added via `<svelte:head>`, which doesn't interfere with the existing structure.

---

## Step 3 – Wire Up Example Events in Components

Update the following components to use `track()`:

1. **"Apply Now" buttons** in listings (multiple locations)
2. **Contact form** submission (server-side form action)
3. **Phone links** in Header and contact page

### 3.1 Apply Now Button Example

The project has "Apply Now" buttons in multiple locations. Update them as follows:

#### Location 1: Listings Page Grid (`src/routes/(marketing)/listings/+page.svelte`)

**Around line 263-271** (listing card overlay):
```svelte
<script>
  import { track } from '$lib/analytics';
  // ... existing code ...
</script>

<!-- In the listing card overlay -->
{#if listing.applicationUrl}
  <div class="pointer-events-auto">
    <a
      href={listing.applicationUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block px-4 py-2 bg-white text-primary-main rounded-full font-normal text-sm transition-all duration-200 hover:bg-primary-main hover:text-white hover:scale-105"
      onclick={(e) => {
        e.stopPropagation();
        track('StartApplication', {
          source: 'listings-grid',
          unitId: listing.id,
          unitName: listing.unitName
        });
      }}
    >
      Apply Now
    </a>
  </div>
{/if}
```

**Around line 301-310** (fallback view when no image):
```svelte
{#if listing.applicationUrl}
  <a
    href={listing.applicationUrl}
    target="_blank"
    rel="noopener noreferrer"
    class="inline-block px-5 py-2.5 bg-primary-main text-white rounded-full font-normal text-sm transition-all duration-200 hover:bg-primary-main/90 hover:scale-105"
    onclick={(e) => {
      e.stopPropagation();
      track('StartApplication', {
        source: 'listings-grid-fallback',
        unitId: listing.id,
        unitName: listing.unitName
      });
    }}
>
  Apply Now
  </a>
{/if}
```

**Around line 519-526** (dialog/modal):
```svelte
{#if selectedListing.applicationUrl && selectedListing.acceptingApplications}
  <a
    href={selectedListing.applicationUrl}
    target="_blank"
    rel="noopener noreferrer"
    class="block text-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
    onclick={() => track('StartApplication', {
      source: 'listing-dialog',
      unitId: selectedListing.id,
      unitName: selectedListing.unitName
    })}
  >
    Apply Now
  </a>
{/if}
```

#### Location 2: Listings Component (`src/lib/components/Listings.svelte`)

**Around line 267-277**:
```svelte
<script>
  import { track } from '$lib/analytics';
  // ... existing code ...
</script>

{#if listing.applicationURL}
  <a
    href={listing.applicationURL}
    target="_blank"
    rel="noopener noreferrer"
    class="property-apply-button"
    onclick={(e) => {
      e.stopPropagation();
      track('StartApplication', {
        source: 'listings-component',
        unitId: listing.id
      });
    }}
  >
    Apply Now
  </a>
{/if}
```

### 3.2 Contact Form Example

The contact form uses **server-side form actions** (SvelteKit actions). Add tracking in two places:

**File: `src/routes/(marketing)/contact-us/+page.svelte`**

**Step 1: Add import and track on client-side enhancement (around line 85-87):**
```svelte
<script>
  import { track } from '$lib/analytics';
  // ... existing imports and code ...

  // Form enhancement for progressive enhancement (client-side only)
  function handleBasicSubmit() {
    isLoading = true;
    // Track on client-side form submission attempt
    track('SubmitLead', {
      source: 'contact-form',
      step: 1,
      hasUnitId: Boolean(basicForm.unitId),
      hasMessage: Boolean(basicForm.message)
    });
  }

  function handleDetailsSubmit() {
    isLoading = true;
    track('SubmitLead', {
      source: 'contact-form',
      step: 2
    });
  }
</script>
```

**Step 2: Track on successful server response (update the `$effect` around line 42-54):**
```svelte
$effect(() => {
  if (form?.success) {
    if (form.step === 1) {
      // Step 1 completed, move to step 2
      leadId = form.leadId;
      currentStep = 2;
      // Track successful lead creation
      track('SubmitLead', {
        source: 'contact-form',
        step: 1,
        success: true,
        leadId: form.leadId,
        created: form.created,
        duplicate: form.duplicate
      });
    } else if (form.step === 2 && form.completed) {
      // Step 2 completed or skipped, redirect to success page
      track('SubmitLead', {
        source: 'contact-form',
        step: 2,
        success: true,
        leadId: form.leadId,
        skipped: form.skippedStep2
      });
      goto(
        `/contact-us/success?leadId=${form.leadId}${form.skippedStep2 ? '&skipped=true' : ''}`
      );
    }
  }
  // ... rest of existing effect code ...
});
```

### 3.3 Phone Link Example

Update phone links in two locations:

#### Location 1: Header Mobile Menu (`src/lib/components/Header.svelte`)

**Around line 207-215**:
```svelte
<script>
  import { track } from '$lib/analytics';
  // ... existing code ...
</script>

<!-- Mobile Contact Info -->
{#if copy.contact_phone_display}
  <a
    href={'tel:' + copy.contact_phone_display}
    class="py-4 text-lg text-center hover:bg-white/10 rounded-lg transition-colors"
    onclick={() => {
      closeMenu();
      track('ClickCall', { location: 'mobile-menu' });
    }}
  >
    {copy.contact_phone_display}
  </a>
{/if}
```

#### Location 2: Contact Page (`src/routes/(marketing)/contact-us/+page.svelte`)

**Around line 131-150**:
```svelte
<script>
  import { track } from '$lib/analytics';
  // ... existing code ...
</script>

{#if content.contact_phone_number || content.contact_phone_display}
  {@const phoneNumber = content.contact_phone_number || content.contact_phone_display}
  <a
    href={`tel:${phoneNumber}`}
    class="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
    onclick={() => track('ClickCall', { location: 'contact-page' })}
  >
    <svg
      class="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- SVG path -->
    </svg>
    <span>{phoneNumber}</span>
  </a>
{/if}
```

---

## Step 4 – TypeScript & Linting

* Ensure `src/lib/analytics.ts` passes TypeScript checks.
* The project uses `allowJs: true` and `checkJs: true` in `tsconfig.json`, so TypeScript will check the `.ts` file.
* If there is an ESLint/Prettier setup, run formatting and fix any issues:
  ```bash
  pnpm lint:fix
  pnpm format
  ```
* Do not disable type checking globally; prefer explicit `any` only where necessary (already localized in the analytics helper).
* Note: The project uses Svelte 5 runes, but the tracking code works with both Svelte 4 and 5 syntax patterns.

---

## Step 5 – Manual Verification Checklist

After implementing the changes, perform a local or test deployment and verify:

1. **Plausible**

   * Network tab shows a request to `https://plausible.io/js/{PROJECT_ID}.js` (where `{PROJECT_ID}` is your `PUBLIC_PLAUSIBLE_PROJECT_ID` value).
   * After page loads, Plausible dashboard shows pageviews from all domains automatically (multi-domain support is built-in).
   * Trigger an `Apply Now` click → custom event appears in Plausible events.
   * No `data-domain` attribute is needed - the project-specific script handles all domains automatically.

2. **Google Ads**

   * Network tab shows a request to `https://www.googletagmanager.com/gtag/js?id=...`.
   * `window.gtag` is defined in the console.
   * Clicking Apply/Lead/etc. does **not** throw errors.

3. **Meta Pixel**

   * Network tab shows `fbevents.js` being loaded.
   * Pixel Helper (if installed in browser) confirms a PageView event fires.
   * Custom events from `track()` do not error.

4. **Clarity**

   * Network tab shows script from `https://www.clarity.ms/tag/...`.
   * Clarity dashboard shows new sessions from the app’s domains.

5. **SSR/Build**

   * `npm run build` / `pnpm build` / `yarn build` succeeds.
   * No SSR-related errors about `window` or `document`.

---

## Acceptance Criteria

* ✅ A single `track()` helper exists and can be imported from `'$lib/analytics'`.
* ✅ Root layout injects Plausible, Clarity, Google Ads, and Meta Pixel based on env vars.
* ✅ At least:

  * **One "Apply Now" button** (multiple exist in `listings/+page.svelte` and `Listings.svelte`)
  * **Contact form** in `contact-us/+page.svelte` tracks `SubmitLead` on both client enhancement and server success
  * **Phone links** in Header mobile menu and contact page track `ClickCall`
* ✅ No runtime errors occur when any of the providers are missing (e.g., if one env var is not set).
* ✅ The app builds successfully (`pnpm build`) and loads correctly in SSR mode.
* ✅ All tracking uses `onclick` handlers (Svelte 5 pattern) instead of `on:click` (Svelte 4 pattern).

---

## Quick Reference: Files to Modify

1. **Create**: `src/lib/analytics.ts` (Step 1)
2. **Modify**: `src/routes/+layout.svelte` (Step 2)
   - Add env var constants to existing `<script>` block
   - Add `<svelte:head>` block with analytics scripts
3. **Modify**: `src/routes/(marketing)/listings/+page.svelte` (Step 3.1)
   - Add `track()` to "Apply Now" buttons (3 locations: grid overlay, fallback view, dialog)
4. **Modify**: `src/lib/components/Listings.svelte` (Step 3.1)
   - Add `track()` to "Apply Now" button
5. **Modify**: `src/routes/(marketing)/contact-us/+page.svelte` (Step 3.2)
   - Add `track()` to form submit handlers
   - Add `track()` to success effect
6. **Modify**: `src/lib/components/Header.svelte` (Step 3.3)
   - Add `track()` to mobile menu phone link
7. **Modify**: `src/routes/(marketing)/contact-us/+page.svelte` (Step 3.3)
   - Add `track()` to contact page phone link
8. **Configure**: Add environment variables to `.env` or deployment secrets (see Environment Variables section)
