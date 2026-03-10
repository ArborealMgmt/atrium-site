# How to Verify Marketing Trackers Are Working

This guide explains how to check if your marketing trackers (Plausible, Microsoft Clarity, Google Ads, Meta Pixel) are properly installed and sending data.

## Prerequisites: Check Environment Variables

**Before checking in the browser, verify your environment variables are set:**

### Quick Check Script
Run this command in your terminal:
```bash
node scripts/check-tracker-env.js
```

This will show you which environment variables are set and which are missing.

### Manual Check
Ensure your `.env` file (or `.env.local`) contains:
```bash
PUBLIC_PLAUSIBLE_PROJECT_ID=pa-XXXXXXXXXXXXXXX
PUBLIC_CLARITY_PROJECT_ID=your-clarity-id
PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
PUBLIC_META_PIXEL_ID=your-pixel-id
```

**Important:** After adding/updating environment variables, **restart your dev server** for changes to take effect.

---

## Quick Browser DevTools Check

### 1. Open Browser DevTools
- **Chrome/Edge**: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
- **Firefox**: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)

### 2. Check Network Tab
1. Open the **Network** tab in DevTools
2. Refresh the page (`Cmd+R` / `Ctrl+R`)
3. Filter by each tracker's domain to see if scripts are loading:

   - **Plausible**: Filter for `plausible.io`
   - **Microsoft Clarity**: Filter for `clarity.ms`
   - **Google Ads**: Filter for `googletagmanager.com` or `google-analytics.com`
   - **Meta Pixel**: Filter for `facebook.net` or `facebook.com`

4. Look for:
   - ✅ **200 OK** status codes (scripts loaded successfully)
   - ❌ **404** or **blocked** (script not found or blocked by ad blocker)

### 3. Check Console Tab
Open the **Console** tab and run these commands to verify each tracker is loaded:

```javascript
// Check Plausible
console.log('Plausible:', typeof window.plausible === 'function' ? '✅ Loaded' : '❌ Not loaded');

// Check Microsoft Clarity
console.log('Clarity:', typeof window.clarity === 'function' ? '✅ Loaded' : '❌ Not loaded');

// Check Google Ads (gtag)
console.log('Google Ads:', typeof window.gtag === 'function' ? '✅ Loaded' : '❌ Not loaded');

// Check Meta Pixel
console.log('Meta Pixel:', typeof window.fbq === 'function' ? '✅ Loaded' : '❌ Not loaded');
```

---

## Detailed Verification by Tracker

### Plausible Analytics

#### Method 1: Browser Console
```javascript
// Check if Plausible is loaded
window.plausible

// Manually trigger a test event
window.plausible('TestEvent', { props: { test: true } });
```

#### Method 2: Network Tab
1. Open **Network** tab
2. Filter by `plausible.io`
3. Look for:
   - Script load: `https://plausible.io/js/{PROJECT_ID}.js` → **200 OK**
   - Event tracking: `https://plausible.io/api/event` → **202 Accepted** (when events fire)

