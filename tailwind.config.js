/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8f7f3',
          100: '#eceadb',
          500: '#7d8d73',
          700: '#4f5f47'
        }
      }
    },
  },
  plugins: [],
};
