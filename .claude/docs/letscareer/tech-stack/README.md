# 기술 스택 및 설정

## 런타임 & 언어

| 기술 | 버전 | 비고 |
|------|------|------|
| **Node.js** | 20 (`.nvmrc`) | LTS |
| **TypeScript** | ^5.9.3 | strict 모드 |
| **React** | ^18.3.1 | |
| **React DOM** | ^18.3.1 | |

## 프레임워크

| 기술 | 버전 | 비고 |
|------|------|------|
| **Next.js** | ^15.5.7 | App Router, Turbopack 지원 |
| **Sentry** | @sentry/nextjs ^10.32.1 | main/test 브랜치에서만 활성화 |

## 스타일링

| 기술 | 버전 | 비고 |
|------|------|------|
| **Tailwind CSS** | ^3.4.7 | 커스텀 디자인 토큰 (colors, fontSize, borderRadius 등) |
| **PostCSS** | ^8.5.6 | |
| **Autoprefixer** | ^10.4.19 | |
| **tailwind-merge** | ^2.3.0 | `twMerge` 클래스 병합 |
| **tailwind-scrollbar-hide** | ^1.1.7 | 스크롤바 숨김 플러그인 |
| **SASS** | ^1.77.8 | |
| **Emotion (React)** | ^11.11.4 | MUI 내부 사용 |
| **Emotion (Styled)** | ^11.11.5 | |
| **styled-components** | ^6.1.11 | 레거시 일부 사용 |

## 상태 관리 & 데이터 페칭

| 기술 | 버전 | 비고 |
|------|------|------|
| **TanStack React Query** | ^5.49.2 | API 상태 관리 및 캐싱 |
| **React Query Devtools** | ^5.49.2 | 개발용 |
| **Zustand** | ^4.5.4 | 클라이언트 전역 상태 |
| **React Hook Form** | ^7.65.0 | 폼 상태 관리 |
| **@hookform/resolvers** | ^3.3.4 | Zod 연동 |
| **Zod** | ^3.23.8 | 스키마 검증 |
| **Axios** | ^1.12.2 | HTTP 클라이언트 |

## UI 라이브러리

| 기술 | 버전 | 비고 |
|------|------|------|
| **MUI Material** | ^6.4.0 | 관리자 페이지 주로 사용 |
| **MUI X Data Grid** | ^7.24.0 | 관리자 테이블 |
| **MUI X Date Pickers** | ^7.24.0 | 날짜 선택 |
| **Swiper** | ^11.2.4 | 캐러셀/슬라이더 |
| **lucide-react** | ^0.473.0 | 아이콘 |
| **react-icons** | 5.2.1 | 아이콘 (레거시) |

## 리치 텍스트 에디터

| 기술 | 버전 | 비고 |
|------|------|------|
| **Lexical** | ^0.16.1 | 메인 에디터 (관련 패키지 다수) |
| **react-quill** | ^2.0.0 | 레거시 에디터 |
| **KaTeX** | ^0.16.11 | 수식 렌더링 |

## 애니메이션 & 인터랙션

| 기술 | 버전 | 비고 |
|------|------|------|
| **Motion** (Framer Motion) | ^12.23.12 | 애니메이션 |
| **react-wrap-balancer** | ^1.1.1 | 텍스트 밸런싱 |

## 유틸리티

| 기술 | 버전 | 비고 |
|------|------|------|
| **date-fns** | ^4.1.0 | 날짜 유틸 |
| **dayjs** | ^1.11.11 | 날짜 유틸 (레거시 혼용) |
| **es-toolkit** | ^1.40.0 | 유틸리티 함수 |
| **lodash-es** | ^4.17.21 | 유틸리티 함수 (레거시) |
| **classnames** | ^2.5.1 | 클래스 병합 |
| **clsx** | ^2.1.1 | 클래스 병합 |
| **nanoid** | ^5.0.9 | ID 생성 |
| **es-hangul** | ^2.2.3 | 한글 처리 |

## 결제

| 기술 | 버전 | 비고 |
|------|------|------|
| **Toss Payments SDK** | ^2.2.1 | 결제 연동 |

## 실시간 협업

| 기술 | 버전 | 비고 |
|------|------|------|
| **Yjs** | ^13.6.18 | 실시간 협업 CRDT |
| **y-websocket** | ^2.0.4 | WebSocket 프로바이더 |

## Firebase

| 기술 | 버전 | 비고 |
|------|------|------|
| **Firebase** | ^10.12.2 | 인증, 푸시 등 |

## 기타

| 기술 | 버전 | 비고 |
|------|------|------|
| **@excalidraw/excalidraw** | ^0.17.6 | 화이트보드 |
| **colorthief** | ^2.6.0 | 이미지 색상 추출 |
| **react-error-boundary** | ^4.0.13 | 에러 바운더리 |
| **react-infinite-scroller** | ^1.2.6 | 무한 스크롤 |
| **react-to-print** | 3.0.5 | 인쇄 기능 |
| **@tanstack/react-table** | ^8.21.3 | 테이블 |

