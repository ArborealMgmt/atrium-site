<script>
  import { onMount } from 'svelte';

  import { track } from '$lib/analytics';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import MapboxMap from '$lib/components/MapboxMap.svelte';
  import ScrollAnimation from '$lib/components/ScrollAnimation.svelte';
  import Head from '$lib/seo/Head.svelte';

  /** @type {any} */
  let { data = {} } = $props();

  const copy = data.content || {};
  const pointsOfInterest = data.pointsOfInterest;
  const propertyAddress = pointsOfInterest?.propertyAddress || copy.contact_address;
  const coordinates = pointsOfInterest?.propertyCoordinates;

  const heroBgImage =
    'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/f61b9348-6ea7-4838-81b8-c9f8d8acb3ff/Bellevue-Cityscape.jpg?format=2500w';

  // Gallery modal state
  let isModalOpen = $state(false);
  let currentImageIndex = $state(0);

  // Restaurant data
  const restaurants = [
    {
      name: 'Bellevue Brewing',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698099512927-2288T6WO2DWJS726ONMX/BellevueBrewing.jpg?format=500w',
    },
    {
      name: 'Barons Sino Kitchen - Chinese Cuisine',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698099510591-EKO3DZI0SPDBFLHQSFAG/Barons+Sino+Kitchen.jpeg?format=750w',
    },
    {
      name: 'Ascend Prime - Steak & Sushi',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698099510672-8738CBTBDKSX0O9MQYF9/Ascend+Prime+Steak+%26+Sushi.jpeg?format=750w',
    },
    {
      name: 'Monsoon - Modern Vietnamese',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698099516153-NV9U53ZPLAWB6GM7H9PU/Monsoon.jpg?format=750w',
    },
    {
      name: 'Cactus - Southwest Kitchen',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698099513837-F44NOGXXNHVJ87KGIW0Y/Cactus.jpg?format=500w',
    },
    {
      name: 'Wild Ginger - Asian Cuisine',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698099516903-MEF3ZFAU0XLBYD6WL0SM/WildGinger.jpeg?format=750w',
    },
    {
      name: 'Civility & Unrest - Cocktail Bar',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698099514713-8RTEZZ4HXG1IG7848DF5/Civility%26Unrest.jpg?format=500w',
    },
    {
      name: "Araya's Place - Vegan Thai",
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698100065490-O4RXYCQW232ZA97ES6N0/ArayasPlace.jpg?format=750w',
    },
    {
      name: 'Cantinetta - Italian Restaurant',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698445847919-NMWPNQ5SL5W6S2CPXK8I/Cantinetta.jpg?format=750w',
    },
    {
      name: 'Seastar - Restaurant & Raw Bar',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698446086473-INR8KZDOIWEVYH3HJ120/Seastar.jpg?format=500w',
    },
  ];

  const entertainment = [
    {
      name: 'Bellevue Arts Museum',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698091353208-QJP5AA13RMN41XQD3IQA/BAM.jpeg?format=750w',
    },
    {
      name: 'Lucky Strike Bowling',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698093073369-SKB8PXH8RP2Z3EUY4YO4/LuckyStrike.jpg?format=750w',
    },
    {
      name: 'Cinemark Cinemas',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698093373993-ZFO6OG68RL0NUEDIA2S2/CinemarkCinemas.jpg?format=750w',
    },
    {
      name: 'Bellevue Botanical Gardens',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698098498360-D11KA5K5QRBR86V5A8RE/BellvueBotanicalGardens.jpg?format=500w',
    },
    {
      name: 'TopGolf & Mini Golf at Forum Social House',
      image:
        'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/1698099575921-E6VYEVOHJ373Y266PNC9/ForumSocialHouse.jpeg?format=750w',
    },
  ];

  const allGalleryImages = $derived([...restaurants, ...entertainment]);

  /**
   * @param {number} index
   */
  function openModal(index) {
    currentImageIndex = index;
    isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    isModalOpen = false;
    document.body.style.overflow = '';
  }

  function previousImage() {
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : allGalleryImages.length - 1;
  }

  function nextImage() {
    currentImageIndex = currentImageIndex < allGalleryImages.length - 1 ? currentImageIndex + 1 : 0;
  }

  /**
   * @param {KeyboardEvent} event
   */
  function handleKeydown(event) {
    if (!isModalOpen) return;
    if (event.key === 'Escape') {
      closeModal();
    } else if (event.key === 'ArrowLeft') {
      previousImage();
    } else if (event.key === 'ArrowRight') {
      nextImage();
    }
  }

  onMount(() => {
    track('ViewNeighborhood', {});
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    };
  });
