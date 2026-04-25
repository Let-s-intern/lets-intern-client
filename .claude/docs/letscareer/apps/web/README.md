# web 앱 (`@letscareer/web`)

사용자가 보는 메인 사이트. Next.js 15 App Router + Turbopack.

## 라우팅

`apps/web/src/app/` 아래 App Router 라우트. 라우트 그룹:

- `(user)/` — 일반 사용자 페이지 (홈·블로그·챌린지·결제 등)
- `(auth)/` — 로그인·회원가입
- `admin/` — env 미설정 시 fallback (운영에선 미들웨어가 308로 어드민 서브도메인 리다이렉트)
- `mentor/` — env 미설정 시 fallback
- `api/` — Next.js 서버리스 핸들러

## 도메인 (`apps/web/src/domain/`)

총 18개. 각 도메인 폴더 안에 `ui/`, `hooks/`, `api/`가 응집되어 있다 (DDD + 프랙탈).

각 도메인은 `domain/<이름>/README.md`에 개요 문서가 있다. 깊이 있는 문서가 있는 도메인은 추가 파일을 함께 둔다.

| 도메인 | 설명 | 추가 문서 |
|---|---|---|
| [about](./domain/about/README.md) | 회사·서비스 소개 | — |
| [admin](./domain/admin/README.md) | 어드민 fallback 라우트 (web 단독 운영 모드용) | — |
| [auth](./domain/auth/README.md) | 로그인·회원가입·소셜 로그인 | — |
| [blog](./domain/blog/README.md) | 블로그 글 목록·상세 | — |
| [career-board](./domain/career-board/README.md) | 커리어 보드 | — |
| [challenge](./domain/challenge/README.md) | 챌린지 목록·상세·신청·결제 | — |
| [challenge-feedback](./domain/challenge-feedback/README.md) | 챌린지 피드백·리포트 | — |
| [community](./domain/community/README.md) | 커뮤니티 글·댓글·실시간 협업(Yjs) | — |
| [curation](./domain/curation/README.md) | 맞춤형 추천 플로우 | [flow-map.md](./domain/curation/flow-map.md) |
| [faq](./domain/faq/README.md) | 자주 묻는 질문 | — |
| [home](./domain/home/README.md) | 홈 화면 | — |
| [library](./domain/library/README.md) | 자료 라이브러리 | — |
| [mentor](./domain/mentor/README.md) | 멘토 페이지 (web 안의 멘토 섹션) | [design-system.md](./domain/mentor/design-system.md) |
| [mypage](./domain/mypage/README.md) | 마이페이지 (결제 내역·프로필) | — |
| [program](./domain/program/README.md) | 프로그램 일반 정보 | — |
| [program-recommend](./domain/program-recommend/README.md) | 프로그램 추천 | — |
| [report](./domain/report/README.md) | 리포트 | — |
| [review](./domain/review/README.md) | 리뷰 | — |

## 로컬 모듈

| 위치 | 내용 | 문서 |
|---|---|---|
| `apps/web/src/common/` | web 전용 공용 컴포넌트 (Button·Modal·Layout 등) | [components.md](./components.md) |
| `apps/web/src/hooks/` | web 전용 훅 + 도메인 훅 | [hooks.md](./hooks.md) |
| `apps/web/src/api/` | 도메인별 React Query API 호출 | [services.md](./services.md) |
| `apps/web/src/utils/` | web 전용 유틸리티 (axios 설정·token 관리 등) | [services.md](./services.md) |

> 공유 모듈(`@letscareer/*`)은 [`../../packages/`](../../packages/) 참조.

## 핵심 메타 파일

- [`.env.example`](../../../../../apps/web/.env.example) — 환경변수 키와 의미
- [`next.config.mjs`](../../../../../apps/web/next.config.mjs) — Next.js 설정 (Sentry·이미지 remotePatterns·Turbopack/Webpack)
- [`middleware.ts`](../../../../../apps/web/src/middleware.ts) — `/admin/*`, `/mentor/*` 서브도메인 리다이렉트 + env fallback
