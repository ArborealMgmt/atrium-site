<script>
  import { dev } from '$app/environment';

  import { cmsHighlightEnabled } from '$lib/utils/cms-highlight-toggle.js';

  let {
    src,
    alt = '',
    class: className = '',
    mediaItem = null,
    fieldName = '',
    isCms = null,
    ...restProps
  } = $props();

  const isDev = dev;

  // Determine if this is a CMS image
  const isCmsImage = $derived(
    isCms !== null
      ? isCms
      : mediaItem !== null ||
          (src && (src.includes('cloudinary') || src.includes('res.cloudinary.com')))
  );

  let highlightEnabled = $state(true);

  // Subscribe to toggle store
  $effect(() => {
    const unsubscribe = cmsHighlightEnabled.subscribe(enabled => {
      highlightEnabled = enabled;
    });
    return unsubscribe;
  });

  const shouldHighlight = $derived(isDev && isCmsImage && highlightEnabled);
  const showTooltip = $derived(isDev && isCmsImage && fieldName);
</script>

{#if showTooltip}
  <div class="cms-image-container" data-cms-field={fieldName}>
    <img {src} {alt} class={className} class:cms-image={shouldHighlight} {...restProps} />
  </div>
{:else}
  <div class="cms-image-container">
    <img {src} {alt} class={className} class:cms-image={shouldHighlight} {...restProps} />
  </div>
{/if}

<style>
  .cms-image-container {
    position: relative;
    display: inline-block;
  }

  /* Yellow border for CMS images in dev mode */
  :global(.cms-image) {
    border: 3px solid rgba(255, 235, 59, 0.8) !important;
    box-shadow:
      0 0 0 2px rgba(255, 235, 59, 0.4),
      0 0 8px rgba(255, 235, 59, 0.3) !important;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    cursor: help;
  }

  :global(.cms-image:hover) {
    border-color: rgba(255, 235, 59, 1) !important;
    box-shadow:
      0 0 0 2px rgba(255, 235, 59, 0.6),
      0 0 12px rgba(255, 235, 59, 0.5) !important;
  }

  /* Tooltip for CMS images */
  .cms-image-container[data-cms-field]:hover::after {
    content: attr(data-cms-field);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
    margin-bottom: 8px;
    pointer-events: none;
    font-family: monospace;
  }

  .cms-image-container[data-cms-field]:hover::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
    z-index: 1000;
    margin-bottom: 0;
    pointer-events: none;
  }
</style>
