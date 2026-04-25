# auth

`apps/web/src/domain/auth/` — 로그인·회원가입·소셜 로그인(카카오·네이버).

- 토큰 저장은 `@letscareer/store`의 `useAuthStore` (localStorage persist)
- OAuth 콜백 후 web → admin/mentor 이동 시 SSO hash로 토큰 전달
- axios 인터셉터(401 재시도)는 `@letscareer/api`의 `createAuthorizedAxios`가 담당
