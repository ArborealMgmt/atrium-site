<script>
  import { ROUTES } from '$lib/config/routes.js';

  /**
   * Reusable CTA Section Component
   * @param {string} heading - Main heading text
   * @param {string} body - Body/description text
   * @param {string} buttonText - Button label text
   * @param {string} buttonHref - Button link URL
   * @param {string} [containerClass] - Additional classes for container
   */
  let { heading, body, buttonText, buttonHref = ROUTES.CONTACT_US, containerClass = '' } = $props();
</script>

<section class="w-full h-full {containerClass}">
  <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
    <div
      class="bg-primary-main rounded-4xl bg-opacity-20 border border-primary-main border-opacity-30 px-4 py-6 md:py-10 md:p-10 text-center text-white my-12"
    >
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div class="flex">
          <h2 class="text-xl sm:text-3xl md:text-4xl font-bold md:mb-0 mb-3 text-left">
            {heading}
          </h2>
        </div>
        <div class="flex flex-col items-start">
          <p class="text-base text-opacity-90 mb-5 leading-relaxed text-left">
            {body}
          </p>
          <a href={buttonHref} class="primary-white-btn mt-3" data-sveltekit-preload-data="hover">
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
