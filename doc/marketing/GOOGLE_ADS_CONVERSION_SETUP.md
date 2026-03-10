# Google Ads Conversion Tracking Setup Guide

This guide explains how to configure Google Ads to track conversions using the gtag events that are already being sent from your application.

## Overview

Your application is already set up to send events to Google Ads via the `gtag` function. These events are automatically fired when users perform key actions like:
- `StartApplication` - When users click "Apply Now"
- `SubmitLead` - When users submit contact forms
- `ScheduleTour` - When users schedule a property tour
- `ClickCall` - When users click phone numbers
- `ClickEmail` - When users click email addresses
- `ViewUnit` - When users view unit listings

To track these as **conversions** in Google Ads, you need to:
1. Create conversion actions in your Google Ads account
2. Map those conversion actions to the event names being sent from your code
3. Verify that conversions are being tracked

---

## Step 1: Get Your Google Ads Conversion ID

First, verify you have your Google Ads conversion ID (also called "Conversion ID" or "Tag ID"):

1. Go to [Google Ads](https://ads.google.com/)
2. Click the **Tools & Settings** icon (wrench) in the top right
3. Under "Measurement", click **Conversions**
4. You should see your conversion ID (format: `AW-XXXXXXXXX`)
5. This should match your `PUBLIC_GOOGLE_ADS_ID` environment variable

If you haven't set up a conversion tracking tag yet:
1. Click the **+** button to create a new conversion action
2. Choose **Website** as the conversion source
3. Select **Use Google tag** (or **Google Tag Manager** if you're using GTM)
4. Copy the conversion ID (e.g., `AW-123456789`) and add it to your `PUBLIC_GOOGLE_ADS_ID` environment variable

---

## Step 2: Create Conversion Actions for Your Events

For each event you want to track as a conversion, create a conversion action in Google Ads:

### 2.1 Create a Conversion Action

1. Go to **Tools & Settings** → **Conversions**
2. Click the **+** button to create a new conversion action
3. Choose **Website** as the conversion source
4. Fill in the conversion action details:

   - **Category**: Choose the most appropriate category:
     - `StartApplication` → **Submit lead form**
     - `SubmitLead` → **Submit lead form**
     - `ScheduleTour` → **Schedule a visit**
     - `ClickCall` → **Phone call lead**
     - `ClickEmail` → **Email lead**
     - `ViewUnit` → **Page view** (or create as a secondary conversion)
   
   - **Conversion name**: Use a descriptive name (e.g., "Application Started", "Lead Form Submitted")
   
   - **Value**: 
     - If all conversions have the same value: Enter a fixed amount
     - If values vary: Choose **Use different values for each conversion**
     - If not applicable: Choose **Don't use a value**
   
   - **Count**: 
     - **Every conversion**: Track every time the event fires
     - **One conversion**: Track only once per click/interaction
   
   - **Conversion window**: How long after a click/ad interaction should conversions be counted (default: 30 days)
   
   - **Attribution model**: How to credit conversions to clicks/impressions (default: Last click)
   
   - **Include in "Conversions"**: 
     - ✅ **Yes**: Include in main conversion reporting (for primary conversions)
     - ⚠️ **No**: Track but don't include in main conversion metrics (for secondary/exploratory conversions)

### 2.2 Configure Event Matching (Important!)

After creating the conversion action, you need to configure it to listen for your custom events:

1. In the conversion action settings, look for **Tag setup** or **Event snippet** section
2. Choose **Use existing tag** or **Google tag**
3. You'll see options for **Event matching** or **Trigger conditions**
4. Configure the event to match your custom event names:

   **Option A: Using "Custom event" trigger**
   - Select **Custom event** as the trigger type
   - Set **Event name** to match exactly one of your event names:
     - `StartApplication`
     - `SubmitLead`
     - `ScheduleTour`
     - `ClickCall`
     - `ClickEmail`
     - `ViewUnit`

   **Option B: Using Conversion ID + Event Label** (Advanced)
   - If the above doesn't work, you can use the conversion label method (see below)

### 2.3 Repeat for Each Conversion

Create a separate conversion action for each event you want to track. Common setup:

**Primary Conversions** (Include in "Conversions"):
- ✅ `SubmitLead` - Lead form submissions
- ✅ `StartApplication` - Application starts

**Secondary Conversions** (Optional tracking):
- ⚠️ `ScheduleTour` - Tour scheduling
- ⚠️ `ClickCall` - Phone clicks
- ⚠️ `ClickEmail` - Email clicks
- ⚠️ `ViewUnit` - Unit views

---

## Step 3: Alternative Method - Using Conversion Labels

If the event matching method above doesn't work, you can use conversion labels. This requires updating your code slightly to include conversion labels in the gtag events.

### 3.1 Get Conversion Labels

For each conversion action you created:
1. Go to the conversion action details
2. Look for **Tag setup** → **Event snippet**
3. Find the **Conversion label** (format: `AbC-D_efG-H` or similar)
4. Copy this label for each conversion action

### 3.2 Update Your Code (If Needed)

Currently, your code sends events like this:
```typescript
gtag('event', 'StartApplication', { source: 'listings-grid', ... });
```

To use conversion labels, you would need to include the label:
```typescript
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXXXX/label',
  // ... other params
});
```

However, **this is NOT recommended** because:
- It requires hardcoding conversion labels in your code
- It makes the code less flexible
- Modern Google Ads supports event-based matching (Option A above)

**Recommendation**: Use the event matching method (Step 2.2, Option A) instead.

---

## Step 4: Verify Conversion Tracking

### 4.1 Test Events in Browser Console

1. Open your website in a browser
2. Open Developer Tools (F12) → **Console** tab
3. Check if gtag is loaded:
   ```javascript
   typeof window.gtag === 'function'  // Should return true
   ```

4. Manually trigger a test event:
   ```javascript
   window.gtag('event', 'StartApplication', {
     test: true,
     source: 'manual-test'
   });
   ```

5. Check the Network tab:
   - Filter by `google-analytics.com` or `googletagmanager.com`
   - You should see requests to `google-analytics.com/g/collect`
   - These requests contain your event data

### 4.2 Use Google Tag Assistant

1. Install the [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visit your website
3. Click the Tag Assistant extension icon
4. It will show:
   - Detected tags (including your Google Ads tag)
   - Events being fired
   - Conversion actions being triggered

### 4.3 Check Google Ads Conversion Tracking

1. Go to **Tools & Settings** → **Conversions** in Google Ads
2. Click on a conversion action
3. Look for **Recent conversions** or **Test conversions** section
4. Perform the action on your website (e.g., click "Apply Now")
5. Wait a few minutes and check if the conversion appears

**Note**: Conversions may take 3-24 hours to appear in reports, but test conversions usually show up within a few minutes.

### 4.4 Use Google Ads Tag Assistant (Built-in)

1. In Google Ads, go to **Tools & Settings** → **Conversions**
2. Click **Tag Assistant** (or find it under "Setup" section)
3. Enter your website URL
4. Click **Test** to simulate a visit
5. It will show which tags fire and which conversions are triggered

---

## Step 5: Monitor Conversions

After setup, monitor your conversions:

1. **Conversions Dashboard**:
   - Go to **Tools & Settings** → **Conversions**
   - View conversion counts, values, and trends

2. **Campaign Performance**:
   - Go to **Campaigns** or **Ad Groups**
   - Add "Conversions" columns to see which campaigns drive conversions

3. **Conversion Action Details**:
   - Click on a conversion action
   - View conversion data, attribution, and paths

---

## Recommended Conversion Setup

Based on your current events, here's a recommended setup:

### Primary Conversions (Track Everything)

| Event Name | Conversion Name | Category | Include in Conversions |
|------------|----------------|----------|----------------------|
| `SubmitLead` | Lead Form Submission | Submit lead form | ✅ Yes |
| `StartApplication` | Application Started | Submit lead form | ✅ Yes |

### Secondary Conversions (Track for Insights)

| Event Name | Conversion Name | Category | Include in Conversions |
|------------|----------------|----------|----------------------|
| `ScheduleTour` | Tour Scheduled | Schedule a visit | ⚠️ No |
| `ClickCall` | Phone Call Click | Phone call lead | ⚠️ No |
| `ClickEmail` | Email Click | Email lead | ⚠️ No |

### Micro-Conversions (Optional)

| Event Name | Conversion Name | Category | Include in Conversions |
|------------|----------------|----------|----------------------|
| `ViewUnit` | Unit Viewed | Page view | ⚠️ No |

**Why Secondary = "No"?**
- These are helpful for understanding user behavior
- But they can inflate your "Conversions" metric
- Google Ads bidding algorithms work better with primary conversions only
- You can still see these in reports, just not in main conversion columns

---

## Troubleshooting

### Issue: Conversions not showing up

**Check:**
1. ✅ Is `PUBLIC_GOOGLE_ADS_ID` environment variable set correctly?
2. ✅ Is the Google Ads tag loading on your site? (Check Network tab)
3. ✅ Are events firing? (Check browser console with Tag Assistant)
4. ✅ Does the event name match exactly? (Case-sensitive!)
5. ✅ Is the conversion action configured to listen for that event name?
6. ✅ Wait 3-24 hours for conversions to appear in reports

### Issue: Events firing but not converting

**Possible causes:**
1. Event name mismatch - The event name in your code must match exactly what you configured in Google Ads
2. Conversion window - Conversions only count within the attribution window (default 30 days)
3. Count setting - If set to "One conversion", multiple events from same user won't count
4. Include in conversions - Check if "Include in 'Conversions'" is enabled

### Issue: Duplicate conversions

**If you see duplicate conversions:**
1. Check if you have multiple conversion actions listening to the same event
2. Verify you're not sending the same event multiple times in your code
3. Check attribution model settings

---

## Current Event Names Reference

Your application currently sends these events (from `src/lib/analytics.ts`):

- `PageView` - Automatic page views (usually tracked automatically by gtag)
- `ViewUnit` - When users view a unit listing
- `StartApplication` - When users click "Apply Now" buttons
- `SubmitApplication` - When users complete an application
- `SubmitLead` - When users submit contact/lead forms
- `ClickCall` - When users click phone number links
- `ClickEmail` - When users click email links
- `ScheduleTour` - When users schedule a property tour

**Important**: Event names are **case-sensitive**. Make sure the event names in Google Ads conversion actions match exactly.

---

## Additional Resources

- [Google Ads Help: About conversion tracking](https://support.google.com/google-ads/answer/1722054)
- [Google Ads Help: Set up conversion tracking](https://support.google.com/google-ads/answer/1722022)
- [Google Tag Assistant](https://tagassistant.google.com/)
- [Google Ads Conversion Tracking Troubleshooting](https://support.google.com/google-ads/answer/1722065)

---

## Next Steps

1. ✅ Verify your `PUBLIC_GOOGLE_ADS_ID` is set correctly
2. ✅ Create conversion actions in Google Ads for each event you want to track
3. ✅ Configure event matching for each conversion action
4. ✅ Test conversions using Tag Assistant or browser console
5. ✅ Monitor conversions in Google Ads dashboard after 24 hours
6. ✅ Optimize campaigns based on conversion data




