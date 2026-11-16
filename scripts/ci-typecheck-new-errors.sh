#!/usr/bin/env bash
# ============================================================
# CI 타입체크 — base 대비 새로 생긴 에러만 실패로 본다
# ============================================================
#
# 사용: scripts/ci-typecheck-new-errors.sh <app> <base-sha>
#   app: web | admin | mentor
#
# 기존 코드에 이미 있는 타입 에러(admin 100여 개, CI 에 next-env.d.ts 가
# 없어 생기는 web 이미지 타입 에러 등)는 무시하고, 이 PR 이 새로 만든 에러만
# 잡는다. 같은 node_modules 로 base 소스와 현재 소스를 각각 tsgo 로 검사해
# 에러 목록을 비교한다.
#
# 비교 키는 "파일 + 에러 코드 + 메시지" 이고 줄 번호는 뺀다. 포맷 변경이나
# 위쪽 코드 추가로 줄이 밀려도 같은 에러로 본다. 같은 파일에 같은 에러가
# 하나 더 생기면 개수 차이로 잡힌다.
# ============================================================
set -euo pipefail

APP=$1
BASE_SHA=$2
ROOT=$(git rev-parse --show-toplevel)
TSGO="$ROOT/node_modules/.bin/tsgo"
TMP=${RUNNER_TEMP:-$(mktemp -d)}
BASE_DIR="$TMP/typecheck-base"

# tsgo 출력의 첫 줄만 남기고 줄·열 번호를 지운 뒤 정렬한다.
normalize() {
  grep -E '^[^ ].*\([0-9]+,[0-9]+\): error TS[0-9]+' "$1" \
    | sed -E 's/\([0-9]+,[0-9]+\)//' \
    | sort || true
}

run_tsgo() {
  (cd "$1/apps/$APP" && "$TSGO" --noEmit --incremental false) > "$2" 2>&1 || true
}

echo "[typecheck] 현재 소스 검사"
run_tsgo "$ROOT" "$TMP/head.log"

echo "[typecheck] base($BASE_SHA) 소스 검사"
rm -rf "$BASE_DIR"
git worktree add --detach --quiet "$BASE_DIR" "$BASE_SHA"
trap 'git -C "$ROOT" worktree remove --force "$BASE_DIR" >/dev/null 2>&1 || true' EXIT

# 설치는 현재 쪽에만 되어 있으므로 node_modules 를 그대로 연결한다.
(cd "$ROOT" && find . -maxdepth 4 -name node_modules -type d -prune -not -path './node_modules/*') \
  | while read -r dir; do
      parent="$BASE_DIR/$(dirname "$dir")"
      [ -d "$parent" ] && [ ! -e "$BASE_DIR/$dir" ] && ln -s "$ROOT/$dir" "$BASE_DIR/$dir"
    done
run_tsgo "$BASE_DIR" "$TMP/base.log"

normalize "$TMP/head.log" > "$TMP/head.err"
normalize "$TMP/base.log" > "$TMP/base.err"
NEW=$(comm -23 "$TMP/head.err" "$TMP/base.err")

echo "[typecheck] base 에러 $(wc -l < "$TMP/base.err" | tr -d ' ')개, 현재 에러 $(wc -l < "$TMP/head.err" | tr -d ' ')개"

if [ -n "$NEW" ]; then
  echo "[typecheck] 이 PR 에서 새로 생긴 에러 (줄 번호는 아래 전체 로그에서 확인):"
  echo "$NEW"
  echo ""
  echo "[typecheck] 해당 에러의 전체 로그:"
  while IFS= read -r line; do
    file=${line%%: error*}
    rest=${line#*: }
    grep -F "$file(" "$TMP/head.log" | grep -F "$rest" || true
  done <<< "$NEW"
  exit 1
fi

echo "[typecheck] 새로 생긴 에러 없음"
