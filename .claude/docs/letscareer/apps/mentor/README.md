# mentor 앱 (`@letscareer/mentor`)

멘토 본인용 마이페이지. Vite + React SPA. 가장 작은 앱 (단일 도메인).

## 라우팅

`apps/mentor/src/router.tsx`에서 정의. 인증된 멘토만 접근. SSO hash로 web에서 토큰 전달받음 ([`../../pnpm전환 메모 폴더/03-domain-routing.md`](../../pnpm전환%20메모%20폴더/03-domain-routing.md)).

## 도메인 (`apps/mentor/src/domain/`)

| 도메인 | 설명 |
|---|---|
| program | 멘토가 담당하는 프로그램 — 일정·수강생·정산·자료 등 |

## 로컬 모듈

| 위치 | 내용 |
|---|---|
| `apps/mentor/src/common/` | 멘토 전용 공용 컴포넌트 (`alert/`, `button/`, `career/`, `lexical/`, `loading/`, `modal/`) |
| `apps/mentor/src/hooks/` | 멘토 전용 훅 |
| `apps/mentor/src/api/` | 멘토 API 호출 |
| `apps/mentor/src/utils/` | 멘토 전용 유틸 |
| `apps/mentor/src/store/` | zustand 스토어 |
| `apps/mentor/src/guards/` | 라우트 권한 가드 |

> 공유 모듈(`@letscareer/*`)은 [`../../packages/`](../../packages/) 참조.

## 핵심 메타 파일

- [`.env.example`](../../../../../apps/mentor/.env.example) — 환경변수 키
- [`vite.config.ts`](../../../../../apps/mentor/vite.config.ts) — Vite 설정
- `vercel.json` — SPA fallback rewrite
