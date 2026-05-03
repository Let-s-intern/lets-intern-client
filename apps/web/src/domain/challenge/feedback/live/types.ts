// 시간 슬롯 예약 상태
export type SlotStatus = 'expired' | 'unavailable' | 'booked' | 'available';

// 미션 기간
export interface MissionPeriod {
  startDay: string; // 'YYYY-MM-DD'
  endDay: string; // 'YYYY-MM-DD'
}

// 사용자가 선택한 예약 슬롯 (날짜 + 시작 시간)
export interface SelectedSlot {
  date: string; // 'YYYY-MM-DD'
  time: string; // '09:00'
}

// 특정 날짜의 전체 시간 슬롯 상태 목록
export interface DaySchedule {
  date: string; // 'YYYY-MM-DD'
  slots: Record<string, SlotStatus>;
}

// 라이브 피드백 미션 상태 코드
export type LiveFeedbackStatus = 'prev' | 'reserved' | 'done';

export interface Mentor {
  id: number;
  company: string;
  name: string;
  thumbnailUrl?: string;
  description: string;
  stars?: number;
}

// 확정된 예약 정보
export interface Reservation {
  reservationId: string;
  mentor: Mentor;
  scheduledDate: string; // 'YYYY-MM-DD'
  scheduledTime: string; // '09:00'
  zepRoomNumber: number | null;
  zepRoomUrl: string | null;
}

// 라이브 피드백 미션 데이터
export interface LiveFeedbackMission {
  id: number;
  thumbnail: string;
  title: string;
  description?: string;
  status: LiveFeedbackStatus;
  categoryLabel?: string;
  startDay: string; // 'YYYY-MM-DD'
  endDay: string; // 'YYYY-MM-DD'
  reservationInfo: Reservation | null;
}

// 예약 가능한 시간대 (30분 단위)
export const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
] as const;
