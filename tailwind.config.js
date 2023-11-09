/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        notosans: ['NotoSansKR', 'sans-serif'],
      },
      colors: {
        primary: '#6963F6',
        secondary: '#9762F5',
        secondary: {
          1: '#C762F5',
          2: '#628CF5',
        },
        shade: {
          1: '#5854D1',
          2: '#4743A8',
          3: '#36337F',
          4: '#242357',
        },
        tint: {
          1: '#8782F8',
          2: '#A5A1FA',
          3: '#C3C1FB',
          4: '#E1E0FD',
          5: '#F0EFFE',
        },
        neutral: {
          black: '#1F1F33',
          grey: '#4A495C',
          dark: {
            grey: '#7F7F7F',
          },
          light: {
            grey: '#E6E8EA',
          },
          silver: '#F1F4F9',
          white: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};
