/**
 * CMS Highlight Toggle Utility
 * Allows toggling CMS highlighting on/off in dev mode
 * Uses localStorage to persist preference
 */

import { writable } from 'svelte/store';

import { browser, dev } from '$app/environment';

const STORAGE_KEY = '_cms_highlight_enabled';
const DEFAULT_ENABLED = true; // Enabled by default in dev mode

// Create a writable store for the highlight state
function createCmsHighlightStore() {
  const { subscribe, set, update } = writable(DEFAULT_ENABLED);

  // Initialize from localStorage on client
  if (browser && dev) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        set(stored === 'true');
      }
    } catch {
      // localStorage not available, use default
    }
  }

  return {
    subscribe,
    set: value => {
      if (browser && dev) {
        try {
          localStorage.setItem(STORAGE_KEY, String(value));
        } catch {
          // localStorage not available
        }
      }
      set(value);
    },
    toggle: () => {
      update(current => {
        const next = !current;
        if (browser && dev) {
          try {
            localStorage.setItem(STORAGE_KEY, String(next));
          } catch {
            // localStorage not available
          }
        }
        return next;
      });
    },
    // Get current value synchronously (for non-reactive contexts)
    get: () => {
      if (browser && dev) {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          return stored !== null ? stored === 'true' : DEFAULT_ENABLED;
        } catch {
          return DEFAULT_ENABLED;
        }
      }
      return false; // Always false in production
    },
  };
}

export const cmsHighlightEnabled = createCmsHighlightStore();

/**
 * Initialize keyboard shortcut listener
 * Press 'H' key to toggle highlights (only in dev mode)
 */
export function initCmsHighlightToggle() {
  if (!browser || !dev) return;

  const handleKeyPress = e => {
    // Press 'H' key (case insensitive) to toggle
    // Only if not typing in an input/textarea
    if (
      (e.key === 'h' || e.key === 'H') &&
      e.target.tagName !== 'INPUT' &&
      e.target.tagName !== 'TEXTAREA' &&
      !e.target.isContentEditable
    ) {
      // Don't toggle if modifier keys are pressed (to avoid conflicts)
      if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        cmsHighlightEnabled.toggle();
        showToggleNotification();
      }
    }
  };

  window.addEventListener('keydown', handleKeyPress);

  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyPress);
  };
}

/**
 * Show a brief notification when toggling
 */
function showToggleNotification() {
  // Create or update notification element
  let notification = document.getElementById('cms-highlight-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'cms-highlight-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-family: monospace;
      z-index: 10000;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(notification);
  }

  // Get current state
  const enabled = cmsHighlightEnabled.get();
  notification.textContent = `CMS Highlights: ${enabled ? 'ON' : 'OFF'}`;
  notification.style.opacity = '1';
  notification.style.display = 'block';

  // Fade out after 2 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 300);
  }, 2000);
}
