# 07. 빌드 필터 — Skip Unaffected + Custom IBS 결합

> Keywords: vercel, ignored-build-step, skip-unaffected, monorepo, build-optimization

문서·dev 도구 설정만 변경했는데도 3개 앱(web/admin/mentor)이 모두 빌드되는 낭비를 막기 위해, Vercel의 **Skip Unaffected Projects(자동)** 와 **Ignored Build Step(커스텀 스크립트)** 를 *결합*해서 사용한다. 스크립트는 [scripts/vercel-skip-build.sh](../../../../scripts/vercel-skip-build.sh) 한 곳에 두고 3개 프로젝트에서 같은 명령으로 호출한다.

## 왜 결합인가

- **Skip Unaffected (자동)** — turbo/pnpm 의존성 그래프를 읽어 워크스페이스 *내부* 변경(`apps/*`, `packages/*`)을 정밀 컷. 빌드 슬롯 점유 안 함.
- **Ignored Build Step (커스텀)** — 빌드 직전 bash로 평가. 워크스페이스 *외부* dev 도구 파일(`.claude/`, `.github/`, 루트 `*.md` 등)을 한 번에 컷.
- 두 필터는 **AND** 관계 — 둘 중 하나라도 "skip"이면 빌드 안 함. *역할 분담*으로 Pareto 개선.

| 변경 유형 | Auto 단독 | Custom 단독 | 결합 |
|---|---|---|---|
| `apps/web/src/page.tsx` | web만 빌드 | 3개 모두 빌드 | web만 빌드 ✓ |
| `pnpm-lock.yaml` | 3개 모두 빌드 | 3개 모두 빌드 | 3개 모두 빌드 ✓ |
| 루트 `README.md` | (의존 그래프 외부) | 스킵 | 스킵 ✓ |
| `.claude/agents/foo.md` | (의존 그래프 외부) | 스킵 | 스킵 ✓ |
| `.github/workflows/build.yml` | (의존 그래프 외부) | 스킵 | 스킵 ✓ |

## 적용 — Vercel UI

3개 프로젝트(web/admin/mentor) **각각** Settings → Git에서:

### 1️⃣ Skip Unaffected Projects 토글 ON

*"Skip deployments when there are no changes"* (또는 monorepo 섹션의 *Skip Unaffected Projects*) 켜기.

### 2️⃣ Ignored Build Step → "Run my own command"

```bash
bash "$(git rev-parse --show-toplevel)/scripts/vercel-skip-build.sh"
```

세 프로젝트 모두 같은 명령. 앱별 분기 불필요 — 워크스페이스 내부 컷은 auto가 처리한다.

> ⚠️ **`bash scripts/vercel-skip-build.sh` 상대 경로는 사용 금지** — Vercel IBS의 cwd는 프로젝트 Root Directory(`apps/<name>/`)이지 repo 루트가 아니라서 `bash: scripts/vercel-skip-build.sh: No such file or directory` (exit 127)로 실패한다. `$(git rev-parse --show-toplevel)`로 repo 루트 절대 경로를 동적 탐지하면 cwd와 무관하게 동작한다.

## 스크립트 — `scripts/vercel-skip-build.sh`

```bash
#!/usr/bin/env bash
# Vercel Ignored Build Step — exits 0 to SKIP, exits 1 to BUILD.

cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

# First-commit guard
git rev-parse HEAD^ >/dev/null 2>&1 || exit 1

# Filter changed files; if nothing remains, skip.
test -z "$(
  git -c core.quotepath=off diff --name-only HEAD^ HEAD \
    | grep -v -E '\.md$|^\.(claude|cursor|gemini|github|vscode)/'
)"
```

| 부분 | 의미 |
|---|---|
| `cd "$(git rev-parse --show-toplevel ...)"` | repo 루트 보장 (Vercel cwd가 어디든 무관) |
| `git rev-parse HEAD^` 가드 | 부모 커밋 없는 첫 푸시는 빌드. 신규 프로젝트 안전 default |
| `-c core.quotepath=off` | 한글/유니코드 경로를 그대로 출력 (이게 없으면 `^\.claude/` 매칭 깨짐) |
| `\.md$` | 어디든 markdown 파일 |
| `^\.(claude\|cursor\|gemini\|github\|vscode)/` | dev 도구 폴더 (IDE·AI·GitHub Actions) |

## 스킵 vs 빌드 분류

### 🟢 스킵 (커스텀이 컷)

