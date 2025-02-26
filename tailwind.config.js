// @ts-nocheck

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './{pages,renderer,layouts,components,src}/**/*.{html,js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      fontSize: {
        xxlarge36: ['2.25rem', { lineHeight: '3rem' }],
        xxlarge32: ['2rem', { lineHeight: '2.625rem' }],
        xlarge30: ['1.875rem', { lineHeight: '2.625rem' }],
        xlarge28: ['1.75rem', { lineHeight: '2.375rem' }],
        large26: ['1.625rem', { lineHeight: '2.125rem' }],
        medium24: ['1.5rem', { lineHeight: '2rem' }],
        medium22: ['1.375rem', { lineHeight: '1.875rem' }],
        small20: ['1.25rem', { lineHeight: '1.75rem' }],
        small18: ['1.125rem', { lineHeight: '1.625rem' }],
        xsmall16: ['1rem', { lineHeight: '1.5rem' }],
        xsmall14: ['0.875rem', { lineHeight: '1.25rem' }],
        xxsmall12: ['0.75rem', { lineHeight: '1rem' }],
        xxsmall10: ['0.625rem', { lineHeight: '1rem' }],
      },
      screens: {
        xs: '390px',
        sm: '640px',
        md: '768px',
        lg: '991px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1600px',
      },
      colors: {
        primary: {
          DEFAULT: '#4D55F5',
          dark: '#4138A3',
          light: '#757BFF',
          xlight: '#A9C1FF',
          5: '#F5F6FF',
          10: '#EDEEFE',
          20: '#DBDDFD',
          30: '#CACCFC',
          40: '#B8BBFB',
          80: '#7177F7',
          90: '#5F66F6',
        },
        secondary: {
          DEFAULT: '#1BC47D',
          dark: '#009C89',
          light: '#43EC91',
          0: '#FFFFFF',
          10: '#E8F9F2',
          20: '#D1F3E5',
          30: '#BBEDD8',
          40: '#A4E7CB',
          50: '#8DE1BE',
          60: '#76DCB1',
          70: '#5FD6A4',
          80: '#49D097',
          90: '#32CA8A',
          100: '#1BC47D',
        },
        tertiary: '#CB81F2',
        point: '#DAFF7C',
        challenge: '#00A8EB',
        requirement: '#FC5555',
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
        10: ['0px 0px 10px 0px rgba(0, 0, 0, 0.08)'],
        button:
          '0px 16px 20px 0px rgba(0, 0, 0, 0.12), 0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 8px 0px rgba(0, 0, 0, 0.08)',
      },
      dropShadow: {
        '05': [
          '0px 16px 20px rgba(0, 0, 0, 0.12)',
          '0px 8px 16px rgba(0, 0, 0, 0.08)',
          '0px 0px 8px rgba(0, 0, 0, 0.08)',
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
        'blog-banner-sm': 'url("/images/blog_banner_bg_sm.png")',
        'blog-banner-md': 'url("/images/blog_banner_bg_md.png")',
        'blog-banner-lg': 'url("/images/blog_banner_bg_lg.png")',
        'certificate-bg': 'url("/images/certificate_bg.png")',
        'text-decoration-line-resume':
          'url(/images/report/report-text-decoration-line-resume.svg)',
        'text-decoration-line-personal-statement':
          'url(/images/report/report-text-decoration-line-personal-statement.svg)',
      },
      keyframes: {
        'live-infinite-scroll-desktop': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-2196px)' },
        },
        'live-infinite-scroll-mobile': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-1380px)' },
        },
        'bounce-x': {
          '0%, 100%': {
            transform: 'translateX(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateX(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      animation: {
        'live-infinite-scroll-desktop':
          'live-infinite-scroll-desktop 16s linear infinite',
        'live-infinite-scroll-mobile':
          'live-infinite-scroll-mobile 12s linear infinite',
        'bounce-x': 'bounce-x 0.7s infinite',
      },
    },
    borderRadius: {
      none: '0',
      xxs: '0.25rem',
      xs: '0.375rem',
      sm: '0.5rem',
      ms: '0.625rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      full: '9999px',
    },
  },

  plugins: [require('tailwind-scrollbar-hide')],
};
