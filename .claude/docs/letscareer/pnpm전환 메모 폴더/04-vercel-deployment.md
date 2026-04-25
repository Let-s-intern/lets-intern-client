# 04. Vercel 배포 설정

> Keywords: vercel, deploy, ignored-build-step, root-directory, env, spa-rewrite

**3개 앱 = 3개 Vercel 프로젝트** 원칙으로 운영한다. 한 프로젝트로 합치는 건 프레임워크가 달라(Next.js vs Vite) 불가능하기도 하고, 분리해야 *한 앱 수정 = 그 앱만 재배포*가 성립한다.

## 토폴로지

```
모노레포 (이 저장소)
   │
   ├─ apps/web      ─→  Vercel #1 (letscareer-web)     →  <운영 도메인>
   ├─ apps/admin    ─→  Vercel #2 (letscareer-admin)   →  <어드민 운영 도메인>
   └─ apps/mentor   ─→  Vercel #3 (letscareer-mentor)  →  <멘토 운영 도메인>
```

각 프로젝트가 같은 Git 저장소를 보지만, *Root Directory*만 다르다. 빌드·배포·환경변수·도메인이 모두 독립.

## 1️⃣ 프로젝트 3개 생성

Vercel 대시보드 → **Add New → Project** → 같은 Git 저장소를 *세 번* 임포트한다.

### `letscareer-web`

| 항목 | 값 |
|---|---|
| Framework Preset | `Next.js` |
| **Root Directory** | `apps/web` |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |
| Build Command | `cd ../.. && pnpm build:web` |
| Output Directory | `.next` (자동) |
| Node Version | `20.x` |
| Include files outside Root Directory | **ON** (pnpm workspace 감지용) |

### `letscareer-admin`

| 항목 | 값 |
|---|---|
| Framework Preset | `Vite` |
| **Root Directory** | `apps/admin` |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |
| Build Command | `cd ../.. && pnpm build:admin` |
| Output Directory | `dist` |
| Node Version | `20.x` |
| Include files outside Root Directory | **ON** |

### `letscareer-mentor`

| 항목 | 값 |
|---|---|
| Framework Preset | `Vite` |
| **Root Directory** | `apps/mentor` |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |
| Build Command | `cd ../.. && pnpm build:mentor` |
| Output Directory | `dist` |
| Node Version | `20.x` |
| Include files outside Root Directory | **ON** |

### 왜 `cd ../..`가 필요한가

Root Directory를 `apps/web`으로 잡으면 Vercel은 그 디렉토리에서 명령을 실행한다. 하지만 pnpm workspace는 *루트* `pnpm-workspace.yaml`이 있어야 동작한다. 그래서:
- `cd ../..`로 모노레포 루트로 올라간다.
- 거기서 `pnpm install --frozen-lockfile`을 돌리면 모든 워크스페이스(`apps/*`, `packages/*`) 의존성이 함께 해석된다.
- 빌드도 마찬가지로 루트에서 `pnpm build:web` → 루트 turbo가 적절한 앱만 필터해서 빌드.

`Include files outside Root Directory` 옵션은 Vercel이 `apps/web` 바깥(`packages/`, 루트 lockfile 등)도 빌드 컨텍스트에 포함하도록 하는 토글이다. **반드시 ON**.

## 2️⃣ Ignored Build Step

기본 동작: Git push 시 *3개 프로젝트가 모두 트리거*된다. Ignored Build Step을 설정하면 *해당 앱과 무관한 변경에선 빌드를 스킵*시킬 수 있다.

각 프로젝트 → Settings → Git → **Ignored Build Step** 에 다음 스크립트를 넣는다. exit 0이면 스킵, exit 1이면 빌드 진행.

### `letscareer-web`

```bash
git diff HEAD^ HEAD --quiet -- apps/web packages pnpm-lock.yaml pnpm-workspace.yaml turbo.json
```

### `letscareer-admin`

```bash
git diff HEAD^ HEAD --quiet -- apps/admin packages pnpm-lock.yaml pnpm-workspace.yaml turbo.json
```

### `letscareer-mentor`

```bash
git diff HEAD^ HEAD --quiet -- apps/mentor packages pnpm-lock.yaml pnpm-workspace.yaml turbo.json
```

### 트리거 매트릭스

| 변경 위치 | web 빌드 | admin 빌드 | mentor 빌드 |
|---|:---:|:---:|:---:|
| `apps/web/**` | ✅ | ❌ | ❌ |
| `apps/admin/**` | ❌ | ✅ | ❌ |
| `apps/mentor/**` | ❌ | ❌ | ✅ |
| `packages/**` | ✅ | ✅ | ✅ |
| `pnpm-lock.yaml` | ✅ | ✅ | ✅ |
| `pnpm-workspace.yaml` | ✅ | ✅ | ✅ |
| `turbo.json` | ✅ | ✅ | ✅ |
| `.claude/**`, `*.md`, `.cursor/**` | ❌ | ❌ | ❌ |

`packages/`나 락파일이 바뀌면 3개 모두 빌드되는 건 *의도된 동작*. 공용 의존이 바뀌면 모두 영향받기 때문.

## 3️⃣ SPA Rewrite (admin/mentor만)

Vite로 빌드된 SPA는 정적 파일 묶음이라, `/users/123` 같은 클라이언트 라우트로 새로고침하면 서버에 그런 파일이 없어 404가 난다. 모든 경로를 `index.html`로 돌려보내고 React Router가 처리하게 하는 표준 패턴.

