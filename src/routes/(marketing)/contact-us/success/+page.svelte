<script>
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import { ROUTES } from '$lib/config/routes.js';
  import Head from '$lib/seo/Head.svelte';

  let { data } = $props();

  const { leadId, skippedStep2 } = data;

  const phone = '(206) 222-7549';
</script>

<Head
  pageTitle="Thank You | Atrium Court"
  {data}
  description="Thank you for contacting Atrium Court. We'll be in touch soon."
/>

<Header />

<main class="min-h-screen bg-atrium-section py-12 md:py-16">
  <div class="container mx-auto px-4 md:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto text-center">
      <div class="bg-white rounded-lg shadow-lg p-8 md:p-10">
        <div
          class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h1 class="text-2xl md:text-3xl font-bold text-atrium-navy mb-4">Thank you!</h1>
        <p class="text-atrium-navy/90 mb-6">
          Your message has been sent. The Atrium Court leasing team will review it and get back to
          you soon.
        </p>

        {#if skippedStep2}
          <p class="text-sm text-atrium-navy/70 mb-6">
            You can always provide additional details later by contacting us directly.
          </p>
        {/if}

        {#if leadId}
          <p class="text-sm text-atrium-navy/70 mb-6">Reference: {leadId}</p>
        {/if}

        <div class="space-y-4">
          <a href={ROUTES.HOME} class="block w-full px-6 py-3 btn-atrium-primary text-center">
            Back to home
          </a>
          <a
            href={ROUTES.AVAILABILITY}
            class="block w-full px-6 py-3 border-2 border-atrium-navy text-atrium-navy rounded font-semibold text-center hover:bg-atrium-navy hover:text-white transition-colors"
          >
            View availability
          </a>
          <div class="pt-4 border-t border-gray-200">
            <p class="text-sm text-atrium-navy/80 mb-2">Need immediate assistance?</p>
            <a
              href="tel:(206)222-7549"
              class="inline-flex items-center gap-2 text-[#0099e5] hover:underline font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call {phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<Footer />
