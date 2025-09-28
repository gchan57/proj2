/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add the following animation configuration
      animation: {
        'float': 'float 12s ease-in-out infinite',
        'float-delay-1': 'float 15s ease-in-out infinite 2s',
        'float-delay-2': 'float 18s ease-in-out infinite 4s',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(-5%) rotate(0deg)' },
          '50%': { transform: 'translateY(5%) rotate(10deg)' },
        }
      }
    },
  },
  plugins: [],
}