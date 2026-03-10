# Marketing Implementation Guide - Review & Project-Specific Adjustments

## Overall Assessment

The guide is **well-structured and mostly accurate** for this project, but there are several **project-specific adjustments** needed to align with the actual codebase structure and patterns.

---

## ✅ What's Correct

1. **File Structure**: The guide correctly identifies:
   - Root layout at `src/routes/+layout.svelte` ✓
   - Analytics helper location `src/lib/analytics.ts` ✓
   - TypeScript support (project has `tsconfig.json`) ✓

2. **Environment Variables**: Using `import.meta.env.VITE_*` is correct for Vite/SvelteKit ✓

3. **Script Injection**: Using `<svelte:head>` is the right approach ✓

4. **SSR Safety**: The guide correctly avoids `window` references in SSR contexts ✓

---

## ⚠️ Project-Specific Adjustments Needed

### 1. **Svelte Version & Syntax**

**Issue**: The project uses **Svelte 5** with runes (`$state`, `$derived`, `$props`), but the guide's examples use Svelte 4 syntax.

**Current Project Pattern** (from `+layout.svelte`):
```svelte
<script>
  let { children, data } = $props();
  const layoutCompiledTheme = $derived(data?.compiledTheme);
</script>
```

**Guide's Pattern** (still works, but not idiomatic):
```svelte
<script lang="ts">
  // Uses traditional Svelte 4 patterns
</script>
```

**Recommendation**: The guide's syntax will work, but consider updating examples to use Svelte 5 runes for consistency. However, this is **not critical** - the guide's code will function correctly.

---

### 2. **Form Submission Pattern**

**Issue**: The project uses **server-side form actions**, not client-side submit handlers.

**Current Project Pattern** (from `contact-us/+page.svelte`):
```svelte
<form method="POST" action="?/createLead" onsubmit={handleBasicSubmit}>
  <!-- form fields -->
</form>
```

The `handleBasicSubmit` function only sets loading state - actual submission is handled by the server action in `+page.server.js`.

**Guide's Pattern** (client-side):
```svelte
async function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  // Client-side logic
  track('SubmitLead', {...});
}
```

**Adjustment Needed**: For the contact form, tracking should be added in **two places**:

1. **Client-side enhancement** (in the `onsubmit` handler):
```svelte
function handleBasicSubmit() {
  isLoading = true;
  track('SubmitLead', {
    source: 'contact-form',
    step: 1
  });
}
```

2. **After successful server response** (in the `$effect` that handles `form?.success`):
```svelte
$effect(() => {
  if (form?.success && form.step === 1) {
    track('SubmitLead', {
      source: 'contact-form',
      step: 1,
      leadId: form.leadId
    });
    // ... existing logic
  }
});
```

**Recommendation**: Update Step 3.2 in the guide to show both patterns, or add a note about server-side form actions.

---

### 3. **"Apply Now" vs "Contact Us" CTAs**

**Issue**: The guide references "Apply Now" buttons, but the project uses **"Contact Us"** CTAs.

**Current Project CTAs**:
- Header: `copy.cta_primary` or `copy.cta_primary_label` → links to `/contact-us`
- Footer: Commented out, but would be similar
- Listings page: Likely has "Contact" or "Schedule Showing" buttons

**Adjustment Needed**: Update Step 3.1 to reference:
- "Contact Us" buttons/links (Header, Footer)
- "Schedule Tour" buttons (if they exist)
- Any primary CTA buttons that lead to lead generation

**Recommendation**: Change "Apply Now" → "Contact Us" or "Primary CTA" throughout the guide.

---

### 4. **Phone Link Locations**

**Issue**: Phone links exist in specific locations that differ from the guide's assumptions.

**Current Phone Links**:
- `Header.svelte` line 209: Mobile menu phone link (`tel:${copy.contact_phone_display}`)
- `contact-us/+page.svelte` line 132: Phone link in contact info section
- Desktop phone link in Header is **commented out** (lines 121-132)

**Adjustment Needed**: Update Step 3.3 to reference:
- Mobile menu phone link in `Header.svelte`
- Contact page phone link in `contact-us/+page.svelte`

**Example for Header.svelte**:
```svelte
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
```

---

### 5. **Root Layout Structure**

**Issue**: The root `+layout.svelte` already has content that must be preserved.

**Current Layout Structure**:
```svelte
<script>
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  // ... imports and logic
</script>

{#if compiledTheme}
  <ThemeProvider {compiledTheme} />
{/if}

{@render children()}

<ScrollToTop />
```

**Adjustment Needed**: The guide's script injection should be added to `<svelte:head>`, which is **not currently present** in the layout. This is fine - we'll add it.

**Recommendation**: Add a note in Step 2 that the `<svelte:head>` block should be added if it doesn't exist, and that existing layout content should be preserved.

