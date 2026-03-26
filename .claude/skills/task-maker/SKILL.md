---
name: task-maker
description: "PRD나 요구사항을 기반으로 Git 워크플로우에 맞는 작업 목록을 생성합니다. 사용자가 'PRD 기반 작업 만들어줘', '작업 목록 생성', 'task 만들어줘', '기능 분해해줘' 등을 요청할 때 사용합니다."
argument-hint: "[prd-file-path]"
disable-model-invocation: true
user-invocable: true
---

# PRD 기반 작업 목록 생성

PRD를 분석하여 **Push 단위 파일 분리** + **커밋 단위 하위 작업** 구조로 task 파일을 생성합니다.

> **핵심 원칙:** task-executor 서브에이전트는 `Skill` 도구가 없다.
> 따라서 task 파일에 스킬 내용을 직접 요약하고, 참조 문서/이미지 경로를 명시해야 한다.
> 서브에이전트가 Read 도구로 직접 읽을 수 있도록 **절대 경로** 또는 **프로젝트 루트 기준 상대 경로**를 사용한다.

---

## 폴더 구조

```
todo/          ← PRD 및 신규 Task 파일
  prd-*.md
  tasks-[prd-name]-push1.md
  tasks-[prd-name]-push2.md

done/          ← 완료된 Task + 결과보고서
  tasks-[prd-name]-push1.md
  result-[prd-name]-push1.md
```

`todo/`, `done/` 없으면 자동 생성.

---

## 생성 프로세스 (확인 없이 자동 완료)

### 1. PRD 분석
- 인자로 받은 파일 읽기 (없으면 `todo/` 에서 최신 prd-*.md 탐색)
- 기능 요구사항 전체 파악
- **PRD에 참조된 이미지/스크린샷 파일 경로 수집**
- **PRD에 언급된 도메인 문서 경로 수집**

### 2. Push 단위 파일 분리

각 Push = **별도 파일** (`todo/tasks-[prd-name]-push[N].md`):
- 독립 배포 가능한 기능 단위
- 하위 커밋 3~7개

### 3. 커밋 단위 하위 작업

각 하위 작업 = **하나의 Git 커밋**:
- 파일 수정 5개 미만
- 독립 테스트 가능

### 4. 테스트 작업 자동 추가

모든 구현 작업 뒤에 자동 추가:
- `[N].T1` 테스트 코드 작성
- `[N].T2` 테스트 실행 및 검증

### 5. 컨텍스트 수집 및 임베딩

각 Push 파일에 서브에이전트가 필요로 하는 **모든 컨텍스트를 직접 포함**한다:

#### 5-1. 참조 이미지

PRD에 스크린샷/와이어프레임이 있으면:
- 이미지 파일의 **실제 경로**를 task 파일에 명시
- 서브에이전트가 `Read` 도구로 이미지를 직접 읽을 수 있음
- 각 이미지가 어떤 작업과 관련되는지 설명 추가

```markdown
### 참조 이미지

| 이미지 | 용도 | 관련 작업 |
|--------|------|-----------|
| `.claude/tasks/screenshot1.png` | 옵션 영역 UI 참고 | 1.1, 1.2 |
| `.claude/tasks/screenshot2.png` | 가격 플랜 영역 참고 | 2.1 |
```

#### 5-2. 참조 문서

관련 도메인 문서, 기존 코드 분석 결과를 포함:

```markdown
### 참조 문서

작업 시작 전 반드시 아래 문서를 `Read`로 읽을 것:

| 문서 | 용도 |
|------|------|
| `.claude/docs/letscareer/domain/challenge-detail/README.md` | 챌린지 상세페이지 구조 |
| `.claude/docs/letscareer/domain/challenge-feedback/README.md` | 피드백 멘토링 페이지 구조 |
```

#### 5-3. 스킬 규칙 임베딩

서브에이전트(task-executor)는 Skill 도구가 없으므로, 적용할 스킬의 **핵심 규칙을 task 파일에 직접 요약**한다:

```markdown
### 적용 규칙 (스킬 요약)

#### 폴더 구조 (`folder-structure`)
- `src/domain/` — 도메인별 컴포넌트/훅/유틸
- `src/common/` — 3개 이상 도메인 공용 UI
- ❌ `domain/A/` → `domain/B/` 직접 import 금지

#### 코드 품질 (`code-quality`)
- 가독성: 명확한 네이밍, 단일 책임
- 예측 가능성: 사이드 이펙트 최소화
- 응집도: 관련 로직 한 곳에
- 결합도: 의존성 최소화

#### React 최적화 (`vercel-react-best-practices`)
- memo: 리렌더 방지가 필요한 컴포넌트에 적용
- 정적 값은 컴포넌트 외부로 호이스팅
- 조건부 렌더링: 불필요한 DOM 최소화
```

#### 5-4. 서브에이전트 제약사항 안내

