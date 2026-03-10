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
    : 'https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/f41721c8-efa2-4e77-8033-1225545e0e83/TheTerrapinApartments-Hero4.jpg?format=2500w';

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

<Head pageTitle="Home" {data} description={copy.global_meta_description || ''} />

<div class="relative">
  <Header />

  <div bind:this={heroSection} class="relative overflow-hidden lg:h-screen md:h-[60vh] h-[50vh]">
    <div
      class="absolute inset-0 bg-cover bg-center"
      style:background-image="url('{heroBgImage}')"
      style:transform="translateY({parallaxOffset}px)"
      style:will-change="transform"
    ></div>
  </div>
</div>

<section class="bg-white pt-12 md:pt-16 lg:pt-20">
  <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
    <div class="h-[1.5px] bg-primary-main mb-8"></div>

    <ScrollAnimation type="fade-slide-up" duration={800}>
      <div class="text-center mb-8">
        <p class="text-xl md:text-2xl lg:text-3xl text-primary-main leading-relaxed">
          Welcome to The Terrapin Apartments, located in the heart of Bellevue's vibrant community.
          Our brand-new building offers 172 modern and thoughtfully designed open Studios,
          1-bedrooms, 2-bedrooms and lofted units.
        </p>
      </div>
    </ScrollAnimation>

    <div class="h-[1.5px] bg-primary-main mb-12"></div>
  </div>

  <div class="bg-primary-main py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-6 lg:px-8">
      <ScrollAnimation type="fade-slide-up" duration={800} delay={200}>
        <div class="flex flex-col md:flex-row items-center justify-center gap-2">
          <ScrollAnimation type="slide-right" duration={600} delay={100}>
            <a
              href="/gallery"
              class="bg-primary text-primary-main px-16 py-6 md:px-20 md:py-8 rounded-full font-medium text-sm md:text-base lg:text-lg uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              data-sveltekit-preload-data="hover"
            >
              View The Gallery
            </a>
          </ScrollAnimation>

          <ScrollAnimation type="scale" duration={600} delay={200}>
            <div
              class="w-20 h-20 md:w-28 md:h-28 bg-primary-main flex items-center justify-center shadow-lg overflow-hidden"
            >
              <img
                src="https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/74a8bc33-2b19-4ba4-8efa-4d3fd7dd1be4/Terrapin-Icon2.png?format=300w"
                alt="Terrapin Logo"
                class="w-full h-full object-contain p-2"
              />
            </div>
          </ScrollAnimation>

          <ScrollAnimation type="slide-left" duration={600} delay={300}>
            <a
              href={ROUTES.AVAILABILITY}
              class="bg-primary text-primary-main px-16 py-6 md:px-20 md:py-8 rounded-full font-medium text-sm md:text-base lg:text-lg uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              data-sveltekit-preload-data="hover"
            >
              View The Floor Plans
            </a>
          </ScrollAnimation>
        </div>
      </ScrollAnimation>
    </div>
  </div>

  <div class="bg-primary h-6 border-b-3 border-white"></div>
  <div class="h-16 pattern-overlay"></div>
</section>

<section class="section-standard bg-white">
  <div class="container mx-auto px-4 md:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20">
      <ScrollAnimation type="slide-right" duration={700}>
        <div>
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-normal text-primary-main mb-8">
            Our Apartments Feature
          </h2>
          <ul class="space-y-4">
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey"
                >Large Windows with abundant natural light</em
              >
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Plank flooring</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Built in Closets and Storage</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Tile backsplash</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Quartz countertops</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Energy-Star Appliances</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Efficient modern lighting</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Ceiling fans*</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">In unit laundry*</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Large decks*</em>
            </li>
          </ul>
          <p class="text-base md:text-lg text-dark-grey mt-6 italic">*In Select apartment units</p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation type="slide-left" duration={700} delay={200}>
        <div>
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-normal text-primary-main mb-8">
            Our Community Offers
          </h2>
          <ul class="space-y-4">
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Community lounge with kitchen</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Amenity deck w/ BBQ grilling station</em
              >
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Shared work space</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Fitness room</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Pet-friendly</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Pet and bike wash</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">WI-FI common areas</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Controlled access entry</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Secure package room</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Laundry room</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Bike room</em>
            </li>
            <li class="flex items-start">
              <span class="text-primary-main mr-3 mt-1">•</span>
              <em class="text-lg md:text-xl text-dark-grey">Onsite parking w/car chargers</em>
            </li>
          </ul>
        </div>
      </ScrollAnimation>
    </div>
  </div>
