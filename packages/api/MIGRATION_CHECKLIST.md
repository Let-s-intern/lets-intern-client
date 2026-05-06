# 도메인별 generated 마이그레이션 체크리스트

이 템플릿은 한 도메인을 손으로 작성한 fetcher hook → orval generated hook 으로 전환할 때
**복사·체크해서 PR description 으로 사용**하는 표준 양식입니다.

PRD-0505 §7 (미래 전환 대비)와 §6.3 (도메인 단위 결정 원칙)에 정합합니다.

---

## 사용법

```bash
# 1) 새 PR 브랜치를 만들고 이 파일을 도메인별로 복사
cp packages/api/MIGRATION_CHECKLIST.md tasks/migrations/<도메인>-migration.md

# 2) <도메인> 자리표시자를 실제 도메인명으로 치환 후 항목을 하나씩 체크
```

---

## 마이그레이션 체크리스트 — 도메인 `<도메인>`

### 0. 사전 영향도 측정

PRD-0505 §3 측정값을 참고해 도메인의 영향 범위를 PR 설명에 명시합니다.

- [ ] mentor 영향: API hook 수 / 호출처 파일 수 (참조: 전체 mentor — hook 108, 호출처 38)
- [ ] admin 영향: API hook 수 / 호출처 파일 수 (참조: 전체 admin — hook 243, 호출처 485)
- [ ] web 영향: 동일 도메인 미러 폴더(`apps/web/src/domain/admin/...`) 까지 포함했는가?
      → admin/mentor 변경은 `apps/web/src/domain/admin` 미러 정책에 따라 web 도 함께 수정 (project_admin_mirror_policy.md)

### 1. 호출 위치 식별

- [ ] 모든 hook 호출 위치를 grep으로 식별
      ```bash
      rg "from ['\"]@/api/<도메인>" apps/
      rg "use<도메인PascalCase>" apps/
      ```
- [ ] 도메인 마커 파일 추가: `apps/<app>/src/api/<도메인>/.use-generated`
      (이중 호출 상태를 만들지 않기 위한 PRD §6.3 의 도메인 단위 결정 원칙)

### 2. import 교체

- [ ] generated hook 으로 import 교체
      ```ts
      // before
      import { useGet<도메인>List } from '@/api/<도메인>/<도메인>';
      // after
      import { useGet<도메인>List } from '@letscareer/api/generated/<도메인>';
      ```
- [ ] hook 시그니처 변경분 반영 (orval은 `(params, options)` 또는 `(params, queryClient, options)` 형식 사용)
- [ ] 응답 타입 변경분 반영 — generated 는 envelope 자동 언래핑(`{ data: T } → T`) 적용된 형태로 반환

### 3. queryKey · invalidate

- [ ] queryKey 호환 helper 사용 — orval이 자동 생성한 `getXxxQueryKey()`로 invalidate 호출 교체
      ```ts
      // before
      queryClient.invalidateQueries({ queryKey: ['<도메인>', 'list'] });
      // after
      queryClient.invalidateQueries({ queryKey: getGet<도메인>ListQueryKey() });
      ```
- [ ] 수동 prefetch 도 동일하게 helper 로 교체

### 4. side effect 이동

- [ ] inline `alert` / `toast` / `navigate` 등 side effect 를 컴포넌트 측 `onSuccess` / `onError` 로 이동
      (generated hook 본문은 수정 불가하므로 호출 측에서 처리)
- [ ] 글로벌 에러 인터셉터(toast 통합)가 mutator 에 들어가 있다면 컴포넌트 측 중복 alert 제거

### 5. envelope 처리 검증

- [ ] 해당 도메인의 응답이 `{ data: T }` 형태인지 5~10개 endpoint 샘플로 확인
- [ ] 비일관 endpoint 발견 시 PRD 위험 항목에 기록 + mutator override 추가

### 6. 기존 파일 정리

- [ ] 기존 `*Schema.ts` (zod) — generated 가 schema 도 노출하면 삭제, 아니면 재배치
- [ ] 기존 `apps/<app>/src/api/<도메인>/<도메인>.ts` 삭제
- [ ] 사용처에서 더 이상 참조되지 않음을 grep 으로 재확인
- [ ] orphan import 정리 (`@/api/<도메인>` 의 잔존 export)

### 7. apps/web 미러 동기화 (admin/mentor 도메인 한정)

- [ ] `apps/admin/src/<도메인>` 변경 시 `apps/web/src/domain/admin/<...>` 도 동일하게 갱신
- [ ] `apps/mentor/src/<도메인>` 변경 시 `apps/web/src/domain/mentor/<...>` 도 동일하게 갱신
      (project_admin_mirror_policy.md — 모노레포 전환 진행 중, 현재 apps/web 만 배포)

### 8. BE Swagger drift 감지

- [ ] `pnpm --filter @letscareer/api gen:api` 재실행 시 git diff 가 깨끗한지 확인
- [ ] 의도치 않은 spec 변경분 발견 시 BE 협업 메모(`tasks/memos/be-request-orval.md`) 갱신

### 9. 회귀 QA

- [ ] 도메인 핵심 페이지 5~10개 수동 QA (목록, 상세, 생성, 수정, 삭제 흐름)
- [ ] 401 → 로그아웃 flow 확인 (`onUnauthorized` 동작)
- [ ] queryKey 변경으로 invalidate 누락이 생기지 않았는지 확인 (생성/수정 후 목록 갱신)

### 10. 빌드/검증

- [ ] `pnpm typecheck` 전체 통과 (web/admin/mentor)
- [ ] `pnpm lint` 통과
- [ ] `pnpm build` 통과
- [ ] `pnpm test` 통과 (해당 도메인 단위 테스트)

---

## PR 리뷰 체크포인트 (PRD §6.4 재확인)

리뷰어는 다음 두 가지를 매번 점검합니다.

- [ ] 신규 fetcher hook 을 손으로 작성하지 않았는가? (전부 generated 사용)
- [ ] 같은 endpoint 가 두 hook(신·구) 으로 호출되는 상태가 남아있지 않은가?

---

## 참고

- PRD: `.claude/tasks/prd-0505.md`
- 사용 규칙: `packages/api/README.md`
- BE 협업 메모: `tasks/memos/be-request-orval.md` (필요 시 작성)
