# `@letscareer/api`

axios 인스턴스 생성기 + env 상수 + orval 자동 생성 React Query hook. 각 앱이 자기 환경의 baseURL과 인증 헤더 정책으로 axios를 만들고, 신규 기능은 generated hook을 사용한다.

## 위치

```
packages/api/
├── openapi.json                # Swagger spec snapshot (orval 입력)
├── orval.config.ts             # orval 설정
├── scripts/
│   └── fetch-spec.mjs          # SWAGGER_SPEC_URL env 기반 spec 다운로드
└── src/
    ├── axios.ts                # createDefaultAxios
    ├── axiosV2.ts              # createV2Axios, buildV2BaseUrl
    ├── createAuthorizedAxios.ts # 인증 헤더 자동 부착 axios
    ├── env.ts                  # SERVER_API, API_BASE_PATH 환경변수 상수
    ├── mutator.ts              # orval custom axios + envelope auto-unwrap
    ├── index.ts
    └── generated/              # orval 자동 생성 (lint/format 제외)
        ├── letsCareerAPI.schemas.ts   # 공용 타입
        └── <domain>/<domain>.ts       # 도메인 hook (42개)
```

## Export 표면

```ts
// axios 인스턴스 (기존)
export {
  createAuthorizedAxios,
  type AuthorizedAxiosOptions,
  type AuthHeaderResolver,
  type UnauthorizedHandler,
} from './createAuthorizedAxios';
export { SERVER_API, API_BASE_PATH } from './env';
export { createDefaultAxios } from './axios';
export { createV2Axios, buildV2BaseUrl } from './axiosV2';

// orval mutator (신규)
export { configureGeneratedAxios } from './mutator';
```

서브패스 export:
- `@letscareer/api/generated/<domain>` — 도메인 hook (예: `useGetChallenge`)
- `@letscareer/api/generated/schemas` — 공용 타입

## 핵심 사용 패턴

각 앱의 `src/utils/axios.ts`(또는 동급 파일)에서 인스턴스를 *생성·구성*하고, 도메인 코드는 그 인스턴스를 import해 사용.

```ts
// apps/<app>/src/utils/axios.ts
import { createAuthorizedAxios, SERVER_API } from '@letscareer/api';
import { useAuthStore } from '@letscareer/store';

export const axios = createAuthorizedAxios({
  baseURL: SERVER_API,
  authHeaderResolver: () => useAuthStore.getState().accessToken,
  unauthorizedHandler: () => useAuthStore.getState().logout(),
});
```

## env 상수 동작

`SERVER_API`, `API_BASE_PATH`는 빌드 시점에 `NEXT_PUBLIC_SERVER_API`/`VITE_SERVER_API` 같은 환경변수에서 읽어온다. 미설정 시 기본 빈 문자열.

## orval generated hook (신규 기능 사용)

```ts
// 도메인 hook
import { useGetXxx } from '@letscareer/api/generated/<domain>';

// 공용 타입
import type { Foo } from '@letscareer/api/generated/schemas';

// 앱 부트스트랩에서 1회 호출 (mutator에 인증/baseURL 주입)
import { configureGeneratedAxios, SERVER_API } from '@letscareer/api';
configureGeneratedAxios({
  baseURL: SERVER_API,
  getAuthHeader: () => useAuthStore.getState().accessToken,
  onUnauthorized: () => useAuthStore.getState().logout(),
});
```

신규 기능은 generated hook 사용, 기존 코드는 그대로. 도메인 단위 결정 원칙·spec 갱신 절차·migration 정책은 [`../API_docs/orval.md`](../API_docs/orval.md) 참조.

## 관련

- [store.md](./store.md) — 토큰을 보관하는 `useAuthStore`
- [`../apps/web/services.md`](../apps/web/services.md) — apps/web의 axios 인스턴스 구성 예시
- [`../API_docs/orval.md`](../API_docs/orval.md) — orval 인프라 운영 가이드
- [`../../../packages/api/MIGRATION_CHECKLIST.md`](../../../../packages/api/MIGRATION_CHECKLIST.md) — 도메인 전환 표준 절차
