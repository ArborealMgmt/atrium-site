import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),

    // CSRF protection - simplified for single-site
    csrf: {
      checkOrigin: true,
    },

    prerender: {
      entries: [],
      handleMissingId: 'ignore',
    },
  },
};

export default config;
