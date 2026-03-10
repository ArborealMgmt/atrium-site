<script>
  import ScrollAnimation from '$lib/components/ScrollAnimation.svelte';

  /**
   * @typedef {Object} FloorPlan
   * @property {string} imageUrl
   * @property {string} name
   */

  /**
   * @param {Object} props
   * @param {Array<FloorPlan>} props.floorPlans
   * @param {number} props.startIndex
   * @param {number} props.itemsPerRow
   * @param {number} props.maxItems
   * @param {number} props.animationDelay
   * @param {function(number): void} props.onFloorPlanClick
   */
  let {
    floorPlans = [],
    startIndex = 0,
    itemsPerRow = 2,
    maxItems = itemsPerRow * 2,
    animationDelay = 100,
    onFloorPlanClick = () => {},
  } = $props();

  /**
   * Get the slice of floor plans for this grid section
   * @type {Array<FloorPlan>}
   */
  const sectionFloorPlans = $derived(floorPlans.slice(startIndex, startIndex + maxItems));

  /**
   * Handle floor plan click/keydown
   * @param {number} localIndex
   * @param {KeyboardEvent | MouseEvent} event
   */
  function handleInteraction(localIndex, event) {
    if (event.type === 'keydown') {
      const keyEvent = /** @type {KeyboardEvent} */ (event);
      if (keyEvent.key !== 'Enter' && keyEvent.key !== ' ') {
        return;
      }
      keyEvent.preventDefault();
    }
    onFloorPlanClick(startIndex + localIndex);
  }
</script>

{#if sectionFloorPlans.length > 0}
  <ScrollAnimation type="fade-slide-up" duration={800} delay={animationDelay}>
    <div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {#each sectionFloorPlans as floor, localIndex (startIndex + localIndex)}
          {@const globalIndex = startIndex + localIndex}
          <ScrollAnimation
            type="slide-left"
            duration={600}
            delay={localIndex * animationDelay}
            threshold={0.1}
          >
            <div
              role="button"
              tabindex="0"
              class="cursor-pointer focus:outline-none rounded-lg overflow-hidden"
              onclick={e => handleInteraction(localIndex, e)}
              onkeydown={e => handleInteraction(localIndex, e)}
              aria-label={`View ${floor.name || `Floor Plan ${globalIndex + 1}`}`}
            >
              <img
                src={floor.imageUrl}
                alt={floor.name || `Floor Plan ${globalIndex + 1}`}
                class="w-full h-auto transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          </ScrollAnimation>
        {/each}
      </div>
    </div>
  </ScrollAnimation>
{/if}
