<script>
  import { browser } from '$app/environment';

  /**
   * @typedef {'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'fade-slide-up'} AnimationType
   */

  /** @type {{ type?: AnimationType; delay?: number; duration?: number; threshold?: number; once?: boolean; children?: import('svelte').Snippet }} */
  let {
    type = 'fade-in',
    delay = 0,
    duration = 600,
    threshold = 0.1,
    once = true,
    children,
  } = $props();

  let element = $state();
  let isVisible = $state(false);

  if (browser) {
    $effect(() => {
      if (!element) return;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              isVisible = true;
              if (once) {
                observer.unobserve(entry.target);
              }
            } else if (!once) {
              isVisible = false;
            }
          });
        },
        {
          threshold,
          rootMargin: '0px 0px -50px 0px', // Trigger slightly before element enters viewport
        }
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    });
  }
</script>

<div
  bind:this={element}
  class="scroll-animation scroll-animation-{type}"
  class:visible={isVisible}
  style:--animation-delay="{delay}ms"
  style:--animation-duration="{duration}ms"
>
  {#if children}
    {@render children()}
  {/if}
</div>

<style>
  .scroll-animation {
    opacity: 0;
  }

  /* Fade in animation */
  .scroll-animation-fade-in {
    transition: opacity var(--animation-duration, 600ms) ease-out var(--animation-delay, 0ms);
  }

  .scroll-animation-fade-in.visible {
    opacity: 1;
  }

  /* Slide up animation */
  .scroll-animation-slide-up {
    transition:
      opacity var(--animation-duration, 600ms) ease-out var(--animation-delay, 0ms),
      transform var(--animation-duration, 600ms) ease-out var(--animation-delay, 0ms);
    transform: translateY(40px);
  }

  .scroll-animation-slide-up.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Slide left animation */
  .scroll-animation-slide-left {
    transition:
      opacity var(--animation-duration, 600ms) ease-out var(--animation-delay, 0ms),
      transform var(--animation-duration, 600ms) ease-out var(--animation-delay, 0ms);
    transform: translateX(-40px);
  }

  .scroll-animation-slide-left.visible {
    opacity: 1;
    transform: translateX(0);
  }

  /* Slide right animation */
  .scroll-animation-slide-right {
    transition:
      opacity var(--animation-duration, 600ms) ease-out var(--animation-delay, 0ms),
      transform var(--animation-duration, 600ms) ease-out var(--animation-delay, 0ms);
    transform: translateX(40px);
  }

  .scroll-animation-slide-right.visible {
    opacity: 1;
    transform: translateX(0);
  }

  /* Scale animation */
  .scroll-animation-scale {
    transition:
      opacity var(--animation-duration, 600ms) ease-out var(--animation-delay, 0ms),
      transform var(--animation-duration, 600ms) ease-out var(--animation-delay, 0ms);
    transform: scale(0.9);
  }

  .scroll-animation-scale.visible {
    opacity: 1;
    transform: scale(1);
  }

  /* Fade slide up (combination) */
  .scroll-animation-fade-slide-up {
    transition:
      opacity var(--animation-duration, 600ms) ease-out var(--animation-delay, 0ms),
      transform var(--animation-duration, 600ms) ease-out var(--animation-delay, 0ms);
    transform: translateY(30px);
  }

  .scroll-animation-fade-slide-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>
