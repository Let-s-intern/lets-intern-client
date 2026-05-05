# Swagger / OpenAPI

## URL

```
https://letsintern.kr/v3/api-docs
```

OpenAPI 3.0.1, 약 238 path (v1 + v2). 환경별 분리 없음 (test/prod 동일 spec).

## 코드 생성

이 spec을 진실 공급원으로 React Query hook + 타입을 자동 생성한다.
파이프라인 운영은 [`orval.md`](./orval.md) 참조.

```bash
pnpm --filter @letscareer/api gen:api
```

env override:
```bash
SWAGGER_SPEC_URL=https://staging.letsintern.kr/v3/api-docs \
  pnpm --filter @letscareer/api gen:api
```
