<script>
  // this component takes any multi asset, can be either one image, one video, multiple images, or mulitple videos,
  // and makes it a slideshow

  let { contentName, content } = $props();

  // Helper to check if URL is a video
  function isVideo(url) {
    if (!url) return false;
    return /\.(mp4|webm|ogg)$/i.test(url);
  }

  // Extract filename from asset object or return string
  function getFilename(asset) {
    if (!asset) return null;
    if (typeof asset === 'string') return asset;
    return asset.filename || null;
  }

  // Normalize asset to array format
  const assets = $derived(() => {
    if (!content) return [];

    const value = content[contentName];
    if (!value) return [];

    // If it's an array (multi-asset)
    if (Array.isArray(value)) {
      return value.map(getFilename).filter(Boolean);
    }

    // If it's a single asset object or string
    const filename = getFilename(value);
    return filename ? [filename] : [];
  });

  // Separate videos and images
  const videos = $derived(assets().filter(url => isVideo(url)));
  const images = $derived(assets().filter(url => !isVideo(url)));

  // State for slideshow
  let currentImageIndex = $state(0);
  let currentVideoIndex = $state(0);
  let imageInterval = null;
  let videoElements = $state([]);

  // Image slideshow logic (fixed rate - change every 5 seconds)
  $effect(() => {
    if (images.length <= 1) return;

    imageInterval = setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % images.length;
    }, 5000);

    return () => {
      if (imageInterval) clearInterval(imageInterval);
    };
  });

  // Video fade transition logic
  function handleVideoEnd(event) {
    const video = event.target;
    const index = videoElements.indexOf(video);

    if (index === -1 || videos.length <= 1) return;

    // Move to next video
    currentVideoIndex = (index + 1) % videos.length;
    const nextVideo = videoElements[currentVideoIndex];

    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play();
    }
  }

  // Handle video loaded and ready
  function handleVideoReady(video) {
    video.playbackRate = 0.85; // Slightly slowed speed
    video.muted = true;
  }

  // Reset videos when list changes
  $effect(() => {
    if (videos.length > 0) {
      currentVideoIndex = 0;
    }
  });
</script>

<div class="media-layer">
  {#if videos.length > 0}
    <!-- Multiple Videos: Play with fade transitions -->
    {#if videos.length > 1}
      <div class="media-layer-container">
        {#each videos as videoSrc, index (index)}
          <video
            bind:this={videoElements[index]}
            autoplay={index === 0}
            muted
            playsinline
            class="hero-video hero-video-multiple {index === currentVideoIndex
              ? 'hero-video-active'
              : 'hero-video-inactive'}"
            onloadeddata={e => handleVideoReady(e.target, index)}
            onended={handleVideoEnd}
          >
            <source src={videoSrc} type="video/{videoSrc.match(/\.(\w+)$/)?.[1] || 'mp4'}" />
          </video>
        {/each}
      </div>
    {:else}
      <!-- Single Video -->
      <video
        autoplay
        loop
        muted
        playsinline
        class="hero-video"
        onloadeddata={e => {
          e.target.playbackRate = 0.85;
        }}
      >
        <source src={videos[0]} type="video/{videos[0].match(/\.(\w+)$/)?.[1] || 'mp4'}" />
      </video>
    {/if}
  {:else if images.length > 0}
    <!-- Images: Single or Slideshow -->
    {#if images.length > 1}
      <div class="media-layer-container">
        {#each images as imageSrc, index (index)}
          <img
            src={imageSrc}
            alt="Hero banner {index + 1}"
            class="hero-image hero-image-multiple {index === currentImageIndex
              ? 'hero-image-active'
              : 'hero-image-inactive'}"
          />
        {/each}
      </div>
    {:else}
      <!-- Single Image -->
      <img src={images[0]} alt="Hero banner" class="hero-image" />
    {/if}
  {/if}
</div>
