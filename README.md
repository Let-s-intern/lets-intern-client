# Lets Career Client

렛츠커리어 프론트엔드 모노레포. pnpm workspace + Turborepo 기반의 3개 앱.

## ⚡ 한눈에 보기

### pnpm 실행 (Corepack 권장)

이 저장소는 pnpm 10을 강제합니다 (`package.json`의 `packageManager: "pnpm@10.33.0"`). Node 16.10+에 내장된 **Corepack**으로 활성화하는 게 가장 확실합니다 — 선언된 버전을 자동으로 다운로드/고정하므로 락파일 충돌을 막아줍니다.

```bash
# 한 번만: Corepack 활성화 + 선언된 pnpm 버전 준비
corepack enable
corepack prepare pnpm@10.33.0 --activate

# 의존성 설치 (락파일 검증 모드)
pnpm install --frozen-lockfile

# 개발 서버 (앱별)
pnpm dev:web        # http://localhost:3000  (Next.js)
pnpm dev:admin      # http://localhost:3001  (Vite)
pnpm dev:mentor     # http://localhost:3002  (Vite)
```

> Corepack 없이 `npm install -g pnpm@10`도 가능하지만, 글로벌 pnpm 버전이 `packageManager` 필드와 어긋나면 의존성 해석이 흔들립니다. Corepack은 이걸 자동으로 막아줍니다.

### Vercel 배포 토폴로지

**3개 앱 = Vercel 프로젝트 3개**입니다. 한 프로젝트로 합쳐 배포하지 않습니다.

```
모노레포 (이 저장소)
   │
   ├─ apps/web      ─→  Vercel 프로젝트 #1 (letscareer-web)     →  <운영 도메인>
   ├─ apps/admin    ─→  Vercel 프로젝트 #2 (letscareer-admin)   →  <어드민 운영 도메인>
   └─ apps/mentor   ─→  Vercel 프로젝트 #3 (letscareer-mentor)  →  <멘토 운영 도메인>
```

