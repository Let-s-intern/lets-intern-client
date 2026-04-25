# 시스템 아키텍처 개요

> Keywords: architecture, system-overview, frontend, monorepo, ddd, fractal

렛츠커리어 프론트엔드의 *큰 그림*. 어떤 앱이 어떤 책임을 지고, 데이터가 어떻게 흐르며, 어떤 패턴으로 정리되어 있는지를 한 페이지에서 잡는다. 세부 정보는 각 항목 끝의 링크로 분기.

## 시스템 개요

3개의 React 애플리케이션이 하나의 백엔드(REST API)를 바라보는 분리형 프론트엔드. 사용자(`web`), 관리자(`admin`), 멘토(`mentor`) 각각이 별도 도메인에서 운영되고, 단일 SSO 토큰으로 같은 계정을 공유한다. 공유 코드는 `packages/*` 워크스페이스로 추출되어 세 앱이 동일한 axios 인스턴스·zustand 스토어·UI 컴포넌트를 사용한다.

## 컴포넌트 다이어그램

```
                ┌──────────────────────────────────────────┐
                │            사용자 / 관리자 / 멘토          │
                └─────┬───────────┬────────────┬──────────┘
                      │           │            │
                      ▼           ▼            ▼
        ┌──────────────────┐ ┌─────────┐ ┌──────────┐
        │   apps/web       │ │ admin   │ │ mentor   │
        │   (Next.js 15)   │ │ (Vite)  │ │ (Vite)   │
        └──┬──────┬────────┘ └────┬────┘ └─────┬────┘
           │      │               │            │
           │      └─ 헤더 클릭 ───→│            │
           │      └─ /admin URL ──→│            │
           │      └─ /mentor URL ─────────────→ │
           │
           │  공유 워크스페이스
           │  ┌──────────────────────────────────────────┐
           ├──┤ @letscareer/api      (axios 인스턴스)     │
           ├──┤ @letscareer/store    (zustand + SSO)     │
           ├──┤ @letscareer/hooks    (공유 훅)            │
           ├──┤ @letscareer/ui       (공유 컴포넌트)      │
           ├──┤ @letscareer/utils    (유틸)              │
           └──┤ @letscareer/types    (공유 타입)         │
              └──────────────────────────────────────────┘
                      │
                      ▼
        ┌──────────────────────────────────────────────┐
        │              백엔드 REST API                  │
        │     (인증·결제·콘텐츠·멘토링·커뮤니티)         │
        └────────┬───────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────────────┐
        │  외부 통합                                  │
        │  - TossPayments (결제)                      │
        │  - Sentry (에러 모니터링)                   │
        │  - Slack Webhook (에러 알림)                │
        │  - Builder.io (CMS)                        │
        │  - Yjs / y-websocket (실시간 협업)          │
        │  - Firebase (인증·푸시)                     │
        │  - S3 / CDN (이미지·자산)                   │
        └────────────────────────────────────────────┘
```

## 앱별 책임

| 앱 | 사용자 | 핵심 기능 | 렌더링 |
|---|---|---|---|
| `apps/web` | 일반 사용자 | 챌린지·라이브·VOD·블로그·결제·커뮤니티·블로그 | Next.js App Router (SSR + CSR 혼합) |
| `apps/admin` | 운영자 | 프로그램 관리, 결제 관리, 사용자 관리, 콘텐츠 관리, 데이터 그리드 | Vite SPA (CSR 100%) |
| `apps/mentor` | 멘토 | 본인 프로필, 멘토링 일정, 정산 | Vite SPA (CSR 100%) |

`web`만 SSR을 쓰는 이유: SEO와 OG 메타가 필요한 *외부 노출 페이지*이기 때문. admin/mentor는 인증 뒤에 숨어 있어 SSR 비용을 들일 가치가 없다.

## 런타임 스택 (요약)

상세 버전 표는 [`tech-stack/README.md`](./tech-stack/README.md) 참조. 여기서는 *왜 그것을 쓰는지*만 기록.

