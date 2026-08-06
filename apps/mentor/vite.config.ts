import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

/**
 * dev 프록시가 `/api` 요청을 보낼 곳.
 *
 * 기본값은 배포된 dev 서버다. 로컬 백엔드(`./gradlew bootRun`, 8080)와 붙여 개발하려면
 * `VITE_DEV_API_TARGET=http://localhost:8080` 을 주면 된다 — 루트의 `pnpm local` 이 그렇게 한다.
 *
 * 기본값을 localhost 로 두지 않는 이유는, 백엔드를 띄우지 않은 사람이 `pnpm dev` 만으로
 * 화면을 볼 수 있어야 하기 때문이다.
 */
const DEFAULT_DEV_API_TARGET = 'https://letsintern.kr';

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

  const apiTarget = env.VITE_DEV_API_TARGET || DEFAULT_DEV_API_TARGET;
  // 로컬 백엔드는 자기 자신을 허용 origin 으로 두므로 헤더를 위장할 필요가 없다.
  // 배포 서버로 보낼 때만 origin 검사를 통과하도록 바꿔 끼운다.
  const isLocalTarget = apiTarget.includes('localhost');

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
              project: 'letscareer-mentor',
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
          target: apiTarget,
          changeOrigin: true,
          secure: !isLocalTarget,
          configure: (proxy) => {
            if (isLocalTarget) return;
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