</script>

<Head
  pageTitle={copy.global_property_name
    ? `${copy.global_property_name} | Neighborhood`
    : 'Neighborhood'}
  {data}
  description={copy.global_meta_description || 'Discover the neighborhood'}
/>

<Header />

<!-- Hero Section -->
<section
  class="relative bg-cover bg-center overflow-hidden lg:h-[50vh] h-[40vh] bg-no-repeat"
  style:background-image="url('{heroBgImage}')"
>
  <div class="container mx-auto px-4 md:px-6 lg:px-8 h-full">
    <div
      class="h-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12 pt-12 md:pt-16 lg:pt-20"
    >
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <div class="flex-1 lg:max-w-6xl">
          <h1
            class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            Experience Downtown<br />Bellevue Living at its best
          </h1>
        </div>
      </ScrollAnimation>

      <ScrollAnimation type="fade-slide-up" duration={800} delay={200}>
        <div class="flex flex-col gap-4 lg:items-end">
          <a
            href="https://www.usatoday.com/story/money/business/2014/09/17/24-7-wall-st-50-best-cities-to-live/15736533/"
            target="_blank"
            rel="noopener noreferrer"
            class="border-2 border-white rounded-full px-12 py-5 text-lg font-semibold text-dark-grey hover:opacity-90 transition-all duration-300 cursor-pointer w-full lg:w-[450px] text-center"
            style:background-color="hsla(0, 0%, 95.69%, 0.60)"
          >
            Ranked #2 Best Cities to Live In
          </a>
          <a
            href="https://www.visitbellevuewa.com/things-to-do/"
            target="_blank"
            rel="noopener noreferrer"
            class="border-2 border-white rounded-full px-12 py-5 text-lg font-semibold text-dark-grey hover:opacity-90 transition-all duration-300 cursor-pointer w-full lg:w-[450px] text-center"
            style:background-color="hsla(0, 0%, 95.69%, 0.60)"
          >
            View the Bellevue City Guide
          </a>
        </div>
      </ScrollAnimation>
    </div>
  </div>
</section>

<!-- Map Section -->
{#if coordinates || propertyAddress}
  <ScrollAnimation type="fade-in" duration={800}>
    <section class="bg-white">
      <MapboxMap address={propertyAddress} {coordinates} height="600px" />
    </section>
  </ScrollAnimation>
{/if}

<!-- Best Suburbs for Foodies Section -->
<section class="bg-white">
  <div class="bg-[#8a8b8b] py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-6 lg:px-8">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <div class="max-w-5xl mx-auto text-center text-white">
          <h2 class="text-xl md:text-2xl font-bold mb-4">
            <span
              >Named one of America's
              <a
                href="https://www.thrillist.com/eat/nation/best-suburbs-in-america-for-food"
                target="_blank"
                rel="noopener noreferrer"
                class="underline hover:opacity-80 transition-opacity cursor-pointer"
              >
                <em>"Best Suburbs for Foodies"</em>
              </a>
            </span>
          </h2>
          <a
            href="https://www.visitbellevuewa.com/restaurants/"
            class="text-lg md:text-xl font-bold block hover:opacity-80 transition-opacity underline cursor-pointer mx-auto"
          >
            Check out the spots that make up Bellevue's amazing dining and drinking scene
          </a>
        </div>
      </ScrollAnimation>
    </div>
  </div>

  <div class="py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        {#each restaurants as restaurant, index (restaurant.name)}
          <ScrollAnimation type="slide-left" duration={600} delay={index * 50} threshold={0.1}>
            <button
              type="button"
              class="flex flex-col group cursor-pointer bg-transparent border-none p-0 text-left"
              onclick={() => openModal(index)}
              onkeydown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal(index);
                }
              }}
            >
              <div class="relative overflow-hidden mb-3">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  class="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p class="text-sm md:text-base font-normal text-gray-800 text-center">
                {restaurant.name}
              </p>
            </button>
          </ScrollAnimation>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- Entertainment & Shopping Section -->
