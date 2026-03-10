<script>
  import { dev } from '$app/environment';

  import { cmsHighlightEnabled } from '$lib/utils/cms-highlight-toggle.js';

  let { tag = 'span', value = '', fieldName = '', class: className = '', ...restProps } = $props();

  const isDev = dev;
  const isCmsText = $derived(value && value.trim().length > 0);

  let highlightEnabled = $state(true);

  // Subscribe to toggle store
  $effect(() => {
    const unsubscribe = cmsHighlightEnabled.subscribe(enabled => {
      highlightEnabled = enabled;
    });
    return unsubscribe;
  });

  const shouldHighlight = $derived(isDev && isCmsText && highlightEnabled);
  const showTooltip = $derived(isDev && isCmsText && fieldName);

  const Tag = tag;
  const classes = $derived.by(() => {
    const cmsClass = shouldHighlight ? 'cms-text' : '';
    const tooltipClass = showTooltip ? 'cms-text-tooltip' : '';
    return `${className} ${cmsClass} ${tooltipClass}`.trim();
  });
</script>

{#if showTooltip}
  <svelte:element this={Tag} class={classes} data-cms-field={fieldName} {...restProps}>
    {value}
  </svelte:element>
{:else}
  <svelte:element this={Tag} class={classes} {...restProps}>
    {value}
  </svelte:element>
{/if}

<style>
  /* Yellow highlight for CMS text in dev mode */
  :global(.cms-text) {
    background: linear-gradient(120deg, rgba(255, 235, 59, 0.2) 0%, rgba(255, 235, 59, 0.1) 100%);
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    transition: background 0.2s ease;
  }

  :global(.cms-text:hover) {
    background: linear-gradient(120deg, rgba(255, 235, 59, 0.3) 0%, rgba(255, 235, 59, 0.15) 100%);
  }

  /* Tooltip class - works independently of highlight */
  :global(.cms-text-tooltip) {
    cursor: help;
    position: relative;
  }

  /* Tooltip styling */
  :global(.cms-text-tooltip[data-cms-field]:hover::after) {
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
    margin-bottom: 4px;
    pointer-events: none;
    font-family: monospace;
  }

  :global(.cms-text-tooltip[data-cms-field]:hover::before) {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
    z-index: 1000;
    margin-bottom: -4px;
    pointer-events: none;
  }

  /* Also show tooltip on highlighted text */
  :global(.cms-text[data-cms-field]:hover::after) {
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
    margin-bottom: 4px;
    pointer-events: none;
    font-family: monospace;
  }

  :global(.cms-text[data-cms-field]:hover::before) {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
    z-index: 1000;
    margin-bottom: -4px;
    pointer-events: none;
  }
</style>
