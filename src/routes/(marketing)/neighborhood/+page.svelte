<script>
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import ScrollAnimation from '$lib/components/ScrollAnimation.svelte';
  import { ROUTES } from '$lib/config/routes.js';
  import Head from '$lib/seo/Head.svelte';
</script>

<Head
  pageTitle="Neighborhood | Atrium Court"
  data={{}}
  description="Welcome to Othello, Seattle's global, connected urban village. Culture, transit, and community at Atrium Court."
/>

<Header />

<!-- Hero: Join us. Build the Othello Village! -->
<section class="relative">
  <div
    class="relative bg-cover bg-center min-h-[380px] md:min-h-[480px] flex items-center justify-center"
    style:background-image="url('/images/neighborhood-hero.png')"
  >
    <div class="absolute inset-0 bg-black/26"></div>
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 md:py-32 max-w-[91%] mx-auto">
      <ScrollAnimation type="fade-slide-up" duration={800}>
        <h1 class="text-3xl md:text-4xl lg:text-5xl tracking-[0.18em] text-[color:#D8E8EF]">
          Join us. Build the Othello Village!
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

<!-- Welcome Home to Othello -->
<section class="bg-[color:#D8E8EF] py-12 md:py-16">
  <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#81A9BB] text-center mb-6">
        Welcome Home to Othello: Seattle's Global, Connected Urban Village
      </h2>
      <p class="text-center text-[color:#151028] text-sm md:text-base max-w-3xl mx-auto tracking-[0.06em]">
        Welcome to the <b>Othello neighborhood</b> and the <b>Rainier Valley</b>. Our location at 7324 Martin Luther King Jr Way S is situated right in one of the most <b>culturally rich communities in the United States</b>. The entire area is distinguished by its <b>exceptional diversity and culture</b>, thanks to its long history of serving as a key <b>welcoming center for immigrant communities</b> from around the world. This inclusive and vibrant spirit remains fundamental to the neighborhood's identity today.
      </p>
    </ScrollAnimation>
  </div>
</section>

<!-- Pattern spacer -->
<section class="atrium-pattern py-24" aria-hidden="true"></section>

<!-- Culture and Community at our Core (coral + image) -->
<section>
  <div class="grid grid-cols-1 md:grid-cols-2">
    <div class="bg-[color:#F5A088] px-10 md:px-16 py-14 md:py-16 order-2 md:order-1">
      <ScrollAnimation type="fade-slide-up" duration={700}>
        <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#151028] mb-8">
          Culture and Community at our Core
        </h2>
        <div class="space-y-6 text-sm md:text-base text-[color:#151028] tracking-[0.06em]">
          <p>Right by the Othello Link Light Rails station, you'll find <b>Othello Park</b>, a local amenity for outdoor lovers. This generous 7.5-acre space acts is a community hub, offering a popular playground (featuring a <b>zip line</b>!), <b>basketball courts</b>, picnic spots, and walking paths. Actively maintained by the Othello Park Alliance, it ensures a beautiful, family-friendly <b>urban oasis</b> is always within easy reach.</p>
          <p>Prepare for a daily culinary adventure! The dining scene here is unparalleled, offering a global buffet just steps from your door. Othello is renowned for its authentic <b>East African</b> (Ethiopian and Eritrean) and <b>Vietnamese</b> restaurants, but you can also savor local favorites like New Mexican food at <b>Bang Bang Kitchen</b>.</p>
          <p>For shopping, the convenience of nearby <b>Safeway</b> is complemented by numerous <b>international markets</b> that offer specialized spices, unique produce, and global goods—meaning everything you need for daily life and world-class cooking is easily within reach.</p>
        </div>
      </ScrollAnimation>
    </div>
    <div
      class="min-h-[400px] md:min-h-[480px] bg-cover bg-center order-1 md:order-2"
      style:background-image="url('/images/AdobeStock_525840265.jpg')"
    ></div>
  </div>
</section>

