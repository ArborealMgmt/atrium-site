<script>
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import ScrollAnimation from '$lib/components/ScrollAnimation.svelte';
  import { ROUTES } from '$lib/config/routes.js';
  import Head from '$lib/seo/Head.svelte';

  const FLOOR_PLANS = [
    { id: 'B5', name: '1 Bedroom', src: '/images/floor-plans/unit-b5.png' },
    { id: 'B6', name: '1 Bedroom', src: '/images/floor-plans/unit-b6.png' },
    { id: 'B2', name: '1 Bedroom', src: '/images/floor-plans/unit-b2.png' },
    { id: 'A3', name: '1 Bedroom', src: '/images/floor-plans/unit-a3.png' },
    { id: 'J2', name: '1 Bedroom', src: '/images/floor-plans/unit-j2.png' },
    { id: 'C2', name: '1 Bedroom', src: '/images/floor-plans/unit-c2.png' },
  ];
</script>

<Head
  pageTitle="Apartments | Atrium Court"
  data={{}}
  description="Studio and 1-bedroom apartments at Atrium Court. Wood-style flooring, quartz countertops, natural light. View floor plans and availability."
/>

<Header />

<!-- Hero: Modern Design Meets Efficient Living -->
<section class="relative">
  <div
    class="relative bg-cover bg-center min-h-[380px] md:min-h-[480px] flex items-center justify-center"
    style:background-image="url('/images/apartments-hero.png')"
  >
    <div class="absolute inset-0 bg-black/19"></div>
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 md:py-32">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <h1 class="text-3xl md:text-4xl lg:text-5xl tracking-[0.18em] text-[color:#D8E8EF]">
          Modern Design Meets Efficient Living
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

<!-- New Studio and 1-Bedroom Apartments -->
<section class="bg-[color:#D8E8EF] py-12 md:py-16">
  <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#81A9BB] text-center mb-6">
        New Studio and 1-Bedroom Apartments
      </h2>
      <p
        class="text-center text-[color:#151028] text-sm md:text-base max-w-[82%] mx-auto tracking-[0.06em] mb-10"
      >
        Our new studio and 1-bedroom apartments at Atrium Court are all about maximizing comfort and
        convenience. We've created <b>spacious, light-filled interiors</b> that feel open and
        inviting, even within a compact, efficient design. With smart <b>open floor plans</b> and streamlined
        layouts, each apartment is the perfect blend of modern style and everyday function.
      </p>
    </ScrollAnimation>
    <ScrollAnimation type="fade-slide-up" duration={800} delay={100}>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
        <div class="flex flex-col items-center text-center">
          <img
            src="/images/wood-style-floor.png"
            alt="Wood-style flooring"
            class="w-28 h-28 object-contain mb-4"
          />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold mb-2">
            Wood-Style Flooring
          </h3>
          <p class="text-sm text-[color:#151028]">
            The beauty of a light-oak hardwood-look adds warmth and modern style.
          </p>
        </div>
        <div class="flex flex-col items-center text-center">
          <img
            src="/images/quartz-counter.png"
            alt="Quartz countertops"
            class="w-28 h-28 object-contain mb-4"
          />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold mb-2">
            Quartz Countertops
          </h3>
          <p class="text-sm text-[color:#151028]">
            Elevate your cooking experience with stylish stainless finishes & quartz countertops.
          </p>
        </div>
        <div class="flex flex-col items-center text-center">
          <img
            src="/images/natural-light.png"
            alt="Natural light"
            class="w-28 h-28 object-contain mb-4"
          />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold mb-2">
            Natural Light
          </h3>
          <p class="text-sm text-[color:#151028]">
            Thrive with floor-to-ceiling windows, private balconies, and urban views.
          </p>
        </div>
      </div>
    </ScrollAnimation>
  </div>
</section>

<!-- Pattern spacer -->
<section class="atrium-pattern py-24" aria-hidden="true"></section>

<!-- Apartment interior gallery (above floor plans) -->
<section class="w-full bg-[color:#D8E8EF] py-8 md:py-10">
  <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
    <ScrollAnimation type="fade-slide-up" duration={600}>
      <h2 class="text-xl md:text-2xl tracking-[0.18em] text-[color:#81A9BB] text-center mb-6">
        Interior Views
      </h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <img
          src="/images/apartments-gallery-1.png"
          alt="Atrium Court apartment living and kitchen"
          class="w-full h-44 sm:h-52 lg:h-60 object-cover rounded-lg shadow-md"
        />
        <img
          src="/images/apartments-gallery-2.png"
          alt="Atrium Court apartment with balcony and natural light"
          class="w-full h-44 sm:h-52 lg:h-60 object-cover rounded-lg shadow-md"
        />
        <img
          src="/images/apartments-gallery-3.png"
          alt="Atrium Court kitchen with quartz and stainless"
          class="w-full h-44 sm:h-52 lg:h-60 object-cover rounded-lg shadow-md"
        />
        <img
          src="/images/apartments-gallery-4.png"
          alt="Atrium Court apartment closet and kitchen view"
          class="w-full h-44 sm:h-52 lg:h-60 object-cover rounded-lg shadow-md"
        />
      </div>
    </ScrollAnimation>
  </div>
</section>

<!-- Floor Plans (teal) -->
<section class="bg-[color:#81A9BB] py-12 md:py-16">
  <div class="container mx-auto px-4 md:px-6 lg:px-8">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#D8E8EF] text-center mb-10">
        Floor Plans
      </h2>
      <div class="overflow-x-auto pb-4">
        <div class="flex gap-6 justify-center min-w-max px-2">
          {#each FLOOR_PLANS as plan (plan.id)}
            {@const rotateFloorPlan = plan.id === 'J2' || plan.id === 'C2'}
            <div class="flex-shrink-0 w-[280px] md:w-[320px]">
              <p class="text-[color:#D8E8EF] font-semibold tracking-[0.1em] text-center mb-1">
                Unit {plan.id}
              </p>
              <p class="text-[color:#D8E8EF]/90 text-sm tracking-[0.08em] text-center mb-3">
                {plan.name}
              </p>
              <div
                class="relative flex h-[340px] w-full items-center justify-center overflow-hidden rounded-lg bg-black sm:h-[380px] md:h-[400px]"
              >
                <div class="aspect-square w-full max-w-[252px] sm:max-w-[272px] md:max-w-[292px]">
                  <img
                    src={plan.src}
                    alt={`Unit ${plan.id} — ${plan.name.toLowerCase()} — illustrated floor plan`}
                    class="h-full w-full object-contain {rotateFloorPlan
                      ? 'rotate-90 scale-[1.14]'
                      : ''}"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      <p class="text-center text-[color:#D8E8EF] text-sm mt-6">
        View floor plan details and current availability on our <a
          href={ROUTES.AVAILABILITY}
          class="underline font-semibold">Availability</a
        > page.
      </p>
    </ScrollAnimation>
  </div>
</section>

<!-- Pattern spacer -->
<section class="atrium-pattern py-24" aria-hidden="true"></section>

<!-- Apartment Amenities (orange) -->
<section class="bg-[color:#F2A73B] py-12 md:py-16">
  <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-white text-center mb-10">
        Apartment Amenities
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <ul class="list-none space-y-2 text-[color:#151028] text-sm md:text-base tracking-[0.06em]">
          <li>Full-sized Kitchens</li>
          <li>Stainless-Steel Appliances</li>
          <li>High-End Finishes</li>
          <li>Spacious Open Floor Plans</li>
        </ul>
        <ul class="list-none space-y-2 text-[color:#151028] text-sm md:text-base tracking-[0.06em]">
          <li>Private Balconies*</li>
          <li>Private Patio*</li>
          <li>High Ceilings</li>
          <li>Light Oak Cabinets & Floors</li>
        </ul>
        <ul class="list-none space-y-2 text-[color:#151028] text-sm md:text-base tracking-[0.06em]">
          <li>Sliding Door/Room Separator</li>
          <li>Floor-to-Ceiling Windows</li>
          <li>Scenic Views</li>
        </ul>
      </div>
      <p class="text-left text-[color:#151028] text-sm mt-8 italic">* In Select Apartments</p>
    </ScrollAnimation>
  </div>
</section>

<!-- Live Othello Village Life CTA -->
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
            Live Othello Village Life.
          </h2>
          <div class="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <a href={ROUTES.AVAILABILITY} class="cta-btn-search px-8 py-3 tracking-[0.18em]"
              >Search Availability</a
            >
            <a
              href="mailto:leasing@arboreal.management"
              class="cta-btn-tour px-8 py-3 tracking-[0.18em]">Schedule a Tour</a
            >
          </div>
        </div>
      </ScrollAnimation>
    </div>
  </div>
</section>

<Footer />