## 개발 도구

| 기술 | 버전 | 비고 |
|------|------|------|
| **Vite** | ^5.4.20 | 테스트용 번들러 |
| **Vitest** | ^1.6.1 | 테스트 프레임워크 |
| **@vitejs/plugin-react** | ^4.3.1 | |
| **@svgr/webpack** | ^8.1.0 | SVG -> React 컴포넌트 변환 |
| **vite-plugin-svgr** | ^4.2.0 | |
| **dotenv** | ^16.4.5 | 환경 변수 |
| **@builder.io/react** | ^8.2.2 | Builder.io CMS 연동 |
| **@builder.io/sdk** | ^6.0.9 | |
| **@vercel/node** | ^3.2.7 | Vercel 서버리스 함수 |

---

## ESLint 설정

- **버전**: ESLint ^9 (Flat Config)
- **설정 파일**: `eslint.config.mjs`
- **extends**: `next/core-web-vitals`, `next/typescript`

### 주요 규칙

| 규칙 | 설정 | 비고 |
|------|------|------|
| `@typescript-eslint/no-unused-vars` | warn | 미사용 변수 경고 |
| `@typescript-eslint/no-explicit-any` | warn | any 타입 경고 |
| `no-console` | warn | console 사용 경고 |
| `react/react-in-jsx-scope` | off | React 17+ 자동 import |
| `object-shorthand` | warn (always) | 객체 축약 표현 강제 |
| `no-useless-rename` | warn | 불필요한 rename 경고 |
| `react/jsx-key` | warn (checkFragmentShorthand) | key prop 누락 경고 |
| `react/prop-types` | off | TypeScript 사용으로 비활성화 |
| `@next/next/no-img-element` | off | img 태그 허용 (TODO: 추후 제거) |
| `@typescript-eslint/ban-ts-comment` | warn | ts-comment 경고 |

### 무시 경로
```
.config/*, node_modules/*, .next/*, dist/*
```

---

## Prettier 설정

- **버전**: ^3.3.2
- **설정 파일**: `.prettierrc`

| 옵션 | 값 |
|------|------|
| `singleQuote` | true |
| `semi` | true |
| `useTabs` | false |
| `tabWidth` | 2 |
| `trailingComma` | all |
| `printWidth` | 80 |

### 플러그인
- **prettier-plugin-tailwindcss** (^0.6.11): Tailwind 클래스 자동 정렬
  - `tailwindFunctions`: `clsx`, `twMerge` 함수 내부도 정렬 대상

---

## TypeScript 설정 (tsconfig.json)

| 옵션 | 값 |
|------|------|
| `target` | ES2017 |
| `module` | esnext |
| `moduleResolution` | bundler |
| `strict` | true |
| `jsx` | preserve |
| `incremental` | true |
| `noFallthroughCasesInSwitch` | true |
| `isolatedModules` | true |
| `esModuleInterop` | true |

### Path Aliases
| alias | 경로 |
|-------|------|
| `@components/*` | `./src/components/*` |
| `@/*` | `./src/*` |
| `@renderer/*` | `./renderer/*` |

---

## Next.js 설정 (next.config.mjs)

- **Turbopack**: SVG 로더 설정 포함
- **Webpack**: @svgr/webpack으로 SVG를 React 컴포넌트로 변환
- **ESLint**: 빌드 시 무시 (`ignoreDuringBuilds: true`)
- **Images remotePatterns**: S3 (letsintern-bucket, letscareer-test-bucket), Builder.io CDN
- **Sentry**: main/test 브랜치에서만 활성화, widenClientFileUpload 사용

---

## Tailwind CSS 커스텀 디자인 토큰

### 색상 시스템
- **primary**: #4D55F5 (5~90 단계)
- **secondary**: #1BC47D (10~100 단계)
- **tertiary**: #CB81F2
- **point**: #DAFF7C
- **challenge**: #00A8EB
- **neutral**: #27272D ~ #FAFAFA (0~100 단계)
- **system**: positive-green, positive-blue, error

### 반응형 breakpoints
| 이름 | 값 |
|------|------|
| xs | 390px |
| sm | 640px |
| md | 768px |
| lg | 991px |
| xl | 1280px |
| 2xl | 1440px |
| 3xl | 1600px |

### 커스텀 폰트 사이즈
- xxlarge36 (2.25rem) ~ xxsmall10 (0.625rem) 까지 13단계

### 커스텀 borderRadius
- none (0) ~ full (9999px) 까지 12단계

---

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (next dev) |
| `npm run build` | 프로덕션 빌드 (next build) |
| `npm run start` | 프로덕션 서버 실행 (next start) |
| `npm run typecheck` | 타입 체크 (tsc --noEmit) |
| `npm run test` | 테스트 실행 (vitest) |
| `npm run lint` | ESLint 실행 (eslint .) |
