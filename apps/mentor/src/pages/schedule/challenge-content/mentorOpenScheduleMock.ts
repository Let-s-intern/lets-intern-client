/**
 * 멘토 라이브 피드백 슬롯 그리드 타입 정의.
 *
 * 이전에는 챌린지별 mock 슬롯/신청 데이터를 함께 export 했으나,
 * BE `/feedback/mentor/slot` 연결(Push1) 이후 mock 데이터는 제거되었다.
 * 타입은 `LiveAvailabilityContent` 와 `slotConverter` 가 여전히 사용한다.
 *
 * 파일명은 호환성을 위해 유지하지만, 더 이상 mock 모듈이 아니다.
 */

export interface MentorOpenSlot {
  /** YYYY-MM-DD */
  date: string;
  /** "HH:mm" */
  time: string;
}

export interface AppliedBooking {
  /** YYYY-MM-DD */
  date: string;
  /** "HH:mm" */
  time: string;
  menteeName: string;
}
