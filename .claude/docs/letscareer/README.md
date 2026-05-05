# 렛츠커리어 프로젝트 문서

pnpm workspace + Turborepo 기반 모노레포의 운영·아키텍처·도메인 문서. 폴더 구조가 실제 코드 토폴로지(`apps/*` + `packages/*`)와 1:1 대응되도록 정리되어 있다.

## 문서 폴더 구조

```
.claude/docs/letscareer/
├── README.md                            # 이 파일 (문서 인덱스)
├── architecture.md                      # 시스템 아키텍처 개요 (한 페이지 지도)
│
├── tech-stack/
│   └── README.md                        # 라이브러리 버전·설정 인벤토리
│
├── API_docs/
│   ├── swagger_url.md                   # Swagger API 문서 URL
│   └── orval.md                         # orval 인프라 운영 가이드 (spec → generated)
│
├── apps/                                # 앱별 도메인·로컬 모듈 가이드
│   ├── README.md                        # 3개 앱 비교 표
│   ├── web/                             # apps/web (Next.js 사용자 사이트)
│   │   ├── README.md                    # 18개 도메인 개요
│   │   ├── components.md                # web/src/common 컴포넌트
│   │   ├── hooks.md                     # web/src/hooks 훅
│   │   ├── services.md                  # web/src/api·utils 서비스
│   │   └── domain/                      # 18개 도메인 (각 폴더에 README.md)
│   │       ├── about/                   # 회사·서비스 소개
│   │       ├── admin/                   # web fallback 라우트
│   │       ├── auth/                    # 로그인·회원가입
│   │       ├── blog/                    # 블로그
│   │       ├── career-board/            # 커리어 보드
│   │       ├── challenge/               # 챌린지
│   │       ├── challenge-feedback/      # 챌린지 피드백
│   │       ├── community/               # 커뮤니티 (Yjs 협업)
│   │       ├── curation/                # 맞춤 추천 (+ flow-map.md)
│   │       ├── faq/                     # 자주 묻는 질문
│   │       ├── home/                    # 홈
│   │       ├── library/                 # 자료 라이브러리
│   │       ├── mentor/                  # 멘토 섹션 (+ design-system.md)
│   │       ├── mypage/                  # 마이페이지
│   │       ├── program/                 # 프로그램
│   │       ├── program-recommend/       # 프로그램 추천
│   │       ├── report/                  # 리포트
│   │       └── review/                  # 리뷰
│   ├── admin/                           # apps/admin (Vite 어드민 SPA)
│   │   └── README.md                    # 18개 도메인 개요
│   └── mentor/                          # apps/mentor (Vite 멘토 SPA)
│       └── README.md                    # 단일 program 도메인
│
├── packages/                            # 공유 패키지 가이드
│   ├── README.md                        # 7개 패키지 개요·import 패턴
│   ├── api.md                           # @letscareer/api
│   ├── hooks.md                         # @letscareer/hooks
│   ├── store.md                         # @letscareer/store
│   ├── ui.md                            # @letscareer/ui
│   ├── utils.md                         # @letscareer/utils
│   ├── types.md                         # @letscareer/types
│   └── config.md                        # eslint/prettier/tailwind/tsconfig
│
└── pnpm전환 메모 폴더/                    # pnpm 전환·운영 메모
    ├── README.md                        # 인덱스 + 빠른 의사결정 표
    ├── 01-monorepo-structure.md         # 워크스페이스·^build 의존 그래프
    ├── 02-pnpm-setup.md                 # Corepack·frozen-lockfile·일상 명령
    ├── 03-domain-routing.md             # 미들웨어 308·SSO hash·env fallback
    ├── 04-vercel-deployment.md          # 3개 Vercel 프로젝트·Skip Unaffected Projects
    ├── 05-build-test-ci.md              # Turbo·GitHub Actions·캐시 무효화
    └── 06-deployment-guide.md           # 단계별 배포·롤백·트러블슈팅
```

## 빠른 진입점

| 알고 싶은 것 | 가야 할 곳 |
|---|---|
| 시스템 전체 그림 | [`architecture.md`](./architecture.md) |
| 어느 앱 / 어느 도메인 | [`apps/`](./apps/) |
| 공유 패키지의 import 방법 | [`packages/README.md`](./packages/README.md) |
| 라이브러리 버전·설정 | [`tech-stack/README.md`](./tech-stack/README.md) |
| 모노레포 구조·^build 그래프 | [`pnpm전환 메모 폴더/01-monorepo-structure.md`](./pnpm전환%20메모%20폴더/01-monorepo-structure.md) |
| pnpm 설치·실행 | [`pnpm전환 메모 폴더/02-pnpm-setup.md`](./pnpm전환%20메모%20폴더/02-pnpm-setup.md) |
| 도메인 라우팅·SSO 메커니즘 | [`pnpm전환 메모 폴더/03-domain-routing.md`](./pnpm전환%20메모%20폴더/03-domain-routing.md) |
| Vercel 배포 설정 | [`pnpm전환 메모 폴더/04-vercel-deployment.md`](./pnpm전환%20메모%20폴더/04-vercel-deployment.md) |
| 빌드·CI 동작 | [`pnpm전환 메모 폴더/05-build-test-ci.md`](./pnpm전환%20메모%20폴더/05-build-test-ci.md) |
| 단계별 배포·롤백·트러블슈팅 | [`pnpm전환 메모 폴더/06-deployment-guide.md`](./pnpm전환%20메모%20폴더/06-deployment-guide.md) |
| API 명세 | [`API_docs/swagger_url.md`](./API_docs/swagger_url.md) |
| orval 코드 생성 (spec → generated) | [`API_docs/orval.md`](./API_docs/orval.md) |

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
