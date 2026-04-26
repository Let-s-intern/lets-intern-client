# Tasks: PR #2286 리뷰 수정 - Push 4 (테스트 커버리지 보강)

> PRD: `todo/tasks-pr2286-review-260426.md` (§3 Test Gaps)
> Push 범위: `url.ts` 보안 함수(`sanitizeUrl`) 테스트 우선 + canonical/path helper 갭 보강 + placeholder sample 정리. 보안 회귀와 SEO 회귀 방지.
> 상태: 🔲 진행 중
> **선행 조건**: Push 1~3과 독립적으로 진행 가능. 단 Push 1의 env 가드가 들어간 상태가 테스트 환경 안정성 면에서 유리.

---

### 관련 파일

- `apps/web/src/utils/url.ts` — sanitizeUrl, getCanonicalSiteUrl, getCanonicalUrl, getBlogPathname, getProgramPathname
- `apps/web/src/utils/url.test.ts` — 신규 케이스 추가
- `apps/web/src/__tests__/sample.test.tsx` — placeholder TODO 명시 또는 첫 실 테스트 추가
- `apps/admin/src/__tests__/sample.test.tsx` — 동일
- `apps/mentor/src/__tests__/sample.test.tsx` — 동일

---

## 작업

- [ ] 4.0 테스트 커버리지 보강 (Push 4)
    - [ ] 4.1 ⚠️ `sanitizeUrl` 보안 테스트 (최우선)
        - 설명: XSS 방어용 `sanitizeUrl` 함수 회귀 테스트. `javascript:`, `data:` 차단 + 정상 URL 통과 + malformed 처리. 보안 회귀는 XSS 직결.
        - 영향 파일: `apps/web/src/utils/url.test.ts` 1개
        - 케이스:
          - `javascript:alert(1)` → `'about:blank'` 또는 명시 동작
          - `data:text/html,<script>` → `'about:blank'`
          - `https://valid-host.com/path` → 통과
          - 빈 문자열, malformed URL → 명시적 처리 검증
        - [ ] 4.1.T1 테스트 코드 작성: 위 4 케이스 + edge case 1~2개
        - [ ] 4.1.T2 테스트 실행 및 검증: `pnpm test:web -- url.test` 통과
    - [ ] 4.2 `getCanonicalSiteUrl` env 모두 미지정 fallback
        - 설명: `NEXT_PUBLIC_SITE_URL`, `BASE_URL` 모두 부재 시 `'http://localhost:3000'` fallback 검증. 운영 미설정 사고 방어.
        - 영향 파일: `apps/web/src/utils/url.test.ts` 1개
        - [ ] 4.2.T1 테스트 코드 작성: 모든 env unset → localhost fallback 단언
        - [ ] 4.2.T2 테스트 실행 및 검증: `pnpm test:web -- url.test` 통과
    - [ ] 4.3 `getCanonicalUrl` 이중 슬래시 비발생 단언
        - 설명: `getCanonicalUrl('/path')` (leading slash 입력) 결과 URL에 `//` 없는지 확인. trailing slash + leading slash 결합 케이스.
        - 영향 파일: `apps/web/src/utils/url.test.ts` 1개
        - [ ] 4.3.T1 테스트 코드 작성: leading slash 정상 처리 + 결과 URL 매칭
        - [ ] 4.3.T2 테스트 실행 및 검증: `pnpm test:web` 통과
    - [ ] 4.4 `getBlogPathname`/`getProgramPathname` 인코딩 검증
        - 설명: 한글, 공백, `?#&` 같은 특수문자 입력 시 `encodeURIComponent` 적용 또는 명시적 sanitize 동작 단언.
        - 영향 파일: `apps/web/src/utils/url.test.ts` 1개
        - [ ] 4.4.T1 테스트 코드 작성: 한글/공백/특수문자 case 각 1~2개
        - [ ] 4.4.T2 테스트 실행 및 검증: `pnpm test:web` 통과
    - [ ] 4.5 placeholder `sample.test.tsx` 정리 (web/admin/mentor)
        - 설명: 영구 placeholder 3개 파일에 명확한 TODO 주석 추가 (`// TODO: 실 단위 테스트 추가 후 제거`) 또는 첫 실 테스트 추가 시 즉시 제거.
        - 영향 파일: `apps/web/src/__tests__/sample.test.tsx`, `apps/admin/src/__tests__/sample.test.tsx`, `apps/mentor/src/__tests__/sample.test.tsx` 3개
        - [ ] 4.5.T1 테스트 코드 작성: TODO 주석 추가 또는 의미 있는 첫 테스트 작성
        - [ ] 4.5.T2 테스트 실행 및 검증: `pnpm test` 통과 + 주석 검토

---

## 검증 체크리스트 (Push 4 완료 후)

- [ ] `pnpm test:web` 통과 (url.test 모든 신규 케이스 포함)
- [ ] `pnpm test:admin`, `pnpm test:mentor` 통과
- [ ] sanitizeUrl 보안 케이스 4개 이상 추가됨
- [ ] sample.test.tsx에 TODO 주석 또는 실 테스트 존재
- [ ] coverage 수치가 PR 머지 시점 대비 url.ts 영역 향상됨
