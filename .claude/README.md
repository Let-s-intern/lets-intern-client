# `.claude/` 디렉토리 가이드

Claude Code를 효율적으로 쓰기 위한 프로젝트 단위 설정·자동화·문서 컨테이너. 구조 자체는 *어떤 프로젝트에도 그대로 가져다 쓸 수 있도록* 재사용 가능한 형태로 정리되어 있다. 프로젝트 특화 내용은 모두 `docs/<프로젝트명>/` 아래로 격리한다.

---

## 📁 디렉토리 구조

```
.claude/
├── agents/                # 서브 에이전트 (단일 세션 내 Task로 호출)
├── teams/                 # 에이전트 팀 레시피 (멀티 세션 협업)
├── commands/              # `/<커맨드>` 형태의 슬래시 커맨드
├── skills/                # 재사용 스킬 (자동·수동 활성화)
├── docs/
│   ├── claude_code_docs/  # Claude Code 공식 문서 캐시 (오프라인 참조)
│   └── <프로젝트명>/       # 프로젝트별 문서 (도메인·아키텍처·운영 메모)
├── hooks/                 # 자동화 훅 스크립트
├── tasks/                 # 작업 기록 (gitignored)
├── behavioral.md          # 모든 세션 공통 행동 규칙
├── settings.json          # Claude Code 설정 + hook 정의
└── launch.json            # VS Code 디버깅 설정
```

> **재사용성의 핵심**: 이 디렉토리 자체는 *프로젝트 특화 내용을 두지 않는다*. 도메인·기술 스택·API 명세 같은 프로젝트별 문서는 `docs/<프로젝트명>/` 아래로 격리해, `.claude/` 골격을 다른 저장소로 옮길 때 그대로 따라오게 만든다.

---

## 🤖 에이전트 (`agents/`)

단일 세션 안에서 Task 도구로 위임되는 전문 에이전트. 격리된 컨텍스트·도구셋으로 한정된 작업을 수행한다.

| 에이전트 | 역할 |
|---|---|
| **doc-finder** | 프로젝트 문서를 빠르게 검색·요약 |
| **doc-updater** | 코드 변경에 따른 문서 동기화 |
| **doc-worker** | 아키텍처·디자인·API 문서 작성 (팀 리드 하위) |
| **test-runner** | 테스트 실행과 실패 분석 |
| **task-executor** | 단일 자율 실행 (구현·테스트·커밋·에러 픽스) |
| **push-lead** | Push 단위 팀을 만들어 워커 병렬 오케스트레이션 |
| **feature-worker** | 신규 기능·컴포넌트 구현 (팀 리드 하위) |
| **refactor-worker** | 파일 분리·훅 추출·import 정리 (팀 리드 하위) |
| **design-worker** | 컬러·라운드·간격 통일·UI 개선 (팀 리드 하위) |
| **refactorer** | DDD + 프랙탈 기반 자율 리팩터 |

---

## 👥 팀 (`teams/`)

여러 세션이 협력해 한 작업을 수행하는 *팀 레시피*. `commands/`의 슬래시 커맨드 또는 자연어로 진입한다.

| 팀 | 적합한 작업 |
|---|---|
| **feature-push** | 단일 기능 push (구현 + 테스트, <10 파일) |
| **code-migration** | 대규모 코드 이식 (50+ 파일, 라이브러리 교체 등) |
| **parallel-review** | 보안·성능·테스트 커버리지 동시 분석 |
| **debug-hypothesis** | 원인 불명 버그 — 워커끼리 가설 디베이트 |
| **docs-refresh** | 코드 변경에 맞춰 문서 일괄 최신화 |

팀 vs 서브에이전트 vs 단일 세션 의사결정 트리: [`teams/README.md`](./teams/README.md).

---

## ⌨️ 슬래시 커맨드 (`commands/`)

```
/team-feature-push       <작업 설명>
/team-code-migration     <이식 범위>
/team-parallel-review    <PR 또는 브랜치>
/team-debug-hypothesis   <버그 증상>
/team-docs-refresh       <갱신 대상>
```

각 커맨드는 동일한 이름의 팀 레시피를 호출한다. 슬래시 커맨드 외에도 (1) 자연어로 직접 부탁, (2) `agents/push-lead`에 task 파일로 위임 — 세 가지 진입점이 동등하게 사용 가능.

---

## 🎯 스킬 (`skills/`)

코드 작성·리뷰·리팩터 시 자동/수동 적용되는 규칙 묶음. 일부는 일반적이고 일부는 도메인/스택 특화 — 모두 같은 SKILL.md 형식으로 작성.

| 스킬 | 내용 | 활성화 |
|---|---|---|
| **code-quality** | 가독성·예측성·응집도·결합도 4축 품질 기준 | 자동 |
| **code-review** | PR/diff/경로 기반 리뷰 (PR 없이도 동작) | 수동 (`/review`) |
| **folder-structure** | DDD + 프랙탈 폴더 구조 규칙 | 자동 |
| **seo** | 메타데이터·OG·sitemap·redirect·canonical | 자동 (관련 작업) |
| **vercel-react-best-practices** | React/Next.js 성능 패턴 (memo, 병렬 fetch 등) | 자동 |
| **task-runner** | 작업 실행 워크플로우 | 수동 |
| **task-maker** | PRD → 태스크 분해 | 수동 |
| **task-cleaner** | 완료 태스크 정리 | 수동 |
| **skill-creator** | 새 스킬 작성 도우미 | 수동 |

