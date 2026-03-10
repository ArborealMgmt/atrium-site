<script>
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';

  import { track } from '$lib/analytics';
  import { getHeroBySlot, getImageUrl } from '$lib/api/media.js';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import ScrollAnimation from '$lib/components/ScrollAnimation.svelte';
  import { ROUTES } from '$lib/config/routes.js';
  import Head from '$lib/seo/Head.svelte';

  /** @type {any} */
  let { data = {} } = $props();

  const copy = data.content || {};
  const media = data.media || {};
  const affordableHousingRestrictions = data.affordableHousingRestrictions || [];

  // Get hero image with fallback
  const affordableHeroImage = getHeroBySlot(media, 'affordable_hero_image');
  const apartmentsHeroImage = getHeroBySlot(media, 'apartments_hero_image');
  const heroImage = affordableHeroImage || apartmentsHeroImage;
  const heroBgImage = heroImage
    ? getImageUrl(heroImage, { width: 1920, height: 1080, crop: 'fill' })
    : 'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/f41721c8-efa2-4e77-8033-1225545e0e83/TheTerrapinApartments-Hero4.jpg?format=2500w';

  // Parse JSON strings for bullets and steps
  /**
   * @param {string} jsonString
   * @returns {string[]}
   */
  function parseJsonArray(jsonString) {
    if (!jsonString) return [];
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  const eligibilityBullets = $derived(parseJsonArray(copy.affordable_eligibility_bullets));
  const processSteps = $derived(parseJsonArray(copy.affordable_process_steps));

  // Helper function to extract title from bullet text
  /**
   * @param {string} text
   * @param {number} index
   * @param {boolean} isStep
   * @returns {string}
   */
  function extractTitle(text, index, isStep = false) {
    // For eligibility requirements, extract key phrase
    if (!isStep) {
      const patterns = [
        /income.*(?:must|meet|limits)/i,
        /household size/i,
        /citizen|immigration/i,
        /application.*fee/i,
        /credit.*background/i,
        /proof.*income|pay stubs/i,
      ];
      const titles = [
        'Income Requirements',
        'Household Size',
        'Citizenship Status',
        'Application Fee',
        'Background Check',
        'Income Documentation',
      ];
      for (let i = 0; i < patterns.length; i++) {
        if (patterns[i].test(text)) {
          return titles[i] || titles[index] || 'Requirement';
        }
      }
      // Fallback: extract first meaningful phrase
      const match = text.match(/^([^,.]{1,40})/);
      return match ? match[1].trim() : 'Requirement';
    }
    // For process steps, extract action phrase
    const stepPatterns = [
      /review|confirm/i,
      /submit|application/i,
      /intake|verification/i,
      /credit|background|reference/i,
      /notification|waitlist/i,
      /sign|lease|deposit/i,
    ];
    const stepTitles = [
      'Review Eligibility',
      'Submit Application',
      'Initial Verification',
      'Background Checks',
      'Receive Notification',
      'Sign Lease',
    ];
    for (let i = 0; i < stepPatterns.length; i++) {
      if (stepPatterns[i].test(text)) {
        return stepTitles[i] || stepTitles[index] || 'Application Step';
      }
    }
    // Fallback
    const match = text.match(/^([^,.]{1,40})/);
    return match ? match[1].trim() : 'Application Step';
  }

  // Icon mappings for eligibility requirements
  const eligibilityIcons = [
    'mdi:currency-usd',
    'mdi:account-group',
    'mdi:shield-account',
    'mdi:file-document-edit',
    'mdi:shield-check',
    'mdi:file-document-multiple',
  ];

  // Icon mappings for application process
  const processIcons = [
    'mdi:clipboard-check',
    'mdi:file-send',
    'mdi:account-check',
    'mdi:shield-search',
    'mdi:email-check',
    'mdi:file-sign',
  ];

  // Format currency
  /**
   * @param {number|null} amount
   * @returns {string}
   */
  function formatCurrency(amount) {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Format income limit
  /**
   * @param {number} limit
   * @returns {string}
   */
  function formatIncomeLimit(limit) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(limit);
  }

  onMount(() => {
    track('ViewAffordableHousing', {});
  });
</script>

<Head
  pageTitle={copy.global_property_name
    ? `${copy.global_property_name} | Affordable Housing`
    : 'Affordable Housing'}
  {data}
  description={copy.global_meta_description || 'Learn about affordable housing opportunities'}
/>

<Header />

<!-- Hero Section -->
<section
  class="relative bg-cover bg-center overflow-hidden lg:h-[60vh] h-[50vh] bg-no-repeat"
  style:background-image="url('{heroBgImage}')"
>
  <div class="absolute inset-0 bg-black/40"></div>
  <div class="container mx-auto px-4 md:px-6 lg:px-8 h-full relative z-10">
    <div class="h-full flex items-center justify-center">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <div class="text-center max-w-4xl">
          <h1
            class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4"
          >
            {copy.affordable_heading || 'Affordable Housing Program'}
          </h1>
        </div>
      </ScrollAnimation>
    </div>
  </div>
</section>

<!-- Intro Section -->
<section class="bg-white py-12 md:py-16 lg:py-20">
  <div class="container mx-auto px-4 md:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <div class="prose prose-lg max-w-none">
          {#if copy.affordable_intro_body}
            <div class="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-line">
              {copy.affordable_intro_body}
            </div>
          {:else}
            <div class="text-lg md:text-xl text-gray-700 leading-relaxed">
              We are proud to offer affordable housing units as part of our commitment to the
              community. Income-qualified residents may be eligible for reduced rent on select
              apartments.
            </div>
          {/if}
        </div>
      </ScrollAnimation>
    </div>
  </div>
</section>

<!-- Eligibility Requirements Section -->
{#if eligibilityBullets.length > 0}
  <section class="bg-gray-50 py-12 md:py-16 lg:py-20">
    <div class="container mx-auto px-4 md:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <ScrollAnimation type="fade-slide-up" duration={800}>
          <h2 class="text-3xl md:text-4xl font-bold text-primary-main mb-12 text-center">
            Eligibility Requirements
          </h2>
        </ScrollAnimation>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {#each eligibilityBullets as bullet, index (index)}
            {@const icon = eligibilityIcons[index] || 'mdi:check-circle'}
            {@const title = extractTitle(bullet, index, false)}
            <ScrollAnimation
              type="fade-slide-up"
              duration={600}
              delay={index * 100}
              threshold={0.1}
            >
              <div
                class="bg-white rounded-lg shadow-md p-6 md:p-8 hover:shadow-lg transition-shadow duration-300 h-full"
              >
                <div class="flex flex-col items-center text-center h-full">
                  <div
                    class="w-16 h-16 rounded-full bg-primary-main/10 flex items-center justify-center mb-4 shrink-0"
                  >
                    <Icon {icon} class="w-8 h-8 text-primary-main" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                  <p class="text-base text-gray-700 leading-relaxed grow">{bullet}</p>
                </div>
              </div>
            </ScrollAnimation>
          {/each}
        </div>
      </div>
    </div>
  </section>
{/if}

<!-- Application Process Section -->
{#if processSteps.length > 0}
  <section class="bg-white py-12 md:py-16 lg:py-20">
    <div class="container mx-auto px-4 md:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <ScrollAnimation type="fade-slide-up" duration={800}>
          <h2 class="text-3xl md:text-4xl font-bold text-primary-main mb-12 text-center">
            Application Process
          </h2>
        </ScrollAnimation>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {#each processSteps as step, index (index)}
            {@const icon = processIcons[index] || 'mdi:file-document'}
            {@const title = extractTitle(step, index, true)}
            <ScrollAnimation
              type="fade-slide-up"
              duration={600}
              delay={index * 100}
              threshold={0.1}
            >
              <div
                class="bg-white rounded-lg shadow-md p-6 md:p-8 hover:shadow-lg transition-shadow duration-300 border-2 border-gray-100 h-full"
              >
                <div class="flex flex-col items-center text-center h-full">
                  <div
                    class="w-16 h-16 rounded-full bg-primary-main/10 flex items-center justify-center mb-4 shrink-0"
                  >
                    <Icon {icon} class="w-8 h-8 text-primary-main" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                  <p class="text-base text-gray-700 leading-relaxed grow">{step}</p>
                </div>
              </div>
            </ScrollAnimation>
          {/each}
        </div>
      </div>
    </div>
  </section>
{/if}

<!-- Available Programs Section -->
{#if affordableHousingRestrictions.length > 0}
  <section class="bg-gray-50 py-12 md:py-16 lg:py-20">
    <div class="container mx-auto px-4 md:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <ScrollAnimation type="fade-slide-up" duration={800}>
          <h2 class="text-3xl md:text-4xl font-bold text-primary-main mb-12 text-center">
            Available Programs
          </h2>
        </ScrollAnimation>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          {#each affordableHousingRestrictions as program, programIndex (programIndex)}
            {@const hasVariations =
              Array.isArray(program.bedroomVariations) && program.bedroomVariations.length > 0}
            <ScrollAnimation
              type="fade-slide-up"
              duration={600}
              delay={programIndex * 100}
              threshold={0.1}
            >
              <div class="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h3 class="text-2xl md:text-3xl font-bold text-primary-main mb-4">
                  {program.restrictionName || 'Affordable Housing Program'}
                </h3>

                {#if program.restrictionType}
                  <p class="text-lg text-gray-600 mb-2">
                    <span class="font-semibold">Program Type:</span>
                    {program.restrictionType}
                  </p>
                {/if}

                {#if program.regulator}
                  <p class="text-lg text-gray-600 mb-4">
                    <span class="font-semibold">Regulator:</span>
                    {program.regulator}
                  </p>
                {/if}

                {#if hasVariations}
                  <div class="space-y-6 mt-6">
                    {#each program.bedroomVariations as variation, varIndex (varIndex)}
                      <div class="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
                        <h4 class="text-xl font-semibold text-gray-800 mb-4">
                          {variation.bedrooms === null
                            ? 'All Bedroom Types'
                            : `${variation.bedrooms} Bedroom${variation.bedrooms === 1 ? '' : 's'}`}
                        </h4>

                        <div class="space-y-3">
                          {#if variation.amiPercent !== null}
                            <p class="text-base text-gray-700">
                              <span class="font-semibold">AMI Percentage:</span>
                              {variation.amiPercent}%
                            </p>
                          {/if}

                          {#if variation.currentMaxRent !== null}
                            <p class="text-base text-gray-700">
                              <span class="font-semibold">Maximum Rent:</span>
                              {formatCurrency(variation.currentMaxRent)}
                              {#if variation.rentType}
                                <span class="text-sm text-gray-500"> ({variation.rentType})</span>
                              {/if}
                            </p>
                          {/if}

                          {#if variation.unitCount !== null}
                            <p class="text-base text-gray-700">
                              <span class="font-semibold">Available Units:</span>
                              {variation.unitCount}
                              {#if variation.totalRestrictedUnits !== null}
                                <span class="text-sm text-gray-500">
                                  / {variation.totalRestrictedUnits} total
                                </span>
                              {/if}
                            </p>
                          {/if}

                          {#if variation.incomeLimits && variation.incomeLimits.limits}
                            <div class="mt-4">
                              <p class="font-semibold text-gray-800 mb-2">
                                Income Limits ({variation.incomeLimits.year || 'Current Year'}):
                              </p>
                              <ul class="space-y-1">
                                {#each variation.incomeLimits.limits as limit (limit.householdSize)}
                                  <li class="text-sm text-gray-700">
                                    {limit.householdSize} person
                                    {limit.householdSize === 1 ? '' : 's'}:
                                    {formatIncomeLimit(limit.limit)}/year
                                  </li>
                                {/each}
                              </ul>
                            </div>
                          {/if}
                        </div>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="mt-4">
                    <p class="text-base text-gray-700">
                      {#if program.unitCount !== null}
                        <span class="font-semibold">Available Units:</span>
                        {program.unitCount}
                        {#if program.totalRestrictedUnits !== null}
                          <span class="text-sm text-gray-500">
                            / {program.totalRestrictedUnits} total
                          </span>
                        {/if}
                      {/if}
                    </p>
                  </div>
                {/if}
              </div>
            </ScrollAnimation>
          {/each}
        </div>
      </div>
    </div>
  </section>
{/if}

<!-- CTA Section -->
<section class="bg-white py-12 md:py-16 lg:py-20">
  <div class="container mx-auto px-4 md:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto text-center">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <h2 class="text-3xl md:text-4xl font-bold text-primary-main mb-6">Ready to Apply?</h2>
        <p class="text-lg md:text-xl text-gray-700 mb-8">
          Check available units and start your application today.
        </p>
        <a
          href={ROUTES.AVAILABILITY}
          class="inline-block bg-primary-main text-white px-8 py-4 rounded-full text-lg md:text-xl font-semibold hover:opacity-90 transition-opacity"
          onclick={() => track('ClickCTA', { location: 'affordable-housing', cta: 'view-units' })}
        >
          {copy.affordable_cta_text || 'View Available Units'}
        </a>
      </ScrollAnimation>
    </div>
  </div>
</section>

<Footer />
