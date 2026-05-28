#!/usr/bin/env bash
#
# report.sh — git-branch-report 전체 파이프라인 오케스트레이터.
#             extract → (capture) → build → pdf 를 올바른 순서로 한 번에 실행한다.
#
# 사용법:
#   ./report.sh --content <content.json> [--git <git.json>] [--repo <path>] [--no-pdf]
#
#   --content  Claude 가 작성한 content JSON (필수). 스키마: ../templates/_index.md
#   --git      extract_git_log.sh 결과 JSON. 생략 시 현재 저장소에서 자동 추출.
#   --repo     추출 대상 저장소 경로(기본: 현재 디렉토리). --git 생략 시에만 사용.
#   --no-pdf   PDF 변환 건너뛰기(HTML 만).
#
# 핵심: 화면 캡처는 build 보다 먼저 와야 한다(build 가 PNG 존재를 보고 삽입/생략 결정).
#       그래서 build --print-dir 로 출력 폴더를 먼저 확정한 뒤 capture → build → pdf 순으로 실행.
#
# 종료 코드: 0 = HTML 생성 성공(PDF/캡처는 환경에 따라 건너뛸 수 있음). 1 = 치명적 오류.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
log() { printf '%s\n' "$*" >&2; }

CONTENT="" ; GIT_JSON="" ; REPO="." ; DO_PDF=1
while [ $# -gt 0 ]; do
  case "$1" in
    --content) CONTENT="$2"; shift 2 ;;
    --git)     GIT_JSON="$2"; shift 2 ;;
    --repo)    REPO="$2"; shift 2 ;;
    --no-pdf)  DO_PDF=0; shift ;;
    *) log "[report] 알 수 없는 인자: $1"; exit 1 ;;
  esac
done

if [ -z "$CONTENT" ] || [ ! -f "$CONTENT" ]; then
  log "[report] --content <content.json> 가 필요합니다 (스키마: templates/_index.md)."
  exit 1
fi

# 1) git 데이터 확보
CLEANUP=""
if [ -z "$GIT_JSON" ]; then
  GIT_JSON="$(mktemp -t gbr-git.XXXXXX.json)"
  CLEANUP="$GIT_JSON"
  bash "$SCRIPT_DIR/extract_git_log.sh" "$REPO" > "$GIT_JSON"
  if [ ! -s "$GIT_JSON" ]; then
    log "[report] git 로그 추출 결과가 비어 있습니다 (위 안내 참고). 중단합니다."
    rm -f "$CLEANUP"
    exit 1
  fi
fi

# 2) 출력 디렉토리 확정 (렌더 없이 폴더만)
OUT_JSON="$(node "$SCRIPT_DIR/build_report.js" --git "$GIT_JSON" --content "$CONTENT" --print-dir)" || {
  log "[report] 출력 디렉토리 확정 실패."; [ -n "$CLEANUP" ] && rm -f "$CLEANUP"; exit 1;
}
OUT_DIR="$(printf '%s' "$OUT_JSON" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).outDir))')"
TYPE="$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).type)' "$CONTENT")"

# 3) 화면 캡처 (feature + screens 있을 때만). 실패해도 계속 진행(PRD §9).
HAS_SCREENS="$(node -e 'const c=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));process.stdout.write(String((c.screens||[]).length))' "$CONTENT")"
if [ "$TYPE" = "feature" ] && [ "$HAS_SCREENS" -gt 0 ]; then
  node "$SCRIPT_DIR/capture_screens.js" --content "$CONTENT" --out-dir "$OUT_DIR/screens" || \
    log "[report] 화면 캡처를 일부/전부 건너뛰었습니다(코드 $?). 텍스트로 계속 진행합니다."
fi

# 4) HTML 합성
node "$SCRIPT_DIR/build_report.js" --git "$GIT_JSON" --content "$CONTENT" --out "$OUT_DIR" >/dev/null || {
  log "[report] HTML 생성 실패."; [ -n "$CLEANUP" ] && rm -f "$CLEANUP"; exit 1;
}

# 5) PDF 변환 (선택). Playwright(패키지 또는 브라우저)가 없으면 HTML 까지만 만들고 깔끔히 종료.
#    exit 3 = Playwright 미가용으로 의도된 건너뜀(정상). 그 외 비0 = 실제 변환 오류.
if [ "$DO_PDF" -eq 1 ]; then
  node "$SCRIPT_DIR/render_to_pdf.js" --html "$OUT_DIR/report.html"
  rc=$?  # 명령 직후 즉시 캡처 ('!'/파이프 뒤 $? 함정 회피). set -e 미사용이라 안전.
  if [ "$rc" -eq 3 ]; then
    log "[report] Playwright 가 없어 PDF 는 생략하고 HTML 까지만 생성했습니다 (정상)."
  elif [ "$rc" -ne 0 ]; then
    log "[report] PDF 변환 중 오류(코드 $rc). HTML 은 정상 생성되었습니다."
  fi
fi

[ -n "$CLEANUP" ] && rm -f "$CLEANUP"

log ""
log "[report] 완료 — 출력: $OUT_DIR"
for f in report.html report.pdf; do
  [ -f "$OUT_DIR/$f" ] && log "  - $OUT_DIR/$f"
done
printf '%s\n' "$OUT_DIR"
