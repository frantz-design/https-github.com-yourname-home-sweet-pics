import { defineConfig } from "vite";
import { resolve } from "path";

// Multi-page static site: each .html file is its own entry point.
// No React/JSX involved — this just lets Vite build + serve the
// existing HTML/CSS/JS files exactly as they are.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        sellYourHouse: resolve(__dirname, "sell-your-house.html"),
        properties: resolve(__dirname, "properties.html"),
        about: resolve(__dirname, "about.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
});
