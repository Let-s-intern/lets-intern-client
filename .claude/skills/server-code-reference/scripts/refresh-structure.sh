#!/usr/bin/env bash
# 서버 구조가 바뀌었을 때 server-structure.md 의 핵심 정보(도메인 목록 + API 경로 매핑)를
# 재생성해 콘솔에 출력한다. 출력 결과로 references/server-structure.md 의 해당 표를 갱신한다.
#
# 사용: bash .claude/skills/server-code-reference/scripts/refresh-structure.sh
set -euo pipefail

# 클라이언트 레포 루트를 기준으로 서버를 형제 폴더에서 찾는다 (상대경로).
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
SERVER="$REPO_ROOT/../lets-career-server"
SRC="$SERVER/src/main/java/org/letscareer/letscareer"

if [ ! -d "$SRC" ]; then
  echo "❌ 서버 소스를 찾을 수 없습니다: $SRC"
  echo "   서버 레포를 형제 폴더(../lets-career-server)로 클론했는지 확인하세요."
  exit 1
fi

echo "## 도메인 목록 ($(find "$SRC/domain" -maxdepth 1 -mindepth 1 -type d | wc -l | tr -d ' ')개)"
echo ""
ls "$SRC/domain" | sort | tr '\n' ' '
echo ""
echo ""
echo "## @RequestMapping 베이스 경로 (도메인 ↔ API 매핑 갱신용)"
echo ""
grep -rh '@RequestMapping' "$SRC/domain" --include='*.java' \
  | grep -oE '"/[^"]*"' | tr -d '"' | sort -u

echo ""
echo "## 컨트롤러 파일 ($(find "$SRC/domain" -path '*/controller/*.java' | wc -l | tr -d ' ')개)"
echo ""
echo "→ 위 출력으로 references/server-structure.md 의 도메인 목록·매핑 표를 갱신하세요."
