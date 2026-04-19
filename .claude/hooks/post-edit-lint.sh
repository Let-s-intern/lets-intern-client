#!/bin/bash
# PostToolUse Hook: ESLint + Prettier 자동 실행
# Claude가 Edit/Write로 파일 수정 시 자동 실행 (jq 방식 - 공식 문서 권장)

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# 파일 경로 없으면 종료
[ -z "$FILE_PATH" ] && exit 0

# 파일 존재 여부 확인
[ ! -f "$FILE_PATH" ] && exit 0

# JS/TS 파일만 처리
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx) ;;
  *) exit 0 ;;
esac

# ESLint 자동 수정
npx eslint --fix "$FILE_PATH" 2>/dev/null || true

# Prettier 포맷팅
npx prettier --write "$FILE_PATH" 2>/dev/null || true
