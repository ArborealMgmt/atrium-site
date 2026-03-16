<script>
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import ScrollAnimation from '$lib/components/ScrollAnimation.svelte';
  import { ROUTES } from '$lib/config/routes.js';
  import Head from '$lib/seo/Head.svelte';
</script>

<Head
  pageTitle="Community | Atrium Court"
  data={{}}
  description="Sustainable living at Atrium Court. Community courtyard, local art, ground-floor retail, secure bike storage, and more in Othello."
/>

<Header />

<!-- Hero: Sustainable Living, Right Where the City Connects. -->
<section class="relative">
  <div
    class="relative bg-cover bg-center min-h-[380px] md:min-h-[480px] flex items-center justify-center"
    style:background-image="url('/images/community-hero.png')"
  >
    <div class="absolute inset-0 bg-black/27"></div>
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 md:py-32">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <h1 class="text-3xl md:text-4xl lg:text-5xl tracking-[0.18em] text-[color:#D8E8EF]">
          Sustainable Living, Right Where the City Connects.
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

<!-- Welcome to Your Community Hub! -->
<section class="bg-[color:#D8E8EF] py-12 md:py-16">
  <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#81A9BB] text-center mb-6">
        Welcome to Your Community Hub!
      </h2>
      <p class="text-center text-[color:#151028] text-sm md:text-base max-w-[82%] mx-auto tracking-[0.06em] mb-10">
        At Atrium Court, we believe a great home extends beyond your front door. Our amenities are thoughtfully designed to foster connection, celebrate the local culture, and make life vibrant right where you live.
      </p>
    </ScrollAnimation>
    <ScrollAnimation type="fade-slide-up" duration={800} delay={100}>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
        <div class="flex flex-col items-center text-center">
          <img src="/images/welcome-art.png" alt="Community art" class="w-28 h-28 object-contain mb-4" />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold mb-2">Art That Connects</h3>
          <p class="text-sm text-[color:#151028]">Be inspired every day by our commitment to local culture, featuring captivating <b>public art</b>. Right at the entrance, you'll find a stunning lighted rotating sculpture by local artist Fumi Amano, displaying warm greetings in the diverse languages spoken by the Othello community.</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <img src="/images/retail.png" alt="Retail level" class="w-28 h-28 object-contain mb-4" />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold mb-2">Retail Right Below</h3>
          <p class="text-sm text-[color:#151028]">Keep an eye out for upcoming BCOF businesses at Atrium Court! The BCO Fund—a collaboration between the City of Seattle's OED and Grow America—helps local businesses secure affordable, fixed rents through a shared ownership model.</p>
          <a
            href="https://growamerica.org"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-atrium-primary inline-block mt-4 text-sm px-5 py-2.5 rounded-lg"
          >
            Learn more about Grow America
          </a>
        </div>
        <div class="flex flex-col items-center text-center">
          <img src="/images/community-lounge.png" alt="Community Lounge" class="w-28 h-28 object-contain mb-4" />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold mb-2">The Courtyard Retreat</h3>
          <p class="text-sm text-[color:#151028]">Step into our beautiful <b>open courtyard area</b>, a welcoming communal outdoor space perfect for relaxing, connecting with neighbors, or simply enjoying a peaceful moment outdoors.</p>
        </div>
      </div>
    </ScrollAnimation>
  </div>
</section>

<!-- Pattern spacer -->
<section class="atrium-pattern py-24" aria-hidden="true"></section>

<!-- Community gallery: 4 images side by side -->
<section class="w-full">
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-0">
    <img
      src="/images/community-gallery-1.png"
      alt="Atrium Court outdoor lounge and patio"
      class="w-full h-48 sm:h-64 lg:h-72 object-cover"
    />
    <img
      src="/images/community-gallery-2.png"
      alt="Atrium Court community lounge interior"
      class="w-full h-48 sm:h-64 lg:h-72 object-cover"
    />
    <img
      src="/images/community-gallery-3.png"
      alt="Atrium Court rooftop patio"
      class="w-full h-48 sm:h-64 lg:h-72 object-cover"
    />
    <img
      src="/images/community-gallery-4.png"
      alt="Atrium Court rooftop amenity space"
      class="w-full h-48 sm:h-64 lg:h-72 object-cover"
    />
  </div>
</section>

<!-- Community Amenities -->
<section class="bg-[color:#D8E8EF] py-12 md:py-16">
  <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#81A9BB] text-center mb-10">
        Community Amenities
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <ul class="list-none space-y-2 text-[color:#151028] text-sm md:text-base tracking-[0.06em]">
          <li>Community Courtyard</li>
          <li>Local Art</li>
          <li>Lounge Area</li>
          <li>Sustainable & Green Features</li>
        </ul>
        <ul class="list-none space-y-2 text-[color:#151028] text-sm md:text-base tracking-[0.06em]">
          <li>Secure Bicycle Storage</li>
          <li>Resident Parcel Mail Room</li>
          <li>Underground Parking</li>
          <li>Ground Level Retail</li>
        </ul>
        <ul class="list-none space-y-2 text-[color:#151028] text-sm md:text-base tracking-[0.06em]">
          <li>Elevator</li>
          <li>Onsite Management</li>
          <li>Recycling Center</li>
          <li>Online Rental Payments</li>
        </ul>
      </div>
    </ScrollAnimation>
  </div>
</section>

<!-- Bottom gallery: 4 images side by side -->
<section class="w-full">
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-0">
    <img
      src="/images/community-bottom-1.png"
      alt="Atrium Court building exterior"
      class="w-full h-48 sm:h-64 lg:h-72 object-cover"
    />
    <img
      src="/images/community-bottom-2.png"
      alt="Atrium Court interior hallway"
      class="w-full h-48 sm:h-64 lg:h-72 object-cover"
    />
    <img
      src="/images/community-bottom-3.png"
      alt="Atrium Court courtyard and rock garden"
      class="w-full h-48 sm:h-64 lg:h-72 object-cover"
    />
    <img
      src="/images/community-bottom-4.png"
      alt="Atrium Court courtyard light well"
      class="w-full h-48 sm:h-64 lg:h-72 object-cover"
    />
  </div>
</section>

<!-- Pattern spacer -->
<section class="atrium-pattern py-24" aria-hidden="true"></section>

<!-- Practical Amenities -->
<section class="bg-[color:#D8E8EF] py-12 md:py-16">
  <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#81A9BB] text-center mb-10">
        Practical Amenities
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
        <div class="flex flex-col items-center text-center">
          <img src="/images/bike-storage.png" alt="Bike storage" class="w-28 h-28 object-contain mb-4" />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold mb-2">Secure Bicycle Storage</h3>
          <p class="text-sm text-[color:#151028]">Got a bike? No problem! We've made sure there's <b>ample and secure space</b>, so you can easily store your wheels without cluttering up your apartment.</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <img src="/images/package-area.png" alt="Package receiving" class="w-28 h-28 object-contain mb-4" />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold mb-2">Package Receiving</h3>
          <p class="text-sm text-[color:#151028]">We also have a great <b>package receiving area</b> so you never have to worry about missing a delivery or having your packages sit out on the doorstep!</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <img src="/images/garage.png" alt="Garage" class="w-28 h-28 object-contain mb-4" />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold mb-2">Underground Parking</h3>
          <p class="text-sm text-[color:#151028]">Since we're right next to the Light Rail, we kept the car spots to a minimum. We have a small amount of <b>secured parking available</b>.</p>
        </div>
      </div>
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
            <a href={ROUTES.AVAILABILITY} class="cta-btn-search px-8 py-3 tracking-[0.18em]">Search Availability</a>
            <a href="mailto:leasing@arboreal.management" class="cta-btn-tour px-8 py-3 tracking-[0.18em]">Schedule a Tour</a>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  </div>
</section>

<Footer />
