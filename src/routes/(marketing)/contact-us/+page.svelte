<script>
  import { track } from '$lib/analytics';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import Head from '$lib/seo/Head.svelte';

  /** @type {any} */
  let { data = {}, form = null } = $props();

  const unitId = data.unitId ?? '';
  const errors = form?.errors ?? [];
  const formData = {
    firstName: form?.firstName ?? '',
    lastName: form?.lastName ?? '',
    email: form?.email ?? '',
    phoneNumber: form?.phoneNumber ?? '',
    message: form?.message ?? '',
  };

  const email = 'leasing@arboreal.management';
  const phone = '(206) 222-7549';
  const address = '7324 Martin Luther King Jr Way S, Seattle WA 98118';
</script>

<Head
  pageTitle="Contact Us | Atrium Court"
  {data}
  description="Contact Atrium Court leasing. Schedule a tour, ask about availability, or send a message. We're here to help."
/>

<Header />

<main class="min-h-screen bg-[#D8E8EF]/30">
  <!-- Focus: form first with a clean hero -->
  <section class="pt-10 pb-6 md:pt-14 md:pb-10">
    <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl text-center">
      <h1 class="text-3xl md:text-4xl font-bold text-atrium-navy tracking-tight">Get in touch</h1>
      <p class="mt-3 text-atrium-navy/80 text-lg max-w-xl mx-auto">
        Send a message and we’ll get back to you soon.
      </p>
    </div>
  </section>

  <!-- Form card: centerpiece -->
  <section class="pb-16 md:pb-24">
    <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div class="lg:col-span-6">
          <div
            class="bg-white rounded-2xl shadow-[0_8px_30px_rgba(21,16,40,0.08)] border border-atrium-navy/5 overflow-hidden"
          >
            <div class="p-6 md:p-8 lg:p-10">
              <form method="POST" action="?/default" class="space-y-6">
                {#if unitId}
                  <input type="hidden" name="unitId" value={unitId} />
                {/if}
                {#if errors.length > 0}
                  <div
                    class="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-700 text-sm"
                  >
                    <ul class="list-none space-y-1">
                      {#each errors as err (err)}
                        <li>• {err}</li>
                      {/each}
                    </ul>
                  </div>
                {/if}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label for="firstName" class="block text-sm font-semibold text-atrium-navy mb-2"
                      >First name *</label
                    >
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      class="contact-input w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-atrium-navy placeholder:text-gray-400 focus:border-[#0099e5] focus:bg-white focus:ring-2 focus:ring-[#0099e5]/20 transition-all outline-none"
                      autocomplete="given-name"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label for="lastName" class="block text-sm font-semibold text-atrium-navy mb-2"
                      >Last name *</label
                    >
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      class="contact-input w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-atrium-navy placeholder:text-gray-400 focus:border-[#0099e5] focus:bg-white focus:ring-2 focus:ring-[#0099e5]/20 transition-all outline-none"
                      autocomplete="family-name"
                      placeholder="Smith"
                    />
                  </div>
                </div>
                <div>
                  <label for="email" class="block text-sm font-semibold text-atrium-navy mb-2"
                    >Email</label
                  >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    class="contact-input w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-atrium-navy placeholder:text-gray-400 focus:border-[#0099e5] focus:bg-white focus:ring-2 focus:ring-[#0099e5]/20 transition-all outline-none"
                    autocomplete="email"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label for="phoneNumber" class="block text-sm font-semibold text-atrium-navy mb-2"
                    >Phone</label
                  >
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    class="contact-input w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-atrium-navy placeholder:text-gray-400 focus:border-[#0099e5] focus:bg-white focus:ring-2 focus:ring-[#0099e5]/20 transition-all outline-none"
                    autocomplete="tel"
                    placeholder="(206) 555-0123"
                  />
                  <p class="mt-1.5 text-xs text-atrium-navy/60">
                    Include at least one of email or phone.
                  </p>
                </div>
                <div>
                  <label for="message" class="block text-sm font-semibold text-atrium-navy mb-2"
                    >Message <span class="font-normal text-atrium-navy/60">(optional)</span></label
                  >
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    class="contact-input w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-atrium-navy placeholder:text-gray-400 focus:border-[#0099e5] focus:bg-white focus:ring-2 focus:ring-[#0099e5]/20 transition-all outline-none resize-none"
                    placeholder="Preferred move-in date, bedroom count, or any questions…"
                    >{formData.message}</textarea
                  >
                </div>
                <div class="pt-2">
                  <button
                    type="submit"
                    class="w-full sm:w-auto btn-atrium-primary px-8 py-3.5 rounded-xl cursor-pointer text-base font-semibold transition-shadow"
                  >
                    Send message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="lg:col-span-6 min-w-0">
          <div
            class="lg:sticky lg:top-28 rounded-2xl bg-white/80 backdrop-blur border border-atrium-navy/5 p-6 md:p-8 shadow-sm min-w-[18rem]"
          >
            <h2 class="text-sm font-bold uppercase tracking-wider text-atrium-navy/70 mb-4">
              Or reach us directly
            </h2>
            <div class="space-y-5">
              <a
                href="tel:(206)222-7549"
                class="flex items-center gap-3 text-atrium-navy hover:text-[#0099e5] transition-colors group"
                onclick={() => track('ClickCall', { location: 'contact-sidebar' })}
              >
                <span
                  class="flex h-10 w-10 items-center justify-center rounded-xl bg-atrium-navy/5 text-atrium-navy group-hover:bg-[#0099e5]/10 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    ><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    /></svg
                  >
                </span>
                <span class="font-semibold">{phone}</span>
              </a>
              <a
                href="mailto:leasing@arboreal.management"
                class="flex items-center gap-3 text-atrium-navy hover:text-[#0099e5] transition-colors group"
                onclick={() => track('ClickEmail', { location: 'contact-sidebar' })}
              >
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-atrium-navy/5 text-atrium-navy group-hover:bg-[#0099e5]/10 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    ><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    /></svg
                  >
                </span>
                <span class="font-semibold whitespace-nowrap">{email}</span>
              </a>
              <div class="flex gap-3 pt-1">
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-atrium-navy/5 text-atrium-navy"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    ><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    /><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    /></svg
                  >
                </span>
                <p class="text-sm text-atrium-navy/80 leading-relaxed">{address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Map: compact at bottom -->
  <section class="bg-white/60 py-8 md:py-10">
    <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
      <div
        class="rounded-2xl overflow-hidden shadow-md border border-atrium-navy/5"
        style:height="280px"
      >
        <iframe
          src="https://www.google.com/maps?q=7324+Martin+Luther+King+Jr+Way+S,+Seattle+WA+98118&output=embed"
          width="100%"
          height="100%"
          style:border="0"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Atrium Court location"
        ></iframe>
      </div>
    </div>
  </section>
</main>

<Footer />
