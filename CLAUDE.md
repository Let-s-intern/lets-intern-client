# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Next.js dev server (Turbopack)
npm run build        # Production build
npm run typecheck    # TypeScript type check (tsc --noEmit)
npm run lint         # ESLint
npm run test         # Vitest (all tests)
npx vitest run src/lib/refund.test.ts  # Run single test file
npx prettier --write src/path/to/file.tsx  # Format single file
```

## Architecture

Next.js 15 App Router 기반 TypeScript 프로젝트. 챌린지, 블로그, 결제, 커리어 등 취업 준비 서비스를 제공하는 클라이언트.

### Directory Structure

```
src/
├── app/             # Next.js App Router (pages, layouts)
│   ├── (auth)/      # 인증 페이지 (signup, login) - 모바일 네비 숨김
│   ├── (user)/      # 사용자 페이지 (challenge, blog, mypage 등)
│   └── admin/       # 어드민 대시보드
├── api/             # API 클라이언트 레이어 (도메인별 구성)
├── common/          # 공용 UI 컴포넌트 (button, modal, input, layout 등)
├── domain/          # 도메인별 비즈니스 로직 컴포넌트
├── store/           # Zustand 상태 관리
├── hooks/           # 커스텀 React 훅
├── utils/           # 유틸리티 함수
├── lib/             # 라이브러리 설정/래퍼
├── types/           # 타입 정의
├── schema.ts        # 공용 Zod 스키마
└── assets/          # 이미지, 아이콘
```

### API Layer Pattern

각 도메인(`src/api/<domain>/`)은 **query hooks + Zod schemas** 구조:

- `challenge.ts` — React Query 훅 (`useQuery`, `useMutation`)
- `challengeSchema.ts` — Zod 스키마, 타입은 `z.infer<>`로 추론

```typescript
// Query key 상수 + 훅 패턴
export const UseChallengeQueryKey = 'useChallengeQueryKey';

export const useChallengeQuery = (id: number) =>
  useQuery({
    queryKey: [UseChallengeQueryKey, id],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${id}`);
      return challengeSchema.parse(res.data.data);  // Zod 검증
    },
  });
```

Mutation 훅은 `onSuccess`에서 `queryClient.invalidateQueries`로 캐시 갱신.

### Axios Instances

- `src/utils/axios.ts` → `NEXT_PUBLIC_SERVER_API` 기반 (v1 API)
- `src/utils/axiosV2.ts` → v2 API 엔드포인트
- 두 인스턴스 모두 `createAuthorizedAxios`로 생성 — 요청 시 JWT 자동 첨부, 401 응답 시 로그아웃 처리

### Auth

- Zustand persist store (`useAuthStore`) — localStorage에 JWT 토큰 저장
- `src/utils/auth.ts` — 만료 30초 전 자동 토큰 갱신, 중복 갱신 요청 방지
- 401 + "토큰이 유효하지 않습니다" 응답 시 `logoutAndRefreshPage()` 호출

### Component Organization

- **`common/`**: 재사용 UI 프리미티브 (BaseButton, BaseModal + ModalPortal, layout 헤더/푸터)
- **`domain/`**: 기능별 컴포넌트 (challenge, curation, mypage, auth, blog, admin 등)
- Domain 컴포넌트가 common 컴포넌트를 감싸서 비즈니스 로직 추가하는 구조

### Styling

- Tailwind CSS + 커스텀 폰트 사이즈 (`text-xxlarge36` ~ `text-xxsmall12`)
- `cn()` (`src/utils/cn.ts`) = `twMerge(clsx(...))` — 조건부 클래스 결합
- `twMerge` (`src/lib/twMerge.ts`) — 커스텀 폰트 사이즈 클래스 그룹 확장
- Prettier `prettier-plugin-tailwindcss`로 Tailwind 클래스 자동 정렬

### State Management

- **서버 상태**: React Query (`retry: 0`, `staleTime: 60s`)
- **클라이언트 상태**: Zustand (auth, mission, program, scroll 등)
- React Query 에러 시 Zod validation 에러 자동 로깅 (`Providers.tsx`)

### Key Libraries

| Library | Usage |
|---------|-------|
| Zod | API 응답 검증 + 폼 스키마 |
| react-hook-form + @hookform/resolvers | 폼 관리 |
| Lexical | 리치 텍스트 에디터 |
| TossPayments SDK | 결제 |
| Sentry | 에러 모니터링 (main, test 브랜치만) |
| dayjs | 날짜 처리 (`src/lib/dayjs.ts` 설정) |
| Swiper | 캐러셀/슬라이더 |
| Motion (Framer Motion) | 애니메이션 |

### SVG Handling

SVG 파일은 `@svgr/webpack`으로 React 컴포넌트로 import 가능.

### Import Aliases

`@/*` → `src/*`, `@components/*` → `src/components/*`

## Conventions

- 커밋 메시지는 **한국어**로 작성: `<type>: <subject>` (feat, fix, docs, style, refactor, test, chore)
- 컴포넌트: PascalCase, 유틸리티: camelCase, 라우트: kebab-case
- 페이지별 로컬 컴포넌트는 `_components/` 디렉토리에 배치
- 함수형/선언형 패턴 사용, 클래스 사용 금지
- 매직 넘버는 이름 있는 상수로 추출
- 복잡한 조건은 의미 있는 이름의 변수에 할당
- Props drilling 대신 컴포지션 패턴 선호
- 상태 관리 훅은 필요한 최소 범위로 분리

## Environment Variables

- `NEXT_PUBLIC_SERVER_API` (필수) — API 서버 주소
- `NEXT_PUBLIC_API_BASE_PATH` (필수) — API 베이스 경로
- `.env.local`에 설정 (`.env.local`은 직접 수정하지 말 것)
