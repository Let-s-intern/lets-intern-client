/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '426px',
      },
      fontFamily: {
        notosans: ['NotoSansKR', 'sans-serif'],
        pretendard: ['Pretendard', 'sans-serif'],
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
      boxShadow: {
        '01': [
          '0px 0px 1px 0px rgba(0, 0, 0, 0.12)',
          '0px 1px 1px 0px rgba(0, 0, 0, 0.05)',
          '0px 0px 1px 0px rgba(0, 0, 0, 0.04)',
        ],
        '02': [
          '0px 1px 2px 0px rgba(0, 0, 0, 0.12)',
          '0px 0px 1px 0px rgba(0, 0, 0, 0.08)',
          '0px 0px 1px 0px rgba(0, 0, 0, 0.08)',
        ],
        '03': [
          '0px 2px 8px 0px rgba(0, 0, 0, 0.12)',
          '0px 1px 4px 0px rgba(0, 0, 0, 0.08)',
          '0px 0px 1px 0px rgba(0, 0, 0, 0.08)',
        ],
        '04': [
          '0px 6px 12px 0px rgba(0, 0, 0, 0.12)',
          '0px 4px 8px 0px rgba(0, 0, 0, 0.08)',
          '0px 0px 4px 0px rgba(0, 0, 0, 0.08)',
        ],
        '05': [
          '0px 16px 20px 0px rgba(0, 0, 0, 0.12)',
          '0px 8px 16px 0px rgba(0, 0, 0, 0.08)',
          '0px 0px 8px 0px rgba(0, 0, 0, 0.08)',
        ],
      },
    },
  },
  plugins: [],
};
