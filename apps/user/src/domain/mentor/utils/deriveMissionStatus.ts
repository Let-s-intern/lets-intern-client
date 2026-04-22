export type MissionStatus = 'completed' | 'inProgress' | 'waiting' | 'none';

/**
 * 제출 여부, 완료 여부, 피드백 시작 여부를 기반으로 미션 상태를 파생합니다.
 */
export function deriveMissionStatus(
  submitted: number,
  completed: number,
  feedbackStarted: number,
): MissionStatus {
  const hasSubmission = submitted > 0;
  const isAllComplete = hasSubmission && completed >= submitted;

  if (!hasSubmission) return 'none';
  if (isAllComplete) return 'completed';
  if (feedbackStarted > 0) return 'inProgress';
  return 'waiting';
}
