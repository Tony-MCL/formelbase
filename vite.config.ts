/* ==== [BLOCK: Imports] BEGIN ==== */
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"
import { fileURLToPath, URL } from "node:url"
/* ==== [BLOCK: Imports] END ==== */

/* ==== [BLOCK: Config] BEGIN ==== */
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "Formelbase – Digital Formelsamling",
        short_name: "Formelbase",
        description: "Personlig, offline formelsamling for elkraft og tekniske fag.",
        theme_color: "#0b1220",
        background_color: "#0b1220",
        display: "standalone",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      },
      // Unngå "glob pattern doesn't match" og sørg for at html/js/css/png/svg tas med
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        globIgnores: ["**/node_modules/**/*", "sw.js", "workbox-*.js"]
      }
    })
  ],
  // Vite må kjenne aliaset '@' -> 'src'
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
})
/* ==== [BLOCK: Config] END ==== */
