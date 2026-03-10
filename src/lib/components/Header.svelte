<script>
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';

  import { page } from '$app/stores';

  import { ROUTES } from '$lib/config/routes.js';

  // Navigation items
  const menuItems = $derived([
    { title: 'Gallery', path: '/gallery' },
    { title: 'Neighborhood', path: ROUTES.NEIGHBORHOOD },
    { title: 'Affordable Housing', path: ROUTES.AFFORDABLE },
    { title: 'Floor Plans, Availability, & Apply', path: ROUTES.AVAILABILITY },
    { title: 'Contact', path: ROUTES.CONTACT_US },
  ]);

  // Check if a path is active
  /**
   * @param {string} path
   */
  function isActive(path) {
    const currentPath = $page.url.pathname;
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  }

  // Slide menu state
  let menuOpen = $state(false);
  let headerHeight = $state(0);
  /** @type {HTMLElement | undefined} */
  let headerWrapper;

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  // Prevent body scroll when menu is open
  $effect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  });

  // Close menu on escape key
  /**
   * @param {KeyboardEvent} event
   */
  function handleKeydown(event) {
    if (event.key === 'Escape' && menuOpen) {
      closeMenu();
    }
  }

  // Calculate header height dynamically
  function updateHeaderHeight() {
    if (headerWrapper) {
      const rect = headerWrapper.getBoundingClientRect();
      headerHeight = rect.height;
    }
  }

  // Update height reactively when element changes
  $effect(() => {
    if (headerWrapper) {
      updateHeaderHeight();
    }
  });

  // Update height on mount and resize
  onMount(() => {
    updateHeaderHeight();
    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight();
    });

    if (headerWrapper) {
      resizeObserver.observe(headerWrapper);
    }

    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('keydown', handleKeydown);

    return () => {
      if (headerWrapper) {
        resizeObserver.unobserve(headerWrapper);
      }
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('keydown', handleKeydown);
    };
  });

  // Check if we're on the homepage to determine overlay style
  const isHomepage = $derived($page.url.pathname === '/');
</script>

<div
  class="{isHomepage ? 'absolute' : 'sticky'} top-0 left-0 right-0 z-50 {isHomepage
    ? 'header-fade-gradient'
    : 'bg-white shadow-sm'}"
  bind:this={headerWrapper}
>
  <header class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20 md:h-24 lg:h-28">
      <a href="/" class="flex items-center">
        <img
          src="https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/023f2fcc-81ec-4f99-97e8-6e0ea2c8e9f1/Color-onLight-TransBG-Large.png?format=1500w"
          alt="Terrapin Apartments Logo"
          class="h-14 md:h-20 lg:h-24 w-auto"
        />
      </a>

      <!-- Desktop Navigation -->
      <nav class="hidden xl:flex items-center justify-end gap-10 flex-1">
        {#each menuItems as item (item.path || item.title)}
          <a
            href={item.path}
            class="font-normal text-base transition-colors pb-1 {isHomepage
              ? isActive(item.path)
                ? 'text-primary-main border-b border-primary-main'
                : 'text-primary-main hover:text-primary-main/80'
              : isActive(item.path)
                ? 'text-primary-main border-b border-primary-main'
                : 'text-secondary-main hover:text-primary-main'}"
            data-sveltekit-preload-data="hover"
          >
            {item.title}
          </a>
        {/each}
      </nav>

      <!-- Right side actions -->
      <div class="flex items-center gap-4">
        <!-- Hamburger Menu -->
        <button
          class="xl:hidden p-2 {isHomepage
            ? 'text-white hover:text-white/80'
            : 'text-gray-700 hover:text-primary'} transition-colors cursor-pointer"
          onclick={() => toggleMenu()}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <div class="w-5 h-5 flex flex-col justify-center gap-1.5">
            <span
              class="block h-0.5 w-full {isHomepage
                ? 'bg-white'
                : 'bg-primary-main'} transition-all duration-300"
              class:rotate-45={menuOpen}
              class:translate-y-2={menuOpen}
            ></span>
            <span
              class="block h-0.5 w-full {isHomepage
                ? 'bg-white'
                : 'bg-primary-main'} transition-all duration-300"
              class:opacity-0={menuOpen}
            ></span>
            <span
              class="block h-0.5 w-full {isHomepage
                ? 'bg-white'
                : 'bg-primary-main'} transition-all duration-300"
              class:-rotate-45={menuOpen}
              class:-translate-y-2={menuOpen}
            ></span>
          </div>
        </button>
      </div>
    </div>
  </header>
</div>

<!-- Mobile Menu Backdrop -->
{#if menuOpen}
  <div
    class="fixed inset-0 bg-black/50 z-30 xl:hidden"
    onclick={closeMenu}
    onkeydown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeMenu();
      }
    }}
    role="button"
    tabindex="-1"
    aria-label="Close menu"
  ></div>
{/if}

<!-- Mobile Slide Menu -->
{#if menuOpen}
  <div
    id="mobile-menu"
    class="fixed inset-x-0 bg-primary-main text-white z-40 xl:hidden"
    style:top="{headerHeight}px"
    transition:slide={{ duration: 400, axis: 'y' }}
    role="dialog"
    aria-modal="true"
    aria-label="Navigation menu"
  >
    <nav class="container mx-auto px-4 py-6 flex flex-col gap-4">
      {#each menuItems as item (item.path || item.title)}
        <a
          href={item.path}
          class="py-4 text-xl font-semibold text-center rounded-lg transition-colors hover:bg-white/10 {isActive(
            item.path
          )
            ? 'bg-white/20'
            : ''}"
          onclick={() => closeMenu()}
          data-sveltekit-preload-data="hover"
        >
          {item.title}
        </a>
      {/each}
    </nav>
  </div>
{/if}
