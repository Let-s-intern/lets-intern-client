# 03. 도메인 구조와 페이지 이동

> Keywords: middleware, redirect, sso, env-fallback, cross-app, multi-domain

3개 앱이 별개의 서브도메인에서 운영되며, web → admin/mentor 이동은 **env 가드 + middleware 리다이렉트 + SSO hash + fallback 라우트**로 구성된 다층 구조다. 이 설계의 핵심은 *분리 배포가 깨져도 web 단일 도메인으로 회귀할 수 있는 안전망*이다.

## 도메인 토폴로지

```
사용자
  │
  ├─ <운영 도메인>           ─→  apps/web    (Next.js)
  ├─ <어드민 운영 도메인>    ─→  apps/admin  (Vite SPA)
  └─ <멘토 운영 도메인>      ─→  apps/mentor (Vite SPA)
```

세 사이트 모두 같은 사용자 계정을 공유하므로, 한 곳에서 로그인하면 다른 곳에서도 자동 인증되어야 한다 — 이게 SSO의 동기다.

테스트(스테이징) 환경도 똑같이 3개 서브도메인이 별도로 존재.

## 두 갈래의 이동 경로

```
[A] URL 직접 진입            [B] 헤더 링크 클릭
    /admin/programs              "관리자 페이지" 버튼
        │                              │
        ▼                              ▼
    middleware.ts             buildCrossAppUrl()
        │                              │
        ▼                              ▼
   308/307 리다이렉트           href 생성 (+ SSO hash)
        │                              │
        └──────────┬───────────────────┘
                   ▼
        env 있음 → 서브도메인
        env 없음 → web의 /admin 라우트
```

## A. 미들웨어 — URL 직접 진입 처리

[apps/web/src/middleware.ts](../../../../apps/web/src/middleware.ts):

```ts
import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;
const MENTOR_URL = process.env.NEXT_PUBLIC_MENTOR_URL;
const IS_DEV = process.env.NODE_ENV !== 'production';
const REDIRECT_STATUS = IS_DEV ? 307 : 308;

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (ADMIN_URL && pathname.startsWith('/admin')) {
    return redirect(buildRedirect(ADMIN_URL, pathname, search, '/admin'));
  }

  if (MENTOR_URL && pathname.startsWith('/mentor')) {
    return redirect(buildRedirect(MENTOR_URL, pathname, search, '/mentor'));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/mentor/:path*'],
};
```

### 동작 시나리오

- env 있음 + `/admin/programs` 진입
  → `/admin` prefix 제거 → `<어드민 운영 도메인>/programs`로 308 리다이렉트
  → 브라우저 URL이 서브도메인으로 바뀜

- env 없음 + `/admin/programs` 진입
  → `if (ADMIN_URL && ...)` 조건 false → `NextResponse.next()`
  → web의 자체 `/admin/programs` Next.js 라우트가 렌더 (apps/web/src/app/admin/...)

### dev/prod 분기 이유

- dev: 307 (임시) + `Cache-Control: no-store`
  → env 토글 시 브라우저가 이전 308을 영구 캐시하지 않도록.
- prod: 308 (영구)
  → CDN/브라우저 캐시 활용해 미들웨어 호출 횟수 절약.

## B. 헤더 링크 — buildCrossAppUrl 헬퍼

[apps/web/src/common/utils/crossAppUrl.ts](../../../../apps/web/src/common/utils/crossAppUrl.ts):

```ts
export function buildCrossAppUrl(
  baseUrl: string | undefined,
  prefix: string,
  subPath: string = '/',
): string {
  if (!baseUrl) {
    const normalizedPrefix = prefix.replace(/\/$/, '');
    const normalizedSub = subPath.startsWith('/') ? subPath : `/${subPath}`;
    return normalizedPrefix + normalizedSub;
  }

  try {
    const target = new URL(subPath, baseUrl);

    if (typeof window === 'undefined') return target.toString();

    const raw = window.localStorage.getItem('userLoginStatus');
    if (!raw) return target.toString();

    const parsed = JSON.parse(raw) as {
      state?: { accessToken?: string; refreshToken?: string };
    };
    const accessToken = parsed?.state?.accessToken;
    const refreshToken = parsed?.state?.refreshToken;
    if (!accessToken || !refreshToken) return target.toString();

    target.hash = `__sso=${encodeURIComponent(`${accessToken}|${refreshToken}`)}`;
    return target.toString();
  } catch {
    return baseUrl.replace(/\/$/, '') + (subPath.startsWith('/') ? subPath : `/${subPath}`);
  }
}
```

### 시그니처 의미

| 인자 | 역할 |
|---|---|
| `baseUrl` | `process.env.NEXT_PUBLIC_ADMIN_URL` 또는 `NEXT_PUBLIC_MENTOR_URL` |
| `prefix` | fallback 시 사용할 web 라우트 prefix (`/admin`, `/mentor`) |
| `subPath` | 서브앱 내 경로 (기본 `/` = 루트) |

### 호출부 ([NavBar.tsx](../../../../apps/web/src/common/layout/header/NavBar.tsx), [ExternalNavList.tsx](../../../../apps/web/src/common/layout/header/ExternalNavList.tsx))

```ts
const adminHref = buildCrossAppUrl(process.env.NEXT_PUBLIC_ADMIN_URL, '/admin');
```

미들웨어와 같은 *prefix 컨벤션*(`/admin`, `/mentor`)을 공유한다. 그래서 한쪽 동작을 보면 다른 쪽도 자동으로 같은 모드로 흐른다.

### 동작 표

