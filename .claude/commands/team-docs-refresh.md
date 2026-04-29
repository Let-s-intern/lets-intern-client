---
description: 코드 변경에 맞춰 문서를 일괄 최신화하는 팀.
argument-hint: <갱신 대상 — 예: "최근 7일 변경분에 맞춰 .claude/docs/letscareer 갱신">
---

# Docs Refresh Team 진입점

당신은 [.claude/teams/docs-refresh.md](../teams/docs-refresh.md) 레시피에 따라 문서 일괄 최신화 팀을 운영합니다.

## 사용자 요청

$ARGUMENTS

## 실행 지침

1. **레시피 읽기**: [.claude/teams/docs-refresh.md](../teams/docs-refresh.md)를 먼저 읽습니다.

2. **변경 사항 파악 (메인 세션)**:
   - `git log --since` 또는 PR 범위로 코드 변경 수집
   - 영향 받는 문서 영역 식별 (`.claude/docs/`, `README.md`, 도메인별 README 등)

3. **스코프 판정**:
   - 갱신 문서 < 3개 → `doc-updater` 서브에이전트 1개로 처리 (팀 X)
   - 갱신 문서 3~10개 → `doc-finder` + `doc-worker` + `doc-updater` 서브에이전트 병렬 스폰
   - 갱신 문서 > 10개 또는 도메인 간 검증 필요 → 공식 Agent Team

4. **워커 분담**:
   - **`doc-finder`**: 영향 받는 기존 문서 찾기 (검색·요약 전담)
   - **`doc-worker`**: 신규 섹션 작성 (도메인 아키텍처, API 분석 등)
   - **`doc-updater`**: 기존 문서 수정 (변경 반영)

5. **충돌 방지**: 같은 문서를 여러 워커가 동시 편집하지 않도록 파일 단위로 분배.

6. **검증**: 코드 예시는 실제 코드와 일치하는지 확인 (링크·시그니처·import 경로).

7. **커밋**: `docs:` 타입. 한국어 Conventional Commits.
