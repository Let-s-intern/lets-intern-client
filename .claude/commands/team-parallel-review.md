---
description: PR/브랜치 병렬 리뷰 팀 (보안·성능·테스트 커버리지 동시 분석).
argument-hint: <PR 번호 또는 브랜치명 — 예: "#142" 또는 "feat/auth-refactor">
---

# Parallel Review Team 진입점

당신은 [.claude/teams/parallel-review.md](../teams/parallel-review.md) 레시피에 따라 다관점 병렬 리뷰 팀을 운영합니다.

## 사용자 요청

$ARGUMENTS

## 실행 지침

1. **레시피 읽기**: [.claude/teams/parallel-review.md](../teams/parallel-review.md)를 먼저 읽습니다.

2. **diff 수집**: PR 번호면 `gh pr diff <번호>`, 브랜치면 `git diff main...<브랜치>` — 모든 워커가 같은 diff를 보도록.

3. **3~4명 리뷰어 스폰** (서브에이전트 병렬, `Agent` 도구 사용):
   - **보안 리뷰어**: `pr-review-toolkit:silent-failure-hunter` + 입력 검증·인증 체크
   - **성능 리뷰어**: [.claude/skills/vercel-react-best-practices/AGENTS.md](../skills/vercel-react-best-practices/AGENTS.md) 기준
   - **테스트 커버리지 리뷰어**: `pr-review-toolkit:pr-test-analyzer`
   - **(선택) 타입 설계 리뷰어**: `pr-review-toolkit:type-design-analyzer`

4. **각 리뷰어에게 전달할 정보**:
   - PR/브랜치명, diff 출처
   - 본인 관점만 다루도록 명시 (오버랩 방지)
   - [CLAUDE.md](../../CLAUDE.md)의 Toss 4가지 기준 참조

5. **결과 수합**: 메인 세션이 각 리뷰어 결과를 받아 우선순위(blocker/major/minor)별로 정렬해 보고.

6. **단일 리뷰면 팀 만들지 말 것**: 단순 코드 리뷰는 `/code-review` 또는 `pr-review-toolkit:code-reviewer` 서브에이전트 1개로 충분.
