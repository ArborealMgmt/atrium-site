<script>
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';

  import { track } from '$lib/analytics';
  import { fetchListings } from '$lib/api/listings.js';

  let { listings: propsListings = null, contactUrl = '' } = $props();

  // Component state
  let listings = $state([]);
  let loading = $state(false);
  let error = $state(null);
  let expandedPropertyId = $state(null);

  // Toggle property expansion
  function toggleProperty(propertyId) {
    if (expandedPropertyId === propertyId) {
      expandedPropertyId = null;
    } else {
      expandedPropertyId = propertyId;

      // Track unit view when expanding
      const listing = listings.find(l => (l.id || l.unitId) === propertyId);
      if (listing) {
        track('ViewUnit', {
          unit_id: listing.id || listing.unitId,
          bedrooms: listing.primaryBedrooms,
          bathrooms: listing.primaryBathrooms,
          price: listing.primaryRent || listing.advertisedRent,
          source: 'listings-component',
        });
      }
    }
  }

  // Load listings on mount if not provided as prop
  onMount(async () => {
    if (propsListings) {
      listings = propsListings;
      return;
    }

    loading = true;
    try {
      const data = await fetchListings();
      listings = data;
    } catch (err) {
      error = err;
    } finally {
      loading = false;
    }
  });
</script>

