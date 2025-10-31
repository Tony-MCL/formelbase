import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


// Husk å sette repo-navn under base hvis du bruker GitHub Pages.
// Bytt 'el-formler' til korrekt repo-navn.
export default defineConfig({
base: '/el-formler/',
plugins: [
react(),
VitePWA({
registerType: 'autoUpdate',
includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png'],
manifest: {
name: 'Formelbase – Digital Formelsamling',
short_name: 'Formelbase',
start_url: '/el-formler/',
display: 'standalone',
background_color: '#fdfbf8',
theme_color: '#d7bfa3',
icons: [
{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
]
},
workbox: {
globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}']
}
})
]
})
