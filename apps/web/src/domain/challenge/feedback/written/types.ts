export type WrittenFeedbackStatus =
  | 'in_progress'
  | 'waiting'
  | 'confirmed'
  | 'expired';

export interface WrittenFeedbackMission {
  id: number;
  missionId: number;
  thumbnail: string;
  title: string;
  description?: string;
  status: WrittenFeedbackStatus;
  challengeType?: string;
  missionNumber: number;
  startDay: string; // 'YYYY-MM-DDTHH:mm:ss'
  endDay: string; // 'YYYY-MM-DDTHH:mm:ss'
}
