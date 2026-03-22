import { defineConfig } from 'vite'
import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { router } from "sv-router/vite-plugin";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    router(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["./public/favicon.pnf"],

      manifest: {
        name: "SoundSphere",
        short_name: "SoundSphere",
        start_url: "/",
        display: "standalone",
        background_color: "#130E0E",
        theme_color: "#49971F",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,jpg}"],

        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages",
              networkTimeoutSeconds: 3
            }
          },
          {
            urlPattern: ({ request }) => request.destination === "script" || request.destination === "style",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "assets"
            }
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      }
    })
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
