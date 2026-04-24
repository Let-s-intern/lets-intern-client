import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  envPrefix: 'VITE_',
  server: { port: 3001 },
});
