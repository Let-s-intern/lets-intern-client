import preset from '@letscareer/tailwind-config/preset';

/** @type {import('tailwindcss').Config} */
const config = {
  presets: [preset],
  content: [
    './{pages,renderer,layouts,components,src}/**/*.{html,js,jsx,ts,tsx,vue}',
  ],
};

export default config;
