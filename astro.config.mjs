// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://jaydenwindle.com',
  base: './',
  integrations: [mdx(), sitemap(), react()],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      theme: 'solarized-dark',
    },
  },

  experimental: {
    fonts: [{
      name: "DepartureMono",
      cssVariable: "--font-departure-mono",
      provider: "local",
      variants: [
        {
          src: [
            "./src/assets/fonts/DepartureMono-Regular.otf",
            "./src/assets/fonts/DepartureMono-Regular.woff",
            "./src/assets/fonts/DepartureMono-Regular.woff2",
          ]
        },
      ]
    }, {
      name: "IBM Plex Sans",
      cssVariable: "--font-ibm-plex-sans",
      provider: "local",
      variants: [
        {
          weight: "400",
          src: ["./node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2"]
        },
        {
          weight: "600",
          src: ["./node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2"]
        },
      ]
    }]
  },

  redirects: {
    "/writing/strawberry-graphql-part-1": "/writing/strawberry-graphql-queries",
  },
});
