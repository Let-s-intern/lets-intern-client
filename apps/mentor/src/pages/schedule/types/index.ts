/** 라이브 피드백 세부 정보 (barType === 'live-feedback' 일 때 존재, 1:1 세션) */
export interface LiveFeedbackInfo {
  id: number;
  menteeName: string;
  /** "HH:mm" 24시간 형식 */
  startTime: string;
  /** "HH:mm" 24시간 형식 */
  endTime: string;
  /**
   * 화면 표기용 축약 상태(목/하위 호환). undefined = 대기 중.
   * 실데이터는 아래 raw 필드(rawStatus/mentor·menteeStatus)로 시간·출석을 함께 판정한다.
   */
  status?:
    | 'waiting'
    | 'in-progress'
    | 'completed'
    | 'cancelled'
    | 'mentor-absent'
    | 'mentee-absent'
    | 'mentor-late'
    | 'mentee-late';
  /** BE 원본 예약 상태 (RESERVED/COMPLETED/CANCELED). 상태/출석 정밀 판정용. */
  rawStatus?: 'RESERVED' | 'COMPLETED' | 'CANCELED';
  /** BE 멘토 출석 (PENDING/PRESENT/ABSENT). */
  mentorStatus?: 'PENDING' | 'PRESENT' | 'ABSENT';
  /** BE 멘티 출석 (PENDING/PRESENT/ABSENT). */
  menteeStatus?: 'PENDING' | 'PRESENT' | 'ABSENT';
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
  /** barType === 'live-feedback' 일 때만 사용 */
  liveFeedback?: LiveFeedbackInfo;
}
