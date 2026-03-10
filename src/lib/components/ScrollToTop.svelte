<script>
  import Icon from '@iconify/svelte';

  import { browser } from '$app/environment';

  let showButton = $state(false);

  if (browser) {
    $effect(() => {
      const handleScroll = () => {
        showButton = window.scrollY > 300;
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial scroll position

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    });
  }

  function scrollToTop() {
    if (browser) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }
</script>

{#if showButton}
  <button
    onclick={scrollToTop}
    class="cursor-pointer fixed bottom-8 right-8 z-50 bg-primary-main text-white p-3 rounded-full shadow-lg hover:bg-primary-main/90 flex items-center justify-center group"
    aria-label="Scroll to top"
    type="button"
  >
    <Icon
      icon="mdi:arrow-up"
      class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300"
    />
  </button>
{/if}
