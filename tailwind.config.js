/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkTerminal: {
          bg: '#0a0a0a',
          surface: '#121212',
          neon: '#00ff00',
          text: '#33ff33'
        }
      }
    },
  },
  plugins: [],
}
