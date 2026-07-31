import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
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
      `[apps/mentor/vite.config] Missing required env: ${missing.join(', ')}. ` +
        `Set them in apps/mentor/.env (see .env.example).`,
    );
  }

  // 소스맵 업로드는 토큰이 있을 때만 켠다. 없으면 플러그인이 빌드를 실패시킨다.
  // 미니파이된 스택(`class e extends Ut`)만 남으면 원인 추적이 사실상 불가능하므로
  // 운영 빌드에서는 CI 에 SENTRY_AUTH_TOKEN 을 넣어 반드시 활성화한다.
  const sentrySourcemapEnabled = Boolean(process.env.SENTRY_AUTH_TOKEN);

  return {
    plugins: [
      react(),
      ...(sentrySourcemapEnabled
        ? [
            sentryVitePlugin({
              org: 'letscareer',
              project: 'mentor',
              authToken: process.env.SENTRY_AUTH_TOKEN,
            }),
          ]
        : []),
    ],
    build: {
      // 업로드 후 플러그인이 배포 산출물에서 소스맵을 제거한다.
      sourcemap: sentrySourcemapEnabled,
    },
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
