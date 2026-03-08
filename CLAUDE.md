# Project Rules — Let's Intern Client

> 이 문서는 모든 AI 도구(Claude, Cursor, Copilot, Gemini, Antigravity 등)가 따라야 할 프로젝트 핵심 규칙입니다.

## Tech Stack

- Next.js 15 (App Router), React 18, TypeScript
- Tailwind CSS, Shadcn UI, Radix UI, MUI
- Zustand (상태관리), TanStack React Query (데이터 페칭)
- React Hook Form + Zod (폼/검증)
- Vitest (테스트)

## Commands

- `npm run dev` — 개발 서버 (Turbopack)
- `npm run build` — 프로덕션 빌드
- `npm run test` — Vitest 테스트
- `npm run typecheck` — TypeScript 타입 체크
- `npm run lint` — ESLint

---

## 핵심 원칙: 좋은 코드 = 수정하기 쉬운 코드

> Toss Frontend Fundamentals 기반. 모든 설계 결정은 "이 코드를 수정하기 쉬운가?"를 기준으로 판단한다.

### 4가지 평가 기준

1. **가독성(Readability)** — 한 번에 고려할 맥락을 줄이고, 위에서 아래로 자연스럽게 읽히는 코드
2. **예측 가능성(Predictability)** — 이름, 파라미터, 반환값만으로 동작을 예측할 수 있는 코드
3. **응집도(Cohesion)** — 함께 수정되는 코드는 반드시 같은 위치에 배치
4. **결합도(Coupling)** — 수정 영향 범위를 최소화. 불필요한 추상화보다 적절한 중복이 나을 수 있음

---

## 폴더 구조 규칙 (최우선 규칙)

### 프로젝트 구조 개요

```
src/
├── app/                    # Next.js App Router (라우팅 전용)
│   ├── (auth)/             # 인증 관련 라우트 그룹
│   ├── (user)/             # 사용자 향 라우트 그룹
│   ├── admin/              # 어드민 라우트
│   └── api/                # API 라우트
│
├── domain/                 # 도메인 기반 기능 모듈 (핵심)
│   ├── about/
│   ├── admin/
│   ├── auth/
│   ├── blog/
│   ├── career-board/
│   ├── challenge/
│   ├── faq/
│   ├── home/
│   ├── mypage/
│   ├── program/
│   ├── program-recommend/
│   ├── report/
│   └── review/
│
├── common/                 # 완전히 범용적인 공유 컴포넌트
├── api/                    # API 클라이언트 (도메인별 정리)
├── hooks/                  # 공유 훅
├── store/                  # Zustand 전역 스토어
├── types/                  # 공유 타입 정의
├── utils/                  # 공유 유틸리티
├── lib/                    # 라이브러리 설정 (dayjs 등)
├── context/                # React Context 프로바이더
├── schema.ts               # 중앙 Zod 스키마
└── assets/                 # 정적 리소스
```

### 도메인 폴더 내부 구조

```
domain/{도메인명}/
├── {ComponentName}.tsx         # 루트 레벨 컴포넌트
├── section/                    # 페이지 섹션 컴포넌트
├── ui/                         # 도메인 전용 UI 컴포넌트
├── hooks/                      # 도메인 전용 훅
├── utils/                      # 도메인 전용 유틸리티
├── modal/                      # 도메인 전용 모달
└── {하위기능}/                  # 하위 기능별 서브폴더
```

### 파일 배치 결정 플로우차트 (반드시 따를 것)

새 파일을 생성하거나 기존 파일을 이동할 때, 다음 순서로 판단:

#### 1단계: 단일 도메인 전용인가?
- **YES** → `src/domain/{해당도메인}/` 에 배치
- **NO** → 2단계로

#### 2단계: 2~3개 인접 도메인이 공유하는가?
- **YES** → 공유하는 도메인들의 **공통 상위 도메인** 또는 **더 핵심적인 도메인** 폴더에 배치
  - 예: `program`과 `challenge`가 공유 → `domain/program/` 에 배치 (program이 상위 개념)
  - 예: `mypage`와 `review`가 공유 → `domain/mypage/` 에 배치 (mypage가 호스트 역할)
- **NO** → 3단계로

