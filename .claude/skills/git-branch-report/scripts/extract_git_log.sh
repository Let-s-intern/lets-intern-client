#!/usr/bin/env bash
#
# extract_git_log.sh — 현재 체크아웃된 브랜치의 main 대비 작업 내역을 추출해
#                      표준 JSON으로 stdout에 출력한다. (git-branch-report 스킬 Push 1)
#
# 사용법:
#   ./extract_git_log.sh [repo_path]      # repo_path 기본값: 현재 디렉토리(.)
#
# 출력: stdout 으로 JSON 한 덩어리만 출력. (디렉토리/파일 생성은 본 스크립트 책임 아님)
# 진단 메시지는 모두 stderr 로 출력하여 stdout JSON 을 오염시키지 않는다.
#
# 의존성: git, jq (UTF-8 한글 + JSON 이스케이프 안전성을 위해 jq 로 조립)
#
# ── 1.1 검증 시나리오 (수동 케이스, 1.1.T1) ──────────────────────────────
#   (A) main 위에서 실행          → "현재 브랜치가 main" 경고 후 종료 (exit 0)
#   (B) main..HEAD 커밋 0개        → "비교할 커밋 없음" 안내 + git log 직접 확인 유도 후 종료 (exit 0)
#   (C) 정상 feature 브랜치        → 유효 JSON 출력 (exit 0)
#   (D) main 브랜치 미존재          → base 확인 유도 메시지 후 종료 (exit 0)
#   ※ 모든 엣지케이스는 스택트레이스 없이 명확한 안내 메시지 + 비치명적 종료.

set -euo pipefail

BASE="main"

REPO_PATH="${1:-.}"

log() { printf '%s\n' "$*" >&2; }

# repo_path 로 이동 (없으면 안내 후 종료)
if [ ! -d "$REPO_PATH" ]; then
  log "[extract_git_log] 경로를 찾을 수 없습니다: $REPO_PATH"
  log "  → 올바른 git 저장소 경로를 인자로 전달하세요. 예: ./extract_git_log.sh /path/to/repo"
  exit 0
fi
cd "$REPO_PATH"

# git 저장소인지 확인
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  log "[extract_git_log] git 저장소가 아닙니다: $(pwd)"
  log "  → git 저장소 안에서 실행하거나 저장소 경로를 인자로 전달하세요."
  exit 0
fi

# 현재 브랜치 자동 감지
BRANCH="$(git branch --show-current)"
if [ -z "$BRANCH" ]; then
  log "[extract_git_log] 현재 브랜치를 감지할 수 없습니다 (detached HEAD 상태일 수 있음)."
  log "  → 'git checkout <branch>' 로 작업 브랜치에 체크아웃한 뒤 다시 실행하세요."
  exit 0
fi

# base(main) 브랜치 존재 확인 — 미존재 시 base 확인 유도
if ! git rev-parse --verify --quiet "$BASE" >/dev/null 2>&1; then
  log "[extract_git_log] base 브랜치 '$BASE' 를 찾을 수 없습니다."
  log "  → 이 스킬은 base 를 'main' 으로 가정합니다. 로컬에 main 이 없으면:"
  log "      git fetch origin main:main"
  log "    또는 다른 base(develop/master 등)를 사용 중이라면 팀 컨벤션을 확인하세요."
  exit 0
fi

# 엣지: 현재 브랜치가 base(main) 자신 / master 인 경우
if [ "$BRANCH" = "$BASE" ] || [ "$BRANCH" = "master" ]; then
  log "[extract_git_log] 현재 브랜치가 '$BRANCH' 입니다 (base 브랜치)."
  log "  → 보고서는 feature 브랜치에서 'main 대비 작업'을 추출합니다."
  log "    작업 브랜치로 체크아웃한 뒤 다시 실행하세요. 예: git checkout <feature-branch>"
  exit 0
fi

# 엣지: main..HEAD 커밋 0개
COMMIT_COUNT="$(git rev-list --count "${BASE}..HEAD" 2>/dev/null || echo 0)"
if [ "$COMMIT_COUNT" -eq 0 ]; then
  log "[extract_git_log] '$BASE' 대비 '$BRANCH' 에 비교할 커밋이 없습니다 (0개)."
  log "  → 아직 커밋이 없거나 이미 병합된 브랜치일 수 있습니다."
  log "    직접 확인: git log ${BASE}..HEAD --oneline"
  exit 0
fi
