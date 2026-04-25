# Lets Career Client

렛츠커리어 프론트엔드 모노레포. pnpm workspace + Turborepo 기반 3개 앱 (Next.js + Vite × 2).

## 사전 요구사항

- Node.js >= 18.17 (권장: 20.x)
- pnpm >= 10 — `package.json`의 `packageManager: "pnpm@10.33.0"` 강제. Corepack 권장.

## 빠른 시작

```bash
# 1. pnpm 활성화 (Corepack)
corepack enable
corepack prepare pnpm@10.33.0 --activate

# 2. 의존성 설치
pnpm install --frozen-lockfile

# 3. 환경변수 (각 앱의 .env.example 참고해 값 채우기)
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env
cp apps/mentor/.env.example apps/mentor/.env

# 4. 개발 서버
pnpm dev:web      # http://localhost:3000  (Next.js)
pnpm dev:admin    # http://localhost:3001  (Vite)
pnpm dev:mentor   # http://localhost:3002  (Vite)
pnpm dev          # 3개 동시
```

## 빌드·검증

```bash
pnpm build         # 또는 build:web / build:admin / build:mentor
pnpm lint          # 또는 lint:web / lint:admin / lint:mentor
pnpm typecheck     # 또는 typecheck:web / typecheck:admin / typecheck:mentor
pnpm test
pnpm clean         # 빌드 산출물·node_modules·.turbo 삭제
```

## 문서

운영·아키텍처·도메인 문서는 [`.claude/docs/letscareer/`](./.claude/docs/letscareer/) 에 정리되어 있다. `.claude/` 전반 구조는 [`.claude/README.md`](./.claude/README.md) 참고.

```
.claude/docs/letscareer/
├── README.md                            # 프로젝트 전체 개요·문서 인덱스
├── architecture.md                      # 시스템 아키텍처 개요 (한 페이지 지도)
│
├── tech-stack/
│   └── README.md                        # 라이브러리 버전·설정 인벤토리
│
├── API_docs/
│   └── swagger_url.md                   # Swagger API 문서 URL
│
├── apps/                                # 앱별 도메인·로컬 모듈 가이드
│   ├── README.md                        # 3개 앱 비교 표
│   ├── web/                             # apps/web (Next.js 사용자 사이트)
│   │   ├── README.md                    # 18개 도메인 개요
│   │   ├── components.md                # web/src/common 컴포넌트
│   │   ├── hooks.md                     # web/src/hooks 훅
│   │   ├── services.md                  # web/src/api·utils 서비스
│   │   └── domain/                      # 18개 도메인 폴더 (각 README.md)
│   ├── admin/
│   │   └── README.md                    # apps/admin 18개 도메인 개요
│   └── mentor/
│       └── README.md                    # apps/mentor (단일 program 도메인)
│
├── packages/                            # 공유 패키지 가이드 (@letscareer/*)
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
    ├── 04-vercel-deployment.md          # 3개 Vercel 프로젝트·Ignored Build Step
    ├── 05-build-test-ci.md              # Turbo·GitHub Actions·캐시 무효화
    └── 06-deployment-guide.md           # 배포·롤백·트러블슈팅
```
