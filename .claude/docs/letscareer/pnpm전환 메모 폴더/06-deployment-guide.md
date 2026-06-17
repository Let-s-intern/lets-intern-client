# 06. 배포 가이드

> Keywords: deployment, release, rollback, vercel, dns, smoke-test

Vercel 3개 프로젝트 + 6개 도메인을 운영하는 단계별 절차. 신규 환경 셋업부터 일상 배포·롤백·트러블슈팅까지.

## 사전 조건

- [02-pnpm-setup.md](./02-pnpm-setup.md) 기준으로 pnpm 환경 준비
- Vercel 팀에 access (Owner/Admin 권한)
- DNS 관리 권한 (가비아·카페24 등)
- 환경변수 값 확보

## 일상 배포 흐름

### 1. PR 생성

```bash
git checkout -b feat/<scope>-<설명>
# 코드 작성
git push -u origin feat/<scope>-<설명>
gh pr create
```

### 2. CI 통과 확인

GitHub Actions에서 영향 받는 워크플로우만 트리거됨 ([05-build-test-ci.md](./05-build-test-ci.md) 참고). 모두 ✅이면 머지 가능.

### 3. 머지 → 자동 배포

`main` 브랜치 머지 시:
- 변경 영향 받는 Vercel 프로젝트만 자동 빌드·배포
- Skip Unaffected Projects 덕에 무관한 프로젝트는 빌드 스킵
- 통상 2–5분 안에 운영 도메인에 반영

### 4. Smoke 체크

배포 완료 후 30초 내 다음 확인:

```bash
# 1) 200 응답
curl -I https://<운영 도메인>/
curl -I https://<어드민 운영 도메인>/
curl -I https://<멘토 운영 도메인>/

# 2) 미들웨어 리다이렉트
curl -I https://<운영 도메인>/admin/programs
# 기대: HTTP/2 308, location: https://<어드민 운영 도메인>/programs
```

브라우저로:
- [ ] 메인 페이지 정상 렌더
- [ ] 로그인 가능 (카카오/네이버 OAuth 포함)
- [ ] 헤더 "관리자 페이지" 클릭 → admin으로 SSO 자동 이동
- [ ] 어드민 본인 페이지 정상 렌더

## 신규 Vercel 프로젝트 셋업 (1회성)

상세 표는 [04-vercel-deployment.md](./04-vercel-deployment.md). 요약:

1. Vercel 대시보드 → Add New → Project
2. Git 저장소 선택
3. **Root Directory** 지정 (`apps/web` / `apps/admin` / `apps/mentor`)
4. **Include files outside Root Directory** ON
5. Install Command: `cd ../.. && pnpm install --frozen-lockfile`
6. Build Command: `cd ../.. && pnpm build:<app>`
7. Output Directory: `.next` (web) 또는 `dist` (admin/mentor)
8. Framework Preset: `Next.js` (web) 또는 `Vite` (admin/mentor)
9. Environment Variables 입력 (Production / Preview)
10. Settings → Build and Deployment → Root Directory → **Skip deployment** 토글 ON 확인
11. Settings → Domains → 운영/테스트 도메인 등록
12. DNS 콘솔에서 CNAME 추가 (`cname.vercel-dns.com`)

## 환경변수 변경 절차

1. Vercel 프로젝트 → Settings → Environment Variables
2. Production / Preview 둘 다 업데이트
3. **Redeploy without cache** (Vite는 빌드 시 환경변수를 정적 인라인하므로 캐시 무효화 필요)
4. Smoke 체크

## 도메인 추가/변경 절차

1. DNS 콘솔에 CNAME 추가
   ```
   <새 서브도메인>  CNAME  cname.vercel-dns.com
   ```
2. Vercel 프로젝트 → Settings → Domains → 도메인 추가
3. Verification 통과 대기 (최대 24시간, 보통 1–10분)
4. SSL 자동 발급 확인
5. `dig <새 도메인> +short` 로 전파 확인

## fallback 모드 전환 (긴급 상황)

admin 또는 mentor 분리 배포가 깨졌을 때, 즉시 web 단일 도메인으로 회귀.

상세는 [03-domain-routing.md](./03-domain-routing.md)의 "모드 전환".

### 빠른 절차

1. Vercel `letscareer-web` → Settings → Environment Variables
2. `NEXT_PUBLIC_ADMIN_URL` (또는 `NEXT_PUBLIC_MENTOR_URL`) 값을 *비움*
3. Production을 **Redeploy without cache**
4. 헤더 "관리자 페이지" 클릭 → `/admin`으로 web 내부 이동
5. middleware는 자동으로 통과만 시킴 → web 자체 라우트 동작

복구 후:
1. env 값 다시 채움
2. Redeploy
3. middleware 308 동작 확인

## 롤백

### 옵션 A — Vercel UI 롤백 (권장)

1. Vercel 프로젝트 → Deployments
2. 직전 안정 deployment 선택 → ⋯ → **Promote to Production**
3. 즉시 운영 도메인이 그 빌드로 전환

새 빌드를 돌리지 않으므로 1초 내 롤백.

### 옵션 B — Git revert

```bash
git revert <bad-commit-sha>
git push origin main
```