<!-- The Appeal of Othello Living (image + magenta) -->
<section>
  <div class="grid grid-cols-1 md:grid-cols-2">
    <div
      class="min-h-[400px] md:min-h-[480px] bg-cover bg-center"
      style:background-image="url('/images/DSC05439.jpg')"
    ></div>
    <div class="bg-[color:#B23B7C] px-10 md:px-16 py-14 md:py-16">
      <ScrollAnimation type="fade-slide-up" duration={700}>
        <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-white mb-8">
          The Appeal of Othello Living
        </h2>
        <div class="space-y-6 text-sm md:text-base text-white tracking-[0.06em]">
          <p>The Othello neighborhood in Seattle is a truly wonderful place to live, primarily because it's a vibrant hub of <b>exceptional culture and diversity</b>. This is a community that embraces its history as a welcoming home for people from all over the world.</p>
          <p>Plus, Othello is incredibly convenient, thanks to the <b>Link Light Rail Station</b> which makes commuting easy! Our neighborhood also has good access to local bus lines and I-5.</p>
          <p>It's an area with a strong vision for the future, actively working to ensure <b>long-term affordability</b> and building new amenities like community centers, making it a great, connected, and supportive choice for families, commuters, and anyone who values a diverse urban village life.</p>
        </div>
      </ScrollAnimation>
    </div>
  </div>
</section>

<!-- Pattern spacer -->
<section class="atrium-pattern py-24" aria-hidden="true"></section>

<!-- Map -->
<section class="w-full">
  <iframe
    src="https://www.google.com/maps/d/u/0/embed?mid=1VFLMAeuIVEx5vUXy2xDhWCF0aWgRoYk&ehbc=2E312F&noprof=1"
    class="w-full h-[500px] border-0"
    title="Othello neighborhood map"
  ></iframe>
</section>

<!-- Incredible Diversity and Culture Awaits -->
<section class="bg-[color:#D8E8EF] py-12 md:py-16">
  <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
    <ScrollAnimation type="fade-slide-up" duration={800}>
      <h2 class="text-2xl md:text-3xl tracking-[0.18em] text-[color:#81A9BB] text-center mb-6">
        Incredible Diversity and Culture Awaits
      </h2>
      <p class="text-center text-[color:#151028] text-sm md:text-base max-w-3xl mx-auto tracking-[0.06em] mb-10">
        The <b>Othello area</b> is a uniquely <b>diverse and welcoming neighborhood</b> with a long history of serving immigrant communities. Its identity is built on this inclusive, vibrant spirit. Moving forward, Othello is developing into a <b>thriving urban village</b>, adding new housing, schools, and businesses, all while prioritizing <b>long-term affordability</b> and growth focused on the community.
      </p>
    </ScrollAnimation>
    <ScrollAnimation type="fade-slide-up" duration={800} delay={150}>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
        <div class="flex flex-col items-center text-center">
          <img src="/images/grocery.png" alt="Groceries Othello" class="w-28 h-28 object-contain mb-4" />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold mb-2">Diverse Shopping</h3>
          <p class="text-sm text-[color:#151028]">Nearby <b>Safeway</b> is complemented by numerous <b>international markets</b> that offer specialized spices, unique produce, and global goods.</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <img src="/images/restaurants.png" alt="International cuisine" class="w-28 h-28 object-contain mb-4" />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold mb-2">International Cuisine</h3>
          <p class="text-sm text-[color:#151028]">Othello is renowned for its authentic <b>East African</b> (Ethiopian and Eritrean) and <b>Vietnamese</b> restaurants and well as other international flavors.</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <img src="/images/rail.png" alt="Othello Light Rail" class="w-28 h-28 object-contain mb-4" />
          <h3 class="uppercase tracking-[0.18em] text-[color:#81A9BB] text-lg font-semibold mb-2">Connected by Transit</h3>
          <p class="text-sm text-[color:#151028]">Just one block from the <b>Othello Link Light Rail Station</b> ensures easy commuting to Downtown and the University of Washington.</p>
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
