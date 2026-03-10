<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  import { browser, dev } from '$app/environment';

  import { cmsHighlightEnabled } from '$lib/utils/cms-highlight-toggle.js';

  let visible = $state(true);
  let dismissed = $state(false);
  let highlightEnabled = $state(true);

  // Only show in dev mode
  const shouldShow = $derived(dev && browser && !dismissed);

  // Subscribe to highlight state
  $effect(() => {
    const unsubscribe = cmsHighlightEnabled.subscribe(enabled => {
      highlightEnabled = enabled;
    });
    return unsubscribe;
  });

  onMount(() => {
    // Check if user has dismissed it before
    try {
      const wasDismissed = localStorage.getItem('_cms_hint_dismissed');
      if (wasDismissed === 'true') {
        dismissed = true;
        visible = false;
      } else {
        // Auto-hide after 5 seconds
        setTimeout(() => {
          visible = false;
        }, 5000);
      }
    } catch {
      // localStorage not available
    }
  });

  function dismiss() {
    dismissed = true;
    visible = false;
    try {
      localStorage.setItem('_cms_hint_dismissed', 'true');
    } catch {
      // localStorage not available
    }
  }
</script>

{#if shouldShow && visible}
  <div
    class="cms-hint-overlay"
    transition:fly={{ y: 50, duration: 300 }}
    onclick={dismiss}
    role="button"
    tabindex="0"
    onkeydown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        dismiss();
      }
    }}
  >
    <span class="cms-hint-text"
      >Highlights {highlightEnabled ? 'on' : 'off'} • Press 'H' to toggle</span
    >
    <button class="cms-hint-close" onclick={dismiss} aria-label="Dismiss">×</button>
  </div>
{/if}

<style>
  .cms-hint-overlay {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-family: monospace;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .cms-hint-overlay:hover {
    background: rgba(0, 0, 0, 0.95);
    transform: translateX(-50%) translateY(-2px);
  }

  .cms-hint-text {
    white-space: nowrap;
  }

  .cms-hint-close {
    background: transparent;
    border: none;
    color: white;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  .cms-hint-close:hover {
    opacity: 1;
  }

  .cms-hint-close:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
    border-radius: 2px;
  }
</style>
