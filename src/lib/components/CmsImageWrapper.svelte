<script>
  import { dev } from '$app/environment';

  import { cmsHighlightEnabled } from '$lib/utils/cms-highlight-toggle.js';

  let {
    mediaItem = null,
    isCms = null,
    fieldName = '',
    class: className = '',
    children,
    ...restProps
  } = $props();

  const isDev = dev;
  const isCmsImage = $derived(isCms !== null ? isCms : mediaItem !== null);

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
  <div
    class={className}
    class:cms-image-wrapper={shouldHighlight}
    data-cms-field={fieldName}
    {...restProps}
  >
    {@render children()}
  </div>
{:else}
  <div class={className} class:cms-image-wrapper={shouldHighlight} {...restProps}>
    {@render children()}
  </div>
{/if}

<style>
  /* Yellow border overlay for CMS background images in dev mode */
  :global(.cms-image-wrapper) {
    position: relative;
    cursor: help;
  }

  :global(.cms-image-wrapper::before) {
    content: '';
    position: absolute;
    inset: 0;
    border: 3px solid rgba(255, 235, 59, 0.8);
    box-shadow:
      0 0 0 2px rgba(255, 235, 59, 0.4),
      inset 0 0 0 2px rgba(255, 235, 59, 0.2);
    pointer-events: none;
    z-index: 1;
    border-radius: inherit;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  :global(.cms-image-wrapper:hover::before) {
    border-color: rgba(255, 235, 59, 1);
    box-shadow:
      0 0 0 2px rgba(255, 235, 59, 0.6),
      inset 0 0 0 2px rgba(255, 235, 59, 0.3);
  }

  /* Tooltip for CMS background images */
  :global(.cms-image-wrapper[data-cms-field]:hover::after) {
    content: attr(data-cms-field);
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
    pointer-events: none;
    font-family: monospace;
  }
</style>
