# 앱별 문서

3개 앱(`web`, `admin`, `mentor`) 각각의 도메인·로컬 모듈 가이드. 3개 앱이 공유하는 모듈은 [`../packages/`](../packages/) 참조.

| 앱 | 프레임워크 | dev 포트 | 운영 도메인 | 도메인 수 | 문서 |
|---|---|---|---|---|---|
| **web** | Next.js 15 (App Router, Turbopack) | 3000 | `<운영 도메인>` | 18 | [web/README.md](./web/README.md) |
| **admin** | Vite + React (SPA) | 3001 | `<어드민 운영 도메인>` | 18 | [admin/README.md](./admin/README.md) |
| **mentor** | Vite + React (SPA) | 3002 | `<멘토 운영 도메인>` | 1 | [mentor/README.md](./mentor/README.md) |

3개 앱은 같은 백엔드 API를 바라보고 같은 사용자 계정을 SSO로 공유한다. 시스템 전체 아키텍처는 [`../architecture.md`](../architecture.md), 도메인 라우팅·SSO 메커니즘은 [`../pnpm전환 메모 폴더/03-domain-routing.md`](../pnpm전환%20메모%20폴더/03-domain-routing.md) 참조.
