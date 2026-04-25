# admin (web fallback)

`apps/web/src/domain/admin/` — `NEXT_PUBLIC_ADMIN_URL` 환경변수가 비어 있을 때 web에서 직접 렌더링하는 *어드민 fallback 라우트*.

- 운영 기본 동작: 미들웨어가 `/admin/*` 요청을 어드민 서브도메인으로 308 리다이렉트
- env 미설정 시: 미들웨어가 통과시키고 web 자체의 이 도메인 라우트가 응답
- 분리 배포가 깨졌을 때 즉시 web 단독 운영 모드로 회귀하기 위한 안전망

자세한 동작: [`../../../../pnpm전환 메모 폴더/03-domain-routing.md`](../../../../pnpm전환%20메모%20폴더/03-domain-routing.md).