| 영역 | 선택 | 이유 |
|---|---|---|
| 사용자 앱 프레임워크 | Next.js 15 (App Router, Turbopack) | SSR, SEO, 이미지 최적화, OG 메타, 미들웨어 |
| 어드민/멘토 프레임워크 | Vite + React | 인증된 SPA에 SSR 불필요, 빌드 속도·DX 우선 |
| 언어 | TypeScript strict | 공유 패키지 간 타입 안정성 |
| 상태 (서버) | TanStack React Query | 서버 상태 캐싱·동기화 표준 |
| 상태 (클라) | Zustand | Redux 대비 보일러플레이트 ↓, SSR 친화적 |
| 폼 | React Hook Form + Zod | 비제어 컴포넌트·런타임 스키마 검증 결합 |
| HTTP | Axios (`@letscareer/api`) | 인터셉터·인증·base URL 중앙화 |
| 스타일 | Tailwind + 디자인 토큰 | 유틸 우선 + 토큰화로 일관성 |
| UI (admin) | MUI Material + MUI X | 데이터 그리드·날짜 피커 등 어드민 표준 컴포넌트 |
| 에디터 | Lexical | Quill 후속, App Router 호환 |

## 클라이언트 아키텍처

### 상태 관리 두 축

```
서버 상태 (네트워크가 진실의 원천)
   └─ TanStack React Query
      ├─ useQuery (조회)
      └─ useMutation + invalidateQueries (변경)

클라이언트 상태 (브라우저가 진실의 원천)
   └─ Zustand
      ├─ userLoginStatus  ← localStorage 동기화 (SSO 토큰)
      ├─ UI 토글, 폼 임시값 등
      └─ packages/store에서 export
```

서버에서 오는 데이터는 항상 React Query에 둔다. 그 외(로그인 상태·UI flag 등)만 zustand. 두 영역의 경계가 흐려지지 않게 PR 리뷰에서 살핀다.

### 폼

- `react-hook-form` 으로 비제어 입력 → 리렌더 최소화
- `zod` 스키마 + `@hookform/resolvers/zod` 로 동기 검증
- 서버 응답 검증도 같은 zod 스키마 재사용 가능 (타입 단일 출처)

### HTTP 클라이언트

- `@letscareer/api`의 axios 인스턴스가 *공통 인터셉터*를 가진다:
  - 요청: Authorization 헤더 자동 부착 (zustand의 토큰을 읽음)
  - 응답: 401 시 refresh 토큰으로 재시도, 실패 시 로그아웃
  - 에러: Sentry로 보고 + Slack webhook으로 알림 (운영만)
- baseURL은 환경변수에서 주입 (`NEXT_PUBLIC_SERVER_API` / `VITE_SERVER_API`)

### 스타일

- Tailwind 유틸 + `@letscareer/tailwind-config`로 토큰화된 색상·폰트·라운드
- 색상 시스템: primary/secondary/tertiary/point/challenge/neutral/system 7 카테고리 (단계별)
- `tailwind-merge` + `clsx`로 동적 클래스 충돌 해결
- 일부 레거시 컴포넌트는 `styled-components` 사용 (점진적 마이그레이션 중)

자세한 토큰: [`tech-stack/README.md`](./tech-stack/README.md)의 *Tailwind CSS 커스텀 디자인 토큰* 섹션.

### 라우팅

- `apps/web`: Next.js App Router (`apps/web/src/app/`)
- `apps/admin`, `apps/mentor`: React Router 기반 SPA

## 인증과 Cross-App SSO

### 토큰 저장

- `userLoginStatus` zustand store가 access/refresh 토큰을 들고 있고, persist 미들웨어로 `localStorage`에 동기화됨
- 같은 origin 안에선 자연스럽게 공유

### Cross-App 토큰 전달 (web → admin/mentor)

서로 다른 origin이므로 localStorage가 자동 공유되지 않는다. 그래서:

