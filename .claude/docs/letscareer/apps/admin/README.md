# admin 앱 (`@letscareer/admin`)

운영자용 어드민 콘솔. Vite + React SPA.

## 라우팅

`apps/admin/src/router.tsx`에서 React Router 기반 라우트 정의. 인증된 운영자만 접근.

## 도메인 (`apps/admin/src/domain/`)

총 18개 도메인 — web과 거의 1:1 대응되며 같은 백엔드 리소스를 *관리* 관점에서 다룬다.

| 도메인 | 설명 |
|---|---|
| about | 회사·서비스 소개 콘텐츠 관리 |
| admin | 어드민 자체 관리 (관리자 계정·권한) |
| auth | 어드민 로그인 |
| blog | 블로그 글 발행·편집 |
| career-board | 커리어 보드 게시글 관리 |
| challenge | 챌린지 생성·관리·결제 통계 |
| challenge-feedback | 피드백 콘텐츠 관리 |
| community | 커뮤니티 글·댓글 모더레이션 |
| curation | 큐레이션 추천 규칙·콘텐츠 관리 |
| faq | FAQ 항목 관리 |
| home | 홈 배너·섹션 큐레이션 |
| library | 자료 업로드·관리 |
| mentor | 멘토 등록·정산·관리 |
| mypage | 운영자 본인 프로필 |
| program | 프로그램(라이브·VOD·가이드북) 관리 |
| program-recommend | 추천 규칙 관리 |
| report | 리포트 발행·관리 |
| review | 리뷰 검수·답글 |

## 로컬 모듈

| 위치 | 내용 |
|---|---|
| `apps/admin/src/common/` | 어드민 전용 공용 컴포넌트 |
| `apps/admin/src/hooks/` | 어드민 전용 훅 (`useMentorAccessControl`, `useDeleteProgram` 등) |
| `apps/admin/src/api/` | 어드민 API 호출 |
| `apps/admin/src/utils/` | 어드민 전용 유틸 |
| `apps/admin/src/layout/`, `pages/`, `router.tsx` | SPA 라우팅·레이아웃 |
| `apps/admin/src/store/`, `reducers/` | 상태 관리 (zustand + 일부 reducer 패턴) |
| `apps/admin/src/guards/` | 라우트 권한 가드 |

> 공유 모듈(`@letscareer/*`)은 [`../../packages/`](../../packages/) 참조. 어드민 전용으로 MUI X DataGrid Pro를 사용해 데이터 그리드를 구현한다.

## 핵심 메타 파일

- [`.env.example`](../../../../../apps/admin/.env.example) — 환경변수 키 (`VITE_MUI_X_LICENSE_KEY` 포함)
- [`vite.config.ts`](../../../../../apps/admin/vite.config.ts) — Vite + SVGR 플러그인
- [`vercel.json`](../../../../../apps/admin/vercel.json) — SPA fallback rewrite
