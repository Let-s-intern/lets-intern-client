# .claude/teams — 팀 구성 레시피

병렬 작업이 실질적 이익이 있을 때 사용할 **재사용 가능한 팀 구성 템플릿**을 정의합니다. 여기 파일들은 Claude Code 런타임 설정이 아니라 사람과 에이전트가 읽는 **레시피 문서**입니다.

> 공식 Agent Teams는 `~/.claude/teams/{team-name}/config.json`(홈 디렉토리)에 런타임 상태를 저장합니다. 프로젝트 내 `.claude/teams/*.md`는 런타임 config로 인식되지 않습니다 — 사람과 리드 에이전트가 참조하는 템플릿입니다.

---

## 사용 방법 (3가지 진입점)

### 1) 슬래시 커맨드로 호출 (권장)

각 레시피마다 슬래시 커맨드가 [.claude/commands/](../commands/)에 정의되어 있습니다. 인자로 작업 설명을 넘기면 리드가 알아서 팀을 구성합니다.

```
/team-feature-push <작업 설명>
/team-code-migration <이식 범위>
/team-parallel-review <PR 번호 또는 브랜치>
/team-debug-hypothesis <버그 증상>
/team-docs-refresh <갱신 대상>
```

### 2) 자연어로 호출

슬래시 커맨드 없이 직접 부탁할 수도 있습니다. Claude는 task 성격을 보고 팀을 만들지 서브에이전트로 처리할지 결정합니다.

```
PR #142 보안·성능·테스트 커버리지 관점으로 병렬 리뷰 팀 만들어줘.
```

### 3) push-lead 서브에이전트 직접 스폰

`.claude/tasks/`에 task 파일이 있을 때, [push-lead](../agents/push-lead.md)에게 위임하면 task를 분해해 워커들을 병렬 스폰합니다.

---

## 의사결정 트리: 팀 vs 서브에이전트 vs 단일 세션

작업이 들어왔을 때 무엇을 쓸지 결정하는 순서:

```
작업 들어옴
   │
   ▼
1. 변경 범위 < 3 파일 + 단일 도메인?
   ├─ YES → 단일 세션 직접 처리 (팀 X, 서브에이전트 X)
   └─ NO  → 2번으로
   │
   ▼
2. 독립적 병렬 분기가 있는가?
   (예: 보안 검토 + 성능 검토 + 테스트 검토 / 가설 A·B·C 동시 검증)
   ├─ NO  → 서브에이전트 1~2개 (Agent 도구로 위임)
   └─ YES → 3번으로
   │
   ▼
3. 워커들이 서로 대화하며 합의가 필요한가?
   (예: 디베이트, 가설 반증, 크로스 도메인 조율)
   ├─ NO  → 서브에이전트 병렬 스폰 (메인 세션이 결과 수합)
   └─ YES → 공식 Agent Team 생성 (TeamCreate)
```

**핵심 트레이드오프:**

| 방식 | 토큰 비용 | 적합 작업 |
|---|---|---|
| 단일 세션 | 최저 | 작은 변경, 단일 파일 수정, 빠른 질문 |
| 서브에이전트 1개 | 낮음 | 격리된 컨텍스트가 필요한 단일 위임 (코드 리뷰, 탐색) |
| 서브에이전트 N개 병렬 | 중간 | 독립적 병렬 작업 (5개 파일 동시 리팩터, 다영역 리서치) |
| 공식 Agent Team | 높음 | 워커 간 대화·디베이트·합의 필요한 협업 |

> 80% 이상의 일상 작업은 **단일 세션 + 가벼운 서브에이전트**로 충분합니다. 팀은 진짜 병렬 협업이 가치를 내는 경우에만.

---

## 언제 팀을 쓰는가

공식 문서(`docs/claude_code_docs/Orchestrate teams of Claude Code sessions.md`)의 가이드를 따릅니다.

