import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

/** Dreper gamle service workers + cache første gang etter deploy */
async function purgeServiceWorkersOnce() {
  const KEY = "sw_purged_v1"
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
  } catch {
    // ignorer
  } finally {
    sessionStorage.setItem(KEY, "1")
    // Viktig: last siden på nytt etter at SW er fjernet, så vi får ren bundle
    location.reload()
  }
}

// Kjør purge i prod – men ikke i dev
if (import.meta.env.PROD) {
  // vi starter purge, men rander UI hvis dette ikke er første last
  purgeServiceWorkersOnce()
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
