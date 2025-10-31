/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          1: "#0b1220",
          2: "#111827"
        }
      }
    }
  },
  plugins: []
}
