#!/usr/bin/env bash
# ============================================================
# Vercel Ignored Build Step — 빌드 스킵 여부 판정 스크립트
# ============================================================
#
# 동작:
#   exit 0 → 빌드 스킵 (Vercel이 이 배포를 그냥 넘김)
#   exit 1 → 빌드 진행 (그다음 Vercel 자동 Skip Unaffected가
#                       워크스페이스 의존 그래프로 한 번 더 컷)
#
# 스킵 조건 (둘 중 하나라도 *아닌* 파일이 변경됐으면 빌드):
#   1. 어디든 *.md 파일
#   2. dev 도구 폴더: .claude/, .cursor/, .gemini/, .github/, .vscode/
#
# Vercel UI 적용 (web/admin/mentor 3개 프로젝트 각각):
#   Settings → Git → Ignored Build Step → "Run my own command"
#     bash "$(git rev-parse --show-toplevel)/scripts/vercel-skip-build.sh"
#
# 주의: `bash scripts/vercel-skip-build.sh` (상대 경로) 는 IBS의 cwd가
# 프로젝트 Root Directory(`apps/<name>/`)이라 파일을 못 찾는다 (exit 127).
# `$(git rev-parse --show-toplevel)` 로 repo 루트 절대 경로를 동적 탐지.
#
# 상세 설계·함정·검증 방법:
#   .claude/docs/letscareer/pnpm전환 메모 폴더/07-build-filter.md
# ============================================================

# Vercel이 어떤 cwd에서 호출하든(repo 루트일 수도, 프로젝트 Root
# Directory일 수도) git 루트로 이동시켜 경로 가정을 내제화한다.
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

# [가드] 첫 커밋이라 부모(HEAD^)가 없으면 빌드(exit 1).
# 이게 없으면 아래 git diff 가 stderr 에러로 실패하는데, $(...)
# 내부 실패는 외부 test -z 평가에 전파되지 않아 빈 문자열로 보고
# 잘못 SKIP으로 떨어진다. 신규 프로젝트 첫 푸시 보호용.
if ! git rev-parse HEAD^ >/dev/null 2>&1; then
  echo "[skip-build] BUILD - no parent commit (first-commit guard)"
  exit 1
fi

# [본 로직]
# `core.quotepath=off` 필수 — 이 옵션이 없으면 git은 비-ASCII 경로를
# `"\354\240..."` 같은 큰따옴표 이스케이프 형식으로 출력한다.
# 그러면 라인이 `"` 로 시작하므로 아래 `^\.(claude|...)/` 앵커가
# 매칭에 실패해 dev 폴더 변경이 잘못 BUILD로 떨어진다.
# 본 레포는 한글 폴더(`pnpm전환 메모 폴더/`)를 실제로 쓰므로 필수.
CHANGED=$(git -c core.quotepath=off diff --name-only HEAD^ HEAD)

# grep -v -E 로 "스킵 가능한" 라인을 모두 제거. 남은 게 있으면
# 빌드해야 할 변경이라는 뜻. `grep .` 로 빈 줄 제거.
TRIGGERS=$(printf '%s\n' "$CHANGED" \
  | grep -v -E '\.md$|^\.(claude|cursor|gemini|github|vscode)/' \
  | grep . || true)

# [로깅] Vercel 빌드 로그에 노출 — 다음 디버그 시 "왜 빌드?" 답이 됨.
echo "[skip-build] Changed files ($(printf '%s\n' "$CHANGED" | grep -c .) total):"
printf '%s\n' "$CHANGED" | sed 's/^/  /'

if [ -z "$TRIGGERS" ]; then
  echo "[skip-build] SKIP - all changes limited to *.md or dev folders"
  exit 0
fi

echo "[skip-build] BUILD - these files passed the filter and triggered the build:"
printf '%s\n' "$TRIGGERS" | sed 's/^/  /'
exit 1
