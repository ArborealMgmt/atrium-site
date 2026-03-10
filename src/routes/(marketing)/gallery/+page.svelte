<script>
  import { onMount } from 'svelte';

  import { track } from '$lib/analytics';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import ScrollAnimation from '$lib/components/ScrollAnimation.svelte';
  import { ROUTES } from '$lib/config/routes.js';
  import Head from '$lib/seo/Head.svelte';

  /** @type {any} */
  let { data = {} } = $props();

  /** @type {string[]} */
  const galleryImages = [];
  /** @type {string[]} */
  const unitPhotos = [
    'https://res.cloudinary.com/dtpnyxy15/image/upload/v1773086506/DSC05971-HDR_ae0rn5.jpg',
    'https://res.cloudinary.com/dtpnyxy15/image/upload/v1773086365/DSC05713-HDR_rd47vp.jpg',
    'https://res.cloudinary.com/dtpnyxy15/image/upload/v1773086472/DSC05722-HDR_v87omi.jpg',
    'https://res.cloudinary.com/dtpnyxy15/image/upload/v1773086475/DSC05767-HDR_wmrnv3.jpg',
    'https://res.cloudinary.com/dtpnyxy15/image/upload/v1773086476/DSC05773-HDR_skwo5h.jpg',
    'https://res.cloudinary.com/dtpnyxy15/image/upload/v1773086477/DSC05779-HDR_g5pjzw.jpg',
    'https://res.cloudinary.com/dtpnyxy15/image/upload/v1773086501/DSC05962-HDR_jfrybj.jpg',
    'https://res.cloudinary.com/dtpnyxy15/image/upload/v1773086506/DSC05968-HDR_xi9ugv.jpg',
    'https://res.cloudinary.com/dtpnyxy15/image/upload/v1773086506/DSC05974-HDR_vwwvjx.jpg',
  ];
  const allGalleryImages = $derived([...galleryImages, ...unitPhotos]);

  let isModalOpen = $state(false);
  let currentImageIndex = $state(0);

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
    track('ViewGallery', {
      image_count: galleryImages.length,
    });
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    };
  });
</script>

<Head pageTitle="Gallery" {data} description="View photos of The Terrapin Apartments" />

<Header />

<!-- Gallery Grid Section -->
<section class="bg-white">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
    {#each galleryImages as imageUrl, index (index)}
      <ScrollAnimation type="slide-left" duration={600} delay={index * 50} threshold={0.1}>
        <div
          class="relative overflow-hidden group cursor-pointer"
          style:aspect-ratio="4/3"
          onclick={() => openModal(index)}
          role="button"
          tabindex="0"
          onkeydown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openModal(index);
            }
          }}
          aria-label="Open gallery image {index + 1} in modal"
        >
          <img
            src={imageUrl}
            alt="Terrapin Apartments Gallery Image {index + 1}"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </ScrollAnimation>
    {/each}
  </div>
</section>

<!-- Description Section -->
<section class="bg-gray-100">
  <div
    class="h-16 bg-cover bg-center container mx-auto"
    style:background-image="url('https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/498f5a5b-41c2-483e-9421-53fee33ac1b0/TurtleSkinPattern-White2-top.png?format=2500w')"
    style:background-size="contain"
    style:background-repeat="repeat"
  ></div>

  <div class="container mx-auto px-4 md:px-6 lg:px-8 py-12">
    <div class="max-w-7xl mx-auto text-center">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <p class="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8">
          With contemporary finishes, open-concept layouts, and an abundance of natural light, our
          units are a blend of functional urban living with a comtemporary aesthetic. Modern
          appliances, ample storage space, and clean modern interiors are the perfect pallette for
          you to stylize and start calling home.
        </p>
        <ScrollAnimation type="fade-slide-up" duration={800} delay={200}>
          <a
            href={ROUTES.CONTACT_US}
            class="inline-block bg-gray-800 text-white px-8 py-4 rounded-full text-lg md:text-xl font-semibold hover:bg-gray-700 transition-colors duration-200"
            onclick={() => track('ClickCTA', { location: 'gallery', cta: 'schedule-tour' })}
            data-sveltekit-preload-data="hover"
          >
            Contact us today to schedule a tour
          </a>
        </ScrollAnimation>
      </ScrollAnimation>
    </div>
  </div>
</section>

<!-- Unit Photos Section -->
<section class="bg-white">
  <div class="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <div class="text-center">
        <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-main mb-4">
          Unit Photos
        </h2>
        <ScrollAnimation type="fade-slide-up" duration={800} delay={200}>
          <p class="text-base md:text-lg text-gray-600">
            Terrapin’s interiors blend modern finishes, natural light, and thoughtful layouts for a
            refined living experience in the heart of Bellevue.
          </p>
        </ScrollAnimation>
      </div>
    </ScrollAnimation>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
    {#each unitPhotos as imageUrl, index (index)}
      {@const globalIndex = galleryImages.length + index}
      <ScrollAnimation type="slide-left" duration={600} delay={index * 50} threshold={0.1}>
        <div
          class="relative overflow-hidden group cursor-pointer"
          style:aspect-ratio="4/3"
          onclick={() => openModal(globalIndex)}
          role="button"
          tabindex="0"
          onkeydown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openModal(globalIndex);
            }
          }}
          aria-label="Open unit photo {index + 1} in modal"
        >
          <img
            src={imageUrl}
            alt="Terrapin Apartments Unit Photo {index + 1}"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </ScrollAnimation>
    {/each}
  </div>
</section>

<!-- Second Description Section -->
<section class="bg-gray-100">
  <div
    class="h-16 bg-cover bg-center container mx-auto"
    style:background-image="url('https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/498f5a5b-41c2-483e-9421-53fee33ac1b0/TurtleSkinPattern-White2-top.png?format=2500w')"
    style:background-size="contain"
    style:background-repeat="repeat"
  ></div>

  <div class="container mx-auto px-4 md:px-6 lg:px-8 py-12">
    <div class="max-w-7xl mx-auto text-left">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <p class="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
          Whether you're seeking a cozy and efficient studio or a spacious one or two bedroom unit,
          our apartments in Bellevue offer a range of options to suit your lifestyle. Experience the
          perfect blend of comfort, convenience, and community in our thoughtfully designed
          building. You'll love the modern design of our Bellevue studio, 1-bedroom and 2-bedroom
          apartments for rent.
        </p>
      </ScrollAnimation>
    </div>
  </div>
</section>

<!-- Gallery Modal -->
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
          src={currentImage}
          alt="Terrapin Apartments Gallery Image {currentImageIndex + 1}"
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
    </div>
  </div>
{/if}

<Footer />
