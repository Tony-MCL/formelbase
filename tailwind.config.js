/** @type {import('tailwindcss').Config} */
export default {
content: [
'./index.html',
'./src/**/*.{ts,tsx}'
],
theme: {
extend: {
colors: {
coffee: {
light: '#d7bfa3',
medium: '#b08968',
dark: '#3b2f2f',
accent: '#a67b5b',
bg: '#fdfbf8'
},
grid: '#e5e7eb',
line: '#d1d5db',
lineStrong: '#9ca3af',
weekend: '#f3f4f6',
bar: '#60a5fa',
txt: '#111827'
}
}
},
darkMode: 'media'
}
