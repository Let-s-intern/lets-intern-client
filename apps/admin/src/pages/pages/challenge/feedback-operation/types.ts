import type { ChallengeOptionType } from '@/api/challenge/challengeOptionSchema';
import type { Mission } from '@/schema';

export type SubTab = 'mentorMentee' | 'feedbackManage';

export interface Row {
  id: number | string;
  title?: string | null;
  th: number;
  /** 미션 대상 버전. 공통이면 빈 배열 */
  challengeVersionList: Mission['challengeVersionList'];
  startDate?: string | null;
  endDate?: string | null;
  challengeOptionCode?: string | null;
  challengeOptionTitle?: string | null;
  challengeOptionType?: ChallengeOptionType | null;
  submittedCount: number;
  totalCount: number;
  url: string;
}
