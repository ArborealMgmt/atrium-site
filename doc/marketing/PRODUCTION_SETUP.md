# Production Marketing Tracker Setup

## Issue: Trackers Not Working in Production

If trackers work locally but not in production, the environment variables are likely not configured in your CI/CD pipeline.

## Quick Check: Production vs Local

### Check Production Site
1. Visit your production site
2. Open DevTools (F12) → **View Page Source** (Cmd+Option+U / Ctrl+U)
3. Search for:
   - `plausible.io` - Should see script tag if configured
   - `clarity.ms` - Should see script tag if configured
   - `googletagmanager.com` - Should see script tag if configured
   - `facebook.net` - Should see script tag if configured

**If you don't see these script tags**, the environment variables aren't set in production.

### Check Local Site
1. Run `node scripts/check-tracker-env.js` to verify local env vars
2. Start local dev server
3. Check browser console with verification script

---

## Fix: Add Environment Variables to GitHub Actions

**Note:** The workflow and build action are already configured to use these secrets. You only need to add the secrets to GitHub.

### Step 1: Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets (one at a time):
   - `PUBLIC_PLAUSIBLE_PROJECT_ID` = your Plausible project ID (e.g., `pa-4umnMul0fjPnL8xuogSsV`)
   - `PUBLIC_CLARITY_PROJECT_ID` = your Clarity project ID (e.g., `udt8692dne`)
   - `PUBLIC_GOOGLE_ADS_ID` = your Google Ads ID (e.g., `AW-123456789`)
   - `PUBLIC_META_PIXEL_ID` = your Meta Pixel ID (e.g., `123456789012345`)

**Important:** 
- Secret names must match exactly (case-sensitive)
- After adding secrets, you need to trigger a new deployment

### Step 2: Verify Secrets in Workflow

The workflow already includes a verification step that will show you which secrets are missing. To check:

1. Go to **Actions** tab in GitHub
2. Open the latest workflow run
3. Expand the "Verify environment variables" step
4. Look for ❌ or ✅ indicators next to each tracker secret

### Step 3: Redeploy

After adding the GitHub Secrets:
1. Go to **Actions** → **Deploy to Azure Static Web Apps** → **Run workflow**
2. Or push a new commit to trigger automatic deployment
3. Wait for the deployment to complete

---

## Verification After Deployment

After deploying with the updated configuration:

1. **Check GitHub Actions logs:**
   - Go to **Actions** tab
   - Open the latest workflow run
   - Check the "Verify environment variables" step
   - Look for confirmation that variables are set

2. **Check production site:**
   - View page source and search for tracker script tags
   - Run the verification script in browser console
   - Check Network tab for script loading

3. **Check tracker dashboards:**
   - Plausible: Should see real-time visits
   - Clarity: Should see recordings after 5-10 minutes
   - Google Ads: Check conversion tracking
   - Meta Pixel: Check Events Manager for events

---

## Troubleshooting

### Scripts still not appearing after deployment

1. **Check GitHub Secrets are set:**
   - Go to Settings → Secrets and variables → Actions
   - Verify all 4 secrets exist:
     - `PUBLIC_PLAUSIBLE_PROJECT_ID`
     - `PUBLIC_CLARITY_PROJECT_ID`
     - `PUBLIC_GOOGLE_ADS_ID`
     - `PUBLIC_META_PIXEL_ID`
   - **Important:** Secret names are case-sensitive and must match exactly

2. **Check workflow logs:**
   - Go to **Actions** → Latest workflow run
   - Expand "Verify environment variables" step
   - Look for ❌ indicators - these show which secrets are missing
   - If secrets show as "NOT SET", they haven't been added to GitHub yet

3. **Verify secrets have values:**
   - In GitHub Secrets, click on each secret to verify it has a value
   - Empty or placeholder values won't work
   - Make sure there are no extra spaces or quotes

4. **Check for caching issues:**
   - Try clearing browser cache (Cmd+Shift+R / Ctrl+Shift+R)
   - Try incognito/private browsing mode
   - Check if CDN cache needs clearing (Azure Front Door)
   - Wait 5-10 minutes after deployment for CDN to update

5. **Verify the build output:**
   - After deployment, view page source (Cmd+Option+U / Ctrl+U)
   - Search for `plausible.io`, `clarity.ms`, `googletagmanager.com`, `facebook.net`
   - If you don't see script tags, the secrets weren't available during build

6. **Common mistakes:**
   - Secret name typo (e.g., `PUBLIC_PLAUSIBLE_PROJECT_ID` vs `PUBLIC_PLAUSIBLE_ID`)
   - Secret added but deployment not triggered
   - Secret added to wrong repository
   - Secret value is empty or contains placeholder text

---

## Quick Reference: Where to Get IDs

- **Plausible**: https://plausible.io/ → Your site → Settings → Project ID
- **Clarity**: https://clarity.microsoft.com/ → Your project → Setup → Project ID
- **Google Ads**: https://ads.google.com/ → Tools → Conversions → Conversion ID
- **Meta Pixel**: https://business.facebook.com/events_manager → Your Pixel → Pixel ID