<!-- Properties Listing Section -->
{#if loading}
  <section class="section" id="properties">
    <div class="container">
      <div class="loading">Loading properties...</div>
    </div>
  </section>
{:else if error}
  <section class="section" id="properties">
    <div class="container">
      <div class="error">Error loading properties: {error?.message || error}</div>
    </div>
  </section>
{:else if listings?.length}
  <section class="section" id="properties">
    <div class="container">
      <div class="properties-list">
        {#each listings as listing (listing.id || listing.unitId)}
          {@const propertyId = listing.id || listing.unitId}
          {@const allPhotos = listing.listingPhotos || listing.unitPhotos || []}
          {@const primaryPhoto = allPhotos[0] || ''}
          {@const price =
            listing.primaryRent ||
            listing.advertisedRent ||
            listing.listingAdvertisedRent ||
            'Price on request'}
          {@const sqft = listing.primarySquareFeet || listing.sqft || null}
          {@const bedBath =
            listing.primaryBedrooms && listing.primaryBathrooms
              ? `${listing.primaryBedrooms} bed / ${listing.primaryBathrooms} bath`
              : listing.bedAndBath || ''}

          <div
            class="property-card"
            class:expanded={expandedPropertyId === propertyId}
            role="button"
            tabindex="0"
            onclick={e => {
              e.stopPropagation();
              toggleProperty(propertyId);
            }}
            onkeydown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleProperty(propertyId);
              }
            }}
          >
            <!-- Property Preview (Collapsed State) -->
            <div class="property-preview">
              <!-- Property Image -->
              {#if primaryPhoto}
                <div class="property-image-wrapper">
                  <img src={primaryPhoto} alt="Property" />
                </div>
              {/if}

              <!-- Property Basic Info -->
              <div class="property-info">
                <div class="property-header">
                  <div class="property-header-left">
                    {#if bedBath}
                      <p class="property-bed-bath">{bedBath}</p>
                    {/if}
                    {#if sqft}
                      <p class="property-sqft">{sqft} sqft</p>
                    {/if}
                  </div>
                  <p class="property-price">
                    ${typeof price === 'number' ? price.toLocaleString() : price}
                  </p>
                </div>

                {#if listing.primaryDescription || listing.description}
                  <p class="property-description">
                    {listing.primaryDescription || listing.description || ''}
                  </p>
                {/if}

                <!-- Expand/Collapse Indicator -->
                <div class="property-expand-indicator">
                  <span
                    >{expandedPropertyId === propertyId
                      ? 'Click to collapse'
                      : 'Click for details'}</span
                  >
                </div>
              </div>
            </div>

            <!-- Expandable Details -->
            {#if expandedPropertyId === propertyId}
              <div class="property-details" transition:slide={{ duration: 400 }}>
                <!-- Photo Gallery -->
                {#if allPhotos.length > 0}
                  <div class="property-photo-gallery">
                    {#each allPhotos as photo, i (photo)}
                      <div class="property-gallery-image">
                        <img src={photo} alt="Property photo {i + 1}" />
                      </div>
                    {/each}
                  </div>
                {/if}

                <!-- All Details in Compact Grid -->
                <div class="property-info-grid">
                  {#if listing.address1 || listing.city}
                    <div class="property-info-item">
                      <span class="property-label">Address</span>
                      <span class="property-value">
                        {[
                          listing.address1,
                          listing.address2,
                          listing.city,
                          listing.state,
                          listing.zip,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  {/if}
                  {#if listing.primaryBedrooms}
                    <div class="property-info-item">
                      <span class="property-label">Bedrooms</span>
                      <span class="property-value">{listing.primaryBedrooms}</span>
                    </div>
                  {/if}
                  {#if listing.primaryBathrooms}
                    <div class="property-info-item">
                      <span class="property-label">Bathrooms</span>
                      <span class="property-value">{listing.primaryBathrooms}</span>
                    </div>
                  {/if}
                  {#if sqft}
                    <div class="property-info-item">
                      <span class="property-label">Square Feet</span>
                      <span class="property-value">{sqft}</span>
                    </div>
                  {/if}
                  {#if listing.unitType}
                    <div class="property-info-item">
                      <span class="property-label">Unit Type</span>
                      <span class="property-value">{listing.unitType}</span>
                    </div>
                  {/if}
                  {#if listing.listingDeposit || listing.deposit}
                    <div class="property-info-item">
                      <span class="property-label">Deposit</span>
                      <span class="property-value"
                        >${listing.listingDeposit || listing.deposit}</span
                      >
                    </div>
                  {/if}
                  {#if listing.applicationFee}
                    <div class="property-info-item">
                      <span class="property-label">Application Fee</span>
                      <span class="property-value">${listing.applicationFee}</span>
                    </div>
                  {/if}
                  {#if listing.utilitiesIncluded !== null && listing.utilitiesIncluded !== undefined}
                    <div class="property-info-item">
                      <span class="property-label">Utilities</span>
                      <span class="property-value">
                        {listing.utilitiesIncluded ? 'Included' : 'Not Included'}
                      </span>
                    </div>
                  {/if}
                  {#if listing.availableOn}
                    <div class="property-info-item">
                      <span class="property-label">Available</span>
                      <span class="property-value">
                        {new Date(listing.availableOn).toLocaleDateString()}
                      </span>
                    </div>
                  {/if}
                  {#if listing.catsAllowed !== null}
                    <div class="property-info-item">
                      <span class="property-label">Cats</span>
                      <span class="property-value"
                        >{listing.catsAllowed ? 'Allowed' : 'Not Allowed'}</span
                      >
                    </div>
                  {/if}
                  {#if listing.dogsAllowed !== null}
                    <div class="property-info-item">
                      <span class="property-label">Dogs</span>
                      <span class="property-value"
                        >{listing.dogsAllowed ? 'Allowed' : 'Not Allowed'}</span
                      >
                    </div>
                  {/if}
                  {#if listing.dogPolicy}
                    <div class="property-info-item">
                      <span class="property-label">Dog Policy</span>
                      <span class="property-value">{listing.dogPolicy}</span>
                    </div>
                  {/if}
                  {#if listing.primaryAmenities || listing.amenities || listing.listingAmenities || listing.unitAmenities}
                    <div class="property-info-item property-info-full">
                      <span class="property-label">Amenities</span>
                      <span class="property-value">
                        {Array.isArray(
                          listing.primaryAmenities ||
                            listing.amenities ||
                            listing.listingAmenities ||
                            listing.unitAmenities
                        )
                          ? (
                              listing.primaryAmenities ||
                              listing.amenities ||
                              listing.listingAmenities ||
                              listing.unitAmenities
                            ).join(', ')
                          : listing.primaryAmenities ||
                            listing.amenities ||
                            listing.listingAmenities ||
                            listing.unitAmenities}
                      </span>
                    </div>
                  {/if}
                </div>

                <!-- Application & Schedule Tour -->
                <div class="property-actions">
                  {#if listing.applicationURL}
                    <a
                      href={listing.applicationURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="property-apply-button"
                      onclick={e => {
                        e.stopPropagation();
                        track('StartApplication', {
                          source: 'listings-component',
                          unitId: listing.id || listing.unitId,
                        });
                      }}
                    >
                      Apply Now
                    </a>
                  {/if}
                  {#if contactUrl}
                    <a
                      href="{contactUrl}?tour={encodeURIComponent(listing.unitName || listing.id || listing.unitId)}"
                      class="property-schedule-button"
                      onclick={(e) => e.stopPropagation()}
                    >
                      Schedule Tour
                    </a>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>
{/if}
