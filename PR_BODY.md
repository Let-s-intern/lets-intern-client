# PR 제목
fix: 라우트/섹션 에러 경계 도입으로 페이지 전체 붕괴 방지

---

## 배경

`apps/web/src/app` 94개 page.tsx를 전수 감사한 결과, 데이터 페칭 에러가 **error 경계 없이 노출**되어 페이지가 흰 화면으로 붕괴하는 지점이 다수 확인되었습니다.

근본 원인:
- 세그먼트 `error.tsx` **0개** → 던져진 에러가 루트 `global-error.tsx`까지 전파되어 페이지 전체 교체
- 루트 `layout.tsx`에 ErrorBoundary/Suspense 없음
- QueryClient `throwOnError` 미설정 → `useSuspenseQuery`·`throwOnError:true`가 경계 없이 던지면 즉시 크래시

## 변경 사항 — 2계층 방어막

### ① 구조적 안전망 (전 페이지)
- `(user)/error.tsx`, `(auth)/error.tsx` **route-level 경계 신설** — 서버 컴포넌트 fetch throw 및 미포착 클라이언트 렌더 throw를 헤더/레이아웃 유지한 "다시 시도" UI로 흡수 (기존 `global-error`의 Sentry + webhook 로깅 패턴 계승)
- 공용 `common/boundary/SegmentError.tsx`로 두 error 페이지 중복 제거 (각 error.tsx는 얇은 위임 래퍼)

### ② 지점 격리 (HIGH 우선)
- 결제·리포트·구 챌린지 대시보드·마이페이지·프로그램 상세를 `AsyncBoundary`로 래핑
- **홈·리뷰**의 데이터 페칭 섹션을 **개별 AsyncBoundary로 격리** → 한 섹션이 실패해도 나머지는 정상 렌더
- 소비 지점을 `useSuspenseQuery(xxxQueryOptions)`로 통일 (**공유 훅 정의는 무변경** → 타 소비자 무손상, 신규 15곳)
- `order`·`report-order`·`payment-input`의 무의미한 bare `Suspense`를 `AsyncBoundary`로 교체

## 안전 원칙 (검증됨)
- **공유 `api/` 훅 정의 수정 금지** — 타 페이지 파손 방지 (diff: api/ 변경 0)
- **조건부(`enabled`) 쿼리 suspense 미전환** — 런타임 무한 suspense 방지 (검증: enabled+suspense 인접 0)
- 이미 에러를 자체 처리(`error→redirect`)하거나 쿼리가 없는 페이지(`challenge/*/latest` ×9, `feedback-mentoring`, `curation`, `inquiry`)는 **의도적으로 미변경** — 불필요한 no-op 경계 지양

## 검증
- ✅ `tsc --noEmit` 통과 (suspense 전환 타입 안전)
- ✅ ESLint **0 errors** (잔여 경고는 전부 기존 코드의 exhaustive-deps / img-alt)
- 38 files changed (+383 / -112)

> ⚠️ 로딩 UX가 미묘하게 달라질 수 있으므로(특히 홈·결제 등 고트래픽) dev 서버에서 육안 확인 권장.

## 남은 선택적 후속(별도)
- 서버 컴포넌트 상세(blog/library/guidebook/vod)에 세그먼트별 `error.tsx`를 두면 route 경계보다 더 좁은 범위로 격리 가능
- 프로젝트 방향(전면 useSuspenseQuery 통일)에 맞춰 공유 훅에 suspense 변형 추가

🤖 Generated with [Claude Code](https://claude.com/claude-code)
