/* ==== [BLOCK: Imports] BEGIN ==== */
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
/* ==== [BLOCK: Imports] END ==== */

/* ==== [BLOCK: SW Purge] BEGIN ==== */
/** Dreper gamle service workers og tømmer Cache Storage én gang etter deploy.
 *  Tvinger så én reload, slik at vi garantert kjører ny bundle.
 */
async function purgeServiceWorkersOnce() {
  const KEY = "fb_sw_purged_v1"
  if (sessionStorage.getItem(KEY)) return
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations()
      await Promise.all(regs.map(r => r.unregister().catch(() => {})))
    }
    if (typeof caches !== "undefined") {
      const keys = await caches.keys()
      await Promise.all(keys.map(k => caches.delete(k).catch(() => {})))
    }
    // ekstra: fjern eventuell gammel manifestregistrering via Workbox
    // (ufarlig hvis den ikke finnes)
  } catch {
    // ignorer
  } finally {
    sessionStorage.setItem(KEY, "1")
    // Viktig: last siden på nytt etter at SW/cacher er fjernet
    location.reload()
  }
}

if (import.meta.env.PROD) {
  purgeServiceWorkersOnce()
}
/* ==== [BLOCK: SW Purge] END ==== */

/* ==== [BLOCK: Render] BEGIN ==== */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
/* ==== [BLOCK: Render] END ==== */
