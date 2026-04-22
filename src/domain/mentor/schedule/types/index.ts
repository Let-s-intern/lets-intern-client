/** 라이브 피드백 세부 정보 (barType === 'live-feedback' 일 때 존재, 1:1 세션) */
export interface LiveFeedbackInfo {
  id: number;
  menteeName: string;
  /** "HH:mm" 24시간 형식 */
  startTime: string;
  /** "HH:mm" 24시간 형식 */
  endTime: string;
  /** undefined = 대기 중 (기본) */
  status?:
    | 'waiting'
    | 'in-progress'
    | 'completed'
    | 'mentor-absent'
    | 'mentee-absent'
    | 'mentor-late'
    | 'mentee-late';
}

/** 캘린더 바 데이터 */
export interface PeriodBarData {
  /**
   * 서면: 'written-mission-submit'(유저 제출기간) | 'written-review'(운영진 검수기간) | 'written-feedback'(피드백 제출기간)
   * 라이브: 'live-feedback-mentor-open' | 'live-feedback-mentee-open' | 'live-feedback-period' | 'live-feedback'
   */
  barType?:
    | 'written-mission-submit'
    | 'written-review'
    | 'written-feedback'
    | 'live-feedback-mentor-open'
    | 'live-feedback-mentee-open'
    | 'live-feedback-period'
    | 'live-feedback';
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
