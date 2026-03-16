<script>
  import { browser } from '$app/environment';

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

  const homeHeroImage = getHeroBySlot(media, 'home_hero_image');
  const heroBgImage = homeHeroImage
    ? getImageUrl(homeHeroImage, { width: 1920, height: 1080, crop: 'fill' })
    : '/images/7324-Rendering-Plaza-230808-small.jpg';

  let heroSection = $state();
  let parallaxOffset = $state(0);

  if (browser) {
    $effect(() => {
      if (!heroSection) return;

      const handleScroll = () => {
        if (!heroSection) return;

        const rect = heroSection.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          parallaxOffset = scrollTop * 0.5;
        } else if (rect.top >= window.innerHeight) {
          parallaxOffset = 0;
        }
      };

      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    });
  }
</script>

<Head
  pageTitle="Home"
  {data}
  description={copy.global_meta_description || "Atrium Court – affordable, modern apartment homes in Seattle's Othello neighborhood with Link-connected living and community-focused amenities."}
/>

<div class="relative">
  <Header />

  <!-- Hero section (Divi Hero Section) -->
  <div
    bind:this={heroSection}
    class="relative overflow-hidden lg:h-screen md:h-[70vh] h-[60vh] flex items-center justify-center"
  >
    <div
      class="absolute inset-0 home-hero-bg"
      style:transform="translateY({parallaxOffset}px)"
      style:will-change="transform"
    ></div>

    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <div class="text-center space-y-4 md:space-y-6">
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.08em] text-[color:#D8E8EF]">
            Atrium Court
          </h1>
          <h2 class="text-2xl md:text-3xl lg:text-4xl text-[color:#D8E8EF]">
            Where Othello Connects. Your Diverse City Home.
          </h2>
        </div>
      </ScrollAnimation>
    </div>
  </div>
</div>

<!-- Category Search Section (3 cards) -->
<section class="bg-[color:#D8E8EF] py-10 md:py-14 lg:py-16">
  <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <div class="mb-8 md:mb-10 flex justify-center">
        <h2
          class="text-center text-[color:#81A9BB] tracking-[0.2em] text-xl md:text-2xl leading-relaxed max-w-3xl font-semibold"
        >
          Welcome to Atrium Court Apartments, your future home in the heart of Seattle's dynamic Othello neighborhood!
        </h2>
      </div>
    </ScrollAnimation>

    <ScrollAnimation type="fade-slide-up" duration={800} delay={150}>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12 max-w-6xl mx-auto">
        <!-- Apartment Homes -->
        <div class="flex flex-col items-center text-center space-y-4 h-full">
          <div class="w-full max-w-xs aspect-[4/3] rounded-lg shadow-md overflow-hidden">
            <img
              src="/images/DSC04855-HDR-THUMB.jpg"
              alt="Atrium Court Apartment"
              class="w-full h-full object-cover object-center"
            />
          </div>
          <h3 class="uppercase tracking-[0.2em] text-[color:#81A9BB] text-lg font-semibold">
            Apartment Homes
          </h3>
          <p class="text-sm text-[color:#151028] max-w-xs flex-1">
            Designed with efficiency in mind, our floor plans offer highly functional living spaces in a compact
            footprint. Our stylish interiors feature large windows, modern kitchens, open floor plans, and balconies
            with stunning views.
          </p>
          <a
            href={ROUTES.AVAILABILITY}
            class="btn-atrium-primary inline-block mt-auto px-8 py-3 text-xs md:text-sm rounded-sm"
          >
            Compare Floor Plans
          </a>
        </div>

        <!-- Located centrally -->
        <div class="flex flex-col items-center text-center space-y-4 h-full">
          <div class="w-full max-w-xs aspect-[4/3] rounded-lg shadow-md overflow-hidden">
            <img
              src="/images/DSC04888-THUMB.jpg"
              alt="Atrium Court Othello"
              class="w-full h-full object-cover object-center"
            />
          </div>
          <h3 class="uppercase tracking-[0.2em] text-[color:#81A9BB] text-lg font-semibold">
            Located Centrally
          </h3>
          <p class="text-sm text-[color:#151028] max-w-xs flex-1">
            Experience Othello, a truly vibrant, multicultural community! Centered around the Link Light Rail station,
            our neighborhood is a strong hub for local activity and is rich in heritage from diverse immigrant and
            refugee populations.
          </p>
          <a
            href={ROUTES.NEIGHBORHOOD}
            class="btn-atrium-primary inline-block mt-auto px-8 py-3 text-xs md:text-sm rounded-sm"
          >
            Discover Othello
          </a>
        </div>

        <!-- Your Community Hub -->
        <div class="flex flex-col items-center text-center space-y-4 h-full">
          <div class="w-full max-w-xs aspect-[4/3] rounded-lg shadow-md overflow-hidden">
            <img
              src="/images/7324-Martin-Luther-King-Jr-Way-S-23.png"
              alt="Atrium Court Apartments"
              class="w-full h-full object-cover object-center"
            />
          </div>
          <h3 class="uppercase tracking-[0.2em] text-[color:#81A9BB] text-lg font-semibold">
            Your Community Hub
          </h3>
          <p class="text-sm text-[color:#151028] max-w-xs flex-1">
            The heart of the building is our open, atrium-style central courtyard, an inviting space for residents to
            gather and lounge. Plus, a retail plaza serves as a lovely community gathering area for everyone who wants
            to relax and enjoy the bustling streetscape.
          </p>
          <a
            href={ROUTES.NEIGHBORHOOD}
            class="btn-atrium-primary inline-block mt-auto px-8 py-3 text-xs md:text-sm rounded-sm"
          >
            Our Community
          </a>
        </div>
      </div>
    </ScrollAnimation>
  </div>
</section>

<!-- Dark patterned spacer -->
<section class="atrium-pattern py-24" aria-hidden="true"></section>

<!-- About Us split section 1 -->
<section class="bg-[color:#F5A088]">
  <div
    class="max-w-none w-full bg-cover bg-center"
    style:background-image="url('/images/DSC05454-home.jpg')"
  >
    <div class="container mx-auto px-0">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div class="bg-[color:#F5A088] px-10 md:px-16 py-14 md:py-16 flex flex-col gap-8">
          <ScrollAnimation type="fade-slide-up" duration={700}>
            <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#000000]">
              Affordable Housing.<br />Vibrant Community.
            </h2>
          </ScrollAnimation>
          <ScrollAnimation type="fade-slide-up" duration={700} delay={150}>
            <p class="text-sm md:text-base tracking-[0.06em] text-[color:#151028]">
              This new, thoughtfully designed community offers 271 units of affordable workforce housing, placing you
              directly in one of the city's most vibrant and connected areas, just steps from the Link Light Rail
              station. We've focused on creating efficient, functional living spaces and incorporating amenities that
              truly serve our residents and the surrounding area.
            </p>
          </ScrollAnimation>
          <ScrollAnimation type="fade-slide-up" duration={700} delay={250}>
            <a
              href={ROUTES.AVAILABILITY}
              class="btn-atrium-primary inline-block text-xs md:text-sm px-8 py-3 rounded-sm tracking-[0.18em]"
            >
              View Apartments
            </a>
          </ScrollAnimation>
        </div>

        <div
          class="hidden md:block bg-cover bg-center"
          style:background-image="url('/images/7324FinalInteriorUnitRendering.webp')"
        >
          <div class="h-[400px] lg:h-[480px]"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- About Us split section 2 -->
<section class="bg-[color:#B23B7C]">
  <div class="container mx-auto px-0">
    <div class="grid grid-cols-1 md:grid-cols-2">
      <div
        class="hidden md:block bg-cover bg-center"
        style:background-image="url('/images/DSC05454-home.jpg')"
      >
        <div class="h-[400px] lg:h-[480px]"></div>
      </div>

      <div class="bg-[color:#B23B7C] px-10 md:px-16 py-14 md:py-16 flex flex-col gap-8">
        <ScrollAnimation type="fade-slide-up" duration={700}>
          <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#D8E8EF]">
            Connected Living in Othello.
          </h2>
        </ScrollAnimation>
        <ScrollAnimation type="fade-slide-up" duration={700} delay={150}>
          <p class="text-sm md:text-base tracking-[0.06em] text-[color:#D8E8EF]">
            Beyond providing modern housing, we believe in being part of the larger neighborhood fabric: The Atrium
            Court Apartments is designed not just as a building, but as a central, connected, and committed partner in
            the Othello neighborhood's continued growth and diversity. We look forward to welcoming you home to a
            community that is designed for stability, accessibility, and cultural connection.
          </p>
        </ScrollAnimation>
        <ScrollAnimation type="fade-slide-up" duration={700} delay={250}>
          <a
            href={ROUTES.NEIGHBORHOOD}
            class="btn-atrium-primary inline-block text-xs md:text-sm px-8 py-3 rounded-sm tracking-[0.18em]"
          >
            Explore Our Neighborhood
          </a>
        </ScrollAnimation>
      </div>
    </div>
  </div>
</section>

<!-- Dark patterned spacer -->
<section class="atrium-pattern py-24" aria-hidden="true"></section>

<!-- Othello Living, Link Connected (3 icons) -->
<section class="bg-[color:#D8E8EF] py-12 md:py-16 lg:py-20">
  <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <div class="mb-6 md:mb-8 flex flex-col items-center text-center gap-4">
        <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#81A9BB]">
          Othello Living, Link Connected.
        </h2>
        <p class="text-sm md:text-base max-w-3xl tracking-[0.06em] text-[color:#151028]">
          Atrium Court offers <b>affordable, modern living</b> designed for efficiency right in the heart of the dynamic
          Othello urban village. With <b>Link Light Rail station</b> at your doorstep, you'll have unparalleled access
          to major hubs like Downtown Seattle. Residents enjoy a culturally rich environment with on-site
          <b>community-focused public art</b> and ground-floor retail, all within steps of diverse dining, parks, and
          local amenities.
        </p>
      </div>
    </ScrollAnimation>

    <ScrollAnimation type="fade-slide-up" duration={800} delay={150}>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12 mt-4">
        <!-- Othello Park -->
        <div class="flex flex-col items-center text-center space-y-4">
          <img
            src="/images/parks.png"
            alt="Othello Park and Playground"
            class="w-28 h-28 object-contain"
          />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold">
            Othello Park
          </h3>
          <p class="text-sm text-[color:#151028]">
            Located just steps away, the nearby green space is a great escape, offering open fields, walking paths, and
            a play area for every kind of outdoor activity, from relaxing to active play.
          </p>
        </div>

        <!-- Pets Welcome -->
        <div class="flex flex-col items-center text-center space-y-4">
          <img
            src="/images/pets.png"
            alt="Pets Welcome Atrium Court Apartments"
            class="w-28 h-28 object-contain"
          />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold">
            Pets Welcome
          </h3>
          <p class="text-sm text-[color:#151028]">
            Bring your pets along! We encourage you to enjoy social hour with your pet in our community spaces, and
            having parks nearby makes daily walks convenient for both of you.
          </p>
        </div>

        <!-- City-Wide Access -->
        <div class="flex flex-col items-center text-center space-y-4">
          <img
            src="/images/rail.png"
            alt="Othello Light Rail"
            class="w-28 h-28 object-contain"
          />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold">
            City-Wide Access
          </h3>
          <p class="text-sm text-[color:#151028]">
            Since we're a Transit-Oriented Development, the Othello Link Station is right outside. This means you have
            direct, fast access to city-wide destinations, including Downtown Seattle and University District.
          </p>
        </div>
      </div>
    </ScrollAnimation>
  </div>
</section>

<!-- Live Othello Village Life fullwidth header -->
<section class="relative">
  <div
    class="relative bg-cover bg-center min-h-[420px] md:min-h-[520px] lg:min-h-[580px] flex items-center justify-center"
    style:background-image="url('/images/live-othello-hero.png')"
  >
    <div class="absolute inset-0 bg-black/20"></div>
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <div class="max-w-4xl mx-auto text-center space-y-6">
          <h2 class="text-3xl md:text-5xl lg:text-6xl tracking-[0.18em] text-[color:#D8E8EF]">
            Live Othello Village Life.
          </h2>
          <p class="text-lg md:text-2xl text-white">
            Affordable, modern homes in a connected, culturally rich neighborhood.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <a
              href={ROUTES.AVAILABILITY}
              class="cta-btn-search px-8 py-3 tracking-[0.18em]"
            >
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

<!-- Sign Up / Contact band from footer block lives in shared Footer component -->
<Footer />
