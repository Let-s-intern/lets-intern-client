# Copilot Instructions — Let's Intern Client

> 이 프로젝트의 모든 AI 도구가 따라야 할 핵심 규칙입니다.

## Tech Stack

Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, Zustand, TanStack React Query, React Hook Form + Zod, Vitest.

## 도메인 기반 폴더 구조 (최우선 규칙)

### 구조 개요

```
src/
├── app/          # Next.js App Router — 라우팅만 담당
├── domain/       # 도메인 기반 기능 모듈 (핵심)
├── common/       # 3개+ 도메인에서 사용하는 범용 UI
├── api/          # API 클라이언트 (도메인별)
├── hooks/        # 3개+ 도메인에서 사용하는 공유 훅
├── store/        # Zustand 전역 스토어
├── types/        # 공유 타입
├── utils/        # 3개+ 도메인에서 사용하는 공유 유틸
└── schema.ts     # 중앙 Zod 스키마
```

### 파일 배치 규칙

1. **단일 도메인 전용** → `domain/{도메인}/` 안에 배치
2. **인접 2~3개 도메인 공유** → 상위/핵심 도메인 폴더에 배치
3. **3개+ 도메인에서 범용 사용** → `common/`, `hooks/`, `utils/`

### 도메인 폴더 내부

```
domain/{기능}/
├── {ComponentName}.tsx     # 루트 컴포넌트
├── section/                # 페이지 섹션
├── ui/                     # 도메인 전용 UI
├── hooks/                  # 도메인 전용 훅
├── utils/                  # 도메인 전용 유틸
└── {하위기능}/              # 서브 기능 폴더
```

### 현재 도메인 목록

about, admin, auth, blog, career-board, challenge, faq, home, mypage, program, program-recommend, report, review

### 금지 패턴

- 도메인 간 직접 import (`domain/A/` → `domain/B/`) 금지
- 타입별 flat 구조 금지 (모든 컴포넌트를 `src/components/`에 넣지 않음)
- 순환 의존 금지
- 기존 파일 불필요한 이동 금지

### 의존 방향

`common/hooks/utils` ← `domain/` ← `app/` (역방향 금지)

## 코딩 스타일

- PascalCase: 컴포넌트 (`ProgramCard.tsx`)
- camelCase: 함수/변수 (`useProgramStore`)
- kebab-case: 라우트 폴더 (`program-detail/`)
- UPPER_SNAKE_CASE: 상수 (`ANIMATION_DELAY_MS`)
- 함수형/선언적 프로그래밍, class 금지
- `'use client'`, `useEffect`, `setState` 최소화 — RSC 우선
- Prettier: 2 spaces, semicolons, single quotes, width 80

## 코드 품질 (Toss Frontend Fundamentals)

1. **가독성** — 매직넘버 네이밍, 위에서 아래로 읽히는 코드, 복잡한 조건에 이름 부여
2. **예측 가능성** — 일관된 반환 타입, 숨겨진 부수 효과 없음
3. **응집도** — 함께 수정되는 코드는 같은 위치에
4. **결합도** — 성급한 추상화보다 적절한 중복. 영향 범위 최소화

## 성능 (Vercel React Best Practices)

- `Promise.all()` for independent async (워터폴 제거)
- barrel file import 지양
- 무거운 컴포넌트 dynamic import
- 서드파티 지연 로딩

## 커밋

- **한국어**, Conventional Commits (`feat:`, `fix:`, `refactor:` 등), 72자 이내

---

## 상세 규칙 참조 (반드시 함께 읽을 것)

코드 작성 및 리뷰 시, 아래 파일들의 상세 규칙도 함께 따른다:

| 파일 | 내용 |
|---|---|
| `.cursor/rules/toss-frontend.mdc` | Toss Frontend Fundamentals 상세 코드 예시 (매직넘버, 가드패턴, 조건부렌더링, Form Cohesion, Props Drilling, 추상화 등) |
| `.cursor/rules/full-stack-rule.mdc` | 풀스택 개발 프랙티스 (RSC, 에러 핸들링, 최적화, 테스트 등) |
| `.cursor/rules/domain-folder-structure.mdc` | 도메인 기반 폴더 구조 상세 규칙 |
| `.cursor/rules/commit-convention.mdc` | 커밋 메시지 컨벤션 상세 |
| `.github/skills/vercel-react-best-practices/AGENTS.md` | Vercel React 성능 최적화 40+ 규칙 상세 |

**이 문서의 요약과 위 상세 파일이 충돌할 경우, 상세 파일의 내용을 따른다.**