```
1. web 헤더 "관리자 페이지" 클릭
   ↓
2. buildCrossAppUrl(NEXT_PUBLIC_ADMIN_URL, '/admin')
   ↓
3. URL hash에 토큰 인코딩
   https://<어드민 운영 도메인>/#__sso=<encoded(access|refresh)>
   ↓
4. admin 앱 부팅 시 consumeSsoHashIfPresent (packages/store)
   ↓
5. hash 파싱 → 자기 zustand store에 저장 → history.replaceState로 hash 제거
```

URL fragment(`#`)는 서버로 전송되지 않아 액세스 로그·CDN 캐시·리퍼러에 토큰이 새지 않는다.

### URL 직접 진입 (`/admin/...`)

`apps/web/src/middleware.ts`가 308/307 리다이렉트로 처리. env가 비어 있으면 web의 자체 `/admin`, `/mentor` 라우트가 응답하는 *fallback 모드*로 자동 전환.

상세: [pnpm전환 메모 폴더/03-domain-routing.md](./pnpm전환%20메모%20폴더/03-domain-routing.md).

## 도메인 폴더 구조 (DDD + 프랙탈)

각 앱 안에서 도메인 단위로 컴포넌트·훅·API·타입이 *함께* 묶인다. 도메인이 커지면 *재귀적으로* 같은 패턴이 하위에 반복된다 (프랙탈).

```
apps/<app>/src/
├── domain/
│   └── <도메인이름>/             # 예: challenge, mentor, community
│       ├── ui/                  # 도메인 전용 컴포넌트
│       ├── hooks/               # 도메인 전용 훅
│       ├── api/                 # 도메인 전용 API 호출
│       ├── types/               # 도메인 전용 타입
│       └── <서브도메인>/         # 도메인이 커지면 재귀 분리
│           ├── ui/
│           ├── hooks/
│           └── ...
├── common/                      # 도메인 공통(앱 내부)
│   ├── components/
│   ├── hooks/
│   ├── layout/
│   └── utils/
└── app/                         # 라우트 (Next.js) 또는 entry (Vite)
```

규칙:
- 도메인끼리는 *수평 import 금지*. 공유가 필요하면 `common/`이나 `packages/*`로 끌어올린다.
- 도메인 내부 파일은 그 도메인의 폴더 밖을 import하지 않는다 (예외: `common`, `packages`).
- 같은 패턴이 워크스페이스 패키지에서도 적용 (예: `packages/ui` 안에서도 카테고리별 분리).

상세 규칙: [`.claude/skills/folder-structure/SKILL.md`](../../skills/folder-structure/SKILL.md), 도메인별 README는 [`.claude/docs/letscareer/domain/`](./domain/).

## 외부 통합 매트릭스

| 시스템 | 어디서 쓰임 | 환경변수 | 비고 |
|---|---|---|---|
| TossPayments | web (결제 위젯) | `NEXT_PUBLIC_TOSS_CLIENT_KEY` | live/test 키 분리 |
| Sentry | web (next.config + 클라/서버) | `NEXT_PUBLIC_SENTRY_DSN` | main/test 브랜치에서만 활성화 |
| Slack Webhook | 모든 앱 (에러 알림) | `*_ERROR_WEBHOOK_URL` | axios 인터셉터가 호출 |
| Builder.io | web (CMS) | (코드 내 SDK 키) | 페이지·블록 CMS |
| Yjs + y-websocket | web (실시간 협업) | (서버 URL 코드 내) | 화이트보드·동시 편집 |
| Firebase | web (인증·푸시) | (코드 내 config) | 일부 사용 |
| AWS S3 | 모든 앱 (이미지) | (next.config remotePatterns) | letsintern-bucket, letscareer-test-bucket |
| MUI X License | admin (DataGrid Pro) | `VITE_MUI_X_LICENSE_KEY` | LicenseInfo.setLicenseKey 호출 |

## 모노레포·배포 토폴로지

```
모노레포 (pnpm workspace + Turborepo)
├── apps/web      → Vercel #1 → <운영 도메인>
├── apps/admin    → Vercel #2 → <어드민 운영 도메인>
└── apps/mentor   → Vercel #3 → <멘토 운영 도메인>
```

