# 렛츠커리어 `.claude` 디렉토리 가이드

렛츠커리어 프로젝트에서 Claude Code를 효율적으로 사용하기 위한 설정과 자동화 도구들입니다.

---

## 📁 디렉토리 구조

```
.claude/
├── agents/               # 서브 에이전트 (단일 세션 내 작업)
├── roles/                # 에이전트 팀 역할 정의 (멀티 세션)
├── skills/               # 재사용 가능한 스킬
├── docs/                 # 프로젝트 문서
├── hooks/                # 자동화 훅 스크립트
├── tasks/                # 작업 기록
├── settings.json         # Claude Code 설정
└── launch.json           # VS Code 디버깅 설정
```

---

## 🤖 에이전트

### 1. 서브 에이전트 (`agents/`)

단일 세션 내에서 Task 도구로 호출되는 전문 에이전트입니다.

| 에이전트 | 역할 | 사용 시점 |
|---------|------|----------|
| **doc-updater** | 문서 업데이트 | 코드 변경 시 자동 문서화 |
| **test-runner** | 테스트 실행 | 구현 완료 후 자동 테스트 |
| **task-executor** | 작업 실행 | 복잡한 구현 작업 위임 |

### 2. 에이전트 팀 (`roles/`)

여러 Claude Code 세션이 협력하는 팀 구조입니다.

| 역할 | 책임 | 모델 |
|-----|------|------|
| **coordinator** | 작업 조율 및 분배 | Sonnet (inherit) |
| **developer** | 코드 구현 | Sonnet (inherit) |
| **tester** | 테스트 및 검증 | Haiku (빠른 실행) |

#### 에이전트 팀 활성화 방법

`settings.json`에서 다음 설정 확인:
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` (활성화)
- `teammateMode: "tmux"` (tmux 기반 협업)

---

## 🎯 스킬 (`skills/`)

프로젝트별 규칙과 베스트 프랙티스를 자동 적용합니다.

| 스킬 | 내용 | 적용 대상 |
|-----|------|----------|
| **code-quality** | 코드 품질 기준 (가독성, 예측성, 응집도, 결합도) | developer |
| **folder-structure** | 프로젝트 폴더 구조 규칙 | developer |
| **seo** | SEO 최적화 가이드 (메타데이터, sitemap 등) | developer |
| **vercel-react-best-practices** | Vercel React 최적화 규칙 (memo, 병렬 fetching 등) | developer |
| **task-runner** | 작업 실행 워크플로우 | coordinator |
| **task-maker** | 작업 생성 및 관리 | coordinator |

**자동 적용**: `developer` 역할은 vercel-react-best-practices, code-quality, folder-structure 자동 활성화
**수동 활성화**: `/skill seo`

---

## 📚 문서 (`docs/`)

### 1. 프로젝트 문서 (`letscareer/`)

```
docs/letscareer/
├── common/                    # 공통 모듈 문서
│   ├── README.md              # 통합 가이드
│   ├── components.md          # 75+ 공통 컴포넌트
│   ├── hooks.md               # 40+ 커스텀 훅
│   └── services.md            # API 서비스 & 유틸리티
├── curation-domain/           # 큐레이션 도메인 아키텍처
│   └── README.md
├── API_docs/                  # API 문서
│   └── swagger_url.md
└── tech-stack/                # 기술 스택
    └── README.md
```

#### 공통 모듈 문서 (`common/`)

| 문서 | 내용 |
|-----|------|
| **components.md** | Button, Input, Modal, Layout, Dropdown, Container 등 75+ 재사용 컴포넌트 |
| **hooks.md** | useMounted, useScrollDirection, usePageableWithSearchParams 등 40+ 커스텀 훅 |
| **services.md** | useUserQuery, usePatchUser 등 React Query 기반 API 서비스 및 유틸리티 함수 |
| **README.md** | 공통 모듈 통합 가이드 (사용 원칙, Import 경로, 타입 안전성) |

#### 도메인 문서

| 문서 | 내용 |
|-----|------|
| **curation-domain/README.md** | 큐레이션 플로우 상태 관리, 추천 엔진, FAQ 시스템, 컴포넌트 구조 |

#### API 문서 (`API_docs/`)

| 문서 | 내용 |
|-----|------|
| **swagger_url.md** | Swagger API 문서 URL (https://letsintern.kr/v3/api-docs) |

#### 기술 스택 (`tech-stack/`)

| 문서 | 내용 |
|-----|------|
| **README.md** | Next.js 15, React 18, TypeScript, Tailwind CSS, React Query, Zustand 등 전체 기술 스택 및 설정 |

**tech-stack/README.md 주요 내용**:
- 런타임 & 언어 (Node.js 20, TypeScript 5, React 18)
- 프레임워크 (Next.js 15 App Router, Sentry)
- 스타일링 (Tailwind CSS, PostCSS, SASS, Emotion, styled-components)
- 상태 관리 (TanStack React Query v5, Zustand, React Hook Form, Zod)
- UI 라이브러리 (MUI, Swiper, lucide-react)
- 리치 텍스트 에디터 (Lexical, react-quill, KaTeX)
- 애니메이션 (Framer Motion)
- 유틸리티 (date-fns, dayjs, es-toolkit, lodash-es, nanoid, es-hangul)
- 결제 (Toss Payments SDK)
- 실시간 협업 (Yjs, y-websocket)
- Firebase, Excalidraw
- 개발 도구 (Vite, Vitest, SVGR, Builder.io)
- ESLint 설정 (Flat Config, 주요 규칙)
- Prettier 설정 (prettier-plugin-tailwindcss)
- TypeScript 설정 (Path Aliases: @/, @components/*)
- Next.js 설정 (Turbopack, Webpack, Sentry)
- Tailwind CSS 커스텀 디자인 토큰 (색상, 반응형 breakpoints, 폰트 사이즈)

### 2. Claude Code 문서 (`claude_code_docs/`)

Claude Code 사용법 공식 가이드

| 문서 | 내용 |
|-----|------|
| **Create custom subagents.md** | 서브 에이전트 생성 및 설정 방법 |
| **Extend Claude with skills.md** | 프로젝트별 스킬 작성 가이드 |
| **Automate workflows with hooks.md** | 훅 스크립트 작성 및 자동화 |
| **Orchestrate teams of Claude Code sessions.md** | 에이전트 팀 설정 및 협업 방법 |

---

## ⚙️ 훅 (`hooks/`)

코드 작성 시 자동 실행되는 스크립트입니다.

| 훅 | 트리거 | 동작 |
|----|--------|------|
| **post-edit-lint.sh** | Edit/Write 도구 사용 후 | ESLint + Prettier 자동 실행 |
| **check-tasks.sh** | 작업 시작 전 | 미완료 작업 체크 |
| **inject-task-context.sh** | 작업 컨텍스트 주입 | 태스크 정보 자동 삽입 |

---

## 📋 작업 관리 (`tasks/`)

```
tasks/
└── done/                  # 완료된 작업 아카이브
    ├── 260301/            # 날짜별 폴더
    ├── 260302/
    └── ...