| baseUrl | subPath | 반환 |
|---|---|---|
| `https://<어드민 운영 도메인>` (env 설정됨) + 토큰 있음 | `/` | `https://<어드민 운영 도메인>/#__sso=<encoded>` |
| `https://<어드민 운영 도메인>` (env 설정됨) + 토큰 없음 | `/` | `https://<어드민 운영 도메인>/` |
| `undefined` (env 미설정) | `/` | `/admin/` (= web 자체 라우트) |
| `undefined` (env 미설정) | `/users` | `/admin/users` |

## SSO hash 메커니즘

### 왜 hash인가

URL fragment(`#`)는 서버로 전송되지 않는다. 그래서:
- 액세스 로그·CDN 캐시·외부 리퍼러에 토큰이 새지 않는다.
- 만약 query string(`?token=...`)에 담았다면 서버 로그·라우터 통계·메트릭 시스템에 토큰이 영구 기록될 수 있다.

### 송신 측 (web)

`buildCrossAppUrl`이 hash 형식 `#__sso=<encodeURIComponent(access|refresh)>`를 추가.

### 수신 측 (admin/mentor)

`packages/store`의 `consumeSsoHashIfPresent`가 페이지 로드 시:
1. `window.location.hash`에서 `__sso=` 추출
2. URL 디코드 후 `|` 기준으로 access/refresh 분리
3. 자체 zustand store에 저장 → 로그인 상태 동기화
4. `history.replaceState`로 hash 제거 (URL bar 깔끔하게)

## 환경변수 설정

[apps/web/.env.local](../../../../apps/web/.env.local) (gitignored):

```bash
# 분리 배포 모드 (운영 기본값)
NEXT_PUBLIC_ADMIN_URL=https://<어드민 운영 도메인>
NEXT_PUBLIC_MENTOR_URL=https://<멘토 운영 도메인>

# 또는 fallback 모드 (admin/mentor 분리 배포가 깨졌을 때)
# NEXT_PUBLIC_ADMIN_URL=
# NEXT_PUBLIC_MENTOR_URL=
```

## 모드 전환 — 분리 / 통합

### 분리 모드 (env 있음)

- 사용자는 서브도메인에서 admin/mentor 사용
- middleware가 308로 리다이렉트
- 헤더 링크가 SSO hash 포함 URL 생성
- 운영의 정상 상태

### 통합 모드 (env 없음)

- web 자체 `/admin/*`, `/mentor/*` 라우트가 응답 ([apps/web/src/app/admin/](../../../../apps/web/src/app/admin/), [apps/web/src/app/mentor/](../../../../apps/web/src/app/mentor/))
- middleware는 통과만 시킴
- 헤더 링크는 같은 도메인 내 path로 생성 (SSO hash 불필요 — localStorage 자연 공유)
- **pnpm 전환 중 admin/mentor 빌드/배포가 깨졌을 때 즉시 회귀 가능한 안전망**

### 전환 절차

운영 사고 발생 시:
1. Vercel 대시보드 → `letscareer-web` 프로젝트 → Settings → Environment Variables
2. `NEXT_PUBLIC_ADMIN_URL`, `NEXT_PUBLIC_MENTOR_URL` 값을 *비우거나 삭제*
3. Production을 재배포 (Redeploy without cache)
4. 헤더 링크 클릭 → web 내부 `/admin`, `/mentor`로 이동 확인

복구 후:
1. env 값을 다시 채워 넣고 재배포
2. middleware의 308이 다시 활성화되어 서브도메인으로 흐름 정상화

## 보안·UX 함정

| 함정 | 설명 |
|---|---|
| 308 영구 리다이렉트 캐시 | env 변경 후에도 브라우저가 옛 리다이렉트를 기억할 수 있다. dev에선 307 + `no-store`로 회피. prod에선 모드 전환 후 사용자에게 강제 새로고침 안내 또는 캐시 우회 쿼리. |
| hash가 즉시 노출 | hash는 이미 브라우저 주소창에 잠시 보인다. 토큰 길이가 짧다면 어깨너머로 노출 가능. 수신 측에서 즉시 `replaceState`로 지우는 게 중요. |
| middleware matcher 누락 | `matcher: ['/admin/:path*', '/mentor/:path*']`에 새 prefix를 추가하지 않으면 동작 안 함. 새 서브앱 추가 시 함께 갱신. |
| env가 빈 문자열 vs undefined | `if (ADMIN_URL && ...)` 가드는 둘 다 false 처리. 빈 값으로 두면 fallback. |
| dev에서 admin/mentor 동시 띄우지 않음 | env에 `http://localhost:3001`을 박았는데 admin dev 서버가 안 떠 있으면 ERR_CONNECTION_REFUSED. dev에선 fallback 모드(env 비움) 권장. |

## 관련 파일 빠른 인덱스

| 파일 | 역할 |
|---|---|
| [apps/web/src/middleware.ts](../../../../apps/web/src/middleware.ts) | URL 직접 진입 시 308/307 리다이렉트 |
| [apps/web/src/common/utils/crossAppUrl.ts](../../../../apps/web/src/common/utils/crossAppUrl.ts) | 헤더 링크 href 생성 + SSO hash 추가 |
| [apps/web/src/common/layout/header/NavBar.tsx](../../../../apps/web/src/common/layout/header/NavBar.tsx) | 모바일 사이드바의 어드민 링크 |
| [apps/web/src/common/layout/header/ExternalNavList.tsx](../../../../apps/web/src/common/layout/header/ExternalNavList.tsx) | 데스크탑 헤더의 어드민 링크 |
| [apps/web/src/app/admin/](../../../../apps/web/src/app/admin/) | fallback용 web 자체 어드민 라우트 |
| [apps/web/src/app/mentor/](../../../../apps/web/src/app/mentor/) | fallback용 web 자체 멘토 라우트 |
| `packages/store` (consumeSsoHashIfPresent) | admin/mentor 측 SSO hash 소비 |