- 3개 Vercel 프로젝트가 같은 저장소를 보지만 Root Directory만 다름
- Ignored Build Step + GitHub Actions paths 필터로 *변경된 앱만 빌드/배포*
- 공용 패키지(`packages/*`)나 락파일이 바뀌면 3개 모두 트리거 (의도)

상세: [pnpm전환 메모 폴더/04-vercel-deployment.md](./pnpm전환%20메모%20폴더/04-vercel-deployment.md), [05-build-test-ci.md](./pnpm전환%20메모%20폴더/05-build-test-ci.md).

## 빌드·캐시 전략

- Turborepo가 `^build` 의존 그래프로 packages → apps 순서 보장
- 빌드 캐시 키: 소스코드 + `globalDependencies`(락파일·workspace) + 환경변수 prefix(`NEXT_PUBLIC_*`, `VITE_*`, `SENTRY_*`, `BUILDER_*`)
- 문서·테스트 파일은 inputs에서 제외 → 같은 코드라면 README 한 줄 고쳐도 빌드 캐시 유지
- Vercel은 자체 빌드 캐시 + Turbo 캐시 둘 다 활용

## 비기능 요건

### 성능
- Next.js 이미지 최적화 + S3 remotePatterns + 1년 immutable 캐시
- Turbopack(개발) / Webpack(빌드) — App Router 호환 우선
- React Query stale time·gcTime 조정으로 불필요 fetch 차단

### 모니터링
- Sentry: 클라/서버 에러 + 소스맵 업로드 (운영 빌드 한정)
- Slack Webhook: 에러 빈도가 높거나 critical할 때 즉시 알림

### 안정성
- env 누락 시 *웅변적인 실패*: web의 `next.config.mjs`는 시작 시 throw
- Cross-app fallback: admin/mentor 분리 배포 깨질 시 web의 자체 라우트로 회귀
- 락파일 강제 (`--frozen-lockfile`)로 의존성 드리프트 차단

### 접근성·반응형
- xs(390), sm(640), md(768), lg(991), xl(1280), 2xl(1440), 3xl(1600) 7단계 breakpoint
- 텍스트 밸런싱: react-wrap-balancer
- 색상 시스템에 system-positive/error 카테고리 분리

## 관련 문서 인덱스

| 주제 | 문서 |
|---|---|
| 라이브러리 버전·설정 상세 | [`tech-stack/README.md`](./tech-stack/README.md) |
| 모노레포 구조 | [`pnpm전환 메모 폴더/01-monorepo-structure.md`](./pnpm전환%20메모%20폴더/01-monorepo-structure.md) |
| pnpm 설치·실행 | [`pnpm전환 메모 폴더/02-pnpm-setup.md`](./pnpm전환%20메모%20폴더/02-pnpm-setup.md) |
| 도메인 라우팅·SSO | [`pnpm전환 메모 폴더/03-domain-routing.md`](./pnpm전환%20메모%20폴더/03-domain-routing.md) |
| Vercel 배포 설정 | [`pnpm전환 메모 폴더/04-vercel-deployment.md`](./pnpm전환%20메모%20폴더/04-vercel-deployment.md) |
| 빌드·CI | [`pnpm전환 메모 폴더/05-build-test-ci.md`](./pnpm전환%20메모%20폴더/05-build-test-ci.md) |
| 단계별 배포 절차 | [`pnpm전환 메모 폴더/06-deployment-guide.md`](./pnpm전환%20메모%20폴더/06-deployment-guide.md) |
| 도메인별 아키텍처 | [`domain/`](./domain/) |
| 공용 컴포넌트·훅 | [`common/`](./common/) |
| API 명세 | [`API_docs/`](./API_docs/) |
| 큐레이션 도메인 | [`curation-domain/`](./curation-domain/) |
| 폴더 구조 규칙 | [`.claude/skills/folder-structure/SKILL.md`](../../skills/folder-structure/SKILL.md) |
| 코드 품질 규칙 | [`.claude/skills/code-quality/SKILL.md`](../../skills/code-quality/SKILL.md) |
