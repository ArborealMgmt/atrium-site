<script>
  import { getImageUrl, getMediaByRole } from '$lib/api/media.js';
  import FloorPlanGrid from '$lib/components/FloorPlanGrid.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import ScrollAnimation from '$lib/components/ScrollAnimation.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import Head from '$lib/seo/Head.svelte';

  /**
   * @typedef {Object} FloorPlan
   * @property {string} imageUrl
   * @property {string} name
   */

  // Configuration constants
  const FLOOR_PLANS_PER_ROW = 2;
  const FLOOR_PLANS_PER_SECTION = FLOOR_PLANS_PER_ROW * 2; // 4 per section
  const ANIMATION_DELAY_BASE = 100;

  // Fallback floor plans (used if CMS data is unavailable)
  const FALLBACK_FLOOR_PLANS = [
    {
      imageUrl:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1762456805692-QA4IMUCL6PT8HUVLOOWQ/1-BEDROOM+-+LEVEL+4+%28SIM+%40+5+%26+6%29+SE.jpg?format=1000w',
      name: '2 Bedroom - Level 2 SW',
    },
    {
      imageUrl:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1762456806106-2GP077VZ3OZV8FUBSCZA/2-BEDROOM+-+LEVEL+2+SW.jpg?format=1000w',
      name: '2 Bedroom - Level 3 SE',
    },
    {
      imageUrl:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1762456810611-52YMIZ3HDMQH8APFJYEB/2-BEDROOM+-+LEVEL+3+SE.jpg?format=750w',
      name: '2 Bedroom - Levels 4-7 (SIM @ 8) Courtyard',
    },
    {
      imageUrl:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1762456811616-SXYSPPK917447BSWNZ4O/2-BEDROOM+-+LEVELS+4-7+%28SIM+%40+8%29+COURTYARD.jpg?format=750w',
      name: 'Studio - Level 2 West',
    },
    {
      imageUrl:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1762456813877-NSVQEZZJZFSYQ59K2831/STUDIO+-+LEVEL+2+WEST.jpg?format=1000w',
      name: 'Studio - Level 3 East',
    },
    {
      imageUrl:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1762456815409-L6AWW8KPX4OTQIVD1P1O/STUDIO+-+LEVEL+3+EAST.jpg?format=1000w',
      name: 'Studio - Levels 3 & 7 (SIM @ 8) Courtyard',
    },
    {
      imageUrl:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1762456816930-EDTFD401LP68HXCN3VJZ/STUDIO+-+LEVELS+3+%26+7+%28SIM+%40+8%29+COURTYARD.jpg?format=750w',
      name: 'Studio - Levels 4-7 (SIM @ 8) West',
    },
    {
      imageUrl:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1762456818517-U37IT888AXY5XIHYQ9RK/STUDIO+-+LEVELS+4-7+%28SIM+%40+8%29+WEST.jpg?format=1000w',
      name: 'Type A 1 Bedroom - Level 8 East',
    },
    {
      imageUrl:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1762456820891-GLRGSCU33PN1DD9VSDCN/TYPE+A+1-BEDROOM+-+LEVEL+8+EAST.jpg?format=750w',
      name: 'Type A Studio - Levels 4-6 Courtyard',
    },
    {
      imageUrl:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1762456822144-UQNK43PHQ5W1L3O85FNL/TYPE+A+STUDIO+-+LEVELS+4-6+COURTYARD.jpg?format=750w',
      name: 'Type A Studio - Levels 4-6 Courtyard',
    },
  ];

  /** @type {any} */
  let { data } = $props();

  const copy = data?.content || {};
  const media = data?.media || {};

  /**
   * Transform CMS floorplan media into FloorPlan format
   * @param {Array<any>} floorplanMedia - Array of media items from CMS
   * @returns {Array<FloorPlan>}
   */
  function transformFloorPlansFromCMS(floorplanMedia) {
    if (!Array.isArray(floorplanMedia) || floorplanMedia.length === 0) {
      return [];
    }

    return floorplanMedia
      .map(item => {
        const imageUrl = getImageUrl(item, { width: 1000, quality: 'auto' });
        if (!imageUrl) return null;

        return {
          imageUrl,
          name: item.name || item.title || item.fieldName || '',
        };
      })
      .filter((/** @type {FloorPlan | null} */ item) => item !== null);
  }

  /**
   * Get floor plans from CMS or fallback to hardcoded data
   * @type {Array<FloorPlan>}
   */
  const floorPlans = $derived.by(() => {
    const cmsFloorPlans = getMediaByRole(media, 'floorplan');
    const transformed = transformFloorPlansFromCMS(cmsFloorPlans);

    // Use CMS data if available, otherwise fallback
    return transformed.length > 0 ? transformed : FALLBACK_FLOOR_PLANS;
  });

  let floorModalOpen = $state(false);
  /** @type {number} */
  let selectedFloorIndex = $state(0);

  /**
   * Open floor plan modal
   * @param {number} index
   */
  function openFloorModal(index) {
    if (index < 0 || index >= floorPlans.length) {
      return;
    }
    selectedFloorIndex = index;
    floorModalOpen = true;
  }

  /**
   * Navigate to next floor plan in modal
   */
  function nextFloor() {
    if (floorPlans.length > 0) {
      selectedFloorIndex = (selectedFloorIndex + 1) % floorPlans.length;
    }
  }

  /**
   * Navigate to previous floor plan in modal
   */
  function prevFloor() {
    if (floorPlans.length > 0) {
      selectedFloorIndex = (selectedFloorIndex - 1 + floorPlans.length) % floorPlans.length;
    }
  }

  /**
   * Calculate grid sections based on total floor plans
   * @type {Array<{startIndex: number, delay: number}>}
   */
  const gridSections = $derived.by(() => {
    const sections = [];
    for (let i = 0; i < floorPlans.length; i += FLOOR_PLANS_PER_SECTION) {
      sections.push({
        startIndex: i,
        delay: (i / FLOOR_PLANS_PER_SECTION) * ANIMATION_DELAY_BASE + ANIMATION_DELAY_BASE,
      });
    }
    return sections;
  });
