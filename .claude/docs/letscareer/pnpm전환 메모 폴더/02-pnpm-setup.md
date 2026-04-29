# 02. pnpm 설치·실행

> Keywords: pnpm, corepack, packageManager, frozen-lockfile, approve-builds

npm에서 pnpm으로 전환한 이후의 표준 설치/실행 흐름을 정리한다. 핵심은 **`packageManager` 필드 = 진실의 원천**, **Corepack으로 활성화**, **`--frozen-lockfile`로 검증**이다.

## 강제 버전

[package.json](../../../../package.json):

```json
{
  "packageManager": "pnpm@10.33.0",
  "engines": {
    "node": ">=18.17",
    "pnpm": ">=10"
  }
}
```

- `packageManager` 필드는 [Corepack](https://nodejs.org/api/corepack.html) 표준이다. Corepack은 이 값을 읽어 정확한 pnpm 버전을 자동 다운로드/실행한다.
- `engines`은 그저 경고/메타데이터로, 실제 강제는 `packageManager`가 한다.
- Node 권장 버전은 20.x.

## 설치 — Corepack (권장)

Node 16.10+에 내장된 Corepack을 켜기만 하면 끝.

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
pnpm --version    # → 10.33.0
```

Corepack을 쓰면:
- 사용자가 어떤 글로벌 pnpm을 깔았든 무관하게 **저장소가 선언한 버전이 자동 활성화**된다.
- 락파일·해시 차이로 인한 충돌이 줄어든다.
- 새 인원 합류 시 "어떤 pnpm 버전 깔지?" 질문이 사라진다.

## 설치 — npm 글로벌 (대안)

```bash
npm install -g pnpm@10
```

가능하지만 다음 위험을 인지해야 한다:
- 로컬 pnpm 버전이 `packageManager` 필드와 어긋나면 의존성 해석이 흔들릴 수 있다.
- pnpm은 `packageManager`와 다른 버전이 감지되면 경고를 띄우는데, 이걸 무시하고 진행하면 락파일과의 미세한 차이가 발생할 수 있다.
- CI는 항상 Corepack 동작 (`pnpm/action-setup@v4`)을 쓰므로 *로컬과 CI의 결과가 달라질* 수 있다.

가능하면 Corepack로 통일.

## 의존성 설치

### 일반 개발 흐름

```bash
pnpm install
```

`pnpm-lock.yaml`이 변경되면 자동으로 갱신한다.

### CI / 배포 / 검증

```bash
pnpm install --frozen-lockfile
```

- `pnpm-lock.yaml`이 `package.json`과 일치하지 않으면 **에러로 종료**한다.
- 락파일이 일치하면 *resolution 단계 자체를 건너뛰어* 빠르다.
- CI ([build-*.yml](../../../../.github/workflows/))과 Vercel은 항상 이 옵션으로 설치한다.
- 결과적으로 *의도치 않은 버전 드리프트* (락파일 외 패키지가 슬쩍 끼는 사고)가 차단된다.

### 일관성 검증

락파일이 `package.json`과 정합하는지만 빠르게 확인:

```bash
pnpm install --frozen-lockfile --lockfile-only
```

## 빌드 스크립트 승인 (approve-builds)

pnpm은 보안상 `postinstall` 같은 빌드 스크립트를 *기본적으로 실행하지 않는다*. 네이티브 바이너리가 필요한 패키지는 명시적으로 승인이 필요하다.

이 저장소에서 흔히 무시되는 패키지(`pnpm install` 후 경고로 표시):
- `@lvce-editor/ripgrep`, `@parcel/watcher`, `@sentry/cli`, `bufferutil`
- `esbuild`, `isolated-vm`, `leveldown`, `protobufjs`
- `sharp` (이미지 처리)
- `unrs-resolver`, `utf-8-validate`

선택적 승인:

```bash
pnpm approve-builds
# 인터랙티브로 어느 패키지를 빌드 허용할지 선택
```

`sharp`(Next.js 이미지 최적화)와 `@sentry/cli`(소스맵 업로드)는 운영 환경에서 동작하려면 승인이 필요하다.

## 일상 명령 카탈로그

| 명령 | 의미 |
|---|---|
| `pnpm install` | 락파일을 업데이트하며 설치 |
| `pnpm install --frozen-lockfile` | 락파일 그대로 설치 (CI/배포용) |
| `pnpm install <pkg>` | 패키지 추가 (현재 디렉토리 워크스페이스에) |
| `pnpm --filter=@letscareer/web add <pkg>` | 특정 워크스페이스에 추가 |
| `pnpm dev:web` / `dev:admin` / `dev:mentor` | 앱별 dev 서버 |
| `pnpm exec <bin>` | 워크스페이스에 설치된 바이너리 실행 (npx 대체) |
| `pnpm clean` | `.turbo`, `node_modules`, 빌드 산출물 삭제 |

## 로컬 dev 환경 변수 설정

3개 앱 각각 `.env.example`을 복사해 실제 값으로 채워야 한다.

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env
cp apps/mentor/.env.example apps/mentor/.env
```

### admin/mentor의 `VITE_SERVER_API`는 *상대 경로*로

admin(`localhost:3001`)·mentor(`localhost:3002`) dev 포트는 BE의 CORS 허용 목록에 등록돼 있지 않을 가능성이 높다. 절대 URL로 BE를 직접 호출하면 OPTIONS preflight가 403으로 막혀 로그인·SSO 모두 깨진다.

[`apps/admin/vite.config.ts`](../../../../apps/admin/vite.config.ts)와 [`apps/mentor/vite.config.ts`](../../../../apps/mentor/vite.config.ts)에 이미 `/api` proxy가 설정돼 있어, `VITE_SERVER_API`만 상대 경로로 두면 자동으로 same-origin 우회.

```env
# apps/admin/.env  (apps/mentor/.env 도 동일 패턴)
VITE_SERVER_API=/api/v1                            # ✓ Vite proxy 경유 (same-origin)
# VITE_SERVER_API=https://api.<운영 도메인>/api/v1  # ✗ dev에선 CORS 403
```

흐름:
1. axios가 `/api/v1/user/signin` 요청 → 브라우저는 same-origin이라 CORS preflight 없이 전송
2. Vite dev server가 가로채서 `<API 호스트>/api/v1/user/signin`으로 forward
3. `changeOrigin: true` 덕에 BE가 보는 Origin은 API 호스트 → 정상 응답

prod 빌드는 영향 없음 — prod env는 절대 URL을 쓰고 prod admin/mentor 도메인은 BE CORS 허용에 등록돼 있다고 가정.

### web은 proxy 불필요

web(Next.js, `localhost:3000`)은 BE CORS 허용 목록에 이미 들어 있는 경우가 많아 절대 URL 직접 호출이 동작한다. `NEXT_PUBLIC_SERVER_API`는 `.env.local`에 절대 URL 그대로.

### `.env` 변경 후 dev 서버 *반드시* 재시작

Vite는 `import.meta.env.*`를 빌드 시점에 *정적 인라인*한다. `.env` 수정 후 dev 서버 재시작 안 하면 오래된 값이 axios 안에 그대로 박혀 있어 *CORS 403이 안 풀리거나 SSO 토큰이 끊겨 보이는 증상*이 캐시 문제처럼 나타난다.

```bash
# Ctrl+C 후
pnpm dev:admin   # 또는 dev:mentor
```

Next.js의 web도 동일 — `.env.local` 변경 시 `pnpm dev:web` 재시작.

## 새 패키지 추가 워크플로우

```bash
# 루트에 dev 의존 추가 (모든 워크스페이스 공통 도구)
pnpm add -D -w typescript

# 특정 앱에만 추가
pnpm --filter=@letscareer/web add zod

# 공용 패키지에 추가
pnpm --filter=@letscareer/utils add date-fns
```

`-w`(워크스페이스 루트), `--filter`(타겟 패키지) 옵션을 정확히 써야 의도와 다른 곳에 설치되는 사고를 막는다.

## 자주 마주치는 함정

| 증상 | 원인 | 해결 |
|---|---|---|
| `Lockfile is not up to date` 에러 | `package.json` 수정 후 락파일 재생성 안 함 | `pnpm install` (frozen 없이) 한 번 |
| `@letscareer/*` 못 찾음 | workspace 매니페스트 누락 또는 install 미실행 | `pnpm clean && pnpm install` |
| 글로벌 pnpm과 Corepack 충돌 | 두 가지가 같이 설치됨 | `npm uninstall -g pnpm` 후 Corepack만 사용 |
| `sharp` 미설치 | `approve-builds` 누락 | `pnpm approve-builds`로 sharp 승인 후 재설치 |
| dev 서버 포트 충돌 | 3000/3001/3002 사용 중 | `lsof -i :3001`로 점유 프로세스 확인·종료 |
| admin/mentor 로그인 시 CORS 403 (preflight) | `VITE_SERVER_API`가 절대 URL이라 BE가 `localhost:3001` Origin을 거부 | `.env`를 `VITE_SERVER_API=/api/v1` 상대 경로로 변경 후 dev 서버 재시작 |
| `.env` 바꿨는데 그대로 동작 (CORS·SSO 캐시처럼 보이는 현상) | Vite/Next 가 빌드 시점에 env를 정적 인라인 | dev 서버 Ctrl+C 후 재시작 |
