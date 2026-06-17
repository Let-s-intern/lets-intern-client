---
name: debug-hypothesis
description: 원인 불명 버그를 경쟁 가설 병렬 검증으로 규명
size: 3~5 팀원
lead: 메인 세션 (공식 Agent Teams 권장)
duration_hint: 20분~수시간
requires: CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 (팀원 간 토론 필요 시)
---

# Debug Hypothesis Team

직렬 디버깅은 **anchoring bias**에 취약합니다 — 첫 가설이 그럴듯하면 그 이후 수사가 그 쪽으로 편향. 여러 팀원이 서로 다른 가설을 동시에 조사하고 **서로의 이론을 반박**하게 만들면 실제 원인에 더 빨리 수렴합니다.

공식 문서의 [Investigate with competing hypotheses](../docs/claude_code_docs/Orchestrate%20teams%20of%20Claude%20Code%20sessions.md) 예시 패턴을 그대로 적용.

## 팀원 구성

| 역할 | 에이전트 타입 | 인원 | 담당 가설 예시 |
|---|---|---|---|
| 팀 리드 | 메인 세션 | 1 | 가설 수렴·합의 findings doc 업데이트 |
| 가설 A 조사관 | `general-purpose` | 1 | 예: "렌더링 사이클 문제" |
| 가설 B 조사관 | `general-purpose` | 1 | 예: "API 응답 스키마 미스매치" |
| 가설 C 조사관 | `general-purpose` | 1 | 예: "상태 초기화 누락" |
| (선택) 악마의 변호인 | `general-purpose` | 0~1 | 다른 팀원 이론을 모두 반박 |

## 왜 공식 Agent Teams인가

서브에이전트 오케스트레이션은 팀원 간 **직접 메시지가 불가** → 상호 반박 불가능. 이 팀은 반드시 공식 Agent Teams(`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) 환경에서 실행.

## Spawn Prompt 템플릿

```text
<증상 3~5줄 요약>
Spawn <N> agent teammates to investigate different hypotheses:

1. <가설 A 한 줄>
2. <가설 B 한 줄>
3. <가설 C 한 줄>

Have them talk to each other to try to disprove each other's theories,
like a scientific debate. Each teammate should:

- Investigate its own hypothesis with evidence (logs, reproduction, code trace)
- Actively challenge other teammates' theories
- Update a shared findings doc at `.claude/tasks/memos/debug-<버그명>.md`

Continue until a consensus emerges or one theory survives all challenges.
The lead should NOT start implementing a fix — synthesize findings only.

**Project context (auto-loaded)**:
- CLAUDE.md
- 각 팀원은 서브에이전트 정의 없이 일반 Claude Code 인스턴스로 동작
```

## 완료 기준

- `debug-<버그명>.md` findings doc에 최종 합의 또는 가장 증거가 많은 이론 기록
- 재현 경로·영향 범위·제안 수정 방향 포함
- 리드가 팀을 clean up (공식 문서 경고 — 팀원이 cleanup하면 상태 불일치)

## 주의

- 팀원 수가 많을수록 토큰 비용이 급증 — 3명으로 시작
- "Lead shuts down before work is done" — 리드가 너무 일찍 종료하면 "keep going" 지시
- 팀원이 구현으로 진입하지 않도록 spawn prompt에 **"synthesize findings only"** 명시