#### Method 3: Plausible Dashboard
1. Go to your [Plausible dashboard](https://plausible.io/)
2. Navigate to your site
3. Check **Real-time** view
4. Visit your site in another tab/window
5. You should see your visit appear within 1-2 seconds

#### Method 4: Browser Extension
- Install the [Plausible Analytics browser extension](https://plausible.io/browser-extension)
- It will show a badge when Plausible is detected on the page

---

### Microsoft Clarity

#### Method 1: Browser Console
```javascript
// Check if Clarity is loaded
window.clarity

// Check Clarity ID
window.clarity && window.clarity('get', 'id')
```

#### Method 2: Network Tab
1. Open **Network** tab
2. Filter by `clarity.ms`
3. Look for:
   - Script load: `https://www.clarity.ms/tag/{PROJECT_ID}` → **200 OK**
   - Data sends: Requests to `clarity.ms` → **200 OK**

#### Method 3: Clarity Dashboard
1. Go to [Microsoft Clarity dashboard](https://clarity.microsoft.com/)
2. Select your project
3. Check **Recordings** → You should see session recordings appearing
4. Check **Heatmaps** → Heatmaps will populate as users interact

#### Method 4: Real-time Test
1. Open your site
2. Interact with the page (click, scroll, type)
3. Wait 5-10 minutes
4. Check Clarity dashboard → Your session should appear in recordings

---

### Google Ads (gtag)

#### Method 1: Browser Console
```javascript
// Check if gtag is loaded
window.gtag

// Check dataLayer
window.dataLayer

// Manually trigger a test event
window.gtag('event', 'test_event', { test: true });
```

#### Method 2: Network Tab
1. Open **Network** tab
2. Filter by `googletagmanager.com` or `google-analytics.com`
3. Look for:
   - Script load: `https://www.googletagmanager.com/gtag/js?id={GOOGLE_ADS_ID}` → **200 OK**
   - Event tracking: Requests to `google-analytics.com/g/collect` → **200 OK**

#### Method 3: Google Tag Assistant
1. Install [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visit your site
3. Click the extension icon
4. It will show detected tags including your Google Ads tag

#### Method 4: Google Ads Dashboard
1. Go to [Google Ads](https://ads.google.com/)
2. Navigate to **Tools & Settings** → **Conversions**
3. Check if conversions are being tracked
4. Use **Tools & Settings** → **Conversions** → **Tag Assistant** for real-time verification

#### Method 5: Real-time Events (Google Analytics 4)
If you're using GA4:
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to **Reports** → **Realtime**
4. Visit your site → You should see yourself appear in real-time

---

### Meta Pixel (Facebook Pixel)

#### Method 1: Browser Console
```javascript
// Check if Meta Pixel is loaded
window.fbq

// Check Pixel ID
window._fbq && window._fbq.id

// Manually trigger a test event
window.fbq('track', 'PageView');
window.fbq('trackCustom', 'TestEvent', { test: true });
```

#### Method 2: Network Tab
1. Open **Network** tab
2. Filter by `facebook.net` or `facebook.com`
3. Look for:
   - Script load: `https://connect.facebook.net/en_US/fbevents.js` → **200 OK**
   - Event tracking: Requests to `facebook.com/tr` → **200 OK**

#### Method 3: Meta Pixel Helper Extension
1. Install [Meta Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Visit your site
3. Click the extension icon
4. It will show:
   - ✅ Green badge = Pixel is working
   - ⚠️ Yellow badge = Pixel detected but issues
   - ❌ Red badge = Pixel not found

#### Method 4: Meta Events Manager
1. Go to [Meta Events Manager](https://business.facebook.com/events_manager)
2. Select your Pixel
3. Go to **Test Events** tab
4. Visit your site → You should see events appearing in real-time

---

## Comprehensive Verification Script

Create a bookmarklet or run this in your browser console to check all trackers at once:

```javascript
(function() {
  console.log('=== Marketing Tracker Verification ===\n');
  
  // Check Plausible
  const plausibleLoaded = typeof window.plausible === 'function';
  console.log('Plausible:', plausibleLoaded ? '✅ Loaded' : '❌ Not loaded');
  if (plausibleLoaded) {
    console.log('  - Function available:', typeof window.plausible);
  }
  
  // Check Microsoft Clarity
  const clarityLoaded = typeof window.clarity === 'function';
  console.log('Microsoft Clarity:', clarityLoaded ? '✅ Loaded' : '❌ Not loaded');
  
  // Check Google Ads (gtag)
  const gtagLoaded = typeof window.gtag === 'function';
  console.log('Google Ads (gtag):', gtagLoaded ? '✅ Loaded' : '❌ Not loaded');
  if (window.dataLayer) {
    console.log('  - dataLayer:', window.dataLayer.length, 'items');
  }
  
  // Check Meta Pixel
  const fbqLoaded = typeof window.fbq === 'function';
  console.log('Meta Pixel:', fbqLoaded ? '✅ Loaded' : '❌ Not loaded');
  if (window._fbq) {
    console.log('  - Pixel ID:', window._fbq.id || 'Not set');
  }
  
  console.log('\n=== Environment Variables Check ===');
  // Note: These won't be accessible in browser, but you can check the page source
  console.log('Check page source for script tags with your IDs');
  
  console.log('\n=== Network Requests ===');
  console.log('Open Network tab and filter for:');
  console.log('  - plausible.io');
  console.log('  - clarity.ms');
  console.log('  - googletagmanager.com');
  console.log('  - facebook.net');
})();
```

---

## Common Issues & Solutions

### Issue: MutationObserver Error (Unrelated to Trackers)

If you see an error like:
```
TypeError: Argument 1 ('target') to MutationObserver.observe must be an instance of Node
```

This error is **NOT related to marketing trackers**. It's coming from `credentials-library.js` and is a separate issue. You can safely ignore it when checking trackers, or investigate it separately.

### Issue: Tracker shows "Not loaded" in console

**Possible causes:**
1. **Environment variable not set** - Check that `PUBLIC_*` variables are set in your `.env` file or deployment environment
2. **Ad blocker** - Disable ad blockers (uBlock Origin, Privacy Badger, etc.)
3. **Script not loading** - Check Network tab for 404 errors
4. **Conditional loading** - Check that the environment variable exists (scripts only load if ID is present)

**Solution:**
```bash
# Check your .env file
cat .env | grep PUBLIC_

# Or check in browser DevTools → Application → Local Storage
# Look for any stored values
```

### Issue: Scripts load but events don't fire

**Check:**
1. Console for JavaScript errors
2. Network tab for failed event requests
3. CORS issues (shouldn't happen with these trackers)
4. Check if `track()` function is being called correctly

### Issue: Real-time data not appearing

**Note:** Some trackers have delays:
- **Plausible**: Usually appears within 1-2 seconds
- **Clarity**: Recordings appear after 5-10 minutes
- **Google Ads**: Can take a few minutes
- **Meta Pixel**: Usually appears within seconds in Events Manager

---

## Automated Testing

You can also create a test page or component to verify trackers programmatically:

```typescript
// src/lib/utils/verify-trackers.ts
export function verifyTrackers(): Record<string, boolean> {
  if (typeof window === 'undefined') {
    return {
      plausible: false,
      clarity: false,
      googleAds: false,
      metaPixel: false,
    };
  }

  return {
    plausible: typeof (window as any).plausible === 'function',
    clarity: typeof (window as any).clarity === 'function',
    googleAds: typeof (window as any).gtag === 'function',
    metaPixel: typeof (window as any).fbq === 'function',
  };
}
```

Then use it in a component:
```svelte
<script>
  import { verifyTrackers } from '$lib/utils/verify-trackers';
  
  $effect(() => {
    if (browser) {
      const status = verifyTrackers();
      console.log('Tracker status:', status);
    }
  });
</script>
```

---

## Quick Checklist

- [ ] **First:** Run `node scripts/check-tracker-env.js` to verify environment variables
- [ ] **Then:** Restart dev server if env vars were missing/updated
- [ ] Open DevTools → Network tab → Check scripts load (200 OK)
- [ ] Open DevTools → Console → Run verification script (`doc/marketing/verify-trackers-console.js`)
- [ ] View page source (Cmd+Option+U) → Search for script tags with tracker domains
- [ ] Check Plausible dashboard → Real-time view
- [ ] Check Clarity dashboard → Recordings appear
- [ ] Use Meta Pixel Helper extension → Green badge
- [ ] Use Google Tag Assistant → Tag detected
- [ ] Disable ad blockers and retest

---

## Need Help?

If trackers aren't working:
1. Verify environment variables are set: `PUBLIC_PLAUSIBLE_PROJECT_ID`, `PUBLIC_CLARITY_PROJECT_ID`, `PUBLIC_GOOGLE_ADS_ID`, `PUBLIC_META_PIXEL_ID`
2. Check browser console for errors
3. Verify scripts are in `<svelte:head>` in `+layout.svelte`
4. Check Network tab for failed requests
5. Try in incognito mode (to rule out extensions)

