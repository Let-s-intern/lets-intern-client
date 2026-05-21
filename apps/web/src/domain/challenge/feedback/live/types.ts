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

// 라이브 피드백 미션 상태 코드
export type LiveFeedbackStatus = 'prev' | 'reserved' | 'done' | 'expired';

import type { ChallengeMentorInfo } from '@/api/feedback/feedbackSchema';
export type Mentor = ChallengeMentorInfo;

// 확정된 예약 정보 (GET /feedback/{feedbackId} 응답 기준)
export interface Reservation {
  feedbackId: number;
  startDate: string; // ISO datetime
  endDate: string; // ISO datetime
  meetingUrl: string | null;
}

// 라이브 피드백 미션 데이터
export interface LiveFeedbackMission {
  id: number;
  thumbnail: string;
  title: string;
  status: LiveFeedbackStatus;
  challengeType: string;
  missionNumber: number;
  startDay: string; // 'YYYY-MM-DD' — missionStartDate (예약 가능 기간 시작)
  endDay: string; // 'YYYY-MM-DD' — missionEndDate (예약 가능 기간 종료)
  feedbackStartDay: string; // 'YYYY-MM-DD' — missionEndDate (피드백 진행 기간 시작)
  feedbackEndDay: string; // 'YYYY-MM-DD' — missionEndDate + 3일 (피드백 진행 기간 종료)
  assignedMentor: Mentor | null;
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
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
] as const;
