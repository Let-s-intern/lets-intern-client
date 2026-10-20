import type { MentorReviewType } from '@/api/mentor/mentorSchema';

/** 서버 MentorReviewType 의 desc 와 같다 */
export const MENTOR_REVIEW_TYPE_LABEL: Record<MentorReviewType, string> = {
  LIVE: 'LIVE 클래스',
  FEEDBACK: 'LIVE 피드백',
  LIVE_MENTORING: '1:1 LIVE 멘토링',
  CHALLENGE: '챌린지',
};
