<script>
  import { track } from '$lib/analytics';
  import { ROUTES } from '$lib/config/routes.js';

  // Contact information - using specified values
  const email = 'leasing@arboreal.management';
  const phone = '(206) 222-7549';
  const address = '7324 Martin Luther King Jr Way S, Seattle WA 98118';

  let logoError = $state(false);
</script>

<footer>
  <!-- Atrium contact bar: #D8E8EF bg, #151028 text -->
  <div class="bg-atrium-section py-12 md:py-16 lg:py-20">
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
          {#if logoError}
            <span class="text-2xl md:text-3xl font-bold text-atrium-navy tracking-wide"
              >Atrium Court</span
            >
          {:else}
            <img
              src="/images/Atrium-Court-Logo.png?v=1"
              alt="Atrium Court"
              class="h-24 md:h-32 lg:h-40 w-auto object-contain"
              onerror={() => (logoError = true)}
            />
          {/if}
        </a>
      </div>

      <!-- Decorative Lines -->
      <div class="relative flex items-center justify-center mb-8 md:mb-12">
        <div class="absolute left-0 h-px bg-atrium-navy/30 w-[35%] md:w-[40%]"></div>
        <div class="absolute right-0 h-px bg-atrium-navy/30 w-[35%] md:w-[40%]"></div>
      </div>

      <!-- Contact Information - text #151028 per export -->
      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 text-atrium-navy text-lg md:text-lg lg:text-xl items-center"
      >
        <a
          href={`mailto:${email}`}
          class="underline hover:opacity-80 transition-opacity text-center lg:text-left"
          onclick={() => track('ClickEmail', { location: 'footer' })}
        >
          {email}
        </a>
        <a
          href={`tel:${phone.replace(/[^\d]/g, '')}`}
          class="hover:opacity-80 transition-opacity text-center"
          onclick={() => track('ClickCall', { location: 'footer' })}
        >
          {phone}
        </a>
        <span class="text-center lg:text-right">{address}</span>
      </div>
    </div>
  </div>

  <!-- Bottom bar: dark navy -->
  <div class="h-16 bg-atrium-navy"></div>
</footer>
