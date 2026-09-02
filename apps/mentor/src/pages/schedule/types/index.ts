/**
 * 1대1 라이브 멘토링 예약 세부 정보 (barType === 'live-mentoring' 일 때 존재).
 *
 * 챌린지 라이브 피드백(`LiveFeedbackInfo`)과 별개다 — 상품·결제 단위라 회차(th)도,
 * 출석 상태도 없다. 서버가 결제 완료 확정 건만 내리므로 상태 필드 자체를 두지 않는다.
 */
export interface LiveMentoringInfo {
  /** 신청 id. 예약 1건을 가리키는 서버 키다. */
  applicationId: number;
  menteeName: string;
  /** 멘토 상품명. 멘토당 상품이 하나라 모든 예약에서 같은 값이다. */
  productName: string;
  /** "HH:mm" 24시간 형식 */
  startTime: string;
  /** "HH:mm" 24시간 형식 */
  endTime: string;
  /** 진행시간(분). 30 또는 60. */
  durationMinutes: number;
  /** 신청 시 멘토에게 전달할 질문을 작성했는지. */
  questionWritten: boolean;
  /** 신청 시 전달 파일을 올렸는지. */
  attachmentSubmitted: boolean;
}

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
  /**
   * 경험정리(서면) 제출 상태 (PRESENT/UPDATED/LATE/ABSENT).
   * 목록 VO엔 없어 상세 N+1 병합으로 채운다. `LATE`|`ABSENT`(미제출)면 최우선 미진행 판정.
   */
  attendanceStatus?: 'PRESENT' | 'UPDATED' | 'LATE' | 'ABSENT';
}

/** 캘린더 바 데이터 */
export interface PeriodBarData {
  /**
   * 서면: 'written-mission-submit'(유저 제출기간) | 'written-review'(운영진 검수기간) | 'written-feedback'(피드백 제출기간)
   * 라이브: 'live-feedback-mentor-open' | 'live-feedback-mentee-open' | 'live-feedback-period' | 'live-feedback'
   * 1대1: 'live-mentoring'(결제 완료된 1대1 라이브 멘토링 예약 1건)
   */
  barType?:
    | 'written-mission-submit'
    | 'written-review'
    | 'written-feedback'
    | 'live-feedback-mentor-open'
    | 'live-feedback-mentee-open'
    | 'live-feedback-period'
    | 'live-feedback'
    | 'live-mentoring';
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
  /**
   * 서면 피드백 작성 대상 수 — 제출자 중 지각 제출(LATE) 제외.
   * "완료 N / 제출 N"의 분모는 이 값이어야 한다. `submittedCount` 를 쓰면 지각 제출자가
   * 영영 완료되지 않아 남은 건수가 0이 되지 않는다. 미주입 시 `submittedCount` 로 폴백.
   */
  feedbackTargetCount?: number;
  waitingCount: number;
  inProgressCount: number;
  completedCount: number;
  /** barType === 'live-feedback' 일 때만 사용 */
  liveFeedback?: LiveFeedbackInfo;
  /**
   * barType === 'live-mentoring' 일 때만 사용.
   * 1대1은 챌린지가 아니라 회차·제출 집계(`submittedCount` 등)가 모두 0이고,
   * 화면에 쓰는 값은 전부 여기에 있다.
   */
  liveMentoring?: LiveMentoringInfo;
}
