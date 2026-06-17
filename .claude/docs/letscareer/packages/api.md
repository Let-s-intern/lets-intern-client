# `@letscareer/api`

axios 인스턴스 생성기와 env 상수. 각 앱이 자기 환경의 baseURL과 인증 헤더 정책으로 axios를 만들 때 쓴다.

## 위치

```
packages/api/src/
├── axios.ts                     # createDefaultAxios
├── axiosV2.ts                   # createV2Axios, buildV2BaseUrl
├── createAuthorizedAxios.ts     # 인증 헤더 자동 부착 axios
├── env.ts                       # SERVER_API, API_BASE_PATH 환경변수 상수
└── index.ts
```

## Export 표면

```ts
export {
  createAuthorizedAxios,
  type AuthorizedAxiosOptions,
  type AuthHeaderResolver,
  type UnauthorizedHandler,
} from './createAuthorizedAxios';
export { SERVER_API, API_BASE_PATH } from './env';
export { createDefaultAxios } from './axios';
export { createV2Axios, buildV2BaseUrl } from './axiosV2';
```

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

## 관련

- [store.md](./store.md) — 토큰을 보관하는 `useAuthStore`
- [`../apps/web/services.md`](../apps/web/services.md) — apps/web의 axios 인스턴스 구성 예시
