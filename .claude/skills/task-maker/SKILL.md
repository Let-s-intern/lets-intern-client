---
name: task-maker
description: "PRD나 요구사항을 기반으로 Git 워크플로우에 맞는 작업 목록을 생성합니다. 사용자가 'PRD 기반 작업 만들어줘', '작업 목록 생성', 'task 만들어줘', '기능 분해해줘' 등을 요청할 때 사용합니다."
argument-hint: "[prd-file-path]"
disable-model-invocation: true
user-invocable: true
---

# PRD 기반 작업 목록 생성

PRD를 분석하여 **Push 단위 파일 분리** + **커밋 단위 하위 작업** 구조로 task 파일을 생성합니다.

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

### 5. 스킬 및 Role 매핑

각 Push 파일에 해당 작업에 필요한 **적용 스킬**과 **적용 Role**을 명시:

프로젝트에서 사용 가능한 스킬 목록 (`.claude/skills/`):
- `code-quality` — 코드 품질 기준 (가독성, 예측 가능성, 응집도, 결합도)
- `folder-structure` — 폴더 구조 규칙 (새 파일/컴포넌트 생성 시)
- `vercel-react-best-practices` — React/Next.js 성능 최적화
- `seo` — SEO 메타데이터, Open Graph, SSR/CSR 판단

프로젝트에서 사용 가능한 Role 목록 (`.claude/roles/`):
- `developer.md` — 개발 전담 에이전트
- `coordinator.md` — 작업 조율
- `tester.md` — 테스트 전담

Push 작업 내용에 따라 적절한 스킬/Role을 선택하여 기재:
- 파일 생성이 포함되면 → `folder-structure`
- 컴포넌트 작성이 포함되면 → `vercel-react-best-practices`, `code-quality`
- SEO/메타데이터 관련이면 → `seo`
- 모든 개발 Push → `developer.md` Role 적용

### 6. 마스터 인덱스 파일 생성

Push 파일들과 별도로 `task-[날짜].md` 마스터 인덱스 파일을 생성:
- Push 목록 테이블 (파일명, 범위, 상태)
- 개발 규칙 요약
- 참고 문서 링크 모음
- 전체 적용 스킬/Role 목록

---

## 출력 형식 (Push 파일)

```markdown
# Tasks: [PRD명] - Push [N]

> PRD: `todo/[prd-파일명].md`
> Push 범위: [기능 요약]
> 상태: 🔲 진행 중

---

### 적용 스킬

- `skill-name` — 이 Push에서 해당 스킬이 필요한 이유

### 적용 Role

- `.claude/roles/role-name.md` — 역할 설명

### 관련 파일

- `src/components/Foo.tsx` - 주요 컴포넌트

### 참고 문서

- `.claude/docs/...` — 참고할 문서 경로

---

## 작업

- [ ] 1.0 상위 작업 (Push 범위)
    - [ ] 1.1 하위 작업 (커밋 단위)
        - [ ] 1.1.T1 테스트 코드 작성
        - [ ] 1.1.T2 테스트 실행 및 검증
    - [ ] 1.2 하위 작업 (커밋 단위)
        - [ ] 1.2.T1 테스트 코드 작성
        - [ ] 1.2.T2 테스트 실행 및 검증
```

---

## 규칙

- 사용자 확인 없이 분석 → 파일 저장까지 자동 완료
- 반드시 Push 단위로 파일 분리 (단일 파일 금지)
- React/TSX 관련 작업에는 Vercel 베스트 프랙티스 반영
- 각 Push 파일에 적용할 스킬과 Role을 반드시 명시
- 참고해야 할 문서(`.claude/docs/`, 화면 이미지 등)의 경로를 명시
- 완료 후 생성된 파일 목록만 간단히 보고

## 참고 자료

- 스킬 목록: `.claude/skills/*/SKILL.md`
- Role 목록: `.claude/roles/*.md`
- 상세 규칙: [rules/](../vercel-react-best-practices/rules/)
- 전체 가이드: [AGENTS.md](../vercel-react-best-practices/AGENTS.md)