- `**/*.md` — 모든 markdown
- `.claude/**` — Claude Code 설정·에이전트·hooks·문서
- `.cursor/**` — Cursor IDE 룰 (`.mdc` 포함)
- `.gemini/**` — Gemini 설정
- `.github/**` — Workflows·PR 템플릿·Copilot 인스트럭션 (Vercel은 `.github`를 안 읽음)
- `.vscode/**` — IDE settings/extensions

### 🔴 빌드 (auto가 다시 컷해서 정확한 앱만 빌드)

- `apps/**`, `packages/**` 모든 코드
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `turbo.json`, `vercel.json`
- `.npmrc`, `.nvmrc`, `.tool-versions`, `.prettierrc.mjs`, `.gitignore`
- `scripts/vercel-skip-build.sh` 자체 (의도된 동작 — 스크립트 변경은 빌드해서 새 동작 검증)

## 핵심 함정

### 1. 한글 경로 이스케이프

`pnpm전환 메모 폴더/`처럼 한글이 든 경로는 git 기본 출력에서 큰따옴표로 감싸진 이스케이프 형식이 된다:

```
".claude/docs/letscareer/pnpm\354\240\204\355\231\230 \353\251\224\353\252\250 \355\217\264\353\215\224/04-..."
```

라인이 `"`로 시작해 `^\.claude/` 매칭 실패 → 잘못 BUILD로 떨어진다. **반드시 `-c core.quotepath=off` 옵션 필요**. 본 프로젝트는 한글 폴더명을 실제로 사용하므로(이 폴더 자체) 이 함정에 즉각 노출된다.

### 2. 첫 커밋 / 부모 없는 ref

`git diff HEAD^ HEAD`는 부모 커밋이 없으면 stderr 에러로 실패하지만, `$(...)` 내부 실패는 외부 평가에 전파되지 않아 `test -z ""`는 exit 0 (스킵)이 된다 → **신규 프로젝트 첫 푸시가 잘못 스킵될 위험**. `git rev-parse HEAD^ >/dev/null 2>&1 || exit 1` 가드로 회피.

### 3. `$(...)` 내부 exit code 무시

`test -z "$(... | ...)"` 형태에선 substitution 안 명령 실패가 외부 평가에 영향을 주지 않는다는 점에 주의. bash의 흔한 함정.

## 로컬 검증

스크립트를 실제로 실행해서 결과 확인:

```bash
bash scripts/vercel-skip-build.sh && echo SKIP || echo BUILD
```

과거 N개 커밋 시뮬레이션 (스크립트 로직만 인라인으로 평가):

```bash
for sha in $(git log --pretty=format:"%h" -30); do
  msg=$(git log -1 --pretty=format:"%s" $sha)
  if ! git rev-parse "${sha}^" >/dev/null 2>&1; then
    verdict="🔴 BUILD (no-parent)"
  elif test -z "$(git -c core.quotepath=off diff --name-only "${sha}^" "${sha}" \
    | grep -v -E '\.md$|^\.(claude|cursor|gemini|github|vscode)/')"; then
    verdict="🟢 SKIP"
  else
    verdict="🔴 BUILD"
  fi
  printf "%s %s — %s\n" "$verdict" "$sha" "$msg"
done
```

특히 확인할 케이스:

- `.md`만 변경한 docs 커밋 → 🟢 SKIP
- 한글 경로의 docs 커밋 → 🟢 SKIP (quotepath 동작 확인)
- `apps/<name>/src/**` 코드 변경 → 🔴 BUILD
- `.github/workflows/*.yml` 변경 → 🟢 SKIP

판정이 직관과 다르면 정규식이 깨졌다는 신호. 운영에 올리지 말 것.

## 향후 유지보수

- **새 dev 도구 도입 시** (`.codeium/`, `.continue/`, `.idea/` 등): 스크립트의 alternation 한 곳만 수정하면 3개 프로젝트 모두 반영
- **필터가 너무 좁다고 느껴지면**: *화이트리스트* 방식 전환 검토 — `apps|packages` + 알려진 빌드 설정 파일만 BUILD 트리거. 안전성 ↑, 새 빌드 설정 추가 시 스크립트 업데이트 필요
- **스크립트 자체 변경**은 빌드를 발생시킨다 — 새 정책이 운영에 적용되는지 한 번 검증되는 효과. 의도된 동작

## 관련 문서

- [04-vercel-deployment.md](./04-vercel-deployment.md) — Vercel 프로젝트 설정 전반
- [05-build-test-ci.md](./05-build-test-ci.md) — Turborepo·GitHub Actions 빌드 동작
- [06-deployment-guide.md](./06-deployment-guide.md) — 배포·롤백·트러블슈팅