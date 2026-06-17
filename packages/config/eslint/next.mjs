import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { baseConfig } from './base.mjs';

/**
 * Next.js 앱용 flat config 팩토리.
 * `eslint-config-next`가 사용처(앱)의 node_modules에서 해석되도록
 * 호출자의 `import.meta.url`을 baseDirectory로 받는다.
 *
 * @param {string} consumerUrl - 호출하는 eslint.config.mjs의 import.meta.url
 * @returns {import('eslint').Linter.Config[]}
 */
export function createNextConfig(consumerUrl) {
  const baseDirectory = dirname(fileURLToPath(consumerUrl));
  const compat = new FlatCompat({ baseDirectory });
  return [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    ...baseConfig,
  ];
}
