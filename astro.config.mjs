// @ts-check

import vercel from "@astrojs/vercel/serverless";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	output: "server",
	adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
