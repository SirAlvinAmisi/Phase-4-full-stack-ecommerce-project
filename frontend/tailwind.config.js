/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-black': '#1a202c',
        'custom-red': '#e53e3e', // A vibrant red for accents
      },
    },
  },
  plugins: [],
};