import preset from '@letscareer/tailwind-config/preset';

/** @type {import('tailwindcss').Config} */
const config = {
  presets: [preset],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './.storybook/**/*.{js,jsx,ts,tsx}',
  ],
};

export default config;
