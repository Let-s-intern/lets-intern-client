// 시간 슬롯 예약 상태
export type SlotStatus = 'expired' | 'unavailable' | 'booked' | 'available';

// 미션 기간
export interface MissionPeriod {
  startDay: string; // 'YYYY-MM-DD'
  endDay: string; // 'YYYY-MM-DD'
}

// 사용자가 선택한 예약 슬롯 (날짜 + 시작 시간)
export interface SelectedSlot {
  feedbackSlotId: number;
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:MM' (시작 시각)
  startDate: string; // ISO datetime
  endDate: string; // ISO datetime
}

// 라이브 피드백 미션 상태 코드
export type LiveFeedbackStatus = 'prev' | 'reserved' | 'completed' | 'expired';

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
  missionTh: number;
  thumbnail: string;
  missionTitle: string;
  status: LiveFeedbackStatus;
  challengeType: string;
  missionStartDate: string; // 'YYYY-MM-DD'
  missionEndDate: string; // 'YYYY-MM-DD'
  feedbackEndDate: string; // 'YYYY-MM-DD' — missionEndDate + 3일
  mentorInfo: Mentor | null;
  reservationInfo: Reservation | null;
}
