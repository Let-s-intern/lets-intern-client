import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

const DEV_API_TARGET = 'https://letsintern.kr';

const REQUIRED_ENV_KEYS = [
  'VITE_API_BASE_PATH',
  'VITE_SERVER_API',
  'VITE_SERVER_API_V2',
  'VITE_SERVER_API_V3',
] as const;

export default defineConfig(({ mode }) => {
  // 빌드/dev 시점에 필수 env 부재를 fail-fast.
  // silent self-origin 요청 사고 (Push 1 Critical) 방지.
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const missing = REQUIRED_ENV_KEYS.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(
      `[apps/admin/vite.config] Missing required env: ${missing.join(', ')}. ` +
        `Set them in apps/admin/.env (see .env.example).`,
    );
  }

  return {
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    envPrefix: 'VITE_',
    server: {
      host: true,
      port: 3001,
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
  };
});
