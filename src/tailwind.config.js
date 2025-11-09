/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // ... path lain
  ],
  theme: {
    extend: {
      // Tambahkan dua properti ini
      animation: {
        'scroll': 'scroll 40s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          // 4 film, masing-masing (10rem + 1.5rem gap) = 11.5rem
          // Total width = 4 * 11.5rem = 46rem
          '100%': { transform: 'translateX(-46rem)' }, 
        }
      }
    },
  },
  plugins: [],
}