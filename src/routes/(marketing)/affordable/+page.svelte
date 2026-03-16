<script>
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import ScrollAnimation from '$lib/components/ScrollAnimation.svelte';
  import { ROUTES } from '$lib/config/routes.js';
  import Head from '$lib/seo/Head.svelte';

  /** @type {any} */
  let { data = {} } = $props();

  const copy = data.content || {};
  const affordableHousingRestrictions = data.affordableHousingRestrictions || [];

  const heroHeading = copy.affordable_heading || 'Affordable Housing Program';
  const heroImage = '/images/apartments-hero.png';

  /** @param {string} jsonString */
  function parseJsonArray(jsonString) {
    if (!jsonString) return [];
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  const eligibilityBullets = parseJsonArray(copy.affordable_eligibility_bullets);
  const processSteps = parseJsonArray(copy.affordable_process_steps);

  /** @param {number|null} amount */
  function formatCurrency(amount) {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /** @param {number} limit */
  function formatIncomeLimit(limit) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(limit);
  }

  /** Display list for program variations (grouped or legacy) */
  /** @param {any} program */
  function getRestrictionsForDisplay(program) {
    return program.restrictionsForDisplay ?? program.restrictions ?? [];
  }

  /** Collect all household sizes across variations for multi-column table
   * @param {Array<{ incomeLimits?: { limits?: Array<{ householdSize: number }> } }>} variations
   */
  function getAllSizes(variations) {
    const sizes = variations.flatMap((v) => (v.incomeLimits?.limits ?? []).map((l) => l.householdSize)).filter(Boolean);
    return [...new Set(sizes)].sort((a, b) => a - b);
  }

  /** @param {{ incomeLimits?: { limits?: Array<{ householdSize: number; limit: number }> } }} variation
   * @param {number} size
   */
  function getLimitForSize(variation, size) {
    return (variation.incomeLimits?.limits ?? []).find((l) => l.householdSize === size);
  }
</script>

<Head
  pageTitle="Affordable Housing | Atrium Court"
  data={data}
  description={copy.global_meta_description || 'Learn about affordable housing opportunities and income-restricted units at Atrium Court.'}
/>

<Header />

<!-- Hero: same style as community -->
<section class="relative">
  <div
    class="relative bg-cover bg-center min-h-[380px] md:min-h-[480px] flex items-center justify-center"
    style:background-image="url('{heroImage}')"
  >
    <div class="absolute inset-0 bg-black/27"></div>
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 md:py-32">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <h1 class="text-3xl md:text-4xl lg:text-5xl tracking-[0.18em] text-[color:#D8E8EF]">
          {heroHeading}
        </h1>
        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <a href={ROUTES.AVAILABILITY} class="btn-atrium-primary px-8 py-3 text-sm font-bold tracking-[0.18em]">
            View Listings
          </a>
          <a href={ROUTES.CONTACT_US} class="btn-atrium-primary px-8 py-3 text-sm font-bold tracking-[0.18em]">
            {copy.affordable_cta_text || 'Contact Us'}
          </a>
        </div>
      </ScrollAnimation>
    </div>
  </div>
</section>

<!-- Intro -->
<section class="bg-[color:#D8E8EF] py-12 md:py-16">
  <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#81A9BB] text-center mb-6">
        About Our Affordable Program
      </h2>
      <p class="text-center text-[color:#151028] text-sm md:text-base max-w-[82%] mx-auto tracking-[0.06em] whitespace-pre-line">
        {copy.affordable_intro_body || 'We offer income-restricted units for qualifying households. Income limits apply and are based on area median income (AMI).'}
      </p>
    </ScrollAnimation>
  </div>
</section>

<!-- Pattern spacer -->
<section class="atrium-pattern py-24" aria-hidden="true"></section>

<!-- Eligibility Requirements -->
{#if eligibilityBullets.length > 0}
  <section class="bg-[color:#D8E8EF] py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#81A9BB] text-center mb-10">
          Eligibility Requirements
        </h2>
        <ul class="list-disc list-inside space-y-2 text-[color:#151028] text-sm md:text-base tracking-[0.06em] max-w-2xl mx-auto">
          {#each eligibilityBullets as bullet}
            <li>{bullet}</li>
          {/each}
        </ul>
      </ScrollAnimation>
    </div>
  </section>

  <!-- Pattern spacer -->
  <section class="atrium-pattern py-24" aria-hidden="true"></section>
{/if}

<!-- Application Process -->
{#if processSteps.length > 0}
  <section class="bg-[color:#D8E8EF] py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#81A9BB] text-center mb-10">
          Application Process
        </h2>
        <ol class="list-decimal list-inside space-y-3 text-[color:#151028] text-sm md:text-base tracking-[0.06em] max-w-2xl mx-auto">
          {#each processSteps as step}
            <li class="pl-2">{step}</li>
          {/each}
        </ol>
      </ScrollAnimation>
    </div>
  </section>

  <!-- Pattern spacer -->
  <section class="atrium-pattern py-24" aria-hidden="true"></section>
{/if}

<!-- Affordable Housing Programs (from API / transformed) -->
{#if affordableHousingRestrictions.length > 0}
  <section class="bg-[color:#D8E8EF] py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#81A9BB] text-center mb-10">
          Available Programs
        </h2>
        <div class="space-y-10">
          {#each affordableHousingRestrictions as program}
            {@const variations = getRestrictionsForDisplay(program)}
            {@const limitsAreSame = program.limitsAreSame === true}
            {@const year = program.year}
            <div class="bg-white/60 rounded-lg p-6 md:p-8 text-[color:#151028]">
              <h3 class="text-xl md:text-2xl font-bold text-[color:#81A9BB] mb-3">
                {program.restrictionName}
              </h3>
              {#if program.restrictionType}
                <p class="text-sm text-[color:#151028]/80 mb-1"><span class="font-semibold">Program type:</span> {program.restrictionType}</p>
              {/if}
              {#if program.regulator}
                <p class="text-sm text-[color:#151028]/80 mb-4"><span class="font-semibold">Regulator:</span> {program.regulator}</p>
              {/if}

              <!-- AMI -->
              {#if program.hasMultipleAMIs}
                {#each variations as v}
                  {#if v.amiPercent != null}
                    <p class="text-sm mb-1">
                      {v.bedrooms == null ? 'All bedroom types' : v.bedrooms + ' bedroom(s)'}: {v.amiPercent}% AMI
                    </p>
                  {/if}
                {/each}
              {:else if program.amiPercent != null}
                <p class="text-sm mb-2"><span class="font-semibold">Area Median Income (AMI):</span> {program.amiPercent}%</p>
              {/if}

              <!-- Unit counts -->
              {#if program.hasUnitCount && program.unitCount != null}
                <p class="text-sm mb-2">
                  <span class="font-semibold">Available units:</span> {program.unitCount}
                  {#if program.hasTotalRestrictedUnits && program.totalRestrictedUnits != null}
                    of {program.totalRestrictedUnits} restricted
                  {/if}
                </p>
              {:else if program.hasTotalRestrictedUnits && program.totalRestrictedUnits != null}
                <p class="text-sm mb-2"><span class="font-semibold">Restricted units:</span> {program.totalRestrictedUnits}</p>
              {/if}
              {#if (!program.unitCount || program.unitCount === 0) && (program.hasTotalRestrictedUnits || program.hasUnitCount === false)}
                <p class="text-sm mb-2">
                  <a href={ROUTES.CONTACT_US} class="underline font-semibold text-[color:#81A9BB]">Contact us to be added to the waitlist</a>.
                </p>
              {/if}

              <!-- Income limits table(s) -->
              {#if limitsAreSame && variations[0]?.incomeLimits?.limits?.length > 0}
                <div class="mt-4">
                  <p class="font-semibold text-sm mb-2">Income limits ({year || 'Current year'}) — annual household income must be at or below:</p>
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm border border-[color:#81A9BB]/30">
                      <thead>
                        <tr class="bg-[color:#81A9BB]/10">
                          <th class="text-left p-2 font-semibold">Household Size</th>
                          <th class="text-right p-2 font-semibold">Annual Income Limit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each variations[0].incomeLimits.limits as limit}
                          <tr class="border-t border-[color:#81A9BB]/20">
                            <td class="p-2">{limit.householdSize} person{limit.householdSize === 1 ? '' : 's'}</td>
                            <td class="text-right p-2">{formatIncomeLimit(limit.limit)}</td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                </div>
              {:else if !limitsAreSame && variations.length > 0}
                {@const allSizes = getAllSizes(variations)}
                <div class="mt-4">
                  <p class="font-semibold text-sm mb-2">Income limits ({year || 'Current year'}) by unit type:</p>
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm border border-[color:#81A9BB]/30">
                      <thead>
                        <tr class="bg-[color:#81A9BB]/10">
                          <th class="text-left p-2 font-semibold">Household Size</th>
                          {#each variations as v}
                            <th class="text-right p-2 font-semibold">
                              {v.bedrooms == null ? 'All' : v.bedrooms + ' BR'} {#if v.amiPercent != null}({v.amiPercent}% AMI){/if}
                            </th>
                          {/each}
                        </tr>
                      </thead>
                      <tbody>
                        {#each allSizes as size}
                          <tr class="border-t border-[color:#81A9BB]/20">
                            <td class="p-2">{size} person{size === 1 ? '' : 's'}</td>
                            {#each variations as v}
                              {@const limitEntry = getLimitForSize(v, size)}
                              <td class="text-right p-2">{limitEntry ? formatIncomeLimit(limitEntry.limit) : 'N/A'}</td>
                            {/each}
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                </div>
              {:else}
                {#each variations as v}
                  {#if v.incomeLimits?.limits?.length > 0}
                    <div class="mt-4">
                      <p class="font-semibold text-sm mb-2">
                        {v.bedrooms == null ? 'All bedroom types' : v.bedrooms + ' bedroom(s)'}
                        {#if v.amiPercent != null}({v.amiPercent}% AMI){/if} — income limits ({v.incomeLimits?.year || year || 'Current year'}):
                      </p>
                      <div class="overflow-x-auto">
                        <table class="w-full text-sm border border-[color:#81A9BB]/30">
                          <thead>
                            <tr class="bg-[color:#81A9BB]/10">
                              <th class="text-left p-2 font-semibold">Household Size</th>
                              <th class="text-right p-2 font-semibold">Annual Income Limit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each v.incomeLimits.limits as limit}
                              <tr class="border-t border-[color:#81A9BB]/20">
                                <td class="p-2">{limit.householdSize} person{limit.householdSize === 1 ? '' : 's'}</td>
                                <td class="text-right p-2">{formatIncomeLimit(limit.limit)}</td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  {/if}
                {/each}
              {/if}

              <!-- Optional: max rent per variation -->
              {#each variations as v}
                {#if v.currentMaxRent != null}
                  <p class="text-sm mt-2">
                    {v.bedrooms == null ? 'Max rent' : v.bedrooms + ' BR max rent'}: {formatCurrency(v.currentMaxRent)}
                    {#if v.rentType}<span class="text-[color:#151028]/70"> ({v.rentType})</span>{/if}
                  </p>
                {/if}
              {/each}
            </div>
          {/each}
        </div>
      </ScrollAnimation>
    </div>
  </section>

  <!-- Pattern spacer -->
  <section class="atrium-pattern py-24" aria-hidden="true"></section>
{/if}

<!-- CTA: View Listings + Contact Us (same style as community bottom) -->
<section class="relative">
  <div
    class="relative bg-cover bg-center min-h-[420px] md:min-h-[520px] flex items-center justify-center"
    style:background-image="url('/images/live-othello-hero.png')"
  >
    <div class="absolute inset-0 bg-black/22"></div>
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <div class="max-w-4xl mx-auto text-center space-y-6">
          <h2 class="text-3xl md:text-5xl lg:text-6xl tracking-[0.18em] text-[color:#D8E8EF]">
            Ready to Apply?
          </h2>
          <p class="text-[color:#D8E8EF]/90 text-sm md:text-base">
            Check available units and contact leasing to learn about eligibility and waitlist procedures.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <a href={ROUTES.AVAILABILITY} class="cta-btn-search px-8 py-3 tracking-[0.18em]">View Listings</a>
            <a href={ROUTES.CONTACT_US} class="cta-btn-tour px-8 py-3 tracking-[0.18em]">{copy.affordable_cta_text || 'Contact Us'}</a>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  </div>
</section>

<Footer />
