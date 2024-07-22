const { transform } = require('typescript');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xxlarge36: ['2.25rem', { lineHeight: '3rem' }],
        xxlarge32: ['2rem', { lineHeight: '2.625rem' }],
        xlarge28: ['1.75rem', { lineHeight: '2.375rem' }],
        large26: ['1.625rem', { lineHeight: '2.125rem' }],
        medium24: ['1.5rem', { lineHeight: '2rem' }],
        medium22: ['1.375rem', { lineHeight: '1.875rem' }],
        small20: ['1.25rem', { lineHeight: '1.75rem' }],
        small18: ['1.125rem', { lineHeight: '1.625rem' }],
        xsmall16: ['1rem', { lineHeight: '1.5rem' }],
        xsmall14: ['0.875rem', { lineHeight: '1.25rem' }],
        xxsmall12: ['0.75rem', { lineHeight: '1rem' }],
      },
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
          10: '#EDEEFE',
          20: '#DBDDFD',
          30: '#CACCFC',
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
          95: '#F9F9F8',
          100: '#FAFAFA',
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
        '06': [
          '0px 0px 12px 0px rgba(255, 255, 255, 0.45)',
          '4px 4px 8px 0px rgba(0, 0, 0, 0.04)',
        ],
      },
      backgroundImage: {
        'gradient-start':
          'linear-gradient(165deg, #EDEEFE 10.2%, #D1D4FF 93.43%)',
        'gradient-cv': 'linear-gradient(165deg, #DBDDFD 10.2%, #9EADFF 93.43%)',
        'gradient-interview':
          'linear-gradient(165deg, #A9C1FF 10.2%, #667FFF 93.43%)',
        'gradient-growth':
          'linear-gradient(165deg, #667FFF 10.2%, #4D55F5 80.95%)',
        'gradient-desc':
          'linear-gradient(180deg, rgba(77, 85, 245, 0.00) 0%, rgba(77, 85, 245, 0.70) 100%)',
      },
      keyframes: {
        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-60%) translateX(-50%)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(-50%) translateX(-50%)',
          },
        },
      },
      animation: {
        fadeInDown: 'fadeInDown 1s ease-in-out',
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
  plugins: [require('tailwind-scrollbar-hide')],
};