<section class="bg-white py-12 md:py-16">
  <div class="container mx-auto px-4 md:px-6 lg:px-8">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <h2
        class="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-main mb-8 md:mb-12 text-center"
      >
        Awesome Entertainment & Shopping are right outside your door
      </h2>
    </ScrollAnimation>

    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
      {#each entertainment as item, index (item.name)}
        <ScrollAnimation type="slide-left" duration={600} delay={index * 50} threshold={0.1}>
          <button
            type="button"
            class="flex flex-col group cursor-pointer bg-transparent border-none p-0 text-left"
            onclick={() => openModal(restaurants.length + index)}
            onkeydown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(restaurants.length + index);
              }
            }}
          >
            <div class="relative overflow-hidden mb-3">
              <img
                src={item.image}
                alt={item.name}
                class="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <p class="text-sm md:text-base font-normal text-gray-800 text-center">{item.name}</p>
          </button>
        </ScrollAnimation>
      {/each}
    </div>

    <ScrollAnimation type="fade-slide-up" duration={800} delay={200}>
      <div class="space-y-4 text-center max-w-4xl mx-auto">
        <p class="text-base md:text-lg font-bold text-primary-main">
          <a
            href="https://bellevuecollection.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 underline hover:opacity-80 transition-opacity cursor-pointer"
          >
            Bellevue Square
          </a>
          &nbsp;is just .3 miles away - Movies, Bowling, TopGolf, Shopping & Dining
        </p>
        <p class="text-base md:text-lg font-bold text-primary-main">
          <a
            href="https://thebravern.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 underline hover:opacity-80 transition-opacity cursor-pointer"
          >
            The Shops at Braven
          </a>
          &nbsp;&amp;&nbsp;
          <a
            href="https://www.meydenbauer.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 underline hover:opacity-80 transition-opacity cursor-pointer"
          >
            Meydenbauer Center and Theatre
          </a>
          &nbsp;are just .6 miles away - Luxury Shopping, Conventions & Theatre shows
        </p>
      </div>
    </ScrollAnimation>
  </div>
</section>

<!-- Points of Interest Section -->
{#if pointsOfInterest && pointsOfInterest.categories && pointsOfInterest.categories.length > 0}
  <section class="py-12 md:py-16 bg-gray-50">
    <div class="container mx-auto px-4 md:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <ScrollAnimation type="fade-slide-up" duration={800}>
          <h2
            class="text-2xl md:text-3xl lg:text-4xl font-bold mb-10 md:mb-12 text-center text-gray-800"
          >
            Nearby Points of Interest
          </h2>
        </ScrollAnimation>

        {#each pointsOfInterest.categories as category, catIndex (category.category)}
          <ScrollAnimation type="fade-slide-up" duration={800} delay={catIndex * 100}>
            <div class="mb-10 md:mb-12 last:mb-0">
              <h3 class="text-xl md:text-2xl font-bold mb-6 capitalize text-gray-800">
                {category.category.replace('_', ' ')}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {#each category.pois as poi, poiIndex (poi.name || poi.id)}
                  <ScrollAnimation
                    type="fade-slide-up"
                    duration={600}
                    delay={poiIndex * 50}
                    threshold={0.1}
                  >
                    <div
                      class="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-all duration-300"
                    >
                      <h4 class="font-semibold mb-2 text-gray-800">{poi.name}</h4>
                      <p class="text-sm text-gray-600">
                        {poi.distance}
                        {poi.distanceUnit}
                      </p>
                    </div>
                  </ScrollAnimation>
                {/each}
              </div>
            </div>
          </ScrollAnimation>
        {/each}
      </div>
    </div>
  </section>
{/if}

{#if isModalOpen && allGalleryImages.length > 0}
  {@const currentImage = allGalleryImages[currentImageIndex]}
  <div
    class="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center"
    onclick={closeModal}
    onkeydown={e => {
      if (e.key === 'Escape') {
        closeModal();
      }
    }}
    role="button"
    tabindex="0"
    aria-label="Close gallery"
  >
    <div
      class="relative w-full h-full flex items-center justify-center"
      onclick={e => e.stopPropagation()}
      onkeydown={e => e.stopPropagation()}
      role="presentation"
    >
      <button
        onclick={closeModal}
        class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {#if allGalleryImages.length > 1}
        <button
          onclick={e => {
            e.stopPropagation();
            previousImage();
          }}
          class="absolute left-4 z-10 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
          aria-label="Previous image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      {/if}

      <div class="w-full h-full flex items-center justify-center">
        <img
          src={currentImage.image}
          alt={currentImage.name}
          class="max-w-[80vw] h-[80vh] w-auto object-contain"
        />
      </div>

      {#if allGalleryImages.length > 1}
        <button
          onclick={e => {
            e.stopPropagation();
            nextImage();
          }}
          class="absolute right-4 z-10 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
          aria-label="Next image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      {/if}

      <div
        class="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-700 text-xl md:text-2xl lg:text-3xl font-semibold cursor-pointer"
      >
        {currentImage.name}
      </div>
    </div>
  </div>
{/if}

<Footer />
