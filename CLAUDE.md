@.claude/behavioral.md

# .claude/ 길잡이

```
.claude/
├── README.md                             # 디렉토리 개요
├── behavioral.md                         # 필수 행동 규칙 (자동 로드)
│
├── agents/                               # 서브에이전트 정의
│   ├── push-lead.md                      # Push 단위 팀 리드
│   ├── task-executor.md                  # 단일 자율 실행 에이전트
│   ├── feature-worker.md                 # 기능 구현 워커
│   ├── refactor-worker.md                # 리팩터 워커
│   ├── refactorer.md                     # DDD 기반 리팩터
│   ├── design-worker.md                  # 디자인/스타일
│   ├── doc-worker.md                     # 문서 작성
│   ├── doc-finder.md                     # 문서 검색
│   ├── doc-updater.md                    # 문서 업데이트
│   └── test-runner.md                    # 테스트 실행·검증
│
├── skills/                               # 슬래시 커맨드 스킬
│   ├── code-quality/                     # 코드 품질 규칙 (Toss FE)
│   ├── code-review/                      # 코드 리뷰 체크리스트
│   ├── folder-structure/                 # DDD + 프랙탈 폴더 구조
│   ├── seo/                              # SEO 규칙
│   ├── skill-creator/                    # 스킬 생성 도우미
│   ├── task-cleaner/                     # 태스크 정리
│   ├── task-maker/                       # PRD → 태스크 생성
│   ├── task-runner/                      # 태스크 실행 오케스트레이션
│   └── vercel-react-best-practices/      # Vercel/React 최적화 규칙
│
├── docs/
│   ├── claude_code_docs/                 # Claude Code 공식 문서 캐시
│   ├── common-components/                # 공용 컴포넌트 레퍼런스
│   ├── tech-stack/                       # 기술 스택 개요
│   └── letscareer/
│       ├── README.md                     # 프로젝트 전체 개요 (모노레포·3앱·도메인 분리)
│       ├── API_docs/                     # Swagger URL 등
│       ├── common/                       # 공통 hooks/components/services 상세
│       ├── curation-domain/              # 큐레이션 도메인 상세
│       ├── domain/                       # 도메인별 문서
│       │   ├── challenge-detail/
│       │   ├── challenge-feedback/
│       │   ├── community/
│       │   ├── curation/
│       │   └── mentor/                   # (design-system.md 포함)
│       └── tech-stack/
│
├── roles/                                # 작업 역할 정의
│   ├── coordinator.md
│   ├── developer.md
│   └── tester.md
│
├── hooks/                                # Claude Code 훅 스크립트
│   ├── check-tasks.sh
│   ├── inject-task-context.sh
│   └── post-edit-lint.sh
│
└── tasks/
    ├── prd-*.md                          # PRD 문서
    ├── todo/                             # 진행 중 태스크 파일
    ├── done/                             # 완료된 태스크 + result-*.md
    └── memos/                            # 배포·BE 요청 등 참고 메모
```

## 작업 → 참조 파일 매핑

| 상황 | 먼저 볼 곳 |
|---|---|
| 새 기능 구현 | `skills/folder-structure/SKILL.md`, `skills/vercel-react-best-practices/AGENTS.md`, `docs/letscareer/domain/` |
| 리팩터링 | `skills/folder-structure/SKILL.md`, `skills/code-quality/SKILL.md`, `agents/refactorer.md` |
| 코드 리뷰 | `skills/code-review/SKILL.md` |
| 공유 훅/컴포넌트 찾기 | `docs/letscareer/common/` |
| 도메인 로직 이해 | `docs/letscareer/domain/{도메인}/README.md` |
| API/Swagger | `docs/letscareer/API_docs/swagger_url.md` |
| 기술 스택 확인 | `docs/letscareer/tech-stack/README.md` |
| 모노레포·배포 구조 | `docs/letscareer/README.md`, `tasks/memos/deployment-guide.md` |
| BE 협업 메시지 | `tasks/memos/be-request-*.md` |
| PRD → 태스크 생성 | `skills/task-maker/SKILL.md` |
| 태스크 실행 | `skills/task-runner/SKILL.md` → `agents/push-lead.md` |
| Claude Code 기능 (hooks/skills/subagents 등) | `docs/claude_code_docs/` |
| SEO 작업 | `skills/seo/SKILL.md` |

## 외부 참조

| 파일 | 내용 |
|---|---|
| `.cursor/rules/toss-frontend.mdc` | Toss Frontend Fundamentals 코드 예시 |
| `.cursor/rules/full-stack-rule.mdc` | 풀스택 개발 프랙티스 |
| `.cursor/rules/domain-folder-structure.mdc` | 도메인 폴더 구조 상세 |
| `.cursor/rules/commit-convention.mdc` | 커밋 메시지 컨벤션 |
