---
name: quality-check
description: "변경 파일에 포맷(prettier)·린트(eslint)·타입체크(tsc)를 실행하고 결과를 보고합니다. 사용자가 '타입체크 린트 포맷', '품질 검사', '커밋 전 검사', '포메팅 린팅 타입체크 해줘', 'lint typecheck format' 등을 요청할 때 사용합니다."
argument-hint: "[변경 기준 브랜치(기본: main) 또는 파일경로]"
allowed-tools: Bash, Read, Glob
---

# 코드 품질 검사 (포맷 · 린트 · 타입체크)

변경된 파일에 **prettier(포맷) → eslint(린트) → tsc(타입체크)** 를 순서대로 돌리고
**"내가 만든/바꾼 코드"가 깨끗한지**를 판정한다. 커밋·푸시 전에 쓴다.

> ⚠️ 이 레포는 모노레포(pnpm workspace)이고, **기존(pre-existing) eslint warning·tsc error 가 다수** 있다.
> 따라서 "전체 0" 이 아니라 **"변경 파일에 새 에러 0"** 으로 판정한다. (아래 §판정 기준)

---

## 환경 사실 (레포 고정값)

- pnpm workspace. 앱: `apps/admin`, `apps/mentor`, `apps/web`. 공유: `packages/*`.
- 앱별 스크립트: `typecheck` = `tsc --noEmit`, `lint` = `eslint src`. (각 앱 `package.json`)
- 포맷: 루트 prettier 설정(`@letscareer/prettier-config`) → `npx prettier --write|--check <files>`.
- **셸은 zsh**: `mapfile` 없음. 파일 목록은 `xargs` 로 넘긴다. (`$VAR` 비인용 시 단어분할 안 됨)
- 코드 주석에 `*/` 리터럴 금지(oxc 파서 오인) — 검사와 무관하나 신규 코드 작성 시 주의.

---

## 실행 절차

### 0. 변경 범위 산정

인자가 있으면 그 값을(브랜치명/경로) 기준으로, 없으면 기본 비교 기준을 정한다:

```bash
cd <repo-root>
# 기준 브랜치: 인자 > 현재 추적 upstream의 병합지점 > main
BASE="${1:-}"
if [ -z "$BASE" ]; then
  BASE=$(git merge-base HEAD main 2>/dev/null || echo main)
fi
echo "비교 기준: $BASE"

# 변경된(스테이징/커밋/미스테이징 포함) ts/tsx 파일 목록
git diff --name-only "$BASE"...HEAD -- '*.ts' '*.tsx' > /tmp/qc_files.txt
git diff --name-only -- '*.ts' '*.tsx' >> /tmp/qc_files.txt          # 미스테이징
git ls-files --others --exclude-standard -- '*.ts' '*.tsx' >> /tmp/qc_files.txt  # 신규
sort -u /tmp/qc_files.txt | grep -E '\.(ts|tsx)$' > /tmp/qc_changed.txt
echo "변경 파일 수: $(wc -l < /tmp/qc_changed.txt)"
cat /tmp/qc_changed.txt
```

변경 파일이 0개면 "검사할 변경 없음" 으로 보고하고 종료.

영향받는 **앱**을 추출한다(린트·타입체크는 앱 단위 실행):

```bash
grep -oE '^(apps/[^/]+|packages/[^/]+)' /tmp/qc_changed.txt | sort -u
```

### 1. 포맷 (prettier --write)

```bash
cat /tmp/qc_changed.txt | xargs npx prettier --write 2>&1 | grep -viE 'unchanged' | tail -20
```

- 변경(재포맷)된 파일이 있으면 목록을 보고하고 **"포맷 수정됨 → 커밋 필요"** 표시.
- 끝나면 `git status -s` 로 포맷에 의한 변경을 보여준다.

### 2. 린트 (eslint) — 영향 앱별

각 영향 앱에서:

```bash
cd <repo-root>/apps/<app>
pnpm lint 2>&1 | tail -5
```

- `eslint` exit 0 이라도 warning 은 통과. **error 개수**만 차단 사유.
- 가능하면 변경 파일만 정밀 확인:
  `cd <repo-root> && cat /tmp/qc_changed.txt | grep '^apps/<app>/' | sed 's#^apps/<app>/##' | xargs -I{} sh -c 'cd apps/<app> && npx eslint {}'`
  → 변경 파일에 error 0 인지 확인.

### 3. 타입체크 (tsc --noEmit) — 영향 앱별

```bash
cd <repo-root>/apps/<app>
pnpm typecheck 2>&1 | grep -E "error TS" > /tmp/qc_tsc.txt
# 변경 파일에 걸린 에러만 추림
grep -Ff <(sed 's#^apps/<app>/##' /tmp/qc_changed.txt) /tmp/qc_tsc.txt || echo "→ 변경 파일 타입 에러 0"
echo "참고: 앱 전체 tsc 에러 $(wc -l < /tmp/qc_tsc.txt)개 (기존 포함)"
```

- **변경 파일에 걸린 error 만** 차단 사유. 기존 에러는 "참고"로만 보고(내가 만든 게 아님).

---

## 판정 기준

| 단계 | 통과 조건 |
|---|---|
| 포맷 | prettier --check 통과(또는 --write 후 재포맷 완료). 재포맷 시 "커밋 필요" 안내 |
| 린트 | **변경 파일에 eslint error 0** (warning 은 허용, 기존 warning 무관) |
| 타입 | **변경 파일에 tsc error 0** (앱 전체 기존 error 는 참고만) |

세 단계 모두 통과하면 ✅. 변경 파일에서 새 error 가 나오면 그 파일만 고치고 재실행.

---

## 출력 형식

```
## 품질 검사 결과 (기준: <BASE>, 변경 N파일)
- 포맷: ✅ 정상 / ⚠️ M개 재포맷됨(커밋 필요)
- 린트: ✅ 변경 파일 error 0 (warning K, 기존)
- 타입: ✅ 변경 파일 error 0 (앱 전체 기존 error J)
[불통과 시] 고친 파일·남은 에러 명시
```

## 규칙

- **신규 파일을 만들지 않는다.** 포맷 외 코드 수정은 "변경 파일의 새 error 해결" 목적에 한함(surgical).
- 기존(pre-existing) warning/error 를 임의로 손대지 않는다 — 보고만.
- 커밋/푸시는 하지 않는다(사용자 요청 시 별도 진행). 포맷으로 파일이 바뀌면 커밋이 필요하다고 안내만.
