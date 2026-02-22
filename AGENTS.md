# Repository Guidelines

> 이 문서는 모든 AI 에이전트(Codex, Copilot, GPT 등)가 따라야 할 프로젝트 규칙입니다.

## Project Structure & Module Organization

- Root: Next.js 15 app with TypeScript, Tailwind, Vitest.
- `src/app`: App Router pages/layouts (routing only).
- `src/domain`: Domain-based feature modules (primary code location).
- `src/common`: Shared UI components used across 3+ domains.
- `src/api`: API clients organized by domain.
- `src/hooks`: Shared hooks used across 3+ domains.
- `src/store`: Zustand stores.
- `src/utils`, `src/types`: Shared utilities and types.
- `src/lib`: Library configurations (dayjs, etc.).
- `src/context`: React Context providers.
- `src/schema.ts`: Central Zod schemas.
- `public/`: Static assets (icons, logos, images).

---

## Domain-Based Folder Structure (CRITICAL — Must Follow)

### Core Principle

**코드는 도메인(기능) 기반으로 구성한다. 파일 타입별(components/, hooks/ 등) flat 구조를 사용하지 않는다.**

### File Placement Decision Flow

When creating a new file, follow this decision order:

#### Step 1: Is it used by only one domain?
→ Place inside `src/domain/{domain}/`

#### Step 2: Shared by 2-3 adjacent domains?
→ Place in the **parent or primary domain** folder
- Example: shared by `program` and `challenge` → put in `domain/program/`
- Example: shared by `mypage` and `review` → put in `domain/mypage/`

#### Step 3: Used by 3+ unrelated domains?
→ Place in `src/common/` (UI), `src/hooks/` (hooks), or `src/utils/` (utilities)

### Domain Folder Internal Structure

```
domain/{feature}/
├── {ComponentName}.tsx         # Root-level components
├── section/                    # Page section components
├── ui/                         # Domain-specific UI components
├── hooks/                      # Domain-specific hooks
├── utils/                      # Domain-specific utilities
├── modal/                      # Domain-specific modals
└── {sub-feature}/              # Sub-feature folders
```

### Current Domains

```
src/domain/
├── about/              # About pages
├── admin/              # Admin panel features
├── auth/               # Authentication UI
├── blog/               # Blog features
├── career-board/       # Career board
├── challenge/          # Challenge (micro-learning)
├── faq/                # FAQ
├── home/               # Homepage sections
├── mypage/             # User profile & dashboard
├── program/            # Program listing & details
├── program-recommend/  # Program recommendation
├── report/             # Report features
└── review/             # Review system
```

### Prohibited Patterns

1. **No cross-domain imports**: `domain/A/` must NOT import from `domain/B/`
2. **No type-based flat structure**: Don't dump all components in `src/components/`
3. **No circular dependencies**: Domain A → B → A is forbidden
4. **Minimize file movement**: Respect existing structure; apply rules to new files only

### Delete-Friendly Code

A domain folder should be deletable without affecting other domains:
- Domain-specific code lives inside its domain folder
- Prefer duplication over premature shared abstraction
- Verify necessity before creating shared code

### Dependency Direction

```
common / hooks / utils (shared layer)
        ↑
domain/{each domain} (business logic)
        ↑
app/ (routing, page assembly)
```

Upper layers reference lower layers. Never reverse.

---

## Build, Test, and Development Commands

- `npm run dev`: Start local dev server (Turbopack).
- `npm run build`: Production build via Next.js.
- `npm start`: Serve the production build.
- `npm run test`: Run Vitest tests.
- `npm run typecheck`: TypeScript check without emit.
- `npm run lint`: ESLint with Next.js/TypeScript config.

## Coding Style & Naming Conventions

- Formatting: Prettier (2 spaces, semicolons, single quotes, width 80).
- Linting: ESLint flat config (`eslint.config.mjs`).
- Tailwind: Class order enforced by `prettier-plugin-tailwindcss`.
- Naming: PascalCase for components (`ProgramDetailNavigation.tsx`), camelCase for functions/variables, kebab-case for route folders.
- Constants: UPPER_SNAKE_CASE (`ANIMATION_DELAY_MS`).

## Code Quality Principles (Toss Frontend Fundamentals)

1. **Readability**: Minimize contexts per code block, top-to-bottom flow, name magic numbers.
2. **Predictability**: Consistent return types, no hidden side effects, descriptive names.
3. **Cohesion**: Code that changes together lives together (colocation).
4. **Coupling**: Minimize impact scope. Allow duplication over premature abstraction.

## Key Patterns

- Functional/declarative programming only — no classes.
- Minimize `'use client'`, `useEffect`, `setState` — prefer RSC.
- Error handling: early return, guard clauses.
- Schema validation: Zod.
- API hooks: Return TanStack Query's `UseQueryResult` consistently.
- Forms: React Hook Form + Zod resolver.
- Use composition over props drilling.
- Separate complex conditional rendering into distinct components.

## Performance (Vercel React Best Practices)

- **CRITICAL**: Use `Promise.all()` for independent async operations.
- **CRITICAL**: Avoid barrel file imports — import directly from source.
- **CRITICAL**: Use dynamic imports for heavy components.
- **HIGH**: Defer third-party library loading.
- **HIGH**: Minimize serialization at RSC boundaries.

## Testing Guidelines

- Framework: Vitest (`vitest.config.ts`).
- Location: Co-locate tests with code using `*.test.ts(x)`.
- Style: Prefer pure-function tests and API client smoke tests.

## Commit & Pull Request Guidelines

- Commits: `<type>: <subject>` — types: feat, fix, docs, style, refactor, test, chore.
- **Commit messages in Korean.**
- PRs: Link related issues, include summary and screenshots for UI changes.
- Ensure lint, typecheck, and tests pass before PR.

## Security & Configuration

- Env: Use `.env.local` (never commit).
- Required: `NEXT_PUBLIC_SERVER_API`, optional Firebase keys.
- Do not include secrets in client code or VCS history.

---

## Detailed Rule References (Must Also Follow)

When writing or reviewing code, also follow the detailed rules in these files:

| File | Content |
|---|---|
| `.cursor/rules/toss-frontend.mdc` | Toss Frontend Fundamentals detailed code examples (magic numbers, guard patterns, conditional rendering, form cohesion, props drilling, abstraction) |
| `.cursor/rules/full-stack-rule.mdc` | Full-stack development practices (RSC, error handling, optimization, testing) |
| `.cursor/rules/domain-folder-structure.mdc` | Domain-based folder structure detailed rules |
| `.cursor/rules/commit-convention.mdc` | Commit message convention details |
| `.github/skills/vercel-react-best-practices/AGENTS.md` | Vercel React performance optimization 40+ detailed rules |
| `.github/skills/vercel-react-best-practices/SKILL.md` | Vercel rules quick reference index |

**If summaries in this document conflict with the detailed files above, follow the detailed files.**
