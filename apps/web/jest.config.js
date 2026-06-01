// jest config — next/jest preset 으로 SWC 트랜스폼 재사용.
// Note: ts-node 트랜스폼 충돌 회피 위해 .js 사용.
// .env.local 을 미리 로드해 next.config.mjs 의 env validation 통과시킴.
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

// 테스트에서 필수 env 가 비었을 때 기본값 주입.
// packages/api/src/env.ts 가 모든 키에 fail-fast 검증을 하므로 V1/V2/V3/BASE_PATH 모두 필요.
process.env.NEXT_PUBLIC_API_BASE_PATH ??= 'https://api.example.com';
process.env.NEXT_PUBLIC_SERVER_API ??= 'https://api.example.com/v1';
process.env.NEXT_PUBLIC_SERVER_API_V2 ??= 'https://api.example.com/v2';
process.env.NEXT_PUBLIC_SERVER_API_V3 ??= 'https://api.example.com/v3';

const nextJest = require('next/jest.js');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // SVGR(`*.svg?react`) 컴포넌트 import 는 jest 에 로더가 없어 경량 목으로 대체.
    // (반드시 '^@/' 보다 먼저 — '@/...svg?react' 가 양쪽에 매칭되므로 순서가 중요)
    '\\.svg\\?react$': '<rootDir>/jest/svgrMock.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageProvider: 'v8',
  coverageReporters: ['text', 'json-summary', 'html'],
  coverageDirectory: '<rootDir>/coverage',
  // schema.test.ts 는 BE 통합 테스트라 단위 테스트 러닝에서 제외 (Push 1 결정).
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/src/schema.test.ts',
    '/e2e/',
  ],
};

module.exports = createJestConfig(customConfig);
