<script>
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import { ROUTES } from '$lib/config/routes.js';
  import Head from '$lib/seo/Head.svelte';

  let { data } = $props();

  const { leadId, skippedStep2, content } = data;
</script>

<Head
  title="Thank You - Contact Submitted"
  description="Thank you for your inquiry. We'll be in touch soon to help you find your perfect home."
/>

<Header />

<main class="min-h-screen bg-gray-50 py-8">
  <div class="container mx-auto px-4">
    <div class="max-w-2xl mx-auto text-center">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div
          class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-gray-900 mb-4">Thank You!</h1>
        <p class="text-gray-600 mb-6">
          Your inquiry has been submitted successfully. Our team will review your information and
          get back to you soon.
        </p>

        {#if skippedStep2}
          <p class="text-sm text-gray-500 mb-6">
            You can always provide additional details later by contacting us directly.
          </p>
        {/if}

        {#if leadId}
          <p class="text-sm text-gray-500 mb-6">
            Reference ID: {leadId}
          </p>
        {/if}

        <div class="space-y-4">
          <a
            href="/"
            class="block w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary text-center font-medium"
          >
            Back to Home
          </a>

          <a
            href={ROUTES.LISTINGS}
            class="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary text-center font-medium"
          >
            Browse Available Units
          </a>

          {#if content.global_phone_display}
            <div class="pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-600 mb-2">Need immediate assistance?</p>
              <a
                href={'tel:' + (content.global_phone_raw || content.global_phone_display)}
                class="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call us at {content.global_phone_display}
              </a>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</main>

<Footer />
