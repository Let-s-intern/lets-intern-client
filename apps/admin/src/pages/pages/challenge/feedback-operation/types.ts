export type SubTab = 'mentorMentee' | 'feedbackManage';

export interface Row {
  id: number | string;
  title?: string | null;
  th: number;
  startDate?: string | null;
  endDate?: string | null;
  challengeOptionCode?: string | null;
  challengeOptionTitle?: string | null;
  submittedCount: number;
  totalCount: number;
  url: string;
}
