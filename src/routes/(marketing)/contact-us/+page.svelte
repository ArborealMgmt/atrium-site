<script>
  import { track } from '$lib/analytics';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import ScrollAnimation from '$lib/components/ScrollAnimation.svelte';
  import Head from '$lib/seo/Head.svelte';

  /** @type {any} */
  let { data = {} } = $props();
</script>

<Head
  pageTitle="Contact Us"
  {data}
  description="Get in touch with us about your housing needs. Submit an inquiry and we'll help you find the perfect home."
/>

<Header />

<!-- Hero Section with Contact Information -->
<section class="bg-white py-12 md:py-16 lg:py-20">
  <div class="container mx-auto px-4 md:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
      <ScrollAnimation type="slide-right" duration={700}>
        <div class="space-y-8 md:space-y-12">
          <ScrollAnimation type="fade-slide-up" duration={600} delay={100}>
            <div class="space-y-6">
              <a
                href="tel:(425)222-2911"
                class="block text-4xl md:text-5xl lg:text-6xl font-normal hover:opacity-80 transition-opacity"
                style:color="#A5CEB6"
                onclick={() => track('ClickCall', { location: 'contact-hero' })}
              >
                (425) 222-2911
              </a>
              <a
                href="mailto:live@theterrapinapts.com"
                class="block text-3xl md:text-4xl lg:text-5xl font-normal hover:opacity-80 transition-opacity underline break-all"
                style:color="#A5CEB6"
                onclick={() => track('ClickEmail', { location: 'contact-hero' })}
              >
                live@theterrapinapts.com
              </a>
            </div>
          </ScrollAnimation>

          <ScrollAnimation type="scale" duration={600} delay={200}>
            <div class="flex justify-center lg:justify-start">
              <img
                src="https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/f5c022a7-d83e-4a0f-ab8d-5504d74fc8ed/TheTerrapinApts-TextLogo.png?format=1000w"
                alt="The Terrapin Apartments Logo"
                class="h-24 md:h-32 lg:h-40 w-auto"
                loading="eager"
              />
            </div>
          </ScrollAnimation>

          <ScrollAnimation type="fade-slide-up" duration={600} delay={300}>
            <div class="text-2xl md:text-3xl lg:text-4xl font-normal" style:color="#A5CEB6">
              290 106th PL NE, Bellevue WA 98004
            </div>
          </ScrollAnimation>
        </div>
      </ScrollAnimation>

      <ScrollAnimation type="slide-left" duration={700} delay={200}>
        <div class="relative">
          <img
            src="https://images.squarespace-cdn.com/content/v1/6511e44d800b016922e26808/cc959056-a2a3-4dcc-9abf-85d2df042bc7/Hero4.jpg?format=1500w"
            alt="The Terrapin Apartments Building"
            class="w-full h-auto object-contain"
            loading="eager"
          />
        </div>
      </ScrollAnimation>
    </div>
  </div>
</section>

<!-- Google Map Section -->
<section class="bg-white py-8 md:py-12">
  <div class="container mx-auto px-4 md:px-6 lg:px-8">
    <ScrollAnimation type="fade-in" duration={800}>
      <div class="w-full" style:height="500px" style:min-height="400px">
        <iframe
          src="https://www.google.com/maps?q=290+106th+PL+NE,+Bellevue+WA+98004&output=embed"
          width="100%"
          height="100%"
          style:border="0"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="The Terrapin Apartments Location"
        ></iframe>
      </div>
    </ScrollAnimation>
  </div>
</section>

<Footer />
