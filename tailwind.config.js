/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6f8f4',
          100: '#eaf0e6',
          200: '#d7e2cf',
          300: '#bed0b6',
          400: '#98b393',
          500: '#759676',
          600: '#5b785d',
          700: '#4a604b',
          800: '#3d4d3f',
          900: '#334034'
        }
      }
    }
  },
  plugins: [],
};
