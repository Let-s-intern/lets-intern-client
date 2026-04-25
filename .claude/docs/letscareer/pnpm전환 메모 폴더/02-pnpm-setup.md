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
