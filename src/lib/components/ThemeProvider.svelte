<script>
  import { onMount } from 'svelte';

  /**
   * Theme provider component that applies compiled theme CSS variables from backend
   * @param {object} compiledTheme - Compiled theme from backend with compiledTokens
   */
  let { compiledTheme = null } = $props();

  /**
   * Extract custom CSS from compiled theme
   * @param {object} compiledTheme - Compiled theme object
   * @returns {string|null} Custom CSS string or null
   */
  function extractCustomCss(compiledTheme) {
    if (compiledTheme?.compiledTokens?.overrides?.customCss) {
      return compiledTheme.compiledTokens.overrides.customCss;
    }
    return null;
  }

  /**
   * Inject custom CSS into document head
   * @param {string} css - CSS string to inject
   */
  function injectCustomCss(css) {
    if (typeof document === 'undefined' || !css) return;

    // Remove existing custom CSS style tag if present
    const existing = document.getElementById('theme-custom-css');
    if (existing) {
      existing.remove();
    }

    // Create and inject new style tag
    const style = document.createElement('style');
    style.id = 'theme-custom-css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * Apply compiled theme CSS variables to the document root
   * @param {object|null} compiledTheme - Compiled theme from backend
   */
  function applyTheme(compiledTheme) {
    if (typeof document === 'undefined' || !compiledTheme?.compiledTokens) return;

    // Extract CSS variables from compiledTokens, excluding the 'overrides' key
    // eslint-disable-next-line no-unused-vars
    const { overrides, ...cssVariables } = compiledTheme.compiledTokens;

    // Apply CSS variables to :root
    Object.entries(cssVariables).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        document.documentElement.style.setProperty(key, value);
      }
    });

    // Extract and inject custom CSS if present
    const customCss = extractCustomCss(compiledTheme);
    if (customCss) {
      injectCustomCss(customCss);
    }
  }

  onMount(() => {
    applyTheme(compiledTheme);
  });

  // Re-apply theme when compiledTheme changes
  $effect(() => {
    applyTheme(compiledTheme);
  });
</script>

<!-- This component doesn't render anything, it just applies CSS variables -->
<div style:display="none" aria-hidden="true"></div>
