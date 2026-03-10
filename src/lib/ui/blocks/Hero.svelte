<script>
  let { heading, subheading = '', cta = 'Get started', href = '#' } = $props();
</script>

<section class="py-20">
  <div class="mx-auto max-w-4xl px-6 text-center">
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">{heading}</h1>
    {#if subheading}
      <p class="mt-4 text-lg md:text-xl text-muted-foreground">{subheading}</p>
    {/if}
    <div class="mt-8">
      <a {href} class="inline-block">
        <div class="inline-flex gap-2">
          <span class="sr-only">{cta}</span>
        </div>
      </a>
    </div>
  </div>
</section>
