# Tasks: PR #2286 리뷰 수정 - Push 2 (Important, 사용자 영향 버그)

> PRD: `todo/tasks-pr2286-review-260426.md` (§2 Important)
> Push 범위: 사용자에게 직접 보이는 silent 동작 + dead code 정리. 사이드바 클릭 무반응, 토큰 갱신 실패 로깅, 정체 불명 분기 제거.
> 상태: 🔲 진행 중
> **선행 조건**: Push 1 머지 완료 권장 (env 가드가 먼저 들어가야 fix 효과 검증 가능).

---

### 관련 파일

- `apps/admin/src/layout/AdminSidebar.tsx` — `?? '/'` fallback 버그
- `apps/mentor/src/layout/MentorSidebar.tsx` — `?? '#'` fallback 버그
- `.env.example` (admin/mentor) — `VITE_WEB_URL` placeholder 명시
- `apps/web/src/utils/auth.ts` — dead branch + JSON parse 로깅
- `apps/admin/src/utils/auth.ts`, `apps/mentor/src/utils/auth.ts` — 동일 패턴 검사
- `apps/web/src/utils/client.ts`, `apps/admin/src/utils/client.ts` — 호출처 검증

---

## 작업

- [ ] 2.0 Important 사용자 영향 버그 (Push 2)
    - [ ] 2.1 Sidebar `??` → `||` 또는 조건부 렌더 수정
        - 설명: `??`가 빈 문자열 fallback 안 되는 문제. `||` 또는 `if (!url) return null` 분기. `.env.example`의 빈 placeholder도 명확한 URL로 갱신.
        - 영향 파일: `apps/admin/src/layout/AdminSidebar.tsx`, `apps/mentor/src/layout/MentorSidebar.tsx`, `apps/admin/.env.example`, `apps/mentor/.env.example` 4개
        - [ ] 2.1.T1 테스트 코드 작성: 빈 env 시 링크 표시 정책 (조건부 렌더 단위 테스트 또는 Storybook fixture)
        - [ ] 2.1.T2 테스트 실행 및 검증: `pnpm dev:admin`/`dev:mentor`로 `VITE_WEB_URL=` 빈값 시 사이드바 동작 수동 확인
    - [ ] 2.2 `auth.ts:117-124` dead branch 정리
        - 설명: `if (status === 401)` / `else` 양쪽이 동일 동작인 버그. 의도 확인 후 (a) 단순 호출만 남기거나 (b) 진짜 분기 구현. web/admin/mentor 3곳 동일 검사.
        - 영향 파일: `apps/web/src/utils/auth.ts`, `apps/admin/src/utils/auth.ts`, `apps/mentor/src/utils/auth.ts` 3개
        - [ ] 2.2.T1 테스트 코드 작성: 401/4xx/5xx status별 `refreshTokenAtOnce` 동작 단위 테스트
        - [ ] 2.2.T2 테스트 실행 및 검증: `pnpm test:web`/`test:admin`/`test:mentor` 모두 통과
    - [ ] 2.3 `requestRefresh` JSON parse catch 로깅 보강
        - 설명: `try { payload = await response.json() } catch { payload = null }` → catch에서 `console.error`로 status 정보 함께 기록. 디버깅 단서 보존.
        - 영향 파일: `apps/web/src/utils/auth.ts:39-43` (admin/mentor 동일 패턴 검사)
        - [ ] 2.3.T1 테스트 코드 작성: HTML/502 응답 시뮬레이션 + 로그 발생 단언
        - [ ] 2.3.T2 테스트 실행 및 검증: jest spy로 console.error 호출 검증
    - [ ] 2.4 `client.ts` API_BASE_PATH 호출처 전수 검사
        - 설명: `${BASE_PATH}${endpoint}` 패턴이 endpoint에 `/v1/`/`/v2/` 같은 버전 prefix를 포함하는지 grep 검증. 누락 호출처 픽스. 가드로 endpoint가 `/`로 시작하지 않으면 throw 추가.
        - 영향 파일: `apps/admin/src/utils/client.ts`, `apps/web/src/utils/client.ts` + 호출처 다수 (있다면)
        - [ ] 2.4.T1 테스트 코드 작성: client 호출 endpoint 형태 회귀 테스트
        - [ ] 2.4.T2 테스트 실행 및 검증: 호출처 grep 결과 모두 prefix 포함 확인 + 단위 테스트 통과

---

## 검증 체크리스트 (Push 2 완료 후)

- [ ] 사이드바 빈 env 케이스 수동 검증 (admin/mentor 모두)
- [ ] `pnpm test`로 auth 관련 테스트 통과
- [ ] client.ts grep 결과로 마이그레이션 완료 확인
- [ ] 새 lint warnings 없음
