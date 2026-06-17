// 시간 슬롯 예약 상태
export type SlotStatus = 'expired' | 'unavailable' | 'booked' | 'available';

// 사용자가 선택한 예약 슬롯 (날짜 + 시작 시간)
export interface SelectedSlot {
  feedbackSlotId: number;
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:MM' (시작 시각)
  startDate: string; // ISO datetime
  endDate: string; // ISO datetime
}

// 라이브 피드백 미션 상태 코드
export type LiveFeedbackStatus =
  | 'prev'
  | 'reserved'
  | 'completed'
  | 'expired'
  | 'nonParticipation'
  | 'checkNeeded';

import type { ChallengeMentorInfo } from '@/api/feedback/feedbackSchema';
export type Mentor = ChallengeMentorInfo;

import type { FeedbackInfo } from '@/api/feedback/feedbackSchema';
export type { FeedbackInfo };

// 라이브 피드백 미션 데이터
export interface LiveFeedbackMission {
  missionId: number;
  missionTh: number;
  thumbnail: string;
  missionTitle: string;
  status: LiveFeedbackStatus;
  challengeType: string;
  missionStartDate: string; // 'YYYY-MM-DD'
  missionEndDate: string; // 'YYYY-MM-DD'
  feedbackStartDate: string; // 'YYYY-MM-DD'
  feedbackEndDate: string; // 'YYYY-MM-DD'
  attendanceResult: 'WAITING' | 'PASS' | 'WRONG' | 'FINAL_WRONG' | null;
  mentorInfo: Mentor | null;
  feedbackId: number | null;
  isMissionSubmitted: boolean;
}
