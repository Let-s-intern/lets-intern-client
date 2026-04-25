# pnpm 전환 메모

> Keywords: monorepo, pnpm, turborepo, vercel, ci, deployment

npm → pnpm 전환에 따라 정리한 운영 문서 모음. 모노레포 구조, 빌드 파이프라인, Vercel 배포, 도메인 라우팅까지 한 곳에서 추적할 수 있도록 주제별로 분리해 두었다.

## 문서 인덱스

| 문서 | 다루는 범위 |
|---|---|
| [01-monorepo-structure.md](./01-monorepo-structure.md) | apps/packages/config 레이아웃, workspace 의존성, 빌드 의존 그래프 |
| [02-pnpm-setup.md](./02-pnpm-setup.md) | pnpm 설치 (Corepack 권장), 락파일 정책, approve-builds, 일상 명령 |
| [03-domain-routing.md](./03-domain-routing.md) | 서브도메인 토폴로지, middleware 리다이렉트, SSO hash, env fallback 메커니즘 |
| [04-vercel-deployment.md](./04-vercel-deployment.md) | 3개 Vercel 프로젝트 분리 설정, Ignored Build Step, 환경변수, SPA rewrite |
| [05-build-test-ci.md](./05-build-test-ci.md) | Turborepo 캐시·필터, GitHub Actions 4개 워크플로우, 빌드 격리 |
| [06-deployment-guide.md](./06-deployment-guide.md) | 단계별 배포 절차, 롤백, 트러블슈팅 |

## 빠른 의사결정 표

| 질문 | 가야 할 문서 |
|---|---|
| pnpm 어떻게 설치하지? | [02](./02-pnpm-setup.md) |
| 어드민 사이트 안 뜨는데 어떻게 됨? | [03](./03-domain-routing.md) (env fallback 메커니즘) |
| 새 Vercel 프로젝트 어떻게 만듦? | [04](./04-vercel-deployment.md) |
| CI에서 빌드 왜 도는지/안 도는지? | [05](./05-build-test-ci.md) |
| 배포 직전 체크리스트 | [06](./06-deployment-guide.md) |
| 모노레포 구조 자체가 궁금 | [01](./01-monorepo-structure.md) |

## 도메인 표기 약속

운영/테스트 도메인 문자열은 이 문서들에서 모두 placeholder로 적는다.

| Placeholder | 의미 |
|---|---|
| `<운영 도메인>` | web 운영 도메인 |
| `<어드민 운영 도메인>` | admin 운영 서브도메인 |
| `<멘토 운영 도메인>` | mentor 운영 서브도메인 |
| `<테스트 도메인>` | web 테스트(스테이징) 도메인 |
| `<어드민 테스트 도메인>` | admin 테스트 서브도메인 |
| `<멘토 테스트 도메인>` | mentor 테스트 서브도메인 |
| `<API 호스트>` | 백엔드 API 호스트 |
