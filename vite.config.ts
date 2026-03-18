import { defineConfig } from 'vite'
import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { router } from "sv-router/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    router()
  ],
  
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib')
    }
  },

  define: {
    global: 'globalThis', // Allows buffer for music-metadata-reader
  },
})
