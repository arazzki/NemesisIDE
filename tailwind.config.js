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
        ide: {
          darkest: '#18181b', // 900
          darker: '#1e1e24',
          bg: '#1f1f23',
          sidebar: '#18181b',
          activityBar: '#121214',
          tabActive: '#1f1f23',
          tabInactive: '#141416',
          border: '#27272a',
          hover: '#2a2b36',
          accent: '#3b82f6',
          accentHover: '#2563eb',
        }
      }
    },
  },
  plugins: [],
}
