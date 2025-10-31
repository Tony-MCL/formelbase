/* ==== [BLOCK: Imports] BEGIN ==== */
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "node:url"
/* ==== [BLOCK: Imports] END ==== */

/* ==== [BLOCK: Config] BEGIN ==== */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  // Github Pages base settes i workflow: npx vite build --base=/<repo>/
})
/* ==== [BLOCK: Config] END ==== */
