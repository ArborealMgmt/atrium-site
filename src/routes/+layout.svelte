<!-- src/routes/+layout.svelte -->
<script>
  import { onMount } from 'svelte';

  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  import { initializeAnalytics, trackPageView } from '$lib/analytics';
  import CmsHighlightHint from '$lib/components/CmsHighlightHint.svelte';
  import ScrollToTop from '$lib/components/ScrollToTop.svelte';
  import ThemeProvider from '$lib/components/ThemeProvider.svelte';
  import { siteConfig } from '$lib/config/site-config.js';
  import { initCmsHighlightToggle } from '$lib/utils/cms-highlight-toggle.js';

  import '../app.css';

  import '$lib/logger.client.js';

  let { children, data } = $props();

  // Get compiled theme from layout data (available during SSR)
  const layoutCompiledTheme = $derived(data?.compiledTheme);

  // On client, also check page data for theme (for reactivity)
  // Only access $page store on client to avoid SSR subscription errors
  let pageCompiledTheme = $state(null);

  if (browser) {
    // Update from page data reactively on client
    $effect(() => {
      const pageData = $page.data;
      pageCompiledTheme = pageData?.compiledTheme ?? null;
    });

    // Initialize CMS highlight toggle (keyboard shortcut)
    $effect(() => {
      const cleanup = initCmsHighlightToggle();
      return cleanup;
    });
  }

  // Use page theme if available, otherwise use layout theme
  const compiledTheme = $derived(
    browser && pageCompiledTheme ? pageCompiledTheme : layoutCompiledTheme
  );

  // Analytics config (hardcoded in site-config.js)
  const PLAUSIBLE_PROJECT_ID = siteConfig.plausibleProjectId;
  const CLARITY_PROJECT_ID = siteConfig.clarityProjectId;
  const GOOGLE_ADS_ID = siteConfig.googleAdsId;
  const META_PIXEL_ID = siteConfig.metaPixelId;

  // Inject analytics scripts on client side
  if (browser) {
    $effect(() => {
      // @ts-ignore - tracker functions are added dynamically to window object
      const w = window;

      // Plausible initialization script
      // @ts-ignore
      if (PLAUSIBLE_PROJECT_ID && typeof w.plausible !== 'function') {
        // @ts-ignore
        w.plausible =
          // @ts-ignore
          w.plausible ||
          function () {
            // @ts-ignore
            (w.plausible.q = w.plausible.q || []).push(arguments);
          };
        // @ts-ignore
        w.plausible.init =
          // @ts-ignore
          w.plausible.init ||
          // @ts-ignore
          function (config) {
            // @ts-ignore
            w.plausible.o = config || {};
          };
        // @ts-ignore
        // Initialize with current domain for multi-domain tracking
        // hashMode enables tracking cross-domain movement
        w.plausible.init({
          domain: w.location.hostname,
          trackLocalhost: false,
          hashMode: true,
        });
      }

      // Google Ads dataLayer initialization
      // @ts-ignore
      if (GOOGLE_ADS_ID) {
        // @ts-ignore
        w.dataLayer = w.dataLayer || [];
        // @ts-ignore
        // Google Tag Manager script defines gtag automatically, but we provide a fallback
        if (typeof w.gtag !== 'function') {
          // @ts-ignore
          w.gtag = function () {
            // @ts-ignore
            w.dataLayer.push(arguments);
          };
          // @ts-ignore
          w.gtag('js', new Date());
          // @ts-ignore
          w.gtag('config', GOOGLE_ADS_ID);
        }
      }

      // Meta Pixel initialization
      // @ts-ignore
      if (META_PIXEL_ID && typeof w.fbq !== 'function') {
        // @ts-ignore - Meta Pixel initialization code
        void (function (f, b, e, v, n, t, s) {
          // @ts-ignore
          if (f.fbq) return;
          // @ts-ignore
          n = f.fbq = function () {
            // @ts-ignore
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          // @ts-ignore
          if (!f._fbq) f._fbq = n;
          // @ts-ignore
          n.push = n;
          // @ts-ignore
          n.loaded = !0;
          // @ts-ignore
          n.version = '2.0';
          // @ts-ignore
          n.queue = [];
          // @ts-ignore
          t = b.createElement(e);
          // @ts-ignore
          t.async = !0;
          // @ts-ignore
          t.src = 'https://connect.facebook.net/en_US/fbevents.js';
          // @ts-ignore
          s = b.getElementsByTagName(e)[0];
          // @ts-ignore
          s.parentNode.insertBefore(t, s);
        })(
          window,
          document,
          'script',
          'https://connect.facebook.net/en_US/fbevents.js',
          null,
          null,
          null
        );
        // @ts-ignore
        w.fbq('init', META_PIXEL_ID);
        // @ts-ignore
        w.fbq('track', 'PageView');
      }

      // Microsoft Clarity initialization
      // @ts-ignore
      if (CLARITY_PROJECT_ID && typeof w.clarity !== 'function') {
        // @ts-ignore - Clarity initialization code
        (function (c, l, a, r, i, t, y) {
          // @ts-ignore
          c[a] =
            // @ts-ignore
            c[a] ||
            function () {
              // @ts-ignore
              (c[a].q = c[a].q || []).push(arguments);
            };
          // @ts-ignore
          t = l.createElement(r);
          // @ts-ignore
          t.async = 1;
          // @ts-ignore
          t.src = 'https://www.clarity.ms/tag/' + i;
          // @ts-ignore
          y = l.getElementsByTagName(r)[0];
          // @ts-ignore
          y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', CLARITY_PROJECT_ID, null, null);
      }
    });

    // Track pageviews with Plausible on route changes
    $effect(() => {
      if (PLAUSIBLE_PROJECT_ID) {
        // Track pageview when route changes (accessing $page.url triggers effect on navigation)
        // @ts-ignore
        const w = window;
        // @ts-ignore
        if (typeof w.plausible === 'function') {
          // @ts-ignore
          w.plausible('pageview', {
            props: { site: w.location.hostname },
          });
        }
      }
      // Access $page.url to make this effect reactive to route changes
      $page.url;
    });
  }

  // Initialize analytics on mount
  onMount(() => {
    initializeAnalytics();
  });

  // Track page views on route change (Svelte 5 syntax)
  $effect(() => {
    if (browser && $page.url.pathname) {
      trackPageView($page.url.pathname);
    }
  });
</script>

<svelte:head>
  {#if PLAUSIBLE_PROJECT_ID}
    <!-- Plausible Analytics - Project-specific script with explicit domain configuration -->
    <!-- Domain is set dynamically via plausible.init() with hashMode enabled for cross-domain tracking -->
    <script async src={'https://plausible.io/js/' + PLAUSIBLE_PROJECT_ID + '.js'}></script>
  {/if}

  {#if GOOGLE_ADS_ID}
    <!-- Google Ads / gtag -->
    <script async src={'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ADS_ID}></script>
  {/if}

  {#if META_PIXEL_ID}
    <!-- Meta Pixel noscript fallback -->
    <noscript>
      <img
        alt=""
        height="1"
        width="1"
        style:display="none"
        src={'https://www.facebook.com/tr?id=' + META_PIXEL_ID + '&ev=PageView&noscript=1'}
      />
    </noscript>
  {/if}
</svelte:head>

<!-- Apply compiled theme if available from page data -->
{#if compiledTheme}
  <ThemeProvider {compiledTheme} />
{/if}

<!-- Skip to main content link for accessibility -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-main focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2"
>
  Skip to main content
</a>

<main id="main-content">
  {@render children()}
</main>

<ScrollToTop />
<CmsHighlightHint />
