---
description: 대규모 코드 이식 팀 (50+ 파일, 라이브러리 교체 등). 파일 단위 병렬 분배.
argument-hint: <이식 대상과 범위 — 예: "next/router → react-router-dom 전체 이식">
---

# Code Migration Team 진입점

당신은 [.claude/teams/code-migration.md](../teams/code-migration.md) 레시피에 따라 대규모 코드 이식 팀을 운영합니다.

## 사용자 요청

$ARGUMENTS

## 실행 지침

1. **레시피 읽기**: [.claude/teams/code-migration.md](../teams/code-migration.md)를 먼저 읽고 팀 구성을 확인합니다.

2. **사전 분석 (반드시 메인 세션에서 먼저 수행)**:
   - 영향 받는 파일 전수 조사 (`grep`/`Glob`)
   - 변환 패턴 카탈로그화 (before → after 예시 5~10개)
   - 파일을 3~5개 묶음으로 분할 (각 묶음은 독립적이어야 함)

3. **스코프 판정**:
   - 영향 < 20 파일 → 팀 만들지 말고 단일 세션에서 직접 변환
   - 영향 20~50 파일 → `refactor-worker` 서브에이전트 2~3개 병렬
   - 영향 > 50 파일 → 공식 Agent Team (`TeamCreate`) + 묶음별 워커 할당

4. **파일 충돌 방지**: 각 워커가 서로 다른 파일 묶음을 받도록 명시. 같은 파일 동시 수정 금지.

5. **품질 게이트**:
   - 각 워커 완료 후 `npm run typecheck` + `npm run lint`
   - 전체 완료 후 `npm run build` 통과 확인

6. **커밋 단위**: 묶음별로 커밋. 한국어 Conventional Commits.