```markdown
### 실행 환경

- **사용 가능 도구:** Read, Write, Edit, Bash, Glob, Grep, Task
- **사용 불가 도구:** Skill, Agent (서브에이전트 중첩 불가)
- **이미지 읽기:** Read 도구로 .png/.jpg 파일 직접 읽기 가능
- **병렬 작업:** 불가 (순차 실행만)
```

### 6. 마스터 인덱스 파일 생성

Push 파일들과 별도로 `task-[날짜].md` 마스터 인덱스 파일을 생성:
- Push 목록 테이블 (파일명, 범위, 상태)
- 개발 규칙 요약
- 참고 문서/이미지 전체 경로 목록
- 전체 적용 스킬 핵심 규칙 요약

---

## 출력 형식 (Push 파일)

```markdown
# Tasks: [PRD명] - Push [N]

> PRD: `[prd-파일-경로]`
> Push 범위: [기능 요약]
> 상태: 🔲 진행 중

---

### 실행 환경

- **사용 가능 도구:** Read, Write, Edit, Bash, Glob, Grep, Task
- **사용 불가 도구:** Skill, Agent
- **이미지 읽기:** Read 도구로 .png/.jpg 파일 직접 열람 가능

### 참조 이미지

| 이미지 | 용도 | 관련 작업 |
|--------|------|-----------|
| `경로` | 설명 | 작업번호 |

### 참조 문서

작업 시작 전 반드시 `Read`로 읽을 것:

| 문서 | 용도 |
|------|------|
| `경로` | 설명 |

### 적용 규칙 (스킬 요약)

#### 폴더 구조
- [해당 Push에 필요한 규칙만 발췌]

#### 코드 품질
- [해당 Push에 필요한 규칙만 발췌]

#### React 최적화
- [해당 Push에 필요한 규칙만 발췌]

### 관련 파일

- `src/components/Foo.tsx` - 주요 컴포넌트 (수정 대상)
- `src/utils/bar.ts` - 유틸리티 (참조)

---

## 작업

- [ ] 1.0 상위 작업 (Push 범위)
    - [ ] 1.1 하위 작업 (커밋 단위)
        **작업 상세:** [구체적 구현 내용]
        **참조:** 이미지 `경로`, 문서 `경로`
        - [ ] 1.1.T1 테스트 코드 작성
        - [ ] 1.1.T2 테스트 실행 및 검증
    - [ ] 1.2 하위 작업 (커밋 단위)
        **작업 상세:** [구체적 구현 내용]
        **참조:** 이미지 `경로`
        - [ ] 1.2.T1 테스트 코드 작성
        - [ ] 1.2.T2 테스트 실행 및 검증
```

---

## 규칙

- 사용자 확인 없이 분석 → 파일 저장까지 자동 완료
- 반드시 Push 단위로 파일 분리 (단일 파일 금지)
- React/TSX 관련 작업에는 Vercel 베스트 프랙티스 핵심 규칙을 task 파일에 직접 포함
- 각 Push 파일에 적용할 스킬의 **핵심 규칙을 요약**하여 임베딩 (스킬명만 기재하지 말 것)
- 참고해야 할 문서(`.claude/docs/`)의 경로를 명시하고 "Read로 읽을 것" 지시 포함
- 참고 이미지가 있으면 **실제 파일 경로**와 **용도 설명**, **관련 작업 번호** 명시
- 서브에이전트 제약사항(사용 가능/불가 도구)을 task 파일 상단에 명시
- 완료 후 생성된 파일 목록만 간단히 보고

## 스킬 규칙 요약 가이드

task 파일에 임베딩할 때, 각 스킬에서 발췌할 핵심 내용:

### folder-structure (파일 생성 시)
- `.claude/skills/folder-structure/SKILL.md` 읽고 핵심 규칙 발췌
- 최소: 배치 기준 표, 금지 사항

### code-quality (모든 코드 작성 시)
- `.claude/skills/code-quality/SKILL.md` 읽고 4가지 기준 요약
- 해당 작업에 특히 중요한 기준 강조

### vercel-react-best-practices (React/TSX 작성 시)
- `.claude/skills/vercel-react-best-practices/SKILL.md` 읽고 해당 카테고리 규칙 발췌
- 컴포넌트 작성 → `rerender-memo`, `rendering-hoist-jsx`, `rendering-conditional-render`
- 데이터 페칭 → `client-swr-dedup`, `async-parallel`
- 번들 → `bundle-dynamic-imports`, `bundle-barrel-imports`

### seo (SEO 관련 작업 시)
- `.claude/skills/seo/SKILL.md` 읽고 해당 규칙 발췌

## 참고 자료

- 스킬 파일: `.claude/skills/*/SKILL.md`
- Role 목록: `.claude/roles/*.md`
- 상세 규칙: `.claude/skills/vercel-react-best-practices/rules/`
- 도메인 문서: `.claude/docs/letscareer/domain/`