### [apps/admin/vercel.json](../../../../apps/admin/vercel.json)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### apps/mentor/vercel.json (동일 패턴)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> ⚠️ 이 rewrite는 *SPA fallback*이다. *cross-app proxy* (다른 도메인으로 프록시)와는 의미가 다르다. 한 도메인에서 `/admin`, `/mentor` 통합 라우팅(Vercel Multi-Zones)은 현재 적용되어 있지 않다.

`web` (Next.js)은 자체 라우팅이라 SPA rewrite가 필요 없다.

### 루트 [vercel.json](../../../../vercel.json) — 캐시 헤더만

```json
{
  "headers": [
    { "source": "/apple-icon-(.*)",  "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/android-icon-(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/favicon-(.*)",     "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/(.*).woff2",       "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/logo/(.*)",        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/images/(.*)",      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/icons/(.*)",       "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
```

정적 자산(아이콘·폰트·이미지·로고)에 1년 immutable 캐시. URL이 바뀌지 않는 한 브라우저·CDN 캐시 영구 적중.

## 4️⃣ 환경변수

Project Settings → Environment Variables. 각 프로젝트에 *Production* / *Preview* 두 환경 모두 입력.

### 키 목록

#### `letscareer-web` (Next.js)

```
NEXT_PUBLIC_SERVER_API
NEXT_PUBLIC_API_BASE_PATH
NEXT_PUBLIC_ADMIN_URL          ← 비우면 fallback 모드 (web 자체 /admin 라우트)
NEXT_PUBLIC_MENTOR_URL         ← 비우면 fallback 모드 (web 자체 /mentor 라우트)
NEXT_PUBLIC_TOSS_CLIENT_KEY
NEXT_PUBLIC_SENTRY_DSN
NEXT_PUBLIC_PROFILE
BASE_URL
```

#### `letscareer-admin` / `letscareer-mentor` (Vite)

```
VITE_API_BASE_PATH
VITE_SERVER_API
VITE_PROFILE
VITE_BASE_URL
VITE_ERROR_WEBHOOK_URL
```

> 환경변수 *값*은 README나 문서에 두지 않는다. 키 목록만 여기서 다룬다.

### Preview 환경 분기

Vercel은 자동으로 main/develop 브랜치마다 별도 도메인을 발급한다. 보통 develop는 *테스트 도메인*으로, main은 *운영 도메인*으로 매핑.

## 5️⃣ 도메인 매핑

각 프로젝트 → Settings → Domains.

| Vercel 프로젝트 | Production | Preview (Git Branch: `develop`) |
|---|---|---|
| `letscareer-web` | `<운영 도메인>` | `<테스트 도메인>` |
| `letscareer-admin` | `<어드민 운영 도메인>` | `<어드민 테스트 도메인>` |
| `letscareer-mentor` | `<멘토 운영 도메인>` | `<멘토 테스트 도메인>` |

DNS는 운영자(가비아·카페24 등) 콘솔에서 6개 서브도메인 모두 `CNAME → cname.vercel-dns.com` 추가.

## 6️⃣ 빌드 환경

Vercel 빌드 환경:
- Node 20.x (프로젝트 설정으로 명시)
- pnpm: Vercel은 `packageManager` 필드를 자동 인식하여 정확한 pnpm 버전을 활성화 (Corepack과 동일 동작)
- 빌드 머신 OS: Ubuntu

빌드 시간 참고치 (캐시 콜드):
- `web`: ~60s
- `admin`: ~28s
- `mentor`: ~18s

빌드 캐시 적중 시: <1s.

## 검증 체크리스트

배포 직후 smoke 테스트:

```bash
# DNS 전파 확인
dig <어드민 운영 도메인> +short
# → cname.vercel-dns.com.

# SPA 직접 진입
curl -I https://<어드민 운영 도메인>/programs
# → 200 (SPA rewrite 동작)

# 미들웨어 리다이렉트
curl -I https://<운영 도메인>/admin/programs
# → 308 → https://<어드민 운영 도메인>/programs
```

브라우저 체크:
- [ ] `https://<운영 도메인>/` 정상 렌더
- [ ] `https://<어드민 운영 도메인>/` 로그인 화면
- [ ] `https://<멘토 운영 도메인>/` 로그인 화면
- [ ] `https://<운영 도메인>/admin/programs` → `<어드민 운영 도메인>/programs`로 자동 이동
- [ ] OAuth(카카오/네이버) 로그인 정상
- [ ] 헤더 "관리자 페이지" 클릭 시 SSO hash 포함 이동

## 트러블슈팅

| 증상 | 원인 | 해결 |
|---|---|---|
| 빌드 시 `@letscareer/*` 모듈 못 찾음 | Root Directory 또는 `cd ../..` 누락 | 위 1️⃣ 표대로 명령 점검 |
| `Include files outside…` OFF인 채 배포 | Vercel이 `packages/`를 빌드 컨텍스트에 포함시키지 않음 | 옵션 ON으로 변경 후 재배포 |
| Ignored Build Step에서 항상 빌드 발생 | `git diff HEAD^ HEAD` 가 첫 커밋이라 실패 | 정상. 첫 푸시 이후부턴 정상 동작 |
| `/users/123` 새로고침 시 404 (admin/mentor) | `vercel.json` SPA rewrite 누락 또는 미반영 | 위 3️⃣ 적용 후 재배포 |
| Preview 도메인이 동작 안 함 | DNS CNAME 미설정, 또는 Vercel Domains 등록 누락 | 5️⃣ 표대로 점검 |
| 빌드 후에도 환경변수 빈 값 | Vite는 *빌드 시* 환경변수를 정적으로 인라인. 변경 후 재배포 필요 | env 변경 → "Redeploy without cache" |