</section>

<!-- Bellevue Downtown Park Section -->
<section class="relative">
  <div class="h-4 bg-primary"></div>

  <div
    class="relative bg-cover bg-center min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center"
    style:background-image="url('https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/9fe60439-2d7e-49c9-9a32-5c422782e25f/Bellevue-Park.jpg?format=2500w')"
  >
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-center flex-col items-center">
        <ScrollAnimation type="fade-slide-up" duration={800} delay={100}>
          <div
            class="p-8 md:p-12 container"
            style:background-color="hsla(0, 0%, 95.69%, 0.44)"
            style:border-radius="200px"
          >
            <div class="text-center space-y-6">
              <h2 class="text-4xl md:text-5xl lg:text-7xl font-bold text-dark-grey">
                Welcome to your new backyard
              </h2>

              <h3 class="text-4xl md:text-5xl lg:text-7xl font-bold text-white">
                Bellevue Downtown Park
              </h3>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation type="fade-slide-up" duration={800} delay={300}>
          <div class="pt-4 md:pt-8">
            <a
              href={ROUTES.NEIGHBORHOOD}
              class="inline-block border-2 border-white rounded-full px-12 py-5 text-lg font-medium text-white hover:opacity-90 transition-all duration-300"
              style:background-color="hsla(0, 0%, 95.69%, 0.44)"
              data-sveltekit-preload-data="hover"
            >
              Learn about the Neighborhood
            </a>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  </div>

  <div class="bg-primary">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <p class="text-base md:text-xl lg:text-2xl leading-relaxed font-normal">
          A 21-acre oasis is located right outside your door, featuring a tree-lined promenade, a
          stepped canal, and a 240-foot wide waterfall that cascades into a reflecting pond. The
          park also offers free Wi-Fi, a great playground, public art, and stunning views of Mt.
          Rainier.
        </p>
      </ScrollAnimation>
    </div>
  </div>
  <div
    class="h-8"
    style:background-image="url('https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/9992bb25-1424-4f49-9072-a4de63fef76c/TurtleSkinPattern-ltGreen.png?format=2500w')"
    style:background-size="contain"
    style:background-repeat="repeat"
  ></div>
</section>

<section class="bg-primary py-8">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 border-t border-b border-white">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
      <ScrollAnimation type="slide-right" duration={700}>
        <div class="space-y-4">
          <h2 class="text-xl md:text-3xl lg:text-4xl font-normal mb-8 text-primary-main">
            Close commuting distance to major Bellevue office hubs like T-Mobile, Expedia,
            Microsoft, Amazon, Salesforce, SAP Concur, Eddie Bauer & more
          </h2>
          <p class="text-base md:text-xl text-primary-main">
            Getting around is easy, check out your travel times around the city
          </p>
        </div>
      </ScrollAnimation>

      <ScrollAnimation type="slide-left" duration={700} delay={200}>
        <div class="flex flex-col items-start lg:items-end gap-6">
          <ScrollAnimation type="fade-slide-up" duration={600} delay={100}>
            <a
              href="https://www.google.com/maps/dir/228+106th+Pl+NE,+Bellevue,+WA+98004"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-white border-2 border-primary-main rounded-lg px-6 py-3 text-primary-main font-medium hover:bg-primary-main hover:text-white transition-all duration-300"
            >
              See Your Travel Time
            </a>
          </ScrollAnimation>

          <ScrollAnimation type="fade-in" duration={600} delay={200}>
            <div class="text-primary-main font-normal text-center text-lg md:text-xl">
              92 Walk Score
            </div>
          </ScrollAnimation>

          <ScrollAnimation type="fade-slide-up" duration={600} delay={300}>
            <a
              href="https://www.walkscore.com/score/228-106th-pl-ne-bellevue-wa-98004"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-white border-2 border-primary-main rounded-lg px-6 py-3 text-primary-main font-medium hover:bg-primary-main hover:text-white transition-all duration-300"
            >
              View our Scores
            </a>
          </ScrollAnimation>
        </div>
      </ScrollAnimation>
    </div>
  </div>
</section>

<Footer />
