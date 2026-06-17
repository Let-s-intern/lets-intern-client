---
name: feature-push
description: 단일 기능 push 팀 (middleware·작은 컴포넌트·단일 훅 등)
size: 2~3 팀원
lead: push-lead (또는 메인 세션 직접)
duration_hint: 5분~30분
---

# Feature Push Team

단일 기능·작은 변경 범위(< 10 파일)의 Push에 사용하는 소규모 팀. 오버엔지니어링 방지 목적으로, 굳이 팀으로 확장하지 않고 메인 세션이 `feature-worker` 하나와 `test-runner` 하나만 스폰해도 충분한 경우가 많습니다.

## 팀원 구성

| 역할 | 에이전트 타입 | 인원 | 담당 |
|---|---|---|---|
| 팀 리드 | `push-lead` 또는 메인 세션 | 1 | Gate 판단 |
| 구현 워커 | `feature-worker` | 1 | 핵심 로직 작성 |
| 테스트 워커 | `test-runner` | 1 | 타입체크·빌드·curl 등 스모크 |

> 더 작은 스코프(< 3 파일)면 **팀 없이 `task-executor` 단일 에이전트** 사용 권장.

## 병렬·직렬 규칙

직렬. 구현 → 테스트 → Gate.

## Spawn Prompt 템플릿

```text
다음 task 파일을 완전히 실행하세요. 사용자에게 질문 금지, 자율 완료.

**Task 파일**: <경로>
**Push 범위**: <한 줄>
**참조 PRD**: <경로>

**지시사항**:
1. 단일 feature-worker 스폰 (스코프 작음)
2. task 파일의 1.1 정확한 코드를 그대로 사용 (변경 금지)
3. 각 하위 작업 완료 시 즉시 커밋 (한국어 Conventional Commits)
4. T1/T2 테스트 실행 — 타입체크·curl·단위 테스트 해당 조합
5. git push 금지

**참조 문서**:
- CLAUDE.md
- .claude/behavioral.md
- <관련 skill 경로>

**완료 기준**:
- 타입체크 통과
- <기능 구체 검증>
- 모든 [x] 체크 완료
- 커밋 해시 포함 요약 반환
```

## 적용 사례

- **Push 3 (2026-04-24)**: `apps/web/src/middleware.ts` 신규 작성. feature-worker 1 + test-runner 1. 2 커밋(`4f1a69945`, `4248fae1d`).

## 주의

- 스코프가 작으므로 팀으로 확장하는 것이 **오버헤드가 수익을 초과하는 경우** 가 많음 → 필요할 때만 팀 구성
- curl 등 외부 검증이 필요하면 로컬 dev 서버를 test-runner가 기동. 5분 초과 시 타입체크로 대체
