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

# ── 1.2 커밋 메타 + 변경 파일 수집 ───────────────────────────────────────
# 필드 구분자: ASCII Unit Separator(0x1F), 레코드 구분자: ASCII Record Separator(0x1E).
# 커밋 메시지에 '|' 가 흔히 들어가므로 출력 가능한 구분자를 피한다.
FS=$'\x1f'  # 필드 구분: hash<FS>date<FS>author<FS>subject
RS=$'\x1e'  # 레코드(커밋) 구분
RAW_LOG="$(git log "${BASE}..HEAD" --no-merges \
  --date=short \
  --pretty=format:"%h${FS}%ad${FS}%an${FS}%s${RS}")"

# period.from(최초 커밋 날짜) / period.to(최종 커밋 날짜)
#   git log 는 최신→과거 순. to = 첫 줄(최신), from = 마지막 줄(최초).
PERIOD_TO="$(git log "${BASE}..HEAD" --no-merges --date=short --pretty=format:'%ad' | head -n 1)"
PERIOD_FROM="$(git log "${BASE}..HEAD" --no-merges --date=short --pretty=format:'%ad' | tail -n 1)"

# total_commits — 분류 대상(머지 제외) 기준
TOTAL_COMMITS="$(git log "${BASE}..HEAD" --no-merges --pretty=format:'%h' | grep -c '' || true)"

# authors — 저자 dedupe(등장 순서 유지). 다수면 전체 표시.
AUTHORS_RAW="$(git log "${BASE}..HEAD" --no-merges --pretty=format:'%an')"

# changed_files — git diff main..HEAD 변경 파일 경로(dedupe).
#   주의: --stat 은 긴 경로 truncate(...) 와 rename({a => b}) 표기로 경로를 변형하므로,
#   동일 정보를 변형 없이 주는 --name-only 로 정확한 파일 경로를 추출한다.
CHANGED_FILES_RAW="$(git diff "${BASE}..HEAD" --name-only)"

# ── 1.3 카테고리 분류 (PRD §8 규칙, 한/영 키워드) ─────────────────────────
# 우선순위: security > fix > feat > refactor > docs > chore > 기타
#   (보안이 다른 키워드에 가려지지 않도록 가장 먼저 검사)
# 키워드(PRD §8):
#   feat     : feat, feature, add, implement, 추가, 구현
#   fix      : fix, bug, hotfix, error, 수정, 버그, 오류
#   refactor : refactor, cleanup, clean, 리팩터링, 정리
#   security : security, patch, vulnerability, cve, 보안, 취약
#   docs     : docs, doc, readme, 문서
#   chore    : chore, ci, build, deps
classify() {
  # subject 를 소문자화(영문만 영향, 한글은 불변)하여 부분 문자열 매칭.
  local s
  s="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')"

  case "$s" in
    *security*|*patch*|*vulnerability*|*cve*|*보안*|*취약*) echo "security"; return ;;
  esac
  case "$s" in
    *fix*|*bug*|*hotfix*|*error*|*수정*|*버그*|*오류*) echo "fix"; return ;;
  esac
  case "$s" in
    *feat*|*feature*|*add*|*implement*|*추가*|*구현*) echo "feat"; return ;;
  esac
  case "$s" in
    *refactor*|*cleanup*|*clean*|*리팩터링*|*정리*) echo "refactor"; return ;;
  esac
  case "$s" in
    *docs*|*doc*|*readme*|*문서*) echo "docs"; return ;;
  esac
  case "$s" in
    *chore*|*ci*|*build*|*deps*) echo "chore"; return ;;
  esac
  echo "기타"
}

# ── 1.4 JSON 스키마 조립 + stdout 출력 (후속 Push 입력 계약) ──────────────
# 안전한 UTF-8 + JSON 이스케이프를 위해 모든 문자열은 jq 로 인코딩한다.
# 전략: 커밋별 { hash,date,author,message,category } 객체를 jq 로 한 줄씩 만들어
#       모은 뒤(슬러프), 최상위 객체를 jq -n 으로 조립.

# 커밋 객체 NDJSON 누적. category_counts 는 아래에서 commits JSON 으로부터 jq 집계.
# (macOS 기본 bash 3.2 는 'declare -A' 연관배열 미지원 → jq group_by 로 대체)
COMMITS_NDJSON=""

while IFS= read -r -d "$RS" record; do
  # 레코드 사이의 개행 제거(마지막 %s 뒤 RS 앞 공백 방지)
  record="${record#$'\n'}"
  [ -z "$record" ] && continue
  hash="${record%%${FS}*}"; rest="${record#*${FS}}"
  date="${rest%%${FS}*}";    rest="${rest#*${FS}}"
  author="${rest%%${FS}*}";  message="${rest#*${FS}}"

  category="$(classify "$message")"

  obj="$(jq -nc \
    --arg hash "$hash" \
    --arg date "$date" \
    --arg author "$author" \
    --arg message "$message" \
    --arg category "$category" \
    '{hash:$hash, date:$date, author:$author, message:$message, category:$category}')"
  COMMITS_NDJSON+="$obj"$'\n'
done <<< "$RAW_LOG$RS"

# authors[] — 등장 순서 유지 dedupe → JSON 배열
AUTHORS_JSON="$(printf '%s\n' "$AUTHORS_RAW" \
  | awk 'NF && !seen[$0]++' \
  | jq -R . | jq -sc .)"

# changed_files[] — dedupe(정렬) → JSON 배열
CHANGED_FILES_JSON="$(printf '%s\n' "$CHANGED_FILES_RAW" \
  | awk 'NF && !seen[$0]++' \
  | jq -R . | jq -sc .)"

# commits[] — NDJSON 슬러프(빈 줄 무시)
COMMITS_JSON="$(printf '%s' "$COMMITS_NDJSON" | jq -sc '.')"

# category_counts{} — commits 의 category 빈도 집계. 0 인 카테고리는 미포함.
#   정의 순서(feat,fix,refactor,security,docs,chore,기타)로 키 정렬해 안정 출력.
CAT_COUNTS_JSON="$(printf '%s' "$COMMITS_JSON" | jq -c '
  ["feat","fix","refactor","security","docs","chore","기타"] as $order
  | (map(.category) | group_by(.) | map({key: .[0], value: length}) | from_entries) as $counts
  | reduce $order[] as $k ({}; if $counts[$k] then . + {($k): $counts[$k]} else . end)
')"

# 최상위 객체 조립 → stdout
jq -n \
  --arg branch "$BRANCH" \
  --arg base "$BASE" \
  --arg from "$PERIOD_FROM" \
  --arg to "$PERIOD_TO" \
  --argjson authors "$AUTHORS_JSON" \
  --argjson total_commits "$TOTAL_COMMITS" \
  --argjson category_counts "$CAT_COUNTS_JSON" \
  --argjson commits "$COMMITS_JSON" \
  --argjson changed_files "$CHANGED_FILES_JSON" \
  '{
    branch: $branch,
    base: $base,
    period: { from: $from, to: $to },
    authors: $authors,
    total_commits: $total_commits,
    category_counts: $category_counts,
    commits: $commits,
    changed_files: $changed_files
  }'