다른 프로젝트로 골격을 옮길 때, 스택과 무관한 스킬(`code-quality`, `folder-structure`, `code-review`, `task-*`, `skill-creator`)은 그대로 가져가고 스택 의존(`vercel-react-best-practices`, `seo`)은 선택적으로 가져간다.

---

## 📚 문서 (`docs/`)

### Claude Code 공식 문서 캐시 (`claude_code_docs/`)

Claude Code 공식 가이드(hooks·skills·subagents·orchestration)의 오프라인 사본. 인터넷 없이도 참조 가능.

### 프로젝트별 문서 (`<프로젝트명>/`)

프로젝트마다 한 디렉토리씩 만들어 *모든 프로젝트 특화 내용을 한 곳에 격리*한다. `.claude/` 골격을 새 저장소로 가져갈 때 이 디렉토리만 비워서 시작하면 된다.

권장 하위 구조 (필수는 아님):

```
docs/<프로젝트명>/
├── README.md            # 프로젝트 전체 개요
├── architecture.md      # 시스템 아키텍처 개요
├── tech-stack/          # 라이브러리 버전·설정 인벤토리
├── domain/              # 도메인별 README (DDD)
├── common/              # 공용 모듈(컴포넌트·훅·서비스) 가이드
├── API_docs/            # API 명세·Swagger 링크
└── <기타 운영 메모>/     # 배포·전환·트러블슈팅 등
```

이 저장소의 실제 예시: [`docs/letscareer/`](./docs/letscareer/).

---

## ⚙️ 훅 (`hooks/`)

`settings.json`에 등록된 자동화 스크립트. 도구 호출 전후로 동작한다.

| 훅 | 트리거 | 동작 |
|---|---|---|
| **post-edit-lint.sh** | Edit/Write 도구 후 | ESLint + Prettier 자동 실행 |
| **check-tasks.sh** | 세션 시작 | 미완료 태스크 점검 |
| **inject-task-context.sh** | 세션 시작 | 태스크 컨텍스트를 첫 프롬프트에 주입 |

새 훅 추가 → 스크립트 작성 → `settings.json`의 `hooks` 키에 매핑.

---

## 📋 작업 기록 (`tasks/`)

PRD·진행 중 task·완료 아카이브를 보관. **`.gitignore`에 포함되어 공유되지 않는다.** 팀 공유가 필요한 운영 메모는 반드시 `docs/<프로젝트명>/` 아래에 작성한다.

---

## 📜 행동 규칙 (`behavioral.md`)

루트 `CLAUDE.md`에서 자동 로드되는 *모든 세션 공통 가이드*. 4가지 축으로 구성:

1. **Think Before Coding** — 가정 명시, 불확실하면 질문
2. **Simplicity First** — 요청 범위 외 기능·추상화·예외처리 추가 X
3. **Surgical Changes** — 손대야 할 곳만, 인접 코드 자동 개선 X
4. **Goal-Driven Execution** — 검증 가능한 성공 기준 정의 후 루프

프로젝트별 추가 규칙은 루트 `CLAUDE.md`에서 이 파일을 `@.claude/behavioral.md`로 import해 확장한다.

---

## 🔧 설정 (`settings.json`)

| 키 | 의미 |
|---|---|
| `env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | 에이전트 팀 활성화 토글 |
| `hooks` | 도구 호출 전후 실행할 스크립트 매핑 |
| `permissions` | Bash/MCP 도구 자동 허용 목록 |
| `plugins` | 활성화된 Claude Code 플러그인 |

`launch.json`은 VS Code의 Claude Code 디버깅 설정 (필요 시 사용).

---

## 🚀 빠른 시작

### 단일 작업
```
"<훅/컴포넌트/페이지> 만들어줘"
   ↓ 자동 적용: code-quality / folder-structure / 스택별 베스트 프랙티스 스킬
   ↓ Edit/Write 후 post-edit-lint 훅이 자동 lint·format
   ↓ 변경 영향 큰 경우 doc-updater에게 문서 동기화 위임
```

### 팀 작업
```
/team-feature-push <기능 설명>
   ↓ push-lead가 작업 분해
   ↓ feature-worker(구현) + test-runner(검증) 병렬 스폰
   ↓ 결과 취합 후 보고
```

### 서브 에이전트 위임
```
"<X> 사용법 알려줘"      → doc-finder
"테스트 돌려줘"          → test-runner
"이 영역 리팩터해줘"      → refactorer (자율 실행)
"버그 원인 추적해줘"      → /team-debug-hypothesis 또는 push-lead
```

---

## 🧭 다른 프로젝트로 옮기는 절차

1. `.claude/` 디렉토리 통째로 복사 (`docs/<프로젝트명>/` 제외)
2. 루트 `CLAUDE.md`에 `@.claude/behavioral.md` import 추가
3. `settings.json`의 hook 경로·permissions·plugins를 새 저장소 환경에 맞춰 조정
4. 스택과 무관한 스킬(`code-quality`, `folder-structure`, `code-review` 등)은 그대로
5. 스택 의존 스킬(`vercel-react-best-practices`, `seo`)은 새 프로젝트 스택에 맞춰 추가/제거
6. `docs/<새-프로젝트명>/` 디렉토리 생성 후 README·architecture·tech-stack부터 채움

---

## 📖 참고

- [Claude Code 공식 문서](https://docs.claude.com/claude-code)
- [`docs/claude_code_docs/`](./docs/claude_code_docs/) — 오프라인 캐시 (subagents·skills·hooks·orchestration)
- [`teams/README.md`](./teams/README.md) — 팀 vs 서브에이전트 vs 단일 세션 의사결정 트리