</script>

<Head
  pageTitle={copy.global_property_name
    ? `${copy.global_property_name} | Floor Plans, Availability & Apply`
    : 'Floor Plans, Availability & Apply'}
  {data}
  description={copy.global_meta_description || 'Browse available floor plans and apartments'}
/>

<Header />

<!-- Sightmap Interactive Floor Plans Section -->
<section class="section-standard bg-white">
  <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <div class="mb-8">
        <h2 class="text-3xl md:text-4xl font-normal text-secondary-main mb-2">
          Availability & Property Map
        </h2>
        <div class="h-px w-full bg-primary-main mb-6"></div>
      </div>
    </ScrollAnimation>
    <div class="w-full" style:height="800px">
      <iframe
        width="100%"
        height="100%"
        src="https://sightmap.com/embed/y8px86g3v19"
        frameborder="0"
        allow="geolocation; web-share; clipboard-write"
        style:min-height="600px"
        title="Availability & Property Map - Interactive Floor Plans"
      ></iframe>
    </div>
  </div>
</section>

<!-- Floor Plans Section -->
<section class="section-standard bg-white">
  <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <div class="mb-8">
        <div class="mb-6">
          <h1 class="text-3xl md:text-4xl font-normal text-secondary-main mb-2">Floorplans</h1>
        </div>
        <div class="h-px w-full bg-primary-main"></div>
      </div>
    </ScrollAnimation>

    {#if floorPlans.length > 0}
      <div class="mt-8 space-y-12">
        {#each gridSections as section, sectionIndex (sectionIndex)}
          <FloorPlanGrid
            {floorPlans}
            startIndex={section.startIndex}
            itemsPerRow={FLOOR_PLANS_PER_ROW}
            maxItems={FLOOR_PLANS_PER_SECTION}
            animationDelay={ANIMATION_DELAY_BASE}
            onFloorPlanClick={openFloorModal}
          />
        {/each}
      </div>
    {:else}
      <div class="mt-8 text-center text-grey-main">
        <p class="text-lg">Floor plans coming soon.</p>
      </div>
    {/if}
  </div>
</section>

<!-- Floor Plans Modal -->
<Dialog.Root bind:open={floorModalOpen}>
  {#if floorPlans.length > 0 && selectedFloorIndex >= 0 && selectedFloorIndex < floorPlans.length}
    {@const currentFloor = floorPlans[selectedFloorIndex]}
    <Dialog.Content class="floor-plan-modal" showCloseButton={false}>
      <div class="relative w-full h-full flex items-center justify-center p-8 md:p-12">
        <img
          src={currentFloor.imageUrl}
          alt={currentFloor.name || `Floor Plan ${selectedFloorIndex + 1}`}
          class="max-w-full max-h-full w-auto h-auto object-contain"
        />

        {#if floorPlans.length > 1}
          <button
            onclick={prevFloor}
            type="button"
            class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 text-white hover:text-white/90 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full hover:bg-white/10"
            aria-label="Previous floor"
          >
            <svg
              class="w-10 h-10 md:w-12 md:h-12"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        {/if}

        {#if floorPlans.length > 1}
          <button
            onclick={nextFloor}
            type="button"
            class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 text-white hover:text-white/90 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full hover:bg-white/10"
            aria-label="Next floor"
          >
            <svg
              class="w-10 h-10 md:w-12 md:h-12"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        {/if}

        <Dialog.Close
          class="absolute top-4 md:top-6 right-4 md:right-6 z-20 p-2 text-white hover:text-white/90 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full hover:bg-white/10"
        >
          <svg
            class="w-7 h-7 md:w-8 md:h-8"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="sr-only">Close</span>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  {/if}
</Dialog.Root>

<Footer />

<style>
  :global([data-slot='dialog-overlay']) {
    background-color: rgba(0, 0, 0, 0.9) !important;
  }

  :global(.floor-plan-modal) {
    position: fixed !important;
    inset: 0 !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    width: 100vw !important;
    height: 100vh !important;
    padding: 0 !important;
    margin: 0 !important;
    background-color: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    overflow: hidden !important;
    border-radius: 0 !important;
    transform: none !important;
    translate: none !important;
    display: flex !important;
    grid-template-columns: none !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0 !important;
  }

  :global(.floor-plan-modal > *) {
    width: 100% !important;
    height: 100% !important;
  }
</style>