CI가 다시 돌아 새 빌드 생성. 5분 정도 소요.

### 옵션 C — env로 fallback

코드 자체엔 문제 없는데 admin/mentor 빌드만 깨졌을 때 → 위 fallback 모드 전환으로 web 단독 운영.

## 자주 마주치는 문제

### 빌드 시 `@letscareer/*` 모듈을 못 찾음

원인: Vercel Root Directory가 잘못 잡혔거나 `Include files outside Root Directory`가 OFF.

해결:
- Root Directory가 `apps/<name>` (예: `apps/web`)인지 확인
- `Include files outside Root Directory` 토글 ON
- Install Command에 `cd ../..`가 포함되어 있는지 확인
- 설정 변경 후 Redeploy

### admin/mentor 새로고침 시 404

원인: SPA rewrite 미적용.

해결: [04-vercel-deployment.md](./04-vercel-deployment.md) 3️⃣ 의 `apps/admin/vercel.json` / `apps/mentor/vercel.json` 추가 후 재배포.

### 배포는 됐는데 환경변수가 비어 있음

원인: Vite는 *빌드 시* 환경변수를 정적으로 인라인. 환경변수를 바꿨어도 *재빌드해야* 반영됨.

해결: env 변경 후 **Redeploy without cache**.

### `NEXT_PUBLIC_API_BASE_PATH is not defined` 에러로 빌드 실패

원인: web의 [next.config.mjs](../../../../apps/web/next.config.mjs)는 빌드 시 이 변수가 필수. Vercel 환경변수에 누락되면 throw.

해결: Production / Preview 양쪽에 `NEXT_PUBLIC_API_BASE_PATH`, `NEXT_PUBLIC_SERVER_API` 등록 후 재배포.

### Ignored Build Step에서 무조건 빌드 진행

원인: `git diff HEAD^ HEAD` 가 첫 커밋이라 비교할 부모 없음 → exit 1 → 빌드 진행.

해결: 정상 동작이다. 두 번째 커밋부터는 정상적으로 작동.

### Sentry 소스맵 업로드 실패

원인: `@sentry/cli`가 pnpm `approve-builds` 미승인 상태.

해결:
```bash
pnpm approve-builds
# 인터랙티브에서 @sentry/cli 승인
```
승인 후 lockfile 또는 `.pnpm-builds.json`에 반영. 커밋 후 재배포.

### DNS는 됐는데 Vercel에서 verified가 안 뜸

원인:
- TTL 캐싱
- CNAME이 `cname.vercel-dns.com.` (마지막 점) 형태로 되어 있는지

해결:
```bash
dig <도메인> CNAME +short
# → cname.vercel-dns.com.

# Vercel UI에서 Refresh 클릭, 1–10분 대기
```

### 미들웨어 리다이렉트가 안 됨

원인:
- `NEXT_PUBLIC_ADMIN_URL` / `NEXT_PUBLIC_MENTOR_URL`이 web Vercel 프로젝트에 없음
- 또는 *NEXT_PUBLIC_* prefix 누락 (서버 사이드 env지만 미들웨어가 읽으려면 빌드 시 인라인 필요)

해결: env 정확히 등록 → Redeploy.

### 헤더 "관리자 페이지" 버튼이 홈으로 감

원인: 옛 `buildCrossAppUrl(ADMIN_URL, '/')` 시그니처를 호출하는 코드가 남아있을 가능성. 현재 시그니처는 `(baseUrl, prefix, subPath)`.

해결: [03-domain-routing.md](./03-domain-routing.md)의 호출부 표 확인 후 호출 방식을 `buildCrossAppUrl(process.env.NEXT_PUBLIC_ADMIN_URL, '/admin')` 형태로 통일.

## 배포 직후 페이지가 안 떠요 — 트리아지

```
1. Vercel Deployments → 최신 빌드 상태?
   ├─ Failed → 빌드 로그 확인 → 위 트러블슈팅 표 참고
   └─ Success → 다음 단계
       │
       ▼
2. curl -I 운영 도메인 → 응답 코드?
   ├─ 200 → 클라 측 문제 (브라우저 콘솔, 캐시)
   ├─ 308/307 → 미들웨어 동작 → 리다이렉트 대상이 정상인가
   ├─ 404 → SPA rewrite 또는 라우트 문제
   ├─ 5xx → Sentry 확인
   └─ 응답 없음 → DNS 문제 (dig 확인)
       │
       ▼
3. fallback으로 우회 가능한가?
   ├─ admin/mentor 문제만이면 → 위 fallback 모드 전환
   └─ web 자체 문제면 → 옵션 A (Vercel UI 롤백)
```

## 관련 문서 인덱스

- [01-monorepo-structure.md](./01-monorepo-structure.md) — 어떤 앱이 어디에
- [02-pnpm-setup.md](./02-pnpm-setup.md) — 설치/빌드 도구
- [03-domain-routing.md](./03-domain-routing.md) — 미들웨어·SSO·fallback
- [04-vercel-deployment.md](./04-vercel-deployment.md) — Vercel 프로젝트 설정 상세
- [05-build-test-ci.md](./05-build-test-ci.md) — Turbo·GitHub Actions
