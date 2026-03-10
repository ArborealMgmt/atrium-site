<script>
  import mapboxgl from 'mapbox-gl';
  import { onDestroy, onMount, tick } from 'svelte';

  import { browser } from '$app/environment';

  import { siteConfig } from '$lib/config/site-config.js';

  import 'mapbox-gl/dist/mapbox-gl.css';

  let { address, coordinates, height = '400px' } = $props();

  let mapContainer = $state(null);
  let map = $state(null);
  let loading = $state(true);
  let error = $state(null);

  // Get Mapbox access token from site config
  function getMapboxToken() {
    return siteConfig.mapboxAccessToken;
  }

  // Geocode address using Mapbox Geocoding API
  async function geocodeAddress(address) {
    const token = getMapboxToken();
    if (!token) {
      throw new Error('Mapbox access token not configured');
    }

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&limit=1`
    );

    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }

    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }

    throw new Error('Address not found');
  }

  onMount(async () => {
    if (!browser) {
      return;
    }

    // Wait for DOM to be fully rendered
    await tick();

    if (!mapContainer) {
      // Wait a bit more for the DOM element to be available
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!mapContainer) {
      error = 'Map container not available';
      loading = false;
      return;
    }

    const token = getMapboxToken();
    if (!token) {
      error = 'Mapbox access token not configured';
      loading = false;
      return;
    }

    try {
      let lat, lng;

      // Use coordinates if available, otherwise geocode the address
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        lat = coordinates.latitude;
        lng = coordinates.longitude;
      } else if (address) {
        const coords = await geocodeAddress(address);
        lat = coords.lat;
        lng = coords.lng;
      } else {
        throw new Error('No address or coordinates provided');
      }

      // Set Mapbox access token
      mapboxgl.accessToken = token;

      // Initialize map
      map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: 15,
      });

      // Add marker for property location
      new mapboxgl.Marker({ color: '#3b82f6' }).setLngLat([lng, lat]).addTo(map);

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      loading = false;
    } catch (err) {
      error = err.message || 'Failed to load map';
      loading = false;
    }
  });

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });
</script>

<div class="w-full rounded-lg overflow-hidden shadow-md" style:height>
  <!-- Always render the map container for binding, but conditionally show content -->
  <div bind:this={mapContainer} class="w-full h-full">
    {#if loading}
      <div class="w-full h-full bg-gray-200 flex items-center justify-center">
        <p class="text-gray-500">Loading map...</p>
      </div>
    {:else if error}
      <div class="w-full h-full bg-gray-200 flex items-center justify-center p-4">
        <div class="text-center">
          <p class="text-red-500 font-semibold mb-2">Map Error</p>
          <p class="text-gray-600 text-sm">{error}</p>
          {#if error.includes('access token')}
            <p class="text-gray-500 text-xs mt-2">
              Please configure PUBLIC_MAPBOX_ACCESS_TOKEN environment variable
            </p>
          {/if}
        </div>
      </div>
    {/if}
    <!-- Map will be rendered here by Mapbox GL when successful -->
  </div>
</div>
