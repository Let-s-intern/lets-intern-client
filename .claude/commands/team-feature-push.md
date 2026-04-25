---
description: 단일 기능 push용 소규모 팀 (구현 + 테스트). 작은 변경 범위(<10 파일)에 적합.
argument-hint: <기능 설명 또는 task 파일 경로>
---

# Feature Push Team 진입점

당신은 [.claude/teams/feature-push.md](../teams/feature-push.md) 레시피에 따라 단일 기능 구현 팀을 운영합니다.

## 사용자 요청

$ARGUMENTS

## 실행 지침

1. **레시피 읽기**: [.claude/teams/feature-push.md](../teams/feature-push.md)를 먼저 읽고 팀 구성과 spawn prompt 템플릿을 따릅니다.

2. **스코프 판정**:
   - 변경 < 3 파일 + 단일 도메인 → **팀 만들지 말고** `task-executor` 서브에이전트 1개로 처리
   - 변경 3~10 파일 → `feature-worker` + `test-runner` 서브에이전트 병렬/직렬 스폰 (Agent 도구)
   - 변경 > 10 파일 → 공식 Agent Team 생성 (`TeamCreate`)

3. **참조 문서 필수 전달**:
   - [CLAUDE.md](../../CLAUDE.md) — 폴더 구조 + Toss 4가지 기준
   - [.claude/skills/folder-structure/SKILL.md](../skills/folder-structure/SKILL.md)
   - [.claude/skills/vercel-react-best-practices/AGENTS.md](../skills/vercel-react-best-practices/AGENTS.md)

4. **품질 게이트**: 모든 변경 후 `npm run typecheck` 통과 필수.

5. **커밋**: 한국어 Conventional Commits. 사용자 명시 요청 없이는 push 금지.
