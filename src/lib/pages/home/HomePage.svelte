<script>
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import MultiAsset from '$lib/components/MultiAsset.svelte';
  import { ROUTES } from '$lib/config/routes.js';
  import Head from '$lib/seo/Head.svelte';

  let { data } = $props();

  /**
   * @param {string} tagName
   */
  function getContent(tagName) {
    if (!data.content) return null;
    return data.content[tagName];
  }
</script>

<Head pageTitle="Home" {data} />

<Header />

{#if data.loading}
  <div class="loading">Loading...</div>
{:else if data.error}
  <div class="error">Error loading content: {data.error.message}</div>
{:else if data.content}
  <section class="hero-section">
    <MultiAsset contentName="main_banner_asset" content={data.content} />

    <div class="hero-overlay"></div>

    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">{getContent('main_banner_title') || 'Welcome Home'}</h1>
        <p class="hero-subtitle">{getContent('main_banner_text') || ''}</p>
        <a class="hero-button" href={ROUTES.CONTACT_US} data-sveltekit-preload-data="hover"
          >BOOK A TOUR</a
        >
      </div>
    </div>
  </section>

  <section class="section" style:padding-bottom="40px">
    <div class="container">
      <h2 class="section-title">{getContent('events_hook_title') || ''}</h2>
      <p class="section-text" style:margin-bottom="0">{getContent('events_hook_text') || ''}</p>
    </div>
  </section>

  <section class="section" style:padding="0">
    <div class="building-section">
      <div class="building-text">
        <h2 class="building-title">{getContent('building_info_title') || 'THE BUILDING'}</h2>
        <p class="building-content">{getContent('building_info_text') || ''}</p>
        <a class="hero-button" href="/gallery" data-sveltekit-preload-data="hover"
          >VIEW MORE PHOTOS</a
        >
      </div>
      <div
        class="building-image-wrapper"
        style:background-image="url('{getContent('building_info_image')?.filename ??
          getContent('building_info_image') ??
          ''}')"
      ></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2 class="section-title">{getContent('community_hook_title') || 'FLOCK TOGETHER'}</h2>
      <p class="section-text">{getContent('community_hook_text') || ''}</p>

      {#if getContent('community_hook_amenities')?.length}
        <div class="amenities-grid">
          {#each getContent('community_hook_amenities') as amenity (amenity.title)}
            <div class="amenity-item">
              <h4 class="amenity-title">{amenity.title || ''}</h4>
              <p class="card-text">{amenity.description || ''}</p>
            </div>
          {/each}
        </div>
      {/if}

      <div style:text-align="center" style:margin-top="30px">
        <a class="hero-button" href={ROUTES.CONTACT_US} data-sveltekit-preload-data="hover"
          >CONTACT US</a
        >
      </div>
    </div>
  </section>

  <section
    class="parallax-section"
    style:background-image="url('{getContent('tour_hook_bkg_image')?.filename ??
      getContent('tour_hook_bkg_image') ??
      ''}')"
  >
    <div class="parallax-overlay"></div>
    <div class="parallax-content">
      <h2 class="section-title" style:color="white">{getContent('tour_hook_title') || ''}</h2>
      <p class="section-text" style:color="white">{getContent('tour_hook_text') || ''}</p>
      <a class="hero-button" href={ROUTES.CONTACT_US} data-sveltekit-preload-data="hover"
        >SCHEDULE A TOUR</a
      >
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2 class="section-title">{getContent('tour_hook_title2') || 'EXPLORE YOUR NEW HOME'}</h2>
      <p class="section-text">{getContent('tour_hook_text2') || ''}</p>
      <div style:text-align="center" style:margin-top="50px">
        <a class="hero-button" href={ROUTES.LISTINGS} data-sveltekit-preload-data="hover"
          >VIEW FLOORPLANS</a
        >
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="flex-grid">
        <div>
          <h2 class="section-title">{getContent('tour_hook_title3') || 'STAY CONNECTED'}</h2>
          <p class="section-text">{getContent('tour_hook_text3') || ''}</p>
          <div style:text-align="center" style:margin-top="20px">
            <a class="hero-button" href={ROUTES.CONTACT_US} data-sveltekit-preload-data="hover"
              >JOIN THE WAITLIST</a
            >
          </div>
        </div>
        <div>
          <h2 class="section-title">{getContent('tour_hook_title4') || 'CONCIERGE SUPPORT'}</h2>
          <p class="section-text">{getContent('tour_hook_text4') || ''}</p>
          <div style:text-align="center" style:margin-top="20px">
            <a class="hero-button" href={ROUTES.CONTACT_US} data-sveltekit-preload-data="hover"
              >CONTACT US</a
            >
          </div>
        </div>
      </div>
    </div>
  </section>

  <Footer />
{:else}
  <div class="empty-state">No content available</div>
{/if}
