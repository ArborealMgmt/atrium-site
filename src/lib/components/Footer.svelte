<script>
  import { page } from '$app/stores';

  import { track } from '$lib/analytics';
  import { ROUTES } from '$lib/config/routes.js';

  // Contact information - using specified values
  const email = 'live@theterrapinapts.com';
  const phone = '(425) 222-2911';
  const address = '290 106th PL NE, Bellevue WA 98004';

  // Check if we're on the homepage
  const isHomepage = $derived($page.url.pathname === '/');
</script>

<footer class="bg-white">
  <!-- Top Border with Pattern (Homepage only) -->
  {#if isHomepage}
    <div class="h-px bg-primary"></div>
    <div
      class="h-10"
      style:background-image="url('https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/9992bb25-1424-4f49-9072-a4de63fef76c/TurtleSkinPattern-ltGreen.png?format=2500w')"
      style:background-size="contain"
      style:background-repeat="repeat"
    ></div>
  {/if}

  <!-- Main Content Area -->
  <div class="bg-white py-12 md:py-16 lg:py-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Logo Section -->
      <div class="flex justify-center mb-8 md:mb-12">
        <a
          href={ROUTES.HOME}
          class="inline-block hover:opacity-80 transition-opacity"
          onclick={() => track('ClickLogo', { location: 'footer' })}
          aria-label="Go to home page"
          data-sveltekit-preload-data="hover"
        >
          <img
            src="https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/023f2fcc-81ec-4f99-97e8-6e0ea2c8e9f1/Color-onLight-TransBG-Large.png?format=1500w"
            alt="Terrapin Apartments Logo"
            class="h-24 md:h-32 lg:h-40 w-auto"
          />
        </a>
      </div>

      <!-- Decorative Lines -->
      <div class="relative flex items-center justify-center mb-8 md:mb-12">
        <div class="absolute left-0 h-px bg-gray-300 w-[35%] md:w-[40%]"></div>
        <div class="absolute right-0 h-px bg-gray-300 w-[35%] md:w-[40%]"></div>
      </div>

      <!-- Contact Information -->
      <div
        class="flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-10 text-primary-main text-lg md:text-lg lg:text-xl"
      >
        <a
          href={`mailto:${email}`}
          class="underline hover:opacity-80 transition-opacity"
          onclick={() => track('ClickEmail', { location: 'footer' })}
        >
          {email}
        </a>
        <a
          href={`tel:${phone.replace(/[^\d]/g, '')}`}
          class="hover:opacity-80 transition-opacity"
          onclick={() => track('ClickCall', { location: 'footer' })}
        >
          {phone}
        </a>
        <span class="text-center md:text-left">{address}</span>
      </div>
    </div>
  </div>

  <!-- Bottom Border -->
  <div class="h-16 bg-primary-main"></div>
</footer>
