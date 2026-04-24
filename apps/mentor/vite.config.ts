import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

const DEV_API_TARGET = 'https://letsintern.kr';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // apps/web/public의 공용 에셋(/icons, /logo, /images 등)을 그대로 재사용
  publicDir: resolve(__dirname, '../web/public'),
  envPrefix: 'VITE_',
  server: {
    port: 3002,
    strictPort: true,
    proxy: {
      '/api': {
        target: DEV_API_TARGET,
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', DEV_API_TARGET);
            proxyReq.setHeader('Referer', `${DEV_API_TARGET}/`);
          });
        },
      },
    },
  },
});
