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
├── common/                              # 공용 모듈 가이드
│   ├── README.md                        # 통합 가이드 (사용 원칙·import 경로)
│   ├── components.md                    # 공용 컴포넌트 (Button·Modal·Layout 등)
│   ├── hooks.md                         # 커스텀 훅 (useMounted·useScrollDirection 등)
│   └── services.md                      # API 서비스·React Query 훅
│
├── domain/                              # 도메인별 아키텍처
│   ├── challenge-detail/README.md       # 챌린지 상세
│   ├── challenge-feedback/README.md     # 챌린지 피드백
│   ├── community/README.md              # 커뮤니티
│   ├── curation/                        # 큐레이션
│   │   ├── README.md
│   │   └── flow-map.md                  # 큐레이션 플로우 맵
│   └── mentor/
│       └── design-system.md             # 멘토 디자인 시스템
│
├── curation-domain/                     # 큐레이션 도메인 (확장)
│   ├── README.md
│   └── flow-map.md
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
