<script>
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import ScrollAnimation from '$lib/components/ScrollAnimation.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { ROUTES } from '$lib/config/routes.js';
  import Head from '$lib/seo/Head.svelte';

  /** @type {any} */
  let { data = {} } = $props();

  const listings = data.listings ?? [];
  const specials = data.specials ?? [];
  const affordableHousingRestrictions = data.affordableHousingRestrictions ?? [];

  /** @type {any} */
  let selectedListing = $state(null);

  /** @param {any} listing */
  function openModal(listing) {
    selectedListing = listing;
  }

  function closeModal() {
    selectedListing = null;
  }

  /** Parse YouTube video ID from url (v=, youtu.be, or embed). */
  /** @param {string} url */
  function youtubeVideoId(url) {
    if (!url || typeof url !== 'string') return null;
    const v = url.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return v ? v[1] : null;
  }

  /** @param {any} listing */
  function listingPhotos(listing) {
    const arr = listing.listingPhotos ?? listing.unitPhotos ?? listing.photos;
    if (!Array.isArray(arr)) return [];
    return arr.map(p => (typeof p === 'string' ? p : (p?.url ?? p?.thumbnailUrl))).filter(Boolean);
  }

  /** @param {any} listing */
  function listingAmenities(listing) {
    const a =
      listing.primaryAmenities ??
      listing.amenities ??
      listing.listingAmenities ??
      listing.unitAmenities;
    if (Array.isArray(a)) return a;
    if (typeof a === 'string') return [a];
    return [];
  }

  /** Listing has affordable/income-restricted info (for badge and modal). */
  /** @param {any} listing */
  function isAffordableListing(listing) {
    return !!(
      listing?.affordableHousingProgramName ||
      listing?.incomeLimits?.limits?.length > 0 ||
      listing?.amiPercent != null
    );
  }

  /** Get income limits for modal: listing's own limits or from program matched by name + bedroom. */
  /** @param {any} listing */
  function getIncomeLimitsForListing(listing) {
    if (listing?.incomeLimits?.limits?.length > 0) {
      return { limits: listing.incomeLimits.limits, year: listing.incomeLimits.year };
    }
    const programName = listing?.affordableHousingProgramName;
    if (!programName || affordableHousingRestrictions.length === 0) return null;
    /** @type {any[]} */
    const restrictionsList = affordableHousingRestrictions;
    const program = restrictionsList.find(p => p.restrictionName === programName);
    if (!program) return null;
    /** @type {any[]} */
    const variations = program.restrictionsForDisplay ?? program.restrictions ?? [];
    const bedrooms = listing?.primaryBedrooms ?? listing?.bedrooms;
    const variation =
      variations.find(v => v.bedrooms === bedrooms) ??
      variations.find(v => v.bedrooms == null) ??
      variations[0];
    if (!variation?.incomeLimits?.limits?.length) return null;
    return {
      limits: variation.incomeLimits.limits,
      year: variation.incomeLimits.year,
    };
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

  const heroImage = '/images/availability-hero.png';
  const ctaImage = '/images/live-othello-hero.png';

  /** Dark purple (#151028) for listing card gradient and buttons. */
  const listingCardColor = '#151028';

  /** @param {any} special */
  function specialTitle(special) {
    return (
      special.marketingTitle ||
      special.primaryDescription ||
      special.description ||
      special.unitName ||
      'Special Offer'
    );
  }

  /** First photo URL from transformed listing (listingPhotos / unitPhotos / photos). */
  /** @param {any} listing */
  function getFirstPhoto(listing) {
    const arr = listing.listingPhotos ?? listing.unitPhotos ?? listing.photos;
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const first = arr[0];
    return typeof first === 'string' ? first : (first?.url ?? first?.thumbnailUrl ?? null);
  }

  /** @param {any} listing */
  function formatRent(listing) {
    const r = listing.primaryRent ?? listing.rent;
    if (r == null) return '—';
    return typeof r === 'number' ? `$${r.toLocaleString()}/month` : String(r);
  }

  /** @param {any} listing */
  function bedSqft(listing) {
    const b = listing.primaryBedrooms ?? listing.bedrooms;
    const sq = listing.primarySquareFeet ?? listing.sqft ?? listing.squareFeet;
    const parts = [];
    if (b != null) parts.push(`${b} bed${b !== 1 ? 's' : ''}`);
    if (sq != null) parts.push(`${sq} sq ft`);
    return parts.join(' ');
  }

  /** Schedule Tour URL (contact with tour param; no /schedule-showing in repo). */
  /** @param {any} listing */
  function scheduleTourUrl(listing) {
    const id = listing.id ?? listing.unitId;
    const name = listing.unitName ?? id;
    return `${ROUTES.CONTACT_US}?tour=${encodeURIComponent(name)}`;
  }
</script>

<Head
  pageTitle="Availability | Atrium Court"
  {data}
  description="View available apartments at Atrium Court in Seattle's Othello neighborhood. Compare floor plans and apply online."
/>

<Header />

<!-- Hero: Join Our Community (WordPress match) -->
<section class="relative">
  <div
    class="relative bg-cover bg-center min-h-[380px] md:min-h-[450px] flex items-center justify-center"
    style:background-image="url('{heroImage}')"
  >
    <div class="absolute inset-0 bg-black/35"></div>
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-28">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <h1 class="text-3xl md:text-4xl lg:text-5xl tracking-[0.2em] text-[color:#D8E8EF]">
          Join Our Community
        </h1>
        <a
          href={ROUTES.AVAILABILITY}
          class="btn-atrium-primary inline-block mt-6 px-8 py-3 text-sm font-bold tracking-[0.18em]"
        >
          Search Availability
        </a>
      </ScrollAnimation>
    </div>
  </div>
</section>

<!-- Main section: Listings + Specials (Maynard API) -->
<section
  class="py-16 md:py-24 lg:py-28 bg-[color:#D8E8EF] bg-cover bg-repeat-x"
  style:background-image="url('/images/pattern2-scaled.png')"
>
  <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
    <div
      class="relative bg-white rounded-lg p-6 md:p-10 shadow-[0_16px_32px_rgba(38,57,84,0.1)] -mt-[10%] mb-8"
    >
      <ScrollAnimation type="fade-slide-up" duration={600}>
        <h2 class="text-2xl md:text-3xl font-bold text-[color:#151028] mb-4">
          Available Apartments
        </h2>
        <p class="text-[color:#151028]/90 text-base max-w-3xl mb-10">
          Browse current availability and filter by floor plan, move-in date, and rent. If nothing
          matches today, join our waitlist to be notified when new homes become available.
        </p>
      </ScrollAnimation>

      <!-- Specials: dark purple and gold -->
      {#if specials.length > 0}
        <ScrollAnimation type="fade-slide-up" duration={600} delay={80}>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            {#each specials as special (special?.id ?? special?.title ?? special)}
              <div
                class="bg-atrium-navy border-2 border-[color:#F2A73B] rounded-xl p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 class="text-sm font-bold uppercase tracking-wider text-[color:#F2A73B] mb-2">
                  Special Offer Available!
                </h3>
                <p class="text-[color:#D8E8EF] font-medium mb-4">{specialTitle(special)}</p>
                <a
                  href={ROUTES.CONTACT_US}
                  class="btn-atrium-primary inline-block text-sm px-5 py-2.5 rounded-lg"
                >
                  Contact Us
                </a>
              </div>
            {/each}
          </div>
        </ScrollAnimation>
      {/if}

      <!-- Affordable banner (guide 6.1) -->
      {#if affordableHousingRestrictions.length > 0}
        <ScrollAnimation type="fade-slide-up" duration={600}>
          <p class="text-[color:#151028]/90 text-sm md:text-base mb-6">
            This property has affordable, income-restricted homes available. Click the
            <a href={ROUTES.AFFORDABLE} class="font-semibold underline text-[color:#151028]"
              >Income Restricted</a
            >
            badge on a listing for details.
          </p>
        </ScrollAnimation>
      {/if}

      <!-- Section 6: Listing cards — click or "Learn More" opens detail modal (6.7) -->
      <section
        class="availability-listing-cards py-12 md:py-16 lg:py-20 bg-gray-50 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 mt-10 mb-14"
        style:--primary-color="#151028"
      >
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {#each listings as listing (listing.id ?? listing.unitId ?? listing)}
              {@const firstPhoto = getFirstPhoto(listing)}
              {@const hasPhoto = !!firstPhoto}
              {@const unitName = listing.unitName ?? listing.unitId ?? 'Unit'}
              {@const rent = formatRent(listing)}
              {@const bedsSqft = bedSqft(listing)}
              {@const applicationUrl = listing.applicationURL ?? listing.applicationUrl}
              {@const youtubeUrl = listing.youtubeUrl}
              {@const incomeRestricted = isAffordableListing(listing)}
              {@const tourUrl = scheduleTourUrl(listing)}
              <div
                class="h-[350px] rounded-lg overflow-hidden shadow-md bg-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                role="button"
                tabindex="0"
                onclick={() => openModal(listing)}
                onkeydown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(listing);
                  }
                }}
              >
                {#if hasPhoto}
                  <div class="group h-full w-full relative">
                    <div class="absolute inset-0">
                      <img
                        src={firstPhoto}
                        alt={unitName}
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div
                        class="listing-gradient-overlay"
                        style:--gradient-overlay-color={listingCardColor}
                      ></div>
                    </div>
                    <div
                      class="absolute top-0 left-0 right-0 z-10 flex items-start justify-between p-3 pointer-events-none"
                    >
                      <div class="flex flex-wrap gap-2">
                        {#if youtubeUrl}
                          <span
                            class="rounded-full bg-white/80 text-atrium-navy text-xs font-semibold px-3 py-1"
                            >Video Tour</span
                          >
                        {/if}
                        {#if incomeRestricted}
                          <span
                            class="rounded-full bg-white/80 text-atrium-navy text-xs font-semibold px-3 py-1"
                            >Income Restricted</span
                          >
                        {/if}
                      </div>
                      <span
                        class="rounded-full bg-white/80 text-atrium-navy text-xs font-semibold px-3 py-1"
                        >Learn More</span
                      >
                    </div>
                    <div
                      class="absolute bottom-0 left-0 right-0 z-10 p-4 text-white pointer-events-none"
                    >
                      <p class="font-semibold text-lg">{unitName} — {rent}</p>
                      {#if bedsSqft}
                        <p class="text-sm opacity-95">{bedsSqft}</p>
                      {/if}
                      <div class="flex flex-wrap gap-2 mt-3 pointer-events-auto">
                        {#if applicationUrl}
                          <a
                            href={applicationUrl}
                            class="primary-btn text-xs font-semibold px-4 py-2 rounded inline-block"
                            target="_blank"
                            rel="noopener noreferrer"
                            onclick={e => e.stopPropagation()}>Apply Now</a
                          >
                        {/if}
                        <a
                          href={tourUrl}
                          class="primary-btn text-xs font-semibold px-4 py-2 rounded inline-block"
                          onclick={e => e.stopPropagation()}>Schedule Tour</a
                        >
                      </div>
                    </div>
                  </div>
                {:else}
                  <div
                    class="h-full w-full flex flex-col items-center justify-center p-4 bg-atrium-navy/10 text-atrium-navy text-center"
                  >
                    <p class="font-semibold text-lg">{unitName}</p>
                    <p class="text-sm mt-1">{rent}</p>
                    {#if bedsSqft}
                      <p class="text-sm mt-0.5">{bedsSqft}</p>
                    {/if}
                    <div class="flex flex-wrap gap-2 mt-4 justify-center">
                      {#if applicationUrl}
                        <a
                          href={applicationUrl}
                          class="primary-btn text-xs font-semibold px-4 py-2 rounded"
                          target="_blank"
                          rel="noopener noreferrer"
                          onclick={e => e.stopPropagation()}>Apply Now</a
                        >
                      {/if}
                      <a
                        href={tourUrl}
                        class="primary-btn text-xs font-semibold px-4 py-2 rounded"
                        onclick={e => e.stopPropagation()}>Schedule Tour</a
                      >
                    </div>
                  </div>
                {/if}
              </div>
            {:else}
              <div class="col-span-full py-16 px-6 text-center">
                <p class="text-[color:#151028] text-lg font-medium">
                  Sorry, listings will show here soon!
                </p>
              </div>
            {/each}
          </div>
        </div>
      </section>

      <!-- Before You Apply -->
      <ScrollAnimation type="fade-slide-up" duration={600}>
        <h2 class="text-xl md:text-2xl font-bold text-[color:#151028] mb-4">Before You Apply</h2>
        <p class="text-[color:#151028]/90 text-base max-w-3xl mb-12">
          All applicants must complete a rental application and pass screening: identity
          verification, income verification (typically 2.5–3x rent), credit review, and criminal
          background check. Application fee applies per adult applicant.
        </p>
      </ScrollAnimation>

      <!-- Contact Leasing -->
      <ScrollAnimation type="fade-slide-up" duration={600}>
        <h2 class="text-xl md:text-2xl font-bold text-[color:#151028] mb-4">Contact Leasing</h2>
        <p class="text-[color:#151028]/90 text-base max-w-3xl mb-6">
          Questions about availability, tours, or the application process? Our leasing team at
          Atrium Court is ready to help. Reach out or schedule a tour to see the community in
          person.
        </p>
        <a href={ROUTES.CONTACT_US} class="btn-atrium-primary inline-block text-sm px-6 py-3">
          Contact Us
        </a>
      </ScrollAnimation>
    </div>
  </div>
</section>

<!-- Live Othello Village Life CTA (WordPress match) -->
<section class="relative">
  <div
    class="relative bg-cover bg-center min-h-[420px] md:min-h-[520px] flex items-center justify-center"
    style:background-image="url('{ctaImage}')"
  >
    <div class="absolute inset-0 bg-black/22"></div>
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <div class="max-w-4xl mx-auto text-center space-y-6">
          <h2 class="text-3xl md:text-5xl lg:text-6xl tracking-[0.18em] text-[color:#D8E8EF]">
            Live Othello Village Life.
          </h2>
          <div class="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <a href={ROUTES.AVAILABILITY} class="cta-btn-search px-8 py-3 tracking-[0.18em]">
              Search Availability
            </a>
            <a
              href="mailto:leasing@arboreal.management"
              class="cta-btn-tour px-8 py-3 tracking-[0.18em]"
            >
              Schedule a Tour
            </a>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  </div>
</section>

<!-- Listing Details Modal (section 6.7): overlay + close + scrollable content -->
<Dialog.Root
  open={selectedListing != null}
  onOpenChange={open => {
    if (!open) closeModal();
  }}
>
  <Dialog.Content
    class="max-w-4xl max-h-[70vh] overflow-y-auto bg-white text-[color:#151028] border-[color:#151028]/10"
    aria-describedby={undefined}
  >
    {#if selectedListing}
      {@const unitName = selectedListing.unitName ?? selectedListing.unitId ?? 'Unit'}
      {@const applicationUrl = selectedListing.applicationURL ?? selectedListing.applicationUrl}
      {@const tourUrl = scheduleTourUrl(selectedListing)}
      {@const acceptingApplications = selectedListing.acceptingApplications !== false}
      {@const videoId = youtubeVideoId(selectedListing.youtubeUrl)}
      {@const photos = listingPhotos(selectedListing)}
      {@const amenities = listingAmenities(selectedListing)}

      <!-- 1. Header: Unit name + Income Restricted badge -->
      <div class="pr-10">
        <h2 class="text-xl md:text-2xl font-bold">Unit {unitName}</h2>
        {#if isAffordableListing(selectedListing)}
          <span
            class="inline-block mt-2 rounded-full bg-[color:#F2A73B]/20 text-[color:#151028] text-xs font-semibold px-3 py-1"
            >Income Restricted</span
          >
        {/if}
      </div>

      <!-- 2. Top CTAs -->
      <div class="flex flex-wrap gap-3 mt-4">
        {#if applicationUrl && acceptingApplications}
          <a
            href={applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="primary-btn text-sm font-semibold px-5 py-2.5 rounded">Apply Now</a
          >
        {/if}
        <a href={tourUrl} class="primary-btn text-sm font-semibold px-5 py-2.5 rounded"
          >Schedule a Tour</a
        >
      </div>

      <!-- 3. Details band -->
      <div class="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-sm">
        <span class="font-semibold">{formatRent(selectedListing)}</span>
        {#if (selectedListing.primarySquareFeet ?? selectedListing.sqft) != null}
          <span>{selectedListing.primarySquareFeet ?? selectedListing.sqft} sq ft</span>
        {/if}
        {#if selectedListing.primaryBedrooms != null}
          <span
            >{selectedListing.primaryBedrooms} bed{selectedListing.primaryBedrooms !== 1
              ? 's'
              : ''}</span
          >
        {/if}
        {#if selectedListing.primaryBathrooms != null}
          <span
            >{selectedListing.primaryBathrooms} bath{selectedListing.primaryBathrooms !== 1
              ? 's'
              : ''}</span
          >
        {/if}
        {#if selectedListing.availableOn}
          <span>Available {new Date(selectedListing.availableOn).toLocaleDateString()}</span>
        {:else}
          <span>Available Now</span>
        {/if}
      </div>

      <!-- 4. Description -->
      {#if selectedListing.primaryDescription ?? selectedListing.description}
        <p class="mt-4 text-[color:#151028]/90 text-sm">
          {selectedListing.primaryDescription ?? selectedListing.description}
        </p>
      {/if}

      <!-- 5. Video tour -->
      {#if videoId}
        <div class="mt-4 aspect-video w-full max-w-2xl rounded-lg overflow-hidden bg-black/5">
          <iframe
            src="https://www.youtube.com/embed/{videoId}"
            title="Video tour"
            class="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      {/if}

      <!-- 6. Photo gallery -->
      {#if photos.length > 0}
        <div class="mt-4">
          <h3 class="text-sm font-semibold text-[color:#151028]/80 mb-2">Photos</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {#each photos as photo (photo)}
              <img src={photo} alt="" class="w-full aspect-[4/3] object-cover rounded" />
            {/each}
          </div>
        </div>
      {/if}

      <!-- 7. Amenities -->
      {#if amenities.length > 0}
        <div class="mt-4">
          <h3 class="text-sm font-semibold text-[color:#151028]/80 mb-2">Amenities</h3>
          <div class="flex flex-wrap gap-2">
            {#each amenities as amenity (amenity)}
              <span
                class="rounded-full bg-gray-100 text-[color:#151028] text-xs font-medium px-3 py-1"
                >{amenity}</span
              >
            {/each}
          </div>
        </div>
      {/if}

      <!-- 7b. Income Restricted Housing (guide 6.3) -->
      {#if isAffordableListing(selectedListing)}
        {@const incomeLimitsData = getIncomeLimitsForListing(selectedListing)}
        <div class="mt-4">
          <h3 class="text-sm font-semibold text-[color:#151028]/80 mb-2">
            Income Restricted Housing
            {#if selectedListing.affordableHousingProgramName}
              <span class="font-normal text-[color:#151028]/70"
                >({selectedListing.affordableHousingProgramName})</span
              >
            {/if}
          </h3>
          {#if selectedListing.amiPercent != null}
            <p class="text-sm text-[color:#151028]/80 mb-2">{selectedListing.amiPercent}% AMI</p>
          {/if}
          {#if incomeLimitsData && incomeLimitsData.limits?.length > 0}
            {@const lim = incomeLimitsData}
            <p class="text-xs text-[color:#151028]/70 mb-2">
              Applicants must earn at or below these amounts (annual household income):
            </p>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border border-gray-200">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="text-left p-2 font-semibold">Household Size</th>
                    <th class="text-right p-2 font-semibold">Annual Income Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {#each lim.limits as limit (limit.householdSize)}
                    <tr class="border-t border-gray-100">
                      <td class="p-2"
                        >{limit.householdSize} person{limit.householdSize === 1 ? '' : 's'}</td
                      >
                      <td class="text-right p-2">{formatIncomeLimit(limit.limit)}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            {#if lim.year}
              <p class="text-xs text-[color:#151028]/60 mt-1">Limits for {lim.year}</p>
            {/if}
          {:else}
            <p class="text-sm text-[color:#151028]/80">
              Income limits apply. See our <a
                href={ROUTES.AFFORDABLE}
                class="underline font-semibold">Affordable Housing</a
              > page for details.
            </p>
          {/if}
        </div>
      {/if}

      <!-- 8. Policies (pet) -->
      {#if selectedListing.catsAllowed != null || selectedListing.dogsAllowed != null || selectedListing.dogPolicy}
        <div class="mt-4 text-sm text-[color:#151028]/80">
          {#if selectedListing.catsAllowed != null}
            <p>Cats: {selectedListing.catsAllowed ? 'Allowed' : 'Not allowed'}</p>
          {/if}
          {#if selectedListing.dogsAllowed != null}
            <p>Dogs: {selectedListing.dogsAllowed ? 'Allowed' : 'Not allowed'}</p>
          {/if}
          {#if selectedListing.dogPolicy}
            <p class="mt-1">{selectedListing.dogPolicy}</p>
          {/if}
        </div>
      {/if}

      <!-- 9. Bottom CTAs -->
      <div class="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
        {#if applicationUrl && acceptingApplications}
          <a
            href={applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="primary-btn text-sm font-semibold px-5 py-2.5 rounded">Apply Now</a
          >
        {/if}
        <a href={tourUrl} class="primary-btn text-sm font-semibold px-5 py-2.5 rounded"
          >Schedule a Tour</a
        >
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>

<Footer />
