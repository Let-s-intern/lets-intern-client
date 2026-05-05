export type WrittenFeedbackStatus = 'pending' | 'submitted' | 'done';

export interface WrittenFeedbackMission {
  id: number;
  thumbnail: string;
  title: string;
  description?: string;
  status: WrittenFeedbackStatus;
  categoryLabel?: string;
  startDay: string; // 'YYYY-MM-DD'
  endDay: string; // 'YYYY-MM-DD'
}
