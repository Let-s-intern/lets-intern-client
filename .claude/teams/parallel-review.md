---
name: parallel-review
description: PR/brach를 보안·성능·테스트 커버리지 관점에서 병렬 분석하는 리뷰 팀
size: 3~4 팀원
lead: 메인 세션
duration_hint: 10분~30분
---

# Parallel Review Team

단일 리뷰어는 한 관점에 매몰되기 쉽습니다. PR이나 장기 branch를 **보안 / 성능 / 테스트 커버리지 / 스타일** 관점으로 나눠 병렬 분석하면 누락이 크게 줄어듭니다.

공식 문서의 [Run a parallel code review](../docs/claude_code_docs/Orchestrate%20teams%20of%20Claude%20Code%20sessions.md) 예시 패턴을 본 프로젝트 toolkit에 맞춰 현지화.

## 팀원 구성

| 역할 | 에이전트 타입 | 인원 | 담당 |
|---|---|---|---|
| 팀 리드 | 메인 세션 | 1 | findings 수합·중복 제거·최종 리포트 |
| 보안 리뷰어 | `pr-review-toolkit:silent-failure-hunter` | 1 | 은닉 실패·부적절한 catch·fallback |
| 리뷰어 | `pr-review-toolkit:code-reviewer` | 1 | CLAUDE.md·스타일·베스트 프랙티스 |
| 테스트 분석가 | `pr-review-toolkit:pr-test-analyzer` | 1 | 테스트 커버리지 gap |
| (선택) 타입 디자인 | `pr-review-toolkit:type-design-analyzer` | 0~1 | 신규 타입 invariant 평가 |

## 병렬 가능성

완전 독립. 같은 diff를 각자 다른 lens로 보기 때문에 충돌 없음.

## Spawn Prompt 템플릿

```text
Create an agent team to review <PR 번호 또는 branch 명>. Spawn 3~4 reviewers:

1. silent-failure-hunter — focus on catch blocks, fallback logic, swallowed errors
2. code-reviewer — focus on CLAUDE.md·.claude/skills/code-review rules, Vercel best practices, naming
3. pr-test-analyzer — focus on test coverage gaps, missing edge cases
(4. type-design-analyzer — if new types are introduced, evaluate invariants)

Each reviewer works from `git diff origin/main...HEAD` (or specified base).
Have them each report findings with severity ratings (blocker/high/medium/low).
Synthesize a single consolidated review, deduplicating overlapping findings.

**Context**:
- 프로젝트 규칙: CLAUDE.md, .claude/behavioral.md
- 코드 리뷰 규칙: .claude/skills/code-review/SKILL.md
- Vercel 규칙: .claude/skills/vercel-react-best-practices/AGENTS.md
```

## 완료 기준

- 3~4개 관점 각각에서 findings 생성
- 리드가 중복 제거 및 severity 표준화
- 통합 리포트 (markdown) 출력 또는 PR comment 초안

## 주의

- 리뷰어들이 서로 대화할 필요가 없으므로 **서브에이전트 오케스트레이션**으로 충분 (공식 Agent Teams 불필요)
- 같은 findings가 여러 리뷰어에서 나오면 리드가 dedup — 사용자에게 중복 보고 금지
- 공식 `pr-review-toolkit` 플러그인이 설치되지 않은 환경에서는 `general-purpose` agent에 역할별 spawn prompt로 대체
