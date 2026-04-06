#!/bin/bash
# Stop Hook: task-runner 실행 중 Claude 중단 방지
# .claude/.task-running 파일이 있을 때만 활성화
# todo/ 에 미완료 작업이 있으면 Claude가 계속 작업하도록 강제

INPUT=$(cat)

# task-runner가 실행 중일 때만 작동
[ ! -f ".claude/.task-running" ] && exit 0

# 무한 루프 방지 (stop_hook_active가 true면 종료 허용)
if [ "$(echo "$INPUT" | jq -r '.stop_hook_active')" = "true" ]; then
  exit 0
fi

# todo/ 에서 미완료 항목([ ])이 있는 파일 탐색
REMAINING=$(ls todo/*.md 2>/dev/null | xargs -I{} sh -c 'grep -l "\[ \]" {} 2>/dev/null' 2>/dev/null | head -1)

if [ -n "$REMAINING" ]; then
  # 남은 작업 개수 파악
  COUNT=$(grep -c "\[ \]" "$REMAINING" 2>/dev/null || echo "?")
  echo "{\"decision\": \"block\", \"reason\": \"$REMAINING 에 미완료 작업 ${COUNT}개 남음. 모든 [ ] 항목을 [x] 로 완료하기 전까지 계속 실행하세요. 사용자 확인 없이 자율적으로 진행합니다.\"}"
fi

exit 0
