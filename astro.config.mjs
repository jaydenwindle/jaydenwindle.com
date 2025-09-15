// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: 'https://jaydenwindle.com',
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
    }]
  },

  redirects: {
    "/writing/strawberry-graphql-part-1": "/writing/strawberry-graphql-queries",
  },

  adapter: netlify(),
});
