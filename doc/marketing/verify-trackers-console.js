/* eslint-disable */
/**
 * Marketing Tracker Verification Script
 * 
 * Paste this entire script into your browser console (F12 → Console tab)
 * to quickly verify all marketing trackers are working.
 */

(function() {
  console.log('%c=== Marketing Tracker Verification ===', 'font-size: 16px; font-weight: bold; color: #2563eb;');
  console.log('');
  
  // First, check if script tags are in the DOM
  console.log('%c=== Script Tags in DOM ===', 'font-size: 14px; font-weight: bold;');
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const trackerScripts = {
    plausible: scripts.filter(s => s.src.includes('plausible.io')),
    clarity: scripts.filter(s => s.src.includes('clarity.ms')),
    googleAds: scripts.filter(s => s.src.includes('googletagmanager.com') || s.src.includes('google-analytics.com')),
    metaPixel: scripts.filter(s => s.src.includes('facebook.net') || s.src.includes('facebook.com'))
  };
  
  console.log('Plausible scripts:', trackerScripts.plausible.length > 0 ? '✅ Found' : '❌ Not found');
  if (trackerScripts.plausible.length > 0) {
    trackerScripts.plausible.forEach(s => console.log('   -', s.src));
  }
  
  console.log('Clarity scripts:', trackerScripts.clarity.length > 0 ? '✅ Found' : '❌ Not found');
  if (trackerScripts.clarity.length > 0) {
    trackerScripts.clarity.forEach(s => console.log('   -', s.src));
  }
  
  console.log('Google Ads scripts:', trackerScripts.googleAds.length > 0 ? '✅ Found' : '❌ Not found');
  if (trackerScripts.googleAds.length > 0) {
    trackerScripts.googleAds.forEach(s => console.log('   -', s.src));
  }
  
  console.log('Meta Pixel scripts:', trackerScripts.metaPixel.length > 0 ? '✅ Found' : '❌ Not found');
  if (trackerScripts.metaPixel.length > 0) {
    trackerScripts.metaPixel.forEach(s => console.log('   -', s.src));
  }
  
  console.log('');
  console.log('%c=== Window Functions ===', 'font-size: 14px; font-weight: bold;');
  
  const results = {
    plausible: false,
    clarity: false,
    googleAds: false,
    metaPixel: false,
  };
  
  // Check Plausible
  const plausibleLoaded = typeof window.plausible === 'function';
  results.plausible = plausibleLoaded;
  console.log(
    plausibleLoaded ? '✅ Plausible: Loaded' : '❌ Plausible: Not loaded',
    plausibleLoaded ? '' : '(Script tag may be missing or not executed yet)'
  );
  if (plausibleLoaded) {
    console.log('   Function type:', typeof window.plausible);
    if (window.plausible.q) {
      console.log('   Queue length:', window.plausible.q.length);
    }
  } else if (trackerScripts.plausible.length === 0) {
    console.log('   ⚠️  No Plausible script tag found in DOM - check PUBLIC_PLAUSIBLE_PROJECT_ID env var');
  }
  
  // Check Microsoft Clarity
  const clarityLoaded = typeof window.clarity === 'function';
  results.clarity = clarityLoaded;
  console.log(
    clarityLoaded ? '✅ Microsoft Clarity: Loaded' : '❌ Microsoft Clarity: Not loaded',
    clarityLoaded ? '' : '(Script tag may be missing or not executed yet)'
  );
  if (clarityLoaded && window.clarity) {
    try {
      const clarityId = window.clarity('get', 'id');
      if (clarityId) {
        console.log('   Clarity ID:', clarityId);
      }
    } catch {
      // Ignore errors
    }
  } else if (trackerScripts.clarity.length === 0) {
    console.log('   ⚠️  No Clarity script tag found in DOM - check PUBLIC_CLARITY_PROJECT_ID env var');
  }
  
  // Check Google Ads (gtag)
  // Google Tag Manager script loads async, so gtag might not be immediately available
  // Check both window.gtag and if dataLayer exists (which means script is loading/loaded)
  const gtagLoaded = typeof window.gtag === 'function';
  const hasDataLayer = typeof window.dataLayer !== 'undefined' && Array.isArray(window.dataLayer);
  // Consider it working if either gtag exists OR dataLayer exists (script is loading)
  results.googleAds = gtagLoaded || (hasDataLayer && trackerScripts.googleAds.length > 0);
  
  if (gtagLoaded) {
    console.log('✅ Google Ads (gtag): Loaded');
    console.log('   Function type:', typeof window.gtag);
  } else if (hasDataLayer && trackerScripts.googleAds.length > 0) {
    console.log('⚠️  Google Ads: Script loading (gtag function not yet available)');
    console.log('   This is normal - Google Tag Manager loads asynchronously');
    console.log('   The script tag is present and dataLayer exists');
  } else {
    console.log('❌ Google Ads (gtag): Not loaded', '(Script tag may be missing or not executed yet)');
  }
  
  if (window.dataLayer) {
    console.log('   dataLayer items:', window.dataLayer.length);
    if (window.dataLayer.length > 0) {
      console.log('   Latest dataLayer entry:', window.dataLayer[window.dataLayer.length - 1]);
    }
  } else {
    console.log('   ⚠️  dataLayer not found');
  }
  if (!gtagLoaded && trackerScripts.googleAds.length === 0) {
    console.log('   ⚠️  No Google Ads script tag found in DOM - check PUBLIC_GOOGLE_ADS_ID env var');
  }
  
  // Check Meta Pixel
  const fbqLoaded = typeof window.fbq === 'function';
  results.metaPixel = fbqLoaded;
  console.log(
    fbqLoaded ? '✅ Meta Pixel: Loaded' : '❌ Meta Pixel: Not loaded',
    fbqLoaded ? '' : '(Script tag may be missing or not executed yet)'
  );
  if (fbqLoaded) {
    console.log('   Function type:', typeof window.fbq);
  }
  if (window._fbq) {
    console.log('   Pixel ID:', window._fbq.id || 'Not set');
    if (window._fbq.queue) {
      console.log('   Queue length:', window._fbq.queue.length);
    }
  }
  if (!fbqLoaded && trackerScripts.metaPixel.length === 0) {
    console.log('   ⚠️  No Meta Pixel script tag found in DOM - check PUBLIC_META_PIXEL_ID env var');
  }
  
  console.log('');
  console.log('%c=== Network Requests ===', 'font-size: 14px; font-weight: bold;');
  console.log('Open Network tab (F12 → Network) and filter for:');
  console.log('  - plausible.io');
  console.log('  - clarity.ms');
  console.log('  - googletagmanager.com');
  console.log('  - facebook.net');
  console.log('');
  console.log('Look for:');
  console.log('  ✅ 200 OK = Script loaded successfully');
  console.log('  ❌ 404 = Script not found (check env vars)');
  console.log('  ⚠️  Blocked = Ad blocker may be interfering');
  
  console.log('');
  console.log('%c=== Summary ===', 'font-size: 14px; font-weight: bold;');
  const allLoaded = Object.values(results).every(v => v === true);
  const loadedCount = Object.values(results).filter(v => v === true).length;
  const totalCount = Object.keys(results).length;
  
  if (allLoaded) {
    console.log(`%c✅ All ${totalCount} trackers are loaded!`, 'color: green; font-weight: bold;');
  } else {
    console.log(`%c⚠️  ${loadedCount}/${totalCount} trackers loaded`, 'color: orange; font-weight: bold;');
    const missing = Object.entries(results)
      .filter(([, loaded]) => !loaded)
      .map(([name]) => name);
    console.log('Missing:', missing.join(', '));
    
    // Check if scripts are missing from DOM
    const missingScripts = [];
    if (!results.plausible && trackerScripts.plausible.length === 0) missingScripts.push('Plausible');
    if (!results.clarity && trackerScripts.clarity.length === 0) missingScripts.push('Clarity');
    if (!results.googleAds && trackerScripts.googleAds.length === 0) missingScripts.push('Google Ads');
    if (!results.metaPixel && trackerScripts.metaPixel.length === 0) missingScripts.push('Meta Pixel');
    
    if (missingScripts.length > 0) {
      console.log('');
      console.log('%c🔧 Action Required:', 'font-weight: bold; color: red;');
      console.log('Script tags are missing from the DOM. This means environment variables are likely not set.');
      console.log('Missing script tags for:', missingScripts.join(', '));
      console.log('');
      console.log('To fix:');
      console.log('1. Create/update .env file in project root with:');
      missingScripts.forEach(name => {
        const varName = {
          'Plausible': 'PUBLIC_PLAUSIBLE_PROJECT_ID',
          'Clarity': 'PUBLIC_CLARITY_PROJECT_ID',
          'Google Ads': 'PUBLIC_GOOGLE_ADS_ID',
          'Meta Pixel': 'PUBLIC_META_PIXEL_ID'
        }[name];
        console.log(`   ${varName}=your-id-here`);
      });
      console.log('2. Restart your dev server');
      console.log('3. For production, set these in your deployment environment (GitHub Secrets, Azure, etc.)');
    }
  }
  
  console.log('');
  console.log('%c=== Next Steps ===', 'font-size: 14px; font-weight: bold;');
  console.log('1. Check Network tab for script loading (filter by tracker domains)');
  console.log('2. Verify environment variables are set in your .env file');
  console.log('3. Check for ad blockers that might be blocking scripts');
  console.log('4. Visit tracker dashboards to verify real-time data');
  console.log('5. View page source (Cmd+Option+U / Ctrl+U) and search for script tags');
  console.log('');
  console.log('For detailed instructions, see: doc/marketing/VERIFY_TRACKERS.md');
  
  return {
    results,
    scriptTags: trackerScripts,
    allLoaded
  };
})();

