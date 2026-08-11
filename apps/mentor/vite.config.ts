import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

/**
 * dev 프록시가 바라볼 API 서버.
 *
 * `.env` 의 `VITE_API_BASE_PATH` 를 그대로 쓴다. 예전에는 이 값이 소스에 하드코딩돼 있어
 * `.env` 를 로컬 서버로 바꿔도 요청은 계속 배포 서버로 나갔다 — 화면만 보고는 어느 서버에
 * 붙었는지 알 수 없어 QA 결과를 통째로 오해하게 만든다.
 */
const FALLBACK_API_TARGET = 'https://letsintern.kr';

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
      `[apps/mentor/vite.config] Missing required env: ${missing.join(', ')}. ` +
        `Set them in apps/mentor/.env (see .env.example).`,
    );
  }

  const apiTarget = env.VITE_API_BASE_PATH || FALLBACK_API_TARGET;

  return {
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
      host: true,
      port: 3002,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Origin', apiTarget);
              proxyReq.setHeader('Referer', `${apiTarget}/`);
            });
          },
        },
      },
    },
  };
});
