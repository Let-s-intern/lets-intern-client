import preset from '@letscareer/tailwind-config/preset';

/** @type {import('tailwindcss').Config} */
const config = {
  presets: [preset],
  content: ['./index.html', './src/**/*.{html,js,jsx,ts,tsx}'],
};

export default config;