#### 3단계: 3개 이상의 도메인 또는 완전히 다른 맥락에서 사용되는가?
- **YES** → `src/common/` (UI 컴포넌트), `src/hooks/` (훅), `src/utils/` (유틸)에 배치
- **NO** → 1단계부터 다시 확인

### 절대 금지 사항

- **파일 타입별 flat 구조 금지**: 모든 컴포넌트를 `src/components/`에 넣지 않는다
- **도메인 간 직접 import 금지**: `domain/A/`에서 `domain/B/`를 직접 import하지 않는다. 공유가 필요하면 상위 도메인이나 common으로 올린다
- **순환 의존 금지**: 도메인 간 순환 참조를 만들지 않는다
- **불필요한 파일 이동 금지**: 기존 파일의 위치를 바꾸기보다는 현재 구조를 존중하고, 새 파일에 대해서만 규칙을 적용한다

### 파일 삭제 용이성 원칙

도메인 폴더를 통째로 삭제해도 다른 도메인에 영향이 없어야 한다.
이를 위해:
- 도메인 전용 코드는 해당 도메인 폴더 안에 둔다
- 공유 코드를 만들기 전에 "정말 공유가 필요한가?"를 먼저 확인한다
- 성급한 추상화보다 적절한 중복이 낫다

---

## 코딩 스타일

### 네이밍
- 컴포넌트 파일: **PascalCase** (`ProgramDetailNavigation.tsx`)
- 함수/변수: **camelCase** (`useProgramStore`, `formatDateString`)
- 라우트 폴더: **kebab-case** (`program-detail/`)
- 상수: **UPPER_SNAKE_CASE** (`ANIMATION_DELAY_MS`)

### 포매팅
- Prettier: 2 spaces, semicolons, single quotes, width 80
- Tailwind 클래스 순서: `prettier-plugin-tailwindcss`

### 패턴
- 함수형/선언적 프로그래밍, class 사용 금지
- `'use client'`, `useEffect`, `setState` 최소화 — RSC 우선
- 에러 핸들링: early return, guard clause 패턴
- 스키마 검증: Zod 사용
- API 훅: TanStack React Query의 UseQueryResult를 일관되게 반환

### 커밋 메시지
- **한국어**로 작성
- Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- 72자 이내 (최대 100자)

---

## 코드 품질 체크리스트 (Toss Frontend Fundamentals)

코드 작성/리뷰 시 확인:

- [ ] 매직 넘버에 이름을 부여했는가?
- [ ] 복잡한 조건문에 의미 있는 이름을 붙였는가?
- [ ] 함수가 이름에서 암시하는 동작만 수행하는가? (숨겨진 부수 효과 없는지)
- [ ] 비슷한 함수/훅이 일관된 반환 타입을 사용하는가?
- [ ] 함께 수정될 코드가 같은 위치에 있는가? (응집도)
- [ ] 조건부 렌더링이 복잡하면 별도 컴포넌트로 분리했는가?
- [ ] 성급한 추상화 대신 적절한 중복을 허용했는가?
- [ ] Props drilling 대신 컴포지션 패턴을 사용했는가?
- [ ] 상태 관리 훅이 필요한 만큼만 좁은 범위를 가지는가?

---

## Vercel React Best Practices (성능 최적화)

우선순위별 핵심 규칙:

### CRITICAL
- 독립적인 비동기 작업은 `Promise.all()` 사용 (워터폴 제거)
- barrel file (`index.ts`에서 re-export) import 지양 — 트리셰이킹 방해
- 무거운 컴포넌트는 `dynamic import` 사용

### HIGH
- 서드파티 라이브러리 지연 로딩
- RSC 경계에서 직렬화 최소화
- `React.cache()`로 요청당 데이터 중복 제거

### MEDIUM
- `useMemo`/`useCallback`은 실제 성능 문제가 있을 때만
- 파생 상태는 state가 아닌 계산으로 처리
- `startTransition`으로 비긴급 업데이트 처리

---

## 테스트
- Vitest 사용, 소스 코드와 같은 위치에 `*.test.ts(x)` 배치
- 순수 함수 테스트와 API 클라이언트 스모크 테스트 우선

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
| `.github/skills/vercel-react-best-practices/SKILL.md` | Vercel 규칙 빠른 참조 인덱스 |

**이 문서의 요약과 위 상세 파일이 충돌할 경우, 상세 파일의 내용을 따른다.**