---

### 6. **Environment Variable Patterns**

**Issue**: The project uses **two patterns** for environment variables:

1. **Vite pattern** (what the guide uses): `import.meta.env.VITE_*`
2. **SvelteKit pattern** (used in some files): `$env/static/public` and `$env/dynamic/public`

**Current Project Examples**:
- `logger.client.js` uses: `import { env as DYN_PUBLIC_ENV } from '$env/dynamic/public'`
- `mapbox.js` uses: `process.env.PUBLIC_MAPBOX_ACCESS_TOKEN` and `PUBLIC_ENV?.PUBLIC_MAPBOX_ACCESS_TOKEN`

**Recommendation**: The guide's approach (`import.meta.env.VITE_*`) is **correct and simpler** for this use case. No change needed, but note that the project has mixed patterns elsewhere.

---

### 7. **TypeScript File Extension**

**Issue**: The guide creates `src/lib/analytics.ts`, but the project has **mixed JS/TS files**.

**Current Project Pattern**:
- Most files are `.js` (with JSDoc types)
- Some files are `.ts`
- `tsconfig.json` has `"allowJs": true` and `"checkJs": true`

**Recommendation**: Using `.ts` is fine and preferred for new files. The guide is correct.

---

## 📝 Specific Implementation Notes

### For Step 2 (Root Layout)

When adding scripts to `+layout.svelte`, ensure:

1. Add `<svelte:head>` block (doesn't exist currently)
2. Place it **before** the existing content
3. Use conditional rendering based on env vars (guide does this correctly)

**Example structure**:
```svelte
<script>
  // ... existing imports and logic
  
  // Add analytics env vars
  const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;
  const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID;
  const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;
</script>

<svelte:head>
  <!-- Analytics scripts from guide -->
</svelte:head>

<!-- Existing layout content -->
{#if compiledTheme}
  <ThemeProvider {compiledTheme} />
{/if}

{@render children()}

<ScrollToTop />
```

### For Step 3 (Component Updates)

**Priority locations for tracking**:

1. **Contact Form** (`contact-us/+page.svelte`):
   - Track on form submission (both client enhancement and server success)
   - Event: `SubmitLead`

2. **Header CTA** (`Header.svelte` line 146-152):
   - Track on click
   - Event: `StartApplication` or `ClickCTA`

3. **Phone Links**:
   - Header mobile menu (line 209)
   - Contact page (line 132)
   - Event: `ClickCall`

4. **Email Links** (if tracking needed):
   - Contact page (line 158)
   - Event: `ClickEmail`

5. **Schedule Showing** (if exists):
   - `schedule-showing/[unitId]/+page.svelte`
   - Event: `ScheduleTour`

---

## 🔧 Recommended Guide Updates

### Update Step 3.1 Title
Change: "Apply button example" → "Primary CTA button example"

### Update Step 3.1 Code
```svelte
<!-- Example for Header.svelte primary CTA -->
<a
  href="/contact-us"
  class="hidden lg:inline-block px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
  data-sveltekit-preload-data="hover"
  onclick={() => track('StartApplication', { source: 'header-cta' })}
>
  {copy.cta_primary || copy.cta_primary_label}
</a>
```

### Update Step 3.2 Code
Add note about server-side form actions and show both client enhancement and success tracking.

### Update Step 3.3 Code
Reference actual phone link locations in Header and contact page.

---

## ✅ Acceptance Criteria Review

The guide's acceptance criteria are **appropriate**, but should be updated to reflect:

- ✅ Single `track()` helper exists
- ✅ Root layout injects all scripts
- ✅ At least one **Contact Us** button (not "Apply Now")
- ✅ Contact form tracks `SubmitLead`
- ✅ At least one phone link tracks `ClickCall`
- ✅ No runtime errors when providers are missing
- ✅ App builds successfully

---

## 🎯 Final Verdict

**The guide is 85% ready** for this project. The main adjustments needed are:

1. ✅ Update terminology ("Apply Now" → "Contact Us")
2. ✅ Add note about server-side form actions
3. ✅ Reference actual component locations
4. ✅ Ensure `<svelte:head>` addition doesn't break existing layout

**The core implementation approach is sound and will work correctly.**

---

## 📋 Quick Reference: Files to Modify

1. **Create**: `src/lib/analytics.ts`
2. **Modify**: `src/routes/+layout.svelte` (add `<svelte:head>` with scripts)
3. **Modify**: `src/routes/(marketing)/contact-us/+page.svelte` (add tracking to form)
4. **Modify**: `src/lib/components/Header.svelte` (add tracking to CTA and phone link)
5. **Optional**: Add `.env` file with analytics IDs (or configure in deployment)

---

## 🚀 Ready to Implement?

Yes, with the adjustments noted above. The guide provides a solid foundation that aligns well with the project structure.

