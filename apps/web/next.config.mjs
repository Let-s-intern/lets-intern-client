import { withSentryConfig } from '@sentry/nextjs';

// 빌드 시 필수 env 부재를 fail-fast 로 막아 silent self-origin 요청 사고를 방지.
if (!process.env.NEXT_PUBLIC_API_BASE_PATH) {
  throw new Error('NEXT_PUBLIC_API_BASE_PATH is not defined');
}

if (!process.env.NEXT_PUBLIC_SERVER_API) {
  throw new Error('NEXT_PUBLIC_SERVER_API is not defined');
}

if (!process.env.NEXT_PUBLIC_SERVER_API_V2) {
  throw new Error('NEXT_PUBLIC_SERVER_API_V2 is not defined');
}

if (!process.env.NEXT_PUBLIC_SERVER_API_V3) {
  throw new Error('NEXT_PUBLIC_SERVER_API_V3 is not defined');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 typecheck 스킵 — 별도 CI job (`pnpm turbo run typecheck`) 에서 검증.
    // next build 내장 tsc 가 5-10분 소요되어 빌드 시간 단축 목적.
    ignoreBuildErrors: true,
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(js|ts)x?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: false,
          },
        },
      ],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'letsintern-bucket.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'letscareer-test-bucket.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    // unoptimized: true,
  },
};

const branch =
  process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || '';
// Sentry 인스트루먼트 (3-pass webpack) 는 빌드를 +2~4분 늘린다.
// 운영 main 빌드에서만 켜고, 작업/PR 미리보기에서는 끈다.
// 강제로 켜야 할 경우 SENTRY_FORCE_ENABLE=true 환경변수 설정.
const shouldEnableSentry =
  branch === 'main' || process.env.SENTRY_FORCE_ENABLE === 'true';

export default shouldEnableSentry
  ? withSentryConfig(nextConfig, {
      // For all available options, see:
      // https://www.npmjs.com/package/@sentry/webpack-plugin#options

      org: 'letscareer',

      project: 'javascript-nextjs',

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
      // side errors will fail.
      // tunnelRoute: "/monitoring",

      webpack: {
        // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
        // See the following for more information:
        // https://docs.sentry.io/product/crons/
        // https://vercel.com/docs/cron-jobs
        automaticVercelMonitors: true,

        // Tree-shaking options for reducing bundle size
        treeshake: {
          // Automatically tree-shake Sentry logger statements to reduce bundle size
          removeDebugLogging: true,
        },
      },
    })
  : nextConfig;
