#!/usr/bin/env bash
# 개발문서 3계층(실제 파일 ↔ README 인덱스 ↔ CLAUDE.md)의 드리프트를 탐지한다.
# basename 기반 휴리스틱이라 완벽하진 않다 — "확인 필요" 목록으로 보고 직접 판단할 것.
#
# 사용: bash .claude/skills/dev-docs-updater/scripts/check-docs-sync.sh
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
DOCS="$ROOT/.claude/docs/letscareer"
README="$DOCS/README.md"
CLAUDEMD="$ROOT/CLAUDE.md"

if [ ! -d "$DOCS" ]; then
  echo "❌ 문서 경로 없음: $DOCS"
  exit 1
fi

issues=0

echo "## 1) 디스크엔 있지만 README 인덱스에 안 보이는 문서"
while IFS= read -r f; do
  rel="${f#"$ROOT"/}"
  base="$(basename "$f")"
  [ "$base" = "README.md" ] && continue   # 디렉토리별 README는 인덱스 항목이 아님
  if ! grep -qF "$base" "$README"; then
    echo "  - $rel  → README.md 트리에 추가 검토"
    issues=$((issues + 1))
  fi
done < <(find "$DOCS" -name "*.md")
[ "$issues" -eq 0 ] && echo "  ✓ 없음"

echo ""
echo "## 2) CLAUDE.md / README 가 가리키지만 디스크에 없는 docs 경로"
before=$issues
# `docs/...md` 또는 `letscareer/...md` 형태의 경로 토큰을 모아 존재 확인
grep -rhoE '(\.claude/)?docs/letscareer/[^ )`"]*\.md' "$CLAUDEMD" "$README" 2>/dev/null \
  | sed -E 's#^\.claude/##' | sort -u | while IFS= read -r p; do
    case "$p" in *"<"*) continue ;; esac   # <app>·<도메인> 등 placeholder 경로는 건너뜀
    [ -f "$ROOT/.claude/$p" ] || echo "  - $p  → 참조는 있는데 파일 없음 (오타/삭제?)"
  done
[ "$issues" -eq "$before" ] && echo "  ✓ 없음 (또는 위 목록 확인)"

echo ""
echo "## 3) 참고: 현재 도메인/패키지 개수 (CLAUDE.md·README 수치와 대조)"
echo "  web 도메인 문서: $(find "$DOCS/apps/web/domain" -maxdepth 1 -mindepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')개"
echo "  packages 문서:   $(find "$DOCS/packages" -maxdepth 1 -name '*.md' ! -name 'README.md' 2>/dev/null | wc -l | tr -d ' ')개"

echo ""
if [ "$issues" -eq 0 ]; then
  echo "✅ 1번 기준 드리프트 없음. 2·3번 목록도 비었는지 확인하면 동기화 완료."
else
  echo "⚠️  위 항목들을 README 인덱스·CLAUDE.md 트리와 맞춰라."
fi
