/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '390px',
        sm: '640px',
        md: '768px',
        lg: '991px',
        xl: '1280px',
        '2xl': '1440px',
      },
      fontFamily: {
        notosans: ['NotoSansKR', 'sans-serif'],
        pretendard: ['Pretendard', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4D55F5',
          dark: '#4138A3',
          light: '#757BFF',
          xlight: '#A9C1FF',
        },
        secondary: {
          DEFAULT: '#1BC47D',
          dark: '#009C89',
          light: '#43EC91',
        },
        tertiary: '#CB81F2',
        point: '#DAFF7C',
        system: {
          'positive-green': '#1BC47D',
          'positive-blue': '#5177FF',
          error: '#F64E39',
        },
        static: {
          100: '#FFFFFF',
          0: '#000000',
        },
        neutral: {
          0: '#27272D',
          10: '#2A2D34',
          20: '#3E4148',
          30: '#4C4F56',
          35: '#5C5F66',
          40: '#7A7D84',
          45: '#989BA2',
          50: '#ACAFB6',
          60: '#BDBDBD',
          70: '#CFCFCF',
          75: '#D8D8D8',
          80: '#E7E7E7',
          85: '#EFEFEF',
          90: '#F3F3F3',
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
    borderRadius: {
      none: '0',
      xxs: '0.25rem',
      xs: '0.375rem',
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      full: '9999px',
    },
  },
  plugins: [],
};
