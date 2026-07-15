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
  feedbackPeriodStart: string; // 'YYYY-MM-DD' (missionEndDate + 1일)
  feedbackPeriodEnd: string; // 'YYYY-MM-DD' (missionEndDate + 3일)
}
