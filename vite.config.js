import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [sveltekit()],
    resolve: {
      alias: {
        $config: resolve('./src/config'),
      },
    },
    server: {
      host: true, // bind to 0.0.0.0
      allowedHosts: ['.local', 'localhost', '127.0.0.1'], // permit standard localhost dev hosts
      strictPort: true, // fail if port is taken
      port: 4370,
    },
    preview: {
      host: true,
      allowedHosts: ['.local'], // same for `pnpm preview`
    },
  };
});