핵심 효과:
- **빌드 격리**: 각 Vercel 프로젝트는 자기 앱만 빌드합니다 (Next.js / Vite 서로 다른 프레임워크라 합칠 수도 없음).
- **배포 격리**: `apps/admin`만 수정하면 admin 프로젝트만 재배포됩니다 — 단, 이를 위해선 각 프로젝트의 **Ignored Build Step** 설정이 필요합니다 (아래 [Vercel 배포 설정](#-vercel-배포-설정) 2️⃣ 참고).
- **공용 변경 시 전체 재배포**: `packages/*`나 `pnpm-lock.yaml`이 바뀌면 3개 프로젝트가 모두 재빌드됩니다 (의도된 동작).

> ⚠️ 한 도메인 안에서 `/admin` 같은 path 기반 통합 라우팅(Vercel Multi-Zones)은 **현재 적용되어 있지 않습니다.** 사용자는 어드민/멘토 서브도메인으로 직접 이동합니다.

---

## 📦 프로젝트 구성

```
lets-intern-client/
├── apps/
│   ├── web/      # 사용자 페이지 (Next.js)         → <운영 도메인>
│   ├── admin/    # 어드민 콘솔 (Vite + React)      → <어드민 운영 도메인>
│   └── mentor/   # 멘토 마이페이지 (Vite + React)  → <멘토 운영 도메인>
└── packages/
    ├── api/                  # axios 클라이언트 (공용)
    ├── hooks/                # 공유 React Hooks
    ├── store/                # zustand stores
    ├── types/                # 공유 TypeScript 타입
    ├── ui/                   # 공유 컴포넌트
    ├── utils/                # 유틸리티 함수
    └── config/               # eslint / prettier / tailwind / tsconfig
```

## 🔧 사전 요구사항

| 도구 | 버전 |
|---|---|
| Node.js | `>=18.17` (권장: 20.x) |
| pnpm    | `>=10`   |

```bash
# Node 버전 관리 (nvm 사용 시)
nvm use 20

# pnpm 설치
npm install -g pnpm@10
```

## 🚀 빠른 시작

```bash
# 1. 저장소 클론
git clone <repo-url>
cd lets-intern-client

# 2. 의존성 설치 (모든 workspace 한 번에)
pnpm install

# 3. 환경변수 파일 준비 (각 앱 디렉토리)
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.development
cp apps/mentor/.env.example apps/mentor/.env.development

# 4. 원하는 앱 실행
pnpm dev:web     # → http://localhost:3000
pnpm dev:admin   # → http://localhost:3001
pnpm dev:mentor  # → http://localhost:3002
```

## 💻 개발 (dev)

### 앱별 개별 실행 (권장)

한 앱만 작업할 때는 **필터 스크립트**를 쓰세요. 다른 앱은 실행되지 않습니다.

```bash
pnpm dev:web       # web 앱만 실행 :3000
pnpm dev:admin     # admin 앱만 실행 :3001
pnpm dev:mentor    # mentor 앱만 실행 :3002
```

### 모든 앱 동시 실행

```bash
pnpm dev   # 3개 앱 동시 기동 (:3000, :3001, :3002)
```

> ⚠️ 포트 충돌 주의. 이미 해당 포트를 쓰는 프로세스가 있으면 `strictPort: true` 설정으로 실패합니다.

### 개발 시 API 프록시

admin/mentor의 Vite dev 서버는 `/api` 요청을 백엔드 호스트로 프록시합니다 (`vite.config.ts`). 별도 API 서버 기동 없이 실서버 데이터로 개발 가능.

## 🏗 빌드 (build)

```bash
pnpm build:web     # web만 빌드 → apps/web/.next
pnpm build:admin   # admin만 빌드 → apps/admin/dist
pnpm build:mentor  # mentor만 빌드 → apps/mentor/dist

pnpm build         # 3개 앱 모두 빌드
```

### Turborepo 캐시

- **첫 빌드** 후 Turbo가 `.turbo/` 캐시를 저장합니다.
- **같은 입력**이면 다음 빌드는 즉시 완료(`>>> FULL TURBO`).
- **한 앱만 수정하면 다른 앱 캐시는 유지**됩니다 (→ "한 앱 수정 = 해당 앱만 재빌드").

빌드 시간 예시:
- 첫 빌드: `admin` ~28s, `mentor` ~18s, `web` ~60s
- 캐시 히트: <1s

캐시 무효화가 일어나는 조건:
- 해당 앱 소스코드 변경
- 해당 앱이 import하는 공용 패키지 변경 (`packages/*`)
- `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.env*` 변경
- 관련 환경변수(`NEXT_PUBLIC_*`, `VITE_*`, `SENTRY_*`, `BUILDER_*`) 변경

## 🧪 검증 (lint / typecheck / test)

```bash
# 전체
pnpm lint
pnpm typecheck
pnpm test

# 앱별
pnpm lint:web
pnpm typecheck:admin
pnpm lint:mentor
```

## 🧹 정리

```bash
pnpm clean   # 빌드 산출물 + node_modules + .turbo 삭제 (초기화)
```

## 🌐 Vercel 배포 설정

> **핵심 원칙**: 각 앱을 **독립된 Vercel 프로젝트**로 분리해야 앱별 격리 배포가 됩니다.
> 지금은 1개 프로젝트가 모노레포 전체를 빌드하는 설정일 수 있으니 반드시 분리 확인.

### 1️⃣ Vercel 프로젝트 3개 생성

Vercel 대시보드 → **Add New → Project** → 같은 Git 저장소 선택 → 다음 설정 적용.

#### `letscareer-web` (기존 프로젝트)

| 항목 | 값 |
|---|---|
| Framework Preset | `Next.js` |
| **Root Directory** | `apps/web` |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |
| Build Command | `cd ../.. && pnpm build:web` |
| Output Directory | `.next` (자동) |
| Node Version | `20.x` |

#### `letscareer-admin` (신규)

| 항목 | 값 |
|---|---|
| Framework Preset | `Vite` |
| **Root Directory** | `apps/admin` |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |
| Build Command | `cd ../.. && pnpm build:admin` |
| Output Directory | `dist` |
| Node Version | `20.x` |

#### `letscareer-mentor` (신규)

| 항목 | 값 |
|---|---|
| Framework Preset | `Vite` |
| **Root Directory** | `apps/mentor` |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |
| Build Command | `cd ../.. && pnpm build:mentor` |
| Output Directory | `dist` |
| Node Version | `20.x` |

> 💡 `cd ../..`로 모노레포 루트에서 pnpm을 실행해야 workspace 의존성(`@letscareer/*`)이 해석됩니다.

### 2️⃣ Ignored Build Step (선택 사항, 권장)

**앱 A 소스만 바꿨을 때 앱 B/C 배포를 스킵**하려면 각 프로젝트의 **Settings → Git → Ignored Build Step**에 아래 스크립트를 추가.

#### `letscareer-admin` (`Settings → Git → Ignored Build Step`)
```bash
git diff HEAD^ HEAD --quiet -- apps/admin packages pnpm-lock.yaml pnpm-workspace.yaml turbo.json
```
- 이 명령이 exit code 0(변경 없음)이면 Vercel이 배포를 스킵합니다.
- exit code 1이면 배포 진행.

#### `letscareer-mentor`
```bash
git diff HEAD^ HEAD --quiet -- apps/mentor packages pnpm-lock.yaml pnpm-workspace.yaml turbo.json
```

#### `letscareer-web`
```bash
git diff HEAD^ HEAD --quiet -- apps/web packages pnpm-lock.yaml pnpm-workspace.yaml turbo.json
```

> ⚠️ `packages/`에 공용 코드 변경이 있으면 3개 앱 모두 배포됩니다 — 의도된 동작입니다.

### 3️⃣ SPA rewrite (admin / mentor만)

Vite + React Router로 만든 SPA는 `/users` 같은 직접 진입 URL에서 404가 납니다. 각 앱 루트에 **`vercel.json`** 추가:

**`apps/admin/vercel.json`**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**`apps/mentor/vercel.json`**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

`web` (Next.js)은 자체 라우팅이라 필요 없음.

### 4️⃣ 환경변수 (Project Settings → Environment Variables)

각 Vercel 프로젝트별로 Production / Preview 환경의 env 값을 입력합니다. 키의 *형태와 의미*는 각 앱의 [`.env.example`](apps/) 파일 참고.

### 5️⃣ 도메인 연결 (Project Settings → Domains)

각 프로젝트마다 도메인 등록.

| 프로젝트 | Production | Preview (Git Branch: `develop`) |
|---|---|---|
| `letscareer-web` | `<운영 도메인>` | `<테스트 도메인>` |
| `letscareer-admin` | `<어드민 운영 도메인>` | `<어드민 테스트 도메인>` |
| `letscareer-mentor` | `<멘토 운영 도메인>` | `<멘토 테스트 도메인>` |

DNS는 DNS 관리자(가비아/카페24 등)에서 6개 서브도메인에 `CNAME → cname.vercel-dns.com` 추가.

### 6️⃣ 배포 확인

```bash
# DNS 전파
dig <어드민 운영 도메인> +short
# → cname.vercel-dns.com.

# 직접 진입 테스트
curl -I https://<어드민 운영 도메인>/programs
# → 200 (SPA rewrite 동작)
```

**배포 직후 smoke 체크**:
- [ ] `https://<운영 도메인>/` 정상 렌더
- [ ] `https://<어드민 운영 도메인>/` 로그인 화면
- [ ] `https://<멘토 운영 도메인>/` 로그인 화면
- [ ] `https://<운영 도메인>/admin/programs` → 308 → `<어드민 운영 도메인>/programs`
- [ ] OAuth(카카오/네이버) 로그인 정상

더 자세한 배포 절차와 운영 메모는 [`.claude/docs/letscareer/pnpm전환 메모 폴더/`](.claude/docs/letscareer/pnpm전환%20메모%20폴더/) 참고. 모노레포 구조·pnpm 셋업·도메인 라우팅·Vercel 설정·CI 빌드·단계별 배포가 주제별로 분리되어 있습니다.

## 📚 추가 문서

| 문서 | 내용 |
|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | `.claude/` 디렉토리 길잡이 |
| [`.claude/docs/letscareer/architecture.md`](./.claude/docs/letscareer/architecture.md) | 시스템 아키텍처 개요 |
| [`.claude/docs/letscareer/pnpm전환 메모 폴더/`](./.claude/docs/letscareer/pnpm전환%20메모%20폴더/) | pnpm·도메인·Vercel·CI·배포 운영 메모 |
| [`.claude/docs/letscareer/`](./.claude/docs/letscareer/) | 도메인별 아키텍처 문서 |
| `apps/<app>/.env.example` | 환경변수 키 형태와 의미 |
| `apps/<app>/package.json` | 앱별 의존성 |

## 🆘 자주 마주치는 문제

### `pnpm install` 후 workspace 패키지(`@letscareer/*`)가 안 풀릴 때
```bash
pnpm clean && pnpm install
```

### Turbo 캐시가 꼬였을 때
```bash
pnpm exec turbo run build --filter=@letscareer/admin --force
# 또는 전체 캐시 리셋
rm -rf .turbo apps/*/.turbo packages/*/.turbo
```

### Vercel 배포 시 `@letscareer/*` 못 찾을 때
- Root Directory가 앱 디렉토리(`apps/<name>`)로 지정되어 있는지 확인
- Install/Build Command에 `cd ../..`가 포함되어 모노레포 루트에서 pnpm이 실행되는지 확인
- Vercel의 "Include files outside of the Root Directory" 옵션 ON (pnpm workspace 감지용)

### admin/mentor에서 SPA 새로고침 시 404
`vercel.json`의 rewrites 규칙이 누락됐거나 배포되지 않은 상태. 위 **"3️⃣ SPA rewrite"** 설정 확인.

### dev 서버 포트 충돌
```bash
# 점유 중인 프로세스 찾기
lsof -i :3001
# 또는 해당 앱의 vite.config.ts에서 port 변경
```

## 📋 스크립트 참고

### 루트 스크립트

| 명령 | 설명 |
|---|---|
| `pnpm dev` | 3개 앱 동시 실행 |
| `pnpm dev:web` / `dev:admin` / `dev:mentor` | 해당 앱만 실행 |
| `pnpm build` | 3개 앱 모두 빌드 |
| `pnpm build:web` / `build:admin` / `build:mentor` | 해당 앱만 빌드 |
| `pnpm lint` / `typecheck` / `test` | 전체 검증 |
| `pnpm lint:<app>` / `typecheck:<app>` | 해당 앱만 검증 |
| `pnpm clean` | 빌드 산출물·node_modules·.turbo 삭제 |

### Turbo 고급 사용

```bash
# 특정 앱의 의존 그래프 확인
pnpm exec turbo run build --filter=@letscareer/admin --dry-run

# 캐시 무시하고 강제 빌드
pnpm exec turbo run build --filter=@letscareer/admin --force

# 여러 앱 동시 필터
pnpm exec turbo run build --filter=@letscareer/web --filter=@letscareer/admin
```

## 🧭 아키텍처 요약

- **공용 패키지**(`packages/*`): 3개 앱이 `workspace:*` 프로토콜로 참조
- **빌드 순서**: `packages/*` → `apps/*` (`dependsOn: ["^build"]`)
- **타입**: 공용 타입은 `@letscareer/types`, 앱별 타입은 각 앱의 `src/types/`
- **API**: 공용 axios 인스턴스는 `@letscareer/api`, 앱별 엔드포인트는 각 앱의 `src/api/`
- **도메인 레이어(DDD)**: `apps/<app>/src/domain/<domain>/` (컴포넌트·훅·API 응집)

자세한 도메인 구조는 `.claude/docs/letscareer/domain/`의 각 도메인 README 참고.
