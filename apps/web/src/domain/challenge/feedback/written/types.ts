export type WrittenFeedbackStatus = 'pending' | 'submitted' | 'done';

export interface WrittenFeedbackMission {
  id: number;
  thumbnail: string;
  title: string;
  description?: string;
  status: WrittenFeedbackStatus;
  challengeType?: string;
  missionNumber: number;
  startDay: string; // 'YYYY-MM-DD'
  endDay: string; // 'YYYY-MM-DD'
  reservationStartDay?: string; // 'YYYY-MM-DD'
  reservationEndDay?: string; // 'YYYY-MM-DD'
}
