# Repository Guidelines

## Project Structure & Module Organization
- Root: Next.js 15 app with TypeScript, Tailwind, Vitest.
- `src/app`: App Router pages/layouts (primary entry).
- `src/components`, `src/hooks`, `src/context`: UI and React logic.
- `src/api`: API clients; base URL from `NEXT_PUBLIC_SERVER_API`.
- `src/store`: Zustand stores; `src/reducers` for legacy reducers.
- `src/utils`, `src/types`: Utilities and shared types.
- `src/router-pages`: Legacy/admin views; keep changes minimal.
- `public/`: Static assets (icons, logos, images).

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server (Turbopack).
- `npm run build`: Production build via Next.js.
- `npm start`: Serve the production build.
- `npm run test`: Run Vitest tests.
- `npm run typecheck`: TypeScript check without emit.
- `npm run lint`: ESLint with Next.js/TypeScript config.

## Coding Style & Naming Conventions
- Formatting: Prettier (2 spaces, semicolons, single quotes, width 80). Run `prettier --check .` if needed.
- Linting: ESLint flat config (`eslint.config.mjs`); most rules warn—fix warnings before PR.
- Tailwind: Class order enforced by `prettier-plugin-tailwindcss`.
- Naming: PascalCase for components (`ProgramDetailNavigation.tsx`), camelCase for functions/variables, kebab-case for files that are routes.

## Testing Guidelines
- Framework: Vitest (`vitest.config.ts`), loads `.env` and `.env.local`.
- Location: Co-locate tests with code or under `src/` using `*.test.ts(x)`.
- Style: Prefer pure-function tests and API client smoke tests with mocked fetch/axios.
- Example: `src/schema.test.ts` (WIP placeholders); add real assertions when endpoints stabilize.

## Commit & Pull Request Guidelines
- Commits: Conventional header `<type>: <subject>`; types: feat, fix, docs, style, refactor, test, chore. Messages in Korean (see `.cursor/rules/commit-convention.mdc`).
- PRs: Link related issues in "연관 작업"; include summary, screenshots for UI, and notes on breaking changes. Ensure lint, typecheck, and tests pass.

## Security & Configuration Tips
- Env: Use `.env.local` (never commit). Required: `NEXT_PUBLIC_SERVER_API`, optional Firebase keys.
- Next Images: Domains configured in `next.config.mjs`; add new domains via PR.
- Do not include secrets in client code or VCS history.

