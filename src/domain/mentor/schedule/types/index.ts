/** 라이브 피드백 세부 정보 (barType === 'live-feedback' 일 때 존재, 1:1 세션) */
export interface LiveFeedbackInfo {
  id: number;
  menteeName: string;
  /** "HH:mm" 24시간 형식 */
  startTime: string;
  /** "HH:mm" 24시간 형식 */
  endTime: string;
  /** undefined = 대기 중 */
  status?: 'waiting' | 'completed';
}

/** 캘린더 바 데이터 */
export interface PeriodBarData {
  /** 'written-feedback'(기본) | 'live-feedback-mentor-open'(멘토 일정 오픈) | 'live-feedback-mentee-open'(멘티 신청) | 'live-feedback-period'(상단 기간 바) | 'live-feedback'(하단 시간 블록) */
  barType?: 'written-feedback' | 'live-feedback-mentor-open' | 'live-feedback-mentee-open' | 'live-feedback-period' | 'live-feedback';
  challengeId: number;
  missionId: number;
  challengeTitle: string;
  th: number;
  startDate: string;
  endDate: string;
  feedbackStartDate: string;
  feedbackDeadline: string;
  submittedCount: number;
  notSubmittedCount: number;
  waitingCount: number;
  inProgressCount: number;
  completedCount: number;
  colorIndex?: number;
  /** barType === 'live-feedback' 일 때만 사용 */
  liveFeedback?: LiveFeedbackInfo;
}