| 상황 | 팀 레시피 |
|---|---|
| 대규모 코드 이식 (50+ 파일, next/* → react-router-dom 등) | [`code-migration.md`](./code-migration.md) |
| 단일 기능 구현 (middleware·신규 컴포넌트·단일 훅) | [`feature-push.md`](./feature-push.md) |
| PR/branch 코드 리뷰 (보안·성능·테스트 커버리지 병렬 분석) | [`parallel-review.md`](./parallel-review.md) |
| 원인 불명 버그 (경쟁 가설 병렬 검증) | [`debug-hypothesis.md`](./debug-hypothesis.md) |
| 대량 문서 최신화 (코드 변경 반영) | [`docs-refresh.md`](./docs-refresh.md) |

---

## 공식 Agent Teams vs 서브에이전트 오케스트레이션

본 프로젝트에서는 두 가지 패턴을 상황에 맞게 사용합니다.

|  | Agent Teams (공식) | 서브에이전트 오케스트레이션 (현 주 사용) |
|---|---|---|
| **활성화** | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 필요 | 기본 활성 |
| **리드** | 메인 Claude Code 세션 | 메인 세션 또는 `push-lead` 서브에이전트 |
| **팀원 간 통신** | 직접 메시지 가능 (mailbox) | 리드 경유 (서브에이전트는 서로 대화 불가) |
| **컨텍스트** | 각자 독립 + CLAUDE.md 자동 로드 | 각자 독립 + 프롬프트 주입 |
| **토큰 비용** | 높음 | 중간 |
| **적합** | 장시간 협업·토론·질의응답 | 짧은 병렬 실행·결과 수합 |

본 레시피는 **서브에이전트 오케스트레이션**을 기본으로, 필요 시 공식 Agent Teams로 확장할 수 있도록 설계됩니다.

---

## 팀 사이징 가이드 (공식 기준)

- 3~5명 권장 — 그 이상은 조율 비용이 수익을 초과
- 팀원당 5~6 태스크 유지 — 너무 적으면 유휴, 너무 많으면 컨텍스트 이탈
- 병렬성이 실제로 이득이 될 때만 팀 구성 (파일 충돌 없는 독립 작업)

---

## 팀원 역할은 .claude/agents/ 에서 재사용

공식 문서의 [Use subagent definitions for teammates](../docs/claude_code_docs/Orchestrate%20teams%20of%20Claude%20Code%20sessions.md) 섹션에 따라, 팀원 정의는 `.claude/agents/`의 서브에이전트를 그대로 참조합니다. 같은 정의를 팀원(Agent Teams)·서브에이전트(오케스트레이션)로 양방 재사용.

| 팀원 역할 | 서브에이전트 정의 |
|---|---|
| 팀 리드 | `agents/push-lead.md` |
| 자율 실행 | `agents/task-executor.md` |
| 기능 구현 | `agents/feature-worker.md` |
| 리팩터링 | `agents/refactor-worker.md`, `agents/refactorer.md` |
| 디자인 | `agents/design-worker.md` |
| 문서 | `agents/doc-worker.md`, `agents/doc-updater.md`, `agents/doc-finder.md` |
| 테스트 | `agents/test-runner.md` |

`.claude/agents/` 외의 서드파티 플러그인(예: `pr-review-toolkit:*`)도 팀원으로 스폰 가능합니다.

---

## 팀 구성 체크리스트

새 팀을 스폰하기 전에:

- [ ] 팀원끼리 같은 파일을 편집하지 않는가
- [ ] 각 팀원이 명확한 경계와 산출물을 가지는가
- [ ] 팀원당 5~6개 단위 작업으로 분할되었는가
- [ ] CLAUDE.md 및 작업 유형별 참조 문서(`skills/*/SKILL.md`)가 spawn prompt에 포함되었는가
- [ ] 완료 Gate(빌드 성공·타입체크 통과 등)가 측정 가능한가

---

## 팀 종료 & 정리

- 공식 Agent Teams: 리드에게 "Clean up the team" 요청 → 활성 팀원 shutdown 후 팀 리소스 삭제
- 서브에이전트 오케스트레이션: 리드(push-lead)가 각 서브에이전트 결과를 받고 자연 종료, task 파일을 `done/`으로 이동

---

## 참고

- `.claude/docs/claude_code_docs/Orchestrate teams of Claude Code sessions.md` — 공식 문서
- `.claude/agents/` — 서브에이전트 정의 (팀원 역할로 재사용)
- `.claude/skills/task-runner/SKILL.md` — PRD·task 기반 자동 실행 플로우
