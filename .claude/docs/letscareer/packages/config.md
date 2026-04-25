# `packages/config/*` — 공유 도구 설정

ESLint·Prettier·Tailwind·TypeScript 설정을 4개 패키지로 분리해 모든 앱·패키지가 같은 규칙을 따르도록 강제.

## 패키지 목록

```
packages/config/
├── eslint/         # @letscareer/eslint-config
├── prettier/       # @letscareer/prettier-config
├── tailwind/       # @letscareer/tailwind-config
└── typescript/     # @letscareer/tsconfig
```

| 패키지 이름 | 다루는 내용 |
|---|---|
| `@letscareer/eslint-config` | Flat Config 기반 공통 ESLint 규칙 |
| `@letscareer/prettier-config` | Prettier 옵션 + tailwindcss 플러그인 |
| `@letscareer/tailwind-config` | Tailwind 디자인 토큰(색상·폰트·breakpoint·radius) |
| `@letscareer/tsconfig` | base tsconfig (strict·moduleResolution 등) |

## ESLint (`@letscareer/eslint-config`)

각 앱의 `eslint.config.mjs`에서 import해 확장:

```ts
// apps/<app>/eslint.config.mjs
import letscareerConfig from '@letscareer/eslint-config';
export default [
  ...letscareerConfig,
  // 앱별 override
];
```

apps/web은 추가로 `next/core-web-vitals`, `next/typescript` extends. admin/mentor는 React 기본 규칙만.

## Prettier (`@letscareer/prettier-config`)

루트 `.prettierrc`가 이 설정을 포인터로 가짐. 옵션 요약:

| 옵션 | 값 |
|---|---|
| singleQuote | true |
| semi | true |
| tabWidth | 2 |
| trailingComma | all |
| printWidth | 80 |

플러그인: `prettier-plugin-tailwindcss` — `clsx`, `twMerge` 함수 인자도 클래스로 인식해 정렬.

## Tailwind (`@letscareer/tailwind-config`)

각 앱의 `tailwind.config.js`에서 base config로 사용. 디자인 토큰:

- 색상: primary(#4D55F5), secondary(#1BC47D), tertiary(#CB81F2), point(#DAFF7C), challenge(#00A8EB), neutral, system
- breakpoint: xs(390) sm(640) md(768) lg(991) xl(1280) 2xl(1440) 3xl(1600)
- 폰트 사이즈: xxlarge36 ~ xxsmall10 (13단계)
- borderRadius: none ~ full (12단계)

자세한 토큰 표는 [`../tech-stack/README.md`](../tech-stack/README.md).

## TypeScript (`@letscareer/tsconfig`)

각 앱의 `tsconfig.json`이 `extends`로 가져감.

```json
{
  "extends": "@letscareer/tsconfig/base.json",
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

base 설정 핵심: `strict: true`, `target: "ES2017"`, `module: "esnext"`, `moduleResolution: "bundler"`, `jsx: "preserve"`.
