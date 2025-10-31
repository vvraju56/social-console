/****************** Tailwind config ******************/
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f6ff',
          100: '#e0edff',
          200: '#bad3ff',
          300: '#8ab5ff',
          400: '#5f95ff',
          500: '#3a78ff',
          600: '#245fe6',
          700: '#1b49b4',
          800: '#163a8f',
          900: '#132f73',
        },
      },
      boxShadow: {
        soft: '0 10px 25px -10px rgba(0,0,0,0.25)'
      }
    },
  },
  plugins: [],
};
