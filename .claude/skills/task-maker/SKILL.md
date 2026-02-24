---
name: task-maker
description: "PRD나 요구사항을 기반으로 Git 워크플로우에 맞는 작업 목록을 생성합니다. 사용자가 'PRD 기반 작업 만들어줘', '작업 목록 생성', 'task 만들어줘', '기능 분해해줘' 등을 요청할 때 사용합니다."
argument-hint: "[prd-file-path]"
disable-model-invocation: true
allowed-tools: Read, Write, Glob
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

---

## 출력 형식 (Push 파일)

```markdown
# Tasks: [PRD명] - Push [N]

> PRD: `todo/[prd-파일명].md`
> Push 범위: [기능 요약]
> 상태: 🔲 진행 중

---

### 관련 파일

- `src/components/Foo.tsx` - 주요 컴포넌트

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
- 완료 후 생성된 파일 목록만 간단히 보고

## 참고 자료

- 상세 규칙: [rules/](../vercel-react-best-practices/rules/)
- 전체 가이드: [AGENTS.md](../vercel-react-best-practices/AGENTS.md)
