---
name: code-migration
description: 대규모 코드 이식·리팩터링 팀 (50+ 파일, 동일 변환 패턴 반복)
size: 4-6 팀원
lead: push-lead
duration_hint: 30분~수시간
---

# Code Migration Team

50+ 파일을 건드리는 대규모 이식(예: `next/*` → `react-router-dom`, TypeScript 4 → 5, API 클라이언트 교체)에 사용합니다. 개별 파일 변환은 기계적이지만 전체 병합 시 의존성 충돌이 빈번한 작업에 적합.

## 팀원 구성

| 역할 | 에이전트 타입 | 인원 | 담당 |
|---|---|---|---|
| 팀 리드 | `push-lead` | 1 | task 분할·lock 관리·Gate 판단 |
| Import 치환 워커 | `refactor-worker` | 2~3 | 파일 세트 분할하여 import/API 일괄 치환. **동일 파일 동시 편집 금지** — 리드가 파일별 lock |
| 신규 구조 워커 | `feature-worker` | 1~2 | Shell 레이아웃·라우터 재작성·신규 OAuth 콜백 등 신규 생성 담당 |
| 테스트 워커 | `test-runner` | 1 | 각 커밋 후 타입체크·빌드·smoke |

## 병렬·직렬 규칙

**병렬 가능**
- Import 치환 워커들: 파일 세트가 겹치지 않으면 동시 실행
- feature-worker의 신규 파일 생성: import 치환과 무관한 신규 경로면 동시 실행

**직렬 필요**
- 의존성 복사(공유 모듈 이식)는 import 치환 후
- router.tsx 재구성은 모든 개별 파일 이식 후
- 빌드 검증은 최종 단계

## Spawn Prompt 템플릿

```text
다음 task 파일을 완전히 실행하세요. 사용자에게 질문 금지, 자율 완료.

**Task 파일**: <경로>
**Push 범위**: <한 줄 요약>
**참조 PRD**: <경로>

**지시사항**:
1. 팀을 생성하고 task 파일의 "에이전트 팀 배정" 표대로 서브에이전트 스폰
2. 동일 파일 동시 편집 금지 — 파일 lock 관리
3. 병렬/직렬 분류는 task 파일의 상단 규칙 참조
4. 각 하위 작업 완료 시 즉시 커밋 (Conventional Commits, 한국어, 72자)
5. 완료 항목은 `[ ]` → `[x]` 체크
6. T1/T2 테스트 subtask 모두 실행 — grep·typecheck·build
7. git push 금지
8. 빌드/타입 에러 발생 시 T3 수정 작업 자동 추가 후 해결
9. Gate 조건 모두 충족될 때까지 루프

**서브에이전트에게 반드시 전달할 참조 문서**:
- /root/workspace/lets-intern-client/CLAUDE.md
- /root/workspace/lets-intern-client/.claude/behavioral.md
- /root/workspace/lets-intern-client/.claude/skills/folder-structure/SKILL.md
- /root/workspace/lets-intern-client/.claude/skills/vercel-react-best-practices/AGENTS.md

**완료 기준** (task 파일 Gate 섹션 준수):
- 전체 빌드 성공
- grep으로 구 패턴 0건 검증
- 모든 [x] 체크 완료
- 커밋 해시 리스트 포함 최종 요약 반환
```

## Task 분할 규칙

- **파일 수** ≤ 5 per subtask (Conventional Commits "72자 이내" 제약과 정렬)
- **변환 타입별 분리**: useRouter 일괄 치환 / Link 일괄 치환 / 의존성 복사를 각각 다른 subtask로
- **Suspense 경계가 필요한 `next/dynamic` → `React.lazy` 는 반드시 수동** — 파일 수 적어도 분리
- **Guard 로직 수정(AdminGuard·MentorGuard)** 은 항상 feature-worker 단일 담당 (무한 루프 리스크)

## 완료 기준

- `pnpm --filter @letscareer/<app> build` 성공
- `grep -r "<구 패턴>" apps/<app>/src` 0건 (주석 제외)
- task 파일 모든 항목 [x]
- 커밋 해시 리스트 포함 result 보고서 생성

## 적용 사례

- **Push 1 (2026-04-24)**: `apps/mentor` 8 파일 이식. 6 커밋.
- **Push 2 (2026-04-24)**: `apps/admin` 90 파일 이식. refactor-worker×3 병렬 + feature-worker×3 + test-runner.

## 주의

- 공식 Agent Teams 문서의 **"Avoid file conflicts"** 원칙 준수 — 두 팀원이 같은 파일을 편집하면 overwrite 위험
- 팀원이 오래 일하면 "Monitor and steer" — 리드가 중간 점검
- 빌드 실패 누적 시 lead가 판단하여 개별 팀원 재지시 또는 교체