```

**작업 기록 예시**:
- PRD (제품 요구사항 문서)
- TODO 목록
- 변경사항 로그
- 디자인 에셋 (Figma 캡처 등)

---

## 🚀 빠른 시작

### 1. 일반 작업 (단일 세션)

**워크플로우**:
```
"새로운 useDebounce 훅을 만들어줘"
→ developer 스킬 자동 적용
→ 코드 작성
→ ESLint + Prettier 자동 실행 (post-edit-lint 훅)
→ doc-updater로 문서화
→ 커밋
```

### 2. 복잡한 작업 (에이전트 팀)

**워크플로우**:
```
[coordinator에게] "검색 기능을 추가해줘. 자동완성과 최근 검색어 포함"

→ coordinator: 작업 분석 및 분배
→ developer: SearchInput 컴포넌트 구현 + useSearchSuggestions 훅 작성
→ tester: ESLint, Prettier, 타입 체크, 유닛 테스트
→ coordinator: 결과 취합 및 사용자 보고
```

### 3. 서브 에이전트 활용

**워크플로우**:
```
"Button 컴포넌트 Props 변경했어. 문서 업데이트 필요해"
→ doc-updater 에이전트 자동 호출
→ 코드 분석 → components.md 업데이트

"로그인 기능 구현 완료"
→ test-runner 에이전트 호출
→ ESLint → Prettier → 타입 체크 → 유닛 테스트
```

---

## 💡 사용 팁

### 에이전트 팀 활용

- **병렬 작업**: developer와 tester를 동시에 실행해 효율 극대화
- **작업 위임**: coordinator는 "developer에게 X 구현 요청" 같은 명령 사용
- **공유 태스크**: 팀 전체가 TodoList 공유하여 진행 상황 추적

### 문서 활용

- **공통 컴포넌트**: `docs/letscareer/common/components.md` 참조
- **도메인 아키텍처**: `docs/letscareer/curation-domain/README.md` 참조
- **기술 스택**: `docs/tech-stack/README.md` 참조

### 스킬 활용

- 스킬은 자동 적용되므로 별도 명령 불필요
- 필요 시 `/skill [스킬명]`으로 수동 활성화

### 훅 활용

- 코드 포맷팅은 자동 실행 (post-edit-lint)
- 추가 훅은 `hooks/` 디렉토리에 스크립트 추가 후 `settings.json`에 등록

---

## 🔧 설정 파일

### `settings.json`

| 설정 | 값 | 설명 |
|-----|-----|------|
| CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS | "1" | 에이전트 팀 활성화 |
| teammateMode | "tmux" | tmux 기반 협업 |
| defaultRoleName | "coordinator" | 기본 역할 |

### `.claude/roles/*.md`

각 에이전트 역할 정의 파일 (YAML frontmatter + 상세 가이드)

---

## 📖 참고 자료

- [Claude Code 공식 문서](https://docs.claude.com/claude-code)
- [에이전트 팀 가이드](.claude/docs/claude_code_docs/Orchestrate teams of Claude Code sessions.md)
- [서브 에이전트 생성 가이드](.claude/docs/claude_code_docs/Create custom subagents.md)
- [스킬 작성 가이드](.claude/docs/claude_code_docs/Extend Claude with skills.md)
- [훅 자동화 가이드](.claude/docs/claude_code_docs/Automate workflows with hooks.md)

---

**마지막 업데이트**: 2026-03-03
