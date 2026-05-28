export type WrittenFeedbackStatus =
  | 'in_progress'
  | 'waiting'
  | 'confirmed'
  | 'expired';

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
}
