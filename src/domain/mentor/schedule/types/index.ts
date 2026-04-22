/** 라이브 피드백 세부 정보 (barType === 'live-feedback' 일 때 존재, 1:1 세션) */
export interface LiveFeedbackInfo {
  id: number;
  menteeName: string;
  /** "HH:mm" 24시간 형식 */
  startTime: string;
  /** "HH:mm" 24시간 형식 */
  endTime: string;
}

/** 캘린더 바 데이터 */
export interface PeriodBarData {
  /** 'written-feedback'(기본) 또는 'live-feedback' */
  barType?: 'written-feedback' | 'live-feedback';
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
