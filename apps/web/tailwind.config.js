import preset from '@letscareer/tailwind-config/preset';

/** @type {import('tailwindcss').Config} */
const config = {
  presets: [preset],
  content: [
    './{pages,renderer,layouts,components,src}/**/*.{html,js,jsx,ts,tsx,vue}',
    '../../packages/*/src/**/*.{js,jsx,ts,tsx}',
  ],
};

export default config;
